import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../components/Logo';

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const link = ({ isActive }) => `text-sm font-medium transition hover:text-brand-600 ${isActive ? 'text-brand-600' : 'text-slate-600'}`;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            <NavLink to="/" end className={link}>Home</NavLink>
            <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
            <NavLink to="/privacy" className={link}>Privacy</NavLink>
            <button onClick={() => nav('/create')} className="btn-primary btn-sm">Create My CV</button>
          </nav>
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 md:hidden" onClick={() => setOpen(false)}>
            <Link to="/">Home</Link><Link to="/dashboard">Dashboard</Link><Link to="/privacy">Privacy</Link>
            <Link to="/create" className="btn-primary">Create My CV</Link>
          </div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:flex-row">
          <Logo />
          <p>Your data is used only to build your CV. <Link to="/privacy" className="font-semibold text-brand-600">Privacy notice</Link></p>
          <p>(c) {new Date().getFullYear()} CVForge AI</p>
        </div>
      </footer>
    </div>
  );
}
