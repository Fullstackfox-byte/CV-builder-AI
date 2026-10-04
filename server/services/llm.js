// Thin provider client. Keys are read from server-side env vars only.
const parseJSON = (t = '') => {
  const s = t.indexOf('{'), e = t.lastIndexOf('}');
  if (s < 0 || e < 0) throw new Error('No JSON found in AI response');
  return JSON.parse(t.slice(s, e + 1));
};

export const llmEnabled = () => ['anthropic', 'openai'].includes(process.env.AI_PROVIDER) && !!process.env.AI_API_KEY;

export async function askJSON(system, user) {
  const { AI_PROVIDER: p, AI_API_KEY: key, AI_MODEL: model, AI_BASE_URL: base } = process.env;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    if (p === 'anthropic') {
      const r = await fetch(`${base || 'https://api.anthropic.com'}/v1/messages`, {
        method: 'POST', signal: ctrl.signal,
        headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: model || 'claude-sonnet-5-5', max_tokens: 2000, system, messages: [{ role: 'user', content: user }] }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || `AI request failed (${r.status})`);
      return parseJSON((d.content || []).map((c) => c.text || '').join(''));
    }
    const r = await fetch(`${base || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST', signal: ctrl.signal,
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: model || 'gpt-4o-mini', response_format: { type: 'json_object' }, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || `AI request failed (${r.status})`);
    return parseJSON(d.choices?.[0]?.message?.content);
  } finally {
    clearTimeout(timer);
  }
}
