import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MessagesSquare, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import Interview from '../components/Interview';
import { STEPS, stepMeta } from '../components/steps';
import { useCV } from '../context/CVContext';
import { cn } from '../utils/helpers';

export default function Wizard() {
  const { cv, createCV, updateCV, saveState } = useCV();
  const nav = useNavigate();
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => { if (!cv) createCV('My CV'); }, [cv, createCV]);
  if (!cv) return null;

  const step = cv.meta?.step ?? 0;
  const interview = step >= STEPS.length;
  const go = (n) => { updateCV((d) => { d.meta = { ...d.meta, step: n }; }); setShowErrors(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const S = stepMeta(STEPS[Math.min(step, STEPS.length - 1)], cv);
  const errors = showErrors ? S.validate(cv) : {};

  const next = () => {
    if (Object.keys(S.validate(cv)).length) { setShowErrors(true); return; }
    go(step + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/60 to-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="hidden sm:inline">{saveState === 'saving' ? 'Saving...' : 'All changes saved'}</span>
            <button onClick={() => nav('/dashboard')} className="btn-ghost btn-sm">Save &amp; exit</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* stepper */}
        <ol className="mb-8 flex items-center justify-between gap-1">
          {[...STEPS.map((x) => stepMeta(x, cv)), { id: 'interview', title: 'AI Interview', Icon: MessagesSquare }].map((s, i) => (
            <li key={s.id} className="flex flex-1 flex-col items-center gap-1.5">
              <button
                onClick={() => i < step && go(i)} disabled={i > step} aria-label={s.title}
                className={cn('grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-bold transition', i < step ? 'border-brand-600 bg-brand-600 text-white' : i === step ? 'border-brand-600 bg-white text-brand-600 ring-4 ring-brand-100' : 'border-slate-200 bg-white text-slate-400')}
              >{i < step ? <Check size={16} /> : <s.Icon size={16} />}</button>
              <span className={cn('hidden text-[11px] font-semibold md:block', i === step ? 'text-brand-700' : 'text-slate-400')}>{s.title}</span>
            </li>
          ))}
        </ol>

        <div className="card animate-fadeUp !p-6 sm:!p-8" key={step}>
          {interview ? (
            <Interview onDone={() => nav(`/editor/${cv.id}`)} />
          ) : (
            <>
              <div className="mb-6"><p className="text-xs font-bold uppercase tracking-wider text-brand-600">Step {step + 1} of {STEPS.length}</p><h1 className="text-2xl font-extrabold tracking-tight">{S.title}</h1><p className="text-sm text-slate-500">{S.desc}</p></div>
              <S.Comp cv={cv} updateCV={updateCV} errors={errors} />
              {showErrors && Object.keys(errors).length > 0 && <p className="mt-5 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">Please fix the highlighted fields to continue.</p>}
              <div className="mt-8 flex items-center justify-between">
                <button onClick={() => go(step - 1)} disabled={step === 0} className="btn-ghost"><ArrowLeft size={16} /> Back</button>
                <button onClick={next} className="btn-primary">{step === STEPS.length - 1 ? 'Start AI Interview' : 'Continue'} <ArrowRight size={16} /></button>
              </div>
            </>
          )}
        </div>
        {interview && <div className="mt-4 text-center"><button onClick={() => go(STEPS.length - 1)} className="text-sm font-medium text-slate-500 hover:text-brand-600">Back to achievements</button></div>}
        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400"><ShieldCheck size={13} /> Your information is used only to build your CV.</p>
      </div>
    </div>
  );
}