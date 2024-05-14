## 鼠标事件处理

在React中，事件处理是通过在组件上绑定事件监听器来完成的。以下是一些常用的React事件处理方法：

1. **onClick**: 用于处理鼠标点击事件

```jsx
<button onClick={handleClick}>Click me</button>
```

2. **onChange**: 用于处理表单元素值变化的事件

```jsx
<input type="text" onChange={handleInputChange} />
```

3. **onSubmit**: 用于处理表单提交事件

```jsx
<form onSubmit={handleFormSubmit}>
  <button type="submit">Submit</button>
</form>
```

4. **onMouseEnter** 和 **onMouseLeave**: 分别用于处理鼠标进入和离开元素的事件等

```jsx
<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
  鼠标移入移开
</div>
```

5. **onScroll**: 用于处理滚动事件

```jsx
<div onScroll={handleScroll}>滚动事件</div>
```

6. **onFocus** 和 **onBlur**: 分别用于处理元素获得焦点和失去焦点的事件

```jsx
<input type="text" onFocus={handleFocus} onBlur={handleBlur} />
```

7. **onKeyDown**, **onKeyUp**, **onKeyPress**: 分别用于处理键盘按下、释放和按键事件

```jsx
<input type="text" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onKeyPress={handleKeyPress} />
```

8. **onDrag**, **onDragEnd**, **onDragEnter**, **onDragExit**, **onDragLeave**, **onDragOver**, **onDragStart**, **onDrop**: 用于处理拖放事件

```jsx
<div
  draggable
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
  onDragOver={handleDragOver}
  onDrop={handleDrop}
>
  拖动我
</div>
```

9. **onTouchStart**, **onTouchMove**, **onTouchEnd**, **onTouchCancel**: 用于处理触摸屏幕的事件。这些事件对于增强移动设备上的用户体验非常有用

```tsx
const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {}
<div onTouchStart={handleTouchStart}>Touch me</div>
```

10. **onCopy**, **onCut**, **onPaste**: 用于处理文本复制、剪切和粘贴的事件

```jsx
const handleCopy = (event: React.ClipboardEvent<HTMLDivElement>) => {}
<input onCopy={handleCopy} onCut={handleCut} onPaste={handlePaste} />
```

11. **onWheel**: 用于处理鼠标滚轮事件

```jsx
const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {};
<div onWheel={handleWheel}>Scroll me with wheel</div>
```

12. **onLoad** 和 **onError**: 用于处理图像、JavaScript 脚本和 CSS 样式表等资源的加载成功和加载失败事件

```jsx
const handleLoad = (event: React.SyntheticEvent<HTMLDivElement>) => {};
const handleError = (event: React.SyntheticEvent<HTMLDivElement>) => {};
<img src="image.png" onLoad={handleLoad} onError={handleError} />
```

如需要更好的ts支持，需要给event设置事件类型

还有许多的事件，都能在需要的时候发挥它的作用，帮助我们实现更好的交互逻辑