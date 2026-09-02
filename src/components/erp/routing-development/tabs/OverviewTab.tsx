import React from "react";
import type { RoutingRecord } from "@/services/types";
import { OperationRoutingTable } from "../OperationRoutingTable";
import { ResourceAllocationCard } from "../ResourceAllocationCard";
import { ManufacturingValidationCard } from "../ManufacturingValidationCard";
import { QualityComplianceCard } from "../QualityComplianceCard";
import { ProductionCostAnalysisCard } from "../ProductionCostAnalysisCard";
import { AiRoutingAssessmentPanel } from "../AiRoutingAssessmentPanel";
import { ReviewApprovalPanel } from "../ReviewApprovalPanel";
import { RoutingAttachmentsRow } from "../RoutingAttachmentsRow";

interface OverviewTabProps {
  record: RoutingRecord;
  onAddOperation: () => void;
  onNavigateTab: (tab: any) => void;
  onReviewDecision?: (decision: any, comments: string) => void;
  onUpdateOperations?: (ops: any[]) => void;
  onUploadAttachment?: (file: { name: string; type: string; size: number; documentType: string }) => void;
  onDeleteAttachment?: (id: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  record,
  onAddOperation,
  onNavigateTab,
  onReviewDecision,
  onUpdateOperations,
  onUploadAttachment,
  onDeleteAttachment,
}) => {
  return (
    <div className="space-y-5">
      {/* 1. Operation Routing Table */}
      <OperationRoutingTable
        operations={record.operations}
        onAddOperation={onAddOperation}
        onUpdateOperations={onUpdateOperations}
      />

      {/* 2. Core Manufacturing Execution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResourceAllocationCard record={record} />
        <ManufacturingValidationCard record={record} />
        <QualityComplianceCard record={record} />
        <ProductionCostAnalysisCard record={record} />
      </div>

      {/* 3. AI Insights & Review Board Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AiRoutingAssessmentPanel
          aiAssessment={record.aiAssessment}
          onViewAnalysis={() => onNavigateTab("ai")}
        />
        <ReviewApprovalPanel record={record} onReviewDecision={onReviewDecision} />
      </div>

      {/* 4. Attachments Tray */}
      <RoutingAttachmentsRow
        record={record}
        onNavigateTab={onNavigateTab}
        onUploadAttachment={onUploadAttachment}
        onDeleteAttachment={onDeleteAttachment}
      />
    </div>
  );
};
