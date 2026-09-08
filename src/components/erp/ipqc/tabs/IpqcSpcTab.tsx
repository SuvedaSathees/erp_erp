import React from "react";
import { Activity, TrendingUp, CheckCircle2, AlertOctagon } from "lucide-react";
import type { IpqcSpcData } from "@/services/ipqcTypes";

interface IpqcSpcTabProps {
  spc: IpqcSpcData;
}

export const IpqcSpcTab: React.FC<IpqcSpcTabProps> = ({ spc }) => {
  // Chart dimensions
  const width = 600;
  const height = 180;
  const padding = 35;

  const yMin = spc.lcl - 0.5;
  const yMax = spc.ucl + 0.5;

  const getY = (val: number) => {
    return height - padding - ((val - yMin) / (yMax - yMin)) * (height - 2 * padding);
  };

  const getX = (idx: number) => {
    return padding + (idx / (spc.datapoints.length - 1)) * (width - 2 * padding);
  };

  const pointsString = spc.datapoints
    .map((dp, idx) => `${getX(idx)},${getY(dp.value)}`)
    .join(" ");

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Statistical Process Control (SPC) — {spc.controlCharacteristic}</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            X-bar run chart monitoring variation and process capability in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{spc.status}</span>
          </span>
        </div>
      </div>

      {/* Metric summary badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-muted/30 border border-border/60 rounded-lg p-2.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Cp</span>
          <span className="text-base font-extrabold text-foreground font-mono">{spc.cp.toFixed(2)}</span>
        </div>
        <div className="bg-muted/30 border border-border/60 rounded-lg p-2.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Cpk</span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{spc.cpk.toFixed(2)}</span>
        </div>
        <div className="bg-muted/30 border border-border/60 rounded-lg p-2.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Pp</span>
          <span className="text-base font-extrabold text-foreground font-mono">{spc.pp.toFixed(2)}</span>
        </div>
        <div className="bg-muted/30 border border-border/60 rounded-lg p-2.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Ppk</span>
          <span className="text-base font-extrabold text-blue-600 font-mono">{spc.ppk.toFixed(2)}</span>
        </div>
        <div className="bg-muted/30 border border-border/60 rounded-lg p-2.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Target</span>
          <span className="text-base font-extrabold text-foreground font-mono">{spc.target} Nm</span>
        </div>
        <div className="bg-muted/30 border border-border/60 rounded-lg p-2.5">
          <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Sample Size / Freq</span>
          <span className="text-xs font-bold text-foreground font-mono mt-1 block">N={spc.sampleSize} / {spc.frequency}</span>
        </div>
      </div>

      {/* SVG SPC Chart */}
      <div className="bg-muted/10 border border-border/80 rounded-xl p-3 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 select-none">
          {/* UCL Line */}
          <line
            x1={padding}
            y1={getY(spc.ucl)}
            x2={width - padding}
            y2={getY(spc.ucl)}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text x={width - padding + 5} y={getY(spc.ucl) + 3} fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="monospace">
            UCL ({spc.ucl})
          </text>

          {/* Centerline (CL) */}
          <line
            x1={padding}
            y1={getY(spc.cl)}
            x2={width - padding}
            y2={getY(spc.cl)}
            stroke="#3b82f6"
            strokeWidth="1.5"
          />
          <text x={width - padding + 5} y={getY(spc.cl) + 3} fill="#3b82f6" fontSize="9" fontWeight="bold" fontFamily="monospace">
            CL ({spc.cl})
          </text>

          {/* LCL Line */}
          <line
            x1={padding}
            y1={getY(spc.lcl)}
            x2={width - padding}
            y2={getY(spc.lcl)}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text x={width - padding + 5} y={getY(spc.lcl) + 3} fill="#ef4444" fontSize="9" fontWeight="bold" fontFamily="monospace">
            LCL ({spc.lcl})
          </text>

          {/* Points line */}
          <polyline
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            points={pointsString}
          />

          {/* Points circles */}
          {spc.datapoints.map((dp, idx) => (
            <g key={idx}>
              <circle
                cx={getX(idx)}
                cy={getY(dp.value)}
                r="4.5"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={getX(idx)}
                y={getY(dp.value) - 8}
                textAnchor="middle"
                fill="currentColor"
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {dp.value}
              </text>
              <text
                x={getX(idx)}
                y={height - 10}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="8"
                fontFamily="monospace"
              >
                {dp.time}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
