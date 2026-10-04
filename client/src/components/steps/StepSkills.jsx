import TagInput from '../TagInput';
import { profileOf } from '../../utils/defaultCV';

export default function StepSkills({ cv, updateCV }) {
  const p = profileOf(cv).skills;
  return (
    <div className="space-y-6">
      <TagInput label={p.techLabel} tags={cv.skills.technical} onChange={(t) => updateCV((d) => { d.skills.technical = t; })} placeholder="Type a skill and press Enter" suggestions={p.tech} />
      <TagInput label={p.softLabel} tags={cv.skills.soft} onChange={(t) => updateCV((d) => { d.skills.soft = t; })} placeholder="Type a skill and press Enter" suggestions={p.soft} />
      <p className="text-xs text-slate-400">Only list skills you can confidently talk about in an interview. There is no limit on how many you add.</p>
    </div>
  );
}