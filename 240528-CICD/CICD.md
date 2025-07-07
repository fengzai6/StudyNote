# Docker + CICD实践

## 本地docker测试

配置文件设置

```dockerfile
// 定义nginx为基础镜像
FROM nginx:stable-alpine
// 将本地构建的build文件复制到nginx的默认网页目录
COPY /build /usr/share/nginx/html
// 使用sed -i 修改nginx配置（/etc/nginx/conf.d/default.conf） -i表示直接修改原文件
// 12a 表示在12行后add内容
// 将所有404都交给index.html处理，确保所有请求都给React处理
RUN  sed -i '12a error_page 404 /index.html;' /etc/nginx/conf.d/default.conf
// 暴露端口80
EXPOSE 80
// 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

```
FROM node:16-alpine AS build

WORKDIR /web

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /web/build /usr/share/nginx/html

RUN  sed -i '12a error_page 404 /index.html;' /etc/nginx/conf.d/default.conf

RUN sed -i '/^http {/a \
    gzip on;\n\
    gzip_static on;' /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

将项目打包

```
npm run build
```

此时能看到build目录的产生

#### docker运行打包构建镜像

名字为小写，后接空格加点

```
docker build -f Dockerfile -t practivenacho .
```

#### 运行镜像

```
docker run -p 8080:80 -t practivenacho
```

