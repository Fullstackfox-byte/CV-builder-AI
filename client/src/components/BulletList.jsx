import { Loader2, Plus, Sparkles, X } from 'lucide-react';

/** Editable list of resume bullets with an AI "Generate" action. */
export default function BulletList({ bullets = [], onChange, onGenerate, busy }) {
  const set = (i, v) => onChange(bullets.map((b, j) => (j === i ? v : b)));
  return (
    <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="label !mb-0 text-brand-700">Resume bullet points</span>
        <button type="button" onClick={onGenerate} disabled={busy} className="btn-primary btn-sm">
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} Generate with AI
        </button>
      </div>
      {bullets.length === 0 && <p className="text-xs text-slate-500">Fill in the details above, then let AI turn them into 2-4 professional bullet points.</p>}
      <div className="space-y-2">
        {bullets.map((b, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <textarea rows={2} value={b} onChange={(e) => set(i, e.target.value)} className="input resize-y" />
            <button type="button" onClick={() => onChange(bullets.filter((_, j) => j !== i))} className="mt-2 text-slate-400 hover:text-red-500" aria-label="Remove bullet"><X size={16} /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...bullets, ''])} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-700"><Plus size={13} /> Add bullet</button>
    </div>
  );
}
