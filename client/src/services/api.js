import { getClientId } from '../utils/helpers';

const BASE = import.meta.env.VITE_API_URL || '/api';

async function req(path, { method = 'GET', body } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 40000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method, signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', 'x-client-id': getClientId() },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('The AI took too long to respond. Please try again.');
    if (e instanceof TypeError) throw new Error('Cannot reach the server. Is the backend running (npm run dev)?');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// Never send the profile photo or stored job description to the AI endpoints.
const strip = (cv) => ({ ...cv, basics: { ...cv.basics, photo: '' }, optimization: undefined });
const post = (path, body) => req(path, { method: 'POST', body });

export const ai = {
  summary: (cv, opts = {}) => post('/ai/summary', { cv: strip(cv), ...opts }),
  objective: (cv) => post('/ai/objective', { cv: strip(cv) }),
  projectBullets: (item, cv) => post('/ai/project-bullets', { item, cv: strip(cv) }),
  experienceBullets: (item, cv) => post('/ai/experience-bullets', { item, cv: strip(cv) }),
  followUp: (cv, history) => post('/ai/follow-up', { cv: strip(cv), history }),
  improve: (body) => post('/ai/improve', body),
  optimize: (cv, targetRole, jobDescription) => post('/ai/optimize', { cv: strip(cv), targetRole, jobDescription }),
  fullCV: (cv) => post('/ai/full-cv', { cv: strip(cv) }),
};

export const cvApi = {
  list: () => req('/cvs'),
  save: (cv) => req(`/cvs/${cv.id}`, { method: 'PUT', body: cv }),
  remove: (id) => req(`/cvs/${id}`, { method: 'DELETE' }),
};
