@echo off
echo 启动MND-MOS测试系统...

echo 1. 安装前端依赖...
call npm install

echo 2. 构建前端...
call npm run build

echo 3. 安装后端依赖...
cd server
call npm install

echo 4. 启动后端服务器...
call npm start

pause 