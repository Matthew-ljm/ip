import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { ipData, email } = req.body;

    try {
        // 创建邮件传输器
        const transporter = nodemailer.createTransport({
            host: 'smtp.126.com', // 126邮箱SMTP服务器
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER, // 你的126邮箱
                pass: process.env.EMAIL_PASSWORD // 你的邮箱密码或授权码
            }
        });

        // 格式化IP数据
        const formattedData = JSON.stringify(ipData, null, 2);

        // 发送邮件
        await transporter.sendMail({
            from: `"IP信息发送服务" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '你的IP信息',
            text: `以下是你的IP信息:\n\n${formattedData}`,
            html: `<pre>${formattedData}</pre>`
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('发送邮件出错:', error);
        res.status(500).json({ error: '发送邮件失败' });
    }
}