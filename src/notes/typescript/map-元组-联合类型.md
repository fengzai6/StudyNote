## Map对象、元组、联合类型

### Map 对象

Map是一种数据接口对象，用来保存键值对，与对象不同的是，Map对象的键可以是任何类型，包括数字、对象、函数等

在创建Map对象的时候也可以给其设置合适的类型

```
const myMap: Map<string, number> = new Map();
```

Map的相关函数和属性

```
map.clear() – 移除 Map 对象的所有键/值对 。
map.set() – 设置键值对，返回该 Map 对象。
map.get() – 返回键对应的值，如果不存在，则返回 undefined。
map.has() – 返回一个布尔值，用于判断 Map 中是否包含键对应的值。
map.delete() – 删除 Map 中的元素，删除成功返回 true，失败返回 false。
map.size – 返回 Map 对象键/值对的数量。
map.keys() - 返回一个 Iterator 对象， 包含了 Map 对象中每个元素的键 。
map.values() – 返回一个新的Iterator对象，包含了Map对象中每个元素的值 。
```

那首先给myMap进行set一些值，Map对象会按照元素插入的顺序维护键值对

```
myMap.set("key1", 1);
myMap.set("key2", 2);
myMap.set("key3", 3);
```

使用keys或者values可以迭代输出数据

```
for (let key of myMap.keys()) {
    console.log(key);   // key1 key2 key3            
}

for (let value of myMap.values()) {
    console.log(value);    // 1 2 3          
}
```



#### 利用Map来缓存数据

Map 对象可以用于缓存数据，例如存储函数执行结果，当参数一致时不进行重复计算

```
const cache = new Map();

const expensiveFunction = (arg) => {
  // ... 复杂的计算 ...
}

const cachedExpensiveFunction = (arg) => {
  if (cache.has(arg)) {
    return cache.get(arg);
  } else {
    const result = expensiveFunction(arg);
    cache.set(arg, result);
    return result;
  }
}
```



### 元组（Tuple）

在typescript中，元组是一种特殊的数据结构，它允许存储**固定数量**和**特定类型**的元素

使用方括号`[]`声明一个元组类型，并在方括号内指定每个元素的类型

```
let myTuple: [string, number, boolean];

myTuple = ["张三", 20, true]
// 当类型不对时会报错
myTuple = ["张三", 20, 1];
```

![image.png](http://p0.meituan.net/csc/d5e1924a83511ae3420bde75cb2416e08240.png)

元组可以通过下标索引进行访问

```
console.log(myTuple[0]); // 张三
console.log(myTuple[1]); // 20
```

**元组的用途：**

1. 返回多个值： 函数可以返回一个元组，方便地返回多个值。
2. 表示固定结构的数据： 例如，你可以使用元组表示一个点的坐标 (x, y)。
3. 提高代码可读性： 使用元组可以使代码更易于理解，因为元素的类型和顺序是明确定义的。

**元组的优缺点：**

**优点：**

- 类型安全
- 代码可读性高
- 可以方便地返回多个值

**缺点：**

- 长度固定，不够灵活



### 联合类型

在 TypeScript 中，**联合类型（Union Type）** 允许你将多个类型组合成一个新的类型，表示一个值可以是这些类型中的任何一个。

**联合类型就像一个盒子，里面可以装多种不同类型的物品。**

**联合类型的声明：**

使用 `|` 符号来分隔不同的类型。

```
let value: string | number; // value 可以是字符串或数字
```

**联合类型的使用：**

```
value = "hello";
value = 12
value = true; // 报错 不能为boolean
```

**联合类型的优点：**

- 灵活性： 允许一个变量存储多种类型的值。
- 类型安全： 编译器会检查你是否使用了正确的类型。
- 代码可读性： 使代码更易于理解，因为类型是明确定义的。