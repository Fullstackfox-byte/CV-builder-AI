import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, SkipForward, Sparkles } from 'lucide-react';
import { ai } from '../services/api';
import { useCV } from '../context/CVContext';
import { useToast } from '../context/ToastContext';

const MAX = 8;

// Defined OUTSIDE the Interview component so its identity stays stable across re-renders.
// (Defining it inside made React remount every bubble on each keystroke => blinking.)
const Bubble = ({ ai: isAI, children }) => (
  <div className={`flex gap-2.5 ${isAI ? '' : 'flex-row-reverse'} animate-pop`}>
    {isAI && (
      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
        <Bot size={16} />
      </span>
    )}
    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isAI ? 'rounded-tl-sm bg-slate-100' : 'rounded-tr-sm bg-brand-600 text-white'}`}>
      {children}
    </div>
  </div>
);

/** AI follow-up interview: one question at a time, each depends on the previous answers. */
export default function Interview({ onDone }) {
  const { cv, updateCV } = useCV();
  const toast = useToast();
  const history = cv.interview || [];
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [answer, setAnswer] = useState('');
  const [generating, setGenerating] = useState(false);
  const endRef = useRef(null);

  const fetchNext = async (hist) => {
    setLoading(true);
    try {
      const r = await ai.followUp(cv, hist);
      setQuestion(r.question || null);
      setDone(!!r.done || !r.question);
    } catch (e) {
      setQuestion(null);
      setDone(true);
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNext(history);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [history.length, question, loading]);

  const submit = async (skip = false) => {
    if (!question || (!skip && !answer.trim())) return;
    const entry = { key: question.key, q: question.q, target: question.target, a: skip ? '' : answer.trim(), skipped: skip };
    const hist = [...history, entry];
    updateCV((d) => { d.interview = hist; });
    setAnswer('');
    setQuestion(null);
    await fetchNext(hist);
  };

  const finish = async () => {
    setGenerating(true);
    try {
      const r = await ai.fullCV(cv);
      updateCV((d) => {
        if (r.summary) d.summary = r.summary;
        (r.projects || []).forEach((p) => { const t = d.projects.find((x) => x.id === p.id); if (t) t.bullets = p.bullets; });
        (r.experience || []).forEach((p) => { const t = d.experience.find((x) => x.id === p.id); if (t) t.bullets = p.bullets; });
        if (r.skills?.technical?.length) d.skills.technical = r.skills.technical;
        if (r.skills?.soft?.length) d.skills.soft = r.skills.soft;
        d.meta = { ...d.meta, stage: 'done' };
      });
      onDone();
    } catch (e) {
      toast(e.message, 'error');
      setGenerating(false);
    }
  };

  const answered = history.filter((h) => h.a).length;

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold">Quick AI interview</h3>
          <p className="text-sm text-slate-500">A few smart questions so your CV highlights real impact. Skip anything that does not apply.</p>
        </div>
        <div className="hidden w-40 shrink-0 sm:block">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${Math.min(100, (history.length / MAX) * 100)}%` }} />
          </div>
          <p className="mt-1 text-right text-xs text-slate-400">{answered} answered</p>
        </div>
      </div>

      <div className="max-h-[48vh] min-h-[220px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4">
        <Bubble ai>Hi{cv.basics.fullName ? ` ${cv.basics.fullName.split(' ')[0]}` : ''}! I have read your details. Let me ask a few questions to fill the gaps.</Bubble>
        {history.map((h) => (
          <div key={h.key} className="space-y-3">
            <Bubble ai>{h.q}</Bubble>
            <Bubble>{h.a || <em className="opacity-80">Skipped</em>}</Bubble>
          </div>
        ))}
        {loading && (
          <Bubble ai>
            <span className="inline-flex items-center gap-2 text-slate-500"><Loader2 size={14} className="animate-spin" /> Thinking...</span>
          </Bubble>
        )}
        {question && !loading && (
          <Bubble ai>
            {question.q}
            {question.hint && <div className="mt-1 text-xs text-slate-500">{question.hint}</div>}
          </Bubble>
        )}
        {done && !loading && <Bubble ai>That is everything I need. Ready to build your CV?</Bubble>}
        <div ref={endRef} />
      </div>

      {question && !loading && (
        <div className="mt-3 flex items-end gap-2">
          <textarea
            rows={2}
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Type your answer... (Enter to send)"
            className="input resize-none"
          />
          <button onClick={() => submit()} disabled={!answer.trim()} className="btn-primary h-[44px]" aria-label="Send"><Send size={16} /></button>
          <button onClick={() => submit(true)} className="btn-ghost h-[44px]" aria-label="Skip question"><SkipForward size={16} /></button>
        </div>
      )}

      <button onClick={finish} disabled={generating || loading} className={`mt-4 ${done ? 'btn-primary' : 'btn-ghost'} w-full`}>
        {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}{' '}
        {generating ? 'Generating your CV...' : done ? 'Generate my CV' : 'Finish interview and generate CV'}
      </button>
    </div>
  );
}