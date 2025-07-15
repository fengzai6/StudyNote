## React 组件传值

1、**父传子**

通过props将数据下传

如：

```tsx
// 父组件
const ParentComponent = () => {
  const message = 'Hello from parent';
  return <ChildComponent message={message} />;
}

// 子组件
const ChildComponent = (props: {message:string}) => {
  return <div>{props.message}</div>;
}
```



2、**子传父**

通过回调函数的形式将数据传给父组件

父组件需要将回调函数作为props传给子组件

如：

```tsx
// 父组件
const ParentComponent = () => {
  const [childMessage, setChildMessage] = useState<string>('');
  const handleChildMessage = (message: string) => {
    setChildMessage(message);
    console.log(message);
  };
  return <ChildComponent onMessageChange={handleChildMessage} />;
}

// 子组件
const ChildComponent = (props: {
  onMessageChange: (message: string) => void;
}) => {
  const handleClick = () => {
    props.onMessageChange('Hello from child');
  };
  return <button onClick={handleClick}>Click me</button>;
}
```



3、兄弟组件之间

可以在这几个兄弟的父级上设置他们共用的状态数据

子组件需要修改则调用父组件给的回调函数

```tsx
// 父组件
const ParentComponent = () => {
  const [childMessage, setChildMessage] = useState<string>('');
  const handleChildMessage = (message: string) => {
    setChildMessage(message);
    console.log(message);
  };
  return (
    <>
      <ChildComponent message={childMessage} onMessageChange={handleChildMessage} />
      <ChildComponentB message={childMessage} onMessageChange={handleChildMessage} />
    </>
  );
}

// 子组件
const ChildComponent = (props: {
  message: string;
  onMessageChange: (message: string) => void;
}) => {
  const handleClick = () => {
    props.onMessageChange('Hello from child');
  };
  return <button onClick={handleClick}>Click me {props.message}</button>;
}
const ChildComponentB = (props: {
  message: string;
  onMessageChange: (message: string) => void;
}) => {
  const handleClick = () => {
    props.onMessageChange('Hello from childB');
  };
  return <button onClick={handleClick}>Click me {props.message}</button>;
}
```

