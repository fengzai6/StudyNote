# web 优化

## 使用 gzip 优化构建产物

```bash
yarn add -D vite-plugin-compression
```

::: code-group

```ts [vite.config.ts]
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression"; // [!code highlight]

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss(), viteCompression()], // [!code highlight]
    // ... existing code
  };
});
```

:::

同时需要在 `nginx` 中配置

```bash
gzip on;
```

## 使用分包优化构建产物

::: code-group

```ts [vite.config.ts]
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            antd: ["antd"],
            lucide: ["lucide-react"],
            zustand: ["zustand"],
            "react-router": ["react-router"],
            "react-hook-form": ["react-hook-form"],
            axios: ["axios"],
            "class-variance-authority": ["class-variance-authority"],
            clsx: ["clsx"],
            "tailwind-merge": ["tailwind-merge"],
            tailwindcss: ["tailwindcss"],
          },
        },
      },
    },
  };
});
```

:::
