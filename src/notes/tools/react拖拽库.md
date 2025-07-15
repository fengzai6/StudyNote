## 拖拽库

### @hello-pangea/dnd （前身@react-beautiful-dnd）

**核心特点**

- 美丽[自然](https://github.com/hello-pangea/dnd/blob/HEAD/docs/about/animations.md)的物品💐运动
- [可访问](https://github.com/hello-pangea/dnd/blob/HEAD/docs/about/accessibility.md)：强大的键盘和屏幕阅读器支持 ♿️
- [性能极高](https://github.com/hello-pangea/dnd/blob/HEAD/docs/support/media.md) 🚀
- 干净而强大的 API，易于上手
- 与标准浏览器交互配合得非常好
- [不固执己见的造型](https://github.com/hello-pangea/dnd/blob/HEAD/docs/guides/preset-styles.md)
- 无需创建额外的包装器 dom 节点 - flexbox 和焦点管理友好！

安装

```
# npm
npm install @hello-pangea/dnd --save

# pnpm
pnpm add @hello-pangea/dnd

# yarn
yarn add @hello-pangea/dnd
```

Npm文档：[@hello-pangea/dnd - npm (npmjs.com)](https://www.npmjs.com/package/@hello-pangea/dnd)

#### 使用

相关导入

```tsx
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { useState } from "react";
```



设置state

```tsx
const [dataList, setDataList] = useState([
    {
      id: "column-1",
      items: [
        {
          id: "item-1",
          content: "item 1",
        },
        {
          id: "item-2",
          content: "item 2",
        },
        {
          id: "item-3",
          content: "item 3",
        },
        {
          id: "item-4",
          content: "item 4",
        },
      ],
    },
    。。。
 ])
```

上面展示了第一个列表的结构，不过先在最外层需要使用`<DragDropContext/>`进行包裹，同时必须传入onDragEnd回调函数

```tsx
<DragDropContext onDragEnd={onDragEnd}>
  ...  
</DragDropContext>
```

![image.png](https://user-images.githubusercontent.com/2182637/53607406-c8f3a780-3c12-11e9-979c-7f3b5bd1bfbd.gif)

接下来，需要定一个onDragEnd函数来处理拖拽结束的逻辑

```tsx
const onDragEnd: OnDragEndResponder = (result) => {
		// 将目标落点和源点结构出来
    const { destination, source } = result;
		// 如果没有目标点，返回
    if (!destination) {
      return;
    }
		// 如果目标和源位置一致，返回
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
		// 原数据的备份
    const newDataList = [...dataList];
		// 找到对应的数据树
    const sourceData = newDataList.find(
      (data) => data.id === source.droppableId
    );

    const destinationData = newDataList.find(
      (data) => data.id === destination.droppableId
    );
		
    if (sourceData && destinationData) {
      // 移除 sourceData 中的 item
      const [removed] = sourceData.items.splice(source.index, 1);
      // 將移除的 item 插入 destinationData 中
      destinationData.items.splice(destination.index, 0, removed);
    }

    setDataList(newDataList);
  };
```

上面处理好结束的逻辑后，就是我们拖拽组件的使用了，这里展示的就是在上面的上下文组件中的省略号，通过对数据的遍历，展示出两个列表

```tsx
{dataList.map((data) => (
	// 必须唯一id
  <Droppable key={data.id} droppableId={data.id}>
    {(provided) => (
      <div
      	// 必备设置 ref & 将props导入
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="flex flex-col p-2 m-2 w-64 bg-gray-100 float-left"
      >
        {data.items.map((item, index) => (
        	// 拖拽组件元素必须唯一ID
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
              <div
              	// 必备设置的ref & 相关的props
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="p-2 m-2 bg-white border border-gray-300 rounded-md"
              >
                {item.content}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
))}
```

如图所示，显示出两个列表，可以在自己的兄弟间拖拽移动，也可以去“串门”到别人的家里

![image.png](https://p0.meituan.net/csc/3bbfea9a2ec2b3e94007d49e63852ddf8691.png)

像item1也可以移动到item5的上面，item6可以去item8的下面

![image.png](https://p0.meituan.net/csc/de9f47b757f0e3d049fcc02f6eed09729882.png)

#### 键盘支持

使用 `tab` 选中后，按空格➕方向键即可在上下左右中进行移动