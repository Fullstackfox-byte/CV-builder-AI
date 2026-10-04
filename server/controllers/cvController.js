import CV from '../models/CV.js';
import { httpError } from '../middleware/error.js';

const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

export const listCVs = wrap(async (req, res) => {
  const docs = await CV.find({ clientId: req.clientId }).sort({ updatedAt: -1 }).limit(50).lean();
  res.json(docs.map((d) => ({ cvId: d.cvId, title: d.title, data: d.data, updatedAt: d.updatedAt })));
});

export const getCV = wrap(async (req, res) => {
  const doc = await CV.findOne({ clientId: req.clientId, cvId: req.params.cvId }).lean();
  if (!doc) throw httpError(404, 'CV not found');
  res.json({ cvId: doc.cvId, title: doc.title, data: doc.data, updatedAt: doc.updatedAt });
});

// Upsert: PUT /api/cvs/:cvId
export const saveCV = wrap(async (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw httpError(400, 'Invalid CV payload');
  const doc = await CV.findOneAndUpdate(
    { clientId: req.clientId, cvId: req.params.cvId },
    { title: String(data.title || 'Untitled CV').slice(0, 120), data },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json({ cvId: doc.cvId, updatedAt: doc.updatedAt });
});

export const deleteCV = wrap(async (req, res) => {
  await CV.deleteOne({ clientId: req.clientId, cvId: req.params.cvId });
  res.json({ ok: true });
});
