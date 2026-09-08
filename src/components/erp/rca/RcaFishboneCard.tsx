import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Fish,
  User,
  Cpu,
  Box,
  FileSpreadsheet,
  Gauge,
  CloudSun,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import { FishboneCategory } from "@/services/rcaTypes";
import { toast } from "sonner";

interface RcaFishboneCardProps {
  fishbone: FishboneCategory[];
  onAddFactor?: (category: string, factor: string) => void;
  onRemoveFactor?: (category: string, factorIndex: number) => void;
}

export function RcaFishboneCard({
  fishbone,
  onAddFactor,
  onRemoveFactor,
}: RcaFishboneCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Machine");
  const [factorText, setFactorText] = useState("");

  const handleOpenAdd = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setFactorText("");
    setModalOpen(true);
  };

  const handleSaveFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorText.trim()) {
      toast.error("Please enter a contributing factor description");
      return;
    }

    if (onAddFactor) {
      onAddFactor(selectedCategory, factorText.trim());
    }
    toast.success(`Added factor to ${selectedCategory}`);
    setModalOpen(false);
    setFactorText("");
  };

  const handleRemove = (category: string, idx: number) => {
    if (onRemoveFactor) {
      onRemoveFactor(category, idx);
      toast.success(`Removed factor from ${category}`);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Man":
        return <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "Machine":
        return <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "Material":
        return <Box className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "Method":
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "Measurement":
        return <Gauge className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <CloudSun className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <>
      <Card className="shadow-xs border-border/80 min-w-0">
        <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Fish className="h-4 w-4 text-primary shrink-0" />
            <CardTitle className="text-base font-semibold text-foreground">
              Ishikawa Cause & Effect Diagram (6M Matrix)
            </CardTitle>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              (6 Factor Dimensions Evaluated)
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenAdd()}
            className="h-7 text-xs px-2.5 font-medium border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Factor
          </Button>
        </CardHeader>
        <CardContent className="pt-4 min-w-0">
          {/* 6M Grid representation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 min-w-0">
            {fishbone.map((branch) => (
              <div
                key={branch.category}
                className="p-3.5 rounded-xl bg-muted/30 border border-border/70 space-y-2 text-xs hover:bg-muted/50 transition-colors flex flex-col justify-between min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 font-bold text-foreground pb-1.5 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(branch.category)}
                      <span>{branch.category}</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleOpenAdd(branch.category)}
                      className="h-5 w-5 text-muted-foreground hover:text-primary rounded-full"
                      title={`Add factor to ${branch.category}`}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <ul className="space-y-1.5 text-muted-foreground mt-2 min-w-0">
                    {branch.factors.length === 0 ? (
                      <li className="text-[11px] italic text-muted-foreground/60">
                        No factors registered.
                      </li>
                    ) : (
                      branch.factors.map((factor, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start justify-between gap-1.5 leading-relaxed group min-w-0"
                        >
                          <div className="flex items-start gap-1.5 min-w-0 flex-1">
                            <span className="text-primary font-bold mt-0.5">•</span>
                            <span className="break-words">{factor}</span>
                          </div>
                          {onRemoveFactor && (
                            <button
                              type="button"
                              onClick={() => handleRemove(branch.category, fIdx)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-600 shrink-0 p-0.5"
                              title="Delete factor"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="pt-2 border-t border-border/30 text-[10px] text-muted-foreground flex justify-between items-center">
                  <span>{branch.factors.length} {branch.factors.length === 1 ? "factor" : "factors"}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenAdd(branch.category)}
                    className="text-primary hover:underline font-medium"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Factor Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSaveFactor}>
            <DialogHeader className="pb-3 border-b border-border/60">
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Add Contributing Factor
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Append a validated causal factor to one of the 6M Ishikawa dimensions.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  6M Dimension / Branch
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Man">Man (Personnel & Training)</SelectItem>
                    <SelectItem value="Machine">Machine (Equipment & Hardware)</SelectItem>
                    <SelectItem value="Material">Material (Raw Material & Consumables)</SelectItem>
                    <SelectItem value="Method">Method (Standard Work & SOPs)</SelectItem>
                    <SelectItem value="Measurement">Measurement (Gauges & Metrology)</SelectItem>
                    <SelectItem value="Environment">Environment (Ambient & Facility)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Factor Description
                </Label>
                <Input
                  value={factorText}
                  onChange={(e) => setFactorText(e.target.value)}
                  placeholder="e.g. In-line hydrometer calibration interval exceeds solvent drift threshold"
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border/60 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 text-xs font-medium bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add to Matrix
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
