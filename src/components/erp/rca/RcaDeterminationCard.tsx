import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  FileSearch,
  Sparkles,
  CheckCheck,
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { RcaRecord } from "@/services/rcaTypes";
import { toast } from "sonner";

interface RcaDeterminationCardProps {
  record: RcaRecord;
  onChange?: (field: keyof RcaRecord, value: any) => void;
}

export function RcaDeterminationCard({ record, onChange }: RcaDeterminationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [immediate, setImmediate] = useState(record.immediateCause);
  const [root, setRoot] = useState(record.rootCause);
  const [evidence, setEvidence] = useState(record.verificationEvidence);
  const [newContributing, setNewContributing] = useState("");

  const handleSave = () => {
    if (onChange) {
      onChange("immediateCause", immediate);
      onChange("rootCause", root);
      onChange("verificationEvidence", evidence);
    }
    setIsEditing(false);
    toast.success("Updated Root Cause Determination and Empirical Evidence");
  };

  const handleAddContributing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContributing.trim()) return;
    if (onChange) {
      onChange("contributingCauses", [...record.contributingCauses, newContributing.trim()]);
      setNewContributing("");
      toast.success("Added contributing factor");
    }
  };

  const handleRemoveContributing = (index: number) => {
    if (onChange) {
      const updated = record.contributingCauses.filter((_, i) => i !== index);
      onChange("contributingCauses", updated);
      toast.success("Removed contributing factor");
    }
  };

  const toggleVerificationStatus = () => {
    if (!onChange) return;
    const nextStatus =
      record.verificationStatus === "Verified"
        ? "Under Test"
        : record.verificationStatus === "Under Test"
        ? "Pending"
        : "Verified";
    onChange("verificationStatus", nextStatus);
    toast.success(`Verification status updated to: ${nextStatus}`);
  };

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <FileSearch className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-base font-semibold text-foreground">
            Root Cause Determination & Empirical Verification
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleVerificationStatus}
            className="cursor-pointer select-none"
            title="Click to toggle status"
          >
            <Badge
              className={
                record.verificationStatus === "Verified"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100"
              }
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {record.verificationStatus}
            </Badge>
          </button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setImmediate(record.immediateCause);
                setRoot(record.rootCause);
                setEvidence(record.verificationEvidence);
                setIsEditing(true);
              }
            }}
            className="h-7 text-xs px-2.5 font-medium border-border hover:bg-muted"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Done
              </>
            ) : (
              <>
                <Edit2 className="w-3 h-3 mr-1" />
                Edit Findings
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs min-w-0">
        {/* Immediate Cause */}
        <div className="p-3 rounded-lg bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 min-w-0">
          <span className="font-semibold text-amber-900 dark:text-amber-200 block text-[11px]">
            Immediate / Proximate Cause:
          </span>
          {isEditing ? (
            <Textarea
              value={immediate}
              onChange={(e) => setImmediate(e.target.value)}
              rows={2}
              className="mt-1.5 text-xs resize-none bg-white dark:bg-slate-900"
            />
          ) : (
            <p className="mt-1 text-foreground leading-relaxed break-words">
              {record.immediateCause}
            </p>
          )}
        </div>

        {/* Contributing Causes */}
        <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-2 min-w-0">
          <span className="font-semibold text-foreground block text-[11px]">
            Contributing Factors:
          </span>
          <ul className="space-y-1.5 text-muted-foreground min-w-0">
            {record.contributingCauses.map((cause, idx) => (
              <li key={idx} className="flex items-start justify-between gap-1.5 leading-relaxed group min-w-0">
                <div className="flex items-start gap-1.5 min-w-0 flex-1">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span className="break-words">{cause}</span>
                </div>
                {onChange && (
                  <button
                    type="button"
                    onClick={() => handleRemoveContributing(idx)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-rose-600 shrink-0 p-0.5"
                    title="Remove factor"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {onChange && (
            <form onSubmit={handleAddContributing} className="flex items-center gap-2 pt-1">
              <Input
                value={newContributing}
                onChange={(e) => setNewContributing(e.target.value)}
                placeholder="Add another contributing factor..."
                className="h-7 text-xs flex-1 bg-white dark:bg-slate-900"
              />
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="h-7 text-xs px-2 shrink-0"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </form>
          )}
        </div>

        {/* Fundamental Root Cause */}
        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-500/60 space-y-1.5 shadow-xs min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-950 dark:text-emerald-200 text-xs uppercase tracking-wider">
              Confirmed Fundamental Root Cause:
            </span>
          </div>
          {isEditing ? (
            <Textarea
              value={root}
              onChange={(e) => setRoot(e.target.value)}
              rows={2}
              className="text-xs resize-none bg-white dark:bg-slate-900 font-semibold"
            />
          ) : (
            <p className="font-semibold text-foreground text-xs leading-relaxed pl-6 break-words">
              {record.rootCause}
            </p>
          )}
        </div>

        {/* Verification Evidence */}
        <div className="p-3 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 flex items-start gap-2.5 min-w-0">
          <CheckCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-blue-950 dark:text-blue-200 block text-[11px]">
              Empirical Validation Experiment & Evidence:
            </span>
            {isEditing ? (
              <Textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                rows={2}
                className="mt-1.5 text-xs resize-none bg-white dark:bg-slate-900"
              />
            ) : (
              <p className="text-muted-foreground mt-0.5 leading-relaxed break-words">
                {record.verificationEvidence}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
