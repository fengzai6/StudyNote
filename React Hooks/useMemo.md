## React useMemo Hook

`useMemo` 它在每次重新渲染的时候能够缓存计算的结果。

```
const cachedValue = useMemo(calculateValue, dependencies)
```

它接受了两个参数：

第一个是一个无参数函数，返回所需缓存的结果 `() => {}`

第二个是由响应式变量组成的依赖数组 `[dependencies]`

react会在首次渲染的时候执行一次函数，并缓存结果，后面在重新渲染的时候，如果`dependencies`没有变化，则不会执行函数，而是直接返回上一次缓存的结果，就不需要重新计算

如果没有参数，每次重新渲染都会计算新的值

·**组件卸载会丢弃缓存值**

### 例子

```
import { useMemo, useState } from "react";
```

首先自定义一些todos数据

```
const todosData: string[] = [
  "Todo 1",
  "Todo 2",
  "Todo 3",
  "Todo 4",
  "Todo 5",
  "Todo 6",
  "Todo 7",
  "Todo 8",
];
```

自定义对于todos的hook，实现添加、移除、筛选的功能

```
const useTodos = () => {
  const [todos, setTodos] = useState<string[]>(todosData);

  const addTodo = (todo: string) => setTodos([...todos, todo]);

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const filterTodos = (todos: string[], num: number) => {
    const todesList = todos.slice(0, num);
    console.log(todesList);
    return todesList;
  };

  return { todos, addTodo, removeTodo, filterTodos };
};
```

而组件函数是这样的

```
export const Todos = () => {
  const { todos, addTodo, removeTodo, filterTodos } = useTodos();

  const [num, setNum] = useState<number>(5);
  
  const todosList = useMemo(() => filterTodos(todos, num), [todos, num]);

  const [todoIndex, setTodoIndex] = useState<number>(0);

  // 一个触发重新渲染的状态
  const [text, setText] = useState<string>("xxx");

  const todosItems = todosList.map((todo, index) => {
    return (
      <div key={index}>
        <span>{todo}</span>
        <button onClick={() => removeTodo(index)}>Remove</button>
      </div>
    );
  });

  return (
    <div>
      <p>{text}</p>
      <button onClick={() => setText("触发重新渲染"+ new Date())}>Change</button>
      <p>当前显示前{num}个todo</p>
      <button
        onClick={() => {
          addTodo(`new todo ${todoIndex + 1}`);
          setTodoIndex(todoIndex + 1);
        }}
      >
        Add
      </button>
      {todosItems}
      <button onClick={() => setNum(num + 5)}>Load More</button>
    </div>
  );
};
```

对应的页面如下：

![image.png](http://p0.meituan.net/csc/f4718cb97144ad0a82be39c9d517b14611578.png)

页面在首次渲染的时候，useMemo执行一次计算函数返回需要缓存的结果：

![image.png](http://p1.meituan.net/csc/b9048fe910074237bdf7f0ff733b3eae20201.png)

当我们点击add或者remove的时候，ussMemo会重新执行，因为对应的todos发生了变化

![image.png](http://p0.meituan.net/csc/4c8146b7d683ddbcee23a552769912be13551.png)

点击add的时候输出的没有变化是因为，返回的是前5个数据，而添加的数据在第9个

现在试试修改显示条数num

![image.png](http://p0.meituan.net/csc/11e228eedcb41bdb7ff4cad4d0fa37da49419.png)

现在可以看到之前新加的那条todo了，因为num发生了变化，所以useMemo也执行了一次



现在试试修改其他状态让组件重新渲染，看看useMemo是否会重新执行

![image.png](http://p0.meituan.net/csc/4f781f3b0ba8f794f75b026cfaaf020652142.png)

当点击了change后，修改了text的值，也让页面重新进行了渲染操作，但是可以发现，旁边的控制台没有新增输出，说明在依赖参数没有变化的情况下，useMemo没有执行计算函数，而是直接读取了之前计算的值来使用



### 性能考量

- 使用 `useMemo` 时，需要权衡内存使用和计算开销。如果计算非常轻量级，可能不值得使用 `useMemo`，因为缓存值本身也会占用内存
- 过度使用 `useMemo` 可能会导致代码难以理解和维护。只有在确实需要优化性能时才使用它



