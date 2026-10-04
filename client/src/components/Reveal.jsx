import useReveal from '../hooks/useReveal';

export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${className}`}>{children}</div>;
}
