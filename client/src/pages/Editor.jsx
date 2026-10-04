import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronDown, Eye, FileText, Palette, Pencil, Printer, Save, Sparkles, Target, ArrowLeft, Download } from 'lucide-react';
import Logo from '../components/Logo';
import CVPreview from '../components/CVPreview';
import DesignPanel from '../components/DesignPanel';
import JobOptimizer from '../components/JobOptimizer';
import AIText from '../components/AIText';
import { STEPS, stepMeta } from '../components/steps';
import { useCV } from '../context/CVContext';
import { useToast } from '../context/ToastContext';
import { ai } from '../services/api';
import { cn, printCV } from '../utils/helpers';

const TABS = [['content', 'Content', Pencil], ['design', 'Design', Palette], ['optimize', 'Optimize', Target]];

function Accordion({ title, Icon, open, onToggle, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
        <span className="flex items-center gap-2.5 text-sm font-bold"><Icon size={17} className="text-brand-600" />{title}</span>
        <ChevronDown size={17} className={cn('text-slate-400 transition', open && 'rotate-180')} />
      </button>
      {open && <div className="border-t border-slate-100 p-4">{children}</div>}
    </div>
  );
}

export default function Editor() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const { cvs, cv, activeId, selectCV, updateCV, renameCV, saveNow, saveState } = useCV();
  const toast = useToast();
  const nav = useNavigate();
  const [tab, setTab] = useState(params.get('tab') || 'content');
  const [mobile, setMobile] = useState('edit');
  const [openId, setOpenId] = useState('summary');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (id && id !== activeId && cvs.some((c) => c.id === id)) selectCV(id); }, [id, activeId, cvs, selectCV]);
  useEffect(() => { if (id && cvs.length && !cvs.some((c) => c.id === id)) nav('/dashboard', { replace: true }); }, [id, cvs, nav]);
  useEffect(() => { if (params.get('download') && cv) { const t = setTimeout(() => { printCV(cv.basics.fullName); setParams({}, { replace: true }); }, 700); return () => clearTimeout(t); } }, [cv?.id]); // eslint-disable-line

  if (!cv || cv.id !== id) return null;

  const genSummary = async () => {
    setBusy(true);
    try { const r = await ai.summary(cv); updateCV((d) => { d.summary = r.summary; }); } catch (e) { toast(e.message, 'error'); } finally { setBusy(false); }
  };
  const save = async () => { await saveNow(); toast('Draft saved.'); };
  const pdf = () => { toast('In the print dialog choose "Save as PDF" (A4, margins: Default, headers/footers off).', 'info'); setTimeout(() => printCV(cv.basics.fullName), 400); };

  return (
    <div className="flex h-screen flex-col bg-slate-50 print:hidden">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-3 sm:px-4">
        <button onClick={() => nav('/dashboard')} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Back to dashboard"><ArrowLeft size={18} /></button>
        <div className="hidden sm:block"><Logo /></div>
        <input value={cv.title} onChange={(e) => renameCV(cv.id, e.target.value)} className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-semibold hover:border-slate-200 focus:border-brand-500 focus:outline-none sm:max-w-xs sm:flex-none" aria-label="CV title" />
        <span className="hidden text-xs text-slate-400 md:inline">{saveState === 'saving' ? 'Saving...' : 'Saved'}</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={save} className="btn-ghost btn-sm"><Save size={14} /><span className="hidden lg:inline">Save Draft</span></button>
          <button onClick={() => printCV(cv.basics.fullName)} className="btn-ghost btn-sm"><Printer size={14} /><span className="hidden lg:inline">Print CV</span></button>
          <button onClick={pdf} className="btn-primary btn-sm"><Download size={14} /> <span>Download PDF</span></button>
        </div>
      </header>

      {/* mobile switch */}
      <div className="flex shrink-0 border-b border-slate-200 bg-white lg:hidden">
        {[['edit', 'Edit', Pencil], ['preview', 'Preview', Eye]].map(([k, l, I]) => (
          <button key={k} onClick={() => setMobile(k)} className={cn('flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-semibold', mobile === k ? 'border-b-2 border-brand-600 text-brand-700' : 'text-slate-500')}><I size={15} />{l}</button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(380px,44%)_1fr]">
        {/* LEFT: controls */}
        <aside className={cn('min-h-0 flex-col border-r border-slate-200 bg-slate-50', mobile === 'edit' ? 'flex' : 'hidden lg:flex')}>
          <div className="flex shrink-0 gap-1 border-b border-slate-200 bg-white p-2">
            {TABS.map(([k, l, I]) => (
              <button key={k} onClick={() => setTab(k)} className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition', tab === k ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-100')}><I size={15} />{l}</button>
            ))}
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {tab === 'content' && (
              <>
                <Accordion title="Professional Summary" Icon={FileText} open={openId === 'summary'} onToggle={() => setOpenId(openId === 'summary' ? '' : 'summary')}>
                  <AIText label="Summary" kind="paragraph" rows={5} value={cv.summary} onChange={(v) => updateCV((d) => { d.summary = v; })} placeholder="Generate a tailored 3-5 line summary from your details." />
                  <button onClick={genSummary} disabled={busy} className="btn-primary btn-sm mt-3"><Sparkles size={14} /> {busy ? 'Generating...' : 'Generate summary with AI'}</button>
                </Accordion>
                {STEPS.map((st) => stepMeta(st, cv)).map(({ id: sid, title, Icon, Comp, validate }) => (
                  <Accordion key={sid} title={title} Icon={Icon} open={openId === sid} onToggle={() => setOpenId(openId === sid ? '' : sid)}>
                    <Comp cv={cv} updateCV={updateCV} errors={openId === sid ? validate(cv) : {}} />
                  </Accordion>
                ))}
              </>
            )}
            {tab === 'design' && <DesignPanel />}
            {tab === 'optimize' && <JobOptimizer />}
          </div>
        </aside>

        {/* RIGHT: live preview */}
        <section className={cn('min-h-0', mobile === 'preview' ? 'block' : 'hidden lg:block')}><CVPreview /></section>
      </div>
    </div>
  );
}