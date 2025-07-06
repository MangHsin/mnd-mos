const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库路径（使用临时文件系统）
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
      
      console.log('数据库连接成功');
      
      // 创建评分表
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS ratings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sessionId TEXT NOT NULL,
          trialId INTEGER NOT NULL,
          leftAlgorithm TEXT,
          leftImage TEXT,
          rightImage TEXT,
          rating INTEGER NOT NULL,
          timestamp TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.run(createTableSQL, (err) => {
        if (err) {
          console.error('创建表错误:', err);
          reject(err);
          return;
        }
        
        console.log('数据库表初始化完成');
        resolve();
      });
    });
  });
}

// 保存评分
function saveRating(ratingData) {
  return new Promise((resolve, reject) => {
    const { sessionId, trialId, leftAlgorithm, leftImage, rightImage, rating, timestamp } = ratingData;
    
    const sql = `
      INSERT INTO ratings (sessionId, trialId, leftAlgorithm, leftImage, rightImage, rating, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [sessionId, trialId, leftAlgorithm, leftImage, rightImage, rating, timestamp], function(err) {
      if (err) {
        console.error('保存评分错误:', err);
        reject(err);
        return;
      }
      
      console.log(`评分已保存，ID: ${this.lastID}`);
      resolve(this.lastID);
    });
  });
}

module.exports = async (req, res) => {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // 初始化数据库
      await initDatabase();
      
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
  } else {
    res.status(405).json({ error: '方法不允许' });
  }
}; 