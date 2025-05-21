# 使用官方 Node.js 镜像作为基础镜像
FROM node:20

# 设置工作目录
WORKDIR /app

# 安装开发环境的必要工具
RUN apt-get update && apt-get install -y vim

# 复制 package.json 和 package-lock.json (如果存在)
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有文件到容器中
COPY . .

# 暴露开发服务器端口
EXPOSE 80

# 启动开发服务器
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]