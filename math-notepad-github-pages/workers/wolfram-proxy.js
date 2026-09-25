const WOLFRAM_ENDPOINT = 'https://www.wolframalpha.com/api/v1/llm-api';

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
    if (!allowedOrigin) return json({ error: 'Set ALLOWED_ORIGIN to your GitHub Pages site origin.' }, 503, headers);
    if (origin !== allowedOrigin) return json({ error: 'This site is not allowed to use the Wolfram proxy.' }, 403, headers);
    if (request.method !== 'POST') return json({ error: 'Use POST for Wolfram requests.' }, 405, headers);
    if (Number(request.headers.get('Content-Length') || 0) > 18000) return json({ error: 'The request is too large.' }, 413, headers);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'The request body must be valid JSON.' }, 400, headers); }

    const appId = String(body.appId || '').trim();
    const input = String(body.input || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!appId || !input) return json({ error: 'Enter your AppID in Settings and describe what to solve.' }, 400, headers);
    if (appId.length > 200 || input.length > 12000) return json({ error: 'The AppID or query is too long.' }, 413, headers);

    const url = new URL(WOLFRAM_ENDPOINT);
    url.searchParams.set('input', input);
    url.searchParams.set('maxchars', '6000');
    try {
      const response = await fetch(url, { headers: { Accept: 'text/plain', Authorization: 'Bearer ' + appId } });
      const answer = await response.text();
      if (!response.ok) {
        return json({ error: 'Wolfram|Alpha returned an error (' + response.status + '): ' + answer.slice(0, 500) }, response.status, headers);
      }
      const resultUrl = answer.match(/https:\/\/www\.wolframalpha\.com\/input\?i=[^\s"<>]+/)?.[0] || null;
      return json({ answer, url: resultUrl }, 200, headers);
    } catch {
      return json({ error: 'Could not reach Wolfram|Alpha. Check the Worker network access and try again.' }, 502, headers);
    }
  }
};

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
