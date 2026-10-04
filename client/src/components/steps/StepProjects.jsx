import { useState } from 'react';
import { Plus } from 'lucide-react';
import EntryCard from '../EntryCard';
import { TextInput } from '../Field';
import AIText from '../AIText';
import BulletList from '../BulletList';
import { emptyProject, profileOf } from '../../utils/defaultCV';
import { ai } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function StepProjects({ cv, updateCV, errors = {} }) {
  const pf = profileOf(cv);
  const q = pf.proj;
  const [busyId, setBusyId] = useState('');
  const toast = useToast();
  const set = (i, k) => (v) => updateCV((d) => { d.projects[i][k] = v; });
  const gen = async (i) => {
    const p = cv.projects[i];
    if (!p.name && !p.built) return toast(`Add a ${q.item.toLowerCase()} name and your role first.`, 'info');
    setBusyId(p.id);
    try { const r = await ai.projectBullets(p, cv); updateCV((d) => { d.projects[i].bullets = r.bullets; }); } catch (e) { toast(e.message, 'error'); } finally { setBusyId(''); }
  };
  return (
    <div className="space-y-4">
      {pf.confid && <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-800">{pf.confid}</p>}
      {cv.projects.length === 0 && <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">Optional - skip this step if you have nothing to add.</p>}
      <datalist id="project-types">{q.types.map((t) => <option key={t} value={t} />)}</datalist>
      {cv.projects.map((p, i) => {
        const er = errors[p.id] || {};
        return (
          <EntryCard key={p.id} title={p.name || `${q.item} ${i + 1}`} onRemove={() => updateCV((d) => { d.projects.splice(i, 1); })}>
            <TextInput label={`${q.nameLabel} *`} value={p.name} onChange={set(i, 'name')} error={er.name} placeholder={q.namePh} />
            <TextInput label={q.typeLabel} list="project-types" value={p.type} onChange={set(i, 'type')} placeholder={q.typePh} />
            <TextInput label={q.techLabel} value={p.tech} onChange={set(i, 'tech')} placeholder={q.techPh} className="sm:col-span-2" />
            <div className="sm:col-span-2"><AIText label={q.problemLabel} rows={2} value={p.problem} onChange={set(i, 'problem')} placeholder={q.problemPh} /></div>
            <div className="sm:col-span-2"><AIText label={q.builtLabel} rows={3} value={p.built} onChange={set(i, 'built')} placeholder={q.builtPh} /></div>
            <div className="sm:col-span-2"><AIText label={q.featLabel} rows={2} value={p.features} onChange={set(i, 'features')} hint={q.featHint} placeholder={q.featPh} /></div>
            <TextInput label={q.linkA} value={p.github} onChange={set(i, 'github')} error={er.github} placeholder={q.linkAPh} />
            <TextInput label={q.linkB} value={p.demo} onChange={set(i, 'demo')} error={er.demo} placeholder={q.linkBPh} />
            <div className="sm:col-span-2"><BulletList bullets={p.bullets} onChange={set(i, 'bullets')} onGenerate={() => gen(i)} busy={busyId === p.id} /></div>
          </EntryCard>
        );
      })}
      <button type="button" onClick={() => updateCV((d) => { d.projects.push(emptyProject()); })} className="btn-ghost w-full border-dashed"><Plus size={16} /> {q.add}</button>
    </div>
  );
}