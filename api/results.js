const { MongoClient } = require('mongodb');

// MongoDB连接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/mnd-mos-test?retryWrites=true&w=majority';
const DB_NAME = 'mnd-mos-test';
const COLLECTION_NAME = 'ratings';

let client;

// 连接数据库
async function connectDB() {
  try {
    if (!client) {
      console.log('正在连接MongoDB...');
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      await client.connect();
      console.log('MongoDB连接成功');
    }
    return client.db(DB_NAME);
  } catch (error) {
    console.error('MongoDB连接失败:', error);
    throw error;
  }
}

// 获取所有结果
async function getResults() {
  try {
    const db = await connectDB();
    const collection = db.collection(COLLECTION_NAME);
    
    return await collection.find({}).sort({ createdAt: -1 }).toArray();
  } catch (error) {
    console.error('获取结果失败:', error);
    throw error;
  }
}

// 获取统计结果
async function getStatistics() {
  try {
    const db = await connectDB();
    const collection = db.collection(COLLECTION_NAME);
    
    return await collection.aggregate([
      {
        $group: {
          _id: '$leftAlgorithm',
          total_ratings: { $sum: 1 },
          avg_rating: { $avg: '$rating' },
          min_rating: { $min: '$rating' },
          max_rating: { $max: '$rating' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();
  } catch (error) {
    console.error('获取统计失败:', error);
    throw error;
  }
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
      res.status(500).json({ error: '服务器内部错误', details: error.message });
    }
  } else {
    res.status(405).json({ error: '方法不允许' });
  }
}; 