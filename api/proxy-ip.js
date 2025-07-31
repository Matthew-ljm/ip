export default async function handler(req, res) {
    try {
        // 设置响应头允许跨域
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        
        // 从ipapi.co获取数据
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // 返回完整JSON数据
        return res.status(200).json(data);
    } catch (error) {
        console.error('代理IP请求失败:', error);
        return res.status(500).json({
            error: '无法获取IP信息',
            details: error.message
        });
    }
}