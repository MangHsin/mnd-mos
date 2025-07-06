# MND-MOS测试系统

一个用于图像质量评估的在线测试系统，支持滑动式评分控件。

## 功能特点

- 🎯 **滑动式评分**：直观的滑动条评分界面，支持关键值限制
- 📊 **数据收集**：自动保存受试者评分数据到数据库
- 🖼️ **图像对比**：支持多算法图像质量对比评估
- 📱 **响应式设计**：适配各种设备屏幕
- 🔄 **休息提醒**：定期提醒受试者休息，避免疲劳

## 快速开始

### 1. 本地开发

```bash
# 克隆项目
git clone <your-repo-url>
cd mnd-mos-test

# 安装前端依赖
npm install

# 启动前端开发服务器
npm run serve

# 新开终端，安装后端依赖
cd server
npm install

# 启动后端服务器
npm run dev
```

### 2. 访问应用

- 前端：http://localhost:8080
- 后端API：http://localhost:3000

## 项目结构

```
mnd-mos-test/
├── src/                    # 前端源码
│   ├── components/         # Vue组件
│   │   ├── RatingScale.vue # 滑动式评分控件
│   │   └── ImagePair.vue   # 图像对比组件
│   ├── store/              # 状态管理
│   └── view/               # 页面视图
├── server/                 # 后端服务
│   ├── server.js           # Express服务器
│   ├── database.js         # 数据库操作
│   └── package.json        # 后端依赖
├── public/                 # 静态资源
│   └── images/             # 测试图像
└── deploy.md               # 部署指南
```

## 评分系统

### 评分等级
- **+3**: 左侧远好
- **+2**: 左侧较好  
- **+1**: 左侧稍好
- **0**: 相同
- **-1**: 左侧稍差
- **-2**: 左侧较差
- **-3**: 左侧远差

### 测试流程
1. 受试者看到左右两张图像
2. 使用滑动条评估左侧图像相对于右侧图像的质量差异
3. 系统自动保存评分数据
4. 每8组测试后提醒休息
5. 完成48组测试后结束

## API接口

### 保存评分
```http
POST /api/ratings
Content-Type: application/json

{
  "sessionId": "session_1234567890_abc123",
  "trialId": 1,
  "leftAlgorithm": "PGD",
  "leftImage": "/images/JND/p_1.png",
  "rightImage": "/images/PGD/p_1.png",
  "rating": 2,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 获取结果
```http
GET /api/results
```

### 健康检查
```http
GET /api/health
```

## 部署指南

详细的部署说明请参考 [deploy.md](./deploy.md)

### 快速部署（Vercel推荐）

1. **前端部署**
   ```bash
   npm run build
   # 将dist目录部署到Vercel
   ```

2. **后端部署**
   - 使用Railway、Render等平台
   - 或部署到传统服务器

## 数据管理

### 查看测试结果
```bash
# 从数据库导出结果
sqlite3 server/ratings.db "SELECT * FROM ratings;" > results.csv
```

### 数据库结构
```sql
CREATE TABLE ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sessionId TEXT NOT NULL,
  trialId INTEGER NOT NULL,
  leftAlgorithm TEXT,
  leftImage TEXT,
  rightImage TEXT,
  rating INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 技术栈

### 前端
- Vue 3 + Composition API
- Pinia 状态管理
- Vue Router 路由
- 原生CSS + 响应式设计

### 后端
- Node.js + Express
- SQLite 数据库
- CORS 跨域支持

## 开发说明

### 添加新算法
1. 在 `src/store/index.js` 的 `algorithms` 数组中添加新算法
2. 在 `public/images/` 目录下添加对应的图像文件夹
3. 确保图像命名格式为 `p_1.png` 到 `p_8.png`

### 修改测试参数
- 总试验次数：修改 `totalTrials` 值
- 休息间隔：修改 `Test.vue` 中的休息逻辑
- 图像数量：修改 `totalImages` 值

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或联系开发者。
