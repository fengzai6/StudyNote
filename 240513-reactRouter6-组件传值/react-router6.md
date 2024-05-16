## React Router 6

基础用法：

```tsx
import { Route, Routes } from "react-router-dom";

const Home = () => {
  return (
    <h1>首页<h1/>
  )
}

const My = () => {
  return (
    <h1>我的</h1>
  )
}

const RouterLink = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/my" element={<My />} />
    </Routes>
  )
}
```
最外层组件需要被Router包含，除了BrowserRouter还有HashRouter，后者会在网址中包含#，不够美观
```tsx
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <RouterLink />
    </BrowserRouter>
  )
}
```

BrowserRouter与HashRouter的优劣之分

BrowserRouter：

优点：

1、更好的url结构

2、更好的seo优化

缺点：

1、有时候需要服务器的配合，将所有指向都处理到index.html中，不然会404

2、不支持比较旧版浏览器

HashRouter

优点：

1、无需服务器配合

2、兼容性好

缺点：

1、URL不够好看

2、用户不方便记住网址



推荐使用`BrowserRouter` 



## `<Suspense>`

`<Suspense>` 允许在子组件完成加载前展示后备方案。

```
<Suspense fallback={<Loading />}>
  <MyComponent />
</Suspense>
```

可以将它放入Route中的element中进行使用

```
<Route path={/home} element={
	<Suspense fallback={<Loading/>}><Component/></Suspense>
}>
</Route>
```



## 嵌套路由

类似vue-router，react-router v6也能实现嵌套路由

`<router-view>` 对应 `<Outlet />`

嵌套例子

外层组件

```
import { Outlet } from "react-router-dom";

const ParentComponent = () => {
  return (
    <div>
      <h1>Parent Component</h1>
      <Outlet />
    </div>
  );
}
```

内嵌组件

```
const ChildComponent = () => {
  return (
    <div>
      <h1>Child Component</h1>
    </div>
  );
}
```

路由配置

```
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ParentComponent, ChildComponent } from "./component"

const App = () => {
	<BrowserRouter>
		<Routes>
			<Route path="parent" element={<ParentComponent /> }>
				<Route path="child" element={<ChildComponent />} />
			</Route>
		</Routes>
	</BrowserRouter>
}
```

显示如下，可以看到子组件通过父组件中的`<Outlet />`显示了出来：

![image.png](http://p0.meituan.net/csc/0f60f448ac4d20b8ce1477726494016c16701.png)



### 实现编写routes数组循环嵌套路由