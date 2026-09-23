import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock, UserCheck } from "lucide-react";
import type { CapacityApprovalDecision, CapacityFormInput, CapacityReviewer } from "@/services/types";
import { capacityPlanningService } from "@/services/capacityPlanningService";
import { toast } from "sonner";

export function CapacityApprovalSection({
  form,
  reviewers,
}: {
  form: UseFormReturn<CapacityFormInput>;
  reviewers: CapacityReviewer[];
}) {
  const { setValue } = form;

  const [decision, setDecision] = useState<CapacityApprovalDecision>("Approved");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyDecision = async () => {
    setIsSubmitting(true);
    try {
      const res = await capacityPlanningService.reviewDecision({
        id: "proc-cap-rec-00027",
        decision,
        comments,
      });
      setValue("workflowStatus", res.workflowStatus);
      setValue("approvalDecision", res.approvalDecision);
      toast.success(`Approval decision saved: ${decision}`);
    } catch (err) {
      toast.error("Failed to update approval decision");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold">Multi-Level Review & Approval Workflow</CardTitle>
          <CardDescription className="text-xs">
            Cross-functional sign-offs: Capacity Planning, Production, Manufacturing, Industrial, Supply Chain, Plant Head, COO, CEO.
          </CardDescription>
        </div>

        <Badge className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1">
          Workflow Stage: Under Review
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
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
                    {reviewers.map((rev) => {
                      const isApproved = rev.status === "Approved";
                      return (
                        <tr
                          key={rev.role}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                            {rev.role}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                            {rev.person}
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
                              variant="outline"
                              className={
                                isApproved
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-[10px] font-semibold"
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

          <div className="xl:col-span-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 text-xs">
            <span className="font-bold text-foreground block text-sm flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary shrink-0" />
              Sign-Off Decision Panel
            </span>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">Approval Decision</label>
              <Select value={decision} onValueChange={(v) => setDecision(v as CapacityApprovalDecision)}>
                <SelectTrigger className="h-9 text-xs font-semibold bg-white dark:bg-slate-900 border-border">
                  <SelectValue placeholder="Select Decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved" className="text-xs text-emerald-600 font-semibold">
                    Approved
                  </SelectItem>
                  <SelectItem value="Approved with Conditions" className="text-xs text-blue-600">
                    Approved with Conditions
                  </SelectItem>
                  <SelectItem value="Revision Required" className="text-xs text-amber-600 font-semibold">
                    Revision Required
                  </SelectItem>
                  <SelectItem value="On Hold" className="text-xs text-primary">
                    On Hold
                  </SelectItem>
                  <SelectItem value="Rejected" className="text-xs text-destructive font-semibold">
                    Rejected
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">Review Comments</label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                placeholder="Enter sign-off comments, bottleneck constraints, or capacity shift notes..."
                className="text-xs bg-white dark:bg-slate-900 min-h-[90px] border-border"
              />
            </div>

            <Button
              size="sm"
              onClick={handleApplyDecision}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-xs"
            >
              {isSubmitting ? "Submitting..." : "Submit Review Decision"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
