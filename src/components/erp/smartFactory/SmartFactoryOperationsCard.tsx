import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity } from "lucide-react";
import type { SmartFactoryDevelopmentRecord } from "@/services/types";

interface SmartFactoryOperationsCardProps {
  record: SmartFactoryDevelopmentRecord;
  onChange: (field: keyof SmartFactoryDevelopmentRecord, value: any) => void;
}

export const SmartFactoryOperationsCard: React.FC<SmartFactoryOperationsCardProps> = ({
  record,
  onChange,
}) => {
  const operationsItems = [
    { key: "realTimeMonitoring", label: "Real-Time Monitoring" },
    { key: "digitalDashboards", label: "Digital Dashboards" },
    { key: "predictiveAlerts", label: "Predictive Alerts" },
    { key: "oeeMonitoring", label: "OEE Monitoring" },
    { key: "energyMonitoring", label: "Energy Monitoring" },
    { key: "assetMonitoring", label: "Asset Monitoring" },
  ] as const;

  return (
    <Card className="border-border rounded-xl shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Smart Operations
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800">
              <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase">Operational</span>
              <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300 text-xs">
                {record.operationalScore} / 100
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {operationsItems.map((item) => (
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
