module.exports = (req, res) => {
  res.json({ 
    message: 'API工作正常！',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}; 