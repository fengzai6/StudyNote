## i18next 方案

基于 i18next + react-i18next 的国际化示例，展示核心 i18n 能力。

### 功能展示

| 特性 | 说明 |
|---|---|
| 基础翻译 | `t()` 函数使用、语言切换 |
| 字符串插值 | `{{variable}}` 动态变量嵌入 |
| 复数处理 | `_one` / `_other` 后缀自动选形 |
| 嵌套 key | 多层对象结构组织翻译资源 |
| HTML 标签嵌入 | `Trans` 组件在翻译文本中渲染 `<strong>`、`<a>` 等元素 |
| 语言持久化 | `localStorage` 记住用户选择，下次打开自动恢复 |

### 文件结构

```
src/demos/i18next/
├── index.tsx                  # Demo 组件
├── react-i18next.d.ts         # 类型声明，基于资源对象自动推导 t() 的 key
└── i18n/
    ├── index.ts               # i18n 初始化配置（语言检测、资源注册）
    └── locales/
        ├── zh-CN.ts           # 中文翻译资源
        └── en-US.ts           # 英文翻译资源
```

### 最小使用 Demo

**_locales/zh-CN.ts_**

```ts
export const zhCN = {
  common: {
    changeLanguage: "切换语言",
    currentLanguage: "当前语言",
  },
} as const;
```

**_locales/en-US.ts_**

```ts
export const enUS = {
  common: {
    changeLanguage: "Change Language",
    currentLanguage: "Current Language",
  },
} as const;
```

**_index.tsx_**

```tsx
import { useTranslation } from "react-i18next";

const Demo = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <p>{t("common.currentLanguage")}: {i18n.language}</p>
      <button onClick={() => handleLanguageChange("zh-CN")}>中文</button>
      <button onClick={() => handleLanguageChange("en-US")}>English</button>
    </div>
  );
};

export default Demo;
```

### 安装依赖

```bash
yarn add i18next react-i18next
```

### i18n 初始化配置

**_i18n/index.ts_**

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { enUS } from "./locales/en-US";
import { zhCN } from "./locales/zh-CN";

export const LANGUAGES = {
  zhCN: "zh-CN",
  enUS: "en-US",
} as const;
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

const SUPPORTED_LANGUAGES = Object.values(LANGUAGES);

const DEFAULT_LANGUAGE: Language = LANGUAGES.zhCN;
const I18N_STORAGE_KEY = "MyReactDemo-i18nextLng";

const isLanguageSupported = (lng: string): lng is Language => {
  return SUPPORTED_LANGUAGES.includes(lng as Language);
};

const getInitialLanguage = (): Language => {
  const savedLanguage = localStorage.getItem(I18N_STORAGE_KEY);
  if (savedLanguage && isLanguageSupported(savedLanguage)) {
    return savedLanguage;
  }

  const sysLanguage = navigator.language.toLowerCase();

  // 精确匹配，如 zh-cn 匹配 zh-CN
  const exactMatch = SUPPORTED_LANGUAGES.find(
    (lng) => lng.toLowerCase() === sysLanguage,
  );
  if (exactMatch) return exactMatch;

  // 前缀匹配，如 zh-hans-cn 匹配 zh-CN，en 匹配 en-US
  const prefixMatch = SUPPORTED_LANGUAGES.find(
    (lng) =>
      sysLanguage.startsWith(lng.toLowerCase()) ||
      lng.toLowerCase().startsWith(sysLanguage),
  );
  if (prefixMatch) return prefixMatch;

  return DEFAULT_LANGUAGE;
};

export const resources = {
  [LANGUAGES.zhCN]: {
    translation: zhCN,
  },
  [LANGUAGES.enUS]: {
    translation: enUS,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: LANGUAGES.enUS,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(I18N_STORAGE_KEY, lng);
});

export default i18n;
```

### 类型声明

**_react-i18next.d.ts_**，基于资源对象自动推导 `t()` 的 key，实现类型安全的翻译调用

```ts
import "i18next";
import { resources } from "./i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: (typeof resources)["zh-CN"];
  }
}
```

### 初始化流程

1. 读取 `localStorage` 中保存的语言偏好
2. 若无记录，用 `navigator.language` 做精确匹配 → 前缀匹配
3. 都未命中则回退到 `zh-CN`
4. 将匹配到的语言和全部资源传入 `i18n.init()`
5. 监听 `languageChanged` 事件，自动持久化到 `localStorage`

### Trans 组件注意点

`Trans` 组件不会随语言变化自动重新渲染，需要通过 `key={i18n.language}` 强制刷新：

```tsx
<Trans key={i18n.language} i18nKey="demo.richText" components={{ bold: <strong />, ... }} />
```

翻译文本中使用的组件名不能与 HTML void element 冲突（如 `<link>`、`<img>`），否则子内容不会被渲染。推荐用 `<anchor>` 等非 HTML 名称。
