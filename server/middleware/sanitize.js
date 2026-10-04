// Removes keys starting with "$" or containing "." (NoSQL operator injection) from request bodies.
const clean = (v) => {
  if (Array.isArray(v)) return v.map(clean);
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v)
        .filter(([k]) => !k.startsWith('$') && !k.includes('.'))
        .map(([k, val]) => [k, clean(val)])
    );
  }
  return v;
};

export default function sanitize(req, res, next) {
  if (req.body) req.body = clean(req.body);
  next();
}
