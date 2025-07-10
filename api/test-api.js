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

  // 返回测试信息
  res.json({
    message: 'API测试成功！',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    headers: req.headers,
    query: req.query,
    body: req.body
  });
}; 