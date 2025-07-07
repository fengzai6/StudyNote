## WebSocket

ws是一种在单个tcp连接上进行全双工通信的通信协议，能够和服务器进行持久性的连接，并进行双向通信。在不使用ws协议的时候，通常会使用轮询来获取最新消息，但是，这样会浪费较多带宽资源，而ws只需要进行一次握手连接就可以互相推送；

测试连接WebSocket：通过创建new WebSocket实例来连接某个ws地址，连接后可以监听打开，关闭和收到消息，可以对这些监听添加逻辑处理，如当收到消息就添加进消息列表当中。可以调用send方法给服务端发送消息，服务端收到消息处理后通过onmessage接受返回信息；



### demo项目：[fengzai6/MyReactDemo (github.com)](https://github.com/fengzai6/MyReactDemo)

目录路径 `/src/pages/demo/web-socket`
