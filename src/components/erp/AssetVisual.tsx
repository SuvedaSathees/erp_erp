import React from "react";

interface AssetVisualProps {
  category?: string;
  assetId?: string;
  className?: string;
}

export function AssetVisual({ category = "", assetId = "", className = "h-24 w-auto" }: AssetVisualProps) {
  const cat = category.toLowerCase();
  const id = assetId.toLowerCase();

  // 1. VEHICLES & LOGISTICS FLEET
  if (cat.includes("vehicle") || id.includes("veh") || cat.includes("logistics")) {
    return (
      <svg className={className} viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cab & Body */}
        <rect x="15" y="30" width="85" height="42" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <path d="M100 42H132L145 55V72H100V42Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
        {/* Window */}
        <polygon points="105,46 128,46 137,55 105,55" fill="#93c5fd" />
        {/* Cargo Container Lines */}
        <line x1="32" y1="35" x2="32" y2="67" stroke="#334155" strokeWidth="1.5" />
        <line x1="50" y1="35" x2="50" y2="67" stroke="#334155" strokeWidth="1.5" />
        <line x1="68" y1="35" x2="68" y2="67" stroke="#334155" strokeWidth="1.5" />
        <line x1="86" y1="35" x2="86" y2="67" stroke="#334155" strokeWidth="1.5" />
        {/* Wheels */}
        <circle cx="38" cy="74" r="10" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        <circle cx="38" cy="74" r="4" fill="#94a3b8" />
        <circle cx="60" cy="74" r="10" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        <circle cx="60" cy="74" r="4" fill="#94a3b8" />
        <circle cx="124" cy="74" r="10" fill="#0f172a" stroke="#475569" strokeWidth="2" />
        <circle cx="124" cy="74" r="4" fill="#94a3b8" />
        {/* Headlight & Chassis */}
        <rect x="142" y="60" width="3" height="6" rx="1" fill="#facc15" />
        <rect x="10" y="70" width="138" height="3" fill="#334155" />
      </svg>
    );
  }

  // 2. IT EQUIPMENT & COMPUTING INFRASTRUCTURE
  if (cat.includes("it") || cat.includes("server") || cat.includes("computer") || id.includes("it-")) {
    return (
      <svg className={className} viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Server Rack Cabinet */}
        <rect x="42" y="12" width="76" height="78" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        {/* Unit 1 */}
        <rect x="48" y="18" width="64" height="14" rx="2" fill="#1e293b" />
        <circle cx="55" cy="25" r="2" fill="#10b981" />
        <circle cx="61" cy="25" r="2" fill="#3b82f6" />
        <line x1="72" y1="23" x2="104" y2="23" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="72" y1="27" x2="104" y2="27" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Unit 2 */}
        <rect x="48" y="36" width="64" height="14" rx="2" fill="#1e293b" />
        <circle cx="55" cy="43" r="2" fill="#10b981" />
        <circle cx="61" cy="43" r="2" fill="#f59e0b" />
        <line x1="72" y1="41" x2="104" y2="41" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="72" y1="45" x2="104" y2="45" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Unit 3 Storage Arrays */}
        <rect x="48" y="54" width="64" height="28" rx="2" fill="#1e293b" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={52 + i * 15} y="58" width="12" height="20" rx="1" fill="#334155" stroke="#475569" strokeWidth="1" />
        ))}
        {/* Stand Feet */}
        <rect x="38" y="90" width="18" height="4" rx="1" fill="#334155" />
        <rect x="104" y="90" width="18" height="4" rx="1" fill="#334155" />
      </svg>
    );
  }

  // 3. BUILDINGS & INFRASTRUCTURE
  if (cat.includes("building") || cat.includes("infra") || cat.includes("factory") || id.includes("bld")) {
    return (
      <svg className={className} viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Plant Facility */}
        <polygon points="20,80 20,45 45,30 45,80" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        {/* Sawtooth Industrial Factory Roof */}
        <polygon points="45,80 45,45 65,30 65,45 85,30 85,45 105,30 105,45 135,30 135,80" fill="#334155" stroke="#0f172a" strokeWidth="2" />
        {/* Windows Array */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={55 + i * 25} y="52" width="14" height="12" rx="1" fill="#93c5fd" opacity="0.8" />
        ))}
        {/* Bay Loading Door */}
        <rect x="25" y="56" width="14" height="24" rx="1" fill="#0f172a" />
        <line x1="25" y1="62" x2="39" y2="62" stroke="#475569" strokeWidth="1" />
        <line x1="25" y1="68" x2="39" y2="68" stroke="#475569" strokeWidth="1" />
        <line x1="25" y1="74" x2="39" y2="74" stroke="#475569" strokeWidth="1" />
        {/* Chimney / Exhaust Stack */}
        <rect x="120" y="18" width="8" height="20" fill="#475569" />
        <line x1="10" y1="80" x2="150" y2="80" stroke="#0f172a" strokeWidth="2" />
      </svg>
    );
  }

  // 4. TESTING, CALIBRATION & MEASUREMENT INSTRUMENTS
  if (cat.includes("calib") || cat.includes("test") || cat.includes("gauge") || id.includes("cal-")) {
    return (
      <svg className={className} viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Digital Instrument Body */}
        <rect x="24" y="20" width="112" height="62" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        {/* Bezel */}
        <rect x="30" y="26" width="62" height="42" rx="2" fill="#0f172a" />
        {/* LCD Waveform Screen */}
        <path d="M34 47 H44 L48 35 L54 59 L58 43 L62 49 L66 47 H88" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Rotary Dial & Terminals */}
        <circle cx="112" cy="40" r="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />
        <line x1="112" y1="40" x2="116" y2="34" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="104" cy="62" r="3" fill="#ef4444" />
        <circle cx="120" cy="62" r="3" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
        {/* Feet */}
        <rect x="34" y="82" width="10" height="4" rx="1" fill="#475569" />
        <rect x="116" y="82" width="10" height="4" rx="1" fill="#475569" />
      </svg>
    );
  }

  // 5. INDUSTRIAL CNC / MACHINERY / PLANT (Default)
  return (
    <svg className={className} viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="16" width="120" height="70" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="2" />
      <rect x="35" y="24" width="90" height="42" rx="3" fill="#0f172a" />
      <rect x="40" y="29" width="80" height="32" fill="#1e293b" />
      <rect x="75" y="29" width="10" height="18" fill="#94a3b8" />
      <polygon points="75,47 85,47 80,56" fill="#e2e8f0" />
      <rect x="110" y="29" width="20" height="24" rx="2" fill="#475569" />
      <circle cx="118" cy="36" r="2.5" fill="#10b981" />
      <circle cx="118" cy="44" r="2.5" fill="#f59e0b" />
      <rect x="15" y="86" width="130" height="7" rx="2" fill="#1e293b" />
    </svg>
  );
}
export default AssetVisual;
