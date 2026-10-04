import { cn } from '../utils/helpers';

export function Field({ label, error, hint, children, className }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      {children}
      {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : hint ? <p className="mt-1.5 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export const TextInput = ({ label, error, hint, value, onChange, className, ...p }) => (
  <Field label={label} error={error} hint={hint} className={className}>
    <input className={cn('input', error && 'input-error')} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...p} />
  </Field>
);

export const TextArea = ({ label, error, hint, value, onChange, className, rows = 3, ...p }) => (
  <Field label={label} error={error} hint={hint} className={className}>
    <textarea rows={rows} className={cn('input resize-y', error && 'input-error')} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...p} />
  </Field>
);

export const SelectInput = ({ label, error, value, onChange, options, className }) => (
  <Field label={label} error={error} className={className}>
    <select className={cn('input', error && 'input-error')} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </Field>
);
