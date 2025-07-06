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
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'MND-MOS Test API',
      version: '1.0.0'
    });
  } else {
    res.status(405).json({ error: '方法不允许' });
  }
}; 