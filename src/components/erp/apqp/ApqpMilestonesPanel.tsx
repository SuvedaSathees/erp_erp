import React, { useState } from "react";
import { Calendar, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { ApqpMilestone } from "@/services/types";
import { ApqpMilestonesModal } from "./ApqpMilestonesModal";

interface ApqpMilestonesPanelProps {
  milestones: ApqpMilestone[];
  projectName?: string;
  onViewAll?: () => void;
}

export const ApqpMilestonesPanel: React.FC<ApqpMilestonesPanelProps> = ({
  milestones,
  projectName = "Autonomous W-EVSE Quality Program",
  onViewAll,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
    if (onViewAll) onViewAll();
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl shadow-xs p-3.5 text-xs flex flex-col justify-between h-full w-full min-w-0">
        <div>
          <div className="flex justify-between items-center pb-2.5 border-b border-border mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-foreground text-xs">Upcoming Milestones</h2>
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold font-mono">
              {milestones.filter((m) => m.status === "Completed").length}/{milestones.length} Done
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {milestones.slice(0, 5).map((ms) => (
              <div
                key={ms.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-border/40"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {ms.status === "Completed" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  )}
                  <span className="font-semibold text-foreground truncate">{ms.title}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0 font-medium">
                  {ms.targetDate}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="mt-3 w-full py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 cursor-pointer pt-2 border-t border-border/40"
        >
          <span>View All Milestones</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Milestones Schedule Modal */}
      <ApqpMilestonesModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        milestones={milestones}
        projectName={projectName}
      />
    </>
  );
};
