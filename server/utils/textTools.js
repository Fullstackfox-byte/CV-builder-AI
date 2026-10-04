// Small, dependency-free text helpers used by the local (rule-based) AI engine.
const VERBS = {
  made: 'Developed', make: 'Develop', build: 'Built', built: 'Built', building: 'Built', created: 'Created', create: 'Created', creating: 'Created',
  developed: 'Developed', developing: 'Developed', develop: 'Developed', designed: 'Designed', designing: 'Designed', design: 'Designed',
  wrote: 'Authored', write: 'Authored', writing: 'Authored', coded: 'Implemented', coding: 'Implemented', fixed: 'Resolved', fixing: 'Resolved', fix: 'Resolved',
  solved: 'Resolved', solving: 'Resolved', helped: 'Supported', helping: 'Supported', worked: 'Collaborated', working: 'Collaborated', handled: 'Managed',
  handling: 'Managed', led: 'Led', leading: 'Led', lead: 'Led', tested: 'Tested', testing: 'Tested', used: 'Utilized', connected: 'Integrated', connecting: 'Integrated',
  did: 'Completed', maintained: 'Maintained', updated: 'Updated', learned: 'Learned', taught: 'Mentored', organised: 'Organized', managed: 'Managed',
};
const CASUAL = { stuff: 'components', lots: 'numerous', 'a lot of': 'numerous', good: 'strong', big: 'large', got: 'obtained', 'kind of': '', 'sort of': '', cool: 'engaging', "don't": 'do not', "can't": 'cannot', "didn't": 'did not', "wasn't": 'was not', "i'm": 'I am', "i've": 'I have' };
const FILLER = [/\bin order to\b/gi, /\ba lot of\b/gi, /\bvery\b\s*/gi, /\breally\b\s*/gi, /\bbasically\b\s*/gi, /\bactually\b\s*/gi, /\bjust\b\s*/gi, /\bdue to the fact that\b/gi, /\bthat is\b/gi];

export const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
export const lowerFirst = (s = '') => s.charAt(0).toLowerCase() + s.slice(1);
export const clean = (s = '') => String(s).replace(/\s+/g, ' ').trim();
export const sentences = (t = '') => String(t).split(/(?<=[.!?])\s+|\n+|;\s*/).map((x) => clean(x.replace(/^[-•*\d.)\s]+/, ''))).filter(Boolean);
export const splitList = (s = '') => String(s).split(/[,;\n|]/).map(clean).filter(Boolean);
export const joinList = (a) => (a.length <= 1 ? a[0] || '' : a.length === 2 ? `${a[0]} and ${a[1]}` : `${a.slice(0, -1).join(', ')}, and ${a[a.length - 1]}`);
export const dedupe = (arr) => [...new Map(arr.filter(Boolean).map((x) => [x.toLowerCase(), x])).values()];
const endDot = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

/** Turn a casual sentence into an achievement-style bullet (no facts are added). */
export function toBullet(raw) {
  let s = clean(raw).replace(/^[-•*\d.)\s]+/, '');
  if (!s) return '';
  s = s.replace(/^(i|we)\s+(also\s+|just\s+|have\s+)?/i, '');
  let m;
  if ((m = s.match(/^(was|were|am)?\s*(responsible for|in charge of|tasked with)\s+/i))) s = `Managed ${s.slice(m[0].length)}`;
  else if ((m = s.match(/^(worked on|work on|working on|helped with|help with|helped in)\s+/i))) s = `Contributed to ${s.slice(m[0].length)}`;
  else {
    const [first, ...rest] = s.split(/\s+/);
    const v = VERBS[first.toLowerCase()];
    if (v) s = [v, ...rest].join(' ');
  }
  return endDot(cap(s.replace(/\s+([,.])/g, '$1')));
}

export const tidy = (s) => endDot(cap(clean(s).replace(/\bi\b/g, 'I')));

export function concise(t) {
  let s = t;
  FILLER.forEach((re) => (s = s.replace(re, (x) => (/in order to/i.test(x) ? 'to ' : /a lot of/i.test(x) ? 'many ' : /due to/i.test(x) ? 'because ' : ''))));
  return clean(s);
}

export function professional(t) {
  let s = t;
  Object.entries(CASUAL).forEach(([k, v]) => (s = s.replace(new RegExp(`\\b${k.replace("'", "['’]")}\\b`, 'gi'), v)));
  return clean(s);
}

export function atsClean(t) {
  return clean(t.replace(/&/g, 'and').replace(/[^\x20-\x7E\u00C0-\u024F]/g, ' ').replace(/\b(i|my|me|we|our)\b\s*/gi, ''));
}
