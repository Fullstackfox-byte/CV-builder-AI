// Rule-based "offline" AI engine. It NEVER invents facts: it only reshapes what the user typed.
// Used automatically when no AI provider is configured or when the provider call fails.
import { toBullet, tidy, sentences, cap, lowerFirst, joinList, splitList, concise, professional, atsClean, dedupe } from '../utils/textTools.js';
import { extractKeywords, hasTerm, cvText } from '../utils/keywords.js';

const answersFor = (cv, type, id) => (cv.interview || []).filter((h) => h.target?.type === type && h.target?.id === id && h.a?.trim()).map((h) => h.a.trim());
const softLower = (s = '') => (/^[A-Z][a-z]+(?![A-Za-z])/.test(s) ? lowerFirst(s) : s);
const article = (w = '') => (/^[aeiou]/i.test(w) ? 'an' : 'a');
const VERB_LEAD = /^(solve|help|reduce|manage|track|simplify|automate|improve|provide|enable|allow|make|find|detect|monitor|streamline|connect|organize|save)/i;

/* ---------- profession-aware wording ---------- */
const QE = {
  role: 'What part did you personally build?', roleHint: 'e.g. "I built the frontend and connected the API"',
  tools: 'technologies', challenge: 'technical challenge', nums: 'users who tested it, performance gains, or time saved',
  expWork: (c) => `What project did you work on at ${c}, and what was your individual contribution?`,
  expTools: (c) => `Which technologies or tools did you use at ${c}?`,
  expResult: (c) => `Did you improve performance, solve a technical problem, or deliver any measurable result at ${c}?`,
  noProj: 'Have you built any project, even a small or academic one? Describe it briefly: what it does and what you built.',
  ach: 'Any hackathons, certifications, awards or leadership roles worth mentioning?',
  skills: 'Which technical tools or languages are you comfortable with?',
};
const QB = {
  role: 'What was your personal contribution?', roleHint: 'e.g. "I prepared the monthly sales report"',
  tools: 'tools or methods', challenge: 'biggest challenge', nums: 'revenue, cost savings, customers or time saved',
  expWork: (c) => `What were your main responsibilities at ${c}, and what did you personally deliver?`,
  expTools: (c) => `Which tools or software did you use at ${c}?`,
  expResult: (c) => `Did you increase sales, save costs, improve a process or achieve any measurable result at ${c}?`,
  noProj: 'Have you worked on any project, case study or internship task? Describe it briefly.',
  ach: 'Any awards, certifications, competitions or leadership roles worth mentioning?',
  skills: 'Which tools, software or business skills are you comfortable with?',
};
const mkP = (o, Q = QE) => ({ ...o, Q });
const NON_ENG = { verb: 'Carried out', feat: 'Key outcomes include', lead: false };

const PROF = {
  engineering: mkP({ verb: 'Developed', feat: 'Implemented key features including', lead: true, goal: 'apply technical skills', skillsNoun: 'technical skills', toWhat: 'real-world problems', toolsLine: (t) => `Worked with ${t} to deliver assigned tasks.` }),
  doctor: mkP({ ...NON_ENG, feat: 'Key findings and outcomes include', goal: 'apply clinical knowledge and patient-centred care', skillsNoun: 'clinical skills', toWhat: 'patient care', toolsLine: (t) => `Departments and procedures covered: ${t}.` }, {
    ...QE,
    role: 'What was your personal role (for example data collection, analysis, patient care or writing)?', roleHint: 'e.g. "I collected the data and wrote the first draft"',
    tools: 'methods or tools', challenge: 'clinical or research challenge', nums: 'number of cases or participants (never patient identifiers), or outcomes',
    expWork: (c) => `What were your main clinical responsibilities at ${c}, and which departments or cases did you handle (no patient details)?`,
    expTools: (c) => `Which procedures, departments or systems did you work with at ${c}?`,
    expResult: (c) => `Did you improve a process, handle a difficult situation, or achieve any measurable result at ${c}? Please avoid patient details.`,
    noProj: 'Have you done any research, case report, audit or community health work? Describe your role briefly.',
    ach: 'Any awards, publications, conference presentations, CME programmes or leadership roles worth mentioning?',
    skills: 'Which clinical skills or procedures are you confident performing?',
  }),
  nurse: mkP({ ...NON_ENG, feat: 'Key outcomes include', goal: 'deliver safe, compassionate patient care', skillsNoun: 'nursing skills', toWhat: 'safe, compassionate patient care', toolsLine: (t) => `Wards and procedures covered: ${t}.` }, {
    ...QE,
    role: 'What was your personal role (for example patient care, documentation or health education)?', roleHint: 'e.g. "I prepared the checklist and presented the results"',
    tools: 'methods or tools', challenge: 'challenge', nums: 'outcomes you contributed to (never patient identifiers)',
    expWork: (c) => `What were your main nursing responsibilities at ${c}, and which wards or patient groups did you care for?`,
    expTools: (c) => `Which equipment, procedures or hospital systems did you use at ${c}?`,
    expResult: (c) => `Did you improve a process, train colleagues or achieve any measurable result at ${c}? Please avoid patient details.`,
    noProj: 'Have you taken part in any community health programme, health-education drive, case study or quality project? Describe your role.',
    ach: 'Any certifications (BLS/ACLS), awards, training programmes or volunteering worth mentioning?',
    skills: 'Which nursing skills or procedures are you confident performing?',
  }),
  lawyer: mkP({ ...NON_ENG, feat: 'Key arguments and outcomes include', goal: 'apply legal research, drafting and advocacy skills', skillsNoun: 'legal skills', toWhat: 'client matters and legal research', toolsLine: (t) => `Practice areas covered: ${t}.` }, {
    ...QE,
    role: 'What was your personal role (for example research, drafting or oral advocacy)?', roleHint: 'e.g. "I prepared the memorial and argued as Speaker 1"',
    tools: 'areas of law or research tools', challenge: 'legal issue', nums: 'outcomes such as rank, awards or number of matters assisted (never client names)',
    expWork: (c) => `What kind of matters and tasks did you handle at ${c} (drafting, research, court appearances)? Please avoid client names.`,
    expTools: (c) => `Which practice areas or research databases did you use at ${c}?`,
    expResult: (c) => `Did you contribute to a successful outcome, a notable draft or any measurable result at ${c}? Please avoid confidential details.`,
    noProj: 'Have you taken part in any moot court, research paper, legal aid clinic or internship matter? Describe your role.',
    ach: 'Any moot court awards, publications, scholarships, certifications or leadership roles worth mentioning?',
    skills: 'Which legal skills, research tools or databases are you comfortable with?',
  }),
  teacher: mkP({ ...NON_ENG, goal: 'apply effective teaching practice and support student learning', skillsNoun: 'teaching skills', toWhat: 'student learning', toolsLine: (t) => `Subjects and classes covered: ${t}.` }, {
    ...QE,
    role: 'What was your personal role (for example planning, teaching or assessment)?', roleHint: 'e.g. "I designed the activities and collected feedback"',
    tools: 'methods or tools', challenge: 'teaching challenge', nums: 'class size, improvement in results or participation',
    expWork: (c) => `Which subjects and classes did you teach at ${c}, and what were your main responsibilities?`,
    expTools: (c) => `Which teaching methods, tools or platforms did you use at ${c}?`,
    expResult: (c) => `Did you improve student results, introduce a new method or achieve any measurable result at ${c}?`,
    noProj: 'Have you done any academic project, research or student activity? Describe your role.',
    ach: 'Any awards, publications, workshops, certifications or leadership roles worth mentioning?',
    skills: 'Which teaching skills or tools are you comfortable with?',
  }),
  business: mkP({ ...NON_ENG, goal: 'apply analytical and organisational skills', skillsNoun: 'professional skills', toWhat: 'business goals', toolsLine: (t) => `Tools and software used: ${t}.` }, QB),
  other: mkP({ ...NON_ENG, goal: 'apply my skills and experience', skillsNoun: 'skills', toWhat: 'real-world work', toolsLine: (t) => `Tools and skills used: ${t}.` }, QB),
};
const P = (cv) => PROF[cv?.career?.profession] || PROF.engineering;

/* ---------- bullets ---------- */
export function localBullets(item, cv, type) {
  const pf = P(cv);
  const tech = splitList(item.tech);
  const out = [];
  if (type === 'project') {
    const prob = sentences(item.problem)[0]?.replace(/[.!?]+$/, '').replace(/^to\s+/i, '');
    const verbLead = pf.lead && prob && VERB_LEAD.test(prob);
    let first = `${pf.verb} ${item.name || 'a project'}${item.type ? `, ${article(item.type)} ${softLower(item.type)}` : ''}${tech.length ? ` using ${joinList(tech.slice(0, 5))}` : ''}`;
    if (verbLead) first += ` to ${lowerFirst(prob)}`;
    out.push(`${first}.`);
    if (prob && !verbLead) out.push(pf.lead ? `Built to address the following problem: ${lowerFirst(prob)}.` : `Aimed to ${lowerFirst(prob)}.`);
    sentences(item.built).slice(0, 2).forEach((s) => out.push(toBullet(s)));
    const feats = splitList(item.features);
    if (feats.length) out.push(`${pf.feat} ${joinList(feats.slice(0, 4).map(softLower))}.`);
  } else {
    sentences(item.responsibilities).slice(0, 3).forEach((s) => out.push(toBullet(s)));
    sentences(item.achievements).slice(0, 2).forEach((s) => out.push(toBullet(s)));
    if (tech.length) out.push(pf.toolsLine(joinList(tech.slice(0, 6))));
  }
  answersFor(cv, type, item.id).flatMap(sentences).slice(0, 3).forEach((s) => out.push(toBullet(s)));
  return dedupe(out).slice(0, 4);
}

/* ---------- summary / objective ---------- */
export function localSummary(cv, { targetRole, keywords = [] } = {}) {
  const { career = {}, education = [], skills = {}, projects = [], experience = [] } = cv;
  const pf = P(cv);
  const role = targetRole || career.targetRole;
  const edu = education.find((e) => e.degree);
  const degree = edu ? `${edu.degree}${edu.department ? ` (${edu.department})` : ''}` : '';
  const opener = {
    Student: degree ? `${degree} student` : 'Motivated student',
    Fresher: degree ? `${degree} graduate` : 'Motivated early-career candidate',
    'Working Professional': `${role || 'Professional'}${career.years ? ` with ${career.years}+ years of experience` : ''}`,
    Freelancer: `Freelance ${role || career.industry || 'professional'}`,
    'Career Switcher': `Career switcher moving into ${role || 'a new field'}${degree ? `, with a background in ${degree}` : ''}`,
  }[career.status] || (role ? `${role} candidate` : 'Motivated candidate');
  const techs = dedupe([...keywords.filter((k) => (skills.technical || []).some((s) => s.toLowerCase() === k.toLowerCase())), ...(skills.technical || [])]).slice(0, 5);
  const areas = dedupe(projects.map((p) => softLower(p.type?.replace(/\s*(\/.*)?\s+(project|application|app)s?$/i, '').trim())).filter(Boolean)).slice(0, 2);
  let s1 = opener;
  if (pf.lead) {
    if (areas.length || experience.length) s1 += ` with hands-on experience ${areas.length ? `building ${joinList(areas)} projects` : 'in professional projects'}`;
    if (techs.length) s1 += `${areas.length || experience.length ? ',' : ' with skills'} proficient in ${joinList(techs)}`;
  } else {
    if (experience.length) s1 += ' with practical experience in professional settings';
    if (techs.length) s1 += `${experience.length ? ',' : ' with skills'} skilled in ${joinList(techs)}`;
  }
  const parts = [`${s1}.`];
  const named = projects.filter((p) => p.name).slice(0, 2).map((p) => p.name);
  if (named.length) parts.push(pf.lead ? `Built ${projects.length > 1 ? `${projects.length} projects including` : 'a project:'} ${joinList(named)}.` : `Key work includes ${joinList(named)}.`);
  const x = experience.find((e) => e.position && e.company);
  if (x) parts.push(`Gained practical experience as ${x.position} at ${x.company}.`);
  if (role) parts.push(`Seeking a ${role} position to ${pf.goal} and keep growing${career.industry ? ` in ${career.industry}` : ''}.`);
  return parts.join(' ');
}

export function localObjective(cv) {
  const { career = {}, skills = {} } = cv;
  const pf = P(cv);
  const techs = (skills.technical || []).slice(0, 3);
  return `${career.status === 'Student' ? 'Motivated student' : 'Motivated candidate'} seeking a ${career.targetRole || 'suitable'} role${career.industry ? ` in ${career.industry}` : ''}, aiming to apply ${techs.length ? `skills in ${joinList(techs)}` : pf.skillsNoun} to ${pf.toWhat} while continuing to learn and contribute to the team.`;
}

/* ---------- improve ---------- */
export function localImprove(text, action, context = {}) {
  const para = context.kind === 'paragraph';
  const ops = {
    improve: (t) => (para ? tidy(t) : toBullet(t)),
    professional: (t) => (para ? tidy(professional(t)) : toBullet(professional(t))),
    concise: (t) => (para ? tidy(concise(t)) : toBullet(concise(t))),
    verbs: (t) => (para ? tidy(t) : toBullet(t)),
    ats: (t) => (para ? tidy(atsClean(t)) : toBullet(atsClean(t))),
    bullets: (t) => toBullet(t),
  };
  const op = ops[action] || ops.improve;
  const out = sentences(text).map(op).filter(Boolean);
  return para ? out.join(' ') : out.join('\n');
}

/* ---------- follow-up interview ---------- */
const MAX_QUESTIONS = 8;
export function localNextQuestion(cv, history = []) {
  const Q = P(cv).Q;
  const answered = history.filter((h) => h.a?.trim() || h.skipped);
  if (answered.length >= MAX_QUESTIONS) return { question: null, done: true };
  const asked = new Set(history.map((h) => h.key));
  const hasNum = (s) => /\d/.test(s || '');
  const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length;
  const c = [];
  const push = (pri, key, q, target, hint) => !asked.has(key) && c.push({ pri, key, q, target, hint });

  (cv.projects || []).forEach((p) => {
    if (!p.name && !p.built) return;
    const nm = p.name ? `"${p.name}"` : 'this project';
    const t = { type: 'project', id: p.id };
    const mine = history.filter((h) => h.target?.id === p.id);
    const roleAns = mine.find((h) => h.key === `p:${p.id}:role`)?.a || '';
    if (words(p.built) < 12) push(1, `p:${p.id}:role`, `Tell me more about your role in ${nm}. ${Q.role}`, t, Q.roleHint);
    if (!p.tech?.trim()) push(1, `p:${p.id}:tech`, `Which ${Q.tools} did you use in ${nm}?`, t);
    push(2, `p:${p.id}:challenge`, `What was the biggest ${Q.challenge} in ${nm}, and how did you solve it?`, t);
    if (/\b(we|our|team|group|friends|together)\b/i.test(`${roleAns} ${p.built}`)) push(2, `p:${p.id}:team`, `What was your contribution compared with the rest of the team on ${nm}?`, t);
    if (!hasNum(`${p.features} ${p.built} ${mine.map((h) => h.a).join(' ')}`)) push(3, `p:${p.id}:metrics`, `Do you have any numbers for ${nm}? For example ${Q.nums}.`, t, 'Skip if you do not have any');
  });

  (cv.experience || []).forEach((x) => {
    if (!x.company) return;
    const t = { type: 'experience', id: x.id };
    if (!x.position?.trim()) push(1, `x:${x.id}:title`, `What was your job title at ${x.company}?`, t);
    if (words(x.responsibilities) < 10) push(1, `x:${x.id}:project`, Q.expWork(x.company), t);
    if (!x.tech?.trim()) push(2, `x:${x.id}:tech`, Q.expTools(x.company), t);
    if (!hasNum(x.achievements)) push(3, `x:${x.id}:result`, Q.expResult(x.company), t);
  });

  if (!(cv.projects || []).some((p) => p.name) && !(cv.experience || []).some((x) => x.company))
    push(1, 'g:project', Q.noProj, { type: 'general' });
  if (!(cv.achievements || []).length) push(4, 'g:ach', Q.ach, { type: 'general' }, 'Skip if none');
  if ((cv.skills?.technical || []).length < 3) push(4, 'g:skills', Q.skills, { type: 'skills' });

  c.sort((a, b) => a.pri - b.pri);
  const next = c[0];
  return next ? { question: { key: next.key, q: next.q, target: next.target, hint: next.hint }, done: false } : { question: null, done: true };
}

/* ---------- full CV ---------- */
export function localFullCV(cv) {
  const norm = (arr = []) => dedupe(arr.map((s) => s.trim()));
  return {
    summary: localSummary(cv),
    projects: (cv.projects || []).filter((p) => p.name || p.built).map((p) => ({ id: p.id, bullets: localBullets(p, cv, 'project') })),
    experience: (cv.experience || []).filter((x) => x.company).map((x) => ({ id: x.id, bullets: localBullets(x, cv, 'experience') })),
    skills: { technical: norm(cv.skills?.technical), soft: norm(cv.skills?.soft) },
  };
}

/* ---------- job optimisation (keyword analysis; the score is an ESTIMATE) ---------- */
export function localOptimize(cv, targetRole, jd) {
  const { tech, general } = extractKeywords(jd);
  const blob = cvText(cv);
  const matchedT = tech.filter((k) => hasTerm(blob, k));
  const missingT = tech.filter((k) => !hasTerm(blob, k));
  const matchedG = general.filter((k) => hasTerm(blob, k));
  const total = tech.length * 2 + general.length;
  const got = matchedT.length * 2 + matchedG.length;
  const score = total ? Math.min(98, Math.round((got / total) * 100)) : 0;
  const suggestions = [];
  if (missingT.length) suggestions.push(`If you genuinely have experience with them, add these skills: ${missingT.slice(0, 6).join(', ')}.`);
  if (!cv.summary?.trim()) suggestions.push('Add a professional summary tailored to this role.');
  if (!(cv.projects || []).some((p) => p.bullets?.length) && !(cv.experience || []).some((x) => x.bullets?.length)) suggestions.push('Generate bullet points for your projects/experience so keywords appear in context.');
  suggestions.push('Add measurable results (users, percentages, time saved) to your strongest bullets.');
  if (matchedG.length < general.length) suggestions.push(`Weave relevant wording from the posting into your bullets where it is truthful: ${general.filter((g) => !matchedG.includes(g)).slice(0, 4).join(', ')}.`);
  return {
    score,
    matched: [...matchedT, ...matchedG],
    missing: missingT,
    suggestions,
    summary: localSummary(cv, { targetRole: targetRole || cv.career?.targetRole, keywords: matchedT }),
  };
}