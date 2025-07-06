# MND-MOS测试系统部署指南

## 1. 本地开发环境

### 前端开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve
```

### 后端开发
```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 2. 生产环境部署

### 方法一：使用Vercel（推荐）

1. **准备前端构建**
```bash
# 构建前端
npm run build
```

2. **部署到Vercel**
   - 注册 [Vercel](https://vercel.com) 账号
   - 连接GitHub仓库
   - 配置构建命令：`npm run build`
   - 配置输出目录：`dist`
   - 配置环境变量（如果需要）

3. **部署后端API**
   - 在Vercel中创建API函数
   - 或者使用其他服务如Railway、Render等

### 方法二：使用传统服务器

1. **服务器要求**
   - Node.js 16+
   - 支持HTTPS
   - 域名（可选）

2. **部署步骤**
```bash
# 在服务器上克隆项目
git clone <your-repo-url>
cd mnd-mos-test

# 安装前端依赖并构建
npm install
npm run build

# 安装后端依赖
cd server
npm install

# 启动后端服务
npm start
```

3. **使用PM2管理进程**
```bash
# 安装PM2
npm install -g pm2

# 启动服务
pm2 start server.js --name "mnd-mos-test"

# 设置开机自启
pm2 startup
pm2 save
```

### 方法三：使用Docker

1. **创建Dockerfile**
```dockerfile
FROM node:16-alpine

WORKDIR /app

# 复制前端文件
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 复制后端文件
COPY server ./server
WORKDIR /app/server
RUN npm install

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
```

2. **构建和运行**
```bash
docker build -t mnd-mos-test .
docker run -p 3000:3000 mnd-mos-test
```

## 3. 环境配置

### 前端环境变量
创建 `.env.production` 文件：
```
VUE_APP_API_BASE_URL=https://your-api-domain.com/api
```

### 后端环境变量
```bash
# 端口配置
PORT=3000

# 数据库配置（如果使用其他数据库）
DATABASE_URL=your-database-url
```

## 4. 域名和HTTPS

1. **购买域名**（推荐）
   - 阿里云、腾讯云等
   - 配置DNS解析

2. **配置HTTPS**
   - 使用Let's Encrypt免费证书
   - 或购买SSL证书

3. **配置反向代理**（Nginx示例）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 5. 数据管理

### 查看测试结果
```bash
# 访问API获取结果
curl https://your-domain.com/api/results
```

### 导出数据
```bash
# 从SQLite数据库导出
sqlite3 server/ratings.db "SELECT * FROM ratings;" > results.csv
```

## 6. 监控和维护

1. **日志监控**
   - 使用PM2日志：`pm2 logs`
   - 配置日志轮转

2. **性能监控**
   - 使用Vercel Analytics
   - 或配置Google Analytics

3. **备份策略**
   - 定期备份数据库
   - 使用Git版本控制

## 7. 常见问题

### 跨域问题
确保后端配置了CORS：
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

### 图片加载问题
确保图片路径正确，建议使用CDN或对象存储服务。

### 数据库权限问题
确保数据库文件有正确的读写权限。

## 8. 安全建议

1. **API安全**
   - 添加请求频率限制
   - 验证输入数据
   - 使用HTTPS

2. **数据安全**
   - 定期备份数据
   - 加密敏感信息
   - 限制数据库访问

3. **服务器安全**
   - 更新系统和依赖
   - 配置防火墙
   - 使用强密码 