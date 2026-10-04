import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, CheckCircle2, ClipboardList, Download, FileCheck2, FileText, LayoutTemplate, MessagesSquare, ScanSearch, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';
import Reveal from '../components/Reveal';
import CVDocument from '../components/CVDocument';
import { sampleCV } from '../utils/sampleCV';

const STEPS = [
  [ClipboardList, 'Share the basics', 'Enter your details, education, skills and projects in a guided form.'],
  [MessagesSquare, 'Answer AI questions', 'Our assistant asks smart follow-ups to uncover your real impact.'],
  [Bot, 'AI writes your CV', 'Your answers become polished, achievement-focused bullet points.'],
  [Download, 'Preview & download', 'Edit live, switch templates, optimize for a job and export a PDF.'],
];
const FEATURES = [
  [Sparkles, 'AI-Powered CV Creation', 'Write simple sentences. The AI turns them into strong, truthful resume bullets - nothing is invented.'],
  [LayoutTemplate, 'Professional Templates', 'Modern, Minimal, Corporate and Developer layouts. Switch instantly without losing a single word.'],
  [ScanSearch, 'ATS-Friendly CVs', 'Single-column, real-text layouts with standard headings that applicant tracking systems can read.'],
  [FileCheck2, 'Export as PDF', 'Crisp A4 output with proper margins and selectable text, ready for job applications.'],
];
const WHY = ['No resume-writing experience needed', 'Asks only the questions that matter', 'Never fabricates or exaggerates', 'Job-specific optimization with match estimate', 'Auto-saves your progress', 'API keys stay on the server'];

export default function Landing() {
  const nav = useNavigate();
  const [example, setExample] = useState(false);
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fadeUp">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm"><Zap size={13} /> Your AI career assistant</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">Build a Professional CV <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">with AI</span></h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">Tell us about yourself. We'll turn your experience, skills and achievements into a professional CV.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => nav('/create')} className="btn-primary px-6 py-3 text-base">Create My CV <ArrowRight size={18} /></button>
              <button onClick={() => setExample(true)} className="btn-ghost px-6 py-3 text-base">See Example CV</button>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck size={14} className="text-emerald-500" /> Free to use. Your data stays private.</p>
          </div>
          <div className="relative hidden animate-float lg:block">
            <div className="mx-auto w-[340px] rotate-2 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200">
              <div style={{ zoom: 0.42 }}><CVDocument cv={sampleCV} /></div>
            </div>
            <div className="absolute -left-2 top-10 rounded-xl bg-white px-3 py-2 text-xs font-semibold shadow-lg ring-1 ring-slate-100"><span className="text-emerald-600">ATS Match 87%</span></div>
            <div className="absolute -right-2 bottom-16 flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold shadow-lg ring-1 ring-slate-100"><Sparkles size={13} className="text-brand-600" /> AI-written bullets</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="text-center"><h2 className="text-3xl font-extrabold tracking-tight">How It Works</h2><p className="mt-2 text-slate-500">From a few facts to a finished CV in minutes.</p></Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([Icon, t, d], i) => (
            <Reveal key={t} delay={i * 90}>
              <div className="card h-full transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon size={22} /></span><span className="text-3xl font-black text-slate-100">0{i + 1}</span></div>
                <h3 className="font-bold">{t}</h3><p className="mt-1.5 text-sm text-slate-500">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center"><h2 className="text-3xl font-extrabold tracking-tight">Everything you need to get shortlisted</h2></Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {FEATURES.map(([Icon, t, d], i) => (
              <Reveal key={t} delay={i * 90}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-500/20 text-brand-300"><Icon size={22} /></span>
                  <h3 className="text-lg font-bold">{t}</h3><p className="mt-1.5 text-sm text-slate-300">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="text-center"><h2 className="text-3xl font-extrabold tracking-tight">Why Choose CVForge AI</h2></Reveal>
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {WHY.map((w, i) => <Reveal key={w} delay={i * 60}><div className="card flex items-center gap-3 !p-4 text-sm font-medium"><CheckCircle2 size={18} className="shrink-0 text-emerald-500" />{w}</div></Reveal>)}
        </div>
        <Reveal className="mt-14 rounded-3xl bg-gradient-to-br from-brand-600 to-violet-600 p-10 text-center text-white shadow-xl">
          <FileText className="mx-auto mb-3" size={30} />
          <h3 className="text-2xl font-extrabold">Ready to build your CV?</h3>
          <p className="mx-auto mt-2 max-w-md text-brand-100">It takes about 10 minutes. No resume-writing skills required.</p>
          <button onClick={() => nav('/create')} className="btn mt-6 bg-white px-6 py-3 text-brand-700 hover:bg-brand-50">Create My CV <ArrowRight size={18} /></button>
        </Reveal>
      </section>

      {example && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-slate-900/70 p-4 backdrop-blur-sm" onClick={() => setExample(false)}>
          <div className="relative my-6 animate-pop" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setExample(false)} className="absolute -top-3 -right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white shadow-lg" aria-label="Close"><X size={18} /></button>
            <div className="max-w-full overflow-auto rounded-lg shadow-2xl" style={{ zoom: window.innerWidth < 900 ? 0.45 : 0.85 }}><CVDocument cv={sampleCV} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
