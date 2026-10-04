import { isDBReady } from '../config/db.js';

export default function requireDB(req, res, next) {
  if (!isDBReady()) return res.status(503).json({ error: 'Database not connected' });
  next();
}
