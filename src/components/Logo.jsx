// Brand mark based on the Adi Shakti Trader logo (chef hat + whisk + cake).
// Replace with the official transparent PNG/SVG when available:
//   <img src="/logo.png" alt="Adi Shakti Trader" />
export function LogoMark({ size = 44, light = false }) {
  const brown = light ? '#F6E9DC' : '#5B2C1A';
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill={light ? 'rgba(255,255,255,0.08)' : '#FCE7EE'} />
      <circle cx="32" cy="32" r="30" fill="none" stroke="#B8235A" strokeWidth="1.5" strokeDasharray="150 40" />
      <path d="M20 27c-5 0-6-8 0-9 0-6 9-8 12-3 3-5 12-3 12 3 6 1 5 9 0 9v5H20z" fill="none" stroke={brown} strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="22" y="38" width="20" height="8" rx="2" fill="#B8235A" />
      <path d="M22 38c3 3 5-1 7 2s5-2 7 1 4-1 6 0" fill="none" stroke="#FCE7EE" strokeWidth="1.6" />
      <circle cx="32" cy="35" r="2.2" fill="#B8235A" />
      <rect x="20" y="46" width="24" height="3" rx="1.5" fill={brown} />
    </svg>
  );
}

export default function Logo({ light = false, size = 44, sub = 'TRADER · BAKING TOOLS' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} light={light} />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span className="display" style={{ fontWeight: 700, fontSize: size * 0.55, color: light ? '#FFFFFF' : '#5B2C1A' }}>Adi Shakti</span>
        <span style={{ fontSize: 10, letterSpacing: 3, fontWeight: 700, color: light ? '#F2B8CC' : '#B8235A', marginTop: 4 }}>{sub}</span>
      </span>
    </span>
  );
}
