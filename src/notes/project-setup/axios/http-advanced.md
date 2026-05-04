# 高级可配置封装

相较于「一般封装」和「双 Token 封装」，这个方案做了以下升级：

- **可配置化**：通过 `HttpClientOptions` 将各种行为（token 字段名、刷新触发码、业务成功判定等）全部抽为配置项
- **Token 刷新管理器**：用 Promise 复用解决并发请求时重复刷新的问题
- **业务层错误处理**：支持自定义业务成功/失败判定，不只看 HTTP 状态码

#### 1、TokenRefreshManager — 并发刷新去重

核心思路：正在刷新时，后续请求复用同一个 Promise，而不是各发各的刷新请求。

```ts
export class TokenRefreshManager {
  private refreshingPromise: Promise<string> | null = null;

  async runRefresh(task: () => Promise<string>): Promise<string> {
    if (!this.refreshingPromise) {
      this.refreshingPromise = (async () => {
        try {
          return await task();
        } finally {
          // 无论成功失败，清除标记，下次可以重新刷新
          this.refreshingPromise = null;
        }
      })();
    }

    return this.refreshingPromise;
  }
}
```

#### 2、配置类型定义

将所有可定制行为收敛到一个 options 对象中：

```ts
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestRetryState {
  _retry?: boolean;
}

export interface HttpClientOptions {
  /** 透传给 axios.create 的初始化配置 */
  axiosConfig: AxiosRequestConfig;

  /** access token 注入到请求头时使用的字段名，默认 Authorization */
  accessTokenHeaderName?: string;

  /** access token 的前缀，默认 Bearer */
  accessTokenPrefix?: string;

  /** 触发刷新流程的 HTTP 状态码，默认 401 */
  unauthorizedStatusCode?: number;

  /** 业务状态码中，用于识别鉴权失败的 code 列表 */
  authFailureCodes?: number[];

  /** 不触发 refresh token 流程的请求 URL 列表 */
  skipRefreshUrls?: string[];

  /** 获取当前 access token */
  getAccessToken: () => string | null | Promise<string | null>;

  /** 自定义刷新逻辑，必须返回最终要用于重试请求的 access token */
  refreshAccessToken?: () => string | Promise<string>;

  /** 登录失效后的统一收尾回调 */
  onAuthFailure?: (error?: unknown) => void | Promise<void>;

  /** 自定义业务响应是否成功的判定逻辑 */
  isBusinessSuccess?: (response: AxiosResponse<unknown>) => boolean;

  /** 将业务失败响应映射为错误对象 */
  mapBusinessError?: (response: AxiosResponse<unknown>) => Error;

  /** 通过业务响应内容判断是否需要刷新 token */
  shouldRefreshByResponseData?: (response: AxiosResponse<unknown>) => boolean;

  /** 判断刷新 token 请求本身是否已经失败到需要退出登录 */
  isRefreshFailure?: (error: unknown) => boolean;
}
```

#### 3、完整 HTTP 客户端

```ts
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios, { AxiosError } from "axios";
import { TokenRefreshManager } from "./token-refresh-manager";
import type {
  HttpClientOptions,
  RequestRetryState,
  ResolvedHttpClientOptions,
} from "./types";

type HttpClientError<T = unknown> = Error & {
  status?: number;
  data?: T;
  response?: AxiosResponse<T>;
};

const HTTP_CLIENT_MESSAGES = {
  requestFailed: "请求失败",
  businessRequestFailed: "业务请求失败",
  refreshDisabled: "未启用 refresh token 逻辑",
  refreshTokenExpired: "refreshToken 已失效，登录过期",
  loginExpired: "登录已失效，请重新登录",
};

const createHttpClientError = <T = unknown>(
  message: string,
  options?: {
    status?: number;
    data?: T;
    response?: AxiosResponse<T>;
  },
): HttpClientError<T> => {
  const error = new Error(message) as HttpClientError<T>;
  error.name = "HttpError";
  error.status = options?.status;
  error.data = options?.data;
  error.response = options?.response;
  return error;
};

const getResponseMessage = (
  response?: AxiosResponse<unknown>,
  fallbackMessage = HTTP_CLIENT_MESSAGES.requestFailed,
) => {
  const responseMessage =
    response?.data &&
    typeof response.data === "object" &&
    "message" in response.data
      ? response.data.message
      : undefined;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }
  return fallbackMessage;
};

const overrideErrorMessage = <T>(error: T): T => {
  if (!axios.isAxiosError(error) || !error.response) {
    return error;
  }
  error.message = getResponseMessage(error.response, error.message);
  return error;
};

const formatAccessToken = (prefix: string, token: string) => {
  const normalizedPrefix = prefix.trim();
  return normalizedPrefix ? `${normalizedPrefix} ${token}` : token;
};

const shouldSkipRefresh = (
  skipRefreshUrls: string[],
  config?: InternalAxiosRequestConfig & RequestRetryState,
) => {
  const requestUrl = config?.url;
  if (!requestUrl) return false;
  return skipRefreshUrls.some((url) => requestUrl.includes(url));
};

export const createHttpClient = (options: HttpClientOptions): AxiosInstance => {
  const refreshManager = new TokenRefreshManager();
  const refreshEnabled = options.refreshAccessToken !== undefined;

  // 合并默认值
  const resolvedOptions: ResolvedHttpClientOptions = {
    authFailureCodes: [],
    accessTokenHeaderName: "Authorization",
    accessTokenPrefix: "Bearer",
    unauthorizedStatusCode: 401,
    skipRefreshUrls: [],
    isBusinessSuccess: () => true,
    mapBusinessError: (response: AxiosResponse<unknown>) => {
      return createHttpClientError(
        getResponseMessage(response, HTTP_CLIENT_MESSAGES.businessRequestFailed),
        { status: response.status, data: response.data, response },
      );
    },
    shouldRefreshByResponseData: () => false,
    onAuthFailure: () => {},
    isRefreshFailure: (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.response) return false;
      const status = error.response.status;
      const data = error.response.data as { code?: number } | undefined;
      if (status && status >= 500) return false;
      return (
        status === resolvedOptions.unauthorizedStatusCode ||
        (data?.code !== undefined &&
          resolvedOptions.authFailureCodes.includes(data.code))
      );
    },
    ...options,
  };

  const instance = axios.create({
    timeout: 15 * 1000,
    ...resolvedOptions.axiosConfig,
  });

  const handleAuthFailure = async (error?: unknown) => {
    await resolvedOptions.onAuthFailure(error);
  };

  // 刷新 token，内部通过 TokenRefreshManager 去重
  const refreshAccessToken = async (): Promise<string> => {
    const requestRefreshAccessToken = resolvedOptions.refreshAccessToken;
    if (!refreshEnabled || !requestRefreshAccessToken) {
      throw new Error(HTTP_CLIENT_MESSAGES.refreshDisabled);
    }

    return refreshManager.runRefresh(async () => {
      try {
        return await requestRefreshAccessToken();
      } catch (error) {
        const authError = resolvedOptions.isRefreshFailure(error)
          ? createHttpClientError(HTTP_CLIENT_MESSAGES.refreshTokenExpired)
          : overrideErrorMessage(error);
        await handleAuthFailure(authError);
        throw authError;
      }
    });
  };

  // 刷新后重试原请求
  const retryAfterRefresh = async (
    config: InternalAxiosRequestConfig & RequestRetryState,
  ) => {
    if (config._retry) {
      const authError = createHttpClientError(HTTP_CLIENT_MESSAGES.loginExpired);
      await handleAuthFailure(authError);
      throw authError;
    }

    config._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      config.headers = config.headers ?? {};
      config.headers[resolvedOptions.accessTokenHeaderName] = formatAccessToken(
        resolvedOptions.accessTokenPrefix,
        newAccessToken,
      );
      return await instance.request(config);
    } catch (error) {
      throw overrideErrorMessage(error);
    }
  };

  // 请求拦截器：自动注入 token
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig & RequestRetryState) => {
      const currentAuthorization =
        config.headers?.[resolvedOptions.accessTokenHeaderName];
      if (currentAuthorization) return config;

      const accessToken = await resolvedOptions.getAccessToken();
      if (!accessToken) return config;

      config.headers = config.headers ?? {};
      config.headers[resolvedOptions.accessTokenHeaderName] = formatAccessToken(
        resolvedOptions.accessTokenPrefix,
        accessToken,
      );
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 响应拦截器：处理业务错误 + 401 刷新
  instance.interceptors.response.use(
    async (response) => {
      const config = response.config as InternalAxiosRequestConfig &
        RequestRetryState;

      // 业务层判断需要刷新
      if (resolvedOptions.shouldRefreshByResponseData(response)) {
        if (
          !refreshEnabled ||
          shouldSkipRefresh(resolvedOptions.skipRefreshUrls, config)
        ) {
          return response;
        }
        return retryAfterRefresh(config);
      }

      // 业务层判定失败
      if (!resolvedOptions.isBusinessSuccess(response)) {
        throw resolvedOptions.mapBusinessError(response);
      }

      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as
        | (InternalAxiosRequestConfig & RequestRetryState)
        | undefined;

      overrideErrorMessage(error);

      if (!config) return Promise.reject(error);

      const status = error.response?.status;

      // 401 触发刷新
      if (status === resolvedOptions.unauthorizedStatusCode) {
        if (
          !refreshEnabled ||
          shouldSkipRefresh(resolvedOptions.skipRefreshUrls, config)
        ) {
          await handleAuthFailure(error);
          return Promise.reject(error);
        }

        try {
          return await retryAfterRefresh(config);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};
```

#### 4、使用示例

```ts
import { createHttpClient } from "./http-client";

const http = createHttpClient({
  axiosConfig: {
    baseURL: "/api",
  },
  getAccessToken: () => localStorage.getItem("accessToken"),
  refreshAccessToken: async () => {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    const { accessToken } = await res.json();
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  },
  onAuthFailure: () => {
    localStorage.clear();
    window.location.href = "/login";
  },
  isBusinessSuccess: (response) => response.data?.code === 0,
  mapBusinessError: (response) => {
    return new Error(response.data?.message || "业务请求失败");
  },
});
```

#### 5、对比「双 Token 封装」

| 维度 | 双 Token 封装 | 高级可配置封装 |
|------|-------------|--------------|
| 刷新去重 | `isRefreshing` + `failedQueue` 手动队列 | `TokenRefreshManager` Promise 复用 |
| 配置方式 | 硬编码在拦截器中 | 全部通过 options 注入 |
| 业务错误 | 不处理 | `isBusinessSuccess` + `mapBusinessError` |
| 跳过刷新 | 硬编码 URL 判断 | `skipRefreshUrls` 配置化 |
| 刷新失败判定 | 只有 catch 就算失败 | `isRefreshFailure` 区分服务端错误和鉴权失败 |
