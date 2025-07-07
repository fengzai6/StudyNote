## React中类组件与函数组件生命周期

react中有两种组件的写法，类组件和函数组件，依照React团队的说法，他们是更支持使用函数组件的，甚至支持升级或者替换掉类组件。因为针对函数组件，是做了更多的优化的，包括避免不必要的校验和内存分支。

React 生命周期指的是组件从创建到卸载的整个过程，每个过程都有对应的钩子函数会被调用，它主要有以下几个阶段：

- 挂载阶段 - 组件实例被创建和插入 DOM 树的过程
- 更新阶段 - 组件被重新渲染的过程
- 卸载阶段 - 组件从 DOM 树中被删除的过程

### Class Component 生命周期

#### 挂载阶段

##### constructor(props)  构造函数

```
constructor(props) {
    // 初始化props
    super(props);
    // 声明state
    this.state = { number: 0 };
  }
```

##### componentWillMount() 组件挂载前钩子

能够在组件挂载前做些什么，现已经弃用

```
componentWillmount(): void {
  console.log("componentWillUnmount");
}
```

##### componentDidMount()  组件挂载成功钩子

当组件成功挂载到真实的dom的时候，可以通过这个钩子来监听dom事件，获取真实dom

```
componentDidMount() {
    console.log("componentDidMount");
    this.setState({ number: 1 });
  }
```

#### 更新阶段

##### componentDidUpdate()  组件更新后调用的钩子

```
componentDidUpdate() {
  console.log("componentDidUpdate");
}
```

#### 卸载阶段

##### componentWillUnmount()  组件卸载前的钩子

能够在这里进行一些善后工作，清理计时器和监听等等

```
componentWillUnmount(): void {
  console.log("componentWillUnmount");
}
```



### Function Component 生命周期

`Function Component` 是更彻底的状态驱动抽象，甚至没有 `Class Component` 生命周期的概念，只有一个状态，而 React 负责同步到 DOM

在类组件当中的 `componentDidMount` 、 `componentDidUpdate` 、 `componentWillUnmount` 在函数组件当中都可以用`useEffect` Hook 模拟生命周期行为



#### useEffect

这是react中的一个执行副作用的hook，能够在渲染后执行某些操作，didMount也是update钩子

```
useEffect(() => {
    console.log("componentDidMount", count);
    return () => {
      console.log("componentWillUnmount", count);
    };
  }, [count]);
```



### 总结区分

- 类组件拥有完整的生命周期方法，但代码量相对较多，性能相对较低
- 函数组件使用 Hook 来模拟生命周期行为，代码量相对较少，性能相对较高，是 React 未来的发展方向
