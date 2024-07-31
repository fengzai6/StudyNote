## keyof 及 in

`keyof`：能够用于取interface的键后保存为联合类型

```
interface IUser {
  name: string
  age: number
}
// 使用type获取
type keyofUser = keyof Iuser;

// keyofUser = "name" | "age"
```

`in` : 取联合类型的值，主要用于数组和对象的构建

```
type keyofUser = "name" | "age";
type TUser = {
	[key in keyofUser]: string
}

// Tuser = {
  name: string
  age: string
}
```

如 

```
interface Todo {
  title: string
  description: string
  completed: boolean
}

const getValue = (obj: Todo, key: string) {
	return obj[key];
}

// 上面对比下面，上面无法对key进行约束，会导致输入错误获取不到的情况
// 避免这种情况可以使用keyof来处理类型，如下

const getValue = <T extends Todo, K extends keyof T>(obj: T, key: K ): T[K] => {
  return obj[key];
}
```

