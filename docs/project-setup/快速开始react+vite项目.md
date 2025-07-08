---
sidebar_position: 1
---

## 快速开始 Vite + React + Tailwind/Shadcn 等 （2025/07/07）

### 需要环境

node >= 18

## vite

首先是`终端命令`简简单单初始化一个模版项目

```bash
yarn create vite
```

根据后续提示输入项目名、框架选择、类型语言：(`name`, `react`, `ts+swc`)

### tailwind

1、添加

```bash
yarn add tailwindcss @tailwindcss/vite
```

可选：prettier 插件

```bash
yarn add -D prettier prettier-plugin-tailwindcss
```

```
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/index.css",
  "tailwindFunctions": ["cn"]
}
```

2、配置 vite 插件

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
});
```

3、在 index.css 导入 tailwindcss

```css
@import "tailwindcss";
```

### 设置@/ (shadcn 必要)

#### 添加 node 类型帮助 ts 识别

```
yarn add -D @types/node
```

#### 编辑 tsconfig.json 文件

```json
{
  "files": [],
  "references": [
    // ...
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 编辑 tsconfig.app.json 文件

```json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### vite.config.ts 添加 path.resolve

```ts
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### UI 库 antd/shadcn

[antd 官网](https://ant-design.antgroup.com/components/overview-cn/)
[shadcn 中文网](https://www.shadcn.com.cn/)

运行 shadcn 之前最好先清理代码，移步[代码清洗 & 初始化目录结构](#代码清洗--初始化目录结构)

```bash
yarn add antd
yarn add @ant-design/icons

# shadcn
npx shadcn@latest init
# 根据需要添加组件
npx shadcn@latest add button
```

### 工具库

```bash
# http 请求
yarn add axios
# hook
yarn add ahooks
# 状态库
yarn add zustand
# 路由
yarn add react-router
```

### 其他库

```bash
# 静态资源处理
yarn add vite-plugin-svgr
# 多语言
yarn add i18next react-i18next
# 日期
yarn add dayjs
# icons
yarn add react-icons
```

### 代码清洗 & 初始化目录结构

当使用 vite 生成的目录结构，有一些简单的 demo 代码在里面，可以让你简单体验该框架和构建器的代码，不过要进行开发的并不需要，所以需要将这些代码清洗一下

**_index.css_**

```css
// 将所有样式删除，如果需要可以留下字体相关的样式
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

// 将所有元素的默认边距清除，并使用border-box告诉浏览器border和padding是包含在width中的，（可选：供不同理解的开发者进行选择布局计算方式）
* {
  margin: 0;
  /* padding: 0; */
  box-sizing: border-box;
}
```

**_App.tsx_**

```tsx
// 将组件函数改为使用箭头函数的方式导出，未来也是如此
export const App = () => {
  return (
    <>
      <div>hello world</div>
    </>
  );
};
```

**_main.tsx_**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
// 将App用大括号包起来，使用命名导入
import { App } from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
