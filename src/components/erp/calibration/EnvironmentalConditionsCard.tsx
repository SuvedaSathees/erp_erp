import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Gauge } from "lucide-react";
import { CalibrationRecord } from "@/services/calibrationTypes";

interface EnvironmentalConditionsCardProps {
  record: CalibrationRecord;
  onChangeEnvironment?: (key: "temperature" | "humidity" | "pressure", value: number) => void;
}

export function EnvironmentalConditionsCard({
  record,
}: EnvironmentalConditionsCardProps) {
  const { environment } = record;

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-primary" />
          Environmental Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Temperature */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-200 dark:border-amber-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0">
              <Thermometer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Temperature
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">{environment.temperature}</span>
                <span className="text-xs font-semibold text-muted-foreground">°C</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Standard: 23.0 ± 2.0 °C</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-200 dark:border-blue-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Relative Humidity
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">{environment.humidity}</span>
                <span className="text-xs font-semibold text-muted-foreground">%RH</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Standard: 45 - 65 %RH</span>
            </div>
          </div>

          {/* Atmospheric Pressure */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-200 dark:border-indigo-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Atmospheric Pressure
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">{environment.pressure}</span>
                <span className="text-xs font-semibold text-muted-foreground">hPa</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Ambient Standard</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
