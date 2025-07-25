# 类 (Class) 与单例模式

### 基本语法

一个基本的类包含属性、一个构造函数 `constructor` 和若干个方法。我们可以为它们添加类型注解。

```typescript
class Animal {
  // 属性及其类型
  public name: string;

  // 构造函数，在 new 一个实例时自动调用
  constructor(name: string) {
    this.name = name;
  }

  // 类的方法，可以指定返回类型
  public speak(): void {
    console.log(`${this.name} makes a noise.`);
  }
}

// 创建实例
const animal: Animal = new Animal("Generic Animal");
animal.speak(); // "Generic Animal makes a noise."
```

### 继承 (Inheritance)

使用 `extends` 关键字实现继承。`super` 关键字用于调用父类的构造函数和方法。

```typescript
class Dog extends Animal {
  public breed: string;

  constructor(name: string, breed: string) {
    // 调用父类的构造函数
    super(name);
    this.breed = breed;
  }

  // 重写父类的方法
  public speak(): void {
    console.log(`${this.name} barks.`);
  }

  // 新增方法
  public wagTail(): void {
    console.log(`${this.name} wags its tail.`);
  }
}

const dog: Dog = new Dog("Rex", "German Shepherd");
dog.speak(); // "Rex barks."
dog.wagTail(); // "Rex wags its tail."
```

### 静态方法 (Static Methods)

`static` 关键字定义了类的静态方法。这些方法直接在类上调用，而不是在实例上。

```typescript
class MathHelper {
  public static add(a: number, b: number): number {
    return a + b;
  }
}

console.log(MathHelper.add(2, 3)); // 5
```

## 单例模式 (Singleton Pattern)

单例模式确保一个类只有一个实例，并提供一个全局访问点。TypeScript 的 `private` 和 `static` 关键字使单例的实现更加优雅和安全。

### 使用类实现单例模式

这是最经典的实现方式，利用 `private constructor` 和一个静态方法来控制实例的创建。

```typescript
class Singleton {
  // 使用 private static 属性来保存唯一的实例
  private static instance: Singleton;
  public readonly data: string;

  // 构造函数设为 private，防止外部通过 new 来创建实例
  private constructor(data: string) {
    this.data = data;
  }

  // 提供一个 public static 方法来获取实例
  public static getInstance(data: string): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton(data);
    }
    return Singleton.instance;
  }

  public getData(): string {
    return this.data;
  }
}

// 获取实例的唯一方式
const instance1 = Singleton.getInstance("some data");
console.log(instance1.getData()); // "some data"

// 再次获取实例，会返回第一次创建的实例
const instance2 = Singleton.getInstance("other data");
console.log(instance2.getData()); // "some data" (仍然是第一个实例的数据)

console.log(instance1 === instance2); // true, 证明它们是同一个实例

// const instance3 = new Singleton('data'); // Error: Constructor of class 'Singleton' is private.
```

这种实现方式的优点：

1.  **懒汉式加载**：只有在第一次调用 `getInstance` 时才会创建实例。
2.  **类型安全**：返回的实例是 `Singleton` 类型。
3.  **封装性好**：通过 `private constructor` 防止了意外的实例化。

### 使用闭包和 IIFE 实现单例（作为对比）

虽然在 TypeScript 中使用类是实现单例的首选方式，但了解如何用闭包实现也很有用，这与 JavaScript 的传统方式一脉相承。

```typescript
interface ISingleton {
  getInstance(): { message: string };
}

const SingletonWithClosure: ISingleton = (() => {
  let instance: { message: string }; // instance 是私有的

  function createInstance() {
    return { message: "I am the instance" };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// 获取实例
const instanceA = SingletonWithClosure.getInstance();
const instanceB = SingletonWithClosure.getInstance();

console.log(instanceA === instanceB); // true
```

在这个版本中，我们使用 `interface` 来定义单例的契约，并利用闭包隐藏了 `instance` 变量。然而，对于大多数 TypeScript 项目，基于类的实现因其清晰的意图和强大的面向对象特性而更受青睐。
