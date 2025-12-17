"use client";

export function RadarLogo({ className = "w-8 h-8", color = "currentColor" }: { className?: string; color?: string }) {
  // Generate smooth sweep with many thin slices
  const sweepSlices = [];
  const totalSlices = 20;
  const startAngle = -45; // needle position (degrees)
  const sweepAngle = 120; // total sweep behind needle

  for (let i = 0; i < totalSlices; i++) {
    const angle1 = startAngle - (i * sweepAngle / totalSlices);
    const angle2 = startAngle - ((i + 1) * sweepAngle / totalSlices);
    const rad1 = (angle1 * Math.PI) / 180;
    const rad2 = (angle2 * Math.PI) / 180;

    const x1 = 50 + 45 * Math.cos(rad1);
    const y1 = 50 + 45 * Math.sin(rad1);
    const x2 = 50 + 45 * Math.cos(rad2);
    const y2 = 50 + 45 * Math.sin(rad2);

    // Opacity fades from needle (0.35) to end (0)
    const opacity = 0.35 * (1 - i / totalSlices);

    sweepSlices.push(
      <path
        key={i}
        d={`M50 50 L${x1.toFixed(1)} ${y1.toFixed(1)} A45 45 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`}
        fill={color}
        opacity={opacity}
      />
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <circle cx="50" cy="50" r="46" fill="url(#radarGlow)" />

      {/* Smooth angular sweep */}
      {sweepSlices}

      {/* Concentric circles */}
      <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="5" fill="none" />
      <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="3" fill="none" opacity="0.5" />
      <circle cx="50" cy="50" r="12" stroke={color} strokeWidth="2.5" fill="none" opacity="0.35" />

      {/* Needle */}
      <line x1="50" y1="50" x2="82" y2="18" stroke={color} strokeWidth="5" strokeLinecap="round" />

      {/* Center dot */}
      <circle cx="50" cy="50" r="6" fill={color} />
    </svg>
  );
}
