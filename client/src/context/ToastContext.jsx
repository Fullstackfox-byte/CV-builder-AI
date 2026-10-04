import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const toast = useCallback((msg, type = 'success') => {
    const id = Math.random();
    setItems((s) => [...s, { id, msg, type }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3800);
  }, []);
  const Icon = { success: CheckCircle2, error: XCircle, info: Info };
  const color = { success: 'text-emerald-500', error: 'text-red-500', info: 'text-brand-500' };
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2 print:hidden">
        {items.map((t) => {
          const I = Icon[t.type] || Info;
          return (
            <div key={t.id} className="flex animate-pop items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg">
              <I size={18} className={`mt-0.5 shrink-0 ${color[t.type]}`} />
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
