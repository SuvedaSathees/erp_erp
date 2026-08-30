import React from "react";
import type { BomEngineeringRecord } from "@/services/types";
import { BomStructureTable } from "../BomStructureTable";
import { BomOverviewGrid } from "../BomOverviewGrid";

interface OverviewTabProps {
  record: BomEngineeringRecord;
  onAddComponent: () => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  record,
  onAddComponent,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-4">
      {/* Full-width BOM Structure Table */}
      <BomStructureTable items={record.items} onAddComponent={onAddComponent} />

      {/* Full-width Overview Metric Cards Grid */}
      <BomOverviewGrid record={record} onNavigateTab={onNavigateTab} />
    </div>
  );
};
