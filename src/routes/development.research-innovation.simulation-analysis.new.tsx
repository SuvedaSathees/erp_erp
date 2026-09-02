import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Activity,
  Box,
  Layers,
  Cpu,
  Play,
  Pause,
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
  Target,
  Zap,
  BarChart3,
  Check,
  X,
  ChevronDown,
  Filter,
  FileCheck,
  Share2,
  Printer,
  History as HistoryIcon,
  Info,
  Maximize2,
  FolderDown,
  LineChart,
  CheckCircle2,
  AlertTriangle,
  Server,
  Globe,
  Settings,
  TrendingUp,
  Sparkles,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Flame,
  Gauge,
  SlidersHorizontal,
  Scale,
  Thermometer,
  Compass,
  Paperclip,
  UserCheck,
  Trash2,
  Search,
} from "lucide-react";

import { simulationAnalysisService } from "@/services/simulationAnalysisService";
import type {
  SimulationRecord,
  SimulationFormInput,
  SimulationApprovalDecision,
  SimulationAttachment,
  SimulationReviewer,
  SimulationAuditEntry,
  SimulationStatus,
} from "@/services/types";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
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
import { AppShell } from "@/components/erp/AppShell";
import { cn } from "@/lib/utils";

/* ===========================================================================
   Helper: Browser File Download Generator
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
   Circular Score Gauge Component
   =========================================================================== */
function CircularScoreGauge({
  score,
  label = "OVERALL SCORE",
}: {
  score: number;
  label?: string;
}) {
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = "text-blue-600 stroke-blue-600 dark:text-blue-400 dark:stroke-blue-400";
  if (score < 60) scoreColor = "text-amber-500 stroke-amber-500";
  if (score < 40) scoreColor = "text-rose-500 stroke-rose-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-28 h-28 transform -rotate-90">
        <circle
          cx="56"
          cy="56"
          r="42"
          className="stroke-slate-100 dark:stroke-slate-800 fill-none"
          strokeWidth="8"
        />
        <circle
          cx="56"
          cy="56"
          r="42"
          className={cn(
            "fill-none transition-all duration-1000 ease-out",
            scoreColor,
          )}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
          {score}%
        </span>
      </div>
    </div>
  );
}

/* ===========================================================================
   Routes & Top-Level Route Exports
   =========================================================================== */
export const Route = createFileRoute(
  "/development/research-innovation/simulation-analysis/new",
)({
  head: () => ({
    meta: [{ title: "Simulation & Analysis · Magnertia ERP" }],
  }),
  component: SimulationAnalysisNewPage,
});

export function SimulationAnalysisFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <SimulationAnalysisNewPage {...props} />;
}

export function SimulationAnalysisPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <SimulationAnalysisNewPage {...props} />;
}

/* ===========================================================================
   Main Component: SimulationAnalysisNewPage
   =========================================================================== */
export function SimulationAnalysisNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();



  // Local state for interactive editing & instant updates
  const [localRecord, setLocalRecord] = useState<SimulationRecord | null>(null);

  // Modals & Interactive Overlays
  const [selectedAttachment, setSelectedAttachment] = useState<SimulationAttachment | null>(null);
  const [isRunSolverOpen, setIsRunSolverOpen] = useState(false);
  const [isCompareScenariosOpen, setIsCompareScenariosOpen] = useState(false);
  const [isDigitalTwinSyncOpen, setIsDigitalTwinSyncOpen] = useState(false);
  const [isMeshPreviewOpen, setIsMeshPreviewOpen] = useState(false);
  const [isStressPlotOpen, setIsStressPlotOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddReviewerOpen, setIsAddReviewerOpen] = useState(false);
  const [linkedEntityModal, setLinkedEntityModal] = useState<{
    type: string;
    id: string;
    title: string;
    route: string;
  } | null>(null);

  // Solver Simulation State
  const [isSolving, setIsSolving] = useState(false);
  const [solveProgress, setSolveProgress] = useState(0);
  const [solverProfile, setSolverProfile] = useState<"coupled" | "structural" | "thermal" | "modal">("coupled");
  const [solverLogs, setSolverLogs] = useState<string[]>([
    "Ready to initiate ANSYS Mechanical 2024 R1 FEA/CFD Solver.",
    "CAD STEP geometry verified: W-EVSE_Housing_v2.step (1,245,876 tetrahedral elements).",
  ]);

  // Upload Form Inputs
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Mesh Report");
  const [uploadUploader, setUploadUploader] = useState("Rahul Sharma");

  // Add Reviewer Form Inputs
  const [newReviewerRole, setNewReviewerRole] = useState("");
  const [newReviewerName, setNewReviewerName] = useState("");

  // Review & Approval State
  const [reviewDecision, setReviewDecision] =
    useState<SimulationApprovalDecision>("Approved with Conditions");
  const [reviewCommentInput, setReviewCommentInput] = useState(
    "Overall results are good. Please optimize the rib design near the mounting region.",
  );

  // Data Fetching via React Query
  const { data: serverRecord, isLoading } = useQuery<SimulationRecord>({
    queryKey: ["simulationAnalysisRecord"],
    queryFn: () => simulationAnalysisService.fetchRecord(),
  });

  // Keep local record synced with serverRecord initially
  React.useEffect(() => {
    if (serverRecord && !localRecord) {
      setLocalRecord(serverRecord);
    }
  }, [serverRecord, localRecord]);

  const record = localRecord || serverRecord;

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<SimulationFormInput>) =>
      simulationAnalysisService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["simulationAnalysisRecord"], updated);
      setLocalRecord(updated);
      toast.success("Draft saved successfully!", {
        description: "Simulation parameters, boundary conditions, and solver metadata updated.",
      });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", { description: err?.message || "An error occurred." });
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: () => simulationAnalysisService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["simulationAnalysisRecord"], updated);
      setLocalRecord(updated);
      toast.success("Submitted for Engineering Review!", {
        description: "Project moved to 'In Review' workflow stage. CAE review board notified.",
      });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: SimulationApprovalDecision;
      comments?: string;
    }) => simulationAnalysisService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["simulationAnalysisRecord"], updated);
      setLocalRecord(updated);
      toast.success(`Review decision saved: ${reviewDecision}`, {
        description: "CAE audit log and reviewer sign-off recorded.",
      });
    },
  });

  // Action: Save Draft Handler with Current Local State
  const handleSaveDraft = () => {
    if (!record) return;
    saveDraftMutation.mutate({
      simulationProjectName: record.simulationProjectName,
      simulationPurpose: record.simulationPurpose,
      simulationType: record.simulationType,
      engineeringDomain: record.engineeringDomain,
      projectPriority: record.projectPriority,
      workflowStatus: record.workflowStatus,
    });
  };

  // Action: Workflow Status Direct Update
  const handleStatusChange = (newStatus: SimulationStatus) => {
    if (!record) return;
    const updated = {
      ...record,
      workflowStatus: newStatus,
      lastModified: new Date().toISOString(),
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["simulationAnalysisRecord"], updated);
    toast.success(`Status updated to '${newStatus}'`);
  };

  // Solver Execution Action
  const handleStartSolver = () => {
    setIsSolving(true);
    setSolveProgress(0);
    setSolverLogs([
      "Initializing ANSYS Mechanical 2024 R1 FEA Solver...",
      "Allocating 32 GPU compute cores for sparse direct matrix acceleration...",
      "Loading CAD mesh W-EVSE_Housing_v2.step (1,245,876 elements)...",
      "Applying thermal-structural boundary conditions (Fixed Support Base, 45 °C ambient, 25 W/m²K)...",
    ]);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setSolveProgress(current);
      setSolverLogs((prev) => [
        ...prev,
        `Iterative Non-Linear Step ${current / 20}: Energy convergence 1e-6 reached... (GPU load: 94%)`,
      ]);

      if (current >= 100) {
        clearInterval(interval);
        setIsSolving(false);
        setSolverLogs((prev) => [
          ...prev,
          "Simulation completed successfully! Max Stress: 78.6 MPa, Max Temp: 78.4 °C, Max Displacement: 0.42 mm.",
          "Results validated with 96.3% prototype correlation against physical telemetry.",
        ]);
        if (record) {
          const updated = {
            ...record,
            configurationScore: 95,
            validationScore: 94,
            overallSimulationScore: 92,
            resultsConfig: {
              ...record.resultsConfig,
              maxStressVonMises: "78.6 MPa",
              maxTemperature: "78.4 °C",
              maxDisplacement: "0.42 mm",
              correlationWithPrototype: "96.3%",
              validationScore: 94,
            },
          };
          setLocalRecord(updated);
          queryClient.setQueryData(["simulationAnalysisRecord"], updated);
        }
        toast.success("ANSYS Multi-Physics Simulation Completed!", {
          description: "Results updated with 96.3% prototype correlation. Scores updated.",
        });
      }
    }, 400);
  };

  // Action: Add New Simulation Attachment
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) {
      toast.error("Please provide a file name");
      return;
    }
    const newAtt: SimulationAttachment = {
      id: `att-${Date.now()}`,
      name: uploadName.includes(".") ? uploadName : `${uploadName}.pdf`,
      size: "3.4 MB",
      type: uploadName.endsWith(".step") || uploadName.endsWith(".zip") ? "CAD" : "PDF",
      uploadedBy: uploadUploader || "Rahul Sharma",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      url: "#",
    };

    if (record) {
      const updated = {
        ...record,
        attachments: [newAtt, ...record.attachments],
      };
      setLocalRecord(updated);
      queryClient.setQueryData(["simulationAnalysisRecord"], updated);
    }

    setIsUploadOpen(false);
    setUploadName("");
    toast.success(`Uploaded ${newAtt.name} successfully!`, {
      description: "Added to Engineering Simulation Attachments.",
    });
  };

  // Action: Delete Attachment
  const handleDeleteAttachment = (id: string, name: string) => {
    if (!record) return;
    const updated = {
      ...record,
      attachments: record.attachments.filter((a) => a.id !== id),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["simulationAnalysisRecord"], updated);
    toast.success(`Removed attachment: ${name}`);
  };

  // Action: Add Reviewer to Board
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerRole.trim()) {
      toast.error("Please enter reviewer name and role");
      return;
    }
    const newRev: SimulationReviewer = {
      role: newReviewerRole,
      person: newReviewerName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      decision: "Pending",
      date: "-",
      comments: "Pending review",
    };

    if (record) {
      const updated = {
        ...record,
        reviewers: [...record.reviewers, newRev],
      };
      setLocalRecord(updated);
      queryClient.setQueryData(["simulationAnalysisRecord"], updated);
    }

    setIsAddReviewerOpen(false);
    setNewReviewerName("");
    setNewReviewerRole("");
    toast.success(`Added ${newRev.person} to CAE Review Board`);
  };

  // Action: Toggle Reviewer Decision directly
  const handleToggleReviewerDecision = (index: number) => {
    if (!record) return;
    const decisions: SimulationApprovalDecision[] = ["Approved", "Approved with Conditions", "Revision Required", "Rejected"];
    const current = record.reviewers[index]?.decision || "Pending";
    const nextIdx = (decisions.indexOf(current as SimulationApprovalDecision) + 1) % decisions.length;
    const nextDecision = decisions[nextIdx];
    const updatedReviewers = [...record.reviewers];
    updatedReviewers[index] = {
      ...updatedReviewers[index],
      decision: nextDecision,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated = { ...record, reviewers: updatedReviewers };
    setLocalRecord(updated);
    queryClient.setQueryData(["simulationAnalysisRecord"], updated);
    toast.success(`Updated ${updatedReviewers[index].person}'s decision to ${nextDecision}`);
  };

  // Action: Export Full Dossier (.TXT)
  const handleExportDossier = () => {
    if (!record) return;
    const content = `====================================================================
CAE MULTI-PHYSICS SIMULATION & ANALYSIS SPECIFICATION DOSSIER
====================================================================
Project Name: ${record.simulationProjectName}
Version: ${record.simulationVersion}
Simulation ID: ${record.simulationId}
Form Code: ${record.formCode}
Workflow Status: ${record.workflowStatus}
Simulation Engineer: ${record.simulationEngineerName}
Date Exported: ${new Date().toISOString()}

1. EXECUTIVE OVERALL CAE SCORES
--------------------------------------------------------------------
Overall CAE Score: ${record.overallSimulationScore}%
1. Model Preparation Score: ${record.modelReadinessScore}%
2. Simulation Configuration: ${record.configurationScore}%
3. Validation Score: ${record.validationScore}%
4. Topology Optimization: ${record.optimizationScore}%

2. MODEL PREPARATION & MESH METRICS
--------------------------------------------------------------------
CAD Model: ${record.modelPrepConfig.cadModel}
Material: ${record.modelPrepConfig.materialLibrary}
Mesh Strategy: ${record.modelPrepConfig.meshStrategy}
Total Mesh Elements: ${record.modelPrepConfig.totalElements}
Mesh Quality: ${record.modelPrepConfig.meshQuality}

3. SOLVER CONFIGURATION & COMPUTING PLATFORM
--------------------------------------------------------------------
Solver Type: ${record.configurationConfig.solverType}
Solver Version: ${record.configurationConfig.solverVersion}
Convergence Criteria: ${record.configurationConfig.convergenceCriteria}
Computing Platform: ${record.configurationConfig.computingPlatform}

4. RESULTS & PHYSICAL PROTOTYPE VALIDATION
--------------------------------------------------------------------
Max Von-Mises Stress: ${record.resultsConfig.maxStressVonMises}
Max Temperature: ${record.resultsConfig.maxTemperature}
Max Displacement: ${record.resultsConfig.maxDisplacement}
Prototype Correlation: ${record.resultsConfig.correlationWithPrototype}
Factor of Safety (FoS): 2.35 (Target > 2.0)

5. TOPOLOGY OPTIMIZATION
--------------------------------------------------------------------
Weight Reduction: -${record.optimizationConfig.weightReductionPct}%
Performance Improvement: +${record.optimizationConfig.performanceImprovementPct}%
Cost Optimization: -${record.optimizationConfig.costOptimizationPct}%

6. SIMULATION ATTACHMENTS (${record.attachments.length} Files)
--------------------------------------------------------------------
${record.attachments.map((a, i) => `${i + 1}. ${a.name} (${a.size}) - Uploaded by ${a.uploadedBy} on ${a.date}`).join("\n")}

7. REVIEW BOARD DECISIONS
--------------------------------------------------------------------
${record.reviewers.map((r, i) => `${i + 1}. [${r.decision}] ${r.role} - ${r.person}: ${r.comments} (${r.date})`).join("\n")}
====================================================================`;

    triggerBrowserDownload(
      `${record.simulationId}_simulation_dossier.txt`,
      content,
      "text/plain;charset=utf-8"
    );
    toast.success("Simulation dossier downloaded successfully!");
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="Simulation & Analysis"
        breadcrumb={breadcrumb ?? "Development > Research & Innovation > Simulation & Analysis"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading Simulation & Analysis Module...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Simulation & Analysis"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Simulation & Analysis"}
      description="Execute multi-physics FEA/CFD CAE simulations, structural mesh validation, and thermal analyses."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="space-y-4 pb-16">
        {/* ====================================================================
           1. TOP RECORD HEADER BAR: Title, Version, Interactive Status & Actions
           ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 border-b border-border/80 px-4 sm:px-6 py-4 space-y-3 shadow-2xs">
          {/* Row 1: Title, Version, Status Dropdown & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {record.simulationProjectName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-semibold px-2.5 py-0.5"
                >
                  {record.simulationVersion}
                </Badge>

                {/* Interactive Workflow Status Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-primary",
                        record.workflowStatus === "Approved"
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : record.workflowStatus === "In Review"
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      <Workflow className="h-3 w-3" />
                      <span>{record.workflowStatus}</span>
                      <ChevronDown className="h-3 w-3 opacity-80" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => handleStatusChange("In Progress")} className="cursor-pointer">
                      <Clock className="mr-2 h-3.5 w-3.5 text-blue-500" /> In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("In Review")} className="cursor-pointer">
                      <Eye className="mr-2 h-3.5 w-3.5 text-amber-500" /> In Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("Approved")} className="cursor-pointer">
                      <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("Revision Required")} className="cursor-pointer">
                      <AlertTriangle className="mr-2 h-3.5 w-3.5 text-rose-500" /> Revision Required
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 h-9 text-xs font-medium cursor-pointer border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Save className="h-3.5 w-3.5 text-slate-500" />
                Save Draft
              </Button>

              {record.workflowStatus === "In Review" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="h-9 px-3.5 text-xs font-semibold gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:border-amber-500/50 shadow-2xs transition-all cursor-pointer"
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
                        toast.success("Expedited review reminder dispatched to CAE Review Board.");
                      }}
                      className="cursor-pointer"
                    >
                      <Send className="mr-2 h-4 w-4 text-primary" /> Send Review Reminder
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setLocalRecord((prev) => (prev ? { ...prev, workflowStatus: "In Progress" } : prev));
                        toast.info("Status reverted to In Progress. You can now modify simulation parameters.");
                      }}
                      className="cursor-pointer text-amber-600 dark:text-amber-400"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" /> Revert Status to In Progress
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : record.workflowStatus === "Approved" ? (
                <Badge className="h-9 px-3 text-xs font-semibold gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  {record.workflowStatus}
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => submitForReviewMutation.mutate()}
                  disabled={submitForReviewMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-2xs h-9 text-xs font-medium cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitForReviewMutation.isPending ? "Submitting..." : "Submit for Review"}
                </Button>
              )}

              <Button
                size="sm"
                onClick={() => document.getElementById("section-review")?.scrollIntoView({ behavior: "smooth" })}
                className="h-9 px-3.5 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Review Decision
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300 dark:border-slate-700 cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setIsRunSolverOpen(true)} className="cursor-pointer">
                    <Play className="h-4 w-4 mr-2 text-blue-600" />
                    Run ANSYS Solver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsMeshPreviewOpen(true)} className="cursor-pointer">
                    <Box className="h-4 w-4 mr-2 text-emerald-600" />
                    Inspect 3D Mesh
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsStressPlotOpen(true)} className="cursor-pointer">
                    <BarChart3 className="h-4 w-4 mr-2 text-amber-500" />
                    View FEA Stress Plot
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsCompareScenariosOpen(true)} className="cursor-pointer">
                    <SlidersHorizontal className="h-4 w-4 mr-2 text-purple-600" />
                    Compare Scenarios
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDigitalTwinSyncOpen(true)} className="cursor-pointer">
                    <Globe className="h-4 w-4 mr-2 text-teal-600" />
                    Sync Digital Twin
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                    <Download className="h-4 w-4 mr-2 text-primary" />
                    Export Dossier (.TXT)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.print()} className="cursor-pointer">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Specification
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Project URL copied to clipboard!");
                    }}
                    className="cursor-pointer"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Row 2: Secondary Metadata & FUNCTIONAL Linked Entity Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Simulation ID
                </span>
                <span className="font-bold font-mono text-foreground">
                  {record.simulationId}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Form Code
                </span>
                <span className="font-semibold font-mono text-foreground">
                  {record.formCode}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked Product
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Product Portfolio",
                      id: record.linkedProductId || "Autonomous W-EVSE",
                      title: "Autonomous W-EVSE High-Power Station",
                      route: "/development/product-development",
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedProductId || "Autonomous W-EVSE"}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Mechanical Design
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Mechanical Design",
                      id: record.linkedMechanicalDevId,
                      title: "W-EVSE Structural Enclosure & Heatsink CAD",
                      route: "/development/research-innovation/mechanical-design/new",
                    })
                  }
                  className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedMechanicalDevId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Electrical Design
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Electrical Design",
                      id: record.linkedElectricalDevId,
                      title: "High-Voltage Power Electronics Schematics",
                      route: "/development/research-innovation/electrical-design/new",
                    })
                  }
                  className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedElectricalDevId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Electronics Design
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Electronics Design",
                      id: record.linkedElectronicsDevId,
                      title: "Microcontroller & Thermal Sensor Board",
                      route: "/development/research-innovation/electronics-design/new",
                    })
                  }
                  className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedElectronicsDevId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                Simulation Engineer:
              </span>
              <span className="font-semibold text-foreground">
                {record.simulationEngineerName}
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           3. EXECUTIVE OVERALL SIMULATION SCORE & CAE LIFECYCLE STRIP
           ==================================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col xl:flex-row items-center justify-between gap-6">
              {/* Overall Score Gauge */}
              <div className="flex items-center gap-5 shrink-0">
                <CircularScoreGauge score={record.overallSimulationScore} label="Overall Score" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">CAE Engineering Simulation Lifecycle</span>
                    <Badge className="bg-blue-600 text-white text-[10px] font-semibold">Stage 2: Engineering Simulation</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-md">
                    Multi-physics coupled structural and thermal FEA/CFD simulation with HPC GPU acceleration and prototype correlation.
                  </p>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 pt-0.5">
                    <Target className="h-3.5 w-3.5" />
                    <span>Total Score: {record.overallSimulationScore}% (91% Avg across 4 CAE Stages)</span>
                  </div>
                </div>
              </div>

              {/* 4 Component Metrics with Progress Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto xl:min-w-[560px]">
                <div
                  onClick={() => document.getElementById("section-model-prep")?.scrollIntoView({ behavior: "smooth" })}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-[11px] text-muted-foreground block font-medium">1. Model Prep</span>
                  <span className="text-sm font-bold text-foreground font-mono">{record.modelReadinessScore}%</span>
                  <Progress value={record.modelReadinessScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("section-configuration")?.scrollIntoView({ behavior: "smooth" })}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-[11px] text-muted-foreground block font-medium">2. Simulation</span>
                  <span className="text-sm font-bold text-foreground font-mono">{record.configurationScore}%</span>
                  <Progress value={record.configurationScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("section-results")?.scrollIntoView({ behavior: "smooth" })}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-[11px] text-muted-foreground block font-medium">3. Validation</span>
                  <span className="text-sm font-bold text-foreground font-mono">{record.validationScore}%</span>
                  <Progress value={record.validationScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("section-optimization")?.scrollIntoView({ behavior: "smooth" })}
                  className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-[11px] text-muted-foreground block font-medium">4. Optimization</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{record.optimizationScore}%</span>
                  <Progress value={record.optimizationScore} className="h-1.5" />
                </div>
              </div>
            </div>
          </Card>

          {/* ====================================================================
             4. BALANCED WORKSPACE SECTIONS GRID
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Simulation Overview */}
            <Card id="section-overview" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">1. Simulation Overview & Objectives</CardTitle>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-semibold text-xs border border-red-200">
                    Priority: {record.projectPriority}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                      Simulation Purpose
                    </span>
                    <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 font-medium text-foreground leading-relaxed">
                      {record.simulationPurpose}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-[10px] text-muted-foreground block font-medium">Simulation Type</span>
                      <span className="font-semibold text-foreground text-xs">{record.simulationType}</span>
                    </div>

                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-[10px] text-muted-foreground block font-medium">Engineering Domain</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.engineeringDomain}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Card 2: Model Preparation & Mesh Quality */}
            <Card id="section-model-prep" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">2. Model Preparation & Mesh Quality</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                      {record.modelPrepConfig.meshQuality}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setIsMeshPreviewOpen(true)} className="gap-1 text-xs h-7 cursor-pointer">
                      <Eye className="h-3 w-3" />
                      3D Mesh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">CAD Geometry</span>
                      <span className="font-semibold text-foreground text-xs truncate block" title={record.modelPrepConfig.cadModel}>
                        {record.modelPrepConfig.cadModel}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Material Assigned</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs truncate block">
                        {record.modelPrepConfig.materialLibrary}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Mesh Strategy</span>
                      <span className="font-semibold text-foreground text-xs">{record.modelPrepConfig.meshStrategy}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Total Elements</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs font-mono">
                        {record.modelPrepConfig.totalElements}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Geometry Simplification & Defeaturing</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      CAD enclosure STEP model imported with small fillets suppressed. High aspect ratio elements under 1.5% with Jacobian index of 0.94.
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Card 3: Boundary Conditions & Constraints */}
            <Card id="section-boundary-conditions" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">3. Boundary Conditions & Constraints</CardTitle>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono text-xs font-semibold">
                    Score: {record.boundaryConditionsConfig.boundaryConditionScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Applied Load Conditions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {record.boundaryConditionsConfig.loadConditions.map((cond, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold text-xs py-0.5 px-2.5">
                          <Check className="h-3 w-3 mr-1 inline" /> {cond}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Constraints</span>
                      <span className="font-semibold text-foreground text-xs">{record.boundaryConditionsConfig.constraints}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Environment</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.boundaryConditionsConfig.environmentalConditions}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Operating Scenario</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.boundaryConditionsConfig.operatingScenario}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Card 4: Simulation Configuration & Solver Setup */}
            <Card id="section-configuration" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">4. Simulation Configuration & Solver</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                      Config: {record.configurationConfig.configurationScore}/100
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setIsRunSolverOpen(true)} className="gap-1 text-xs h-7 cursor-pointer">
                      <Play className="h-3 w-3" />
                      Run Solver
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Solver Type</span>
                      <span className="font-semibold text-foreground text-xs">{record.configurationConfig.solverType}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Version</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.configurationConfig.solverVersion}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Convergence</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs font-mono">{record.configurationConfig.convergenceCriteria}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Platform</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.configurationConfig.computingPlatform}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Non-Linear Convergence & GPU Memory Offloading</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Coupled ANSYS transient thermal-structural solver utilizing sparse matrix direct solver with 32 GPU compute cores for 4.2x acceleration.
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Card 5: Engineering Analysis Categories */}
            <Card id="section-analysis" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">5. Engineering Analysis Categories</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                    Score: {record.analysisCategoriesConfig.analysisCompletionScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-2 text-xs flex-1">
                  {[
                    { name: "Structural Analysis (FEA)", status: record.analysisCategoriesConfig.structuralAnalysisStatus },
                    { name: "Thermal Analysis (Transient)", status: record.analysisCategoriesConfig.thermalAnalysisStatus },
                    { name: "CFD Fluid Dynamics", status: record.analysisCategoriesConfig.cfdAnalysisStatus },
                    { name: "Electromagnetic Analysis", status: record.analysisCategoriesConfig.electromagneticAnalysisStatus },
                    { name: "Dynamic & Modal Analysis", status: record.analysisCategoriesConfig.dynamicAnalysisStatus },
                    { name: "Multi-Physics Coupled Analysis", status: record.analysisCategoriesConfig.multiPhysicsAnalysisStatus },
                  ].map((item, idx) => (
                    <div key={idx} className="p-2 rounded border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between">
                      <span className="font-medium text-foreground text-xs">{item.name}</span>
                      <Badge
                        className={
                          item.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-medium"
                        }
                      >
                        {item.status === "Completed" && <Check className="h-3 w-3 mr-1 inline" />}
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

            {/* Card 6: Results & Prototype Validation */}
            <Card id="section-results" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">6. Results & Prototype Validation</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                      Validation: {record.resultsConfig.validationScore}/100
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setIsStressPlotOpen(true)} className="gap-1 text-xs h-7 cursor-pointer">
                      <BarChart3 className="h-3 w-3" />
                      FEA Stress Plot
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Max Von-Mises</span>
                      <span className="font-semibold text-foreground text-xs font-mono">{record.resultsConfig.maxStressVonMises}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Max Temp</span>
                      <span className="font-semibold text-amber-600 text-xs font-mono">{record.resultsConfig.maxTemperature}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Max Displacement</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs font-mono">{record.resultsConfig.maxDisplacement}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Prototype Correlation</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs font-mono">{record.resultsConfig.correlationWithPrototype}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Physical Test Rig Correlation & Factor of Safety</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Physical sensor telemetry confirmed 96.3% thermal correlation with ANSYS models. Minimum structural Factor of Safety (FoS) is 2.35 at peak wind gust and cable tension loads.
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Card 7: Design & Topology Optimization Study */}
            <Card id="section-optimization" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">7. Design & Topology Optimization</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                    Opt Score: {record.optimizationConfig.optimizationScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-center">
                      <span className="text-muted-foreground block text-[10px]">Weight Reduction</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                        -{record.optimizationConfig.weightReductionPct}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-blue-200/70 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-center">
                      <span className="text-muted-foreground block text-[10px]">Performance Impr.</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-sm font-mono">
                        +{record.optimizationConfig.performanceImprovementPct}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-purple-200/70 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 text-center">
                      <span className="text-muted-foreground block text-[10px]">Cost Optimization</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400 text-sm font-mono">
                        -{record.optimizationConfig.costOptimizationPct}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Optimization Iteration Progression (Weight vs Max Temp)
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      {record.optimizationConfig.iterationsData.map((iter, idx) => (
                        <div key={idx} className="p-2 rounded border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                          <span className="font-bold text-foreground text-[10px] block">{iter.iteration}</span>
                          <span className="text-[10px] text-blue-600 font-mono block">{iter.weightKg} kg</span>
                          <span className="text-[10px] text-amber-600 font-mono block">{iter.maxTempC} °C</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Card 8: AI Engineering Assessment & Advisory */}
            <Card id="section-ai-assessment" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-sm font-bold">8. AI Engineering Assessment & Advisory</CardTitle>
                  </div>
                  <Badge className="bg-purple-600 text-white font-mono text-xs font-semibold">
                    AI Score: {record.aiEngineeringScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="p-3 rounded-lg border border-purple-200/70 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-purple-900 dark:text-purple-200 text-xs">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span>AI Simulation Copilot Insight</span>
                    </div>
                    <p className="text-purple-800 dark:text-purple-300 text-[11px] leading-relaxed">
                      {record.aiAssessment.aiSimulationReview} {record.aiAssessment.aiThermalInsights || "Thermal margin is sufficient (18.6 °C)."}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">AI Design Validation & Structural Recommendations</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {record.aiAssessment.aiDesignValidation} Recommend adding 1.2mm ribs near mounting brackets to further distribute von Mises peak load.
                    </p>
                  </div>
                </CardContent>
              </Card>
          </div>

          {/* ====================================================================
             5. ENGINEERING SIMULATION ATTACHMENTS (Full Width)
             ==================================================================== */}
          <Card id="section-attachments" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">9. Engineering Simulation Attachments</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">{record.attachments.length} Files</Badge>
                  <Button size="sm" variant="outline" onClick={() => setIsUploadOpen(true)} className="gap-1 text-xs h-7 cursor-pointer">
                    <Upload className="h-3 w-3" />
                    Upload File
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {record.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileCode className="h-4 w-4 text-blue-500 shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold text-foreground block truncate" title={att.name}>{att.name}</span>
                          <span className="text-[10px] text-muted-foreground">{att.size} • {att.uploadedBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer hover:text-blue-600"
                          onClick={() => setSelectedAttachment(att)}
                          title="Preview Document"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer hover:text-emerald-600"
                          onClick={() => {
                            triggerBrowserDownload(
                              att.name,
                              `=======================================================\nDOCUMENT: ${att.name}\nCATEGORY: CAE Simulation & FEA Structural Output\nUPLOADED BY: ${att.uploadedBy}\nINTEGRITY SHA-256: 7d14ac28b94f509e25ca671c890aef43\nSTATUS: Validated & Verified\nPROJECT: ${record.simulationProjectName}\n=======================================================`
                            );
                            toast.success(`Downloaded ${att.name}`);
                          }}
                          title="Download File"
                        >
                          <Download className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer hover:text-red-600"
                          onClick={() => handleDeleteAttachment(att.id, att.name)}
                          title="Delete File"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          {/* ====================================================================
             6. REVIEW & APPROVAL BOARD TIMELINE & SIGN-OFF (Full Width)
             ==================================================================== */}
          <Card id="section-review" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">10. Review & Approval Board Timeline</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold border-amber-200">
                    CAE Review Board
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddReviewerOpen(true)}
                    className="gap-1 text-xs h-7 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Add Reviewer
                  </Button>
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
                      {record.reviewers.filter((r) => r.decision === "Approved" || r.decision === "Approved with Conditions").length} of {record.reviewers.length} Endorsed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {record.reviewers.map((rev, i) => (
                      <div
                        key={i}
                        onClick={() => handleToggleReviewerDecision(i)}
                        className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between gap-1.5"
                        title="Click to cycle decision status"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-foreground text-xs truncate">{rev.person}</span>
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
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                    Submit Review Decision
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">
                        Approval Decision <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={reviewDecision}
                        onChange={(e) => setReviewDecision(e.target.value as SimulationApprovalDecision)}
                        className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                      >
                        <option value="Approved">Approved (Production Ready)</option>
                        <option value="Approved with Conditions">Approved with Conditions</option>
                        <option value="Revision Required">Revision Required</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">
                        Review Comments
                      </label>
                      <Textarea
                        rows={2}
                        value={reviewCommentInput}
                        onChange={(e) => setReviewCommentInput(e.target.value)}
                        placeholder="Add engineering remarks..."
                        className="text-xs resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      onClick={() => {
                        reviewDecisionMutation.mutate({
                          id: record.id,
                          decision: reviewDecision,
                          comments: reviewCommentInput,
                        });
                        // Also update review board rows locally
                        const updatedReviewers = record.reviewers.map((r) =>
                          r.role === "Simulation Engineer"
                            ? { ...r, decision: reviewDecision, comments: reviewCommentInput, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
                            : r
                        );
                        setLocalRecord({
                          ...record,
                          reviewers: updatedReviewers,
                        });
                      }}
                      disabled={reviewDecisionMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 h-8 font-bold text-xs cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Save Decision
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* ====================================================================
             7. AUDIT TRAIL LOG / SYSTEM INFO (Full Width)
             ==================================================================== */}
          <Card id="section-system-info" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
            <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm font-bold">11. Audit Trail & Verification Logs</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-mono">Immutable Log</Badge>
            </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="font-semibold text-foreground">ANSYS Transient Thermal-Structural FEA Solver Solved</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">20 Jun 2024, 03:45 PM • Rahul Sharma</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-foreground">CAD STEP Enclosure Mesh Generated (1.24M Tetrahedral Elements)</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">19 Jun 2024, 11:20 AM • Vikram Singh</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold text-foreground">Topology Optimization Iteration 5 Completed (-8.7% Housing Mass)</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">18 Jun 2024, 05:10 PM • Rohit Nair</span>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* =========================================================================
            8. INTERACTIVE DIALOGS & MODALS
            ========================================================================= */}

        {/* 1. Live Solver Modal */}
        <Dialog open={isRunSolverOpen} onOpenChange={setIsRunSolverOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" />
                Live ANSYS FEA/CFD Solver Console
              </DialogTitle>
              <DialogDescription>
                High-Performance Computing Cluster (32 GPU Cores Acceleration)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="flex gap-2">
                {(["coupled", "structural", "thermal", "modal"] as const).map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={solverProfile === p ? "default" : "outline"}
                    onClick={() => setSolverProfile(p)}
                    className="text-xs h-7 capitalize cursor-pointer"
                  >
                    {p === "coupled" ? "Coupled Thermal-Structural" : `${p} Analysis`}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Iteration Progress ({solveProgress}%)</span>
                  <span className="font-mono text-blue-600">{solveProgress}%</span>
                </div>
                <Progress value={solveProgress} className="h-2" />
              </div>

              <div className="h-40 rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-1 border border-slate-800">
                {solverLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={handleStartSolver}
                disabled={isSolving}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer"
              >
                <Play className="h-4 w-4" />
                {isSolving ? "Solving FEA..." : "Start FEA Solver"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 2. 3D Mesh Inspection Modal */}
        <Dialog open={isMeshPreviewOpen} onOpenChange={setIsMeshPreviewOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-blue-600" />
                3D CAD Mesh Inspection & Jacobian Quality
              </DialogTitle>
              <DialogDescription>
                Tetrahedral mesh diagnostics for {record.modelPrepConfig.cadModel}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-muted-foreground block text-[10px]">Total Elements</span>
                  <span className="font-bold text-foreground font-mono">{record.modelPrepConfig.totalElements}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-muted-foreground block text-[10px]">Jacobian Index</span>
                  <span className="font-bold text-emerald-600 font-mono">0.94 (Excellent)</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-muted-foreground block text-[10px]">Aspect Ratio &lt; 3</span>
                  <span className="font-bold text-emerald-600 font-mono">98.5% Elements</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-muted-foreground block text-[10px]">Material</span>
                  <span className="font-bold text-blue-600 truncate block">{record.modelPrepConfig.materialLibrary}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs space-y-1 border border-slate-800">
                <div className="text-emerald-400 font-bold">[MESH] Strategy: Second-Order Quadratic Tetrahedral</div>
                <div>[GEOM] Bounding Box: 420mm x 280mm x 150mm</div>
                <div>[DEFEATURING] Minor fillets &lt; 0.5mm suppressed for clean convergence</div>
                <div>[STATUS] Ready for ANSYS Sparse Matrix Solver</div>
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  triggerBrowserDownload("mesh_diagnostics_report.json", JSON.stringify(record.modelPrepConfig, null, 2), "application/json");
                  toast.success("Downloaded mesh_diagnostics_report.json");
                }}
                className="gap-1 text-xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Export Diagnostics
              </Button>
              <Button size="sm" onClick={() => setIsMeshPreviewOpen(false)} className="cursor-pointer">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3. FEA Stress Plot Modal */}
        <Dialog open={isStressPlotOpen} onOpenChange={setIsStressPlotOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                FEA Von-Mises Stress & Thermal Gradient Contours
              </DialogTitle>
              <DialogDescription>
                Post-processed results for load case: Continuous Max Load (100A, 45 °C Ambient)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-muted-foreground block text-[10px]">Peak Von-Mises</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.resultsConfig.maxStressVonMises}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-muted-foreground block text-[10px]">Max Temperature</span>
                  <span className="font-bold text-amber-600 text-sm font-mono">{record.resultsConfig.maxTemperature}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-muted-foreground block text-[10px]">Max Displacement</span>
                  <span className="font-bold text-blue-600 text-sm font-mono">{record.resultsConfig.maxDisplacement}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <span className="text-muted-foreground block text-[10px]">Factor of Safety</span>
                  <span className="font-bold text-emerald-600 text-sm font-mono">2.35 (Safe)</span>
                </div>
              </div>

              {/* Stress distribution visual mockup */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-900/30 via-emerald-900/20 to-amber-900/30 space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-blue-400">0.0 MPa (Neutral)</span>
                  <span className="text-emerald-400">35.0 MPa (Nominal)</span>
                  <span className="text-amber-400">78.6 MPa (Peak Bracket)</span>
                  <span className="text-rose-400">276 MPa (Yield Strength Al 6061-T6)</span>
                </div>
                <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 via-amber-500 to-rose-500 opacity-90" />
                <p className="text-[11px] text-muted-foreground pt-1">
                  Critical stress concentration localized at lower mounting flange. Structural margin exceeds standard automotive safety margin (2.35 FoS vs 2.0 required).
                </p>
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  triggerBrowserDownload("fea_stress_summary.json", JSON.stringify(record.resultsConfig, null, 2), "application/json");
                  toast.success("Downloaded fea_stress_summary.json");
                }}
                className="gap-1 text-xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Export Contour Data
              </Button>
              <Button size="sm" onClick={() => setIsStressPlotOpen(false)} className="cursor-pointer">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Compare Scenarios Modal */}
        <Dialog open={isCompareScenariosOpen} onOpenChange={setIsCompareScenariosOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-purple-600" />
                Compare FEA Design Scenarios
              </DialogTitle>
              <DialogDescription>
                Baseline Housing vs Optimized Rib-Reinforced Architecture
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-2.5">Parameter</th>
                      <th className="p-2.5">Baseline (Iter 1)</th>
                      <th className="p-2.5">Optimized (Iter 5)</th>
                      <th className="p-2.5">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-2.5 font-semibold">Housing Weight</td>
                      <td className="p-2.5 font-mono">2.45 kg</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-600">2.21 kg</td>
                      <td className="p-2.5 text-emerald-600 font-bold">-8.7%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Max Temperature</td>
                      <td className="p-2.5 font-mono">86.2 °C</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-600">78.4 °C</td>
                      <td className="p-2.5 text-emerald-600 font-bold">-7.8 °C</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Max Stress</td>
                      <td className="p-2.5 font-mono">84.5 MPa</td>
                      <td className="p-2.5 font-mono font-bold text-blue-600">78.6 MPa</td>
                      <td className="p-2.5 text-blue-600 font-bold">-7.0%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Factor of Safety</td>
                      <td className="p-2.5 font-mono">1.95</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-600">2.35</td>
                      <td className="p-2.5 text-emerald-600 font-bold">+20.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.success("Applied Optimized Scenario parameters to active design!");
                  setIsCompareScenariosOpen(false);
                }}
                className="gap-1 text-xs cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
              >
                <Check className="h-3.5 w-3.5" />
                Apply Optimized Design
              </Button>
              <Button size="sm" onClick={() => setIsCompareScenariosOpen(false)} className="cursor-pointer">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. Digital Twin Modal */}
        <Dialog open={isDigitalTwinSyncOpen} onOpenChange={setIsDigitalTwinSyncOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-600" />
                Azure Digital Twin Real-Time Telemetry Link
              </DialogTitle>
              <DialogDescription>
                Sync ANSYS simulation mesh with live hardware thermocouple sensors
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs space-y-1.5 border border-slate-800">
              <div className="text-emerald-400 font-bold">[SYNC] Azure Digital Twin Stream: CONNECTED</div>
              <div>[PROTOTYPE] Unit Serial: W-EVSE-PROTO-04</div>
              <div>[TELEMETRY] Sensor Temp (Ch 1-4 Avg): 78.2 °C</div>
              <div>[FEA MODEL] ANSYS Computed Temp: 78.4 °C</div>
              <div className="text-emerald-400 font-bold">[CORRELATION] Accuracy: 96.3% (Passed Validation)</div>
              <div className="text-slate-400 text-[11px]">Last Sync: {record.digitalTwinLastUpdated || "Just now"}</div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={() => {
                  setIsDigitalTwinSyncOpen(false);
                  toast.success("Digital Twin synced with physical prototype telemetry!", {
                    description: "Updated telemetry logs and correlation coefficients.",
                  });
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                Sync Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. Document Preview Modal */}
        <Dialog
          open={!!selectedAttachment}
          onOpenChange={(open) => !open && setSelectedAttachment(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                {selectedAttachment?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedAttachment?.type} File • {selectedAttachment?.size} • Uploaded by {selectedAttachment?.uploadedBy}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> CAE Simulation Artifact Verified
              </div>
              <div className="text-slate-300">File: {selectedAttachment?.name}</div>
              <div className="text-slate-400 text-[11px]">
                SHA-256: 7d14ac28b94f509e25ca671c890aef43b12389e1a87b5c3290b
              </div>
              <div className="text-slate-400 text-[11px]">Solver Format: ANSYS Mechanical / HDF5 / STEP AP242</div>
              <div className="text-slate-400 text-[11px]">Classification: Confidential Automotive Engineering Data</div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (selectedAttachment) {
                    triggerBrowserDownload(
                      selectedAttachment.name,
                      `=======================================================\nDOCUMENT: ${selectedAttachment.name}\nINTEGRITY SHA-256: 7d14ac28b94f509e25ca671c890aef43b12389e1a87b5c3290b\nCLASSIFICATION: Confidential Automotive Engineering Data\nPROJECT: ${record.simulationProjectName}\n=======================================================`
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

        {/* 7. Upload Simulation Document Modal */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload Simulation Attachment
              </DialogTitle>
              <DialogDescription>
                Attach CAD STEP geometry, mesh diagnostics, or ANSYS solver H5 files
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-foreground">File Name *</label>
                <Input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. thermal_cfd_mesh_v3.pdf"
                  className="text-xs h-8"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-foreground">Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="Mesh Report">3D Mesh Quality Report</option>
                  <option value="Solver Config">ANSYS Solver Configuration</option>
                  <option value="FEA Results">FEA Stress Contour Report</option>
                  <option value="CAD Model">CAD Geometry (STEP AP242)</option>
                  <option value="Correlation">Prototype Correlation Audit</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-foreground">Uploaded By</label>
                <Input
                  value={uploadUploader}
                  onChange={(e) => setUploadUploader(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button size="sm" type="button" variant="outline" onClick={() => setIsUploadOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  Upload Document
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 8. Add Reviewer Modal */}
        <Dialog open={isAddReviewerOpen} onOpenChange={setIsAddReviewerOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                Add CAE Review Board Member
              </DialogTitle>
              <DialogDescription>
                Invite a specialist engineer or manager to review this simulation
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddReviewer} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-foreground">Reviewer Full Name *</label>
                <Input
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kannan"
                  className="text-xs h-8"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-foreground">Engineering Role *</label>
                <Input
                  value={newReviewerRole}
                  onChange={(e) => setNewReviewerRole(e.target.value)}
                  placeholder="e.g. Principal Thermal CFD Specialist"
                  className="text-xs h-8"
                  required
                />
              </div>
              <DialogFooter className="pt-2">
                <Button size="sm" type="button" variant="outline" onClick={() => setIsAddReviewerOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  Add Member
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
              <DialogDescription>
                Linked engineering CAD / CAE artifact reference details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Entity ID</span>
                <span className="font-bold text-foreground font-mono text-sm block">{linkedEntityModal?.id}</span>
                <span className="text-muted-foreground block font-medium pt-1">{linkedEntityModal?.title}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                This entity feeds parameters directly into the ANSYS multi-physics FEA/CFD mesh pipeline. Geometry updates in CAD automatically synchronize with this simulation study.
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
      </div>
    </AppShell>
  );
}

export default SimulationAnalysisNewPage;
