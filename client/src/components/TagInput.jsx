import { useState } from 'react';
import { X } from 'lucide-react';

/** Type a skill and press Enter or comma. Pasting "a, b, c" adds all. Unlimited entries. */
export default function TagInput({ label, tags, onChange, placeholder, suggestions = [] }) {
  const [text, setText] = useState('');
  const add = (raw) => {
    const items = raw.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    const next = [...tags];
    items.forEach((i) => !next.some((t) => t.toLowerCase() === i.toLowerCase()) && next.push(i));
    onChange(next);
    setText('');
  };
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            {t}<button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`}><X size={12} /></button>
          </span>
        ))}
        <input
          value={text} placeholder={tags.length ? '' : placeholder}
          onChange={(e) => (/[,;]$/.test(e.target.value) ? add(e.target.value) : setText(e.target.value))}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); text.trim() && add(text); } if (e.key === 'Backspace' && !text && tags.length) onChange(tags.slice(0, -1)); }}
          onBlur={() => text.trim() && add(text)}
          className="min-w-[120px] flex-1 bg-transparent px-1.5 py-1 text-sm outline-none"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase())).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="chip hover:border-brand-300 hover:bg-brand-50">+ {s}</button>
          ))}
        </div>
      )}
    </div>
  );
}
