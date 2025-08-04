const express = require('express');
const path = require('path');
const app = express();

// 中间件配置（兼容Vercel环境）
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件目录

// 导入API处理函数（注意CommonJS与ES模块兼容）
const proxyIp = require('./api/proxy-ip').default;
const sendIp = require('./api/send-ip').default;

// 注册API路由
app.get('/api/proxy-ip', proxyIp);
app.post('/api/send-ip', sendIp);

// 根路由响应
app.get('/', (req, res) => {
  res.send('IP API服务运行中');
});

// 导出Express实例（Vercel部署必需，不要包含app.listen）
module.exports = app;