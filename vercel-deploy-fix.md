# Vercel部署问题修复指南

## 问题诊断

您遇到的Vercel CLI本地部署问题主要有以下几个原因：

### 1. 配置问题已修复
- ✅ 已更新 `vercel.json` 配置
- ✅ 添加了Vue.js前端构建配置
- ✅ 修复了路由配置

### 2. 环境变量设置
您需要在Vercel中设置MongoDB连接字符串：

```bash
# 在Vercel项目设置中添加环境变量
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/mnd-mos-test?retryWrites=true&w=majority
```

## 部署步骤

### 步骤1：设置MongoDB Atlas（如果还没有）
1. 注册 [MongoDB Atlas](https://www.mongodb.com/atlas)
2. 创建免费集群
3. 获取连接字符串
4. 替换用户名、密码和集群地址

### 步骤2：使用Vercel CLI部署

```bash
# 1. 安装Vercel CLI（如果还没有）
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 在项目根目录运行
vercel

# 4. 按照提示操作：
# - 选择项目名称
# - 确认部署设置
# - 等待部署完成
```

### 步骤3：设置环境变量

```bash
# 设置MongoDB连接字符串
vercel env add MONGODB_URI

# 重新部署以应用环境变量
vercel --prod
```

## 常见错误及解决方案

### 错误1：构建失败
**原因**：Vue.js构建配置问题
**解决**：已修复 `vercel.json` 配置

### 错误2：API函数无法连接数据库
**原因**：缺少MongoDB连接字符串
**解决**：设置 `MONGODB_URI` 环境变量

### 错误3：前端路由404
**原因**：路由配置不正确
**解决**：已修复路由配置

### 错误4：函数执行超时
**原因**：MongoDB连接超时
**解决**：检查网络连接和数据库配置

## 测试部署

部署完成后，测试以下端点：

1. **前端页面**：`https://your-project.vercel.app`
2. **健康检查**：`https://your-project.vercel.app/api/health`
3. **保存评分**：`https://your-project.vercel.app/api/ratings` (POST)
4. **获取结果**：`https://your-project.vercel.app/api/results` (GET)

## 本地测试

在部署前，您可以在本地测试：

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 使用Vercel CLI本地开发
vercel dev
```

## 故障排除

### 如果仍然无法部署：

1. **检查Vercel CLI版本**：
   ```bash
   vercel --version
   ```

2. **清除缓存**：
   ```bash
   vercel --clear-cache
   ```

3. **查看详细日志**：
   ```bash
   vercel --debug
   ```

4. **检查项目配置**：
   ```bash
   vercel inspect
   ```

### 如果API无法工作：

1. 检查环境变量是否正确设置
2. 查看Vercel函数日志
3. 确认MongoDB Atlas网络访问设置
4. 测试数据库连接

## 成功部署后的验证

1. 访问前端页面，确认Vue.js应用正常加载
2. 测试图片显示功能
3. 提交评分数据
4. 查看结果统计

## 联系支持

如果问题仍然存在：
1. 查看Vercel部署日志
2. 检查MongoDB Atlas连接
3. 确认所有环境变量已设置
4. 联系Vercel支持或提交GitHub Issue 