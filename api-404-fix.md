# API 404问题解决方案

## 问题描述
访问 `/api/hello` 等API端点时返回404错误。

## 解决方案

### 方案1：使用简化的vercel.json配置

将 `vercel.json` 替换为以下内容：

```json
{
  "version": 2,
  "functions": {
    "api/hello.js": {
      "runtime": "nodejs18.x"
    },
    "api/health.js": {
      "runtime": "nodejs18.x"
    },
    "api/ratings.js": {
      "runtime": "nodejs18.x"
    },
    "api/results.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 方案2：检查API文件格式

确保您的API文件格式正确：

```javascript
// api/hello.js
module.exports = (req, res) => {
  res.json({ msg: "hello world" });
};
```

### 方案3：使用Vercel CLI重新部署

```bash
# 1. 删除现有的.vercel目录（如果存在）
rm -rf .vercel

# 2. 重新初始化项目
vercel

# 3. 选择项目设置
# - 项目名称：mnd-mos-test
# - 确认部署设置

# 4. 部署到生产环境
vercel --prod
```

### 方案4：测试API端点

部署后测试以下端点：

1. **基础测试**：`https://your-project.vercel.app/api/test-api`
2. **Hello测试**：`https://your-project.vercel.app/api/hello`
3. **健康检查**：`https://your-project.vercel.app/api/health`

### 方案5：检查Vercel函数日志

```bash
# 查看函数日志
vercel logs

# 查看特定函数的日志
vercel logs --function=api/hello
```

## 常见问题

### 问题1：API文件不被识别
**原因**：文件路径或格式不正确
**解决**：确保API文件在 `api/` 目录下，使用正确的导出格式

### 问题2：路由冲突
**原因**：通配符路由捕获了API请求
**解决**：确保API路由在通配符路由之前

### 问题3：构建配置问题
**原因**：Vercel构建配置不正确
**解决**：使用简化的配置或明确指定函数

### 问题4：Node.js版本问题
**原因**：运行时版本不兼容
**解决**：指定正确的Node.js版本

## 测试步骤

1. **本地测试**：
   ```bash
   vercel dev
   # 访问 http://localhost:3000/api/hello
   ```

2. **部署测试**：
   ```bash
   vercel --prod
   # 访问 https://your-project.vercel.app/api/hello
   ```

3. **日志检查**：
   ```bash
   vercel logs --function=api/hello
   ```

## 如果仍然404

1. **检查项目结构**：
   ```
   your-project/
   ├── api/
   │   ├── hello.js
   │   ├── health.js
   │   └── ...
   ├── vercel.json
   └── package.json
   ```

2. **验证API文件权限**：
   ```bash
   ls -la api/
   ```

3. **重新创建项目**：
   ```bash
   # 删除现有部署
   vercel remove your-project-name
   
   # 重新部署
   vercel
   ```

4. **联系Vercel支持**：
   - 查看Vercel文档
   - 提交支持请求
   - 检查Vercel状态页面

## 成功标志

当API正常工作时，您应该看到：

- `GET /api/hello` 返回 `{"msg": "hello world"}`
- `GET /api/health` 返回健康状态信息
- `GET /api/test-api` 返回详细的请求信息

## 下一步

API正常工作后，继续设置：
1. MongoDB连接字符串
2. 环境变量
3. 前端应用部署 