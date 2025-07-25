# 立即执行函数 (IIFE) 与工厂函数 (TypeScript 版本)

## 立即执行函数 (Immediately Invoked Function Expression)

立即执行函数（IIFE）是在定义后立即执行的 TypeScript/JavaScript 函数。它是一种常见的设计模式，可以创建独立的作用域，避免变量污染全局命名空间。

### 语法

IIFE 的典型语法是使用一对括号将函数声明包裹起来，使其成为一个函数表达式，然后在其后再加上一对括号来立即调用它。

```typescript
(function () {
  // 这里的代码会立即执行
  const message: string = "Hello from IIFE!";
  console.log(message);
})();
// console.log(message); // Error: Cannot find name 'message'.
```

### 优点

1.  **创建私有作用域**: IIFE 内部的变量和函数在外部是不可访问的，从而有效地创建了私有作用域，避免了对全局作用域的污染。
2.  **模块化**: 在现代 TypeScript/JavaScript 中，我们有内置的模块系统（ES Modules）。但 IIFE 仍然可以用于在单个文件内隔离代码块或执行一次性设置。

## 利用 IIFE 和模块机制实现工厂函数

在现代模块系统（如 ES Modules）中，模块在首次导入后其顶级作用域的代码会执行一次，然后模块实例被缓存。我们可以利用这个特性结合 IIFE 来创建一个“工厂函数”或配置好的单例。

### 示例: 配置好的实例工厂 (单例模式)

想象一下，我们有一个服务，需要在应用启动时进行一些配置，比如设置 API 密钥或数据库连接。

`configured-service.ts`:

```typescript
interface Service {
  getData(path: string): { data: string };
}

const singleInstance: Service = (() => {
  // 这个 IIFE 只会执行一次 (模块首次加载时)
  console.log("Initializing service...");

  const config = {
    apiKey: "your-secret-api-key",
    endpoint: "https://api.example.com",
  };

  // 返回一个符合 Service 接口的对象
  return {
    getData: (path: string) => {
      console.log(
        `Fetching data from ${config.endpoint}/${path} with key ${config.apiKey}`
      );
      // 在实际应用中, 这里会是一个 API 调用
      return { data: `data from ${path}` };
    },
  };
})();

// 导出这个单例
export default singleInstance;
```

`main.ts`:

```typescript
// 第一次导入时, IIFE 会执行, "Initializing service..." 会被打印
import service1 from "./configured-service";
service1.getData("users"); // Fetching data from https://api.example.com/users with key your-secret-api-key

// 第二次导入时, 不会再次执行 IIFE, 而是从缓存中获取
import service2 from "./configured-service";
console.log(service1 === service2); // true, 证明是同一个实例

service2.getData("products"); // Fetching data from https://api.example.com/products with key your-secret-api-key
```

在这个例子中：

1.  `configured-service.ts` 模块中的 IIFE 在首次 `import` 时执行一次。
2.  初始化逻辑只运行一次，返回值被赋给 `singleInstance`。
3.  该实例被缓存，之后所有对 `configured-service.ts` 的导入都会返回这个缓存的实例。

这实际上创建了一个单例（Singleton）模式的实例。

### 示例: 返回工厂函数的 IIFE

IIFE 也可以返回一个真正的工厂函数，用于创建多个独立的、类型安全的对象实例。

`create-user.ts`:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  greet(): void;
}

type UserFactory = (name: string, email: string) => User;

const createUser: UserFactory = (() => {
  // IIFE 内部的私有变量
  let idCounter: number = 0;

  function privateMethod(): void {
    console.log("This is a private method.");
  }

  // IIFE 返回一个函数，这个函数就是我们的工厂
  return (name: string, email: string): User => {
    idCounter++;
    privateMethod(); // 可以访问 IIFE 作用域内的成员
    return {
      id: idCounter,
      name: name,
      email: email,
      greet: function () {
        console.log(`Hello, my name is ${this.name}`);
      },
    };
  };
})();

export default createUser;
```

`main.ts`:

```typescript
import createUser from "./create-user";

const user1 = createUser("Alice", "alice@example.com");
const user2 = createUser("Bob", "bob@example.com");

console.log(user1); // { id: 1, name: 'Alice', ... }
console.log(user2); // { id: 2, name: 'Bob', ... }
user1.greet(); // Hello, my name is Alice
user2.greet(); // Hello, my name is Bob

console.log(user1 === user2); // false
```

在这个模式中：

- IIFE 用于创建一个闭包，`idCounter` 和 `privateMethod` 是私有的。
- `User` 接口和 `UserFactory` 类型别名提供了强大的类型检查。
- 导出的 `createUser` 函数是类型安全的工厂函数。

这种结合了 IIFE、闭包和 TypeScript 类型系统的方法，是实现封装和创建可复用、有状态组件的强大技术。
