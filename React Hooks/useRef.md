## React useRef Hook

`useRef`是React提供的一个钩子函数，它返回一个可变的ref对象，其`.current`属性被初始化为传入的参数（如果提供了的话）。返回的对象将持续整个组件的生命周期。

#### 基本用法

useRef 接受一个参数，即初始值，并返回一个包含`.current` 的对象

```
const refContainer = useRef(init)
```

改变ref.current属性的时候，React不会重新渲染组件

例子如下：

```
import { useEffect, useRef, useState } from "react";

export const Message = () => {
  const ref = useRef<number>(0);

  const [state, setState] = useState<number>(0);

  const handleClick = () => {
    ref.current += 1;
    console.log(ref.current);
  };

  useEffect(() => {
    console.log("component render");
  });

  return (
    <div>
      <button onClick={handleClick}>点我设置ref</button>
      <button onClick={() => setState(state + 1)}>点我设置state</button>
    </div>
  );
};

```

当我们点击第一个按钮的时候，可以看到，ref的值改变了，但是组件并不会重新渲染，反之，点击第二个按钮修改state的时候，组件发生了重新渲染

![image.png](http://p0.meituan.net/csc/163995e5b96e9b17d516b9fc63cfbb7b20414.png)



并且，组件发生重新渲染并不会丢失ref的值，而是能够继续使用ref的存储信息

所以，当需要存储一些不影响组件视图信息的时候，使用ref是一个完美的选择，例如存储一个 `interval ID` 



#### 也能通过ref操作DOM

首先，需要声明一个初始值为`null`的ref对象

```
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```



然后可以将ref对象作为ref属性传递给需要操作的DOM，如下：

```
<input ref={inputRef} />;
```

然后React会在其渲染到屏幕的时候，会将DOM节点设置为ref的current属性，然后就可以借助ref对象访问DOM节点，并调用一些方法，如可以：

```
const handleClick = () => {
	inputRef.current.focus();
}
```

当节点卸载后，React会将current重新设置为null



在可以完全预测的情况下，可以在渲染过程对current属性进行更改，其余情况万万**不可在渲染过程修改**
