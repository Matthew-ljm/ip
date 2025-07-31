export default async function handler(req, res) {
    try {
        // 设置响应头允许跨域
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        
        // 尝试多个IP信息源，提高可靠性
        let data;
        try {
            // 第一个IP信息源
            const response = await fetch('https://ipapi.co/json/');
            data = await response.json();
        } catch (error) {
            console.log('第一个IP信息源失败，尝试备用源:', error);
            // 备用IP信息源
            const backupResponse = await fetch('https://api.ipify.org?format=json');
            const backupData = await backupResponse.json();
            data = { ip: backupData.ip, source: 'backup' };
        }
        
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
