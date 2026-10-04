import { ArrowDown, ArrowUp } from 'lucide-react';
import { TEMPLATES } from './CVDocument';
import { sectionLabel, sectionOrder } from '../utils/defaultCV';
import { cn } from '../utils/helpers';
import { useCV } from '../context/CVContext';

export default function DesignPanel() {
  const { cv, updateCV } = useCV();
  const s = cv.settings;
  const order = sectionOrder(cv);
  const move = (i, dir) => updateCV((d) => { const o = [...order]; const j = i + dir; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; d.settings.order = o; });
  return (
    <div className="space-y-6">
      <div>
        <h3 className="label">Template</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(TEMPLATES).map(([k, t]) => (
            <button key={k} onClick={() => updateCV((d) => { d.settings.template = k; })} className={cn('rounded-xl border p-3 text-left transition', s.template === k ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-200' : 'border-slate-200 bg-white hover:border-brand-300')}>
              <div className="mb-2 h-1.5 w-10 rounded" style={{ background: t.accent }} />
              <div className="text-sm font-bold" style={{ fontFamily: t.font }}>{t.label}</div>
              <div className="mt-0.5 text-xs text-slate-500">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Font size: {s.fontSize}pt</label>
          <input type="range" min="9" max="12" step="0.5" value={s.fontSize} onChange={(e) => updateCV((d) => { d.settings.fontSize = +e.target.value; })} className="w-full accent-brand-600" />
        </div>
        <div>
          <label className="label">Spacing: {s.spacing.toFixed(2)}</label>
          <input type="range" min="1.15" max="1.7" step="0.05" value={s.spacing} onChange={(e) => updateCV((d) => { d.settings.spacing = +e.target.value; })} className="w-full accent-brand-600" />
        </div>
      </div>
      <div>
        <h3 className="label">Section order</h3>
        <ul className="space-y-1.5">
          {order.map((k, i) => (
            <li key={k} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="font-medium">{sectionLabel(cv, k)}</span>
              <span className="flex gap-1">
                <button disabled={i === 0} onClick={() => move(i, -1)} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up"><ArrowUp size={15} /></button>
                <button disabled={i === order.length - 1} onClick={() => move(i, 1)} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move down"><ArrowDown size={15} /></button>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-400">Sections without content are hidden automatically.</p>
      </div>
    </div>
  );
}