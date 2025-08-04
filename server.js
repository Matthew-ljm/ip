const express = require('express');
const path = require('path');
const app = express();

// 中间件
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const proxyIp = require('./api/proxy-ip.js');
const sendIp = require('./api/send-ip.js');

app.get('/api/proxy-ip', proxyIp);
app.post('/api/send-ip', sendIp);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;