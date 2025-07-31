import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Received request to send IP data'); // 调试日志

    const { ipData, email } = req.body;

    // 验证必需字段
    if (!ipData || !email) {
        console.log('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 调试日志
        console.log('Creating transporter with:', {
            host: 'smtp.126.com',
            user: process.env.EMAIL_USER
        });

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

        // 调试日志
        console.log('Preparing email content');

        // 发送邮件
        const info = await transporter.sendMail({
            from: `"IP信息服务" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '你的IP信息',
            text: `IP信息:\n${JSON.stringify(ipData, null, 2)}`,
            html: `<pre>${JSON.stringify(ipData, null, 2)}</pre>`
        });

        console.log('Message sent: %s', info.messageId);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('邮件发送错误:', error);
        return res.status(500).json({ 
            error: '邮件发送失败',
            details: error.message 
        });
    }
}