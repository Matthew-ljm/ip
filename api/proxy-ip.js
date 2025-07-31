// 确保此文件位于项目根目录的api文件夹中
export default async function handler(req, res) {
    try {
        // 设置响应头允许跨域和指定JSON类型
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        
        // 检查请求方法
        if (req.method !== 'GET') {
            return res.status(405).json({
                error: '只允许GET请求',
                status: 405
            });
        }
        
        // 尝试获取IP信息，提供多个备选源
        let response, data;
        try {
            // 第一个IP信息源
            response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error(`IPAPI请求失败: ${response.status}`);
            data = await response.json();
        } catch (error) {
            console.error('第一个IP源失败，尝试备用源:', error);
            // 备用IP信息源
            response = await fetch('https://ipinfo.io/json');
            if (!response.ok) throw new Error(`IPInfo请求失败: ${response.status}`);
            data = await response.json();
        }
        
        // 返回完整JSON数据
        return res.status(200).json(data);
    } catch (error) {
        console.error('代理IP请求失败:', error);
        // 确保始终返回JSON格式的错误
        return res.status(500).json({
            error: '无法获取IP信息',
            details: error.message,
            status: 500
        });
    }
}
    