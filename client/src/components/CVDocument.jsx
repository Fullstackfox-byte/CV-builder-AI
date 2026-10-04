import { profileOf, sectionLabel, sectionOrder } from '../utils/defaultCV';
import { dateRange, normUrl, shortUrl, splitLines, splitList } from '../utils/helpers';

// All templates are single-column, real-text, standard headings => ATS friendly.
export const TEMPLATES = {
  modern: { label: 'Modern', desc: 'Accent-colored headings, optional photo', font: 'Inter, system-ui, sans-serif', accent: '#4338ca', rule: '#c7d2fe', align: 'left', headCls: 'uppercase font-bold tracking-wider text-[1.02em] border-b pb-0.5', nameCls: 'font-extrabold text-[2.4em] leading-tight text-slate-900' },
  minimal: { label: 'Minimal', desc: 'Light, airy, lots of white space', font: 'Inter, system-ui, sans-serif', accent: '#64748b', rule: '#e2e8f0', align: 'left', headCls: 'uppercase font-semibold tracking-[.22em] text-[.82em]', nameCls: 'font-light text-[2.3em] tracking-tight text-slate-900' },
  corporate: { label: 'Corporate', desc: 'Classic serif, centered header', font: 'Georgia, "Times New Roman", serif', accent: '#0f172a', rule: '#0f172a', align: 'center', headCls: 'uppercase font-bold tracking-wide text-[1.02em] border-b-2 pb-0.5', nameCls: 'font-bold uppercase tracking-wide text-[2.1em] text-slate-900' },
  developer: { label: 'Developer', desc: 'Monospace, tech-focused', font: '"JetBrains Mono", "Fira Code", ui-monospace, Menlo, monospace', accent: '#047857', rule: '#047857', align: 'left', headCls: 'font-bold text-[1em] border-l-[3px] pl-2', nameCls: 'font-bold text-[2em] text-slate-900' },
  clinical: { label: 'Clinical', desc: 'Clean teal accent for medical and nursing CVs', font: 'Inter, system-ui, sans-serif', accent: '#0f766e', rule: '#99f6e4', align: 'left', headCls: 'uppercase font-bold tracking-wider text-[1.02em] border-b-2 pb-0.5', nameCls: 'font-extrabold text-[2.3em] leading-tight text-slate-900' },
  legal: { label: 'Legal', desc: 'Traditional serif, centered, formal rules', font: 'Georgia, "Times New Roman", serif', accent: '#7f1d1d', rule: '#7f1d1d', align: 'center', headCls: 'uppercase font-bold tracking-[.14em] text-[.96em] border-b pb-0.5', nameCls: 'font-bold uppercase tracking-[.12em] text-[2em] text-slate-900' },
  academic: { label: 'Academic', desc: 'Serif, left-aligned, for teachers and researchers', font: 'Cambria, Georgia, serif', accent: '#1e3a8a', rule: '#93c5fd', align: 'left', headCls: 'font-bold text-[1.06em] border-b pb-0.5', nameCls: 'font-bold text-[2.2em] leading-tight text-slate-900' },
};

const Link = ({ href, children }) => <a href={href} className="text-inherit no-underline">{children}</a>;
const items = (x, keys) => (x.bullets?.length ? x.bullets : keys.flatMap((k) => splitLines(x[k])));
const bySection = (cv, cat) => (cv.achievements || []).filter((a) => a.text?.trim() && cat(a.category));
const isCert = (c) => c === 'Certification';
const isLead = (c) => c === 'Leadership role' || c === 'Volunteering';

export default function CVDocument({ cv, print = false, className = '' }) {
  const { basics: b, career, settings: s } = cv;
  const p = profileOf(cv);
  const t = TEMPLATES[s.template] || TEMPLATES.modern;
  const order = sectionOrder(cv);
  const gap = `${(s.spacing * 0.6).toFixed(2)}em`;
  const center = t.align === 'center';

  const contacts = [
    b.email && <Link key="e" href={`mailto:${b.email}`}>{b.email}</Link>,
    b.phone && <span key="p">{b.phone}</span>,
    b.location && <span key="l">{b.location}</span>,
    b.linkedin && <Link key="li" href={normUrl(b.linkedin)}>{shortUrl(b.linkedin)}</Link>,
    b.github && <Link key="g" href={normUrl(b.github)}>{shortUrl(b.github)}</Link>,
    b.portfolio && <Link key="w" href={normUrl(b.portfolio)}>{shortUrl(b.portfolio)}</Link>,
  ].filter(Boolean);

  const Section = ({ id, children }) => (
    <section style={{ marginTop: gap }}>
      <h2 className={`${t.headCls} mb-1.5`} style={{ color: t.accent, borderColor: t.rule }}>{sectionLabel(cv, id)}</h2>
      {children}
    </section>
  );
  const Bullets = ({ list }) => list.length ? <ul className="ml-4 list-disc space-y-0.5 marker:text-slate-400">{list.map((x, i) => <li key={i}>{x}</li>)}</ul> : null;
  const Row = ({ left, right }) => <div className="flex items-baseline justify-between gap-3"><div className="font-semibold text-slate-900">{left}</div>{right && <div className="shrink-0 text-[.92em] text-slate-500">{right}</div>}</div>;

  const render = {
    summary: () => cv.summary?.trim() && <Section id="summary"><p>{cv.summary}</p></Section>,
    education: () => { const l = cv.education.filter((e) => e.degree || e.school); return l.length > 0 && (
      <Section id="education">{l.map((e) => (
        <div key={e.id} className="break-inside-avoid" style={{ marginTop: '.4em' }}>
          <Row left={[e.degree, e.department].filter(Boolean).join(', ')} right={[e.start, e.end].filter(Boolean).join(' - ')} />
          <div className="flex justify-between gap-3 text-slate-700"><span>{e.school}</span>{e.grade && <span className="shrink-0">{e.grade}</span>}</div>
          {e.coursework && <div className="text-[.95em] text-slate-600"><b className="font-semibold">{p.edu.courseDoc}:</b> {e.coursework}</div>}
        </div>))}</Section>); },
    skills: () => { const { technical: tech = [], soft = [] } = cv.skills; return (tech.length > 0 || soft.length > 0) && (
      <Section id="skills"><div className="space-y-0.5">
        {tech.length > 0 && <div><b className="font-semibold text-slate-900">{p.skills.techDoc}:</b> {tech.join(', ')}</div>}
        {soft.length > 0 && <div><b className="font-semibold text-slate-900">{p.skills.softDoc}:</b> {soft.join(', ')}</div>}
      </div></Section>); },
    experience: () => { const l = cv.experience.filter((x) => x.company || x.position); return l.length > 0 && (
      <Section id="experience">{l.map((x) => (
        <div key={x.id} className="break-inside-avoid" style={{ marginTop: '.45em' }}>
          <Row left={[x.position, x.company].filter(Boolean).join(' - ')} right={dateRange(x.start, x.end, x.current)} />
          {(x.location || x.tech) && <div className="text-[.95em] text-slate-600">{[x.location, x.tech && `${p.exp.techDoc}: ${splitList(x.tech).join(', ')}`].filter(Boolean).join(' | ')}</div>}
          <Bullets list={items(x, ['responsibilities', 'achievements'])} />
        </div>))}</Section>); },
    projects: () => { const l = cv.projects.filter((x) => x.name); return l.length > 0 && (
      <Section id="projects">{l.map((x) => (
        <div key={x.id} className="break-inside-avoid" style={{ marginTop: '.45em' }}>
          <Row left={x.name} right={[x.github && <Link key="g" href={normUrl(x.github)}>{p.proj.linkADoc}</Link>, x.demo && <Link key="d" href={normUrl(x.demo)}>{p.proj.linkBDoc}</Link>].filter(Boolean).reduce((a, y, i) => (i ? [...a, ' | ', y] : [y]), [])} />
          {x.tech && <div className="text-[.95em] text-slate-600">{p.proj.techDoc}: {splitList(x.tech).join(', ')}</div>}
          <Bullets list={items(x, ['built', 'features'])} />
        </div>))}</Section>); },
    achievements: () => { const l = bySection(cv, (c) => !isCert(c) && !isLead(c)); return l.length > 0 && <Section id="achievements"><Bullets list={l.map((a) => (a.category === 'Other' ? a.text : `${a.category}: ${a.text}`))} /></Section>; },
    certifications: () => { const l = bySection(cv, isCert); return l.length > 0 && <Section id="certifications"><Bullets list={l.map((a) => a.text)} /></Section>; },
    leadership: () => { const l = bySection(cv, isLead); return l.length > 0 && <Section id="leadership"><Bullets list={l.map((a) => (a.category === 'Volunteering' ? `Volunteering: ${a.text}` : a.text))} /></Section>; },
  };

  // Profession-specific sections (publications, CME, notable matters, clinical placements ...)
  p.extras.forEach((def) => {
    render[def.id] = () => {
      const l = (cv.extras || []).filter((x) => x.section === def.id && (x.title?.trim() || x.org?.trim()));
      return l.length > 0 && (
        <Section id={def.id}>{l.map((x) => (
          <div key={x.id} className="break-inside-avoid" style={{ marginTop: '.35em' }}>
            <Row left={x.title} right={x.year} />
            {x.org && <div className="text-slate-700">{x.org}</div>}
            {x.detail && <div className="text-[.95em] text-slate-600">{x.detail}</div>}
          </div>))}</Section>
      );
    };
  });

  return (
    <div
      className={`cv-sheet bg-white text-slate-800 ${className}`}
      style={{
        fontFamily: t.font, fontSize: `${s.fontSize}pt`, lineHeight: s.spacing,
        ...(print ? {} : {
          width: '210mm', minHeight: '297mm', padding: '14mm', boxSizing: 'border-box',
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent calc(297mm - 1px), #cbd5e1 calc(297mm - 1px), #cbd5e1 297mm)',
        }),
      }}
    >
      <header className={`flex items-center gap-4 ${center ? 'justify-center text-center' : 'justify-between'}`}>
        <div>
          <h1 className={t.nameCls}>{b.fullName || 'Your Name'}</h1>
          {career.targetRole && <div className="mt-0.5 font-medium" style={{ color: t.accent }}>{career.targetRole}</div>}
          {p.license && b.license?.trim() && <div className="text-[.93em] text-slate-600">{p.license.doc}: {b.license}</div>}
          <div className={`mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[.93em] text-slate-600 ${center ? 'justify-center' : ''}`}>
            {contacts.map((c, i) => <span key={i} className="flex items-center gap-3">{i > 0 && <span className="text-slate-300">|</span>}{c}</span>)}
          </div>
        </div>
        {s.template === 'modern' && b.photo && <img src={b.photo} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover" />}
      </header>
      {order.map((k) => <div key={k}>{render[k]?.()}</div>)}
    </div>
  );
}