import { Camera, X } from 'lucide-react';
import { TextInput } from '../Field';
import { resizeImage } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function StepBasic({ cv, updateCV, errors = {} }) {
  const b = cv.basics;
  const toast = useToast();
  const set = (k) => (v) => updateCV((d) => { d.basics[k] = v; });
  const onPhoto = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast('Please choose an image file.', 'error');
    try { const url = await resizeImage(f); updateCV((d) => { d.basics.photo = url; }); } catch (err) { toast(err.message, 'error'); }
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextInput label="Full Name *" value={b.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="Aarav Sharma" autoComplete="name" />
      <TextInput label="Professional Email *" type="email" value={b.email} onChange={set('email')} error={errors.email} placeholder="name@example.com" autoComplete="email" />
      <TextInput label="Phone Number *" value={b.phone} onChange={set('phone')} error={errors.phone} placeholder="+91 98765 43210" autoComplete="tel" />
      <TextInput label="Location" value={b.location} onChange={set('location')} placeholder="City, Country" />
      <TextInput label="LinkedIn URL" value={b.linkedin} onChange={set('linkedin')} error={errors.linkedin} placeholder="linkedin.com/in/username" />
      <TextInput label="GitHub URL" value={b.github} onChange={set('github')} error={errors.github} placeholder="github.com/username" />
      <TextInput label="Portfolio URL" value={b.portfolio} onChange={set('portfolio')} error={errors.portfolio} placeholder="yourname.dev" className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <label className="label">Profile Photo (optional)</label>
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-400">
            {b.photo ? <img src={b.photo} alt="Profile" className="h-full w-full object-cover" /> : <Camera size={22} />}
          </div>
          <label className="btn-ghost btn-sm cursor-pointer">Upload photo<input type="file" accept="image/*" hidden onChange={onPhoto} /></label>
          {b.photo && <button type="button" onClick={() => set('photo')('')} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-500"><X size={13} /> Remove</button>}
        </div>
        <p className="mt-2 text-xs text-slate-400">Many recruiters and ATS systems prefer CVs without photos - it is only shown on the Modern template and never sent to the AI.</p>
      </div>
    </div>
  );
}
