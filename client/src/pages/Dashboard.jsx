import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Download, FilePlus2, FileText, Pencil, Plus, ScanSearch, Target, Trash2, X } from 'lucide-react';
import { useCV } from '../context/CVContext';
import { useToast } from '../context/ToastContext';
import { CV_PRESETS } from '../utils/defaultCV';
import { timeAgo } from '../utils/helpers';
import { TEMPLATES } from '../components/CVDocument';

export default function Dashboard() {
  const { cvs, cv, selectCV, createCV, deleteCV } = useCV();
  const nav = useNavigate();
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('General CV');
  const [from, setFrom] = useState('');

  const named = cvs.find((c) => c.basics.fullName);
  const first = named?.basics.fullName.split(' ')[0];
  const active = cv || cvs[0];
  const score = active?.optimization?.result?.score;
  const edit = (c, q = '') => { selectCV(c.id); nav(`/editor/${c.id}${q}`); };

  const create = () => {
    const id = createCV(title.trim() || 'Untitled CV', from || null);
    setModal(false);
    nav(from ? `/editor/${id}` : '/create');
  };
  const remove = (c) => { if (window.confirm(`Delete "${c.title}"? This cannot be undone.`)) { deleteCV(c.id); toast('CV deleted.', 'info'); } };

  const cards = [
    [FileText, 'My CVs', `${cvs.length} saved`, () => document.getElementById('cv-list')?.scrollIntoView({ behavior: 'smooth' })],
    [FilePlus2, 'Create New CV', 'Start a new version', () => setModal(true)],
    [Pencil, 'Edit CV', active ? active.title : 'Nothing to edit yet', () => active && edit(active)],
    [Download, 'Download CV', 'Export as PDF', () => active && edit(active, '?download=1')],
    [ScanSearch, 'ATS Score', score != null ? `${score}% (estimate)` : 'Not analyzed yet', () => active && edit(active, '?tab=optimize')],
    [Target, 'Job Optimization', 'Tailor to a job post', () => active && edit(active, '?tab=optimize')],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {first || 'there'} <span className="inline-block animate-float">👋</span></h1>
      <p className="mt-1 text-slate-500">Manage your CV versions, optimize for jobs and download.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([Icon, t, sub, fn]) => (
          <button key={t} onClick={fn} className="card flex items-center gap-4 text-left transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon size={22} /></span>
            <span className="min-w-0"><span className="block font-bold">{t}</span><span className="block truncate text-sm text-slate-500">{sub}</span></span>
          </button>
        ))}
      </div>

      <div id="cv-list" className="mt-12 flex items-center justify-between">
        <h2 className="text-xl font-extrabold">My CVs</h2>
        <button onClick={() => setModal(true)} className="btn-primary btn-sm"><Plus size={15} /> New CV</button>
      </div>
      {cvs.length === 0 ? (
        <div className="card mt-4 py-14 text-center"><p className="font-semibold">No CVs yet</p><p className="mt-1 text-sm text-slate-500">Create your first one - it only takes a few minutes.</p><button onClick={() => nav('/create')} className="btn-primary mt-5">Create My CV</button></div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cvs.map((c) => (
            <div key={c.id} className="card flex flex-col transition hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0"><h3 className="truncate font-bold">{c.title}</h3><p className="truncate text-sm text-slate-500">{c.basics.fullName || 'Unnamed'}{c.career.targetRole ? ` · ${c.career.targetRole}` : ''}</p></div>
                {c.id === active?.id && <span className="chip border-brand-200 bg-brand-50 text-brand-700">Active</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-500">
                <span className="chip">{TEMPLATES[c.settings.template]?.label}</span>
                {c.optimization?.result && <span className="chip">ATS {c.optimization.result.score}%</span>}
                {c.meta?.stage !== 'done' && <span className="chip border-amber-200 bg-amber-50 text-amber-700">Draft</span>}
              </div>
              <p className="mt-3 text-xs text-slate-400">Updated {timeAgo(c.updatedAt)}</p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button onClick={() => (c.meta?.stage === 'done' ? edit(c) : (selectCV(c.id), nav('/create')))} className="btn-primary btn-sm"><Pencil size={13} /> {c.meta?.stage === 'done' ? 'Edit' : 'Continue'}</button>
                <button onClick={() => edit(c, '?download=1')} className="btn-ghost btn-sm" aria-label="Download"><Download size={13} /></button>
                <button onClick={() => { const id = createCV(`${c.title} (copy)`, c.id); toast('Duplicated.'); nav(`/editor/${id}`); }} className="btn-ghost btn-sm" aria-label="Duplicate"><Copy size={13} /></button>
                <button onClick={() => remove(c)} className="btn-ghost btn-sm ml-auto text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setModal(false)}>
          <div className="card w-full max-w-md animate-pop !p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-extrabold">Create a new CV</h3><button onClick={() => setModal(false)} aria-label="Close"><X size={18} /></button></div>
            <label className="label">Version name</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="mt-2 flex flex-wrap gap-1.5">{CV_PRESETS.map((p) => <button key={p} onClick={() => setTitle(p)} className="chip hover:border-brand-300 hover:bg-brand-50">{p}</button>)}</div>
            <label className="label mt-4">Start from</label>
            <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">Blank CV (guided form)</option>
              {cvs.map((c) => <option key={c.id} value={c.id}>Copy of "{c.title}"</option>)}
            </select>
            <button onClick={create} className="btn-primary mt-6 w-full">Create</button>
          </div>
        </div>
      )}
    </div>
  );
}
