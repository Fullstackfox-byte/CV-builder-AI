import * as ai from '../services/aiService.js';
import { httpError } from '../middleware/error.js';

const ACTIONS = ['improve', 'professional', 'concise', 'verbs', 'ats', 'bullets'];

const wrap = (fn) => async (req, res, next) => {
  try {
    res.json(await fn(req.body || {}));
  } catch (e) {
    next(e);
  }
};
const needCV = (b) => {
  if (!b.cv || typeof b.cv !== 'object') throw httpError(400, 'cv is required');
};

export const summary = wrap(async (b) => (needCV(b), ai.generateProfessionalSummary(b.cv, { targetRole: b.targetRole, keywords: b.keywords })));
export const objective = wrap(async (b) => (needCV(b), ai.generateObjective(b.cv)));
export const projectBullets = wrap(async (b) => (needCV(b), ai.generateProjectBullets(b.item || {}, b.cv)));
export const experienceBullets = wrap(async (b) => (needCV(b), ai.generateExperienceBullets(b.item || {}, b.cv)));
export const followUp = wrap(async (b) => (needCV(b), ai.generateFollowUpQuestions(b.cv, Array.isArray(b.history) ? b.history : [])));
export const fullCV = wrap(async (b) => (needCV(b), ai.generateFullCV(b.cv)));
export const optimize = wrap(async (b) => {
  needCV(b);
  if (!b.jobDescription || b.jobDescription.trim().length < 30) throw httpError(400, 'Please paste a longer job description');
  if (b.jobDescription.length > 12000) throw httpError(400, 'Job description is too long (max 12,000 characters)');
  return ai.optimizeForJob(b.cv, b.targetRole, b.jobDescription);
});
export const improve = wrap(async (b) => {
  if (!b.text || !b.text.trim()) throw httpError(400, 'text is required');
  if (b.text.length > 4000) throw httpError(400, 'text is too long');
  if (!ACTIONS.includes(b.action)) throw httpError(400, `action must be one of: ${ACTIONS.join(', ')}`);
  return ai.improveSection({ text: b.text, action: b.action, context: b.context || {} });
});
