import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, ScanLine } from 'lucide-react';
import CVDocument, { TEMPLATES } from './CVDocument';
import { useCV } from '../context/CVContext';

const A4_PX = 794; // 210mm @ 96dpi

/** Live A4 preview with zoom, fit, fullscreen and quick template switcher. */
export default function CVPreview() {
  const { cv, updateCV } = useCV();
  const box = useRef(null);
  const [zoom, setZoom] = useState(0.8);
  const [full, setFull] = useState(false);

  const fit = () => box.current && setZoom(Math.max(0.35, Math.min(1.2, (box.current.clientWidth - 32) / A4_PX)));
  useEffect(() => { const id = setTimeout(fit, 50); window.addEventListener('resize', fit); return () => { clearTimeout(id); window.removeEventListener('resize', fit); }; }, [full]);
  useEffect(() => { const k = (e) => e.key === 'Escape' && setFull(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);

  const Toolbar = (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 print:hidden">
      <select value={cv.settings.template} onChange={(e) => updateCV((d) => { d.settings.template = e.target.value; })} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold" aria-label="Template">
        {Object.entries(TEMPLATES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
      </select>
      <div className="ml-auto flex items-center gap-1">
        <button className="btn-ghost btn-sm" onClick={() => setZoom((z) => Math.max(0.3, +(z - 0.1).toFixed(2)))} aria-label="Zoom out"><ZoomOut size={15} /></button>
        <span className="w-12 text-center text-xs font-semibold tabular-nums text-slate-600">{Math.round(zoom * 100)}%</span>
        <button className="btn-ghost btn-sm" onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))} aria-label="Zoom in"><ZoomIn size={15} /></button>
        <button className="btn-ghost btn-sm" onClick={fit} aria-label="Fit to width"><ScanLine size={15} /></button>
        <button className="btn-ghost btn-sm" onClick={() => setFull((f) => !f)} aria-label="Fullscreen">{full ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
      </div>
    </div>
  );
  const Sheet = (
    <div ref={box} className="flex-1 overflow-auto bg-slate-200/70 p-4">
      <div className="mx-auto w-fit shadow-xl" style={{ zoom }}><CVDocument cv={cv} /></div>
      <p className="py-3 text-center text-[11px] text-slate-400">Grey lines show approximate A4 page breaks.</p>
    </div>
  );

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">{!full && Toolbar}{!full && Sheet}</div>
      {full && createPortal(<div className="fixed inset-0 z-50 flex flex-col bg-slate-100 print:hidden">{Toolbar}{Sheet}</div>, document.body)}
      {createPortal(<CVDocument cv={cv} print />, document.getElementById('print-root'))}
    </>
  );
}
