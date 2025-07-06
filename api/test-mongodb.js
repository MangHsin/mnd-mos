const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      hasMongoUri: !!MONGODB_URI,
      uriLength: MONGODB_URI ? MONGODB_URI.length : 0,
      uriPreview: MONGODB_URI ? MONGODB_URI.substring(0, 50) + '...' : '未设置'
    };

    if (!MONGODB_URI) {
      return res.json({
        ...debugInfo,
        error: 'MONGODB_URI环境变量未设置'
      });
    }

    // 测试连接
    try {
      console.log('测试MongoDB连接...');
      const client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      
      await client.connect();
      console.log('MongoDB连接成功');
      
      // 测试数据库操作
      const db = client.db('mnd-mos-test');
      const collections = await db.listCollections().toArray();
      
      await client.close();
      
      res.json({
        ...debugInfo,
        status: 'success',
        message: 'MongoDB连接和认证成功',
        collections: collections.map(c => c.name)
      });
      
    } catch (error) {
      console.error('MongoDB连接失败:', error);
      res.json({
        ...debugInfo,
        status: 'error',
        error: error.message,
        errorType: error.constructor.name
      });
    }
    
  } catch (error) {
    res.status(500).json({
      error: '测试API错误',
      details: error.message
    });
  }
}; 