import { Gauge } from "lucide-react";
import { FqcTestParamSample } from "@/services/fqcTypes";

interface FqcProcessParametersChartProps {
  samples: FqcTestParamSample[];
}

export function FqcProcessParametersChart({ samples }: FqcProcessParametersChartProps) {
  // Compute min/max for SVG rendering
  const minTorque = 3.2;
  const maxTorque = 3.8;

  const points = samples
    .map((s, idx) => {
      const x = (idx / (samples.length - 1)) * 100;
      const y = 100 - ((s.torqueReading - minTorque) / (maxTorque - minTorque)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/40 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
            <Gauge className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground truncate">
              Terminal Screw Torque Run Chart (10 Samples)
            </h2>
            <p className="text-[11px] text-muted-foreground truncate">
              Target: 3.5 N·m (USL: 3.8 N·m, LSL: 3.2 N·m)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded shrink-0 border border-emerald-200">
          Cpk: 1.84 (Highly Capable)
        </span>
      </div>

      {/* SVG Run Chart */}
      <div className="w-full h-36 bg-muted/20 border border-border/60 rounded-lg p-3 relative flex flex-col justify-between min-w-0">
        {/* Upper Spec Limit Line */}
        <div className="w-full flex items-center justify-between text-[10px] text-rose-500 font-mono border-b border-rose-400/40 border-dashed pb-0.5">
          <span>USL: 3.80 N·m</span>
          <span>Max Limit</span>
        </div>

        {/* Nominal Line */}
        <div className="w-full flex items-center justify-between text-[10px] text-emerald-600 font-mono border-b border-emerald-400/40 pb-0.5">
          <span>Target: 3.50 N·m</span>
          <span>Center</span>
        </div>

        {/* Lower Spec Limit Line */}
        <div className="w-full flex items-center justify-between text-[10px] text-rose-500 font-mono border-b border-rose-400/40 border-dashed pb-0.5">
          <span>LSL: 3.20 N·m</span>
          <span>Min Limit</span>
        </div>

        {/* SVG Sparkline */}
        <svg
          className="absolute inset-0 w-full h-full p-3 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>

      {/* 10 Sample Data Values Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs py-1 min-w-0">
        {samples.map((s) => (
          <div
            key={s.sampleNo}
            className="px-2.5 py-1 bg-muted/40 rounded border border-border/60 text-center shrink-0 font-mono"
          >
            <span className="text-[10px] text-muted-foreground block">S{s.sampleNo}</span>
            <span className="font-bold text-foreground text-xs">{s.torqueReading}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
