const OPENAI_ENDPOINT = 'https://api.openai.com/v1/responses';
const MAX_REQUEST_BYTES = 30000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = (env.ALLOWED_ORIGIN || '').trim().replace(/\/+$/, '');
    const headers = {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };
    if (allowedOrigin && origin === allowedOrigin) headers['Access-Control-Allow-Origin'] = origin;
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (!allowedOrigin) return json({ error: 'Set ALLOWED_ORIGIN to the published site origin.' }, 503, headers);
    if (origin !== allowedOrigin) return json({ error: 'This site origin is not allowed to use the AI Worker.' }, 403, headers);
    if (request.method !== 'POST') return json({ error: 'Use POST for AI requests.' }, 405, headers);
    if (Number(request.headers.get('Content-Length') || 0) > MAX_REQUEST_BYTES) return json({ error: 'The request is too large.' }, 413, headers);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'The request body must be valid JSON.' }, 400, headers); }

    const apiKey = String(body.apiKey || '').trim();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!apiKey || !messages.length) return json({ error: 'Add an OpenAI API key in Settings and write a message.' }, 400, headers);
    if (apiKey.length > 300 || JSON.stringify(messages).length > MAX_REQUEST_BYTES) return json({ error: 'The key or note context is too large.' }, 413, headers);
    const allowedRoles = new Set(['user', 'assistant']);
    const input = messages.slice(-14).map(message => ({
      role: allowedRoles.has(message.role) ? message.role : 'user',
      content: String(message.content || '').slice(0, 14000)
    }));

    try {
      const response = await fetch(OPENAI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
          model: 'gpt-6-astra',
          reasoning: { effort: 'high' },
          store: false,
          instructions: String(body.instructions || 'Help the user reason through mathematics. State assumptions, show useful steps, and never claim a result is certain if it is not.').slice(0, 6000),
          input
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = payload.error?.message || `OpenAI returned an error (${response.status}).`;
        return json({ error: message }, response.status, headers);
      }
      const text = payload.output_text || (payload.output || []).flatMap(item => item.content || []).filter(item => item.type === 'output_text').map(item => item.text).join('\n');
      if (!text) return json({ error: 'The AI returned no text. Please try again.' }, 502, headers);
      return json({ text }, 200, headers);
    } catch {
      return json({ error: 'Could not reach the OpenAI API. Check the Worker network access and try again.' }, 502, headers);
    }
  }
};

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
