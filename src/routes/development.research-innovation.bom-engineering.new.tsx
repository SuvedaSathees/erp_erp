import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { BomEngineeringHeader } from "@/components/erp/bom-engineering/BomEngineeringHeader";
import { AddComponentModal } from "@/components/erp/bom-engineering/AddComponentModal";
import { OverviewTab } from "@/components/erp/bom-engineering/tabs/OverviewTab";

import {
  fetchBomRecord,
  saveBomDraft,
  submitBomForReview,
  addBomComponent,
} from "@/services/bomEngineeringService";

export const Route = createFileRoute(
  "/development/research-innovation/bom-engineering/new",
)({
  component: BomEngineeringPage,
});

export function BomEngineeringPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: record, isLoading } = useQuery({
    queryKey: ["bom-engineering-record"],
    queryFn: fetchBomRecord,
  });

  const saveDraftMutation = useMutation({
    mutationFn: saveBomDraft,
    onSuccess: (updated) => {
      queryClient.setQueryData(["bom-engineering-record"], updated);
      toast.success("BOM Engineering Draft saved successfully");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: submitBomForReview,
    onSuccess: (updated) => {
      queryClient.setQueryData(["bom-engineering-record"], updated);
      toast.success("BOM Engineering submitted for Executive Board review!");
    },
    onError: (err: any) => toast.error(`Failed to submit: ${err.message}`),
  });

  const addComponentMutation = useMutation({
    mutationFn: addBomComponent,
    onSuccess: (updated) => {
      queryClient.setQueryData(["bom-engineering-record"], updated);
      toast.success("New BOM component added successfully");
    },
    onError: (err: any) => toast.error(`Failed to add component: ${err.message}`),
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="BOM Engineering"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading BOM Engineering Master Record...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="BOM Engineering"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > BOM Engineering"}
      description="Manage manufacturing bill of materials (MBOM), Phantom BOMs, component structures, effectivity dates, and alternate parts."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top Header Box */}
        <BomEngineeringHeader
          record={record}
          onSaveDraft={() => saveDraftMutation.mutate({})}
          onSubmitForReview={() => submitMutation.mutate()}
          onExport={() => {
            const headers = ["Part Number", "Description", "Level", "Quantity", "UOM", "Category", "Make/Buy", "Unit Cost", "Total Cost", "Lead Time", "Status"];
            const rows = record.items.map((item) => [
              item.partNumber,
              `"${item.description.replace(/"/g, '""')}"`,
              item.level,
              item.quantity,
              item.uom,
              item.itemCategory,
              item.makeBuy,
              item.unitCost,
              item.totalCost,
              item.leadTimeDays,
              "Approved",
            ]);
            const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `BOM_Export_${record.bomNumber}_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("BOM Master exported to CSV/Excel successfully");
          }}
          onNewBom={() => {
            setIsAddModalOpen(true);
            toast.info("Opening Add Component Modal...");
          }}
        />

        {/* Unified Main View */}
        <OverviewTab
          record={record}
          onAddComponent={() => setIsAddModalOpen(true)}
          onNavigateTab={(t) => toast.info(`Viewing ${t} section`)}
        />

        {/* Add Component Modal */}
        <AddComponentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(item) => addComponentMutation.mutate(item)}
        />
      </div>
    </AppShell>
  );
}
