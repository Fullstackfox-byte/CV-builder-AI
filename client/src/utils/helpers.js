export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));
export const cn = (...a) => a.filter(Boolean).join(' ');
export const splitLines = (t = '') => String(t).split('\n').map((s) => s.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
export const splitList = (t = '') => String(t).split(/[,;\n|]/).map((s) => s.trim()).filter(Boolean);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtMonth = (v) => {
  if (!v) return '';
  const [y, m] = v.split('-');
  return m ? `${MONTHS[+m - 1]} ${y}` : y;
};
export const dateRange = (s, e, current) => [fmtMonth(s), current ? 'Present' : fmtMonth(e)].filter(Boolean).join(' - ');

export const getClientId = () => {
  let id = localStorage.getItem('cvforge:client');
  if (!id) localStorage.setItem('cvforge:client', (id = uid()));
  return id;
};
export const normUrl = (u = '') => (!u ? '' : /^https?:\/\//i.test(u) ? u : `https://${u}`);
export const shortUrl = (u = '') => u.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

export const timeAgo = (ts) => {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
};

// Resize an uploaded photo to a small JPEG data URL so it is cheap to store.
export function resizeImage(file, max = 240) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('Could not read that image'));
    img.src = URL.createObjectURL(file);
  });
}

export const printCV = (name) => {
  const old = document.title;
  document.title = `${name || 'CV'} - CV`;
  window.print();
  setTimeout(() => (document.title = old), 500);
};
