import { Trash2 } from 'lucide-react';

export default function EntryCard({ title, onRemove, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
        {onRemove && <button type="button" onClick={onRemove} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label="Remove"><Trash2 size={15} /></button>}
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">{children}</div>
    </div>
  );
}
