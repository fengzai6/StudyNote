## WebRTC的了解与demo

- `WebRTC`（Web Real-Time Communication）即网页即时通信，是一个支持网页浏览器进行实时语音对话或视频对话的API。
- `WebSocket`是一种在单个TCP连接上进行全双工通信的协议。在 WebSocket 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。



简单说一下流程，如浏览器 A 想和浏览器 B 进行音视频通话：

1. A、B 都连接信令服务器（ws）；
2. A 创建本地视频，并获取会话描述对象（`offer sdp`）信息；
3. A 将 `offer sdp` 通过 ws 发送给 B；
4. B 收到信令后，B 创建本地视频，并获取会话描述对象（`answer sdp`）信息；
5. B 将 `answer sdp` 通过 ws 发送给 A；
6. A 和 B 开始打洞，收集并通过 ws 交换 ice 信息；
7. 完成打洞后，A 和 B 开始为安全的媒体通信协商秘钥；
8. 至此， A 和 B 可以进行音视频通话。



从上述流程，可以发现**通信双方在建立连接前需要交换信息**，这也就是开头提到的 `WebSocket` 充当的角色：信令服务器，用于转发信息。而 WebRTC **不借助中间媒介** 的意思是，在建立对等连接后，不需要借助第三方服务器中转，而是直接在两个实体（浏览器）间进行传输。



### 代码实现

#### 信令服务端

本地信令服务器 ，用于等下前端的信息传输

***ws.js***

```js
import express from "express";
import expressWs from "express-ws";

const app = express();
const wsInstance = expressWs(app);

// Websocket 服务
app.ws("/", (ws) => {
  ws.on("message", (data) => {
    if (data === "ping") {
      ws.send("pong");
      return;
    }
    // 广播消息 除了自己
    wsInstance.getWss().clients.forEach((server) => {
      if (server !== ws) {
        server.send(data);
      }
    });
  });
});

app.listen(8080, () => {
  console.log("Websocket server start at 8080 port 🎉");
});
```

运行该文件

```bash
node ws.js
```

#### 前端- react

```ts
export const useAction = () => {
  const message: IMessageFn = {
    log: (content: string) => {
      setLogMessage((prev) => [
        ...prev,
        {
          type: "log",
          content: new Date().toLocaleTimeString() + ": " + content,
        },
      ]);
    },
    error: (content: string) => {
      setLogMessage((prev) => [
        ...prev,
        {
          type: "error",
          content: new Date().toLocaleTimeString() + ": " + content,
        },
      ]);
    },
  };
	// 一些变量
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [isOffer, setIsOffer] = useState<boolean>(false);
  const [logMessage, setLogMessage] = useState<IMessageProps[]>([]);
  
  // 。。。other
```

**第一步**

一个函数用来控制连接信令服务器，使用new创建RTCPeerConnection传输对象

```ts
const handleConnect = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    message.log("信令通道（WebSocket）连接中......");
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      message.log("信令通道（WebSocket）已连接！");
    };

    socketRef.current.onerror = () => message.error("信令通道创建失败！");

    // 监听消息，根据消息类型进行处理
    socketRef.current.onmessage = (e) => {
      if (!peerConnection.current) {
        return;
      }

      const { type, sdp, iceCandidate } = JSON.parse(e.data);

      if (type === "answer") {
        // 当接收到 Answer SDP 时，设置远程描述
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription({ type, sdp })
        );
      } else if (type === "answer_ice") {
        // 当接收到 Answer ICE 时，添加到连接中
        peerConnection.current.addIceCandidate(iceCandidate);
      } else if (type === "offer") {
        // 当接收到 Offer SDP 时，开始直播
        startLive(new RTCSessionDescription({ type, sdp }));
      } else if (type === "offer_ice") {
        // 当接收到 Offer ICE 时，添加到连接中
        peerConnection.current.addIceCandidate(iceCandidate);
      }

      if (type === "toggleVideoPause") {
        toggleVideoPause(true);
      }
    };

    // 创建 RTCPeerConnection 实例
    const peer = new RTCPeerConnection();

    peerConnection.current = peer;

    // 监听远程流数据，将远程流添加到远程视频元素
    peerConnection.current.ontrack = (e) => {
      if (e && e.streams) {
        message.log("收到对方音频/视频流数据...");
        remoteVideoRef.current!.srcObject = e.streams[0];
      }
    };

    const target = isOffer ? "offer" : "answer";
    // 监听 ICE 候选人，发送到对方
    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        message.log("搜集并发送候选人");
        socketRef.current?.send(
          JSON.stringify({
            type: `${target}_ice`,
            iceCandidate: e.candidate,
          })
        );
      } else {
        message.log("候选人收集完成！");
      }
    };
  };
```

**第二步**

当双方都连接上信令和创建了RTCPeerConnection 实例后，发起方可以开始直播，拿到本地媒体流（[MediaStream](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream)）后，需要将其中所有媒体轨道（[MediaStreamTrack](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStreamTrack)）添加到轨道集，这些轨道将被发送到另一对等方

```ts
const startLive = async (offerSdp?: RTCSessionDescription) => {
    let localStream: MediaStream;

    message.log("开始获取摄像头/麦克风...");
    try {
      // 暂时仅获取麦克风
      localStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      message.log("摄像头/麦克风获取成功！");

      localVideoRef.current!.srcObject = localStream;
    } catch (error) {
      return message.error("摄像头/麦克风获取失败！");
    }

    message.log(
      `------ WebRTC ${isOffer ? "发起方" : "接收方"}流程开始 ------`
    );

    if (!peerConnection.current) {
      return;
    }

    message.log("将媒体轨道添加到轨道集");
    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream);
    });

    if (isOffer) {
      message.log("创建 Offer SDP");
      const offer = await peerConnection.current.createOffer();

      message.log("设置本地 Offer SDP");
      await peerConnection.current.setLocalDescription(offer);

      message.log("发送 Offer SDP");
      socketRef.current?.send(
        JSON.stringify({
          type: "offer",
          sdp: offer.sdp,
        })
      );
    } else {
      if (!offerSdp) {
        return message.error("Offer SDP 不存在！");
      }

      message.log("设置远程 Offer SDP");
      await peerConnection.current.setRemoteDescription(offerSdp);

      message.log("创建 Answer SDP");
      const answer = await peerConnection.current.createAnswer();

      message.log("设置本地 Answer SDP");
      await peerConnection.current.setLocalDescription(answer);

      message.log("发送 Answer SDP");
      socketRef.current?.send(
        JSON.stringify({
          type: "answer",
          sdp: answer.sdp,
        })
      );
    }
  };
```

当运行这个函数后，发起方创建SDP发送到信令服务器，当远端窗口收到后，就会创建远程的SDP并回传给发起方，以启动与远程对等端的新WebRTC连接

通过不断收集ICE信息（[onicecandidate](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate)），发起方和应答方最终将建立一条最优的连接方式，此时会触发 [ontrack](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack) 回调，即可获取到对等方的媒体流。



### demo项目：[fengzai6/MyReactDemo (github.com)](https://github.com/fengzai6/MyReactDemo)

目录路径 `/src/pages/demo/web-rtc`



### 1、运行项目

```bash
yarn
yarn run dev
```

### 2、然后新建终端运行WebSocket

运行WebSocket服务用于创建信令服务

```bash
cd ./src/pages/demo/web-rtc
node ws.js
```

### 3、连接ws并开始直播

打开两个浏览器窗口，其中一个设置为发起方

![image.png](https://p1.meituan.net/csc/ac22443ef2db5b9110d8ab32df325eb117342.png)

两个窗口都点击连接ws

![image.png](https://p0.meituan.net/csc/a0dcf86864ca960b97e85b158b072de422203.png)

然后由 `发起方 `点击开始直播即可开始

![image.png](https://p0.meituan.net/csc/ae5bc2c0433342d1058eba48147d0f29155298.png)