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
    const debugInfo = {
      timestamp: new Date().toISOString(),
      mongodbUri: process.env.MONGODB_URI ? '已设置' : '未设置',
      mongodbUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      nodeEnv: process.env.NODE_ENV,
      allEnvVars: Object.keys(process.env).filter(key => key.includes('MONGODB'))
    };

    // 尝试连接MongoDB
    if (process.env.MONGODB_URI) {
      try {
        const client = new MongoClient(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
        });
        
        await client.connect();
        debugInfo.mongodbConnection = '成功';
        await client.close();
      } catch (error) {
        debugInfo.mongodbConnection = '失败';
        debugInfo.mongodbError = error.message;
      }
    } else {
      debugInfo.mongodbConnection = '未尝试（无连接字符串）';
    }

    res.json(debugInfo);
  } catch (error) {
    res.status(500).json({
      error: '调试API错误',
      details: error.message,
      stack: error.stack
    });
  }
}; 