const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { initDatabase, saveRating, getResults } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务（前端构建文件）
app.use(express.static(path.join(__dirname, '../dist')));

// 初始化数据库
initDatabase();

// API路由
app.post('/api/ratings', async (req, res) => {
  try {
    const { sessionId, trialId, leftAlgorithm, leftImage, rightImage, rating, timestamp } = req.body;
    
    if (!sessionId || !trialId || !rating) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    await saveRating({
      sessionId,
      trialId,
      leftAlgorithm,
      leftImage,
      rightImage,
      rating,
      timestamp: timestamp || new Date().toISOString()
    });
    
    res.json({ success: true, message: '评分保存成功' });
  } catch (error) {
    console.error('保存评分错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const results = await getResults();
    res.json(results);
  } catch (error) {
    console.error('获取结果错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 所有其他请求返回前端应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
}); 