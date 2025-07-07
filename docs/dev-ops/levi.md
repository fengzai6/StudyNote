# 考核项目

配置自动化部署并发布版本



## 📌本地测试

### 🎯一、配置文件

1. 修改你的脚手架打包配置，以ts.config.ts@2.8为例

   ~~~json
   import * as path from "path";
   import react from "@vitejs/plugin-react";
   import { defineConfig } from "vite";
   
   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
     server: { port: 3000 },
     //修改静态包输出文件名
     build: { outDir: "build" },
   });
   
   ~~~

   此外别忘了在.gitgnoro追加你的静态包

   ~~~shell
   # Logs
   logs
   *.log
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*
   pnpm-debug.log*
   lerna-debug.log*
   
   node_modules
   dist
   dist-ssr
   #追加 “build”
   build
   yarn.lock
   *.local
   
   # Editor directories and files
   .vscode/*
   !.vscode/extensions.json
   .idea
   .DS_Store
   *.suo
   *.ntvs*
   *.njsproj
   *.sln
   *.sw?
   
   ~~~

   

2. 根目录下新建Dockerfile脚本

    ~~~dockerfile
    #Dockerfile
    FROM nginx:stable-alpine
    
    #注意的配置的outfile，如果没配置会因脚手架或版本存在差异。
    COPY /build /usr/share/nginx/html
    
    RUN  sed -i '12a error_page 404 /index.html;' /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    ~~~



3. 打包项目`npm build`



4. 或者将build的阶段放到dockfile中

   ~~~dockerfile
   FROM node:16-alpine AS build#构建过程
   
   #工作目录
   WORKDIR /web
   
   COPY package.json ./
   
   RUN yarn install
   
   COPY . .
   
   RUN yarn build
   
   FROM nginx:stable-alpine
   
   #注意构建过程
   COPY --from=build /web/build /usr/share/nginx/html
   
   RUN  sed -i '12a error_page 404 /index.html;' /etc/nginx/conf.d/default.conf
   
   RUN sed -i '/^http {/a \
       gzip on;\n\
       gzip_static on;' /etc/nginx/nginx.conf
   
   EXPOSE 80
   
   CMD ["nginx", "-g", "daemon off;"]
   ~~~

   

### 🎯三、构建项目

以打包文件practivelevi为例



1. 打包镜像`docker build -f Dockerfile -t practivelevi .`



2. 运行时 `docker run -p 8188:80 -t practicelevi`



3. 浏览器输入`http://localhost:8188/`



### 🔧日志 

1. 报错：ERROR: invalid tag "practiveLevi": repository name must be lowercase

   🥚：打开控制台输入 `查看本地镜像，发现镜像文件名输入错了，把practiveLevi改为practivelevi。注意镜像命名全小写。

2. 本地打开`http://localhost:8188/`发现接口请求跨域

   🥚：不用管

	



## 📌ci

### 🎯一、创建你的项目

1. 进入组织，点击步骤如下：

![image-20240524080201138](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524080201138.png)

2. 在组织下点击新建项目。

![image-20240524080651878](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524080651878.png)

3. 选择手动创建，然后填写Name，命名规范为 **PractiseFor(你的名字)** 。

![image-20240524080745889](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524080745889.png)



### 🎯二、添加配置

1. 打开并在你的项目添加Build配置，步骤如下：

![image-20240524081546429](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524081546429.png)

2. 选择手动创建，Name规范为 **Build**。

![image-20240524081710378](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524081710378.png)

3. 打开build配置页

![image-20240524081822900](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524081822900.png)

4. 点击显示更多，方便配置。

![image-20240524081957785](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524081957785.png)

5. 在Version Control Setting中配置你的gitlab仓库，填写完信息后点击保存。

#### ✏️配置清单：

| 项目（从上往下）        | 备注                                             |
| ----------------------- | ------------------------------------------------ |
| VCS Root                | 填写你配置信息，命名规范为 PractiseFor(你的名字) |
| General Settings        | 填写你仓库的信息                                 |
| Authentication Settings | 填写你的账号信息                                 |



![image-20240524082145292](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524082145292.png)

![](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524082629610.png)

6. 在Build Steps 中配置你的管道流

#### ✏️配置清单：

| Build Step（从上往下）  | Parameters Description                                     |
| ----------------------- | ---------------------------------------------------------- |
| 1. GitVersion           | git                                                        |
| 2. Install Dependencies | 前端项目安装依赖                                           |
| 3. Build                | 打包                                                       |
| 4. Docker Login         | docker                                                     |
| 5. Docker Build Image   | 编译打包镜像。⚠️镜像文件命名规范：practise4（你的名字小写） |
| 6. Docker Push Image    | 推送镜像。⚠️镜像文件命名规范：practise4（你的名字小写）     |
| 7. Docker Remove        | 删除镜像。⚠️镜像文件命名规范：practise4（你的名字小写）     |

   ![image-20240524165822379](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524165822379.png)

严格按照1-7步骤排序，点击更多可以复制步骤

![image-20240524170527297](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524170527297.png)



7. 配置环境变量，输入基本信息并选择值

   ![image-20240524171753418](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524171753418.png)

   

8. 添加tiggers，选择然后点击确认即可。

   ![image-20240529084233675](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240529084233675.png)

   

9. 添加agent，输入基本信息并选择设备

   ![image-20240524171919801](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524171919801.png)

10. 配置好后，选择配置好docker脚本的分支尝试run一下

   ![image-20240524172201515](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524172201515.png)



### ⚠️你需要注意的

你已经很完美了



### 🔧三、日志

1. 报错：Process exited with code 1 (Step: GitVersion (Command Line))

   没有配置步骤7

2. ⚠️自动生成id为大驼峰

3. ⚠️docker镜像名称要记住

4. 对准一下生成的Build number，有可能因为不可抗力造成错误。

   ![image-20240524152802204](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524152802204.png)

   ![image-20240524153027286](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524153027286.png)




## 📌cd

### 🎯一、创建你的项目

1. 在项目页中新建你的项目，项目命名规范为`PractiseFor（你的名字大写开头）`。

   ![image-20240524172629940](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524172629940.png)

2. 打开你的项目

   ![image-20240524172922239](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524172922239.png)
   
   

### 🎯 二、Deloy web

kubernetes containers 容器部署


1. 新增步骤

   ![image-20240524174114958](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524174114958.png)

2. 选择模版

   ![image-20240524174325245](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524174325245.png)

2. 修改步骤名称为Deploy web，然后**参考团队的配置完成你的容器部署**，然后点击保存

   ![image-20240524174503744](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524174503744.png)

#### ✏️配置清单

（default的项目就不用手动配置，默认就好）

Process 基本信息

|              |            |
| ------------ | ---------- |
| Step Name    | 输入项目名 |
| On Behalf Of | 选择资源   |



  [**Deployment**](https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/deployment/) 

  >意义：描述 Deployment 中的目标状态
  >
  >一个 Deployment 为 [Pod](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/) 和 [ReplicaSet](https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicaset/) 提供声明式的更新能力。

|                                |                                                           |
| ------------------------------ | --------------------------------------------------------- |
| Deployment                     | 输入 deploy-名称-web                                      |
| Kubernetes Object Status Check | 选项                                                      |
| Volumes                        | 新建键值信息？xxx.web->xxxweb                             |
| Container                      | 1. Image Details 填写信息 <br />2. Volume Mounts 添加键值 |
| Namespace                      |                                                           |



  **Service**：

|               |          |
| ------------- | -------- |
| Service Name  | 输入名称 |
| Service Ports | 增加键值 |



  **Ingress**：default



  **Config Map**

|                  |                                                              |
| ---------------- | ------------------------------------------------------------ |
| Config Map Name  | 输入名称                                                     |
| Config Map Items | 🔔添加键值，Key一般为appsetting.json，既是项目public的appsetting.json文件，值为里面对象的属性名格式如下图所示 |





**Secret**：default




### 🎯三、Deloy ingress

Kubernetes Ingress 资源

1. 新增步骤

   ![image-20240524174114958](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524174114958.png)



2. 选择模版 `DEPLOY KUBERNETES INGRESS RESOURCE`

   ![image-20240524175018879](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524175018879.png)



3. 修改步骤名称为Deploy ingress，然后**参考团队的配置完成你的容器部署**，然后点击保存

   ![image-20240524175150081](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524175150081.png)

#### **✏️配置清单**

**（default的项目就不用手动配置，默认就好）**

**ingress基本信息**

1. Step Name 输入名称

1. On Behalf Of 选择资源
2. Kubernetes Object Status Check ？ 
3. Ingress Name 输入名称
4. Ingress Annotations 增加键值
5. Ingress Host Rules 增加键值
6. Ingress TLS 增加键值
7. Namespace 输入名称



**Conditions**：defalut



### 🎯四、配置参数

1. 打开项目变量页，然后**参考团队的配置完成你的容器部署**，然后点击保存

   	![image-20240524175716997](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524175716997.png)

   

#### ✏️配置清单

   （default的项目就不用手动配置，默认就好）

   1. ngressBaseDomainName 域名
   2. jsVersion JavaScript 版本
   3. languagecode 语言
   4. namespace 你的环境
   5. serverUrl 服务器
   6. sourceSyste 资源系统
   7. tlsSecret 证书
   8. CPULimits 等等...



​	

### 🎯五、CAEATE RELEASE

1. 点击CAEATE RELEASE，版本号写Build number,`+`号要改为`-`号

   ![image-20240524181331357](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524181331357.png)

   ![image-20240524181253853](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524181253853.png)

2. deploy **test**你的资源，完成测试

   ![image-20240524181526566](/Users/levi/Library/Application Support/typora-user-images/image-20240524181526566.png)

### 🔧日志

1. ci跑完后在CAEATE RELEASE

2. ⚠️要知道和记住自己配置的集群、域名、地址。要询问团队怎么配置

   |      | 位置                                  |
   | ---- | ------------------------------------- |
   | 集群 | process基本信息中的 “On Behalf Of“    |
   | 域名 | 项目变量的IngressBaseDomainName变量值 |
   | 地址 | 项目变量的url地址                     |

   



## 🎉发布

1. **合并pr**

![image-20240524181816036](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524181816036.png)

2. **打tag包**，提前打开 New Tag页面，在分支merged后确保下一步点击Create Tag创建Tag

   ![image-20240524182233325](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524182233325.png)

	

3. **ci run**，Build number与tag版本一致表示构建成功了

![image-20240524182322842](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524182322842.png)

4. **cd CAEATE RELEASE**，test完后后续操作根据团队安排

   ![image-20240524182442740](https://raw.githubusercontent.com/levi33Y/Pictures/main/image-20240524182442740.png)





流程结束👏