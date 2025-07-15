import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Study Notes",
  description: "A Study Notes Size By XiaoJian",
  srcDir: "src",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "教程", link: "/intro" },
    ],

    sidebar: [
      { text: "介绍", link: "/intro" },
      {
        text: "项目设置",
        collapsed: false,
        items: [
          { text: "http", link: "/project-setup/http" },
          {
            text: "从头开始react+tailwind项目",
            link: "/project-setup/从头开始react+tailwind项目",
          },
          {
            text: "快速开始react+vite项目",
            link: "/project-setup/快速开始react+vite项目",
          },
          { text: "路由配置", link: "/project-setup/路由配置" },
          { text: "代码规范", link: "/project-setup/coding-conventions" },
        ],
      },
      {
        text: "性能优化",
        collapsed: false,
        items: [{ text: "js", link: "/performance/js" }],
      },
      {
        text: "React",
        collapsed: true,
        items: [
          { text: "intro", link: "/react/intro" },
          { text: "carousel", link: "/react/carousel" },
          {
            text: "classOrfuntionComponent",
            link: "/react/classOrfuntionComponent",
          },
          {
            text: "component-value-transfer",
            link: "/react/component-value-transfer",
          },
          { text: "i18n", link: "/react/i18n" },
          { text: "keepalive", link: "/react/keepalive" },
          { text: "mouseEvent", link: "/react/mouseEvent" },
          { text: "react-router6", link: "/react/react-router6" },
          { text: "react19概述", link: "/react/react19概述" },
          { text: "WebRTC", link: "/react/WebRTC" },
          { text: "WebSocket", link: "/react/WebSocket" },
          { text: "初始化react", link: "/react/初始化react" },
          {
            text: "hooks",
            collapsed: true,
            items: [
              { text: "useCallback", link: "/react/hooks/useCallback" },
              { text: "useContext", link: "/react/hooks/useContext" },
              { text: "useEffect", link: "/react/hooks/useEffect" },
              { text: "useMemo", link: "/react/hooks/useMemo" },
              { text: "useReducer", link: "/react/hooks/useReducer" },
              { text: "useRef", link: "/react/hooks/useRef" },
              { text: "useState", link: "/react/hooks/useState" },
            ],
          },
          {
            text: "reate-router",
            collapsed: true,
            items: [
              { text: "配置式路由", link: "/react/reate-router/配置式路由" },
              { text: "组件式路由", link: "/react/reate-router/组件式路由" },
            ],
          },
          {
            text: "树结构",
            collapsed: true,
            items: [
              { text: "treeSearch", link: "/react/trees/treeSearch" },
              { text: "完整结构解析", link: "/react/trees/完整结构解析" },
            ],
          },
        ],
      },
      {
        text: "Tools",
        collapsed: true,
        items: [
          { text: "homebrew", link: "/tools/homebrew" },
          { text: "react拖拽库", link: "/tools/react拖拽库" },
          { text: "终端进度条", link: "/tools/终端进度条" },
          { text: "虚拟列表", link: "/tools/虚拟列表" },
        ],
      },
      {
        text: "Typescript",
        collapsed: true,
        items: [
          { text: "enum", link: "/typescript/enum" },
          { text: "intro", link: "/typescript/intro" },
          { text: "keyof及in", link: "/typescript/keyof及in" },
          { text: "map-元组-联合类型", link: "/typescript/map-元组-联合类型" },
          { text: "类型工具", link: "/typescript/类型工具" },
        ],
      },
      {
        text: "DevOps",
        collapsed: true,
        items: [
          { text: "CICD", link: "/dev-ops/CICD" },
          { text: "DevOps", link: "/dev-ops/DevOps" },
          { text: "levi", link: "/dev-ops/levi" },
        ],
      },
      {
        text: "Github",
        collapsed: true,
        items: [
          { text: "gitflow", link: "/github/gitflow" },
          { text: "oAuth登录", link: "/github/oAuth登录" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/fengzai6/StudyNote" },
    ],

    editLink: {
      pattern: "https://github.com/fengzai6/StudyNote/tree/main/src/:path",
      text: "在 GitHub 上编辑此页面",
    },

    footer: {
      message: "基于 MIT 许可发布",
      copyright: `Copyright © 2024-${new Date().getFullYear()} nacho`,
    },
  },
});
