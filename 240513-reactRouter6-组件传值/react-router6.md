## React Router 6

### 基础配置用法：

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



### `<Suspense>`优化白屏等待

`<Suspense>` 允许在子组件完成加载前展示后备方案，为了不在等待组件加载的时候那么尴尬，可以将Route中的element设置为如下：

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

为此可以编写一个简单的Loading组件来当等待组件的时候显示给用户

```
const Loading = () => (
	<div> 
		Loading...
	</div> 
)
```



### `<Link />` & `<Navigate />`

`<Link />`  类似于a标签，能够跳转到某个路由，跳转是基于当前url的，如果没有设置为`/page`的话，假如当前url为`/home`，则下面的link会跳转到`/home/page`

```
<Link to="page" >跳转</Link>
```

`<Navigate />` 能够重定向到某个路由，能够通过hook进行使用，`useNavigate`

例子:

```
const navigate = useNavigate();
navigate('/login');
navigate('/login', {replace: true});

// 组件方式
<Navigate to='/login' />
```





### 嵌套路由 & `<Outlet />`

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

编写一个这样的路由数组类型定义，孩子属性就直接递归属性即可

```ts
export interface IRouteProps {
  path: string;
  name: string;
  redirect?: string;
  element?: JSX.Element;
  children?: IRouteProps[];
}
```

那我们的路由数组就根据这个类型进行编写，例子如下routes：

```tsx
import { IRouteProps } from "./props";

import { Grocery } from "../pages/grocery";
import { Restaurant } from "../pages/restaurant";
import { Community } from "../pages/community";
import { Message } from "../pages/message";
import { Account } from "../pages/account";

export const routes: IRouteProps[] = [
  {
    path: "/grocery",
    name: "Grocery",
    redirect: "child",
    element: <Grocery />,
    children: [
      {
        path: "child",
        name: "Child",
        redirect: "grandchild",
        element: <Message />,
        children: [
          {
            path: "grandchild",
            name: "Grandchild",
            element: <Account />,
          },
        ],
      },
    ],
  },
  {
    path: "/restaurant",
    name: "Restaurant",
    element: <Restaurant />,
  },
  {
    path: "/community",
    name: "Community",
    element: <Community />,
  },
];
```

可以看到，我在grocery中设置了children路由，在children路由中还有grandchild，用来测试嵌套路由是否正常显示

接下来编写路由配置，在组件中**将routes传入routerVIews函数**，函数将进行循环遍历路由配置，并当有children路由的时候进行判断，以便递归循环，当然，也可以设置redirect进行重定向操作，避免只显示父组件而没有子组件的尴尬情况

```tsx
export const RouterLink = () => {
  const routerViews = (routes: IRouteProps[]) => {
    return routes.map((item: IRouteProps, index: number) => {
      return (
        <>
          {item.redirect && (
            <Route
              key={index}
              path={item.path}
              element={<Navigate to={item.redirect} replace />}
            />
          )}
          <Route key={index} path={item.path} element={item.element}>
            {item.children && routerViews(item.children)}
          </Route>
        </>
      );
    });
  };

  return (
    <Routes>
      {routerViews(routes)}
      <Route path="*" element={<Navigate to="/grocery" replace />} />
    </Routes>
  );
};
```

也可以手动多加一条没有配置的路由的重定向设置，让所有URL都有它的归宿～

嵌套效果如下，并且给grocery设置了重定向，不会没有孩子在，孩子一直都在：

![image.png](http://p0.meituan.net/csc/08379a04a9b0c7c3a3f9b612629ee61417281.png)

也可以通过lazy来让组件在第一次被渲染之前延迟加载组件的代码

```
const child = lazy(() => import('./child'))
```

