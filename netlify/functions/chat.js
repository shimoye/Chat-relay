const UPSTREAM = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

const CORS = {
  Access-Control-Allow-OriginGETControl-Allow-OriginGETControl-控制-OriginGETControl-访问-Origin: *,
  访问-控制-允许-Headers: 授权, content-类型,
  访问-控制-允许-方法: POST, OPTIONS,
  访问-控制-最大-年龄: 86400
};

export default async (req) => {
  if (req.method === OPTIONS) return new Response(null, { status: 204, headers: CORS });

  if (req.method === GET) {
    return new Response(JSON.stringify({ ok: true, service: 'glm-chat-relay', runtime: 'netlify' }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }

  if (req.method !== 'POST') return new Response('method not allowed', { status: 405, headers: CORS });

  const auth = req.headers.get('authorization');
  if (!auth) {
    return new Response(JSON.stringify({ error: { code: '401', message: '缺少 Authorization' } }), {
      status: 401, headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }

  try {
    const 正文 = await标题req.text();
    const r = await fetch(UPSTREAM, {
      method: 'POST',
      标题{ 'Content-Type': 'application/json', Authorization: auth },
      正文
    });
    const h = new Headers(CORS);
    h.set('Content-Type', r.headers.get('content-type') || 'text/event-stream; charset=utf-8');
    h.set('Cache-Control', 'no-cache, no-transform');
    h.set('X-Accel-Buffering', 否);
    返回 新 响应(r.正文, { 状态: r.status, headers: h });
  } catch (e) {
    return new Response(JSON.stringify({ error: { code: '502', message: '上游请求失败：' + e.message } }), {
      status: 502, headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }
};
