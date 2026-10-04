export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v) => {
  const d = v.replace(/\D/g, '');
  return /^[+\d][\d\s().-]*$/.test(v.trim()) && d.length >= 7 && d.length <= 15;
};
export const isUrl = (v) => {
  try {
    return new URL(/^https?:\/\//i.test(v.trim()) ? v.trim() : `https://${v.trim()}`).hostname.includes('.');
  } catch {
    return false;
  }
};
const isEmpty = (item) => !Object.entries(item).some(([k, v]) => !['id', 'bullets', 'current'].includes(k) && String(v || '').trim());
const urlErr = (v) => (v?.trim() && !isUrl(v) ? 'Please enter a valid link, e.g. github.com/username' : undefined);
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v));

export function validateBasics(b) {
  return clean({
    fullName: !b.fullName.trim() ? 'Please enter your full name' : undefined,
    email: !b.email.trim() ? 'Please enter your email' : !isEmail(b.email) ? "That email doesn't look right - try name@example.com" : undefined,
    phone: !b.phone.trim() ? 'Please enter a phone number' : !isPhone(b.phone) ? 'Use 7-15 digits, e.g. +91 98765 43210' : undefined,
    linkedin: urlErr(b.linkedin), github: urlErr(b.github), portfolio: urlErr(b.portfolio),
  });
}

export function validateCareer(c) {
  const years = c.years === '' ? null : Number(c.years);
  return clean({
    status: !c.status ? 'Choose the option that fits you best' : undefined,
    targetRole: !c.targetRole.trim() ? 'Tell us which role you are aiming for' : undefined,
    years: years !== null && (isNaN(years) || years < 0 || years > 60) ? 'Enter a number between 0 and 60' : undefined,
  });
}

const forList = (list, fn) => {
  const out = {};
  list.forEach((it) => {
    if (isEmpty(it)) return;
    const e = clean(fn(it));
    if (Object.keys(e).length) out[it.id] = e;
  });
  return out;
};
const year = (v) => (v && !/^(19|20)\d{2}$/.test(v) ? 'Use a 4-digit year, e.g. 2025' : undefined);

export const validateEducation = (list) =>
  forList(list, (e) => ({
    degree: !e.degree.trim() ? 'Degree is required' : undefined,
    school: !e.school.trim() ? 'College / university is required' : undefined,
    start: year(e.start), end: year(e.end) || (e.start && e.end && e.end < e.start ? 'End year is before start year' : undefined),
  }));

export const validateExperience = (list) =>
  forList(list, (x) => ({
    company: !x.company.trim() ? 'Company name is required' : undefined,
    position: !x.position.trim() ? 'Position is required' : undefined,
    end: !x.current && x.start && x.end && x.end < x.start ? 'End date is before start date' : undefined,
  }));

export const validateProjects = (list) =>
  forList(list, (p) => ({ name: !p.name.trim() ? 'Give your project a name' : undefined, github: urlErr(p.github), demo: urlErr(p.demo) }));
