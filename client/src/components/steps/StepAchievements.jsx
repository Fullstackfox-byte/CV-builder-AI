import { Plus } from 'lucide-react';
import EntryCard from '../EntryCard';
import { SelectInput, TextInput } from '../Field';
import { emptyAchievement, emptyExtra, profileOf } from '../../utils/defaultCV';

export default function StepAchievements({ cv, updateCV }) {
  const p = profileOf(cv);
  const extras = cv.extras || [];
  const setA = (i, k) => (v) => updateCV((d) => { d.achievements[i][k] = v; });
  const setX = (i, k) => (v) => updateCV((d) => { d.extras[i][k] = v; });
  return (
    <div className="space-y-8">
      {p.extras.map((def) => {
        const rows = extras.map((e, i) => ({ e, i })).filter(({ e }) => e.section === def.id);
        return (
          <div key={def.id} className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">{def.label}</h3>
            {rows.length === 0 && <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">Optional - add an entry if you have one.</p>}
            {rows.map(({ e, i }) => (
              <EntryCard key={e.id} title={e.title || def.label} onRemove={() => updateCV((d) => { d.extras.splice(i, 1); })}>
                <TextInput label={def.titleLabel} value={e.title} onChange={setX(i, 'title')} placeholder={def.titlePh} className="sm:col-span-2" />
                <TextInput label={def.orgLabel} value={e.org} onChange={setX(i, 'org')} placeholder={def.orgPh} />
                <TextInput label="Year" value={e.year} onChange={setX(i, 'year')} placeholder="2025" />
                <TextInput label="Details (optional)" value={e.detail} onChange={setX(i, 'detail')} placeholder={def.detailPh} className="sm:col-span-2" />
              </EntryCard>
            ))}
            <button type="button" onClick={() => updateCV((d) => { d.extras = d.extras || []; d.extras.push(emptyExtra(def.id)); })} className="btn-ghost w-full border-dashed"><Plus size={16} /> Add {def.label}</button>
          </div>
        );
      })}

      <div className="space-y-3">
        {p.extras.length > 0 && <h3 className="text-sm font-bold text-slate-800">{p.labels.achievements}, certifications &amp; volunteering</h3>}
        {cv.achievements.length === 0 && <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">Awards, certifications, scholarships, leadership roles, volunteering - add anything you are proud of.</p>}
        {cv.achievements.map((a, i) => (
          <EntryCard key={a.id} title={a.category} onRemove={() => updateCV((d) => { d.achievements.splice(i, 1); })}>
            <SelectInput label="Category" value={a.category} onChange={setA(i, 'category')} options={p.ach.cats.includes(a.category) ? p.ach.cats : [a.category, ...p.ach.cats]} />
            <TextInput label="Details" value={a.text} onChange={setA(i, 'text')} placeholder={p.ach.ph} />
          </EntryCard>
        ))}
        <button type="button" onClick={() => updateCV((d) => { d.achievements.push({ ...emptyAchievement(), category: p.ach.cats[0] }); })} className="btn-ghost w-full border-dashed"><Plus size={16} /> Add Achievement</button>
      </div>
    </div>
  );
}