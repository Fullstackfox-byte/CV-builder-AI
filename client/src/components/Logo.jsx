import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow"><Sparkles size={16} /></span>
      CVForge <span className="text-brand-600">AI</span>
    </Link>
  );
}
