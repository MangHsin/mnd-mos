# Vercel部署指南

## 概述

本指南将帮助您将MND-MOS测试系统部署到Vercel平台。Vercel是一个现代化的前端部署平台，支持静态网站和Serverless函数。

## 部署前准备

### 1. 注册Vercel账号
- 访问 [vercel.com](https://vercel.com)
- 使用GitHub、GitLab或Bitbucket账号注册

### 2. 准备代码仓库
确保您的代码已经推送到GitHub等代码托管平台。

## 部署步骤

### 步骤1：连接仓库

1. 登录Vercel控制台
2. 点击"New Project"
3. 选择您的GitHub仓库
4. 点击"Import"

### 步骤2：配置项目

在项目配置页面：

1. **项目名称**：输入项目名称，如 `mnd-mos-test`
2. **框架预设**：选择 `Vue.js`
3. **根目录**：保持默认（如果项目在根目录）
4. **构建命令**：`npm run build`
5. **输出目录**：`dist`
6. **安装命令**：`npm install`

### 步骤3：环境变量配置

在"Environment Variables"部分添加：

```
NODE_ENV=production
```

### 步骤4：部署

点击"Deploy"按钮，Vercel将自动：
1. 安装依赖
2. 构建项目
3. 部署到CDN
4. 提供访问链接

## 项目结构说明

部署后的项目结构：

```
your-project/
├── api/                    # Vercel Serverless函数
│   ├── ratings.js         # 评分保存API
│   ├── results.js         # 结果获取API
│   └── health.js          # 健康检查API
├── public/                 # 静态资源
│   └── images/            # 测试图像
├── src/                   # 前端源码
├── vercel.json            # Vercel配置
└── package.json           # 项目配置
```

## API端点

部署后，您的API端点将是：

- **保存评分**：`https://your-domain.vercel.app/api/ratings`
- **获取结果**：`https://your-domain.vercel.app/api/results`
- **健康检查**：`https://your-domain.vercel.app/api/health`
- **统计结果**：`https://your-domain.vercel.app/api/results?type=statistics`

## 数据存储

### 重要说明
Vercel的Serverless函数使用临时文件系统，数据不会持久化存储。每次函数调用时，数据库都会重新初始化。

### 解决方案

#### 方案1：使用外部数据库（推荐）
1. **MongoDB Atlas**（免费）
   - 注册MongoDB Atlas账号
   - 创建免费集群
   - 获取连接字符串
   - 修改API函数使用MongoDB

2. **Supabase**（免费）
   - 注册Supabase账号
   - 创建PostgreSQL数据库
   - 获取连接字符串
   - 修改API函数使用PostgreSQL

#### 方案2：使用Vercel KV（付费）
- Vercel提供的Redis服务
- 适合简单的键值存储

## 自定义域名

### 添加自定义域名

1. 在Vercel项目设置中找到"Domains"
2. 点击"Add Domain"
3. 输入您的域名
4. 按照提示配置DNS记录

### DNS配置示例

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

## 监控和分析

### Vercel Analytics
1. 在项目设置中启用Analytics
2. 查看访问统计和性能数据

### 函数日志
1. 在Vercel控制台查看函数执行日志
2. 监控API调用情况

## 数据导出

由于Vercel的临时存储特性，建议：

1. **实时导出**：在API函数中添加数据导出逻辑
2. **定期备份**：设置定时任务导出数据
3. **外部存储**：使用外部数据库服务

## 性能优化

### 图片优化
1. 使用WebP格式
2. 压缩图片大小
3. 考虑使用CDN

### 代码优化
1. 启用代码分割
2. 优化包大小
3. 使用懒加载

## 常见问题

### Q: 数据库数据丢失怎么办？
A: 使用外部数据库服务，如MongoDB Atlas或Supabase。

### Q: 如何查看测试结果？
A: 访问 `/api/results` 端点获取数据，或使用外部数据库的管理界面。

### Q: 如何备份数据？
A: 设置定时任务或使用外部数据库的自动备份功能。

### Q: 函数执行超时怎么办？
A: 优化代码逻辑，减少执行时间，或升级Vercel计划。

## 升级建议

### 生产环境建议
1. **数据库**：使用MongoDB Atlas或Supabase
2. **监控**：启用Vercel Analytics
3. **域名**：配置自定义域名和SSL
4. **备份**：设置自动数据备份

### 扩展功能
1. **用户管理**：添加用户注册和登录
2. **数据可视化**：添加结果图表展示
3. **导出功能**：支持CSV、Excel导出
4. **多语言**：支持国际化

## 联系支持

如果遇到部署问题：
1. 查看Vercel文档
2. 检查函数日志
3. 联系Vercel支持
4. 在GitHub提交Issue 