require('dotenv').config();
const express = require('express');
const app = express();
const hello = require('./api/hello.js');
const ratings = require('./api/ratings.js');

app.use(express.json());

// 测试 /api/hello
app.all('/api/hello', (req, res) => hello(req, res));

// 测试 /api/ratings
app.all('/api/ratings', (req, res) => ratings(req, res));

app.listen(3000, () => {
  console.log('本地API服务器已启动：http://localhost:3000');
});
