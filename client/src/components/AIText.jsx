import { useState } from 'react';
import { Loader2, Sparkles, Undo2 } from 'lucide-react';
import { ai } from '../services/api';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils/helpers';

export const AI_TOOLS = [
  ['improve', 'Improve Writing'], ['professional', 'Make More Professional'], ['concise', 'Make Concise'],
  ['verbs', 'Add Strong Action Verbs'], ['ats', 'Improve for ATS'], ['bullets', 'Generate Bullet Points'],
];

/** Textarea with a row of AI improvement tools (one-level undo). kind: "paragraph" | "lines" */
export default function AIText({ label, value, onChange, kind = 'lines', context = {}, rows = 3, placeholder, hint, error }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState('');
  const [prev, setPrev] = useState(null);
  const toast = useToast();
  const tools = kind === 'paragraph' ? AI_TOOLS.filter(([k]) => !['bullets', 'verbs'].includes(k)) : AI_TOOLS;

  const run = async (action) => {
    if (!value?.trim()) return toast('Write a few words first, then let AI polish them.', 'info');
    setBusy(action);
    try {
      const r = await ai.improve({ text: value, action, context: { kind, ...context } });
      setPrev(value);
      onChange(r.text);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy('');
    }
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="label !mb-0">{label}</label>
        <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50">
          <Sparkles size={13} /> AI tools
        </button>
      </div>
      <textarea rows={rows} placeholder={placeholder} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={cn('input resize-y', error && 'input-error')} />
      {open && (
        <div className="mt-2 flex flex-wrap gap-1.5 animate-pop">
          {tools.map(([k, l]) => (
            <button key={k} type="button" disabled={!!busy} onClick={() => run(k)} className="chip transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-60">
              {busy === k && <Loader2 size={12} className="animate-spin" />} {l}
            </button>
          ))}
          {prev !== null && (
            <button type="button" onClick={() => { onChange(prev); setPrev(null); }} className="chip border-amber-200 bg-amber-50 text-amber-700"><Undo2 size={12} /> Undo</button>
          )}
        </div>
      )}
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : hint ? <p className="mt-1.5 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
