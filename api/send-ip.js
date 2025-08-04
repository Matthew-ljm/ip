const nodemailer = require('nodemailer');

// 保持原有逻辑，使用CommonJS兼容的导出方式
async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: '只允许POST请求',
      status: 405
    });
  }

  try {
    const { ipData, email } = req.body;
    
    if (!ipData || !email) {
      return res.status(400).json({
        error: '缺少必要参数: ipData或email',
        status: 400
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return res.status(500).json({
        error: '邮件服务未配置',
        status: 500
      });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.126.com',
      port: 465,
      secure: true,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"IP信息服务" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '您的IP信息',
      text: `IP信息详情:\n\n${JSON.stringify(ipData, null, 2)}`,
      html: `
        <h2>IP信息详情</h2>
        <pre>${JSON.stringify(ipData, null, 2)}</pre>
        <p>时间: ${new Date().toLocaleString()}</p>
      `
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      status: 200
    });
    
  } catch (error) {
    console.error('邮件发送失败:', error);
    let errorMessage = '邮件发送失败';
    switch (error.code) {
      case 'EAUTH':
        errorMessage = '邮箱认证失败';
        break;
      case 'ECONNREFUSED':
        errorMessage = '无法连接到邮件服务器';
        break;
      default:
        errorMessage = '发送过程中发生错误';
    }
    
    return res.status(500).json({
      error: errorMessage,
      code: error.code,
      status: 500
    });
  }
}

// 兼容CommonJS的导出方式（关键）
module.exports = { default: handler };
