## JavaScript 的性能优化

性能优化其实不算是后天去实现的，而是在编写代码的时候，就应该有相应的习惯策略去处理

https://ysx.cosine.ren/optimizing-javascript-translate

## 1、避免字符串比较

在一些场景需要进行比较的时候，避免直接使用字符串进行比较,在 ts 中使用枚举

```ts
// No
enum Position {
  TOP    = 'TOP',
  BOTTOM = 'BOTTOM',
}

// Yeppers
enum Position {
  TOP,    // = 0
  BOTTOM, // = 1
}
```



让枚举保持象征性，避免去赋予值

https://yazanalaboudi.dev/in-defence-of-typescript-enums



## 2、保持对象的形状和属性类型

JavaScript 引擎尝试通过假设对象具有特定的形状，并且函数将接收相同形状的对象来优化代码。这允许它们为该形状的所有对象一次性存储键，并在一个单独的扁平数组中存储值。