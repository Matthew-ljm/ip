import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // 设置响应头
    res.setHeader('Content-Type', 'application/json');
    
    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: '只允许POST请求',
            status: 405
        });
    }

    try {
        const { ipData, email } = req.body;
        
        // 验证必要参数
        if (!ipData || !email) {
            return res.status(400).json({
                error: '缺少必要参数: ipData或email',
                status: 400
            });
        }

        // 创建邮件传输器
        const transporter = nodemailer.createTransport({
            host: 'smtp.126.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // 发送邮件
        await transporter.sendMail({
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

        // 返回成功响应
        return res.status(200).json({
            success: true,
            message: '邮件已成功发送',
            status: 200
        });
        
    } catch (error) {
        console.error('邮件发送失败:', error);
        return res.status(500).json({
            error: '邮件发送失败',
            message: error.message,
            status: 500
        });
    }
}