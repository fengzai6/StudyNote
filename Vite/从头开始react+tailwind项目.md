## 使用 Vite 从头建立个基础 react 项目 + tailwind

⛱️ ——**_目录_** ——🏖️

- [使用 Vite 从头建立个基础 react 项目 + tailwind](#使用-vite-从头建立个基础-react-项目--tailwind)
  - [一切的开始](#一切的开始)
  - [tailwind 安装](#tailwind-安装)
  - [设置@/来帮助导入文件或组件](#设置来帮助导入文件或组件)
  - [代码清洗 \& 初始化目录结构](#代码清洗--初始化目录结构)
  - [路由配置](#路由配置)
    - [安装组件](#安装组件)
  - [代码格式规范](#代码格式规范)
  - [VScode 插件](#vscode-插件)

---

### 一切的开始

前提环境 node ; **结尾列出所用的一些 vscode 插件**；

首先是`终端命令`简简单单初始化一个模版项目

```bash
npm create vite@latest

yarn create vite

// 使用@可以来指定版本
yarn create vite@4
// 适用于node版本低不支持该编译器版本的情况
```

如下例子使用 `yarn` 进行，没有 yarn？ 运行 `npm install -g yarn`

创建 `react18` + `vite@5` + `typescript` node 环境需要>=18，如 node 环境小于，请用 `vite@4`

运行 `yarn create vite` 提示输入项目名

![image.png](https://p0.meituan.net/csc/639a052b4132a28ebe075017c22a684114950.png)

选择 react 框架

![image.png](https://p0.meituan.net/csc/70d2f166b39f29f502dbdff7349508bf10111.png)

选择 typescript 作为我们的类型检查语言

![image.png](https://p0.meituan.net/csc/50feee821604738115a9bf65f984fc818739.png)

然后就非常简单的初始化好了一个`react18` + `vite@5` + `typescript`项目啦

![image.png](https://p0.meituan.net/csc/d2dc34adfeb096ead7ade7c4b37c59d74860.png)

按照提示，先运行 `yarn` 安装依赖，然后运行 `yarn dev` 就可以运行了,可以看到程序运行在 5173 端口当中

![image.png](https://p0.meituan.net/csc/ed32136f61813d512564ac0050cc6d3267304.png)

### 常用库

```
yarn add antd
yarn add ahooks
yarn add @ant-design/icons
yarn add react-router-dom
yarn add antd @ant-design/icons ahooks react-router-dom
```



### tailwind 安装

1、安装 Tailwind CSS, PostCSS 和 Autoprefixer

```
yarn add -D tailwindcss postcss autoprefixer
```

2、生成 Tailwind 配置文件

```
npx tailwindcss init
```

3.1、根目录新增一个 postcss.config.js 文件，将 tailwindcss 和 autoprefixer 添加进去

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

3.2、也可以添加其他的配置更加便利的生成，省去自行添加 如 `-p` `--ts`

```
npx tailwindcss init -p --ts
```

这将生成`postcss.config.js`和 `tailwindcss.config.ts`

4、当生成文件后，在 `tailwindcss.config` 中的 content[]配置添加所需模版文件的路径

```ts
content[
 "./index.html",
 "./src/**/*.{js,ts,jsx,tsx}",
]
corePlugins: {
 preflight: false,
},
```

5、在主要的 css 文件当中，如 `index.css` ，将 Tailwind CSS 指令放入该文件中

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Vscode 配套官方插件 Tailwind css IntelliSence**

![image.png](https://p0.meituan.net/csc/50b93f046d15623970ee79f085f98fb427736.png)

这样 tailwind 就配置好了，可以在元素中直接使用了，如：

```html
<div className="flex text-[16px] items-center justify-center">Home</div>
```

### 设置@/来帮助导入文件或组件

首先需要添加 node 类型帮助 ts 识别

```
yarn add @types/node
```

**_vite.config.ts_** 添加 path.resolve

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**_tsconfig.json_** 添加配置 /_ Config _/ 部分

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Config */
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
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
  padding: 0;
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

到现在就可以去编写自己的项目代码了

未来目录结构一般是这样的

```
src
├─ assets  //静态文件存放
├─ components  //公共组件存放
│  └─ xxx-xxx
│     └─ index.tsx
├─ pages // 页面
│  └─ xxx-xxx
│     ├─ index.tsx
│     ├─ hook.ts //自定义hooks
│     └─ props.ts //接口类型定义
├─ router  //路由配置
│  └─ index.tsx
├─ services //接口配置
│  ├─ api //各个接口
│  │	├─ xxx-xxx
│  │	│	 └─ index.ts
│  │	└─ http-client.ts // 封装axios或者fetch等工具（添加拦截器等）
│  └─ dtos //数据传输对象类型定义
│     ├─ xxx-xxx
│     │	 └─ index.ts
│     └─ public
│      	 └─ index.ts
└─ utils  // 工具函数
   └─ index.ts
```

### 路由配置

基本知识笔记：[StudyNote/react-router6.md](https://github.com/fengzai6/StudyNote/blob/main/240513-reactRouter6-组件传值/react-router6.md)

#### 安装组件

```
npm install react-router-dom
或者
yarn add react-router-dom
```

**_main.tsx_** 在该文件中给 App 使用 BrowserRouter

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 最好是将BrowserRouter放在App外面，这样app能更好使用router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

**_router/props.ts_** 路由数组格式定义

```ts
export interface IRouteProps {
  path: string;
  element: React.ReactNode;
  name?: string;
  index?: boolean;
  children?: IRouteProps[];
}
```

**_router/index.tsx_** 根据定义编写**routes 数组**和**RouterViews 组件**

```tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { IRouteProps } from "./props";

// 简单建了两个简单的组件，稍后给出
import { Home } from "@/pages/home";
import { My } from "@/pages/my";

// 编写路由配置数组
const routes: IRouteProps[] = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "my",
        element: <My />,
        index: true, // 当给属性index设置为true时，该组件为父组件的首页
      },
    ],
  },
];

// 组件逻辑
export const RouterViews = () => {
  // 路由循环递归逻辑
  const routerViews = (routes: IRouteProps[]) => {
    return routes.map((item: IRouteProps, index: number) => (
      <Fragment key={index}>
        {item.index && (
          <Route index element={<Navigate to={item.path} replace />} />
        )}
        <Route path={item.path} element={item.element}>
          {item.children && routerViews(item.children)}
        </Route>
      </Fragment>
    ));
  };

  return (
    <Routes>
      {/* 应为404页面，暂时未编写 */}
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* 带入路由数组进行处理 */}
      {routerViews(routes)}
    </Routes>
  );
};
```

**_pages/home/index.tsx_** 每个有 children 的父组件都要记得放置 `<Outlet />`

```tsx
import { Outlet } from "react-router-dom";

export const Home = () => {
  return (
    <>
      <div>Home</div>
      {/* 该Home的孩子会在Outlet中显示 没有设置则不会显示My */}
      <Outlet />
    </>
  );
};
```

**_pages/my/index.tsx_**

```tsx
export const My = () => {
  return <div>My</div>;
};
```

显示如下，可以看到 `My` 显示在 `Home` 的下面：

![image.png](https://p0.meituan.net/csc/5c8f793fcc10ba904adc3e5c89dddffe5346.png)

**🎉 基本就是这样，接下来就是自由编写代码，该流程日后发现不足将会补充 🎉**

### 代码格式规范

[React 编码约定](https://github.com/fengzai6/StudyNote/blob/main/coding-conventions.md)

### VScode 插件

1. 自动帮你输出关闭标签

![image.png](https://p0.meituan.net/csc/4a1ac82960ddbd04ba893a7dc4a01aae7534.png)

2. 自动在修改标签名时同步另一个

![image.png](https://p0.meituan.net/csc/b4b8228d0a64a107801e583389b9b4ad9397.png)

3. 单词翻译和单词检查

![image.png](https://p0.meituan.net/csc/51252e00a1c88945b5fde547b61f73ec20613.png)

4. 必备格式和 git 工具

![image.png](https://p0.meituan.net/csc/1e8926ededda6bccdaba8458f6024cbb32442.png)

5. 只要 alt+w 就可以为选中的内容添加标签包起来！

![image.png](https://p0.meituan.net/csc/e55733bc9c25c47ee879a37b618b98009776.png)

6. 图片预览

![image.png](https://p0.meituan.net/csc/aec467cd53ad003f8652e380124d5aa29333.png)

7. 很好用的 px to rem 工具

![image.png](https://p1.meituan.net/csc/a5f531769c410e1429f8dbc9f7ce144913339.png)

8. tailwindcss

![image.png](https://p1.meituan.net/csc/231d3189e8f4b16569447f646440e10c23137.png)

9. react

![image.png](https://p0.meituan.net/csc/5182cb9b6b672e9f5cd9688b4e47aff422498.png)
