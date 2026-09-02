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

export function LayoutPlanningSection({
  form,
}: {
  form: UseFormReturn<FactoryLayoutFormInput>;
}) {
  const { watch } = form;
  const [previewDoc, setPreviewDoc] = useState<{ label: string; filename: string; size: string; type: string } | null>(null);

  const planningScore = watch("layoutPlanningScore") ?? 88;

  const layoutDocuments = [
    { label: "Master Layout Drawing", filename: "master_layout_v1.2.dwg", type: "DWG", size: "14.2 MB" },
    { label: "Shop Floor Layout", filename: "shopfloor_layout_v1.2.dwg", type: "DWG", size: "8.6 MB" },
    { label: "Production Line Layout", filename: "line_layout_v1.2.dwg", type: "DWG", size: "6.4 MB" },
    { label: "Utility Layout", filename: "utility_layout_v1.2.dwg", type: "DWG", size: "5.1 MB" },
    { label: "Material Flow Diagram", filename: "material_flow_v1.2.pdf", type: "PDF", size: "3.2 MB" },
    { label: "Equipment Layout", filename: "equipment_layout_v1.2.dwg", type: "DWG", size: "7.8 MB" },
    { label: "Warehouse Layout", filename: "warehouse_layout_v1.2.dwg", type: "DWG", size: "4.5 MB" },
    { label: "Office Layout", filename: "office_layout_v1.2.dwg", type: "DWG", size: "2.9 MB" },
  ];

  const handleDownload = (doc: { label: string; filename: string; size: string }) => {
    const content = `FACTORY LAYOUT DESIGN BLUEPRINT SPECIFICATION\n\nTitle: ${doc.label}\nFile: ${doc.filename}\nSize: ${doc.size}\nPlant: Magnertia EV Plant (Phase 2 Pune Campus)\nStatus: Digital Twin Approved v1.2`;
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
    <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold">Layout Planning & CAD Drawings</CardTitle>
          <CardDescription className="text-xs">
            2D/3D CAD blueprints, shopfloor arrangement, utility schematics & equipment mapping.
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2">
          <div>
            <span className="text-[10px] font-semibold uppercase text-blue-600 dark:text-blue-400 block tracking-wider">
              Layout Planning Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                {planningScore}
              </span>
              <span className="text-xs text-blue-500 font-semibold">/100</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-lg border border-border/80 overflow-hidden bg-background text-xs shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Drawing Item</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Attached CAD / Blueprint</th>
                  <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {layoutDocuments.map((doc, idx) => (
                  <tr key={doc.label} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                      <span className="text-slate-400 font-mono text-[10px] mr-2">{idx + 1}.</span>
                      {doc.label}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                        <span
                          onClick={() => setPreviewDoc(doc)}
                          className="font-mono text-xs text-primary font-medium cursor-pointer hover:underline"
                        >
                          {doc.filename}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {doc.size}
                        </Badge>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] gap-1 hover:text-primary cursor-pointer"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] gap-1 hover:text-blue-600 cursor-pointer"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>

      {/* Drawing Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <FileText className="h-5 w-5 text-primary" />
              {previewDoc?.filename}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {previewDoc?.label} • {previewDoc?.size} • Autodesk AutoCAD 2024 DWG/PDF Format
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
            <p className="text-emerald-400 font-bold">=== CAD BLUEPRINT METADATA ===</p>
            <p>Title: {previewDoc?.label}</p>
            <p>File: {previewDoc?.filename}</p>
            <p>Facility: Magnertia EV Plant (Pune Campus Phase 2)</p>
            <p>Built-up Area: 45,000 m² | Capacity: 250,000 Units/Year</p>
            <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs">
              This CAD blueprint defines the engineering layout, lean material routing aisles, machine footprint clearances, and utility hookups conforming to ISO 9001 and OSHA safety regulations.
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
