export default function ScoreRing({ score, size = 110 }) {
  const r = 44, c = 2 * Math.PI * r;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`ATS match score ${score}%`}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * score) / 100} transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset .8s ease' }} />
      <text x="50" y="56" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">{score}%</text>
    </svg>
  );
}
