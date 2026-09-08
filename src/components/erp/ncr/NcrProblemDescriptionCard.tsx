import { useState, useRef } from "react";
import { Calendar, UploadCloud, X, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NcrRecord, DefectCategory, NcrPhotoEvidence } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrProblemDescriptionCardProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

export function NcrProblemDescriptionCard({
  record,
  onChange,
}: NcrProblemDescriptionCardProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<NcrPhotoEvidence | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newPhoto: NcrPhotoEvidence = {
        id: `photo-${Date.now()}`,
        filename: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        uploadedBy: record.reportedBy || "Quality User",
        caption: "Newly uploaded evidence photo",
      };
      onChange({ photos: [...record.photos, newPhoto] });
      toast.success(`Uploaded ${file.name}`, {
        description: "Evidence attached to NCR record.",
      });
    }
  };

  const handleRemovePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ photos: record.photos.filter((p) => p.id !== id) });
    toast.info("Photo evidence removed");
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
      <h2 className="text-sm sm:text-base font-semibold text-foreground">
        Problem Description
      </h2>

      {/* Row 1: Title, Category, Defect Code, Detection Method */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 min-w-0">
        <div className="space-y-1.5 lg:col-span-1">
          <Label className="text-xs text-muted-foreground font-medium">
            Non-Conformance Title <span className="text-destructive">*</span>
          </Label>
          <Input
            value={record.nonConformanceTitle}
            onChange={(e) => onChange({ nonConformanceTitle: e.target.value })}
            className="h-9 text-xs border-border/70"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Defect Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={record.defectCategory}
            onValueChange={(val: DefectCategory) => onChange({ defectCategory: val })}
          >
            <SelectTrigger className="h-9 text-xs border-border/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Visual">Visual</SelectItem>
              <SelectItem value="Dimensional">Dimensional</SelectItem>
              <SelectItem value="Material">Material</SelectItem>
              <SelectItem value="Functional">Functional</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
              <SelectItem value="Assembly">Assembly</SelectItem>
              <SelectItem value="Process">Process</SelectItem>
              <SelectItem value="Safety">Safety</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Defect Code
          </Label>
          <Select
            value={record.defectCode}
            onValueChange={(val) => onChange({ defectCode: val })}
          >
            <SelectTrigger className="h-9 text-xs border-border/70 font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DC-001">DC-001 (Scratch / Scuff)</SelectItem>
              <SelectItem value="DC-002">DC-002 (Dimensional Out of Spec)</SelectItem>
              <SelectItem value="DC-003">DC-003 (Solder Bridge)</SelectItem>
              <SelectItem value="DC-004">DC-004 (Color Mismatch)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Detection Method <span className="text-destructive">*</span>
          </Label>
          <Select
            value={record.detectionMethod}
            onValueChange={(val) => onChange({ detectionMethod: val })}
          >
            <SelectTrigger className="h-9 text-xs border-border/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In-Process Inspection">In-Process Inspection</SelectItem>
              <SelectItem value="Visual Inspection (100%)">Visual Inspection (100%)</SelectItem>
              <SelectItem value="AOI Automated Optical">AOI Automated Optical</SelectItem>
              <SelectItem value="CMM Measurement">CMM Measurement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Problem Description, Requirement/Specification, Detection Date & Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Problem Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            rows={2}
            value={record.problemDescription}
            onChange={(e) => onChange({ problemDescription: e.target.value })}
            className="text-xs resize-none border-border/70"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Requirement / Specification
          </Label>
          <Textarea
            rows={2}
            value={record.requirementSpecification}
            onChange={(e) => onChange({ requirementSpecification: e.target.value })}
            className="text-xs resize-none border-border/70"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">
              Detection Date <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                value={record.detectionDate}
                onChange={(e) => onChange({ detectionDate: e.target.value })}
                className="h-9 text-xs pr-7 border-border/70"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">
              Detection Location
            </Label>
            <Input
              value={record.detectionLocation}
              onChange={(e) => onChange({ detectionLocation: e.target.value })}
              className="h-9 text-xs border-border/70"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Actual Condition, Expected Condition, Affected Characteristic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Actual Condition
          </Label>
          <Textarea
            rows={2}
            value={record.actualCondition}
            onChange={(e) => onChange({ actualCondition: e.target.value })}
            className="text-xs resize-none border-border/70"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Expected Condition
          </Label>
          <Textarea
            rows={2}
            value={record.expectedCondition}
            onChange={(e) => onChange({ expectedCondition: e.target.value })}
            className="text-xs resize-none border-border/70"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">
            Affected Characteristic
          </Label>
          <Input
            value={record.affectedCharacteristic}
            onChange={(e) => onChange({ affectedCharacteristic: e.target.value })}
            className="h-9 text-xs border-border/70 mt-1"
          />
        </div>
      </div>

      {/* Row 4: Evidence / Photos */}
      <div className="pt-2">
        <Label className="text-xs font-semibold text-foreground block mb-2.5">
          Evidence / Photos
        </Label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {record.photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative bg-muted/30 border border-border/70 rounded-lg p-2 flex flex-col items-center justify-between cursor-pointer hover:border-blue-500 hover:shadow-xs transition-all"
            >
              {/* Thumbnail Container */}
              <div className="w-full h-24 rounded-md overflow-hidden bg-slate-900 relative flex items-center justify-center">
                {index === 0 && (
                  /* Realistic Mock Graphic: Charging casing with red markup circle */
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center relative p-2">
                    {/* Casing Profile */}
                    <div className="w-20 h-14 bg-gradient-to-r from-slate-500 to-slate-400 rounded-sm shadow-inner flex items-center justify-center relative">
                      <div className="w-12 h-6 bg-slate-600 rounded-sm border border-slate-400" />
                      {/* Scratch simulation */}
                      <div className="absolute w-8 h-[2px] bg-slate-300 rotate-12" />
                      {/* Red ellipse circle marker */}
                      <div className="absolute w-10 h-6 border-2 border-red-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                )}

                {index === 1 && (
                  /* Graphic 2: Macro scratches on dark polymer */
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center relative p-2">
                    <div className="w-full h-full bg-slate-900 border border-slate-700 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute w-16 h-[1.5px] bg-slate-400 rotate-45" />
                      <div className="absolute w-12 h-[1.5px] bg-slate-300 rotate-35 translate-y-1" />
                      <div className="absolute w-14 h-[1px] bg-slate-500 rotate-50 -translate-y-2" />
                      <div className="text-[9px] text-slate-400 font-mono absolute bottom-1 right-1">
                        50x Macro
                      </div>
                    </div>
                  </div>
                )}

                {index === 2 && (
                  /* Graphic 3: Connector nozzle profile */
                  <div className="w-full h-full bg-gradient-to-r from-slate-800 to-slate-950 flex items-center justify-center p-2 relative">
                    <div className="w-16 h-10 bg-slate-700 rounded-r-xl border border-slate-500 flex items-center justify-center">
                      <div className="w-4 h-6 bg-blue-600/60 rounded-sm" />
                      <div className="w-2 h-4 bg-slate-400 ml-1 rounded-full" />
                    </div>
                  </div>
                )}

                {index > 2 && (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Eye className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-1 bg-white/90 rounded-full text-foreground hover:scale-110 transition-transform">
                    <Eye className="h-3.5 w-3.5" />
                  </span>
                  <span
                    onClick={(e) => handleRemovePhoto(photo.id, e)}
                    className="p-1 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                    title="Delete photo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* Filename caption */}
              <div className="w-full text-center mt-1.5">
                <span className="text-[11px] font-mono text-muted-foreground truncate block">
                  {photo.filename}
                </span>
              </div>
            </div>
          ))}

          {/* Upload Dropzone Box */}
          <div
            onClick={handleUploadClick}
            className="h-32 border-2 border-dashed border-border/80 hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 rounded-lg flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 mb-1 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-foreground group-hover:text-blue-600 transition-colors">
              Upload Photos / Files
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              JPG, PNG, PDF (Max 10 MB)
            </span>
          </div>
        </div>
      </div>

      {/* Photo Preview Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold flex items-center justify-between">
              <span>{selectedPhoto?.filename}</span>
              <span className="text-xs font-normal text-muted-foreground font-mono">
                {selectedPhoto?.fileSize} • {selectedPhoto?.uploadDate}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="w-full h-64 bg-slate-900 rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
            {selectedPhoto?.filename.includes("01") && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-48 h-32 bg-slate-600 rounded-md border-2 border-slate-400 relative flex items-center justify-center shadow-xl">
                  <div className="w-24 h-12 bg-slate-700 rounded border border-slate-400" />
                  <div className="absolute w-20 h-1 bg-slate-200 rotate-12" />
                  <div className="absolute w-28 h-16 border-4 border-red-500 rounded-full" />
                  <span className="absolute -top-3 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Surface Scratch Marked
                  </span>
                </div>
              </div>
            )}
            {selectedPhoto?.filename.includes("02") && (
              <div className="w-full h-full bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full h-full border border-slate-600 relative flex items-center justify-center">
                  <div className="absolute w-44 h-1 bg-slate-400 rotate-45" />
                  <div className="absolute w-36 h-1 bg-slate-300 rotate-35 translate-y-2" />
                  <div className="text-xs text-emerald-400 font-mono absolute top-2 left-2">
                    MAGNIFICATION 50X - DEPTH ~0.12mm
                  </div>
                </div>
              </div>
            )}
            {selectedPhoto?.filename.includes("03") && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-40 h-24 bg-slate-700 rounded-r-3xl border-2 border-slate-400 flex items-center justify-center">
                  <div className="w-10 h-16 bg-blue-600/80 rounded" />
                  <div className="w-6 h-8 bg-slate-300 ml-2 rounded-full" />
                </div>
              </div>
            )}
            {!["01", "02", "03"].some((k) => selectedPhoto?.filename.includes(k)) && (
              <div className="text-center text-muted-foreground text-xs">
                Preview not available for uploaded file.
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Caption: </span>
            {selectedPhoto?.caption || "Non-conformance photo evidence item."}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
