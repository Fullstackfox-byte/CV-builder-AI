/**
 * AI service abstraction.
 * Every function returns structured JSON (never raw HTML) and a `source` field: "ai" | "local".
 * - AI_PROVIDER=anthropic|openai + AI_API_KEY  -> uses the LLM
 * - otherwise (or on any LLM failure)          -> falls back to the rule-based engine in localAI.js
 * To plug in another provider, only edit llm.js.
 */
import { askJSON, llmEnabled } from './llm.js';
import * as local from './localAI.js';

const BASE_RULES =
  'You are a careful career coach and resume writer. Use ONLY facts present in the input - never invent employers, numbers, tools, degrees or achievements. ' +
  'Write concise, achievement-oriented, ATS-friendly text with strong action verbs. Reply with valid JSON only, no markdown.';

const PROF_NOTES = {
  doctor: 'The candidate is a medical professional. Use accurate clinical terminology and the conventions of a medical CV (training, clinical experience, research, procedures). NEVER include patient names or identifiers, and NEVER invent registration numbers, procedure counts, case volumes, publications, specialties or hospitals.',
  nurse: 'The candidate is a nursing professional. Use accurate nursing terminology (patient assessment, care plans, medication administration, infection control). NEVER include patient identifiers, and NEVER invent registration numbers, certifications, ward names, patient numbers or outcomes.',
  lawyer: 'The candidate is a legal professional. Use precise legal terminology (drafting, pleadings, research, advocacy, due diligence). NEVER mention client names or confidential matters, and NEVER invent enrolment numbers, courts, cases, outcomes or publications.',
  teacher: 'The candidate is an educator. Use education terminology (lesson planning, curriculum, assessment, student engagement). NEVER invent institutions, results, publications or student numbers.',
  business: 'The candidate is a business or commerce professional. Use business terminology and mention measurable impact only where the input provides numbers. NEVER invent figures, employers or tools.',
  other: "Adapt the wording to the candidate's own field using only the information provided.",
};
const rulesFor = (cv) => BASE_RULES + (PROF_NOTES[cv?.career?.profession] ? ` ${PROF_NOTES[cv.career.profession]}` : '');

const compact = (cv) => {
  const { basics = {}, interview = [], optimization, ...rest } = cv;
  const { photo, license, ...b } = basics; // eslint-disable-line no-unused-vars -- photo and registration numbers are never sent to the LLM
  return { ...rest, basics: b, interview: interview.filter((i) => i.a) };
};
const arr = (v) => Array.isArray(v) && v.length && v.every((x) => typeof x === 'string' && x.trim());

async function run(name, llm, fallback) {
  if (llmEnabled()) {
    try {
      const out = await llm();
      if (out) return { ...out, source: 'ai' };
    } catch (e) {
      console.warn(`[ai] ${name} failed, using local engine:`, e.message);
    }
  }
  return { ...(await fallback()), source: 'local' };
}

export const generateProfessionalSummary = (cv, { targetRole, keywords } = {}) =>
  run('summary',
    async () => {
      const o = await askJSON(rulesFor(cv), `Write a 3-5 line professional summary tailored to the target role. Return {"summary": string}.\n${JSON.stringify({ targetRole: targetRole || cv.career?.targetRole, emphasizeKeywords: keywords, cv: compact(cv) })}`);
      return typeof o.summary === 'string' && o.summary.trim() ? { summary: o.summary.trim() } : null;
    },
    () => ({ summary: local.localSummary(cv, { targetRole, keywords }) }));

export const generateObjective = (cv) =>
  run('objective',
    async () => {
      const o = await askJSON(rulesFor(cv), `Write a 1-2 sentence career objective for this person. Return {"objective": string}.\n${JSON.stringify(compact(cv))}`);
      return typeof o.objective === 'string' && o.objective.trim() ? { objective: o.objective.trim() } : null;
    },
    () => ({ objective: local.localObjective(cv) }));

const bulletsFor = (type) => (item, cv) =>
  run(`${type}-bullets`,
    async () => {
      const o = await askJSON(rulesFor(cv), `Convert this ${type}'s details (and any interview answers that target it by id) into 2-4 strong resume bullet points. Return {"bullets": string[]}.\n${JSON.stringify({ item, cv: compact(cv) })}`);
      return arr(o.bullets) ? { bullets: o.bullets.slice(0, 4) } : null;
    },
    () => ({ bullets: local.localBullets(item, cv, type) }));
export const generateProjectBullets = bulletsFor('project');
export const generateExperienceBullets = bulletsFor('experience');

export const generateFollowUpQuestions = (cv, history = []) =>
  run('follow-up',
    async () => {
      if (history.filter((h) => h.a || h.skipped).length >= 8) return { question: null, done: true };
      const o = await askJSON(
        rulesFor(cv) + ' You are interviewing the user to collect missing CV details. Ask ONE short question at a time, never repeat covered topics, prefer measurable results, and never ask for personal data about patients or clients.',
        `Return {"question": {"q": string, "target": {"type":"project"|"experience"|"general","id": string|null}} | null, "done": boolean}. Use question:null when enough information has been collected.\n${JSON.stringify({ cv: compact(cv), history: history.map(({ q, a }) => ({ q, a })) })}`
      );
      if (o.done || !o.question?.q) return { question: null, done: true };
      return { question: { key: `ai:${history.length}`, q: o.question.q, target: o.question.target || { type: 'general' } }, done: false };
    },
    () => local.localNextQuestion(cv, history));

export const improveSection = ({ text, action, context }) =>
  run('improve',
    async () => {
      const how = { improve: 'Improve the writing quality', professional: 'Make it more professional', concise: 'Make it concise', verbs: 'Start every line with a strong action verb', ats: 'Optimize for ATS (plain wording, no symbols, relevant keywords)', bullets: 'Turn it into 2-4 resume bullet points' }[action];
      const shape = context?.kind === 'paragraph' ? 'Keep it as a single paragraph.' : 'Return one bullet per line without bullet symbols.';
      const o = await askJSON(BASE_RULES, `${how}. Do not add new facts. ${shape} Return {"text": string}.\n${JSON.stringify({ text, context })}`);
      return typeof o.text === 'string' && o.text.trim() ? { text: o.text.trim() } : null;
    },
    () => ({ text: local.localImprove(text, action, context) }));

export async function optimizeForJob(cv, targetRole, jobDescription) {
  // Score + keyword gap are computed deterministically so they are transparent; the LLM (if any) improves the wording.
  const base = local.localOptimize(cv, targetRole, jobDescription);
  let source = 'local';
  if (llmEnabled()) {
    try {
      const o = await askJSON(rulesFor(cv), `Given the job description, write a tailored 3-5 line professional summary (only truthful facts) and 3-5 concrete suggestions. Return {"summary": string, "suggestions": string[]}.\n${JSON.stringify({ targetRole, jobDescription, matched: base.matched, missing: base.missing, cv: compact(cv) })}`);
      if (typeof o.summary === 'string' && o.summary.trim()) base.summary = o.summary.trim();
      if (arr(o.suggestions)) base.suggestions = o.suggestions.slice(0, 6);
      source = 'ai';
    } catch (e) {
      console.warn('[ai] optimize failed, using local engine:', e.message);
    }
  }
  return { ...base, source, note: 'This match score is an estimate based on keyword overlap, not a guarantee of how any ATS or recruiter will rate your CV.' };
}

export const generateFullCV = (cv) =>
  run('full-cv',
    async () => {
      const o = await askJSON(rulesFor(cv), `Using ALL information including interview answers, produce polished CV content. Return {"summary": string, "projects": [{"id": string, "bullets": string[2-4]}], "experience": [{"id": string, "bullets": string[2-4]}], "skills": {"technical": string[], "soft": string[]}}. Keep the same ids as the input. Omit entries without information.\n${JSON.stringify(compact(cv))}`);
      if (typeof o.summary !== 'string' || !Array.isArray(o.projects) || !Array.isArray(o.experience)) return null;
      return { summary: o.summary.trim(), projects: o.projects.filter((p) => p.id && arr(p.bullets)), experience: o.experience.filter((p) => p.id && arr(p.bullets)), skills: o.skills || {} };
    },
    () => local.localFullCV(cv));