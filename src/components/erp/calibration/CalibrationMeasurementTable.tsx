import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Table as TableIcon, Plus, Sparkles } from "lucide-react";
import { CalibrationMeasurementPoint } from "@/services/calibrationTypes";
import { toast } from "sonner";

interface CalibrationMeasurementTableProps {
  measurements: CalibrationMeasurementPoint[];
  onAddPoint?: (newPoint: CalibrationMeasurementPoint) => void;
  onToggleResult?: (id: string) => void;
}

export function CalibrationMeasurementTable({
  measurements,
  onAddPoint,
  onToggleResult,
}: CalibrationMeasurementTableProps) {
  const handleAddDefaultPoint = () => {
    const nextSeq = measurements.length + 1;
    const newPoint: CalibrationMeasurementPoint = {
      id: `m-${Date.now()}`,
      seq: nextSeq,
      parameter: nextSeq % 2 === 0 ? "Resistance (kΩ)" : "Frequency (kHz)",
      nominalValue: 10.0,
      standardReading: 10.001,
      equipmentReading: 10.002,
      error: 0.001,
      tolerance: "±0.02",
      result: "Pass",
      remarks: "Within calibration tolerance",
    };

    if (onAddPoint) {
      onAddPoint(newPoint);
    }
    toast.success(`Added Test Point #${nextSeq} (${newPoint.parameter})`);
  };

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <TableIcon className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-base font-semibold text-foreground truncate">
            Calibration Measurement Results
          </CardTitle>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            ({measurements.length} Test Points)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddDefaultPoint}
            className="h-7 text-xs px-2.5 font-medium border-primary/40 text-primary hover:bg-primary/10"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Test Point
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 min-w-0">
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3">Parameter</th>
                <th className="py-2.5 px-3 text-right">Nominal</th>
                <th className="py-2.5 px-3 text-right">Standard Rdg</th>
                <th className="py-2.5 px-3 text-right">Equipment Rdg</th>
                <th className="py-2.5 px-3 text-right">Error</th>
                <th className="py-2.5 px-3 text-center">Tolerance</th>
                <th className="py-2.5 px-3 text-center">Result</th>
                <th className="py-2.5 px-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2 px-3 text-center text-muted-foreground font-sans font-medium">
                    {m.seq}
                  </td>
                  <td className="py-2 px-3 font-sans font-medium text-foreground whitespace-nowrap">
                    {m.parameter}
                  </td>
                  <td className="py-2 px-3 text-right text-muted-foreground">
                    {m.nominalValue.toFixed(m.nominalValue % 1 === 0 ? 1 : 3)}
                  </td>
                  <td className="py-2 px-3 text-right text-foreground">
                    {m.standardReading.toFixed(3)}
                  </td>
                  <td className="py-2 px-3 text-right font-semibold text-foreground">
                    {m.equipmentReading.toFixed(3)}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-medium ${
                      m.error === 0
                        ? "text-muted-foreground"
                        : m.error > 0
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {m.error > 0 ? `+${m.error.toFixed(3)}` : m.error.toFixed(3)}
                  </td>
                  <td className="py-2 px-3 text-center text-muted-foreground font-sans whitespace-nowrap">
                    {m.tolerance}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <Badge
                      onClick={() => onToggleResult?.(m.id)}
                      className={`cursor-pointer transition-all ${
                        m.result === "Pass"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] py-0 px-2 font-sans"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px] py-0 px-2 font-sans"
                      }`}
                    >
                      {m.result === "Pass" ? (
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                      ) : (
                        <XCircle className="w-2.5 h-2.5 mr-1" />
                      )}
                      {m.result}
                    </Badge>
                  </td>
                  <td className="py-2 px-3 font-sans text-muted-foreground text-[11px] truncate max-w-[160px]">
                    {m.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

