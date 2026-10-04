import { Plus } from 'lucide-react';
import EntryCard from '../EntryCard';
import { TextInput } from '../Field';
import { emptyEducation, profileOf } from '../../utils/defaultCV';

export default function StepEducation({ cv, updateCV, errors = {} }) {
  const p = profileOf(cv).edu;
  const set = (i, k) => (v) => updateCV((d) => { d.education[i][k] = v; });
  return (
    <div className="space-y-4">
      <datalist id="degree-list">{p.degrees.map((x) => <option key={x} value={x} />)}</datalist>
      {cv.education.map((e, i) => {
        const er = errors[e.id] || {};
        return (
          <EntryCard key={e.id} title={`Education ${i + 1}`} onRemove={cv.education.length > 1 ? () => updateCV((d) => { d.education.splice(i, 1); }) : null}>
            <TextInput label={`${p.degreeLabel} *`} list="degree-list" value={e.degree} onChange={set(i, 'degree')} error={er.degree} placeholder={p.degreePh} />
            <TextInput label={`${p.schoolLabel} *`} value={e.school} onChange={set(i, 'school')} error={er.school} />
            <TextInput label={p.deptLabel} value={e.department} onChange={set(i, 'department')} placeholder={p.deptPh} />
            <TextInput label={p.gradeLabel} value={e.grade} onChange={set(i, 'grade')} placeholder={p.gradePh} />
            <TextInput label="Start Year" value={e.start} onChange={set(i, 'start')} error={er.start} placeholder="2022" maxLength={4} inputMode="numeric" />
            <TextInput label="End Year (or expected)" value={e.end} onChange={set(i, 'end')} error={er.end} placeholder="2026" maxLength={4} inputMode="numeric" />
            <TextInput label={p.courseLabel} value={e.coursework} onChange={set(i, 'coursework')} placeholder={p.coursePh} className="sm:col-span-2" />
          </EntryCard>
        );
      })}
      <button type="button" onClick={() => updateCV((d) => { d.education.push(emptyEducation()); })} className="btn-ghost w-full border-dashed"><Plus size={16} /> Add Education</button>
    </div>
  );
}