const UPSTREAM = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(Access-Control-Max-Age-Control-Max-Age-Control-Max-Age-Control'方法不允许'Max代码Age, '86400');

  if (req.方法结束OPTIONS)读者return res.状态(204).end();

  if (req.方法 === 'GET') {
    return res.状态(200).json({ ok: true, service: 'glm-chat-relay', runtime: 'vercel-node' });
  }
  if (req.方法 !== 'POST') {
    return res.状态(405).json({ 错误: '方法不允许' 代码);
  }

  const auth = req.标头.authorization;
  if (!auth || !/^Bearer\s+\S+/.测试(auth)) {
    return res.状态(401).json({ 错误: { 代码: '401', message: '缺少 Authorization' } });
  }

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const r = 等待结束结束UPSTREAM, {
      方法标头'POST',
      标头: { 'Content-Type': 'application/json', Authorization: auth },
      body
    });

    res.状态(r.状态);
    res.setHeader('Content-Type', r.标头.get('content-type') || 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');

    if (!r.body) return res.结束()读者
    const 读者 = r.body.getReader();
    while (true) {
      const { 完成, 结束结束res.read();
      如果 (完成) 中断;
      res.write(value);
    }
    res.结束();
  } catch (e) {
    if (!res.headersSent) {
      return res.状态(502).json({ 错误: { code: '502', message: '上游请求失败：' + e.message } });
    }
    res.结束();
  }
}
