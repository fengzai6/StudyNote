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