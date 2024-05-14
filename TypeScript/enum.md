## enum 枚举

枚举（enum）可以为一组数值定义一个友好的名字，使用枚举能够让代码更加清晰易懂，增强代码的可读性和维护性，并且枚举成员就成为了类型

#### 1、基本使用

```
enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

在默认情况下，枚举的成员会被赋值从0开始的数字，也可以定义开始值，对Up进行初始化为1，则其他的成员会从1开始增长

#### 2、字符串枚举

```
enum Direction {
	Up = "UP",
	Down = "DOWN",
	Left = "LEFT",
	Right = "RIGHT"
}
```

通过字符串枚举能够有更好的可读性，也能让简单代表复杂的字符

#### 3、异构枚举

虽然不常见，但 TypeScript 允许枚举包含字符串和数字成员。不建议使用

```
enum Boolean {
  No = 0,
  Yes = "YES",
}
```

#### 4、计算的和常量成员

枚举成员可以是常量或者计算出的结果

```
enum example {
	None,
	False = 1 - 1,
	len = "1234".length
}
```

#### 5、const 枚举

为了避免生成额外的代码和额外的对枚举对象的访问，我们可以使用 `const` 枚举。常量枚举在编译阶段会被删除，并且不能包含计算成员

```
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

let directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
```

