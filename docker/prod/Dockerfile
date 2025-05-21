# 使用官方 Node.js 镜像作为构建环境
FROM node:20-alpine as build

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制项目文件
COPY . .

# 构建生产版本
RUN npm run build

# 使用 Nginx 作为生产服务器
FROM nginx:stable-alpine

# 将构建好的文件复制到 Nginx 的默认目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置
COPY docker/prod/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]