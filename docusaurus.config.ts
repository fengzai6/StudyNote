import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "学习笔记",
  tagline: "记录学习历程",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "fengzai6", // GitHub用户名
  projectName: "StudyNote", // 仓库名

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/fengzai6/StudyNote/tree/main/",
        },

        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "学习笔记",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docs",
          position: "left",
          label: "教程",
        },
        // { to: "/blog", label: "博客", position: "left" },
        {
          href: "https://github.com/fengzai6/StudyNote",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "文档",
          items: [
            {
              label: "快速开始",
              to: "/docs/project-setup/快速开始react+vite项目",
            },
            {
              label: "项目搭建",
              to: "/docs/project-setup/从头开始react+tailwind项目",
            },
            {
              label: "React 进阶",
              to: "/docs/react/intro",
            },
            {
              label: "TypeScript",
              to: "/docs/typescript/intro",
            },
          ],
        },
        {
          title: "社区",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/fengzai6/StudyNote",
            },
          ],
        },
        {
          title: "更多",
          items: [
            {
              label: "关于项目",
              to: "/docs/intro",
            },
            {
              label: "联系作者",
              href: "https://github.com/fengzai6",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 学习笔记 by nacho. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
