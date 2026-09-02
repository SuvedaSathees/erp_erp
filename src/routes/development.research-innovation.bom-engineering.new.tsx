import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { BomEngineeringHeader } from "@/components/erp/bom-engineering/BomEngineeringHeader";
import { AddComponentModal } from "@/components/erp/bom-engineering/AddComponentModal";
import { OverviewTab } from "@/components/erp/bom-engineering/tabs/OverviewTab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";

import {
  fetchBomRecord,
  saveBomDraft,
  submitBomForReview,
  addBomComponent,
} from "@/services/bomEngineeringService";
import type { BomEngineeringRecord } from "@/services/types";

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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { data: record, isLoading } = useQuery<BomEngineeringRecord>({
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

  const handleExportReport = () => {
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
  };

  const handleNewBom = () => {
    const newRec: BomEngineeringRecord = {
      ...record,
      id: `bom-rec-${Date.now()}`,
      bomId: `BOM-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      bomNumber: `BOM-AW-EVSE-${Math.floor(100 + Math.random() * 900)}`,
      workflowStatus: "In Progress",
      version: 1.0,
      createdDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    queryClient.setQueryData(["bom-engineering-record"], newRec);
    toast.success("New Engineering BOM Initialized!", {
      description: `BOM ID ${newRec.bomId} created.`,
    });
  };

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
          onExport={handleExportReport}
          onNewBom={handleNewBom}
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
