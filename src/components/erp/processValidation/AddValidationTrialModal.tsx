import React, { useState, useEffect } from "react";
import { X, Plus, Activity } from "lucide-react";
import type { ValidationTrialRunSummary } from "@/services/types";

interface AddValidationTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (summary: ValidationTrialRunSummary) => void;
  onSave?: (summary: any) => void;
  currentSummary?: any;
}

export const AddValidationTrialModal: React.FC<AddValidationTrialModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  onSave,
  currentSummary,
}) => {
  const summary: Partial<ValidationTrialRunSummary> =
    currentSummary?.trialRunSummary || currentSummary || {};

  const [totalParts, setTotalParts] = useState<number>(summary?.totalPartsProduced ?? 1500);
  const [conformingParts, setConformingParts] = useState<number>(summary?.conformingParts ?? 1487);
  const [nonConformingParts, setNonConformingParts] = useState<number>(summary?.nonConformingParts ?? 13);

  useEffect(() => {
    if (summary) {
      if (summary.totalPartsProduced !== undefined) setTotalParts(summary.totalPartsProduced);
      if (summary.conformingParts !== undefined) setConformingParts(summary.conformingParts);
      if (summary.nonConformingParts !== undefined) setNonConformingParts(summary.nonConformingParts);
    }
  }, [currentSummary]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fpy = Number(((conformingParts / (totalParts || 1)) * 100).toFixed(2));
    const defectRate = Number(((nonConformingParts / (totalParts || 1)) * 100).toFixed(2));

    const payload: ValidationTrialRunSummary = {
      totalPartsProduced: totalParts,
      conformingParts,
      nonConformingParts,
      currentFpy: fpy,
      defectRate,
    };

    onUpdate?.(payload);
    onSave?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 text-xs">
        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Log Trial Run Production Results</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block font-semibold text-muted-foreground mb-1">Total Parts Produced *</label>
            <input
              type="number"
              required
              value={totalParts}
              onChange={(e) => {
                const total = Number(e.target.value);
                setTotalParts(total);
                setNonConformingParts(Math.max(0, total - conformingParts));
              }}
              className="w-full bg-background border border-input rounded px-3 py-2 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Conforming (Good) *</label>
              <input
                type="number"
                required
                value={conformingParts}
                onChange={(e) => {
                  const conf = Number(e.target.value);
                  setConformingParts(conf);
                  setNonConformingParts(Math.max(0, totalParts - conf));
                }}
                className="w-full bg-background border border-input rounded px-3 py-2 font-mono text-emerald-600 dark:text-emerald-400 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Non-Conforming (Defects) *</label>
              <input
                type="number"
                required
                value={nonConformingParts}
                onChange={(e) => {
                  const nonConf = Number(e.target.value);
                  setNonConformingParts(nonConf);
                  setConformingParts(Math.max(0, totalParts - nonConf));
                }}
                className="w-full bg-background border border-input rounded px-3 py-2 font-mono text-rose-600 dark:text-rose-400 font-bold"
              />
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded border border-border/60 space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-muted-foreground">Calculated FPY:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {((conformingParts / (totalParts || 1)) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-muted-foreground">Defect Rate:</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                {((nonConformingParts / (totalParts || 1)) * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-input bg-background hover:bg-muted text-foreground font-semibold rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded flex items-center gap-1 shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Save Trial Run
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
