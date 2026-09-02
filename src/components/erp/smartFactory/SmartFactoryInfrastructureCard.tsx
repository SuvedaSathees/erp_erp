import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Network, Server, Cloud, Cpu } from "lucide-react";
import type { CloudPlatformOption, SmartFactoryDevelopmentRecord } from "@/services/types";

interface SmartFactoryInfrastructureCardProps {
  record: SmartFactoryDevelopmentRecord;
  onChange: (field: keyof SmartFactoryDevelopmentRecord, value: any) => void;
  isEditing?: boolean;
}

const CLOUD_PLATFORMS: CloudPlatformOption[] = [
  "AWS IoT",
  "Microsoft Azure IoT",
  "Google Cloud",
  "Siemens Insights Hub",
  "PTC ThingWorx",
  "Private Cloud",
];

export const SmartFactoryInfrastructureCard: React.FC<SmartFactoryInfrastructureCardProps> = ({
  record,
  onChange,
  isEditing = true,
}) => {
  const infraScore = record.infrastructureScore ?? 86;

  return (
    <Card className="border-border rounded-xl shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Digital Infrastructure
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase">Score</span>
              <span className="font-mono font-bold text-purple-700 dark:text-purple-300 text-xs">
                {infraScore} / 100
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 pt-4 text-xs">
          {/* Network Architecture File */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-foreground">Network Architecture Document</label>
            <div className="flex items-center gap-2">
              <Input
                value={record.networkArchitectureDoc || "Network_Architecture.pdf"}
                onChange={(e) => onChange("networkArchitectureDoc", e.target.value)}
                placeholder="filename.pdf"
                className="h-9 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  const docName = record.networkArchitectureDoc || "Network_Architecture.pdf";
                  const blob = new Blob(
                    [
                      `SMART FACTORY NETWORK ARCHITECTURE SPECIFICATION\n\nDocument: ${docName}\nProject: ${record.smartFactoryProjectTitle}\nPlant: ${record.manufacturingPlant}\nZone: ${record.factoryZone}\nEdge Gateway: ${record.edgeComputingPlatform || "Dell Edge Gateway 5000"}\nCloud Platform: ${record.cloudPlatform || "Microsoft Azure IoT"}\nProtocol: Industrial Ethernet (Profinet/EtherCAT) & Wi-Fi 6/5G Private RAN\nStatus: Active Baseline Verified`,
                    ],
                    { type: "text/plain;charset=utf-8" }
                  );
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = docName.replace(/\.[^/.]+$/, "") + ".txt";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center gap-1 px-3 h-9 rounded-md border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground shrink-0 cursor-pointer transition-colors"
              >
                <FileText className="h-3.5 w-3.5 text-primary" />
                View
              </button>
            </div>
          </div>

          {/* Edge Computing Platform */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-foreground">Edge Computing Platform</label>
            <Input
              value={record.edgeComputingPlatform || "Dell Edge Gateway 5000"}
              onChange={(e) => onChange("edgeComputingPlatform", e.target.value)}
              placeholder="e.g. Dell Edge Gateway 5000, Advantech UNO"
              className="h-9 text-xs"
            />
          </div>

          {/* Cloud Platform */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-foreground">Cloud Platform</label>
            <Select
              value={record.cloudPlatform || "Microsoft Azure IoT"}
              onValueChange={(val: CloudPlatformOption) => onChange("cloudPlatform", val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                {CLOUD_PLATFORMS.map((cp) => (
                  <SelectItem key={cp} value={cp} className="text-xs">
                    {cp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Checkboxes Row */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
              <label htmlFor="industrialEthernet" className="font-medium cursor-pointer whitespace-nowrap">
                Industrial Ethernet
              </label>
              <Checkbox
                id="industrialEthernet"
                checked={record.industrialEthernet ?? true}
                onCheckedChange={(val) => onChange("industrialEthernet", Boolean(val))}
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
              <label htmlFor="wifi5g" className="font-medium cursor-pointer whitespace-nowrap">
                Wi-Fi / 5G Connectivity
              </label>
              <Checkbox
                id="wifi5g"
                checked={record.wifi5gConnectivity ?? true}
                onCheckedChange={(val) => onChange("wifi5gConnectivity", Boolean(val))}
              />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
