import { useState } from 'react';
import { Plus } from 'lucide-react';
import EntryCard from '../EntryCard';
import { Field, TextInput } from '../Field';
import AIText from '../AIText';
import BulletList from '../BulletList';
import { emptyExperience, profileOf } from '../../utils/defaultCV';
import { ai } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function StepExperience({ cv, updateCV, errors = {} }) {
  const pf = profileOf(cv);
  const q = pf.exp;
  const [busyId, setBusyId] = useState('');
  const toast = useToast();
  const set = (i, k) => (v) => updateCV((d) => { d.experience[i][k] = v; });
  const gen = async (i) => {
    const x = cv.experience[i];
    if (!x.responsibilities && !x.achievements) return toast('Describe your responsibilities first.', 'info');
    setBusyId(x.id);
    try { const r = await ai.experienceBullets(x, cv); updateCV((d) => { d.experience[i].bullets = r.bullets; }); } catch (e) { toast(e.message, 'error'); } finally { setBusyId(''); }
  };
  return (
    <div className="space-y-4">
      {pf.confid && <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-800">{pf.confid}</p>}
      {cv.experience.length === 0 && <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">{q.empty}</p>}
      {cv.experience.map((x, i) => {
        const er = errors[x.id] || {};
        return (
          <EntryCard key={x.id} title={x.company || `${q.item} ${i + 1}`} onRemove={() => updateCV((d) => { d.experience.splice(i, 1); })}>
            <TextInput label={`${q.companyLabel} *`} value={x.company} onChange={set(i, 'company')} error={er.company} />
            <TextInput label={`${q.positionLabel} *`} value={x.position} onChange={set(i, 'position')} error={er.position} placeholder={q.positionPh} />
            <TextInput label="Location" value={x.location} onChange={set(i, 'location')} placeholder={q.locationPh} />
            <TextInput label={q.techLabel} value={x.tech} onChange={set(i, 'tech')} placeholder={q.techPh} />
            <Field label="Start Date"><input type="month" className="input" value={x.start} onChange={(e) => set(i, 'start')(e.target.value)} /></Field>
            <Field label="End Date" error={er.end}>
              <input type="month" className="input disabled:bg-slate-100" disabled={x.current} value={x.end} onChange={(e) => set(i, 'end')(e.target.value)} />
              <label className="mt-2 flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={x.current} onChange={(e) => set(i, 'current')(e.target.checked)} /> I currently work here</label>
            </Field>
            <div className="sm:col-span-2"><AIText label={q.respLabel} rows={3} value={x.responsibilities} onChange={set(i, 'responsibilities')} placeholder={q.respPh} /></div>
            <div className="sm:col-span-2"><AIText label={q.achLabel} rows={2} value={x.achievements} onChange={set(i, 'achievements')} placeholder={q.achPh} /></div>
            <div className="sm:col-span-2"><BulletList bullets={x.bullets} onChange={set(i, 'bullets')} onGenerate={() => gen(i)} busy={busyId === x.id} /></div>
          </EntryCard>
        );
      })}
      <button type="button" onClick={() => updateCV((d) => { d.experience.push(emptyExperience()); })} className="btn-ghost w-full border-dashed"><Plus size={16} /> {q.add}</button>
    </div>
  );
}