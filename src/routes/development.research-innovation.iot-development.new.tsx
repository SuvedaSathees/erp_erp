import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import {
  Wifi,
  Save,
  Send,
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
  FileSpreadsheet,
  MoreHorizontal,
  Check,
  X,
  Clock,
  Printer,
  History as HistoryIcon,
  Workflow,
  ArrowRight,
  ShieldCheck,
  Box,
  Zap,
  Activity,
  Calendar,
  Share2,
  FileText,
  Cpu,
  Server,
  Lock,
  Smartphone,
  BarChart3,
  UserCheck,
  Paperclip,
  HardDrive,
  Target,
  FileArchive,
  ChevronDown,
  Trash2,
  RadioTower,
  SlidersHorizontal,
} from "lucide-react";

import { iotDevelopmentService } from "@/services/iotDevelopmentService";
import type {
  IotApprovalDecision,
  IotFormInput,
  IotRecord,
  IotChecklistItem,
  IotAttachment,
  IotReviewer,
} from "@/services/types";
import { ResearchInnovationTabBar, InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import { cn } from "@/lib/utils";

/* ===========================================================================
   Browser Download Helper
   =========================================================================== */
function triggerBrowserDownload(filename: string, content: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ===========================================================================
   Routes & Top-Level Exports
   =========================================================================== */
export const Route = createFileRoute(
  "/development/research-innovation/iot-development/new"
)({
  component: () => <Navigate to="/development/research-innovation/overview" replace />,
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

/* ===========================================================================
   Circular Score Gauge Helper
   =========================================================================== */
function CircularScoreGauge({
  score,
  size = 72,
  strokeWidth = 6,
  color = "#10B981",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
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
            className="stroke-slate-100 dark:stroke-slate-800 fill-none"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            className="fill-none transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono text-foreground leading-none">{score}%</span>
        </div>
      </div>
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

/* ===========================================================================
   Main Component: IotPage
   =========================================================================== */
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
  const [showFleetHistoryModal, setShowFleetHistoryModal] = useState(false);
  const [showRevisionHistoryModal, setShowRevisionHistoryModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showAddReviewerModal, setShowAddReviewerModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<IotAttachment | null>(null);

  // New Reviewer Form State
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerRole, setNewReviewerRole] = useState("");

  // New file upload state
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Architecture");
  const [uploadFileSize, setUploadFileSize] = useState("1.8 MB");

  // Linked Entity Inspection Modal
  const [linkedEntityModal, setLinkedEntityModal] = useState<{
    type: string;
    id: string;
    title: string;
    route: string;
  } | null>(null);

  // Main Data Query
  const { data: serverRecord, isLoading } = useQuery({
    queryKey: ["iot-record"],
    queryFn: iotDevelopmentService.fetchRecord,
  });

  // Local record state for instant interactive updates
  const [localRecord, setLocalRecord] = useState<IotRecord | null>(null);

  // Synchronize serverRecord initially
  React.useEffect(() => {
    if (serverRecord && !localRecord) {
      setLocalRecord(serverRecord);
    }
  }, [serverRecord, localRecord]);

  const rec = localRecord || serverRecord;

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

  // Keep form data aligned with record
  React.useEffect(() => {
    if (rec) {
      setFormData((prev) => ({
        ...prev,
        iotProjectName: rec.iotProjectName,
        businessObjective: rec.businessObjective,
        iotUseCase: rec.iotUseCase,
        deploymentEnvironment: rec.deploymentEnvironment,
        businessOutcome: rec.businessOutcome,
        developmentStatus: rec.developmentStatus,
        deviceType: rec.deviceType,
        controllerPlatform: rec.controllerPlatform,
        deviceFirmwareVersion: rec.deviceFirmwareVersion,
        approvalDecision: rec.approvalDecision,
        reviewComments: rec.reviewComments,
      }));
    }
  }, [rec]);

  // OTA Rollout progress simulation
  const [isDeployingOta, setIsDeployingOta] = useState(false);
  const [otaProgress, setOtaProgress] = useState(0);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<IotFormInput>) => iotDevelopmentService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["iot-record"], updated);
      setLocalRecord(updated);
      toast.success("Draft saved successfully.", {
        description: "IoT system specifications and device configurations recorded.",
      });
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: () => iotDevelopmentService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["iot-record"], updated);
      setLocalRecord(updated);
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
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["iot-record"], updated);
      setLocalRecord(updated);
      if (variables.decision === "Approved") {
        toast.success("IoT SOLUTION APPROVED! Moved to Live Production & Monitoring enabled.");
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
    onSuccess: (updated, targetStage) => {
      queryClient.setQueryData(["iot-record"], updated);
      setLocalRecord(updated);
      toast.success(`IoT workflow stage set to Stage ${targetStage}`);
    },
  });

  // Action: Interactive Workflow Status Dropdown
  const handleStatusChange = (newStatus: string) => {
    if (!rec) return;
    const updated: IotRecord = {
      ...rec,
      workflowStatus: newStatus as any,
      lastModifiedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["iot-record"], updated);
    toast.success(`Workflow status updated to '${newStatus}'`);
  };

  // Action: Toggle Checklist Controls
  const toggleChecklist = (section: "deviceMgmt" | "dataCollection" | "integration", itemId: string) => {
    if (!rec) return;
    let listKey: "deviceMgmtChecklist" | "dataCollectionChecklist" | "integrationChecklist" = "deviceMgmtChecklist";
    if (section === "dataCollection") listKey = "dataCollectionChecklist";
    if (section === "integration") listKey = "integrationChecklist";

    const updatedList = rec[listKey].map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updated: IotRecord = {
      ...rec,
      [listKey]: updatedList,
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["iot-record"], updated);
    toast.success("Checklist control updated.");
  };

  // Action: Add New Attachment
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rec) return;
    const filename = uploadFileName.trim() ? uploadFileName.trim() : "iot_spec_document.pdf";
    const newAtt: IotAttachment = {
      id: `att-${Date.now()}`,
      name: filename.includes(".") ? filename : `${filename}.pdf`,
      size: uploadFileSize,
      type: filename.endsWith(".xlsx") ? "Excel" : filename.endsWith(".zip") ? "Archive" : "PDF",
      url: "#",
    };

    const updated: IotRecord = {
      ...rec,
      attachments: [newAtt, ...rec.attachments],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["iot-record"], updated);
    setShowUploadDialog(false);
    setUploadFileName("");
    toast.success(`Uploaded "${newAtt.name}" successfully!`, {
      description: "Added to IoT Architecture & Firmware Assets.",
    });
  };

  // Action: Delete Attachment
  const handleDeleteAttachment = (id: string, name: string) => {
    if (!rec) return;
    const updated: IotRecord = {
      ...rec,
      attachments: rec.attachments.filter((a) => a.id !== id),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["iot-record"], updated);
    toast.success(`Deleted attachment: ${name}`);
  };

  // Action: Add Board Reviewer
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerRole.trim() || !rec) {
      toast.error("Please provide reviewer name and role");
      return;
    }
    const newRev: IotReviewer = {
      role: newReviewerRole,
      name: newReviewerName,
      decision: "Pending",
      date: "-",
      comments: "Pending review",
    };

    const updated: IotRecord = {
      ...rec,
      reviewers: [...rec.reviewers, newRev],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["iot-record"], updated);
    setShowAddReviewerModal(false);
    setNewReviewerName("");
    setNewReviewerRole("");
    toast.success(`Added ${newRev.name} to Review Board`);
  };

  // Action: Toggle Reviewer Decision directly
  const handleToggleReviewerDecision = (index: number) => {
    if (!rec) return;
    const decisions: IotApprovalDecision[] = ["Approved", "Approved with Conditions", "Revision Required", "Rejected"];
    const current = rec.reviewers[index]?.decision || "Pending";
    const nextIdx = (decisions.indexOf(current as IotApprovalDecision) + 1) % decisions.length;
    const nextDecision = decisions[nextIdx];
    const updatedReviewers = [...rec.reviewers];
    updatedReviewers[index] = {
      ...updatedReviewers[index],
      decision: nextDecision,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated: IotRecord = { ...rec, reviewers: updatedReviewers };
    setLocalRecord(updated);
    queryClient.setQueryData(["iot-record"], updated);
    toast.success(`Updated ${updatedReviewers[index].name}'s decision to ${nextDecision}`);
  };

  // Action: Run OTA Rollout Simulation
  const handleStartOta = () => {
    setIsDeployingOta(true);
    setOtaProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += 25;
      setOtaProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setIsDeployingOta(false);
        toast.success("OTA Update v1.3.6 successfully rolled out to 1,240 devices!");
      }
    }, 400);
  };

  // Action: Export Full Dossier (.TXT)
  const handleExportDossier = () => {
    if (!rec) return;
    const content = `====================================================================
IOT CONNECTED-DEVICE SPECIFICATION & FLEET DOSSIER
====================================================================
Project Name: ${rec.iotProjectName}
Solution Version: ${rec.solutionVersion}
IoT Development ID: ${rec.iotDevelopmentId}
Form Code: ${rec.formCode}
Workflow Status: ${rec.workflowStatus}
IoT Architect: ${rec.iotArchitect.name}
Created Date: ${rec.createdDate}
Last Modified: ${rec.lastModifiedDate}

1. OVERALL ARCHITECTURE SCORES
--------------------------------------------------------------------
Overall IoT Solution Score: ${rec.overallIotSolutionScore}%
1. Hardware Readiness: ${rec.hardwareScore}%
2. Connectivity & Protocols: ${rec.connectivityScore}%
3. Device Management: ${rec.deviceMgmtScore}%
4. Data Collection & Analytics: ${rec.analyticsScore}%
5. Security & Compliance: ${rec.securityScore}%
6. Deployment Readiness: ${rec.deploymentScore}%

2. HARDWARE & DEVICE FLEET
--------------------------------------------------------------------
Device Type: ${rec.deviceType}
Controller Platform: ${rec.controllerPlatform}
Sensors: ${rec.sensors.join(", ")}
Actuators: ${rec.actuators.join(", ")}
Gateway Type: ${rec.gatewayType}
Device Firmware: ${rec.deviceFirmwareVersion}

3. CONNECTIVITY & BROKER TOPOLOGY
--------------------------------------------------------------------
Network Technology: ${rec.networkTechnology}
Messaging Protocol: ${rec.messagingProtocol}
Protocols: ${rec.communicationProtocols.join(", ")}
Broker: mqtt.magnertia-ev.com (Port 8883 - TLS 1.3)
Active Devices: 1,240 Nodes (99.98% Uptime)

4. ATTACHMENTS (${rec.attachments.length} Files)
--------------------------------------------------------------------
${rec.attachments.map((a, i) => `${i + 1}. ${a.name} (${a.size})`).join("\n")}

5. REVIEW BOARD SIGN-OFF
--------------------------------------------------------------------
${rec.reviewers.map((r, i) => `${i + 1}. [${r.decision}] ${r.role} - ${r.name}: ${r.comments} (${r.date})`).join("\n")}
====================================================================`;

    triggerBrowserDownload(`${rec.iotDevelopmentId}_iot_dossier.txt`, content, "text/plain;charset=utf-8");
    toast.success("IoT Dossier downloaded successfully!");
  };

  // Action: Export Device Fleet CSV
  const handleExportFleetCSV = () => {
    if (!rec) return;
    const csvRows = [
      ["Device ID", "Model", "Firmware", "Status", "IP Address", "Last Ping"],
      ["DEV-EVSE-001", "Smart EV Charger AC 7kW", "1.3.5", "Online", "10.0.4.12", "Just now"],
      ["DEV-EVSE-002", "Smart EV Charger AC 7kW", "1.3.5", "Online", "10.0.4.13", "12s ago"],
      ["DEV-GW-001", "Industrial Linux Gateway", "2.1.0", "Online", "10.0.4.1", "5s ago"],
      ["DEV-MTR-001", "Digital Modbus Energy Meter", "1.0.4", "Online", "10.0.4.88", "1s ago"],
    ];
    const csvContent = csvRows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    triggerBrowserDownload(`${rec.iotDevelopmentId}_fleet_devices.csv`, csvContent, "text/csv;charset=utf-8");
    toast.success("Exported device fleet data to CSV!");
  };

  if (isLoading || !rec) {
    return (
      <div className="flex h-96 w-full items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-muted-foreground">Loading IoT Development Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="IoT Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > IoT Development"}
      description="Manage connected IoT devices, MQTT/CoAP telemetry, edge gateways, OTA firmware updates, and digital twin state."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="space-y-5 pb-16">
        {/* ====================================================================
           1. TOP RECORD HEADER BAR: Title, Version, Status Dropdown & Actions
           ==================================================================== */}
        <div className="mx-auto max-w-[1600px] px-4 pt-2">
          <Card className="border border-border/80 shadow-2xs bg-card overflow-hidden rounded-xl">
            {/* Top Row: Record Identity & Action Buttons */}
            <div className="p-4 sm:p-5 pb-4 bg-slate-50/70 dark:bg-slate-900/90 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50 shadow-2xs">
                  <Wifi className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/60">
                      {rec.iotDevelopmentId}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <Badge variant="outline" className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800">
                      {rec.formCode}
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                      {rec.solutionVersion}
                    </Badge>

                    {/* Interactive Workflow Status Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-primary",
                            rec.workflowStatus === "Production" || rec.workflowStatus === "Approved"
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : rec.workflowStatus === "Approved with Conditions"
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : rec.workflowStatus === "In Review"
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          )}
                        >
                          <span>{rec.workflowStatus}</span>
                          <ChevronDown className="h-3 w-3 opacity-80" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-52">
                        <DropdownMenuItem onClick={() => handleStatusChange("In Progress")} className="cursor-pointer">
                          <Clock className="mr-2 h-3.5 w-3.5 text-blue-500" /> In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("In Review")} className="cursor-pointer">
                          <Eye className="mr-2 h-3.5 w-3.5 text-purple-500" /> In Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Approved with Conditions")} className="cursor-pointer">
                          <AlertTriangle className="mr-2 h-3.5 w-3.5 text-amber-500" /> Approved with Conditions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Production")} className="cursor-pointer">
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Production
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Revision Required")} className="cursor-pointer">
                          <AlertTriangle className="mr-2 h-3.5 w-3.5 text-rose-500" /> Revision Required
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Project Title Input */}
                  <div className="flex items-center gap-2">
                    <Input
                      value={formData.iotProjectName || rec.iotProjectName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, iotProjectName: e.target.value }))}
                      className="h-8 text-base sm:text-lg font-bold text-foreground bg-transparent hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary shadow-none px-2 py-0 transition-all rounded-md max-w-md"
                      placeholder="IoT Project Name..."
                    />
                  </div>
                </div>
              </div>

              {/* Top Actions */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveDraftMutation.mutate(formData)}
                  disabled={saveDraftMutation.isPending}
                  className="gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {saveDraftMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />}
                  Save Draft
                </Button>
                {rec.workflowStatus === "In Review" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:border-amber-500/50 shadow-2xs transition-all cursor-pointer"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                        <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Under Review</span>
                        <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 text-xs">
                      <DropdownMenuItem
                        onClick={() => document.getElementById("section-review")?.scrollIntoView({ behavior: "smooth" })}
                        className="cursor-pointer"
                      >
                        <UserCheck className="mr-2 h-4 w-4 text-emerald-600" /> Record Review Decision
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          toast.success("Expedited review reminder dispatched to IoT Review Board.");
                        }}
                        className="cursor-pointer"
                      >
                        <Send className="mr-2 h-4 w-4 text-primary" /> Send Review Reminder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          handleStatusChange("In Progress");
                          toast.info("Status reverted to In Progress. You can now modify IoT telemetry controls.");
                        }}
                        className="cursor-pointer text-amber-600 dark:text-amber-400"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" /> Revert Status to In Progress
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : rec.workflowStatus === "Approved" ? (
                  <Badge className="h-8 px-3 text-xs font-semibold gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {rec.workflowStatus}
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => submitMutation.mutate()}
                    disabled={submitMutation.isPending}
                    className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold cursor-pointer h-8"
                  >
                    {submitMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Submit for Review
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => document.getElementById("section-review")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-8 px-3 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Review Decision
                </Button>

                {/* More Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-slate-800 shadow-2xs cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 text-xs shadow-lg">
                    <DropdownMenuItem onClick={() => setShowDeviceDashboardModal(true)} className="gap-2 cursor-pointer">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                      View Device Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowTopologyModal(true)} className="gap-2 cursor-pointer">
                      <RadioTower className="h-4 w-4 text-emerald-600" />
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
                    <DropdownMenuItem onClick={handleExportDossier} className="gap-2 cursor-pointer">
                      <Download className="h-4 w-4 text-primary" />
                      Export Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportFleetCSV} className="gap-2 cursor-pointer">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      Export Fleet CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.print()} className="gap-2 cursor-pointer">
                      <Printer className="h-4 w-4 text-slate-600" />
                      Print / Export PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("IoT solution link copied to clipboard!");
                      }}
                      className="gap-2 cursor-pointer"
                    >
                      <Share2 className="h-4 w-4 text-slate-600" />
                      Share Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAuditLogDrawer(true)} className="gap-2 cursor-pointer">
                      <HistoryIcon className="h-4 w-4 text-slate-600" />
                      View Audit Log
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Bottom Row: Key-Value Structured Metadata Ribbon with Functional Modals */}
            <div className="px-4 py-2.5 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs divide-y sm:divide-y-0 sm:divide-x divide-border/60">
              {/* Linked Product */}
              <div className="flex flex-col gap-0.5 sm:pr-2">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Box className="h-3 w-3 text-blue-500" /> Linked Product
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Product Portfolio",
                      id: rec.linkedProduct.code,
                      title: rec.linkedProduct.name,
                      route: "/development/product-development",
                    })
                  }
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
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Embedded Systems Development",
                      id: rec.linkedEmbeddedDev.code,
                      title: "ESP32 Charging Controller Firmware Platform",
                      route: "/development/research-innovation/embedded-systems/new",
                    })
                  }
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer font-mono"
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
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Cloud Platform Development",
                      id: rec.linkedCloudDev.code,
                      title: "Smart EV Cloud Telemetry & Fleet Management Platform",
                      route: "/development/research-innovation/cloud-platform-development/new",
                    })
                  }
                  className="font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer font-mono"
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
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "AI Model Development",
                      id: rec.linkedAiDev.code,
                      title: "EV Demand Forecasting & Predictive Maintenance Model",
                      route: "/development/research-innovation/ai-model-development/new",
                    })
                  }
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer font-mono"
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

        {/* ====================================================================
           3. EXECUTIVE OVERALL IOT SCORE & READINESS STRIP
           ==================================================================== */}
        <div className="mx-auto max-w-[1600px] px-4 space-y-6">
          <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col xl:flex-row items-center justify-between gap-6">
              {/* Overall Score Gauge */}
              <div className="flex items-center gap-5 shrink-0">
                <CircularScoreGauge
                  score={rec.overallIotSolutionScore}
                  size={96}
                  strokeWidth={8}
                  color="#059669"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">Overall IoT Solution Score</span>
                    <Badge className="bg-emerald-600 text-white text-[10px] font-semibold">
                      {rec.workflowStageLabel || "IoT Review"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-md">
                    Scalable edge IoT architecture for EV charging network telemetry, OTA updates, and real-time analytics.
                  </p>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 pt-0.5">
                    <Target className="h-3.5 w-3.5" />
                    <span>Total Score: {rec.overallIotSolutionScore}% (91% Avg across 5 IoT Architecture Pillars)</span>
                  </div>
                </div>
              </div>

              {/* 5 Component Metrics with Progress Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full xl:w-auto xl:min-w-[620px]">
                <div
                  onClick={() => document.getElementById("hardware")?.scrollIntoView({ behavior: "smooth" })}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-[11px] text-muted-foreground block font-medium">1. Hardware</span>
                  <span className="text-sm font-bold text-foreground font-mono">{rec.hardwareScore}%</span>
                  <Progress value={rec.hardwareScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("connectivity")?.scrollIntoView({ behavior: "smooth" })}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-[11px] text-muted-foreground block font-medium">2. Connectivity</span>
                  <span className="text-sm font-bold text-foreground font-mono">{rec.connectivityScore}%</span>
                  <Progress value={rec.connectivityScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("security")?.scrollIntoView({ behavior: "smooth" })}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-[11px] text-muted-foreground block font-medium">3. Security</span>
                  <span className="text-sm font-bold text-foreground font-mono">{rec.securityScore}%</span>
                  <Progress value={rec.securityScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("deployment")?.scrollIntoView({ behavior: "smooth" })}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-[11px] text-muted-foreground block font-medium">4. Deployment</span>
                  <span className="text-sm font-bold text-foreground font-mono">{rec.deploymentScore}%</span>
                  <Progress value={rec.deploymentScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("device_mgmt")?.scrollIntoView({ behavior: "smooth" })}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-[11px] text-muted-foreground block font-medium">5. Operations</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">93%</span>
                  <Progress value={93} className="h-1.5" />
                </div>
              </div>
            </div>
          </Card>

          {/* ====================================================================
             4. BALANCED WORKSPACE DOMAIN SECTIONS GRID
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* PANEL 1: IoT Project Overview */}
            <Card id="overview" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">1. IoT Project Overview</CardTitle>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border-emerald-200 text-xs">
                      {rec.developmentStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                      IoT Project Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.iotProjectName || rec.iotProjectName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, iotProjectName: e.target.value }))}
                      className="h-8 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
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
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        IoT Use Case
                      </label>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border-emerald-200 text-xs">
                        {rec.iotUseCase}
                      </Badge>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Deployment Env.
                      </label>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold border-blue-200 text-xs">
                        {rec.deploymentEnvironment}
                      </Badge>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Status
                      </label>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border-emerald-200 text-xs">
                        {rec.developmentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                      Target Devices
                    </label>
                    <div className="flex gap-1.5 flex-wrap">
                      {rec.targetDevices.map((td) => (
                        <Badge key={td} variant="secondary" className="font-semibold bg-slate-100 dark:bg-slate-800 text-[11px]">
                          {td}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="font-semibold text-[10px]">+2</Badge>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                      Business Outcome
                    </label>
                    <Textarea
                      rows={2}
                      value={formData.businessOutcome || rec.businessOutcome}
                      onChange={(e) => setFormData((prev) => ({ ...prev, businessOutcome: e.target.value }))}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-medium">Platform Architecture</span>
                    <Badge variant="outline" className="font-mono text-xs font-semibold">
                      ESP32 MCU • 4G LTE • MQTT Stream
                    </Badge>
                  </div>
                </CardContent>
              </Card>

            {/* PANEL 2: Device & Hardware Configuration */}
            <Card id="hardware" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">2. Device & Hardware Configuration</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                      FW 1.3.5
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Device Type</span>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[10px] font-bold mt-0.5">
                        {rec.deviceType}
                      </Badge>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Controller Platform</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs block mt-0.5">{rec.controllerPlatform}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-medium mb-1 text-[11px]">Sensors</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {rec.sensors.map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] bg-slate-100 dark:bg-slate-800 font-semibold">
                          {s}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-[10px] font-semibold">+2</Badge>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-medium mb-1 text-[11px]">Actuators</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {rec.actuators.map((a) => (
                        <Badge key={a} variant="secondary" className="text-[10px] font-semibold">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Gateway Type</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{rec.gatewayType}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Device Firmware</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-xs">{rec.deviceFirmwareVersion}</span>
                    </div>
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Hardware Readiness Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.hardwareScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* PANEL 3: Connectivity & Communication */}
            <Card id="connectivity" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RadioTower className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">3. Connectivity & Communication</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 text-xs font-mono font-bold">
                      MQTT Stream
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div>
                    <span className="text-muted-foreground block font-medium mb-1 text-[11px]">Communication Protocols</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {rec.communicationProtocols.map((p) => (
                        <Badge key={p} className="bg-blue-100 text-blue-800 dark:bg-blue-950 text-[10px] font-bold">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Network Tech</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{rec.networkTechnology}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Messaging Protocol</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{rec.messagingProtocol}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                      <span className="text-muted-foreground block font-medium text-[10px]">Cloud Connectivity</span>
                      <span className="font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                      </span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                      <span className="text-muted-foreground block font-medium text-[10px]">Edge Computing</span>
                      <span className="font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                      </span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                      <span className="text-muted-foreground block font-medium text-[10px]">Offline Sync</span>
                      <span className="font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                      </span>
                    </div>
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Connectivity Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.connectivityScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* PANEL 4: Device Management */}
            <Card id="device_mgmt" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">4. Device Management</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                      6 Controls
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs flex-1">
                  <div className="space-y-2">
                    {rec.deviceMgmtChecklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklist("deviceMgmt", item.id)}
                        className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
                              item.completed ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                            )}
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

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Device Management Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.deviceMgmtScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* PANEL 5: Data Collection & Analytics */}
            <Card id="data_analytics" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">5. Data Collection & Analytics</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                      Azure IoT Hub
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs flex-1">
                  <div className="space-y-2">
                    {rec.dataCollectionChecklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklist("dataCollection", item.id)}
                        className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
                              item.completed ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                            )}
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

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Data Storage Platform</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{rec.dataStoragePlatform}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Data Retention Policy</span>
                      <span className="font-mono text-blue-600 font-bold text-xs">{rec.dataRetentionPolicy}</span>
                    </div>
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Analytics Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.analyticsScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* PANEL 6: Security & Compliance */}
            <Card id="security" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">6. Security & Compliance</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-xs font-mono font-bold">
                      X.509 + TLS 1.3
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Device Identity</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">{rec.deviceIdentity}</span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Encryption Standard</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">{rec.encryptionStandard}</span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                      <div>
                        <span className="text-muted-foreground block font-medium text-[10px]">Secure Boot</span>
                        <span className="font-bold text-emerald-600">Yes</span>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>

                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Certificate Management</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{rec.certificateManagement}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-medium mb-1 text-[11px]">Compliance Standards</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {rec.complianceStandards.map((cs) => (
                        <Badge key={cs} variant="outline" className="text-[10px] bg-slate-100 dark:bg-slate-800 font-semibold">
                          {cs}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Vulnerability Assessment</span>
                      <span className="font-bold text-emerald-600">{rec.vulnerabilityAssessment}</span>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Security Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.securityScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* PANEL 7: Integration & Automation */}
            <Card id="integration" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Workflow className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">7. Integration & Automation</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                      6 Integrations
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs flex-1">
                  <div className="space-y-2">
                    {rec.integrationChecklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklist("integration", item.id)}
                        className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
                              item.completed ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                            )}
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

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Integration Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.integrationScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* PANEL 8: Deployment & Operations */}
            <Card id="deployment" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm font-bold">8. Deployment & Operations</CardTitle>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-xs font-semibold">
                      {rec.operationalStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Deployment Strategy</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{rec.deploymentStrategy}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Monitoring Platform</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{rec.monitoringPlatform}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Edge Deployment</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Cloud Deployment</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block font-medium text-[10px]">Alert Management</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{rec.alertManagement}</span>
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Deployment Readiness Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.deploymentScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>

          {/* ====================================================================
             5. AI IOT ASSESSMENT (Full Width)
             ==================================================================== */}
          <Card id="ai_assessment" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-sm font-bold">9. AI IoT Assessment</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 gap-1 border-purple-200 font-semibold text-xs">
                      <Sparkles className="h-3 w-3 text-purple-600" />
                      AI Agent Generated
                    </Badge>
                    <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                      AI Overall IoT Score: {rec.aiOverallIotScore}/100
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                    <span className="text-muted-foreground block text-[10px]">AI Connectivity Score</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">{rec.aiConnectivityScore}/100</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                    <span className="text-muted-foreground block text-[10px]">AI Security Assessment</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">{rec.aiSecurityAssessment}/100</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                    <span className="text-muted-foreground block text-[10px]">AI Performance Analysis</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">{rec.aiPerformanceAnalysis}/100</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                    <span className="text-muted-foreground block text-[10px]">AI Predictive Maintenance</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">{rec.aiPredictiveMaintenance}/100</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                    <span className="text-muted-foreground block text-[10px]">AI Device Health Review</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">{rec.aiDeviceHealthReview}/100</span>
                  </div>

                  <div className="p-3 rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 text-center space-y-1">
                    <span className="text-purple-900 dark:text-purple-300 block text-[10px]">AI Optimization Suggestions</span>
                    <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{rec.aiOptimizationSuggestions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* ====================================================================
             6. ATTACHMENTS (Full Width)
             ==================================================================== */}
          <Card id="attachments" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">10. Attachments</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">{rec.attachments.length} Files</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUploadDialog(true)}
                      className="gap-1 text-xs h-8 cursor-pointer"
                    >
                      <Upload className="h-3 w-3 text-blue-600" />
                      Upload Attachment
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {rec.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/80 group"
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
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedAttachment(att)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            triggerBrowserDownload(
                              att.name,
                              `=======================================================\nATTACHMENT: ${att.name}\nTYPE: ${att.type}\nSIZE: ${att.size}\nSECURITY HASH SHA-256: 7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c\nPROJECT: ${rec.iotProjectName} (${rec.iotDevelopmentId})\n=======================================================`
                            );
                            toast.success(`Downloaded ${att.name}`);
                          }}
                          className="p-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Download Attachment"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(att.id, att.name)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Attachment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px]">8 of 8 Architecture & Firmware Assets Verified</span>
                  <button
                    type="button"
                    onClick={() => setShowUploadDialog(true)}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 cursor-pointer text-xs"
                  >
                    View All Attachments ({rec.attachments.length}) <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>

          {/* ====================================================================
             7. REVIEW & APPROVAL (Full Width)
             ==================================================================== */}
          <Card id="section-review" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">11. Review & Approval</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold border-amber-200">
                      IoT Architecture Review Board
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddReviewerModal(true)}
                      className="gap-1 text-xs h-7 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Add Reviewer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-5 text-xs">
                {/* Executive Board Consensus Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-muted-foreground uppercase tracking-wider">
                      Board Evaluator Consensus (Click to Toggle)
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {rec.reviewers.filter((r) => r.decision === "Approved" || r.decision === "Approved with Conditions").length} of {rec.reviewers.length} Endorsed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {rec.reviewers.map((rev, i) => (
                      <div
                        key={i}
                        onClick={() => handleToggleReviewerDecision(i)}
                        className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between gap-1.5"
                        title="Click to cycle decision status"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-foreground text-xs truncate">{rev.name}</span>
                          <Badge
                            className={
                              rev.decision === "Approved"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 text-[9px] font-bold"
                                : rev.decision === "Approved with Conditions"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 text-[9px] font-bold"
                                : rev.decision === "Revision Required" || rev.decision === "Changes Requested"
                                ? "bg-red-100 text-red-800 dark:bg-red-950/60 text-[9px] font-bold"
                                : "bg-slate-200 text-slate-700 dark:bg-slate-800 text-[9px] font-medium"
                            }
                          >
                            {rev.decision}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="truncate">{rev.role}</span>
                          <span className="font-mono shrink-0">{rev.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sign-off Form */}
                <div className="rounded-lg border border-border/80 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-4">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Submit Review Decision</h4>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
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
                        className="h-8 w-full rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                      >
                        <option value="Approved">Approved (Production Deployment)</option>
                        <option value="Approved with Conditions">Approved with Conditions</option>
                        <option value="Revision Required">Revision Required</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="md:col-span-5">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
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

                    <div className="md:col-span-3 flex flex-col justify-between">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                          Approval Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.approvalDate || rec.approvalDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, approvalDate: e.target.value }))}
                          className="h-8 text-xs"
                        />
                      </div>
                      <Button
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-bold cursor-pointer"
                        onClick={() => {
                          const dec = formData.approvalDecision || rec.approvalDecision;
                          const com = formData.reviewComments || rec.reviewComments;
                          reviewMutation.mutate({
                            id: rec.id,
                            decision: dec,
                            comments: com,
                          });
                          // Also update board row locally
                          const updatedReviewers = rec.reviewers.map((r) =>
                            r.role === "Security Engineer"
                              ? { ...r, decision: dec, comments: com, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
                              : r
                          );
                          setLocalRecord({
                            ...rec,
                            reviewers: updatedReviewers,
                            workflowStatus: dec === "Approved" ? "Production" : "In Review",
                          });
                        }}
                        disabled={reviewMutation.isPending}
                      >
                        Authorize Production
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* ====================================================================
             8. SYSTEM INFORMATION (Full Width)
             ==================================================================== */}
          <Card id="system_info" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">12. System Information</CardTitle>
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
                      <span className="text-muted-foreground block font-medium text-[10px]">Created By</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.createdBy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Created Date</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{rec.createdDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Last Modified By</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.lastModifiedBy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Last Modified Date</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{rec.lastModifiedDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Workflow Stage</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{rec.workflowStageLabel}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Version</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{rec.solutionVersion}</span>
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
                      onClick={() => setShowFleetHistoryModal(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View History</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRevisionHistoryModal(true)}
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
      </div>

      {/* ===================================================================== */}
      {/* DIALOGS & MODALS */}
      {/* ===================================================================== */}

      {/* 1. Upload Dialog */}
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
          <form onSubmit={handleUploadSubmit} className="space-y-4 py-2 text-xs">
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
                <option value="Sensors">Sensor Calibration Matrix</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">File Name *</label>
              <Input
                placeholder="e.g. iot_device_security_v1.2.pdf"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Simulated Size</label>
              <Input
                value={uploadFileSize}
                onChange={(e) => setUploadFileSize(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowUploadDialog(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Upload File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Document Preview Modal */}
      <Dialog open={!!selectedAttachment} onOpenChange={(open) => !open && setSelectedAttachment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              {selectedAttachment?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedAttachment?.type} File • {selectedAttachment?.size} • Verified IoT Platform Asset
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Cryptographic Integrity Verified (SHA-256)
            </div>
            <div className="text-slate-300">File: {selectedAttachment?.name}</div>
            <div className="text-slate-400 text-[11px]">
              SHA-256: 7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a
            </div>
            <div className="text-slate-400 text-[11px]">Source: Magnertia EV Edge Gateway CA</div>
            <div className="text-slate-400 text-[11px]">Standard: IEC 62443 / ISO 27001 Certified</div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (selectedAttachment) {
                  triggerBrowserDownload(
                    selectedAttachment.name,
                    `=======================================================\nDOCUMENT: ${selectedAttachment.name}\nINTEGRITY SHA-256: 7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a\nSOURCE: Magnertia EV Edge Gateway CA\nPROJECT: ${rec.iotProjectName}\n=======================================================`
                  );
                  toast.success(`Downloading ${selectedAttachment.name}`);
                }
              }}
              className="gap-1 text-xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Download File
            </Button>
            <Button size="sm" onClick={() => setSelectedAttachment(null)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Device Dashboard Modal */}
      <Dialog open={showDeviceDashboardModal} onOpenChange={setShowDeviceDashboardModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              Connected Device Fleet Dashboard
            </DialogTitle>
            <DialogDescription>Real-time fleet telemetry and edge status overview</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-700 dark:text-emerald-300 font-bold text-lg block font-mono">1,240</span>
                <span className="text-[11px] text-muted-foreground">Active Nodes</span>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-blue-700 dark:text-blue-300 font-bold text-lg block font-mono">99.98%</span>
                <span className="text-[11px] text-muted-foreground">Uptime</span>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800">
                <span className="text-purple-700 dark:text-purple-300 font-bold text-lg block font-mono">v1.3.5</span>
                <span className="text-[11px] text-muted-foreground">Firmware</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
              <span className="font-semibold block">Fleet Telemetry Diagnostics</span>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                Active heartbeat intervals: 5000ms. Latency to AWS IoT Core: 24ms. Zero packet drops observed across 4G LTE cellular modules in the last 24 hours.
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success("Broadcasted ping to 1,240 edge nodes. 100% response rate!");
              }}
              className="gap-1 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Ping Fleet
            </Button>
            <Button size="sm" onClick={() => setShowDeviceDashboardModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Topology Modal */}
      <Dialog open={showTopologyModal} onOpenChange={setShowTopologyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RadioTower className="h-5 w-5 text-emerald-600" />
              Network & MQTT Broker Topology
            </DialogTitle>
            <DialogDescription>MQTT broker endpoints, QoS levels, and active topics</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50 font-mono space-y-1 text-[11px]">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold">Broker: mqtt.magnertia-ev.com (Port 8883)</div>
              <div className="text-muted-foreground">Security: TLS 1.3 / X.509 Mutual Authentication</div>
              <div className="text-muted-foreground">Active Topics:</div>
              <div className="pl-2 text-slate-700 dark:text-slate-300">• tele/evse/+/telemetry (QoS 1)</div>
              <div className="pl-2 text-slate-700 dark:text-slate-300">• cmd/evse/+/control (QoS 2)</div>
              <div className="pl-2 text-slate-700 dark:text-slate-300">• evt/evse/+/faults (QoS 2)</div>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Broker ping: 18ms latency. TLS handshake OK!")}
              className="cursor-pointer"
            >
              Test Broker Ping
            </Button>
            <Button size="sm" onClick={() => setShowTopologyModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Security Scan Modal */}
      <Dialog open={showSecurityScanModal} onOpenChange={setShowSecurityScanModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              IoT Security & X.509 Certificate Scan
            </DialogTitle>
            <DialogDescription>Hardware root of trust, crypto ciphers, and PKI audit</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <div className="p-2.5 rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>TLS 1.3 Encryption Validated across all edge nodes</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>AWS IoT CA Root Certificates Valid (Expires in 712 days)</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Secure Boot enabled on all 1,240 ESP32 chips</span>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Certificate audit finished: 0 vulnerabilities found!")}
              className="cursor-pointer"
            >
              Run Certificate Audit
            </Button>
            <Button size="sm" onClick={() => setShowSecurityScanModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Digital Twin Modal */}
      <Dialog open={showDigitalTwinModal} onOpenChange={setShowDigitalTwinModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Digital Twin Telemetry Model
            </DialogTitle>
            <DialogDescription>Real-time virtual representation synchronized via Azure Digital Twin</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg border bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 space-y-2">
              <div className="font-bold text-foreground">Twin ID: DT-EVSE-7KW-009</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Voltage: <span className="font-mono font-bold text-blue-600">230.4 V</span></div>
                <div>Current: <span className="font-mono font-bold text-blue-600">31.8 A</span></div>
                <div>Temp: <span className="font-mono font-bold text-amber-600">38.2 °C</span></div>
                <div>Health Score: <span className="font-mono font-bold text-emerald-600">98%</span></div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Digital Twin state refreshed from live stream!")}
              className="cursor-pointer"
            >
              Sync Digital Twin
            </Button>
            <Button size="sm" onClick={() => setShowDigitalTwinModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. Schedule OTA Update Modal */}
      <Dialog open={showOtaModal} onOpenChange={setShowOtaModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-amber-600" />
              Schedule OTA Firmware Rollout
            </DialogTitle>
            <DialogDescription>Distribute cryptographic signed firmware binaries over LTE</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Target Firmware Version</label>
              <Input defaultValue="1.3.6-rc2" className="h-8 text-xs font-mono" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Rollout Strategy</label>
              <select className="w-full h-8 rounded-md border px-3 text-xs bg-background">
                <option>Canary Deployment (10% fleet)</option>
                <option>Phased Rollout (50% fleet)</option>
                <option>Immediate Full Fleet Rollout</option>
              </select>
            </div>
            {isDeployingOta && (
              <div className="space-y-1 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Rolling out binary...</span>
                  <span>{otaProgress}%</span>
                </div>
                <Progress value={otaProgress} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button size="sm" variant="outline" onClick={() => setShowOtaModal(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
              onClick={handleStartOta}
              disabled={isDeployingOta}
            >
              {isDeployingOta ? "Deploying..." : "Deploy OTA Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Add Reviewer Modal */}
      <Dialog open={showAddReviewerModal} onOpenChange={setShowAddReviewerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              Add Review Board Member
            </DialogTitle>
            <DialogDescription>Invite an IoT specialist or firmware architect to sign off</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddReviewer} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Reviewer Full Name *</label>
              <Input
                value={newReviewerName}
                onChange={(e) => setNewReviewerName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="text-xs h-8"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Architecture Role *</label>
              <Input
                value={newReviewerRole}
                onChange={(e) => setNewReviewerRole(e.target.value)}
                placeholder="e.g. Senior Firmware Security Architect"
                className="text-xs h-8"
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button size="sm" type="button" variant="outline" onClick={() => setShowAddReviewerModal(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Add Reviewer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 9. Linked Entity Details Modal */}
      <Dialog open={!!linkedEntityModal} onOpenChange={(open) => !open && setLinkedEntityModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              {linkedEntityModal?.type} Entity
            </DialogTitle>
            <DialogDescription>Linked engineering cross-module reference details</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Entity Code</span>
              <span className="font-bold text-foreground font-mono text-sm block">{linkedEntityModal?.id}</span>
              <span className="text-muted-foreground block font-medium pt-1">{linkedEntityModal?.title}</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              This entity is coupled directly to the IoT device fleet configuration and MQTT telemetry streams. Bi-directional sync is maintained in production.
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button size="sm" variant="outline" onClick={() => setLinkedEntityModal(null)} className="cursor-pointer">
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (linkedEntityModal?.route) {
                  navigate({ to: linkedEntityModal.route as any });
                }
                setLinkedEntityModal(null);
              }}
              className="bg-primary text-white gap-1.5 cursor-pointer"
            >
              <span>Open Module</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 10. Audit Log Drawer */}
      <Dialog open={showAuditLogDrawer} onOpenChange={setShowAuditLogDrawer}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-blue-600" />
              IoT Audit Log
            </DialogTitle>
            <DialogDescription>Immutable audit events and telemetry checkpoints</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs max-h-96 overflow-y-auto">
            {rec.auditTrail.map((aud) => (
              <div key={aud.id} className="p-2.5 border-b border-border/60">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>{aud.action}</span>
                  <span className="text-muted-foreground font-normal">{aud.timestamp}</span>
                </div>
                <p className="text-muted-foreground mt-1">{aud.details}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">By {aud.user} ({aud.ipAddress})</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowAuditLogDrawer(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 11. Fleet History Modal */}
      <Dialog open={showFleetHistoryModal} onOpenChange={setShowFleetHistoryModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-blue-600" />
              Device Fleet Telemetry History
            </DialogTitle>
            <DialogDescription>Rolling 30-day connection and heartbeat log</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/40">
              <span className="font-bold block">18 Jun 2024 - Initial Provisioning</span>
              <span className="text-muted-foreground text-[11px]">1,240 ESP32 nodes enrolled with AWS IoT mutual TLS certs.</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/40">
              <span className="font-bold block">19 Jun 2024 - 4G LTE Gateway Handshake</span>
              <span className="text-muted-foreground text-[11px]">Cellular fallback tested. Mean latency 28ms across all regions.</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/40">
              <span className="font-bold block">20 Jun 2024 - Firmware v1.3.5 Verification</span>
              <span className="text-muted-foreground text-[11px]">Zero anomalous resets reported. Readiness score calculated at 91%.</span>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowFleetHistoryModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 12. Revision History Modal */}
      <Dialog open={showRevisionHistoryModal} onOpenChange={setShowRevisionHistoryModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-blue-600" />
              Configuration Revision History
            </DialogTitle>
            <DialogDescription>Tracked changes to broker, sensors, and firmware parameters</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/40">
              <span className="font-bold block">Rev 1.2.0 (Active)</span>
              <span className="text-muted-foreground text-[11px]">Upgraded MQTT ciphers to TLS 1.3. Added ISO 15118 EV handshake protocol.</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/40">
              <span className="font-bold block">Rev 1.1.0</span>
              <span className="text-muted-foreground text-[11px]">Added Modbus Energy Meter integration and Azure Digital Twin pipelines.</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800/40">
              <span className="font-bold block">Rev 1.0.0</span>
              <span className="text-muted-foreground text-[11px]">Base IoT project creation with ESP32 dual-core controller specs.</span>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowRevisionHistoryModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 13. Workflow Modal */}
      <Dialog open={showWorkflowModal} onOpenChange={setShowWorkflowModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-600" />
              IoT Connected-Device Workflow Engine (4 Stages)
            </DialogTitle>
            <DialogDescription>Advance or inspect lifecycle stage governance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3 text-xs">
            <div className="grid grid-cols-4 gap-2 text-center font-bold">
              {[
                { stage: 1, label: "1: Design" },
                { stage: 2, label: "2: Reg & Integrate" },
                { stage: 3, label: "3: Telemetry & AI" },
                { stage: 4, label: "4: Review & Prod" },
              ].map((s) => (
                <button
                  key={s.stage}
                  type="button"
                  onClick={() => advanceStageMutation.mutate(s.stage as any)}
                  className={cn(
                    "p-2.5 rounded-lg border transition-all cursor-pointer",
                    rec.workflowStage === s.stage
                      ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                      : "bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100"
                  )}
                >
                  <div>{s.label}</div>
                  <span className="text-[10px] font-normal opacity-80">
                    {rec.workflowStage === s.stage ? "Active Stage" : "Click to Switch"}
                  </span>
                </button>
              ))}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg leading-relaxed text-slate-700 dark:text-slate-300 space-y-1">
              <strong>Stage 4 Review Outcomes:</strong>
              <div>• <strong>Approved:</strong> Status set to Production & Live Monitoring active.</div>
              <div>• <strong>Approved with Conditions:</strong> Pending minor security recommendations.</div>
              <div>• <strong>Revision Required:</strong> Returned for device architecture redesign.</div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowWorkflowModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default IotPage;
