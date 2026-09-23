import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

interface StandardSegment {
  name: string;
  percentage: number;
  color: string;
  count: number;
}

const STANDARDS: StandardSegment[] = [
  { name: "ISO 9001:2015 QMS", percentage: 50, color: "#2563eb", count: 21 },
  { name: "IATF 16949:2016 Auto", percentage: 25, color: "#059669", count: 11 },
  { name: "ISO 14001:2015 EHS", percentage: 15, color: "#0A3C75", count: 6 },
  { name: "ISO 45001:2018 Safety", percentage: 10, color: "#d97706", count: 4 },
];

export function AuditCategoryDonutCard() {
  let accumulatedAngle = 0;
  const radius = 38;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          Checklist by Standard
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col sm:flex-row items-center gap-4">
        {/* SVG Donut */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
            {STANDARDS.map((std, i) => {
              const dashLength = (std.percentage / 100) * circumference;
              const strokeDasharray = `${dashLength} ${circumference - dashLength}`;
              const strokeDashoffset = -((accumulatedAngle / 100) * circumference);
              accumulatedAngle += std.percentage;

              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={std.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-85"
                />
              );
            })}
          </svg>
          <div className="absolute text-center">
            <span className="text-base font-bold font-mono text-foreground">42</span>
            <span className="block text-[9px] text-muted-foreground uppercase">Items</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-1.5 text-xs">
          {STANDARDS.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-foreground font-medium">
                <span>{item.count}</span>
                <span className="text-muted-foreground text-[10px]">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
