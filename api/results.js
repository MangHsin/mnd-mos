const sqlite3 = require('sqlite3').verbose();

// 数据库路径
const dbPath = '/tmp/ratings.db';
let db;

// 初始化数据库
function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('数据库连接错误:', err);
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// 获取所有结果
function getResults() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        sessionId,
        trialId,
        leftAlgorithm,
        leftImage,
        rightImage,
        rating,
        timestamp,
        created_at
      FROM ratings
      ORDER BY created_at DESC
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('获取结果错误:', err);
        reject(err);
        return;
      }
      
      resolve(rows);
    });
  });
}

// 获取统计结果
function getStatistics() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        leftAlgorithm,
        COUNT(*) as total_ratings,
        AVG(rating) as avg_rating,
        MIN(rating) as min_rating,
        MAX(rating) as max_rating
      FROM ratings
      GROUP BY leftAlgorithm
      ORDER BY leftAlgorithm
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('获取统计错误:', err);
        reject(err);
        return;
      }
      
      resolve(rows);
    });
  });
}

module.exports = async (req, res) => {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // 初始化数据库
      await initDatabase();
      
      const { type } = req.query;
      
      if (type === 'statistics') {
        const results = await getStatistics();
        res.json(results);
      } else {
        const results = await getResults();
        res.json(results);
      }
    } catch (error) {
      console.error('获取结果错误:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  } else {
    res.status(405).json({ error: '方法不允许' });
  }
}; 