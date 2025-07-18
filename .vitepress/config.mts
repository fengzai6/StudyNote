import { DefaultTheme, defineConfig } from "vitepress";

const nav: DefaultTheme.NavItem[] = [
  { text: "首页", link: "/" },
  {
    text: "笔记",
    items: [
      {
        text: "main",
        link: "/notes/intro",
      },
      {
        text: "propmt",
        link: "/notes/propmt/翻译",
      },
    ],
  },
  { text: "代码片段", link: "/code-snippets/try-catch" },
];

const mainNotes: DefaultTheme.SidebarMulti = {
  "/notes/": [
    { text: "介绍", link: "/notes/intro" },
    {
      text: "项目通用配置",
      collapsed: false,
      items: [
        {
          text: "快速开始react+vite项目",
          link: "/notes/project-setup/快速开始react+vite项目",
        },
        { text: "路由配置", link: "/notes/project-setup/路由配置" },
        {
          text: "从头开始react+tailwind项目",
          link: "/notes/project-setup/从头开始react+tailwind项目",
        },
        { text: "代码规范", link: "/notes/project-setup/coding-conventions" },
        {
          text: "axios",
          collapsed: true,
          items: [
            { text: "一般封装", link: "/notes/project-setup/axios/http" },
            {
              text: "双 Token 封装",
              link: "/notes/project-setup/axios/http-refresh-token",
            },
          ],
        },
      ],
    },
    {
      text: "性能优化",
      collapsed: false,
      items: [
        { text: "js", link: "/notes/performance/js" },
        { text: "web", link: "/notes/performance/web" },
      ],
    },
    {
      text: "React",
      collapsed: true,
      items: [
        { text: "intro", link: "/notes/react/intro" },
        { text: "carousel", link: "/notes/react/carousel" },
        {
          text: "classOrfuntionComponent",
          link: "/notes/react/classOrfuntionComponent",
        },
        {
          text: "component-value-transfer",
          link: "/notes/react/component-value-transfer",
        },
        { text: "i18n", link: "/notes/react/i18n" },
        { text: "keepalive", link: "/notes/react/keepalive" },
        { text: "mouseEvent", link: "/notes/react/mouseEvent" },
        { text: "react-router6", link: "/notes/react/react-router6" },
        { text: "react19概述", link: "/notes/react/react19概述" },
        { text: "WebRTC", link: "/notes/react/WebRTC" },
        { text: "WebSocket", link: "/notes/react/WebSocket" },
        { text: "初始化react", link: "/notes/react/初始化react" },
        {
          text: "hooks",
          collapsed: true,
          items: [
            { text: "useCallback", link: "/notes/react/hooks/useCallback" },
            { text: "useContext", link: "/notes/react/hooks/useContext" },
            { text: "useEffect", link: "/notes/react/hooks/useEffect" },
            { text: "useMemo", link: "/notes/react/hooks/useMemo" },
            { text: "useReducer", link: "/notes/react/hooks/useReducer" },
            { text: "useRef", link: "/notes/react/hooks/useRef" },
            { text: "useState", link: "/notes/react/hooks/useState" },
          ],
        },
        {
          text: "reate-router",
          collapsed: true,
          items: [
            {
              text: "配置式路由",
              link: "/notes/react/reate-router/配置式路由",
            },
            {
              text: "组件式路由",
              link: "/notes/react/reate-router/组件式路由",
            },
          ],
        },
        {
          text: "树结构",
          collapsed: true,
          items: [
            { text: "treeSearch", link: "/notes/react/trees/treeSearch" },
            { text: "完整结构解析", link: "/notes/react/trees/完整结构解析" },
          ],
        },
      ],
    },
    {
      text: "Tools",
      collapsed: true,
      items: [
        { text: "homebrew", link: "/notes/tools/homebrew" },
        { text: "react拖拽库", link: "/notes/tools/react拖拽库" },
        { text: "终端进度条", link: "/notes/tools/终端进度条" },
        { text: "虚拟列表", link: "/notes/tools/虚拟列表" },
      ],
    },
    {
      text: "Typescript",
      collapsed: true,
      items: [
        { text: "enum", link: "/notes/typescript/enum" },
        { text: "intro", link: "/notes/typescript/intro" },
        { text: "keyof及in", link: "/notes/typescript/keyof及in" },
        {
          text: "map-元组-联合类型",
          link: "/notes/typescript/map-元组-联合类型",
        },
        { text: "类型工具", link: "/notes/typescript/类型工具" },
      ],
    },
    {
      text: "DevOps",
      collapsed: true,
      items: [
        { text: "CICD", link: "/notes/dev-ops/CICD" },
        { text: "DevOps", link: "/notes/dev-ops/DevOps" },
        { text: "levi", link: "/notes/dev-ops/levi" },
      ],
    },
    {
      text: "Github",
      collapsed: true,
      items: [
        { text: "gitflow", link: "/notes/github/gitflow" },
        { text: "oAuth登录", link: "/notes/github/oAuth登录" },
      ],
    },
  ],
};

const propmtNotes: DefaultTheme.SidebarMulti = {
  "/notes/propmt/": [
    {
      text: "AI Prompt",
      items: [{ text: "翻译", link: "/notes/propmt/翻译" }],
    },
  ],
};

const codeSnippets: DefaultTheme.SidebarMulti = {
  "/code-snippets/": [
    {
      text: "代码片段",
      items: [{ text: "tryCatch", link: "/code-snippets/try-catch" }],
    },
  ],
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Study Notes",
  description: "A Study Notes Size By XiaoJian",
  srcDir: "src",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar: {
      ...mainNotes,
      ...propmtNotes,
      ...codeSnippets,
    },

    search: {
      provider: "local",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/fengzai6/StudyNote" },
    ],

    editLink: {
      pattern: "https://github.com/fengzai6/StudyNote/tree/main/src/:path",
      text: "在 GitHub 上编辑此页面",
    },

    lastUpdated: {
      text: "更新时间",
      formatOptions: {
        dateStyle: "long",
        timeStyle: "short",
      },
    },

    footer: {
      message: "基于 MIT 许可发布",
      copyright: `Copyright © 2024-${new Date().getFullYear()} nacho`,
    },
  },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
  ],
});
