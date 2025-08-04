// 保持原有逻辑，使用CommonJS兼容的导出方式
async function handler(req, res) {
  try {
    // 设置跨域响应头（Vercel部署需要）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // 获取用户真实IP（适配Vercel的IP转发头）
    const userIp = req.headers['x-vercel-forwarded-for'] 
      || req.headers['x-forwarded-for'] 
      || req.socket.remoteAddress;

    // 调用IP信息接口
    const response = await fetch(`https://ipapi.co/${userIp}/json/`);
    const data = await response.json();

    // 处理接口返回异常的情况
    if (!data.ip) {
      data.ip = userIp;
      data.country = 'CN';
      data.timezone = 'Asia/Shanghai';
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('获取IP信息失败:', error);
    return res.status(200).json({
      ip: req.headers['x-vercel-forwarded-for'] || '未知',
      country: 'CN',
      timezone: 'Asia/Shanghai',
      error: 'IP信息获取失败，但已捕获用户IP'
    });
  }
}

// 兼容CommonJS的导出方式（关键）
module.exports = { default: handler };
