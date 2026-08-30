import React, { useState } from "react";
import { UserCheck, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import type { ApqpRecord, ApqpApprovalDecision } from "@/services/types";

interface ReviewApprovalTabProps {
  record: ApqpRecord;
  onReviewDecision?: (decision: ApqpApprovalDecision, comments: string) => void;
}

export const ReviewApprovalTab: React.FC<ReviewApprovalTabProps> = ({
  record,
  onReviewDecision,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<ApqpApprovalDecision>(
    record.approvalDecision || "Approved"
  );
  const [comments, setComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReviewDecision?.(selectedDecision, comments);
  };

  return (
    <Card className="border-border shadow-xs bg-white dark:bg-slate-900">
      <CardHeader className="border-b border-border/60 pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <CardTitle className="text-base font-bold text-foreground">
            Review & Approval Authorization Matrix
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Workflow Stage:</span>
          <Badge className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5">
            {record.workflowStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Table on Left (8 cols) */}
          <div className="xl:col-span-8 space-y-2">
            <div className="rounded-lg border border-border overflow-hidden text-xs bg-background shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">Role</th>
                      <th className="py-3 px-4 font-semibold">Approver</th>
                      <th className="py-3 px-4 font-semibold">Decision</th>
                      <th className="py-3 px-4 font-semibold whitespace-nowrap">Date</th>
                      <th className="py-3 px-4 text-right font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {record.reviewers.map((rev, idx) => {
                      const isApproved = rev.status === "Approved";
                      return (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                            {rev.role}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap font-medium">
                            {rev.name}
                          </td>
                          <td className="py-3 px-4 font-medium whitespace-nowrap">
                            {isApproved ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Approved
                              </span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-semibold">
                                <Clock className="h-3.5 w-3.5 shrink-0" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground font-mono whitespace-nowrap">
                            {rev.date || "-"}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <Badge
                              className={
                                isApproved
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 text-[10px] font-semibold"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 text-[10px] font-semibold"
                              }
                            >
                              {rev.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sign-Off Decision Panel on Right (4 cols) */}
          <div className="xl:col-span-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 text-xs">
            <span className="font-bold text-foreground block text-sm flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary shrink-0" />
              Sign-Off Decision Panel
            </span>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Approval Decision</label>
                <Select
                  value={selectedDecision}
                  onValueChange={(val) => setSelectedDecision(val as ApqpApprovalDecision)}
                >
                  <SelectTrigger className="h-9 text-xs font-semibold bg-white dark:bg-slate-900 border-border">
                    <SelectValue placeholder="Select Decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved" className="text-xs text-emerald-600 font-semibold">Approved</SelectItem>
                    <SelectItem value="Approved with Conditions" className="text-xs text-blue-600">Approved with Conditions</SelectItem>
                    <SelectItem value="Revision Required" className="text-xs text-amber-600 font-semibold">Revision Required</SelectItem>
                    <SelectItem value="Rejected" className="text-xs text-destructive font-semibold">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">Review Comments</label>
                <Textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter review board comments, clearance notes, or gate stipulations..."
                  className="text-xs bg-white dark:bg-slate-900 border-border min-h-[85px]"
                />
              </div>

              <Button
                type="submit"
                size="sm"
                className="w-full gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Submit Gate Decision
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
