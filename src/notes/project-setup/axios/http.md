# 一般封装

```ts
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// 定义响应数据结构
interface ResponseData<T = unknown> {
  code: number;
  data: T;
  message: string;
}

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 token
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => response,
  (error: AxiosError<ResponseData>) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("未授权，请重新登录");
          break;
        case 403:
          console.error("无权限访问");
          break;
        case 404:
          console.error("请求资源不存在");
          break;
        default:
          console.error("服务器错误");
      }
    }
    return Promise.reject(error);
  }
);

export default http;
```
