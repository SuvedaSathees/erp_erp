import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, Eye, FileText } from "lucide-react";
import type { FactoryLayoutFormInput } from "@/services/types";
import { toast } from "sonner";

export function MaterialFlowSection({
  form,
}: {
  form: UseFormReturn<FactoryLayoutFormInput>;
}) {
  const { watch, setValue } = form;
  const [previewDoc, setPreviewDoc] = useState<{ label: string; filename: string; size: string } | null>(null);

  const logisticsScore = watch("logisticsScore") ?? 85;

  const handlingEquipmentOptions = [
    "Forklift",
    "AGV",
    "AMR",
    "Overhead Crane",
    "Conveyor",
    "Pallet Truck",
    "Gantry Crane",
    "Robotic Material Handler",
  ];
  const selectedEq = watch("materialHandlingEq") || ["Forklift", "AGV", "Conveyor", "Overhead Crane"];

  const toggleEq = (item: string) => {
    if (selectedEq.includes(item)) {
      setValue("materialHandlingEq", selectedEq.filter((x) => x !== item));
    } else {
      setValue("materialHandlingEq", [...selectedEq, item]);
    }
  };

  const logisticsDocs = [
    { label: "Raw Material Flow", filename: "raw_material_flow_v1.2.pdf", size: "3.2 MB" },
    { label: "WIP Flow", filename: "wip_flow_v1.2.pdf", size: "2.8 MB" },
    { label: "Finished Goods Flow", filename: "fg_flow_v1.2.pdf", size: "2.4 MB" },
    { label: "Forklift Routes", filename: "forklift_routes_v1.2.pdf", size: "1.9 MB" },
    { label: "AGV/AMR Routes", filename: "agv_routes_v1.2.pdf", size: "2.1 MB" },
  ];

  const handleDownload = (doc: { label: string; filename: string; size: string }) => {
    const content = `MATERIAL FLOW & LOGISTICS BLUEPRINT SPECIFICATION\n\nRoute: ${doc.label}\nFile: ${doc.filename}\nSize: ${doc.size}\nPlant: Magnertia EV Plant\nStatus: Verified AGV/AMR & Forklift Transport Baseline`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.filename.replace(/\.[^/.]+$/, "") + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${doc.filename}`);
  };

  return (
    <Card className="border-border rounded-xl shadow-xs bg-card flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/60">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Material Flow & Logistics Architecture
            </CardTitle>
            <CardDescription className="text-xs">
              Inbound routing, WIP transport, AGV/AMR paths & handling equipment.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-1.5 shrink-0">
            <div>
              <span className="text-[10px] font-semibold uppercase text-primary dark:text-blue-400 block tracking-wider">
                Logistics Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-primary dark:text-blue-300 font-mono">
                  {logisticsScore}
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">/100</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 text-xs">
          {/* Schematic Documents List */}
          <div className="rounded-lg border border-border/80 divide-y divide-border/60 overflow-hidden bg-background">
            {logisticsDocs.map((doc, idx) => (
              <div
                key={doc.label}
                className="p-2.5 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                {/* Route Label & File */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground font-mono text-[10px] shrink-0">{idx + 1}.</span>
                    <span className="font-semibold text-foreground truncate">{doc.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 pl-3.5">
                    <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span
                      onClick={() => setPreviewDoc(doc)}
                      className="font-mono text-[11px] text-primary truncate cursor-pointer hover:underline font-medium"
                    >
                      {doc.filename}
                    </span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono shrink-0">
                      {doc.size}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[11px] gap-1 hover:text-primary cursor-pointer border-border"
                    onClick={() => setPreviewDoc(doc)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[11px] hover:text-primary cursor-pointer border-border"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Material Handling Equipment Badges */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <span className="font-semibold text-foreground text-xs block">Material Handling Equipment</span>
            <div className="flex flex-wrap gap-1.5">
              {handlingEquipmentOptions.map((eq) => {
                const isSelected = selectedEq.includes(eq);
                return (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => toggleEq(eq)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {isSelected ? `✓ ${eq}` : `+ ${eq}`}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </div>

      {/* Logistics Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <FileText className="h-5 w-5 text-primary" />
              {previewDoc?.filename}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {previewDoc?.label} • {previewDoc?.size} • Material Flow Architecture
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
            <p className="text-emerald-400 font-bold">=== LOGISTICS FLOW PATH SPECIFICATION ===</p>
            <p>Route: {previewDoc?.label}</p>
            <p>File: {previewDoc?.filename}</p>
            <p>Facility: Magnertia EV Plant (Pune Campus)</p>
            <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs">
              Defines designated transportation aisles, speed limits (8 km/h AGV, 12 km/h Forklift), and buffer inventory parking lanes.
            </div>
          </div>
          <DialogFooter className="gap-2">
            {previewDoc && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(previewDoc)}
                className="h-8 text-xs gap-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download Blueprint
              </Button>
            )}
            <Button size="sm" onClick={() => setPreviewDoc(null)} className="h-8 text-xs bg-primary text-primary-foreground cursor-pointer">
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
