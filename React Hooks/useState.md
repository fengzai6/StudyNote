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

![1715588159487.png](https://pic2.ziyuan.wang/user/xiaojian/2024/05/1715588159487_8617a9efb6347.png)

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