@echo off
echo 🚀 Vercel API 专用部署脚本
echo =========================

echo.
echo 1. 清理现有配置...
if exist .vercel rmdir /s /q .vercel

echo.
echo 2. 检查API文件...
if exist api\hello.js (
    echo ✅ api/hello.js 存在
) else (
    echo ❌ api/hello.js 不存在
    pause
    exit /b 1
)

echo.
echo 3. 检查vercel.json...
if exist vercel.json (
    echo ✅ vercel.json 存在
) else (
    echo ❌ vercel.json 不存在
    pause
    exit /b 1
)

echo.
echo 4. 开始部署...
vercel --yes

echo.
echo 5. 部署完成！测试API...
echo 请访问以下URL测试：
echo - https://your-project.vercel.app/api/hello
echo - https://your-project.vercel.app/api/test-api

echo.
pause 