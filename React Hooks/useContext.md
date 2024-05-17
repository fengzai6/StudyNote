## React useContext Hook

context：上下文，那么useContext就是React提供用来自己访问上下文组件的数据，从而无需通过多层组件传递props，简化组件树

子组件基本使用

```
const value = useContext(SomeContext)
```

#### 基本例子：

父组件，首先在需要使用context的顶层创建context，并且设置**默认值**，默认值能够在组件树中没有匹配的Provider时使用，否则当子组件没有找到匹配的provider的时候，会接收到undefined

```
import { useState, createContext } from "react";
const MyContext = createContext<number | string>(0);

export const Message = () => {
	...
}
```

接着通过context传递下去，传递值可以是常量，也可以是state设置的变量，修改变量，context也会同步更新value

```
export const Message = () => {
  const [state, setState] = useState<number>(0);

  return (
    <MyContext.Provider value={state}>
      <div>
        <button onClick={() => setState(state + 1)}>点我设置state</button>
        <ChildComponent />
      </div>
    </MyContext.Provider>
  );
};
```

子组件进行使用，通过useContext将创建的context接收，然后就可以在组件中进行使用啦

```
const ChildComponent = () => {
  const value = useContext(MyContext);

  return (
    <div>
      <div>我是子组件</div>
      <div>我接收到的context-state是：{value}</div>
    </div>
  );
};
```

![image.png](http://p1.meituan.net/csc/71b94bb5a18a482d09df4f4153cc81b39484.png)

#### 覆盖组件树中的context

子组件B

```
const ChildComponentB = () => {
  const value = useContext(MyContext);

  return (
    <div>
      <div>我是子组件B</div>
      <div>我接收到的context-state是：{value}</div>
    </div>
  );
}
```

通过在provider中使用不同的值包装其他组件，可以覆盖掉原来的context给组件B

```
export const Message = () => {
  const [state, setState] = useState<number>(0);

  return (
    <MyContext.Provider value={state}>
      <div>
        <button onClick={() => setState(state + 1)}>点我设置state</button>
        <ChildComponent />
        <MyContext.Provider value={"覆盖value"}>
          <ChildComponentB />
        </MyContext.Provider>
      </div>
    </MyContext.Provider>
  );
};
```

如图：

![image.png](http://p0.meituan.net/csc/808a0185c7c63a21c97d2858fc8cd9e616129.png)



所以使用useContext，能帮助开发的时候，不需要将某些值通过props一层层传递下去，这样使得代码更加简洁可维护