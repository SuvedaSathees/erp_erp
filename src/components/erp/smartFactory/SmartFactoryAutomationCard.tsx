import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Bot } from "lucide-react";
import type { SmartFactoryDevelopmentRecord } from "@/services/types";

interface SmartFactoryAutomationCardProps {
  record: SmartFactoryDevelopmentRecord;
  onChange: (field: keyof SmartFactoryDevelopmentRecord, value: any) => void;
}

export const SmartFactoryAutomationCard: React.FC<SmartFactoryAutomationCardProps> = ({
  record,
  onChange,
}) => {
  const automationItems = [
    { key: "autonomousProductionLine", label: "Autonomous Production Line" },
    { key: "agvAmrDeployment", label: "AGV / AMR Deployment" },
    { key: "robotCellIntegration", label: "Robot Cell Integration" },
    { key: "machineVisionIntegration", label: "Machine Vision Integration" },
    { key: "smartSensorsInstalled", label: "Smart Sensors Installed" },
    { key: "autonomousMaterialHandling", label: "Autonomous Material Handling" },
  ] as const;

  return (
    <Card className="border-border rounded-xl shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Production Automation
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Automation</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                {record.automationScore} / 100
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {automationItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 p-2.5 transition-colors"
              >
                <span className="text-xs font-semibold text-foreground">
                  {item.label}
                </span>
                <Checkbox
                  checked={record[item.key as keyof SmartFactoryDevelopmentRecord] as boolean}
                  onCheckedChange={(checked) => onChange(item.key as keyof SmartFactoryDevelopmentRecord, !!checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
