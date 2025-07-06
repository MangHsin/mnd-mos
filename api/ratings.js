const { MongoClient } = require('mongodb');

// MongoDB连接字符串（需要在Vercel环境变量中设置）
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/mnd-mos-test?retryWrites=true&w=majority';
const DB_NAME = 'mnd-mos-test';
const COLLECTION_NAME = 'ratings';

let client;

// 连接数据库
async function connectDB() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

// 保存评分
async function saveRating(ratingData) {
  const db = await connectDB();
  const collection = db.collection(COLLECTION_NAME);
  
  const result = await collection.insertOne({
    ...ratingData,
    createdAt: new Date()
  });
  
  return result.insertedId;
}

// 获取所有结果
async function getResults() {
  const db = await connectDB();
  const collection = db.collection(COLLECTION_NAME);
  
  return await collection.find({}).sort({ createdAt: -1 }).toArray();
}

// 获取统计结果
async function getStatistics() {
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

  try {
    if (req.method === 'POST') {
      const { sessionId, trialId, leftAlgorithm, leftImage, rightImage, rating, timestamp } = req.body;
      
      if (!sessionId || !trialId || !rating) {
        return res.status(400).json({ error: '缺少必要参数' });
      }
      
      const insertedId = await saveRating({
        sessionId,
        trialId,
        leftAlgorithm,
        leftImage,
        rightImage,
        rating,
        timestamp: timestamp || new Date().toISOString()
      });
      
      res.json({ success: true, message: '评分保存成功', id: insertedId });
    } else if (req.method === 'GET') {
      const { type } = req.query;
      
      if (type === 'statistics') {
        const results = await getStatistics();
        res.json(results);
      } else {
        const results = await getResults();
        res.json(results);
      }
    } else {
      res.status(405).json({ error: '方法不允许' });
    }
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ error: '服务器内部错误', details: error.message });
  }
}; 