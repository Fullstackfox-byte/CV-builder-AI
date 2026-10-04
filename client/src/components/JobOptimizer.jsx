import { useState } from 'react';
import { Loader2, Plus, Target, Check } from 'lucide-react';
import ScoreRing from './ScoreRing';
import { TextArea, TextInput } from './Field';
import { ai } from '../services/api';
import { useCV } from '../context/CVContext';
import { useToast } from '../context/ToastContext';

export default function JobOptimizer() {
  const { cv, updateCV } = useCV();
  const toast = useToast();
  const [role, setRole] = useState(cv.optimization?.targetRole || cv.career.targetRole || '');
  const [jd, setJd] = useState(cv.optimization?.jd || '');
  const [res, setRes] = useState(cv.optimization?.result || null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (jd.trim().length < 40) return toast('Paste the full job description (at least a few lines).', 'info');
    setBusy(true);
    try {
      const r = await ai.optimize(cv, role, jd);
      setRes(r);
      updateCV((d) => { d.optimization = { targetRole: role, jd, result: r, at: Date.now() }; });
    } catch (e) { toast(e.message, 'error'); } finally { setBusy(false); }
  };
  const addSkill = (s) => {
    updateCV((d) => { if (!d.skills.technical.some((x) => x.toLowerCase() === s.toLowerCase())) d.skills.technical.push(s); });
    setRes((r) => ({ ...r, missing: r.missing.filter((x) => x !== s), matched: [...r.matched, s] }));
    toast(`"${s}" added to your skills. Re-analyze to refresh the score.`, 'info');
  };
  const useSummary = () => { updateCV((d) => { d.summary = res.summary; if (role) d.career.targetRole = role; }); toast('Job-specific summary applied to your CV.'); };

  return (
    <div className="space-y-4">
      <TextInput label="Target Job" value={role} onChange={setRole} placeholder="Frontend Developer" />
      <TextArea label="Job Description" rows={7} value={jd} onChange={setJd} placeholder="Paste the job description here..." />
      <button onClick={run} disabled={busy} className="btn-primary w-full">{busy ? <Loader2 size={16} className="animate-spin" /> : <Target size={16} />} Optimize for Job</button>

      {res && (
        <div className="space-y-4 animate-pop">
          <div className="card flex items-center gap-4">
            <ScoreRing score={res.score} />
            <div>
              <div className="text-sm font-bold">ATS Match Score (estimate)</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{res.note}</p>
            </div>
          </div>
          {res.matched.length > 0 && (
            <div><h4 className="label">Keywords you already cover</h4><div className="flex flex-wrap gap-1.5">{res.matched.map((k) => <span key={k} className="chip border-emerald-200 bg-emerald-50 text-emerald-700"><Check size={12} />{k}</span>)}</div></div>
          )}
          {res.missing.length > 0 && (
            <div>
              <h4 className="label">Missing keywords</h4>
              <div className="flex flex-wrap gap-1.5">{res.missing.map((k) => <button key={k} onClick={() => addSkill(k)} className="chip border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"><Plus size={12} />{k}</button>)}</div>
              <p className="mt-1.5 text-xs text-slate-400">Click to add - only add skills you genuinely have.</p>
            </div>
          )}
          <div><h4 className="label">Suggestions</h4><ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">{res.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
          <div className="card !bg-brand-50/50">
            <h4 className="label text-brand-700">Job-specific summary</h4>
            <p className="text-sm leading-relaxed">{res.summary}</p>
            <button onClick={useSummary} className="btn-primary btn-sm mt-3">Use this summary</button>
          </div>
        </div>
      )}
    </div>
  );
}
