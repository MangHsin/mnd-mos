const { MongoClient } = require('mongodb');

// MongoDB连接字符串（需要在Vercel环境变量中设置）
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/mnd-mos-test?retryWrites=true&w=majority';
const DB_NAME = 'mnd-mos-test';
const COLLECTION_NAME = 'ratings';

// 在Serverless环境中，每次调用都重新连接
async function connectDB() {
  try {
    console.log('正在连接MongoDB...');
    console.log('连接字符串:', MONGODB_URI ? '已设置' : '未设置');
    
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      maxPoolSize: 1, // Serverless环境使用最小连接池
    });
    
    await client.connect();
    console.log('MongoDB连接成功');
    return { client, db: client.db(DB_NAME) };
  } catch (error) {
    console.error('MongoDB连接失败:', error);
    throw error;
  }
}

// 保存评分
async function saveRating(ratingData) {
  let connection;
  try {
    connection = await connectDB();
    const collection = connection.db.collection(COLLECTION_NAME);
    
    const result = await collection.insertOne({
      ...ratingData,
      createdAt: new Date()
    });
    
    console.log('评分保存成功:', result.insertedId);
    return result.insertedId;
  } catch (error) {
    console.error('保存评分失败:', error);
    throw error;
  } finally {
    // 确保关闭连接
    if (connection && connection.client) {
      await connection.client.close();
    }
  }
}

// 获取所有结果
async function getResults() {
  let connection;
  try {
    connection = await connectDB();
    const collection = connection.db.collection(COLLECTION_NAME);
    
    return await collection.find({}).sort({ createdAt: -1 }).toArray();
  } catch (error) {
    console.error('获取结果失败:', error);
    throw error;
  } finally {
    // 确保关闭连接
    if (connection && connection.client) {
      await connection.client.close();
    }
  }
}

// 获取统计结果
async function getStatistics() {
  let connection;
  try {
    connection = await connectDB();
    const collection = connection.db.collection(COLLECTION_NAME);
    
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
  } finally {
    // 确保关闭连接
    if (connection && connection.client) {
      await connection.client.close();
    }
  }
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
    console.log('API请求:', req.method, req.url);
    console.log('环境变量MONGODB_URI:', process.env.MONGODB_URI ? '已设置' : '未设置');
    
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
    res.status(500).json({ 
      error: '服务器内部错误', 
      details: error.message,
      stack: error.stack,
      mongodbUri: process.env.MONGODB_URI ? '已设置' : '未设置'
    });
  }
}; 