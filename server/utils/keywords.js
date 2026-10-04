// Keyword vocabulary + helpers for ATS-style matching.
export const TECH_TERMS = [
  // --- engineering / IT ---
  'javascript', 'typescript', 'react', 'react native', 'next.js', 'vue', 'angular', 'svelte', 'node.js', 'express', 'mongodb', 'mongoose', 'sql', 'mysql',
  'postgresql', 'sqlite', 'firebase', 'redis', 'graphql', 'rest api', 'restful', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'python', 'django', 'flask',
  'fastapi', 'java', 'spring boot', 'c++', 'c#', 'c programming', 'golang', 'rust', 'php', 'laravel', 'kotlin', 'swift', 'flutter', 'docker', 'kubernetes',
  'aws', 'azure', 'gcp', 'git', 'github', 'ci/cd', 'jenkins', 'linux', 'agile', 'scrum', 'jira', 'figma', 'unity', 'unreal engine', 'godot', 'arduino',
  'raspberry pi', 'iot', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'data analysis', 'power bi', 'tableau', 'excel',
  'selenium', 'automation', 'playwright', 'jest', 'unit testing', 'testing', 'microservices', 'websockets', 'socket.io', 'oauth', 'jwt', 'api',
  'responsive design', 'accessibility', 'seo', 'webpack', 'vite', 'redux', 'three.js', 'opengl', 'nlp', 'computer vision', 'opencv', 'blockchain', 'solidity',
  'devops', 'cybersecurity', 'data structures', 'algorithms', 'oop', 'system design', 'communication', 'teamwork', 'leadership', 'problem solving',
  // --- medical / nursing ---
  'patient care', 'patient assessment', 'clinical examination', 'clinical research', 'diagnosis', 'treatment plan', 'care plan', 'medication administration',
  'vital signs', 'iv cannulation', 'catheterization', 'wound care', 'infection control', 'triage', 'icu', 'opd', 'emergency medicine', 'surgery', 'pharmacology',
  'bls', 'acls', 'ecg', 'ultrasound', 'ventilator', 'electronic medical records', 'electronic health records', 'evidence-based medicine', 'medical ethics',
  'public health', 'patient education', 'telemedicine', 'cme', 'rounds', 'discharge planning', 'patient safety',
  // --- legal ---
  'legal research', 'legal drafting', 'drafting', 'pleadings', 'litigation', 'contracts', 'contract review', 'due diligence', 'compliance', 'arbitration',
  'mediation', 'case law', 'intellectual property', 'corporate law', 'criminal law', 'civil law', 'constitutional law', 'westlaw', 'lexisnexis', 'manupatra',
  'scc online', 'advocacy', 'negotiation', 'moot court', 'legal opinion', 'client counselling', 'court procedure',
  // --- teaching ---
  'lesson planning', 'curriculum', 'classroom management', 'assessment', 'pedagogy', 'e-learning', 'google classroom', 'student engagement', 'differentiated instruction',
  // --- business / commerce ---
  'budgeting', 'accounting', 'financial analysis', 'financial reporting', 'tally', 'sap', 'crm', 'market research', 'digital marketing', 'sales', 'recruitment',
  'payroll', 'supply chain', 'project management', 'stakeholder management', 'forecasting', 'taxation', 'gst', 'auditing', 'powerpoint',
];

const STOP = new Set(('with that this have will from your their they them been were what when where which about into more than also able work working team teams ' +
  'role roles job years year experience strong good excellent ability skills skill knowledge required preferred must should responsibilities requirements ' +
  'looking candidate join company using use used including etc such other over under across within build building help helps like need needs make ' +
  'new our you are the and for not but can all any has had its who how why per via').split(' '));

export const normalize = (t = '') =>
  String(t).toLowerCase().replace(/\bnode\s?js\b/g, 'node.js').replace(/\breact\.?js\b/g, 'react').replace(/\bvue\.?js\b/g, 'vue').replace(/\bexpress\.?js\b/g, 'express').replace(/\bnext\s?js\b/g, 'next.js').replace(/\bgo\s?lang\b/g, 'golang');

export function hasTerm(blob, term) {
  const esc = term.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  return new RegExp(`(?<![a-z0-9+#])${esc}(?![a-z0-9+#])`, 'i').test(blob);
}

export function extractKeywords(jd) {
  const text = normalize(jd);
  const tech = TECH_TERMS.filter((t) => hasTerm(text, t));
  const counts = {};
  (text.match(/[a-z][a-z+#.-]{3,}/g) || []).forEach((w) => {
    w = w.replace(/[.-]+$/, '');
    if (!STOP.has(w) && !tech.some((t) => t.includes(w))) counts[w] = (counts[w] || 0) + 1;
  });
  const general = Object.entries(counts).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w);
  return { tech, general };
}

export function cvText(cv) {
  const { basics = {}, career = {}, education = [], skills = {}, projects = [], experience = [], achievements = [], extras = [] } = cv;
  return normalize(
    [
      cv.summary, career.targetRole, career.objective, ...(skills.technical || []), ...(skills.soft || []),
      ...education.flatMap((e) => [e.degree, e.department, e.coursework]),
      ...projects.flatMap((p) => [p.name, p.type, p.tech, p.problem, p.built, p.features, ...(p.bullets || [])]),
      ...experience.flatMap((x) => [x.position, x.tech, x.responsibilities, x.achievements, ...(x.bullets || [])]),
      ...achievements.map((a) => a.text),
      ...extras.flatMap((x) => [x.title, x.org, x.detail]),
      basics.fullName,
    ].filter(Boolean).join(' \n ')
  );
}