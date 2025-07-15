## React useEffect Hook

这是react中的一个执行副作用的hook，能够在渲染后执行某些操作，

在下面的例子中，首次挂载组件的时候会打印 `componentDidMount 0` 

```tsx
import { useEffect, useState } from "react";

const MyComponent = () => {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    console.log("componentDidMount", count);
    return () => {
      console.log("componentWillUnmount", count);
    };
  }, [count]);
  return (
    <div>
      <p> {count} </p>
      <button
        onClick={() => {
          setCount(count + 1);
          console.log(count);
        }}
      >
        加一
      </button>
    </div>
  );
}
```

然后点击“加一” ，可以看到首先打印的是：

`componentWillUnmount 0` 也就是组件即将重新渲染之前

接着才是更新后的

`componentDidMount 1`

由此可见，想要获取更新后值可以在useEffect中获取

`useEffect(() => { ... }, [])` 中的第二个参数是依赖函数，假如为空，副作用函数只会在首次渲染执行一次

如果加入了参数，不仅在首次渲染会执行，参数更新也会让该副作用函数执行



一个组件可以有多个useEffect ，因为在有时候需要仅仅在首次渲染执行某些副作用函数，而还有些需要依赖的副作用函数则在另一个useEffect中写就好

```tsx
useEffect(() => {
    console.log("componentDidMount", count);
    return () => {
      console.log("componentWillUnmount", count);
    };
}, [count]);
useEffect(() => {
   console.log("组件挂载");
   return () => {
     console.log("组件卸载");
   };
}, []);
```

