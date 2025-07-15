# tryCatch

```ts
/**
 * 捕获错误
 * @param fn 函数
 * @returns 错误或结果
 */
export const tryCatch = async <T = any>(
  fn: Promise<T>
): Promise<[Error] | [null, T]> => {
  try {
    return [null, await fn];
  } catch (e: any) {
    return [e || new Error("unknown error")];
  }
};
```

## fetchWithRetry

```ts
/**
 * 重试请求
 * @param fn 请求函数
 * @param retries 重试次数
 * @returns 请求结果
 */
export const fetchWithRetry = async <T = any>(
  fn: Promise<T>,
  retries = 3
): Promise<[Error] | [null, T]> => {
  const [error, res] = await tryCatch(fn);

  if (error) {
    if (retries > 0) {
      const res = await fetchWithRetry(fn, retries - 1);
      return res;
    } else {
      if (error instanceof Error) return [error];
      return [new Error("unknown error")];
    }
  } else {
    return [null, res];
  }
};
```
