import React, { useState } from "react";
import { UserCheck, CheckCircle2, Clock, Send } from "lucide-react";
import type { RoutingRecord, RoutingApprovalDecision } from "@/services/types";

interface ReviewApprovalPanelProps {
  record: RoutingRecord;
  onReviewDecision?: (decision: RoutingApprovalDecision, comments: string) => void;
}

export const ReviewApprovalPanel: React.FC<ReviewApprovalPanelProps> = ({
  record,
  onReviewDecision,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<RoutingApprovalDecision>(
    record.approvalDecision
  );
  const [comments, setComments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReviewDecision?.(selectedDecision, comments);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-3 text-xs space-y-3">
      <div className="flex justify-between items-center pb-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-primary" />
          <h2 className="font-bold text-foreground text-xs">Review & Approval</h2>
        </div>
      </div>

      {/* Review Board Summary */}
      <div className="flex items-center justify-between p-2 rounded bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px]">
        <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>8 of 8 Board Approvals Recorded</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded">
          Complete
        </span>
      </div>

      {/* Decision Input Form */}
      <form onSubmit={handleSubmit} className="space-y-2 text-[11px]">
        <div>
          <label className="block text-muted-foreground font-semibold mb-1">Approval Decision</label>
          <select
            value={selectedDecision}
            onChange={(e) => setSelectedDecision(e.target.value as RoutingApprovalDecision)}
            className="w-full bg-background border border-input rounded px-2.5 py-1 font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Approved">Approved</option>
            <option value="Approved with Conditions">Approved with Conditions</option>
            <option value="Revision Required">Revision Required</option>
            <option value="On Hold">On Hold</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-muted-foreground font-semibold mb-1">Review Comments</label>
          <textarea
            rows={2}
            placeholder="Enter comments..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full bg-background border border-input rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-[11px]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow flex items-center justify-center gap-1 transition-colors"
        >
          <Send className="w-3 h-3" /> Submit Decision
        </button>
      </form>
    </div>
  );
};
