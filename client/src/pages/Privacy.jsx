import { Link } from 'react-router-dom';
import { Lock, ServerCog, ShieldCheck } from 'lucide-react';

const POINTS = [
  [ShieldCheck, 'Used only for your CV', 'The information you enter is used solely to generate, edit and export your CV. It is never sold or used for advertising.'],
  [Lock, 'Private by default', 'We do not expose your personal information unnecessarily. Your profile photo is stored only in your CV and is never sent to the AI service.'],
  [ServerCog, 'Keys stay on the server', 'AI provider API keys live in server-side environment variables. They are never included in the browser code.'],
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Privacy Notice</h1>
      <p className="mt-2 text-slate-500">Plain-language summary of how CVForge AI treats your data.</p>
      <div className="mt-8 space-y-4">
        {POINTS.map(([Icon, t, d]) => (
          <div key={t} className="card flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon size={22} /></span><div><h2 className="font-bold">{t}</h2><p className="mt-1 text-sm text-slate-600">{d}</p></div></div>
        ))}
      </div>
      <div className="mt-8 space-y-3 text-sm text-slate-600">
        <p><b>Auto-save:</b> your progress is saved in this browser (local storage) so an accidental refresh does not lose your work. When the optional database is connected, drafts are also stored under a random anonymous ID.</p>
        <p><b>AI processing:</b> when you use AI tools, the text of your CV (without the photo) is sent to the server and, if an AI provider is configured, to that provider to generate suggestions.</p>
        <p><b>Your control:</b> you can delete any CV from the dashboard at any time.</p>
      </div>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
}
