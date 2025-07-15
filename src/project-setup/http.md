```ts
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 定义响应数据结构
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加 token
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const res = response.data;
    if (res.code !== 200) {
      console.error(res.message || "请求错误");
      return Promise.reject(new Error(res.message || "请求错误"));
    }
    return res.data;
  },
  (error: any) => {
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

// 封装请求方法
const request = {
  // GET 请求
  get<T = any>(url: string, params: Record<string, any> = {}): Promise<T> {
    return instance.get(url, { params });
  },

  // POST 请求
  post<T = any>(url: string, data: Record<string, any> = {}): Promise<T> {
    return instance.post(url, data);
  },

  // PUT 请求
  put<T = any>(url: string, data: Record<string, any> = {}): Promise<T> {
    return instance.put(url, data);
  },

  // DELETE 请求
  delete<T = any>(url: string, params: Record<string, any> = {}): Promise<T> {
    return instance.delete(url, { params });
  },

  // 上传文件
  upload<T = any>(url: string, formData: FormData): Promise<T> {
    return instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default request;

```

