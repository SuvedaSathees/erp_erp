import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import {
  Wifi,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  Eye,
  Plus,
  Sparkles,
  FileCode,
  FileSpreadsheet,
  MoreHorizontal,
  Layers,
  Check,
  X,
  Clock,
  HelpCircle,
  Search,
  FileCheck,
  Award,
  ListChecks,
  FileArchive,
  ChevronDown,
  User,
  AlertCircle,
  Info,
  BookOpen,
  Send,
  Save,
  FolderPlus,
  Printer,
  History,
  Workflow,
  ArrowRight,
  ShieldCheck,
  Box,
  Zap,
  Activity,
  Maximize2,
  Megaphone,
  Globe,
  Truck,
  ShieldAlert,
  Calendar,
  Tag,
  Share2,
  Users,
  CheckSquare,
  FileText,
  Cpu,
  Database,
  Radio,
  Lock,
  Smartphone,
  BarChart3,
  Server,
  Terminal,
  UserCheck,
  Building2,
  Paperclip,
  HardDrive,
} from "lucide-react";

import { iotDevelopmentService } from "@/services/iotDevelopmentService";
import type {
  IotApprovalDecision,
  IotFormInput,
  IotRecord,
  IotChecklistItem,
  IotAttachment,
} from "@/services/types";
import { ResearchInnovationTabBar, InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
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

export const Route = createFileRoute(
  "/development/research-innovation/iot-development/new"
)({
  component: IotPage,
});

export function IotDevelopmentFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <IotPage {...props} />;
}

export function IotDevelopmentNewPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <IotPage {...props} />;
}

export function IotDevelopmentPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <IotPage {...props} />;
}


/* Helper component for SVG Circular Gauge */
function CircularScoreGauge({
  score,
  size = 72,
  strokeWidth = 6,
  label,
  sublabel,
  color = "#10B981",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {score}%
          </span>
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>}
      {sublabel && <span className="text-[10px] text-slate-500">{sublabel}</span>}
    </div>
  );
}

/* File Icon Selector helper */
function getFileIcon(type?: string, name?: string) {
  const n = (name || type || "").toLowerCase();
  if (n.endsWith(".zip") || n.endsWith(".tar") || n.endsWith(".gz")) {
    return <FileArchive className="h-4 w-4 text-amber-500 shrink-0" />;
  }
  if (n.endsWith(".xlsx") || n.endsWith(".csv") || n.endsWith(".xls")) {
    return <FileSpreadsheet className="h-4 w-4 text-emerald-500 shrink-0" />;
  }
  if (n.endsWith(".pdf")) {
    return <FileText className="h-4 w-4 text-red-500 shrink-0" />;
  }
  return <FileText className="h-4 w-4 text-blue-500 shrink-0" />;
}

export function IotPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Dialog & Modal States
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeviceDashboardModal, setShowDeviceDashboardModal] = useState(false);
  const [showTopologyModal, setShowTopologyModal] = useState(false);
  const [showSecurityScanModal, setShowSecurityScanModal] = useState(false);
  const [showDigitalTwinModal, setShowDigitalTwinModal] = useState(false);
  const [showOtaModal, setShowOtaModal] = useState(false);
  const [showAuditLogDrawer, setShowAuditLogDrawer] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  // New file upload state
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Architecture");

  // Main Data Query
  const { data: record, isLoading } = useQuery({
    queryKey: ["iot-record"],
    queryFn: iotDevelopmentService.fetchRecord,
  });

  // Local Form state
  const [formData, setFormData] = useState<Partial<IotFormInput>>({
    iotProjectName: "",
    businessObjective: "",
    iotUseCase: "",
    deploymentEnvironment: "",
    targetDevices: ["EV Charger", "Gateway", "Energy Meter"],
    businessOutcome: "",
    developmentStatus: "",
    deviceType: "",
    controllerPlatform: "",
    sensors: [],
    actuators: [],
    gatewayType: "",
    deviceFirmwareVersion: "",
    approvalDecision: "Approved with Conditions",
    reviewComments: "Overall solution is good. Please address the minor security recommendations.",
    approvalDate: "20 Jun 2024",
    recommendation: "Proceed to Production",
  });

  const rec = useMemo(() => {
    if (!record) return null;
    return record;
  }, [record]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<IotFormInput>) => iotDevelopmentService.saveDraft(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iot-record"] });
      toast.success("Draft saved successfully.");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: () => iotDevelopmentService.submitForReview(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iot-record"] });
      toast.success("IoT Solution submitted for Architecture Board Review (Stage 4).");
    },
    onError: (err: any) => toast.error(`Submission failed: ${err.message}`),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: IotApprovalDecision;
      comments?: string;
    }) => iotDevelopmentService.reviewDecision(args),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["iot-record"] });
      if (variables.decision === "Approved") {
        toast.success("IOT SOLUTION APPROVED! Moved to Live Production & Monitoring enabled.");
      } else if (variables.decision === "Approved with Conditions") {
        toast.info("Approved with Conditions. Minor security recommendations pending.");
      } else if (variables.decision === "Revision Required") {
        toast.warning("Revision Requested. Returned for device architecture redesign.");
      } else {
        toast.error("IoT Project Rejected & Archived.");
      }
    },
    onError: (err: any) => toast.error(`Review decision failed: ${err.message}`),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: 1 | 2 | 3 | 4) => iotDevelopmentService.advanceStage(targetStage),
    onSuccess: (_, targetStage) => {
      queryClient.invalidateQueries({ queryKey: ["iot-record"] });
      toast.success(`IoT workflow stage set to Stage ${targetStage}`);
    },
  });

  const toggleChecklistMutation = useMutation({
    mutationFn: (args: { section: "deviceMgmt" | "dataCollection" | "integration"; itemId: string }) =>
      iotDevelopmentService.toggleChecklistItem(args.section, args.itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["iot-record"] });
      toast.success("IoT checklist item updated.");
    },
  });

  if (isLoading || !rec) {
    return (
      <div className="flex h-96 w-full items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-muted-foreground">Loading IoT Development record...</p>
        </div>
      </div>
    );
  }

  // Key Highlights calculation
  const keyHighlights = [
    { label: "All devices connected and healthy", done: rec.connectivityScore >= 90 },
    { label: "Secure communication enabled", done: rec.securityScore >= 90 },
    { label: "AI predictive maintenance active", done: rec.aiPredictiveMaintenance >= 90 },
    { label: "OTA updates configured", done: rec.deviceMgmtScore >= 85 },
    { label: "High performance and reliability", done: rec.overallIotSolutionScore >= 90 },
  ];

  // Helper for workflow status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Production":
      case "Approved":
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">Production</Badge>;
      case "Approved with Conditions":
        return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">Approved with Conditions</Badge>;
      case "In Review":
        return <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30">In Review</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">In Progress</Badge>;
      case "Revision Required":
        return <Badge className="bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30">Revision Required</Badge>;
      case "Rejected":
        return <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppShell
      title="IoT Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > IoT Development"}
      description="Manage connected IoT devices, MQTT/CoAP telemetry, edge gateways, OTA firmware updates, and digital twin state."
      tabs={tabs ?? <ResearchInnovationTabBar />}
    >
      <div className="space-y-6 pb-16">
      {/* 3. Record Header Bar */}
      <div className="mx-auto max-w-[1600px] px-4 pt-4">
        <Card className="border border-border/80 shadow-xs bg-card mb-4 overflow-hidden rounded-xl">
          {/* TOP ROW: Record Identity, Editable Title, & Action Buttons */}
          <div className="p-4 sm:p-5 pb-4 bg-slate-50/70 dark:bg-slate-900/90 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Record Identity & Title */}
            <div className="flex items-start sm:items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50 shadow-2xs">
                <Wifi className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/60">
                    {rec.iotDevelopmentId}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <Badge variant="outline" className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800">
                    {rec.formCode}
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                    {rec.solutionVersion}
                  </Badge>
                  {getStatusBadge(rec.workflowStatus)}
                </div>
                {/* Project Title Input with clean hover/focus state */}
                <div className="flex items-center gap-2">
                  <Input
                    value={formData.iotProjectName || rec.iotProjectName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, iotProjectName: e.target.value }))}
                    className="h-8 text-sm sm:text-base font-bold text-foreground bg-transparent hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary shadow-none px-2 py-0 transition-all rounded-md max-w-md"
                    placeholder="IoT Project Name..."
                  />
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveDraftMutation.mutate(formData)}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                {saveDraftMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />}
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold"
              >
                {submitMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Submit for Review
              </Button>

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-slate-800 shadow-2xs">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs shadow-lg">
                  <DropdownMenuItem onClick={() => setShowDeviceDashboardModal(true)} className="gap-2 cursor-pointer">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    View Device Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowTopologyModal(true)} className="gap-2 cursor-pointer">
                    <Radio className="h-4 w-4 text-emerald-600" />
                    View Network Topology
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDigitalTwinModal(true)} className="gap-2 cursor-pointer">
                    <Zap className="h-4 w-4 text-purple-600" />
                    View Digital Twin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSecurityScanModal(true)} className="gap-2 cursor-pointer">
                    <Lock className="h-4 w-4 text-red-600" />
                    Run Security Scan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowOtaModal(true)} className="gap-2 cursor-pointer">
                    <Upload className="h-4 w-4 text-amber-600" />
                    Schedule OTA Update
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    toast.success("Exporting IoT Summary PDF...");
                    window.print();
                  }} className="gap-2 cursor-pointer">
                    <Printer className="h-4 w-4 text-slate-600" />
                    Print / Export PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("IoT solution link copied to clipboard!");
                  }} className="gap-2 cursor-pointer">
                    <Share2 className="h-4 w-4 text-slate-600" />
                    Share Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAuditLogDrawer(true)} className="gap-2 cursor-pointer">
                    <History className="h-4 w-4 text-slate-600" />
                    View Audit Log
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* BOTTOM ROW: Key-Value Structured Metadata Ribbon */}
          <div className="px-4 py-2.5 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            {/* Linked Product */}
            <div className="flex flex-col gap-0.5 sm:pr-2">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Box className="h-3 w-3 text-blue-500" /> Linked Product
              </span>
              <button
                type="button"
                onClick={() => toast.info(`Navigating to product record: ${rec.linkedProduct.name}`)}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
              >
                <span className="truncate">{rec.linkedProduct.name}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            </div>

            {/* Embedded Dev */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Cpu className="h-3 w-3 text-emerald-500" /> Embedded Dev
              </span>
              <button
                type="button"
                onClick={() => toast.info(`Navigating to record: ${rec.linkedEmbeddedDev.code}`)}
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
              >
                <span className="truncate">{rec.linkedEmbeddedDev.code}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            </div>

            {/* Cloud Dev */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Server className="h-3 w-3 text-purple-500" /> Cloud Dev
              </span>
              <button
                type="button"
                onClick={() => toast.info(`Navigating to record: ${rec.linkedCloudDev.code}`)}
                className="font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
              >
                <span className="truncate">{rec.linkedCloudDev.code}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            </div>

            {/* AI Dev */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-500" /> AI Dev
              </span>
              <button
                type="button"
                onClick={() => toast.info(`Navigating to record: ${rec.linkedAiDev.code}`)}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
              >
                <span className="truncate">{rec.linkedAiDev.code}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            </div>

            {/* IoT Architect */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-slate-400" /> IoT Architect
              </span>
              <span className="font-semibold text-foreground truncate">{rec.iotArchitect.name}</span>
            </div>

            {/* Last Updated & Created */}
            <div className="flex flex-col gap-0.5 sm:pl-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" /> Created / Updated
              </span>
              <span className="font-medium text-slate-600 dark:text-slate-400 truncate">{rec.createdOn}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. Main Dashboard Grid Layout */}
      <div className="mx-auto max-w-[1600px] px-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Main Content Column */}
          <div className="lg:col-span-9 space-y-6">
                {/* ------------------------------------------------------------- */}
                {/* PANEL 1: IoT Project Overview */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">IoT Project Overview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      {/* Left Column */}
                      <div className="space-y-3">
                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                            IoT Project Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            value={formData.iotProjectName || rec.iotProjectName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, iotProjectName: e.target.value }))}
                            className="h-8 text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                            Business Objective <span className="text-red-500">*</span>
                          </label>
                          <Textarea
                            rows={2}
                            value={formData.businessObjective || rec.businessObjective}
                            onChange={(e) => setFormData((prev) => ({ ...prev, businessObjective: e.target.value }))}
                            className="text-xs resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                              IoT Use Case
                            </label>
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border-emerald-200">
                              {rec.iotUseCase}
                            </Badge>
                          </div>
                          <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                              Deployment Env.
                            </label>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold border-blue-200">
                              {rec.deploymentEnvironment}
                            </Badge>
                          </div>
                          <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                              Status
                            </label>
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border-emerald-200">
                              {rec.developmentStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                            Target Devices
                          </label>
                          <div className="flex gap-1.5 flex-wrap">
                            {rec.targetDevices.map((td) => (
                              <Badge key={td} variant="secondary" className="font-semibold bg-slate-100 dark:bg-slate-800 text-[11px]">
                                {td}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                            Business Outcome
                          </label>
                          <Textarea
                            rows={2}
                            value={formData.businessOutcome || rec.businessOutcome}
                            onChange={(e) => setFormData((prev) => ({ ...prev, businessOutcome: e.target.value }))}
                            className="text-xs resize-none"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                            Platform Architecture
                          </label>
                          <Badge variant="outline" className="font-mono text-xs font-semibold">
                            ESP32 MCU • 4G LTE • MQTT Stream
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid for Hardware Config & Connectivity Cards (Panels 2 & 3) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 2: Device & Hardware Configuration */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-base font-bold">Device & Hardware Configuration</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                            FW 1.3.5
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4 space-y-2.5 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-muted-foreground block font-medium">Device Type</span>
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[10px] font-bold">
                              {rec.deviceType}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium">Controller Platform</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rec.controllerPlatform}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground block font-medium mb-1">Sensors</span>
                          <div className="flex gap-1 flex-wrap">
                            {rec.sensors.map((s) => (
                              <Badge key={s} variant="outline" className="text-[10px] bg-slate-100 dark:bg-slate-800">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground block font-medium mb-1">Actuators</span>
                          <div className="flex gap-1 flex-wrap">
                            {rec.actuators.map((a) => (
                              <Badge key={a} variant="secondary" className="text-[10px]">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/60">
                          <div>
                            <span className="text-muted-foreground block font-medium">Gateway Type</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.gatewayType}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium">Device Firmware</span>
                            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{rec.deviceFirmwareVersion}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Hardware Readiness Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.hardwareScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>

                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 3: Connectivity & Communication */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Radio className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-base font-bold">Connectivity & Communication</CardTitle>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 text-xs font-mono font-bold">
                            MQTT Stream
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4 space-y-2.5 text-xs">
                        <div>
                          <span className="text-muted-foreground block font-medium mb-1">Communication Protocols</span>
                          <div className="flex gap-1 flex-wrap">
                            {rec.communicationProtocols.map((p) => (
                              <Badge key={p} className="bg-blue-100 text-blue-800 dark:bg-blue-950 text-[10px] font-bold">
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-muted-foreground block font-medium">Network Tech</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.networkTechnology}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium">Messaging Protocol</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.messagingProtocol}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60">
                          <div>
                            <span className="text-muted-foreground block font-medium text-[10px]">Cloud Connectivity</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium text-[10px]">Edge Computing</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium text-[10px]">Offline Sync</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Connectivity Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.connectivityScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Grid for Device Mgmt & Data Collection Cards (Panels 4 & 5) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 4: Device Management */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-base font-bold">Device Management</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                            6 Controls
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4">
                        <div className="space-y-2">
                          {rec.deviceMgmtChecklist.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleChecklistMutation.mutate({ section: "deviceMgmt", itemId: item.id })}
                              className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                                    item.completed ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                                  }`}
                                >
                                  {item.completed && <Check className="h-3 w-3" />}
                                </div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                {item.sourceStream}
                              </span>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Device Management Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.deviceMgmtScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>

                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 5: Data Collection & Analytics */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-base font-bold">Data Collection & Analytics</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                            Azure IoT Hub
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4 space-y-2 text-xs">
                        {rec.dataCollectionChecklist.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleChecklistMutation.mutate({ section: "dataCollection", itemId: item.id })}
                            className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                                  item.completed ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                                }`}
                              >
                                {item.completed && <Check className="h-3 w-3" />}
                              </div>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                              {item.sourceStream}
                            </span>
                          </button>
                        ))}

                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/60">
                          <div>
                            <span className="text-muted-foreground block font-medium">Data Storage Platform</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.dataStoragePlatform}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium">Data Retention Policy</span>
                            <span className="font-mono text-blue-600 font-bold">{rec.dataRetentionPolicy}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Analytics Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.analyticsScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 6: Security & Compliance */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base font-bold">Security & Compliance</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-xs font-mono font-bold">
                        X.509 + TLS 1.3
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                          <span className="text-muted-foreground block font-medium">Device Identity</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rec.deviceIdentity}</span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                          <span className="text-muted-foreground block font-medium">Encryption Standard</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rec.encryptionStandard}</span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                          <div>
                            <span className="text-muted-foreground block font-medium">Secure Boot</span>
                            <span className="font-bold text-emerald-600">Yes</span>
                          </div>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                          <span className="text-muted-foreground block font-medium">Certificate Management</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.certificateManagement}</span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                          <span className="text-muted-foreground block font-medium mb-1">Compliance Standards</span>
                          <div className="flex gap-1 flex-wrap">
                            {rec.complianceStandards.map((cs) => (
                              <Badge key={cs} variant="outline" className="text-[9px] bg-slate-100 dark:bg-slate-800">
                                {cs}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                          <div>
                            <span className="text-muted-foreground block font-medium">Vulnerability Assessment</span>
                            <span className="font-bold text-emerald-600">{rec.vulnerabilityAssessment}</span>
                          </div>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                      </div>

                      {/* Score Badge Card */}
                      <div className="md:col-span-3 flex flex-col items-center justify-center rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 p-4 text-center">
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2">Security Score</span>
                        <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 px-4 py-2 rounded-lg font-bold text-xl">
                          <span>{rec.securityScore}</span>
                          <span className="text-xs font-normal opacity-80">/100</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid for Integration & Deployment (Panels 7 & 8) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 7: Integration & Automation */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Workflow className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-base font-bold">Integration & Automation</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                            6 Integrations
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4">
                        <div className="space-y-2">
                          {rec.integrationChecklist.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleChecklistMutation.mutate({ section: "integration", itemId: item.id })}
                              className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                                    item.completed ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                                  }`}
                                >
                                  {item.completed && <Check className="h-3 w-3" />}
                                </div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                {item.sourceStream}
                              </span>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Integration Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.integrationScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>

                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 8: Deployment & Operations */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-base font-bold">Deployment & Operations</CardTitle>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-xs font-semibold">
                            {rec.operationalStatus}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4 space-y-2.5 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-muted-foreground block font-medium">Deployment Strategy</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.deploymentStrategy}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium">Monitoring Platform</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.monitoringPlatform}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-muted-foreground block font-medium">Edge Deployment</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Active
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block font-medium">Cloud Deployment</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Active
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-muted-foreground block font-medium">Alert Management</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.alertManagement}</span>
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Deployment Readiness Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.deploymentScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 9: AI IoT Assessment */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-base font-bold">AI IoT Assessment</CardTitle>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 gap-1 border-purple-200 font-semibold">
                        <Sparkles className="h-3 w-3 text-purple-600" />
                        AI Agent Generated
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
                          <span className="font-medium text-slate-700 dark:text-slate-300">AI Connectivity Score</span>
                          <span className="font-bold text-emerald-600 font-mono">{rec.aiConnectivityScore}/100</span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
                          <span className="font-medium text-slate-700 dark:text-slate-300">AI Security Assessment</span>
                          <span className="font-bold text-emerald-600 font-mono">{rec.aiSecurityAssessment}/100</span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
                          <span className="font-medium text-slate-700 dark:text-slate-300">AI Performance Analysis</span>
                          <span className="font-bold text-emerald-600 font-mono">{rec.aiPerformanceAnalysis}/100</span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
                          <span className="font-medium text-slate-700 dark:text-slate-300">AI Predictive Maintenance</span>
                          <span className="font-bold text-emerald-600 font-mono">{rec.aiPredictiveMaintenance}/100</span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
                          <span className="font-medium text-slate-700 dark:text-slate-300">AI Device Health Review</span>
                          <span className="font-bold text-emerald-600 font-mono">{rec.aiDeviceHealthReview}/100</span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 flex justify-between items-center">
                          <span className="font-medium text-purple-900 dark:text-purple-300">AI Optimization Suggestions</span>
                          <span className="font-bold text-purple-700 dark:text-purple-300">{rec.aiOptimizationSuggestions}</span>
                        </div>
                      </div>

                      {/* AI Graphic Icon Card */}
                      <div className="md:col-span-3 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border border-purple-200/60 dark:border-slate-700 p-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-sm mb-2">
                          AI
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Overall IoT Score</span>
                        <div className="mt-2 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-lg font-bold text-lg">
                          <span>{rec.aiOverallIotScore}</span>
                          <span className="text-xs font-normal opacity-80">/100</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 10: Attachments */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base font-bold">Attachments</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUploadDialog(true)}
                        className="gap-1.5 text-xs"
                      >
                        <Upload className="h-3.5 w-3.5 text-blue-600" />
                        Upload Attachment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {rec.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {getFileIcon(att.type, att.name)}
                            <div className="truncate">
                              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={att.name}>
                                {att.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground">{att.size}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toast.success(`Downloading ${att.name}`)}
                            className="p-1 text-slate-500 hover:text-blue-600 transition-colors shrink-0 cursor-pointer"
                            title="Download Attachment"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 text-right">
                      <button
                        type="button"
                        onClick={() => setShowUploadDialog(true)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        View All Attachments (8) <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 11: Review & Approval */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base font-bold">Review & Approval</CardTitle>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold border-amber-200">
                        IoT Architecture Review Board
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-6">
                    {/* Reviewers Table matching screenshot 2_17.png */}
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-2.5">Role</th>
                            <th className="p-2.5">Person</th>
                            <th className="p-2.5">Decision</th>
                            <th className="p-2.5">Date</th>
                            <th className="p-2.5">Comments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {rec.reviewers.map((rev) => (
                            <tr key={rev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                              <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">{rev.role}</td>
                              <td className="p-2.5 font-medium text-slate-700 dark:text-slate-300">{rev.person}</td>
                              <td className="p-2.5">
                                {rev.decision === "Approved" ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                                    Approved
                                  </span>
                                ) : rev.decision === "Approved with Conditions" ? (
                                  <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                                    Approved with Conditions
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 text-[10px] font-medium">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-slate-500">{rev.date}</td>
                              <td className="p-2.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">{rev.comments}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Decision Form Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs pt-2">
                      <div className="md:col-span-4">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                          Approval Decision <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.approvalDecision || rec.approvalDecision}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              approvalDecision: e.target.value as IotApprovalDecision,
                            }))
                          }
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <option value="Approved">Approved (Production Deployment)</option>
                          <option value="Approved with Conditions">Approved with Conditions</option>
                          <option value="Revision Required">Revision Required</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="md:col-span-5">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-semibold text-slate-700 dark:text-slate-300">
                            Review Comments <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {(formData.reviewComments || rec.reviewComments || "").length}/2000
                          </span>
                        </div>
                        <Textarea
                          rows={2}
                          maxLength={2000}
                          value={formData.reviewComments || rec.reviewComments}
                          onChange={(e) => setFormData((prev) => ({ ...prev, reviewComments: e.target.value }))}
                          className="text-xs resize-none"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                          Approval Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.approvalDate || rec.approvalDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, approvalDate: e.target.value }))}
                          className="h-9 text-xs"
                        />
                        <Button
                          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-bold"
                          onClick={() =>
                            reviewMutation.mutate({
                              id: rec.id,
                              decision: formData.approvalDecision || rec.approvalDecision,
                              comments: formData.reviewComments || rec.reviewComments,
                            })
                          }
                          disabled={reviewMutation.isPending}
                        >
                          Authorize Production
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 12: System Information */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base font-bold">System Information</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">
                        Audit Logged
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                      <div className="md:col-span-8 grid grid-cols-2 gap-y-3 gap-x-6">
                        <div>
                          <span className="text-muted-foreground block font-medium">Created By</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.createdBy}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Created Date</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{rec.createdDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Last Modified By</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.lastModifiedBy}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Last Modified Date</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{rec.lastModifiedDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Workflow Stage</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{rec.workflowStageLabel}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Version</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.solutionVersion}</span>
                        </div>
                      </div>

                      <div className="md:col-span-4 flex flex-col justify-center space-y-2 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                        <button
                          type="button"
                          onClick={() => setShowAuditLogDrawer(true)}
                          className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                        >
                          <span>View Log</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeviceDashboardModal(true)}
                          className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                        >
                          <span>View History</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTopologyModal(true)}
                          className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                        >
                          <span>View Changes</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowWorkflowModal(true)}
                          className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                        >
                          <span>View Workflow</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
          </div>

          {/* Right Sticky Sidebar Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="sticky top-6 space-y-4">
              {/* Overall IoT Solution Score Gauge Card matching screenshot 2_17.png */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-2 border-b border-border/60">
                  <CardTitle className="text-sm font-bold">Overall IoT Solution Score</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col items-center">
                  <CircularScoreGauge
                    score={rec.overallIotSolutionScore}
                    size={110}
                    strokeWidth={10}
                    color="#059669"
                  />

                  {/* Breakdown List */}
                  <div className="w-full mt-4 space-y-2 text-xs border-t border-border/60 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Hardware</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.hardwareScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Connectivity</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.connectivityScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Security</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.securityScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Deployment</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.deploymentScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Operations</span>
                      <span className="font-bold text-emerald-600">93%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </div>
    </div>

      {/* --------------------------------------------------------------------- */}
      {/* DIALOGS & MODALS */}
      {/* --------------------------------------------------------------------- */}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload IoT Attachment
            </DialogTitle>
            <DialogDescription>
              Add network topology diagrams, security audit reports, or device test scripts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full h-8 rounded-md border px-3 text-xs"
              >
                <option value="Architecture">Device Architecture</option>
                <option value="Network">Network Topology</option>
                <option value="Security">Security Assessment</option>
                <option value="Firmware">Firmware Spec</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">File Name</label>
              <Input
                placeholder="e.g. iot_device_security_v1.2.pdf"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 text-white"
              onClick={() => {
                toast.success(`Uploaded "${uploadFileName || 'device_doc.pdf'}"!`);
                setShowUploadDialog(false);
              }}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Device Dashboard Modal */}
      <Dialog open={showDeviceDashboardModal} onOpenChange={setShowDeviceDashboardModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              Connected Device Fleet Dashboard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-emerald-50 rounded-lg border">
                <span className="text-emerald-700 font-bold text-lg block">1,240</span>
                <span>Active Devices</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border">
                <span className="text-blue-700 font-bold text-lg block">99.98%</span>
                <span>Uptime</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border">
                <span className="text-purple-700 font-bold text-lg block">v1.3.5</span>
                <span>Firmware</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Topology Modal */}
      <Dialog open={showTopologyModal} onOpenChange={setShowTopologyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-emerald-600" />
              Network & MQTT Topology
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            <p className="font-semibold">Broker: mqtt.magnertia-ev.com (Port 8883 - TLS 1.3)</p>
            <p className="text-muted-foreground">Active Topics: tele/evse/+/telemetry, cmd/evse/+/control, evt/evse/+/faults</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Scan Modal */}
      <Dialog open={showSecurityScanModal} onOpenChange={setShowSecurityScanModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              IoT Security & X.509 Certificate Scan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            <p className="text-emerald-600 font-bold">✓ TLS 1.3 Encryption Validated</p>
            <p className="text-emerald-600 font-bold">✓ AWS IoT CA Root Certificates Valid</p>
            <p className="text-emerald-600 font-bold">✓ Secure Boot enabled on all 1,240 ESP32 chips</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Digital Twin Modal */}
      <Dialog open={showDigitalTwinModal} onOpenChange={setShowDigitalTwinModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Digital Twin Telemetry Model
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            <p className="font-semibold">Twin ID: DT-EVSE-7KW-009</p>
            <p className="text-muted-foreground">Real-time state synced: Voltage (230.4V), Current (31.8A), Temp (38.2°C), Health Score: 98%.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule OTA Update Modal */}
      <Dialog open={showOtaModal} onOpenChange={setShowOtaModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-amber-600" />
              Schedule OTA Firmware Rollout
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Target Firmware Version</label>
              <Input defaultValue="1.3.6-rc2" className="h-8 text-xs font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" className="bg-amber-600 text-white" onClick={() => { toast.success("OTA update v1.3.6 scheduled!"); setShowOtaModal(false); }}>
              Deploy OTA Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workflow Modal */}
      <Dialog open={showWorkflowModal} onOpenChange={setShowWorkflowModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-600" />
              IoT Connected-Device Workflow Engine (4 Stages)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3 text-xs">
            <div className="grid grid-cols-4 gap-2 text-center font-bold">
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">1: Design</div>
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">2: Reg & Integrate</div>
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">3: Telemetry & AI</div>
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">4: Review & Prod</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg leading-relaxed">
              <strong>Workflow Outcomes (Stage 4):</strong>
              <br />
              • <strong>Approved:</strong> Status set to Production & Live Production Monitoring active.
              <br />
              • <strong>Approved with Conditions:</strong> Pending minor security recommendations.
              <br />
              • <strong>Revision Required:</strong> Returned for device architecture redesign.
              <br />
              • <strong>Rejected:</strong> Project closed and archived.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Log Drawer */}
      <Dialog open={showAuditLogDrawer} onOpenChange={setShowAuditLogDrawer}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-600" />
              IoT Audit Log
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs max-h-96 overflow-y-auto">
            {rec.auditTrail.map((aud) => (
              <div key={aud.id} className="p-2.5 border-b border-border/60">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>{aud.action}</span>
                  <span className="text-muted-foreground font-normal">{aud.timestamp}</span>
                </div>
                <p className="text-muted-foreground mt-1">{aud.details}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">By {aud.user}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default IotPage;
