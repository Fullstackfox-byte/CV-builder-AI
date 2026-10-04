import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { newCV } from '../utils/defaultCV';
import { cvApi } from '../services/api';

const KEY = 'cvforge:v1';
const Ctx = createContext(null);
export const useCV = () => useContext(Ctx);

function load() {
  try {
    const r = JSON.parse(localStorage.getItem(KEY));
    if (r?.cvs) return r;
  } catch { /* ignore corrupt storage */ }
  return { cvs: [], activeId: null };
}

export function CVProvider({ children }) {
  const [state, setState] = useState(load);
  const [saveState, setSaveState] = useState('saved');
  const first = useRef(true);
  const cv = state.cvs.find((c) => c.id === state.activeId) || null;

  // Auto-save to localStorage (survives accidental refresh).
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSaveState('saving');
    const t = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(state)); setSaveState('saved'); } catch { setSaveState('error'); }
    }, 400);
    return () => clearTimeout(t);
  }, [state]);

  // Best-effort sync of the active CV to MongoDB (silently ignored when backend/DB is offline).
  useEffect(() => {
    if (!cv) return;
    const t = setTimeout(() => cvApi.save(cv).catch(() => {}), 1500);
    return () => clearTimeout(t);
  }, [cv]);

  // Pull CVs saved from other devices/browsers sessions that are missing locally.
  useEffect(() => {
    cvApi.list().then((list) => {
      setState((s) => {
        const have = new Set(s.cvs.map((c) => c.id));
        const extra = list.map((d) => ({ ...d.data, id: d.cvId })).filter((d) => !have.has(d.id));
        return extra.length ? { ...s, cvs: [...s.cvs, ...extra] } : s;
      });
    }).catch(() => {});
  }, []);

  const updateCV = useCallback((fn) => {
    setState((s) => ({
      ...s,
      cvs: s.cvs.map((c) => {
        if (c.id !== s.activeId) return c;
        const d = structuredClone(c);
        fn(d);
        d.updatedAt = Date.now();
        return d;
      }),
    }));
  }, []);

  const createCV = useCallback((title = 'My CV', fromId = null) => {
    let created;
    setState((s) => {
      const src = fromId && s.cvs.find((c) => c.id === fromId);
      created = src ? { ...structuredClone(src), ...{ id: newCV().id, title, createdAt: Date.now(), updatedAt: Date.now(), meta: { step: 0, stage: 'done' }, optimization: undefined } } : newCV(title);
      return { cvs: [...s.cvs, created], activeId: created.id };
    });
    return created?.id;
  }, []);

  const selectCV = useCallback((id) => setState((s) => ({ ...s, activeId: id })), []);
  const renameCV = useCallback((id, title) => setState((s) => ({ ...s, cvs: s.cvs.map((c) => (c.id === id ? { ...c, title, updatedAt: Date.now() } : c)) })), []);
  const deleteCV = useCallback((id) => {
    cvApi.remove(id).catch(() => {});
    setState((s) => {
      const cvs = s.cvs.filter((c) => c.id !== id);
      return { cvs, activeId: s.activeId === id ? cvs[0]?.id || null : s.activeId };
    });
  }, []);
  const saveNow = useCallback(async () => {
    localStorage.setItem(KEY, JSON.stringify(state));
    setSaveState('saved');
    if (cv) await cvApi.save(cv).catch(() => {});
  }, [state, cv]);

  return <Ctx.Provider value={{ cvs: state.cvs, cv, activeId: state.activeId, saveState, updateCV, createCV, selectCV, renameCV, deleteCV, saveNow }}>{children}</Ctx.Provider>;
}
