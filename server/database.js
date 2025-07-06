const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ratings.db');
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

module.exports = {
  initDatabase,
  saveRating,
  getResults,
  getStatistics
}; 