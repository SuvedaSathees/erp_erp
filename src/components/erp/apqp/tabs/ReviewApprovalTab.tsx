import React, { useState } from "react";
import { UserCheck, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApqpRecord, ApqpApprovalDecision, ApqpReviewer } from "@/services/types";
import { toast } from "sonner";

interface ReviewApprovalTabProps {
  record: ApqpRecord;
  onReviewDecision?: (decision: ApqpApprovalDecision, comments: string) => void;
  onUpdateReviewers?: (reviewers: ApqpReviewer[]) => void;
}

export const ReviewApprovalTab: React.FC<ReviewApprovalTabProps> = ({
  record,
  onReviewDecision,
  onUpdateReviewers,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<ApqpApprovalDecision>(
    record.approvalDecision || "Approved with Conditions"
  );
  const [comments, setComments] = useState(
    "Approved subject to final pilot build completion and Tier-1 PPAP Level 3 sign-off."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDecision) return;
    onReviewDecision?.(selectedDecision, comments);
    toast.success(`Recorded Gate Decision: ${selectedDecision}`, {
      description: "Review comments archived to APQP audit trail.",
    });
  };

  const handleToggleReviewerStatus = (role: string) => {
    const updated = record.reviewers.map((r) => {
      if (r.role === role) {
        const nextDecision: ApqpApprovalDecision =
          r.decision === "Approved"
            ? "Approved with Conditions"
            : r.decision === "Approved with Conditions"
            ? "Pending"
            : "Approved";
        const nextStatus: ApqpReviewer["status"] =
          nextDecision === "Approved" || nextDecision === "Approved with Conditions"
            ? "Approved"
            : "Pending";
        return {
          ...r,
          decision: nextDecision,
          status: nextStatus,
          date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        };
      }
      return r;
    });

    onUpdateReviewers?.(updated);
    toast.success(`Updated authorization for ${role}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs p-4 sm:p-5 text-xs w-full min-w-0 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">
              Review & Approval Authorization Matrix
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Multi-disciplinary gate sign-off, executive clearance, and technical governance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Workflow Stage:</span>
          <Badge className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 shadow-2xs">
            {record.workflowStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table on Left (7-8 cols) */}
        <div className="lg:col-span-8 space-y-2 min-w-0">
          <div className="rounded-xl border border-border overflow-hidden text-xs bg-background shadow-xs">
            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full min-w-0">
              <table className="w-full text-left border-collapse text-xs min-w-[520px]">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Approver</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Sign-Off Date</th>
                    <th className="py-2.5 px-3 text-right">Authorization Status ⇅</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {record.reviewers.map((rev, idx) => {
                    const approverName = rev.person || (rev as any).name || "Assigned Officer";
                    const isApproved = rev.status === "Approved" || rev.decision === "Approved";
                    const isConditional = rev.decision === "Approved with Conditions";

                    return (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-foreground whitespace-nowrap">
                          {rev.role}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#0B3B7B]/15 text-[#0B3B7B] dark:text-blue-300 flex items-center justify-center text-[9px] font-bold shrink-0">
                              {approverName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="font-medium text-foreground">{approverName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground font-mono whitespace-nowrap text-[11px]">
                          {rev.date || "-"}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleReviewerStatus(rev.role)}
                            title="Click to cycle: Approved -> Approved with Conditions -> Pending"
                            className="cursor-pointer inline-flex items-center justify-end"
                          >
                            <Badge
                              className={
                                isConditional
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 text-[10px] font-semibold gap-1 hover:scale-105 transition-transform"
                                  : isApproved
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 text-[10px] font-semibold gap-1 hover:scale-105 transition-transform"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 text-[10px] font-semibold gap-1 hover:scale-105 transition-transform"
                              }
                            >
                              {isConditional ? (
                                <>
                                  <AlertTriangle className="h-3 w-3 text-blue-600 shrink-0" />
                                  <span>Approved (Cond.)</span>
                                </>
                              ) : isApproved ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                  <span>Approved</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3 text-amber-600 shrink-0" />
                                  <span>Pending</span>
                                </>
                              )}
                            </Badge>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sign-Off Decision Panel on Right (4-5 cols) */}
        <div className="lg:col-span-4 p-4 rounded-xl border border-border bg-muted/20 space-y-3.5 text-xs min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-foreground text-sm border-b border-border pb-2">
            <UserCheck className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Sign-Off Decision Panel</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Approval Decision
              </label>
              <Select
                value={selectedDecision}
                onValueChange={(val) => setSelectedDecision(val as ApqpApprovalDecision)}
              >
                <SelectTrigger className="h-8 text-xs font-semibold bg-card border-border">
                  <SelectValue placeholder="Select Decision" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Approved" className="text-emerald-600 font-semibold">
                    Approved (Full Gate Pass)
                  </SelectItem>
                  <SelectItem value="Approved with Conditions" className="text-blue-600 font-semibold">
                    Approved with Conditions
                  </SelectItem>
                  <SelectItem value="Revision Required" className="text-amber-600 font-semibold">
                    Revision Required
                  </SelectItem>
                  <SelectItem value="Rejected" className="text-rose-600 font-semibold">
                    Rejected
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Review Comments
              </label>
              <Textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter review board comments, clearance notes, or gate stipulations..."
                className="text-xs bg-card border-border min-h-[75px] resize-none"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              className="w-full gap-1.5 bg-[#0B3B7B] hover:bg-[#092e60] text-white text-xs font-semibold shadow-xs h-8"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Submit Gate Decision</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
