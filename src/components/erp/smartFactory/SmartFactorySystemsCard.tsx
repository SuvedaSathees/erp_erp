import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Cpu } from "lucide-react";
import type { SmartFactoryDevelopmentRecord } from "@/services/types";

interface SmartFactorySystemsCardProps {
  record: SmartFactoryDevelopmentRecord;
  onChange: (field: keyof SmartFactoryDevelopmentRecord, value: any) => void;
}

export const SmartFactorySystemsCard: React.FC<SmartFactorySystemsCardProps> = ({
  record,
  onChange,
}) => {
  const systems = [
    { key: "mesIntegration", label: "MES Integration" },
    { key: "erpIntegration", label: "ERP Integration" },
    { key: "plcIntegration", label: "PLC Integration" },
    { key: "scadaIntegration", label: "SCADA Integration" },
    { key: "roboticsIntegration", label: "Robotics Integration" },
    { key: "iiotDeviceIntegration", label: "IIoT Device Integration" },
    { key: "digitalTwinAvailable", label: "Digital Twin Available" },
  ] as const;

  return (
    <Card className="border-border rounded-xl shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Smart Manufacturing Systems
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase">Integration</span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-300 text-xs">
                {record.integrationScore} / 100
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {systems.map((item) => (
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
