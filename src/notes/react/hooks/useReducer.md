## React useReducer Hook

`useReducer` 用于处理复杂的状态管理逻辑，和useState十分类似，不过useState更加适合处理简单的状态

useReducer 接受2个参数或者3个参数，可以是一个reducer函数和一个初始状态，并返回当前的状态和一个dispatch函数

```
const [state, dispatch] = useReducer(reducer, initialState);
```

3个参数就是，一个reducer，一个初始状态，还有个初始化函数，这样能够避免重新创建初始值

```
const [state, dispatch] = useReducer(reducer, initialState, createInitialState);
```

#### 基本使用

首先设置一些基本的参数和函数

```
interface IState {
  name: string;
  age: number;
}

interface IAction {
  type: string;
  name: string;
  age: number;
}

const initial = {
  name: "nobody",
  age: 0,
};

const createInitialState = () => {
  return {
    name: "张三",
    age: 18,
  };
};


const reducer = (state: IState, action: any) => {
  console.log("state", state);
  console.log("action", action);
  switch (action.type) {
    case "changeName":
      return {
        ...state,
        name: action.name,
      };
    case "changeAge":
      return {
        ...state,
        age: action.age,
      };
    default:
      return state;
  }
};
```

组件中使用

由于需要单个设置name的想法，可以将上面action设置为any，或者全部传入，再另外覆盖个值

```
export const Message = () => {
  const [value, dispatch] = useReducer(reducer, initial, createInitialState);

  return (
    <div>
      <div>我是消息页面</div>
      <div>我接收到的valueName是：{value.name}</div>
      <div>我接收到的valueAge是：{value.age}</div>
      <button onClick={() => dispatch({ type: "changeName", name: "李四"})}>
        点我设置valueName
      </button>
      <button onClick={() => dispatch({ type: "changeAge", ...value, age: value.age + 1  })}>
        点我设置valueAge
      </button>
      <ChildComponent />
      
      <Outlet />
    </div>
  );
};
```

当首次渲染，能看到的是初始化函数设置的值

![image.png](http://p0.meituan.net/csc/79cb3719e73ce994004d5a8073dad9bb14379.png)

当点击设置按钮后，执行相应的状态更新，能看到如下改变

![image.png](http://p0.meituan.net/csc/98fc46dd9a64b04baac8da1339c73a3a14443.png)



所以，当状态逻辑复杂并且包含多个子值的时候，可以使用useReducer而不是useState，useReducer将状态更新逻辑提取到reducer函数中，便于测试和复用

对于简单的状态管理，还是推荐使用useState会更加直观和间接