# 👨‍💻 React 编码约定

良好的代码规范能够提高代码的可读性，便于 `写作`、`沟通`、`PR Reivew`、减少 `bug`的出现等等，而 `React Coding Conventions` 主要围绕了这几点进行 `React`、`React Native` 的编码约定，统一编码规范，让代码看的更加赏心悦目。

# 状态管理和样式系统

为了减少开发资源之间的学习成本，尽量使用以下建议的状态管理和样式系统，如有添加应该提议题在委员会会议上讨论。

#### 状态管理

- zustand
- mobx state tree
- recoil
- hox

#### 样式系统

- css in js
- css module
- sass
- less
- tailwind css

# 命名约定

#### 文件、目录命名

文件、目录命名必须以烤串 **（kebab-case）** 命名，例如：`axios-logger`、`home-screen.tsx`、`api-config.ts`

#### 组件

```tsx
// React 组件必须采用大驼峰命名法（CamelCase）
const BaseButton = () => {...}

// 建议使用接口（interface）声明 props，并以 IxxxProps 的形式命名
interface IModalProps {...}

const Modal = (props: IModalProps) => {...}

// 组件的回调属性建议以 onXXX 命名
interface IModalProps {
  onClose: () => void;
}

// 组件内部处理回调属性函数建议以 handleXXX 命名
const handleClose = () => {...}

<Modal onClose={handleClose} />
```

#### 变量

```tsx
// 变量命名应采用小驼峰命名法（camelCase）
const userName = "Tom Lee";
```

#### 常量

```tsx
// 常量应采用大写字母命名
const PI = 3.14;

// 多个单词间要用 下划线（_）分割命名
const MIN_COUNT = 1;
const MAX_COUNT = 2;
```

#### 函数

```tsx
// 函数命名建议采用小驼峰命名法（camelCase）
const handleClick = () => {...}
```

#### Interface

```tsx
// Interface 建议以 I 开头，采用大驼峰命名法（CamelCase），例如 IUser
interface IUser {
  id: number;
  name: string;
}
```

#### Type

```tsx
// Type 类型应采用大驼峰命名法（CamelCase），并以 Type 结尾，例如 MethodType
type MethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
```

#### Enum

```tsx
// Enum 枚举类型应采用大驼峰命名法（CamelCase），并以 Enum 结尾，例如 LoginTypeEnum
enum LoginTypeEnum {
  Password,
  VerifyCode,
}
```

#### className

```tsx
// className 使用小驼峰命名 ，如cardContent
.cardContent

// 组件使用
<div className={styles.cardContent}></div>
```

# 

# 目录结构

#### 总体结构

```
|- app
  |- components - 公共组件
  |- config - 环境配置文件
  |- hooks - 自定义钩子
  |- i18n - 多国语言翻译资源
  |- model - 状态管理文件
  |- navigation - 导航组件（仅限react native）
  |- routes - 路由组件（仅限react web）
  |- screens - 应用屏幕组件（仅限react native）
  |- pages - 应用页面组件（仅限react web）
  |- services - 外界连接服务
  |- theme - 应用主题、间距、颜色、排版
  |- types - 公共类型
  |- utils - 辅助工具

```

#### components

应用内可复用组件存放位置，一个目录对应一个组件，如出现组件比较庞大的情况，可拆分数个小组件存放在对应组件目录下，不需要建 `components` 目录。

```
|- app
  |- components
    |- base-button
      |- base-button.tsx
      |- base-button-text.tsx
      |- base-button-left.tsx
      |- base-button-right.tsx
```

#### hooks

应用内可复用 `hooks` 或者 `Context Providers`，例如 `use-loading`、`use-popup`、`use-confirm`、`use-keyboard-status`，简单的 `hooks` 可以创建一个文件存放，但是遇到比较复杂的 `hooks` 或者需要结合 `Context Provider` 使用的 `hooks`，需要创建对应目录，并且目录内放置 `index.tsx` 导出。

```
|- app
  |- hooks
    |- use-keyboard-status.ts
    |- use-confirm
      |- confirm-context.tsx
      |- confirm-dialog.tsx
      |- use-confirm.tsx
      |- index.tsx
```

#### screen and pages

应用的页面 **（屏幕）** 组件存放位置，一个页面 **（屏幕）** 组件对应一个目录，如出现页面 **（屏幕）** 比较庞大的情况，可在页面 **（屏幕）** 目录创建 `components` 目录，存放拆分的小组件，但是小组件不能继续有 `components` 目录，
如果页面 **（屏幕）** 组件逻辑比较多，可使用 `hooks` 拆分逻辑存放到页面（屏幕）目录下。

```
|- app
  |- pages
    |- home
      |- components
        |- header
          |- header.tsx
        |- footer
          |- footer.tsx
      |- home.tsx
      |- hooks.ts
```

#### services/api

建议 `api service` 根据 **模块拆分**，并且目录放置 `index.ts` 导出，避免随着功能迭代，单个文件代码超长，影响代码阅读性。

```
|- app
  |- services
    |- api
      |- api.ts
      |- api-auth.ts
      |- api-user.ts
      |- api-order.ts
      |- index.ts
```

#### utils

简单的 `utils` 可以创建一个文件存放，如果遇到比较复杂的 `utils` 可以创建对应目录，并且目录内放置 `index.tsx` 导出。

```
|- app
  |- utils
    |- event-emitter
      |- event-emitter.ts
      |- event-emitter.types.ts
      |- index.ts
```


# 代码规范

#### 不要使用默认导出

使用默认导出会导致命名不一致的问题，使用时需要为其命名。

```tsx
// Bad
const getUsers = () => {...};

export default getUsers;

// Good
export const getUsers = () => {...};
```

#### 使用 ES6 箭头函数

箭头函数能够以更简洁的方式编写函数。

```tsx
// Bad
function getUsers() {...};

// Good
const getUsers = () => {...};
```

#### 其他规范

其他规范已写在 ESLint 规则里面

react：[sj-distributor/eslint-plugin-react](https://github.com/sj-distributor/eslint-plugin-react)

react-native：[sj-distributor/eslint-plugin-react-native](https://github.com/sj-distributor/eslint-plugin-react-native)

# 关于注释

如何使用注释，其实一直是一个备受争议的话题，在 `《Clean Code》` 这本书说到好的代码是不需要注释的，但是我觉得毕竟现在 `99%` 的语言都是以英语表达为主，并非我们的母语，阅读起来并没有这么流畅，所以合适添加注释是很有必要的，特别我们都是开发业务系统多，适量的注释，对日后维护项目和新接手项目的同事会有一定的帮助。

# 关于依赖锁定

为了确保开发团队成员都使用相同的依赖版本，避免出现依赖冲突，依赖版本不一致的情况，导致影响团队合作效率和项目稳定性 ，采用以下依赖锁定策略：

- 必须将依赖的锁定文件（如 `yarn.lock`、`package-lock.json`、`pnpm-lock.yaml`）上传到 **版本控制系统**。
- 锁定文件的更新需要严格的代码审查流程控制 `(PR Review)` ，以防止意外的依赖更新和潜在的问题。

# 使用 tailwind css + antd 的一些建议

- 尽可能使用 `className` 去调用 `tailwind css` 的样式。
- 所有颜色样式需定义在颜色主题配置文件中 `/src/theme/colors.ts`。
- 所有字体大小样式需定义在 `tailwind.config.ts/.js` 配置文件中的 `theme` 属性中。
- 一些可以共用的样式也可以考虑定义在主题配置里面: `tailwind.config.ts/.js`
- 如果需要修改 `Ant Design` 组件的样式，可以利用 `Ant Design` 的[自定义主题功能进行样式配置](https://ant.design/theme-editor-cn#component-style)，然后将样式定义在 `Ant Design` 主题配置文件中。