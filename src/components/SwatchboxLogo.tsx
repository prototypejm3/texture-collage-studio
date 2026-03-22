export function SwatchboxLogo({ height = 40 }: { height?: number }) {
  const aspectRatio = 360 / 120;
  const width = height * aspectRatio;
  return (
    <svg width={width} height={height} viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="360" height="120" rx="24" fill="#fdf6ee" stroke="#e8ddd0" strokeWidth="1.5"/>
      <rect x="12" y="16" width="88" height="88" rx="16" fill="#c4956a"/>
      <line x1="24" y1="16" x2="21" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.35"/>
      <line x1="36" y1="16" x2="33" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.25"/>
      <line x1="48" y1="16" x2="45" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.35"/>
      <line x1="60" y1="16" x2="57" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.25"/>
      <line x1="72" y1="16" x2="69" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.35"/>
      <line x1="84" y1="16" x2="81" y2="104" stroke="#b07d52" strokeWidth="1.2" opacity="0.25"/>
      <rect x="22" y="26" width="68" height="68" rx="10" fill="#f5ede0"/>
      <ellipse cx="56" cy="86" rx="24" ry="18" fill="#c4956a"/>
      <ellipse cx="56" cy="88" rx="14" ry="13" fill="#d9a97c"/>
      <circle cx="56" cy="58" r="22" fill="#c4956a"/>
      <ellipse cx="50" cy="50" rx="8" ry="5" fill="#d9a97c" opacity="0.45"/>
      <circle cx="40" cy="42" r="10" fill="#c4956a"/>
      <circle cx="40" cy="42" r="6" fill="#d9a97c"/>
      <circle cx="72" cy="42" r="10" fill="#c4956a"/>
      <circle cx="72" cy="42" r="6" fill="#d9a97c"/>
      <circle cx="18" cy="22" r="4" fill="#b07d52"/>
      <circle cx="94" cy="22" r="4" fill="#b07d52"/>
      <circle cx="18" cy="98" r="4" fill="#b07d52"/>
      <circle cx="94" cy="98" r="4" fill="#b07d52"/>
      <text x="116" y="52" fontFamily="system-ui,sans-serif" fontSize="26" fontWeight="800" fill="#3d3530">Swatchbox</text>
      <text x="116" y="80" fontFamily="system-ui,sans-serif" fontSize="26" fontWeight="800" fill="#3d3530">Studio</text>
      <circle cx="116" cy="100" r="6" fill="#f87171"/>
      <circle cx="134" cy="100" r="6" fill="#fbbf24"/>
      <circle cx="152" cy="100" r="6" fill="#4ade80"/>
      <circle cx="170" cy="100" r="6" fill="#38bdf8"/>
      <circle cx="188" cy="100" r="6" fill="#a78bfa"/>
      <circle cx="206" cy="100" r="6" fill="#f97316"/>
    </svg>
  );
}
