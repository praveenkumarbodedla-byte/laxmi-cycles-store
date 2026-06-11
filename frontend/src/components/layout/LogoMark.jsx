export default function LogoMark({ width = 38, height = 38, className = '' }) {
  return (
    <svg viewBox="0 0 72 72" width={width} height={height} className={className} fill="none">
      <defs>
        <linearGradient id="nav-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="50%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#003380" />
        </linearGradient>
        <radialGradient id="nav-hub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3399ff" />
          <stop offset="100%" stopColor="#001133" />
        </radialGradient>
        <filter id="nav-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Rear wheel */}
      <circle cx="20" cy="46" r="17" fill="none" stroke="#0d1a2e" strokeWidth="4.5" />
      <circle cx="20" cy="46" r="13" fill="none" stroke="url(#nav-rim)" strokeWidth="1.6" filter="url(#nav-glow)" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={`r${i}`} x1="20" y1="46" x2={20 + 12 * Math.cos(a)} y2={46 + 12 * Math.sin(a)} stroke="url(#nav-rim)" strokeWidth="0.7" opacity="0.6" />;
      })}
      <circle cx="20" cy="46" r="3" fill="url(#nav-hub)" />
      {/* Front wheel */}
      <circle cx="52" cy="46" r="17" fill="none" stroke="#0d1a2e" strokeWidth="4.5" />
      <circle cx="52" cy="46" r="13" fill="none" stroke="url(#nav-rim)" strokeWidth="1.6" filter="url(#nav-glow)" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={`f${i}`} x1="52" y1="46" x2={52 + 12 * Math.cos(a)} y2={46 + 12 * Math.sin(a)} stroke="url(#nav-rim)" strokeWidth="0.7" opacity="0.6" />;
      })}
      <circle cx="52" cy="46" r="3" fill="url(#nav-hub)" />
      {/* Frame */}
      <line x1="20" y1="46" x2="36" y2="28" stroke="url(#nav-rim)" strokeWidth="2" strokeLinecap="round" filter="url(#nav-glow)" />
      <line x1="36" y1="28" x2="52" y2="46" stroke="url(#nav-rim)" strokeWidth="2" strokeLinecap="round" filter="url(#nav-glow)" />
      <line x1="36" y1="28" x2="36" y2="46" stroke="url(#nav-rim)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="20" y1="46" x2="36" y2="46" stroke="url(#nav-rim)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Saddle */}
      <path d="M28,24 Q36,18 44,24" fill="none" stroke="url(#nav-rim)" strokeWidth="2.2" strokeLinecap="round" />
      {/* Handlebar */}
      <line x1="52" y1="30" x2="52" y2="38" stroke="url(#nav-rim)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="47" y1="30" x2="57" y2="30" stroke="url(#nav-rim)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
