// Firmware Development View - Magnertia ERP
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Terminal,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Activity,
  GitBranch,
  Play,
  RefreshCw,
  FileText,
  Download,
  Upload,
  Eye,
  Save,
  Send,
  MoreHorizontal,
  ExternalLink,
  ChevronRight,
  Workflow,
  Copy,
  Plus,
  FileCode,
  HardDrive,
  Lock,
  Target,
  Zap,
  BarChart3,
  Check,
  X,
  Share2,
  Printer,
  History,
  Info,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Box,
  Globe,
  Settings,
  Sparkles,
  Clock,
  ArrowRight,
  CheckSquare,
  UserCheck,
  Paperclip,
  Palette,
  QrCode,
  Radio,
  Package,
  CircuitBoard,
  Microscope,
  ShieldAlert,
} from "lucide-react";

import { AppShell } from "@/components/erp/AppShell";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import {
  FirmwareDevelopmentTabBar,
  type FirmwareDevelopmentTabId,
} from "@/components/erp/FirmwareDevelopmentTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { firmwareDevelopmentService } from "@/services/firmwareDevelopmentService";
import type {
  FirmwareDevelopmentApprovalDecision,
  FirmwareDevelopmentFormInput,
  FirmwareDevelopmentRecord,
  FirmwareDevelopmentStage,
} from "@/services/types";

export function FirmwareDevelopmentFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <FirmwareDevelopmentNewPage {...props} />;
}

export function FirmwareDevelopmentPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <FirmwareDevelopmentNewPage {...props} />;
}

export function FirmwareDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FirmwareDevelopmentTabId>("overview");

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [mcuChipModalOpen, setMcuChipModalOpen] = useState(false);
  const [layeredDiagramModalOpen, setLayeredDiagramModalOpen] = useState(false);
  const [systemLogModalOpen, setSystemLogModalOpen] = useState(false);

  // Fetch record
  const { data: record, isLoading } = useQuery({
    queryKey: ["firmware-development-record"],
    queryFn: () => firmwareDevelopmentService.fetchRecord(),
  });

  // Local Form state
  const [formInput, setFormInput] = useState<FirmwareDevelopmentFormInput | null>(null);

  if (record && !formInput) {
    setFormInput(record.input);
  }

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<FirmwareDevelopmentFormInput>) =>
      firmwareDevelopmentService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["firmware-development-record"], updated);
      toast.success("Draft saved successfully!", {
        description: "Firmware configurations updated.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save draft"),
  });

  const submitMutation = useMutation({
    mutationFn: () => firmwareDevelopmentService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["firmware-development-record"], updated);
      toast.success("Submitted for Architecture Review!", {
        description: "Project moved to Stage 4 Engineering Review.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Submission failed"),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      decision: FirmwareDevelopmentApprovalDecision;
      comments?: string;
    }) => firmwareDevelopmentService.reviewDecision({ id: record!.id, ...args }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["firmware-development-record"], updated);
      if (variables.decision === "Approved") {
        toast.success(
          "Firmware Development Approved! Downstream System Integration SI-2024-0089 created."
        );
      } else {
        toast.info(`Review Decision updated to '${variables.decision}'.`);
      }
    },
    onError: (err: Error) => toast.error(err.message || "Decision submission failed"),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: FirmwareDevelopmentStage) =>
      firmwareDevelopmentService.advanceStage(record!.id, targetStage),
    onSuccess: (updated) => {
      queryClient.setQueryData(["firmware-development-record"], updated);
      toast.success("Advanced workflow stage successfully!");
    },
  });

  if (isLoading || !record || !formInput) {
    return (
      <AppShell
        title="Firmware Development"
        breadcrumb={breadcrumb ?? "Development > Product Development > Firmware Development"}
        tabs={tabs}
      >
        <div className="p-8 space-y-6">
          <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </AppShell>
    );
  }

  const handleFieldChange = (field: keyof FirmwareDevelopmentFormInput, value: any) => {
    setFormInput((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const shouldShowSection = (tabKey: FirmwareDevelopmentTabId) => {
    return activeTab === "overview" || activeTab === tabKey;
  };

  return (
    <AppShell
      title="Firmware Development"
      breadcrumb={breadcrumb ?? "Development > Product Development > Firmware Development"}
      description="Design deterministic real-time firmware, FreeRTOS tasks, CAN FD stacks, bootloaders, and ISO 26262 safety layers."
      tabs={tabs}
    >
      <div className="space-y-6 pb-16">
        {/* ===========================================================================
            1. RECORD HEADER BAR (Exact match to Cloud Platform / API Development design)
            =========================================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl px-6 py-4 space-y-3 shadow-2xs">
          {/* Row 1: Primary Title, Version, Status & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 flex items-center justify-center font-bold shrink-0 border border-teal-200/50 dark:border-teal-800/50">
                <Terminal className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {record.firmwareProjectName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-semibold px-2.5 py-0.5"
                >
                  {record.firmwareVersion}
                </Badge>
                <Badge
                  className={
                    record.status === "Approved"
                      ? "bg-emerald-600 text-white"
                      : record.status === "In Review" || record.status === "Under Review"
                      ? "bg-amber-500 text-white hover:bg-amber-600 font-semibold px-3 py-1 rounded-full"
                      : "bg-blue-600 text-white"
                  }
                >
                  {record.status}
                </Badge>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveDraftMutation.mutate(formInput)}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 h-9"
              >
                <Save className="h-4 w-4 text-slate-500" />
                Save Draft
              </Button>

              <Button
                size="sm"
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm h-9"
              >
                <Send className="h-4 w-4" />
                Submit for Review
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setMcuChipModalOpen(true)}>
                    <Cpu className="h-4 w-4 mr-2 text-teal-500" />
                    Inspect Silicon Target Spec
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLayeredDiagramModalOpen(true)}>
                    <Layers className="h-4 w-4 mr-2 text-blue-500" />
                    View Layered Architecture
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReportModalOpen(true)}>
                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                    Download Executive Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSystemLogModalOpen(true)}>
                    <History className="h-4 w-4 mr-2 text-emerald-500" />
                    View Audit Trail
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Specification
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Row 2: Secondary Metadata & Linked Entities with proper alignment */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  FIRMWARE DEV ID
                </span>
                <span className="font-bold font-mono text-foreground">
                  {record.firmwareId}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  FORM CODE
                </span>
                <span className="font-semibold font-mono text-foreground">
                  {record.formCode}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  LINKED EMBEDDED
                </span>
                <span
                  onClick={() =>
                    navigate({
                      to: "/development/research-innovation/embedded-systems-development/new" as any,
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                >
                  {record.linkedEmbeddedDevelopmentId}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  LINKED ELECTRONICS
                </span>
                <span
                  onClick={() =>
                    navigate({
                      to: "/development/research-innovation/electronics-design/new" as any,
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                >
                  {record.linkedElectronicsDesignId}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  LINKED ARCHITECTURE
                </span>
                <span
                  onClick={() =>
                    navigate({
                      to: "/development/research-innovation/product-architecture/new" as any,
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                >
                  {record.linkedProductArchitectureId}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  CREATED ON
                </span>
                <span className="font-mono text-muted-foreground">
                  {record.createdOn}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                FIRMWARE LEAD:
              </span>
              <span className="font-semibold text-foreground">
                {record.firmwareLeadName}
              </span>
            </div>
          </div>
        </div>

        {/* Scores & Health Gauges Banner */}
        <ProductScoreBanner submoduleKey="firmware-development" />

        {/* Downstream Banner when Approved */}
        {record.status === "Approved" && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between text-emerald-900 dark:text-emerald-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-emerald-950 dark:text-white">
                  Firmware Development Approved by Engineering Board
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Downstream Hardware Bring-up &amp; System Integration project{" "}
                  <span className="font-bold font-mono">{record.linkedSystemIntegrationId}</span>{" "}
                  has been auto-created &amp; linked for board flashing.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => toast.info(`Navigating to System Integration (${record.linkedSystemIntegrationId})...`)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Proceed to System Integration
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        )}

        {/* ===========================================================================
            4. MAIN CONTENT AREA
            =========================================================================== */}
        <div className="space-y-6">
            {/* -------------------------------------------------------------------
                PANEL 1: Firmware Project Overview
                ------------------------------------------------------------------- */}
            {shouldShowSection("overview") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-teal-600" />
                    Firmware Development Overview
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Status: {formInput.developmentStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Product Name
                    </label>
                    <Input
                      value={formInput.productName}
                      onChange={(e) => handleFieldChange("productName", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Firmware Name
                    </label>
                    <Input
                      value={formInput.firmwareName}
                      onChange={(e) => handleFieldChange("firmwareName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Firmware Objective
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.firmwareObjective}
                      onChange={(e) => handleFieldChange("firmwareObjective", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Development Scope
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.developmentScope}
                      onChange={(e) => handleFieldChange("developmentScope", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Supported Hardware Targets
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border">
                      {formInput.supportedHardware.map((hw, i) => (
                        <span key={i} className="bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800 px-2.5 py-0.5 rounded text-xs font-bold shadow-2xs">
                          {hw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Programming Languages
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border">
                      {formInput.programmingLanguage.map((lang, i) => (
                        <span key={i} className="bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 px-2.5 py-0.5 rounded text-xs font-bold shadow-2xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 2: Firmware Architecture & RTOS
                ------------------------------------------------------------------- */}
            {shouldShowSection("architecture") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Firmware Architecture &amp; RTOS Kernel
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Status: {formInput.architectureStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Firmware Architecture</span>
                    <Input
                      value={formInput.firmwareArchitecture}
                      onChange={(e) => handleFieldChange("firmwareArchitecture", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Bootloader Version</span>
                    <Input
                      value={formInput.bootloaderVersion}
                      onChange={(e) => handleFieldChange("bootloaderVersion", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">HAL Version</span>
                    <Input
                      value={formInput.halVersion}
                      onChange={(e) => handleFieldChange("halVersion", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">BSP Version</span>
                    <Input
                      value={formInput.bspVersion}
                      onChange={(e) => handleFieldChange("bspVersion", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Middleware Stack</span>
                    <Input
                      value={formInput.middlewareStack}
                      onChange={(e) => handleFieldChange("middlewareStack", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Application Framework</span>
                    <Input
                      value={formInput.applicationFramework}
                      onChange={(e) => handleFieldChange("applicationFramework", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 3: Software Modules
                ------------------------------------------------------------------- */}
            {shouldShowSection("modules") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Box className="h-4 w-4 text-purple-600" />
                    Firmware Modules &amp; Subsystems
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {formInput.modules.length} Modules Implemented
                  </span>
                </CardHeader>

                <CardContent className="pt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-border text-foreground font-semibold">
                      <tr>
                        <th className="p-2.5">Module Name</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Owner</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 text-right">Complexity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {formInput.modules.map((mod) => (
                        <tr key={mod.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-foreground">{mod.name}</td>
                          <td className="p-2.5 text-muted-foreground">{mod.category}</td>
                          <td className="p-2.5 text-foreground">{mod.owner}</td>
                          <td className="p-2.5">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-semibold",
                                mod.status === "Completed" || mod.status === "Passed"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              )}
                            >
                              {mod.status}
                            </Badge>
                          </td>
                          <td className="p-2.5 text-right font-mono font-semibold text-foreground">
                            {mod.complexity}/100
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 4: Communication Protocols & Middleware
                ------------------------------------------------------------------- */}
            {shouldShowSection("communication") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CircuitBoard className="h-4 w-4 text-blue-600" />
                    Firmware Protocols &amp; Communication Stack
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Stack: {formInput.protocolStackStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {formInput.communicationInterfacesList.map((iface, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center space-y-1">
                        <span className="font-semibold text-foreground block truncate">{iface.name}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                          <Check className="h-3 w-3 stroke-[3]" /> Enabled
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    <span className="text-muted-foreground font-semibold">Wireless Protocol Stacks:</span>
                    <div className="flex items-center gap-2">
                      {formInput.wirelessTags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-mono text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 5: Diagnostics & Safety
                ------------------------------------------------------------------- */}
            {shouldShowSection("diagnostics_safety") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    Diagnostics &amp; Functional Safety
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Readiness: {formInput.diagnosticReadinessScore}/100 ({formInput.dtcSupportCount} DTCs Verified)
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Self-Test Functions</span>
                    <Input
                      value={formInput.selfTestFunctions}
                      onChange={(e) => handleFieldChange("selfTestFunctions", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">DTC Support Count</span>
                    <Input
                      type="number"
                      value={formInput.dtcSupportCount}
                      onChange={(e) => handleFieldChange("dtcSupportCount", Number(e.target.value))}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Fault Handling Policy</span>
                    <Input
                      value={formInput.faultHandling}
                      onChange={(e) => handleFieldChange("faultHandling", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Watchdog Strategy</span>
                    <Input
                      value={formInput.watchdogStrategy}
                      onChange={(e) => handleFieldChange("watchdogStrategy", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Error Recovery</span>
                    <Input
                      value={formInput.errorRecovery}
                      onChange={(e) => handleFieldChange("errorRecovery", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Functional Safety Standard</span>
                    <Input
                      value={formInput.functionalSafetyText}
                      onChange={(e) => handleFieldChange("functionalSafetyText", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 6: Cybersecurity & Crypto
                ------------------------------------------------------------------- */}
            {shouldShowSection("cybersecurity") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Device Security &amp; Cryptography
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Security Score: {formInput.securityScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Secure Boot Engine</span>
                    <Input
                      value={formInput.secureBoot}
                      onChange={(e) => handleFieldChange("secureBoot", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Firmware Signing</span>
                    <Input
                      value={formInput.firmwareSigning}
                      onChange={(e) => handleFieldChange("firmwareSigning", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Secure OTA Update</span>
                    <Input
                      value={formInput.secureOtaUpdate}
                      onChange={(e) => handleFieldChange("secureOtaUpdate", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Encryption Standard</span>
                    <Input
                      value={formInput.encryptionMethod}
                      onChange={(e) => handleFieldChange("encryptionMethod", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Authentication Method</span>
                    <Input
                      value={formInput.authenticationMethod}
                      onChange={(e) => handleFieldChange("authenticationMethod", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Vulnerability Assessment</span>
                    <Input
                      value={formInput.vulnerabilityAssessment}
                      onChange={(e) => handleFieldChange("vulnerabilityAssessment", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 7: Testing & Automated CI/CD
                ------------------------------------------------------------------- */}
            {shouldShowSection("testing_qa") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                    Firmware Testing &amp; Automated CI/CD
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Code Coverage: {formInput.codeCoverage}%
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {formInput.testItems.map((test) => (
                    <div key={test.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-foreground block">{test.name}</span>
                        {test.details && <span className="text-[10px] text-muted-foreground block">{test.details}</span>}
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[11px] font-semibold",
                          test.status === "Completed" || test.status === "Passed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                      >
                        {test.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 8: Release Management & OTA Artifacts
                ------------------------------------------------------------------- */}
            {shouldShowSection("release_management") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    Release Management &amp; OTA Binary Packages
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Status: {formInput.releaseStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-1">Release Type</span>
                      <Input value={formInput.releaseType} onChange={(e) => handleFieldChange("releaseType", e.target.value)} className="h-9 text-xs font-bold" />
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-1">Build Number</span>
                      <Input value={formInput.buildNumber} onChange={(e) => handleFieldChange("buildNumber", e.target.value)} className="h-9 text-xs font-mono font-semibold" />
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-1">Git Commit</span>
                      <Input value={formInput.gitCommitReference} onChange={(e) => handleFieldChange("gitCommitReference", e.target.value)} className="h-9 text-xs font-mono" />
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-1">Release Date</span>
                      <Input type="date" value={formInput.releaseDate} onChange={(e) => handleFieldChange("releaseDate", e.target.value)} className="h-9 text-xs" />
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-xl bg-slate-50/60 dark:bg-slate-800/50 flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="font-bold text-foreground text-sm block">Signed OTA Binary Package</span>
                      <span className="font-mono text-muted-foreground block">{formInput.otaPackageName} • {formInput.otaPackageSize}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success(`Downloading ${formInput.otaPackageName}...`)}>
                      <Download className="h-4 w-4 mr-1.5" /> Download Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 9: AI Assessment
                ------------------------------------------------------------------- */}
            {shouldShowSection("ai_assessment") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    AI Firmware Evaluation &amp; Optimization
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    AI Overall: {record.aiAssessment.aiOverallFirmwareScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Code Quality</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiCodeQualityScore}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Performance</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiPerformanceOptimization}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Memory Opt.</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiMemoryOptimization}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Security Anal.</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiSecurityAnalysis}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Bug Predict</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiBugPrediction}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Maintainability</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiMaintainabilityScore}/100</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 10: Readiness Summary
                ------------------------------------------------------------------- */}
            {shouldShowSection("summary") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    Readiness &amp; Release Summary
                  </CardTitle>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-bold px-2.5 py-0.5">
                    Recommendation: {record.summary.recommendation}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 flex flex-col md:flex-row items-center gap-6 text-xs">
                  <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-border">
                    <div className="relative inline-flex items-center justify-center">
                      <svg width={96} height={96} className="transform -rotate-90">
                        <circle
                          cx={48}
                          cy={48}
                          r={40}
                          className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                          strokeWidth={8}
                        />
                        <circle
                          cx={48}
                          cy={48}
                          r={40}
                          className="fill-none transition-all duration-1000 ease-out text-teal-600 stroke-teal-600 dark:text-teal-400 dark:stroke-teal-400"
                          strokeWidth={8}
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - record.summary.overallFirmwareScore / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-center">
                        <span className="text-xl font-bold tracking-tight text-foreground">
                          {record.summary.overallFirmwareScore}%
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-muted-foreground mt-2 uppercase tracking-wide">Overall Firmware Score</span>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>Firmware Readiness</span>
                        <span>{record.summary.firmwareReadiness} / 100</span>
                      </div>
                      <Progress value={record.summary.firmwareReadiness} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>Code Quality</span>
                        <span>{record.summary.codeQuality} / 100</span>
                      </div>
                      <Progress value={record.summary.codeQuality} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>Security Readiness</span>
                        <span>{record.summary.securityReadiness} / 100</span>
                      </div>
                      <Progress value={record.summary.securityReadiness} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>Test Coverage</span>
                        <span>{record.summary.testCoverage} / 100</span>
                      </div>
                      <Progress value={record.summary.testCoverage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 11: Document & Artifact Attachments
                ------------------------------------------------------------------- */}
            {shouldShowSection("attachments") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-blue-600" />
                    Attachments &amp; Technical Documents
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {formInput.attachments.length} Verified Files
                  </span>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {formInput.attachments.map((att) => (
                    <div key={att.id} className="p-3 border border-border rounded-lg bg-slate-50/60 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-xs text-foreground block truncate">{att.name}</span>
                          <span className="text-[10px] text-muted-foreground block">{att.size}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.info(`Downloading ${att.name}...`)}
                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Download file"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 12: Review & Approval Table & Form
                ------------------------------------------------------------------- */}
            {shouldShowSection("review_approval") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    Review &amp; Approval
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Firmware Design Review Board
                  </span>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Reviewers Table (Col-span 2) */}
                  <div className="lg:col-span-2 overflow-x-auto border border-border rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-border text-foreground font-semibold">
                        <tr>
                          <th className="p-2.5">Role</th>
                          <th className="p-2.5">Person</th>
                          <th className="p-2.5">Decision</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {formInput.reviewers.map((rev) => (
                          <tr key={rev.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                            <td className="p-2.5 font-semibold text-foreground">{rev.role}</td>
                            <td className="p-2.5 text-muted-foreground">{rev.person}</td>
                            <td className="p-2.5">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-semibold",
                                  rev.decision === "Approved"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                )}
                              >
                                {rev.decision}
                              </Badge>
                            </td>
                            <td className="p-2.5 font-medium text-foreground">{rev.status}</td>
                            <td className="p-2.5 text-muted-foreground">{rev.date || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Decision Input Controls */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl p-4 space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">Approval Decision</label>
                      <select
                        value={formInput.approvalDecision || ""}
                        onChange={(e) => handleFieldChange("approvalDecision", e.target.value as FirmwareDevelopmentApprovalDecision)}
                        className="w-full rounded-lg border border-input bg-white dark:bg-slate-900 p-2 font-semibold text-foreground text-xs"
                      >
                        <option value="">Select Decision</option>
                        <option value="Approved">Approved</option>
                        <option value="Approved with Conditions">Approved with Conditions</option>
                        <option value="Revision Required">Revision Required</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-muted-foreground mb-1">
                        <label>Review Comments</label>
                        <span>{(formInput.reviewComments || "").length}/2000</span>
                      </div>
                      <Textarea
                        rows={3}
                        maxLength={2000}
                        value={formInput.reviewComments || ""}
                        onChange={(e) => handleFieldChange("reviewComments", e.target.value)}
                        placeholder="Enter firmware review board comments..."
                        className="text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">Approval Date</label>
                      <Input
                        type="date"
                        value={formInput.approvalDate || ""}
                        onChange={(e) => handleFieldChange("approvalDate", e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      disabled={reviewMutation.isPending}
                      onClick={() => {
                        if (!formInput.approvalDecision) {
                          toast.error("Please select an Approval Decision.");
                          return;
                        }
                        reviewMutation.mutate({
                          decision: formInput.approvalDecision,
                          comments: formInput.reviewComments,
                        });
                      }}
                    >
                      Submit Board Decision
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 13: System Information & Audit Trail
                ------------------------------------------------------------------- */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
              <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-600" />
                  System Information &amp; Audit Trail
                </CardTitle>
                <span className="text-xs font-semibold text-muted-foreground font-mono">
                  Audit Ref: {record.id}
                </span>
              </CardHeader>

              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-muted-foreground block font-semibold">Created By</span>
                    <span className="font-bold text-foreground">{record.firmwareLeadName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Created Date</span>
                    <span className="font-medium text-muted-foreground">{record.createdOn}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified By</span>
                    <span className="font-bold text-foreground">{record.firmwareLeadName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified Date</span>
                    <span className="font-medium text-muted-foreground">{record.lastUpdated}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Workflow Stage</span>
                    <Badge variant="outline" className="text-[11px] font-semibold">{record.currentStageLabel.split(": ")[1]}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Version</span>
                    <span className="font-bold font-mono text-foreground">v{record.version}</span>
                  </div>
                </div>

                {/* History quick links */}
                <div className="flex flex-col justify-center space-y-1.5 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
                  <button
                    type="button"
                    onClick={() => setSystemLogModalOpen(true)}
                    className="text-xs font-bold text-primary hover:underline text-left cursor-pointer"
                  >
                    View Audit Trail &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => setSystemLogModalOpen(true)}
                    className="text-xs font-bold text-primary hover:underline text-left cursor-pointer"
                  >
                    View Activity History &rarr;
                  </button>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* ===========================================================================
            MODALS
            =========================================================================== */}

        {/* Executive Report Modal */}
        <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Firmware Development Executive Report
              </DialogTitle>
              <DialogDescription>
                Generated executive summary report for record {record.firmwareId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-border space-y-1.5">
                <span className="font-bold text-foreground block">{record.firmwareProjectName}</span>
                <p className="text-muted-foreground leading-relaxed">
                  Covers FreeRTOS v10.4.3 real-time firmware architecture, STM32H743ZI Cortex-M7 target, CAN FD telemetry, ISO 26262 ASIL-B diagnostics, and AES-256 secure bootloader.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-semibold">
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Overall Firmware Score: {record.summary.overallFirmwareScore}/100</div>
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Firmware Version: {record.firmwareVersion}</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => { toast.success("Downloaded Firmware_Executive_Report.pdf"); setReportModalOpen(false); }}>
                <Download className="h-4 w-4 mr-1.5" /> Download PDF Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MCU Silicon Modal */}
        <Dialog open={mcuChipModalOpen} onOpenChange={setMcuChipModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-teal-600" />
                Target MCU Silicon Specification
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">STM32H743ZI ARM Cortex-M7 Target</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                480 MHz Core Clock, 2 MB Flash, 1 MB RAM, Hardware FPU/DSP, Dual CAN FD Controllers, and Hardware Cryptographic Accelerator.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMcuChipModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Layered Architecture Modal */}
        <Dialog open={layeredDiagramModalOpen} onOpenChange={setLayeredDiagramModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Firmware Layered Stack Architecture
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Layers className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Layered Stack Engine</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                Application State Machine → FreeRTOS Kernel / MbedTLS / LwIP Middleware → STM32 Cube HAL &amp; LL Drivers → Board Support Package (BSP).
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLayeredDiagramModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* System Log Modal */}
        <Dialog open={systemLogModalOpen} onOpenChange={setSystemLogModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Audit Trail &amp; Workflow History
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-80 overflow-y-auto space-y-3 text-xs">
              {record.auditTrail.map((log, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>{log.actor}</span>
                    <span className="text-muted-foreground font-normal">{log.at}</span>
                  </div>
                  <p className="text-muted-foreground">{log.event}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
