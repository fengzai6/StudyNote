## React useState Hook

useState 可以声明一个状态变量，并提供了更新状态的函数

如下(如果使用ts记得设置类型)：

```tsx
import { useState } from 'react';

const [count, setCount] = useState<number>(0);
```

然后可以在组件中使用这两个

如：

```tsx
import { useState } from 'react';

const MyComponent = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p> {count} </p>
      <button onClick={() => setCount(count + 1)}>加一</button>
    </div>
  );
}
```

在点击 “加一” 的时候，count就会加一，触发组件重新渲染

如果这样，在set后紧接着打印count的值，会发现，打印的是更新前的值

![image](https://github.com/fengzai6/StudyNote/assets/112751823/c8b7bef3-a9db-4d5c-828f-71f6c2c0f14a)

```tsx
<button
  onClick={() => {
    setCount(count + 1);
    console.log(count);
  }}
  >
  加一
</button>
```

因为 React 的异步更新机制 当设置状态后，并不会立即更新，而是在下一次渲染周期中更新 

这样做可以提高性能,因为一个组件可能会有多个状态更新,React 会将它们合并,减少不必要的重新渲染



如果需要打印更新后的值，可以使用useEffect（）



### 深入理解更新时机

先看例子，其中在一次点击的时候，对number设置了7次state，哈哈是不是很多很乱

```
import { useEffect, useState } from "react";

export function Restaurant() {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    console.log("useEffect", number);
  }, [number]);

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(0);
          setNumber(5);
          setTimeout(() => {
            setNumber(() => number + 6);
            console.log(number);
          }, 0);
          setNumber(number + 1);
          setNumber((n) => n + 33);
          setNumber(42);
          setTimeout(() => {
            setNumber((n) => n + 12);
            console.log(number);
          }, 0);
        }}
      >
        增加数字
      </button>
    </>
  );
}

```

猜猜点击后输出结果是什么呢？54？42？又或者12？

看看ai的答复，gemini1.5、gpt4、gpt4o的回答是：

![image.png](http://p1.meituan.net/csc/9bf3110ca9d48042f293421fbc76d3de64185.png)

诶呦，怎么都说的一样呀，难不成偷偷私下串通好了？

然而答案是：

![image.png](http://p1.meituan.net/csc/a15176b98d34013d9daa1c2dae1e7c7310626.png)

啊？什么意料之外的值？

看着console和代码，结合官方文档的说法，也是能够明白为什么了

我们可以知道setTimeout的是肯定不和原来的在一起执行了，所以顺序变成这样：

```
setNumber(0);
setNumber(5);
setNumber(number + 1);
setNumber((n) => n + 33);
setNumber(42);
setTimeout(() => {
setNumber(() => number + 6);
console.log(number);
}, 0);
setTimeout(() => {
setNumber((n) => n + 12);
console.log(number);
}, 0);
```

显而易见，首先成功更新的值是42

然后由于两个setTimeout都是延迟0毫秒执行，react便将他们按顺序执行了，所以当第一个setTimeout➕6后，第二个setTimeout就根据更新后的值进行➕12 （因为使用了更新函数n => n+1），最后就是`0+6+12=18`啦，为什么不是42起加呢，明明第一次都赋值了呀，原因是因为setTimeout在第一次中拿到的number是还没更新后的值！拿着原来的值离开，就算离开后值改变了，手里的依旧是原来那个它，所以只能根据原来的它进行计算赋值了