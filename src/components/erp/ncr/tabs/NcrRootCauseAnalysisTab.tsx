import { useState } from "react";
import { HelpCircle, Network, CheckCircle, AlertCircle, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NcrRecord, NcrFiveWhyItem } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrRootCauseAnalysisTabProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

export function NcrRootCauseAnalysisTab({
  record,
  onChange,
}: NcrRootCauseAnalysisTabProps) {
  const handleUpdateWhy = (index: number, answer: string) => {
    const updated = [...record.fiveWhys];
    updated[index].answer = answer;
    onChange({ fiveWhys: updated });
  };

  const handleToggleIshikawa = (index: number) => {
    const updated = [...record.ishikawaCauses];
    updated[index].isContributing = !updated[index].isContributing;
    onChange({ ishikawaCauses: updated });
    toast.info(
      `${updated[index].category} factor marked as ${
        updated[index].isContributing ? "Contributing" : "Non-contributing"
      }`
    );
  };

  const handleUpdateIshikawaNotes = (index: number, notes: string) => {
    const updated = [...record.ishikawaCauses];
    updated[index].notes = notes;
    onChange({ ishikawaCauses: updated });
  };

  return (
    <div className="space-y-5">
      {/* 5-Why Interactive Table */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Section 8.1: 5-Why Root Cause Investigation
              </h3>
              <p className="text-xs text-muted-foreground">
                Iterative interrogative technique used to explore cause-and-effect relationships.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md">
            Method: 5-Why / RCA
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                <th className="py-2 px-3 w-20">Level</th>
                <th className="py-2 px-3 w-1/3">Question / Finding</th>
                <th className="py-2 px-3">Answer / Verified Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {record.fiveWhys.map((why, index) => (
                <tr
                  key={why.level}
                  className={`hover:bg-muted/20 transition-colors ${
                    index === 4 ? "bg-amber-50/30 dark:bg-amber-950/10 font-medium" : ""
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold font-mono text-blue-600">
                    {why.whyLabel}
                  </td>
                  <td className="py-2.5 px-3 text-foreground font-medium">
                    {why.question}
                  </td>
                  <td className="py-2.5 px-3">
                    <Input
                      value={why.answer}
                      onChange={(e) => handleUpdateWhy(index, e.target.value)}
                      className="h-8 text-xs border-border/70"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cause Classification (Ishikawa / 6M) */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center">
              <Network className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Section 8.2: Cause Classification (Ishikawa / 6M Matrix)
              </h3>
              <p className="text-xs text-muted-foreground">
                Structured categorization across Man, Machine, Material, Method, Measurement, Environment & System.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {record.ishikawaCauses.map((item, idx) => (
            <div
              key={item.category}
              className={`p-3 rounded-lg border transition-all text-xs space-y-2 ${
                item.isContributing
                  ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                  : "bg-muted/20 border-border/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-xs">
                  {item.category} ({item.title})
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleIshikawa(idx)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                    item.isContributing
                      ? "bg-rose-600 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.isContributing ? "Contributing" : "Conforming"}
                </button>
              </div>

              <Input
                value={item.notes}
                onChange={(e) => handleUpdateIshikawaNotes(idx, e.target.value)}
                className="h-8 text-xs bg-card"
                placeholder="Notes / Investigation observations..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
