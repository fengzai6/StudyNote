# 前端项目

---
inclusion: always
---

## 0. 核心原则 (Core Principles)

1.  **语言**: Always use simp Chinese response.
2.  **确认优先**: 任何你不确定的技术细节，向我提问进一步完善，才能编码。处理过程中，如果遇到什么问题要及时确认（如：设计缺失某些字段、逻辑不通顺等）。
3.  **任务拆分**: 尽可能把任务拆分成多个小任务，依次完成并且检查。
4.  **仔细严谨**: 仔细排查问题，不要马虎。不要凭空生成 API 或修改 d.ts 文件，遇到缺失应询问。

## 1. 代码规范 (Code Standards)

### 命名规范
-   **文件目录**: kebab-case (如 `react-button`)
-   **组件文件**: PascalCase (如 `MyComponent.tsx`)
-   **函数**: camelCase (特殊情况除外：如 api 函数，命名采用 PascalCase 命名)
-   **变量**: camelCase
-   **常量**: UPPER_CASE
-   **类型**: PascalCase
-   **接口**: `I` + PascalCase (如 `IUser`)

### 组件与文件结构
-   **组件封装**: 对于重复出现的代码，应尽可能封装成通用组件或者 hook。
-   **优先复用**: 优先使用框架或者自带 `components` 目录下的组件。
-   **文件结构**: 组件新增使用文件夹加 `index` 的做法，如 `react-button/index.tsx`。
-   **禁止桶导出**: 不要用桶 (Barrel exports)。
-   **文件拆分**: 单个文件代码超过 500 行就需要考虑是否可以进行拆分优化；如果可以拆分，需询问同意后进行。
-   **工具函数**: 如果需要工具，先在 `lib` 或 `utils` 目录查找，找不到再自己实现。

## 2. React & 框架规范 (React & Framework Guidelines)

-   **路由**: 在新版中，react-router 已经将 react-router-dom 合并到 react-router 中，请使用该包进行路由管理。
-   **状态管理**: 当使用 zustand 中的多个状态时，使用 `useShallow` 进行状态浅比较获取，避免不必要的 re-render。
-   **性能优化**: 如果项目使用了 react-compiler，无需手动使用 `memo`, `useCallback` 等，编译器会自动处理。

## 3. 样式与 UI 还原 (Styling & UI Implementation)

-   **原子样式**: 项目如果配置了原子样式（tailwind、nativewind），尽可能使用原子样式实现。
-   **类名**: 若项目采用原子样式，组件需按逻辑动态拼接类名时，尽量避免使用模板字符串，统一使用 `cn` 工具函数处理，确保样式合并可预测且避免冲突。

## 4. TypeScript 最佳实践 (TypeScript Best Practices)

### 通用规则
-   **No Any**: 尽量不使用 `any`。
-   **类型复用**:
    -   涉及 TS 类型和表单的，优先使用原有 TS 类型，不应自己创建类型。

### 详细规范 (Detailed Best Practices)

**EN**
```markdown
1.  **TypeScript Language Features:**
    -   Ensure comprehensive strong typing throughout the codebase for type safety.
    -   Appropriately use Interfaces, Type Aliases.
    -   Write clear and readable type definitions.
    -   Use const objects with `as const` instead of enums.

2.  **General Code Practices:**
    -   **Readability & Maintainability:** Employ clear naming conventions, concise logic, and appropriate comments (JSDoc where applicable).
    -   **Error Handling:** Implement robust error handling mechanisms, returning meaningful error messages.
    -   **SOLID Principles:** Adhere to SOLID principles (Single Responsibility, Open/Closed, etc.).
    -   **DRY Principle:** Avoid code duplication.
```

**CN**
```markdown
1.  TypeScript 语言特性
    -   全面的强类型： 在整个代码库中确保完善的强类型定义，以保证类型安全。
    -   接口与类型别名： 适当地使用 Interface（接口）和 Type Aliases（类型别名）。
    -   清晰的定义： 编写清晰且易读的类型定义。
    -   常量对象替代枚举： 使用带有 as const 的常量对象（const objects）来替代 enum（枚举）。

2.  通用代码规范
    -   可读性与可维护性： 采用清晰的命名规范、简洁的逻辑以及适当的注释（必要时使用 JSDoc）。
    -   错误处理： 实现健壮的错误处理机制，并返回具有实际意义的错误信息。
    -   SOLID 原则： 遵循 SOLID 原则（单一职责、开闭原则等）。
    -   DRY 原则： 遵循“不要重复自己”（Don't Repeat Yourself）原则，避免代码冗余。
```
