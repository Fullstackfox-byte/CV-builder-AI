import { useState } from 'react';
import { BookOpen, Briefcase, Cpu, HeartPulse, Loader2, Scale, Sparkles, Stethoscope, Wand2 } from 'lucide-react';
import { TextInput } from '../Field';
import AIText from '../AIText';
import { PROFESSIONS, STATUSES, applyProfession, profileOf } from '../../utils/defaultCV';
import { cn } from '../../utils/helpers';
import { ai } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ICONS = { engineering: Cpu, doctor: Stethoscope, nurse: HeartPulse, lawyer: Scale, teacher: BookOpen, business: Briefcase, other: Sparkles };

export default function StepCareer({ cv, updateCV, errors = {} }) {
  const c = cv.career;
  const p = profileOf(cv);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const set = (k) => (v) => updateCV((d) => { d.career[k] = v; });
  const generate = async () => {
    setBusy(true);
    try { set('objective')((await ai.objective(cv)).objective); } catch (e) { toast(e.message, 'error'); } finally { setBusy(false); }
  };
  const choose = (key) => updateCV((d) => {
    applyProfession(d, key);
    // Only engineering starts with a project card. For other professions projects are optional,
    // so an untouched empty card is removed (the user can still click "Add ...").
    const [only] = d.projects;
    if (key !== 'engineering' && d.projects.length === 1 && !only.name && !only.built && !only.problem && !only.features && !only.tech) d.projects = [];
  });
  return (
    <div className="space-y-5">
      <div>
        <label className="label">Your profession *</label>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.values(PROFESSIONS).map((x) => {
            const I = ICONS[x.key];
            const on = c.profession === x.key;
            return (
              <button key={x.key} type="button" onClick={() => !on && choose(x.key)} className={cn('flex items-start gap-3 rounded-2xl border p-3.5 text-left transition', on ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200' : 'border-slate-200 bg-white hover:border-brand-300')}>
                <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', on ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600')}><I size={20} /></span>
                <span><span className="block text-sm font-bold">{x.label}</span><span className="block text-xs text-slate-500">{x.blurb}</span></span>
              </button>
            );
          })}
        </div>
        {errors.profession && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.profession}</p>}
        <p className="mt-2 text-xs text-slate-400">Changing the profession later resets the template and section order to that profession's default. You can adjust them again in the Design tab.</p>
      </div>

      {c.profession && (
        <>
          <div>
            <label className="label">Current status *</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s} type="button" onClick={() => set('status')(s)} className={cn('rounded-xl border px-3.5 py-2 text-sm font-medium transition', c.status === s ? 'border-brand-600 bg-brand-600 text-white shadow' : 'border-slate-200 bg-white hover:border-brand-300')}>{p.statuses[s]}</button>
              ))}
            </div>
            {errors.status && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.status}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <TextInput label="Target Job Role *" value={c.targetRole} onChange={set('targetRole')} error={errors.targetRole} placeholder={p.career.rolePh} />
            <TextInput label="Industry / Setting" value={c.industry} onChange={set('industry')} placeholder={p.career.industryPh} />
            <TextInput label="Years of Experience" type="number" min="0" value={c.years} onChange={set('years')} error={errors.years} placeholder="0" />
          </div>
          {p.license && (
            <div>
              <TextInput label={`${p.license.label} (optional)`} value={cv.basics.license || ''} onChange={(v) => updateCV((d) => { d.basics.license = v; })} placeholder={p.license.ph} />
              <p className="mt-1.5 text-xs text-slate-400">Shown under your name on the CV. It is never sent to the AI.</p>
            </div>
          )}
          <div>
            <AIText label="Career Objective" kind="paragraph" rows={3} value={c.objective} onChange={set('objective')} placeholder="Not sure what to write? Let AI draft it for you." hint="Optional - your CV uses a professional summary generated from all your details." />
            <button type="button" onClick={generate} disabled={busy} className="btn-ghost btn-sm mt-2 border-brand-200 text-brand-700">
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} Generate with AI
            </button>
          </div>
        </>
      )}
    </div>
  );
}