// Testing & Validation Form - Magnertia ERP
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ClipboardCheck,
  Save,
  Send,
  MoreHorizontal,
  FileText,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Shield,
  Zap,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  Search,
  Plus,
  Play,
  RotateCw,
  Award,
  ChevronRight,
  Eye,
  Check,
  X,
  Building,
  Thermometer,
  Gauge,
  Lock,
  ArrowRight,
  UserCheck,
  Paperclip,
  Share2,
  History as HistoryIcon,
  FileCheck,
  CheckSquare,
  Box,
  ShieldCheck,
  BarChart2,
  Printer,
  Target,
  Trash2,
  ExternalLink,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { AppShell } from "@/components/erp/AppShell";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import { testingValidationService } from "@/services/testingValidationService";
import type {
  TestingApprovalDecision,
  TestingFormInput,
  TestingValidationRecord,
  TestCaseRecord,
  DefectRecord,
  TestingAttachment,
  TestingReviewer,
  TestingAuditEntry,
  TestingStatus,
} from "@/services/types";

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
  label = "QUALITY SCORE",
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
  "/development/research-innovation/testing-validation/new"
)({
  head: () => ({
    meta: [{ title: "Testing & Validation · Magnertia ERP" }],
  }),
  component: TestingValidationNewPage,
});

export function TestingValidationFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <TestingValidationNewPage {...props} />;
}

export function TestingValidationPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <TestingValidationNewPage {...props} />;
}

/* ===========================================================================
   Main Component: TestingValidationNewPage
   =========================================================================== */
export function TestingValidationNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Local state for interactive editing & instant updates
  const [localRecord, setLocalRecord] = useState<TestingValidationRecord | null>(null);

  // Review & Approval State
  const [reviewDecision, setReviewDecision] = useState<TestingApprovalDecision>("Approved with Conditions");
  const [reviewCommentInput, setReviewCommentInput] = useState(
    "Minor improvements suggested in thermal management. All safety and functional tests passed."
  );

  // Modals & Interactive Overlays
  const [isTestConsoleOpen, setIsTestConsoleOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseRecord | null>(null);
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);
  const [newDefectTitle, setNewDefectTitle] = useState("");
  const [newDefectSeverity, setNewDefectSeverity] = useState("Minor");
  const [newDefectComponent, setNewDefectComponent] = useState("Enclosure / Thermal");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Test Plan");
  const [uploadUploader, setUploadUploader] = useState("Rahul Sharma");
  const [selectedAttachment, setSelectedAttachment] = useState<TestingAttachment | null>(null);
  const [isAddReviewerOpen, setIsAddReviewerOpen] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerRole, setNewReviewerRole] = useState("");
  const [linkedEntityModal, setLinkedEntityModal] = useState<{
    type: string;
    id: string;
    title: string;
    route: string;
  } | null>(null);

  // Test Execution Simulation State
  const [isExecutingTest, setIsExecutingTest] = useState(false);
  const [testExecutionProgress, setTestExecutionProgress] = useState(0);
  const [testLogs, setTestLogs] = useState<string[]>([
    "Ready to initiate automated hardware test bench verification.",
    "Target standard: IEC 61851-1 / IEC 62196-2 / UL 2231-1.",
  ]);

  // Query record
  const { data: serverRecord, isLoading } = useQuery<TestingValidationRecord>({
    queryKey: ["testingValidationRecord"],
    queryFn: testingValidationService.fetchRecord,
  });

  // Keep local record synced with serverRecord initially
  React.useEffect(() => {
    if (serverRecord && !localRecord) {
      setLocalRecord(serverRecord);
    }
  }, [serverRecord, localRecord]);

  const record = localRecord || serverRecord;

  // Save Draft Mutation
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<TestingFormInput>) => testingValidationService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["testingValidationRecord"], updated);
      setLocalRecord(updated);
      toast.success("Draft saved successfully!", {
        description: "Testing specifications and verification parameters recorded.",
      });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", { description: err?.message || "An error occurred." });
    },
  });

  // Submit Mutation
  const submitMutation = useMutation({
    mutationFn: () => testingValidationService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["testingValidationRecord"], updated);
      setLocalRecord(updated);
      toast.success("Testing & Validation submitted for QA review!", {
        description: "Workflow stage moved to 'In Review'. QA Review Board notified.",
      });
    },
  });

  // Review Decision Mutation
  const reviewMutation = useMutation({
    mutationFn: (args: { id: string; decision: TestingApprovalDecision; comments?: string }) =>
      testingValidationService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["testingValidationRecord"], updated);
      setLocalRecord(updated);
      toast.success(`Review decision saved: ${reviewDecision}`, {
        description: "Testing audit log and QA sign-off recorded.",
      });
    },
  });

  // Action: Save Draft Handler
  const handleSaveDraft = () => {
    if (!record) return;
    saveDraftMutation.mutate({
      testProjectName: record.testProjectName,
      testObjective: record.testObjective,
      testScope: record.testScope,
      testEnvironment: record.testEnvironment,
      priority: record.priority,
      recommendation: record.readinessSummary.recommendation,
      workflowStatus: record.workflowStatus,
    });
  };

  // Action: Direct Status Change
  const handleStatusChange = (newStatus: TestingStatus) => {
    if (!record) return;
    const updated = {
      ...record,
      workflowStatus: newStatus,
      lastModified: new Date().toISOString(),
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["testingValidationRecord"], updated);
    toast.success(`Workflow status updated to '${newStatus}'`);
  };

  // Action: Log New Quality Defect
  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDefectTitle.trim() || !record) return;
    const newDef: DefectRecord = {
      id: `def-${Date.now()}`,
      defectId: `DEF-2024-00${record.resultsConfig.defectsList.length + 1}`,
      title: newDefectTitle,
      severity: newDefectSeverity as any,
      status: "Open",
      reportedBy: "Rahul Sharma",
      reportedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      assignedTo: "Hardware Engineering",
      component: newDefectComponent,
    };

    const updated = {
      ...record,
      resultsConfig: {
        ...record.resultsConfig,
        defectsFoundCount: record.resultsConfig.defectsFoundCount + 1,
        criticalDefectsCount: newDefectSeverity === "Critical" ? record.resultsConfig.criticalDefectsCount + 1 : record.resultsConfig.criticalDefectsCount,
        defectsList: [newDef, ...record.resultsConfig.defectsList],
      },
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["testingValidationRecord"], updated);
    setIsDefectModalOpen(false);
    setNewDefectTitle("");
    toast.success(`Logged defect: ${newDef.defectId}`, {
      description: `Severity: ${newDef.severity} • Assigned to ${newDef.assignedTo}`,
    });
  };

  // Action: Add New Attachment
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim() || !record) {
      toast.error("Please provide a file name");
      return;
    }
    const newAtt: TestingAttachment = {
      id: `att-${Date.now()}`,
      name: uploadName.includes(".") ? uploadName : `${uploadName}.pdf`,
      size: "2.5 MB",
      type: uploadName.endsWith(".xlsx") ? "Excel" : "PDF",
      uploadedBy: uploadUploader || "Rahul Sharma",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      url: "#",
    };

    const updated = {
      ...record,
      attachments: [newAtt, ...record.attachments],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["testingValidationRecord"], updated);
    setIsUploadOpen(false);
    setUploadName("");
    toast.success(`Uploaded ${newAtt.name} successfully!`, {
      description: "Added to Testing Attachments & Validation Reports.",
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
    queryClient.setQueryData(["testingValidationRecord"], updated);
    toast.success(`Removed attachment: ${name}`);
  };

  // Action: Add Reviewer to Board
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerRole.trim() || !record) {
      toast.error("Please enter reviewer name and role");
      return;
    }
    const newRev: TestingReviewer = {
      role: newReviewerRole,
      person: newReviewerName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      decision: "Pending",
      date: "-",
      comments: "Pending review",
    };

    const updated = {
      ...record,
      reviewers: [...record.reviewers, newRev],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["testingValidationRecord"], updated);
    setIsAddReviewerOpen(false);
    setNewReviewerName("");
    setNewReviewerRole("");
    toast.success(`Added ${newRev.person} to QA Review Board`);
  };

  // Action: Toggle Reviewer Decision directly
  const handleToggleReviewerDecision = (index: number) => {
    if (!record) return;
    const decisions: TestingApprovalDecision[] = ["Approved", "Approved with Conditions", "Revision Required", "Rejected"];
    const current = record.reviewers[index]?.decision || "Pending";
    const nextIdx = (decisions.indexOf(current as TestingApprovalDecision) + 1) % decisions.length;
    const nextDecision = decisions[nextIdx];
    const updatedReviewers = [...record.reviewers];
    updatedReviewers[index] = {
      ...updatedReviewers[index],
      decision: nextDecision,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated = { ...record, reviewers: updatedReviewers };
    setLocalRecord(updated);
    queryClient.setQueryData(["testingValidationRecord"], updated);
    toast.success(`Updated ${updatedReviewers[index].person}'s decision to ${nextDecision}`);
  };

  // Action: Run Test Simulation in Console
  const handleStartTestExecution = () => {
    setIsExecutingTest(true);
    setTestExecutionProgress(0);
    setTestLogs([
      "Initializing Keysight Infiniium 4-Ch Oscilloscope EQ-OSC-04...",
      "Calibrating Chroma Programmable AC/DC Load 63804 to 32A continuous load...",
      "Connecting CP (Control Pilot) and PP (Proximity Pilot) sensing probes...",
    ]);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setTestExecutionProgress(current);
      setTestLogs((prev) => [
        ...prev,
        `Step ${current / 25} of 4: Duty cycle ${10 + current * 2}% verified under 45 °C ambient. Ripple voltage < 15mV...`,
      ]);

      if (current >= 100) {
        clearInterval(interval);
        setIsExecutingTest(false);
        setTestLogs((prev) => [
          ...prev,
          "All protocol tests PASSED! Measured 31.9A ±0.1A. Cutoff triggered in 18ms. 100% compliant with IEC 61851-1.",
        ]);
        toast.success("Test Execution Passed!", {
          description: "Waveform telemetry verified and saved to test bench database.",
        });
      }
    }, 400);
  };

  // Action: Export Full Dossier (.TXT)
  const handleExportDossier = () => {
    if (!record) return;
    const content = `====================================================================
TESTING & VALIDATION SPECIFICATION & COMPLIANCE DOSSIER
====================================================================
Project Name: ${record.testProjectName}
Version: ${record.testVersion}
Validation ID: ${record.testingValidationId}
Form Code: ${record.formCode}
Workflow Status: ${record.workflowStatus}
Test Engineer: ${record.testEngineerName}
QA Engineer: ${record.qaEngineerName}
Environment: ${record.testEnvironment} (${record.developmentStage})
Date Exported: ${new Date().toISOString()}

1. EXECUTIVE OVERALL QUALITY SCORES
--------------------------------------------------------------------
Overall Quality Score: ${record.overallQualityScore}%
1. Functional Testing Score: ${record.functionalScore}%
2. Reliability & Stress Score: ${record.reliabilityScore}%
3. Compliance & Safety Score: ${record.complianceScore}%
4. Validation & Defect Resolution Score: ${record.validationScore}%
Recommendation: ${record.readinessSummary.recommendation}

2. TEST PLANNING & METHODOLOGY
--------------------------------------------------------------------
Test Strategy: ${record.planningConfig.testStrategy}
Test Plan Document: ${record.planningConfig.testPlanFile}
Acceptance Criteria: ${record.planningConfig.acceptanceCriteria}
Total Test Protocols: 142 Protocols

3. PROTOTYPE & LABORATORY INSTRUMENTATION
--------------------------------------------------------------------
Prototype Unit: ${record.prototypeEquipmentConfig.prototypeVersion}
Equipment Count: ${record.prototypeEquipmentConfig.equipmentUsedCount} Instruments
Readiness Status: ${record.prototypeEquipmentConfig.equipmentReadinessStatus}
Calibration Status: 100% Calibrated

4. STANDARDS COMPLIANCE VERIFIED
--------------------------------------------------------------------
Standards: IEC 61851-1, IEC 62196-2, UL 2231-1, CISPR 25, ISO 15118
EMC/EMI Status: ${record.safetyComplianceConfig.emcTestingStatus}
IP Rating: ${record.safetyComplianceConfig.ipRatingValidation}

5. DEFECT METRICS & CAE CORRELATION
--------------------------------------------------------------------
Simulation Correlation: ${record.resultsConfig.correlationWithSimulation}
Total Defects Found: ${record.resultsConfig.defectsFoundCount}
Open Critical Defects: ${record.resultsConfig.criticalDefectsCount}
Compliance Rate: ${record.resultsConfig.complianceRate}

6. ATTACHMENTS & VALIDATION REPORTS (${record.attachments.length} Files)
--------------------------------------------------------------------
${record.attachments.map((a, i) => `${i + 1}. ${a.name} (${a.size}) - Uploaded by ${a.uploadedBy} on ${a.date}`).join("\n")}

7. QA REVIEW BOARD DECISIONS
--------------------------------------------------------------------
${record.reviewers.map((r, i) => `${i + 1}. [${r.decision}] ${r.role} - ${r.person}: ${r.comments} (${r.date})`).join("\n")}
====================================================================`;

    triggerBrowserDownload(
      `${record.testingValidationId}_testing_dossier.txt`,
      content,
      "text/plain;charset=utf-8"
    );
    toast.success("Testing dossier downloaded successfully!");
  };

  // Action: Export Test Results as CSV
  const handleExportCSV = () => {
    if (!record) return;
    const csvRows = [
      ["Run ID", "Test Case", "Standard", "Duration", "Status", "Engineer"],
      ["TR-2024-001", "TC-FUNC-001 Power-On & Handshake Sequence", "IEC 61851-1", "4.2s", "Passed", "Rahul Sharma"],
      ["TR-2024-002", "TC-THERM-008 Continuous 32A Thermal Saturation", "IEC 62196-2", "45.0m", "Passed", "Rahul Sharma"],
      ["TR-2024-003", "TC-EMC-014 Radiated Emissions Spectrum Scan", "CISPR 25 / Class B", "12.5m", "Passed", "Ananya Iyer"],
      ["TR-2024-004", "TC-SAFE-022 Ground Fault Circuit Interrupt (GFCI)", "UL 2231-1", "1.8s", "Passed", "Rahul Sharma"],
      ["TR-2024-005", "TC-REL-031 Accelerated Mechanical Connector Cycles", "IEC 62196", "2.5h", "Passed", "Ananya Iyer"],
    ];
    const csvContent = csvRows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    triggerBrowserDownload(`${record.testingValidationId}_test_runs.csv`, csvContent, "text/csv;charset=utf-8");
    toast.success("Exported test runs to CSV!");
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="Testing & Validation"
        breadcrumb={breadcrumb ?? "Development > Research & Innovation > Testing & Validation"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
          <RotateCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading Testing & Validation Workspace...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Testing & Validation"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Testing & Validation"}
      description="Validate test protocols, HALT/HASS stress testing, EMC compliance, and defect tracking."
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
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {record.testProjectName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-semibold px-2.5 py-0.5"
                >
                  {record.testVersion}
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
                        toast.success("Expedited review reminder dispatched to QA Review Board.");
                      }}
                      className="cursor-pointer"
                    >
                      <Send className="mr-2 h-4 w-4 text-primary" /> Send Review Reminder
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setLocalRecord((prev) => (prev ? { ...prev, workflowStatus: "In Progress" } : prev));
                        toast.info("Status reverted to In Progress. You can now modify test criteria.");
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
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-2xs h-9 text-xs font-medium cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitMutation.isPending ? "Submitting..." : "Submit for Review"}
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
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedTestCase(null);
                      setIsTestConsoleOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Play className="h-4 w-4 mr-2 text-blue-600" />
                    Run Test Suite
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDefectModalOpen(true)} className="cursor-pointer">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Log Quality Defect
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsUploadOpen(true)} className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2 text-purple-600" />
                    Upload Test Report
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                    <Download className="h-4 w-4 mr-2 text-primary" />
                    Export Dossier (.TXT)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" />
                    Export CSV / Excel
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
                  Validation ID
                </span>
                <span className="font-bold font-mono text-foreground">
                  {record.testingValidationId}
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
                      id: record.linkedProductId,
                      title: "Smart EV Charger AC 7kW (Dual Socket)",
                      route: "/development/product-development",
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedProductId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked Prototype
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Prototype Development",
                      id: record.linkedPrototypeId,
                      title: "Physical Hardware Prototype Unit 04",
                      route: "/development/research-innovation/prototype-development/new",
                    })
                  }
                  className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedPrototypeId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked Simulation
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Simulation & Analysis",
                      id: record.linkedSimulationId,
                      title: "W-EVSE Thermal & Structural Analysis",
                      route: "/development/research-innovation/simulation-analysis/new",
                    })
                  }
                  className="font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedSimulationId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                  Test Engineer:
                </span>
                <span className="font-semibold text-foreground">
                  {record.testEngineerName}
                </span>
              </div>
              <div className="h-7 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                  QA Engineer:
                </span>
                <span className="font-semibold text-foreground">
                  {record.qaEngineerName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scores & Health Gauges Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <ProductScoreBanner submoduleKey="testing-validation" />

          {/* ====================================================================
             4. BALANCED WORKSPACE SECTIONS GRID
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Test Project Overview */}
            <Card id="section-overview" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Test Project Overview & Target Scope</CardTitle>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-semibold text-xs border border-red-200">
                    Priority: {record.priority}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                      Product Name & Category
                    </span>
                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 font-medium text-foreground">
                      <span className="font-bold text-xs">{record.productName}</span>
                      <Badge variant="outline" className="text-xs font-semibold">{record.productCategory}</Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                      Test Objective
                    </span>
                    <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 font-medium text-foreground leading-relaxed">
                      {record.testObjective}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                    <span className="text-muted-foreground text-[10px]">Testing Scope</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs truncate max-w-[280px]">
                      {record.testScope || "Functional, Electrical, HALT/HASS, Thermal & Safety"}
                    </span>
                  </div>
                </CardContent>
              </Card>

            {/* Card 2: Test Planning */}
            <Card id="section-test-planning" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Test Planning & Methodology</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                    Score: {record.planningConfig.planningScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Strategy</span>
                      <span className="font-semibold text-foreground text-xs">{record.planningConfig.testStrategy}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Test Plan Document</span>
                      <span className="font-semibold text-primary text-xs truncate block" title={record.planningConfig.testPlanFile}>
                        {record.planningConfig.testPlanFile}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Acceptance</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">{record.planningConfig.acceptanceCriteria}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Test Suite</span>
                      <span className="font-semibold text-foreground text-xs">142 Protocols</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Traceability Matrix & Test Case Mapping</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Test cases mapped 1:1 with PRD requirements and design FMEA critical failure modes. Acceptance criteria validated per automotive APQP standards.
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Card 3: Prototype & Equipment */}
            <Card id="section-prototype-equipment" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Prototype & Equipment Readiness</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                    Score: {record.prototypeEquipmentConfig.readinessScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Prototype Unit</span>
                      <span className="font-semibold text-primary font-mono text-xs">{record.prototypeEquipmentConfig.prototypeVersion}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Equipment Used</span>
                      <span className="font-semibold text-foreground text-xs">{record.prototypeEquipmentConfig.equipmentUsedCount} Selected</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Readiness Status</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">{record.prototypeEquipmentConfig.equipmentReadinessStatus}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Calibration</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">100% Calibrated</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Laboratory Instrumentation Validation</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Calibrated test equipment active: Keysight Infiniium 4-Ch Oscilloscope, Chroma Programmable AC/DC Load 63804, and R&S EMI Receiver (valid through Nov 2024).
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Card 4: Functional Testing */}
            <Card id="section-functional-testing" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Functional Testing Verification</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                    Score: {record.functionalConfig.functionalScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Functional</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                        <Check className="h-3 w-3" /> {record.functionalConfig.functionalTestingStatus}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Electrical</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                        <Check className="h-3 w-3" /> {record.functionalConfig.electricalTestingStatus}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Software / Firmware</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                        <Check className="h-3 w-3" /> {record.functionalConfig.softwareTestingStatus}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Pilot Signal (CP)</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">PWM Handshake OK</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">EV-EVSE Protocol & Power Sequencing</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      IEC 61851-1 Control Pilot (CP) duty cycle verified from 10% to 96%. Automated relay latching and emergency cutoff triggered within 18ms under simulated fault conditions.
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Card 5: Performance & Reliability */}
            <Card id="section-performance-reliability" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Performance & Reliability Assurance</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                    Score: {record.performanceConfig.reliabilityScore || record.reliabilityScore || 92}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">MTBF Estimate</span>
                      <span className="font-bold text-foreground text-xs font-mono">{record.performanceConfig.mtbfEstimate || "12,500 Hrs"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Load Test</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                        <Check className="h-3 w-3" /> {record.performanceConfig.loadTestStatus || "Passed"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Thermal Test</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                        <Check className="h-3 w-3" /> {record.performanceConfig.thermalTestStatus || "Passed"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Thermal Delta</span>
                      <span className="font-semibold text-amber-600 text-xs">&lt; 35°C Temp Rise</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">HALT/HASS Stress Screening & 32A Continuous Load</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Continuous 32A charging burn-in conducted at 45°C ambient over 120 uninterrupted hours. Terminal temperature stabilized at 72.8°C (well below 85°C allowable threshold).
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Card 6: Safety & Compliance */}
            <Card id="section-safety-compliance" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Safety & Compliance Verification</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                    Score: {record.safetyComplianceConfig.complianceScore || record.complianceScore || 93}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">EMC / EMI</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                        <Check className="h-3 w-3" /> {record.safetyComplianceConfig.emcEmiTestStatus || "Passed"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">IP Rating</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">{record.safetyComplianceConfig.ipRatingTestStatus || "Passed (IP54)"}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">GFCI Interrupt</span>
                      <span className="font-semibold text-foreground text-xs font-mono">1.8s Trip Time</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Standards</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.safetyComplianceConfig.regulatoryStandards?.length || 5} Standards</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Standards Compliance Verified
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["IEC 61851-1", "IEC 62196-2", "UL 2231-1", "CISPR 25", "ISO 15118"].map((std, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] py-0.5 px-2 font-bold">
                          <Check className="h-3 w-3 mr-1 inline" /> {std}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Card 7: Validation Results */}
            <Card id="section-results-validation" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Validation Results & Defect Metrics</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600 text-white font-mono text-xs font-semibold">
                      Score: {record.resultsConfig.validationScore || record.validationScore || 89}/100
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setIsDefectModalOpen(true)} className="gap-1 text-xs h-7 cursor-pointer">
                      <AlertTriangle className="h-3 w-3" />
                      Log Defect
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">FEA Correlation</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs font-mono">{record.resultsConfig.prototypeCorrelationPct || 95}%</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Defects Found</span>
                      <span className="font-semibold text-amber-600 text-xs">{record.resultsConfig.defectsIdentifiedCount ?? record.resultsConfig.defectsList?.length ?? 3} (0 Critical)</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Critical Defects</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">{record.resultsConfig.criticalIssuesCount ?? 0} Open</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Compliance Rate</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-xs font-mono">{record.resultsConfig.customerRequirementCompliancePct || 96}%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Defect Resolution & CAE Correlation</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Physical sensor telemetry confirmed 95% correlation with SIM-2024-0061 thermal model. 3 minor defects logged (cable grommet fitment, status LED diffuser), with zero critical functional or safety anomalies.
                    </p>
                  </div>
                </CardContent>
              </Card>

            {/* Card 8: AI Quality Assessment */}
            <Card id="section-ai-assessment" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-sm font-bold">AI Quality Assessment & Advisory</CardTitle>
                  </div>
                  <Badge className="bg-purple-600 text-white font-mono text-xs font-semibold">
                    AI Score: {record.aiAssessment.aiValidationScore || 91}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="p-3 rounded-lg border border-purple-200/70 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-purple-900 dark:text-purple-200 text-xs">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span>AI Defect Risk Prediction</span>
                    </div>
                    <p className="text-purple-800 dark:text-purple-300 text-[11px] leading-relaxed">
                      {record.aiAssessment.aiDefectPrediction || "Low risk of major defects."} {record.aiAssessment.aiImprovementSuggestions || "Improve heat sink design for better long-term performance."}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Executive Recommendation</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                        {record.readinessSummary.recommendation}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate({ to: "/development/research-innovation/certification-readiness/new" as any })}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 gap-1 font-semibold cursor-pointer"
                    >
                      Proceed to Certification <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
          </div>

          {/* ====================================================================
             5. RECENT TEST EXECUTIONS & COMPLIANCE RUN MATRIX (Full Width)
             ==================================================================== */}
          <Card id="section-summary" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-sm font-bold">Recent Test Executions & Compliance Run Matrix</CardTitle>
                    <span className="text-[11px] text-muted-foreground">Automated hardware test bench telemetry & pass/fail audit logs</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 text-xs font-bold border-emerald-200">
                    142/142 Tests Verified
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTestCase(null);
                      setIsTestConsoleOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs h-8 font-semibold cursor-pointer"
                  >
                    <Play className="h-3 w-3" /> Run New Test
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                {/* Test Runs Table */}
                <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3">Run ID</th>
                        <th className="p-3">Test Case & Protocol</th>
                        <th className="p-3">Standard</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Waveform / Logs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {[
                        {
                          id: "TR-2024-001",
                          name: "TC-FUNC-001 Power-On & Handshake Sequence",
                          standard: "IEC 61851-1",
                          duration: "4.2s",
                          status: "Passed",
                          engineer: "Rahul Sharma",
                        },
                        {
                          id: "TR-2024-002",
                          name: "TC-THERM-008 Continuous 32A Thermal Saturation",
                          standard: "IEC 62196-2",
                          duration: "45.0m",
                          status: "Passed",
                          engineer: "Rahul Sharma",
                        },
                        {
                          id: "TR-2024-003",
                          name: "TC-EMC-014 Radiated Emissions Spectrum Scan",
                          standard: "CISPR 25 / Class B",
                          duration: "12.5m",
                          status: "Passed",
                          engineer: "Ananya Iyer",
                        },
                        {
                          id: "TR-2024-004",
                          name: "TC-SAFE-022 Ground Fault Circuit Interrupt (GFCI)",
                          standard: "UL 2231-1",
                          duration: "1.8s",
                          status: "Passed",
                          engineer: "Rahul Sharma",
                        },
                        {
                          id: "TR-2024-005",
                          name: "TC-REL-031 Accelerated Mechanical Connector Cycles",
                          standard: "IEC 62196",
                          duration: "2.5h",
                          status: "Passed",
                          engineer: "Ananya Iyer",
                        },
                      ].map((run) => (
                        <tr key={run.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-mono font-bold text-primary text-xs">{run.id}</td>
                          <td className="p-3">
                            <span className="font-bold text-foreground block text-xs">{run.name}</span>
                            <span className="text-[10px] text-muted-foreground">Tester: {run.engineer}</span>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-[10px] font-mono">{run.standard}</Badge>
                          </td>
                          <td className="p-3 text-muted-foreground">{run.duration}</td>
                          <td className="p-3">
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 text-[10px] font-bold">
                              <Check className="h-3 w-3 mr-1 inline" /> {run.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedTestCase({
                                  id: run.id,
                                  testCaseId: run.id,
                                  title: run.name,
                                  category: "Functional",
                                  status: "Passed",
                                  executionDuration: run.duration,
                                  executedBy: run.engineer,
                                  lastRunDate: "18 Jun 2024",
                                  stepsCount: 8,
                                  passCriteria: "Zero deviations observed",
                                });
                                setIsTestConsoleOpen(true);
                              }}
                              className="h-7 text-xs text-primary font-semibold cursor-pointer hover:underline"
                            >
                              View Trace →
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 4 Laboratory KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                    <span className="text-muted-foreground block text-[10px]">Test Automation Coverage</span>
                    <span className="text-base font-bold text-foreground font-mono">94.2%</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                    <span className="text-muted-foreground block text-[10px]">Mean Cycle Time</span>
                    <span className="text-base font-bold text-foreground font-mono">4.2 min</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                    <span className="text-muted-foreground block text-[10px]">Defect Resolution Rate</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">100% Closed</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                    <span className="text-muted-foreground block text-[10px]">Lab Bench Utilization</span>
                    <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">88.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* ====================================================================
             6. TESTING ATTACHMENTS & VALIDATION REPORTS (Full Width)
             ==================================================================== */}
          <Card id="section-attachments" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">Testing Attachments & Validation Reports</CardTitle>
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
                        <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold text-foreground block truncate" title={att.name}>{att.name}</span>
                          <span className="text-[10px] text-muted-foreground">{att.size} • {att.date}</span>
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
                              `=======================================================\nDOCUMENT: ${att.name}\nCATEGORY: Testing & Validation Laboratory Certificate\nUPLOADED BY: ${att.uploadedBy}\nINTEGRITY SHA-256: 3c9e102f89b456da87ec1209fb342e67\nSTATUS: Certified & Accredited\nPROJECT: ${record.testProjectName}\n=======================================================`
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
             7. QUALITY REVIEW BOARD & APPROVAL TIMELINE (Full Width)
             ==================================================================== */}
          <Card id="section-review" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">Quality Review Board & Approval Timeline</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold border-amber-200">
                    QA Review Board
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
                        onChange={(e) => setReviewDecision(e.target.value as TestingApprovalDecision)}
                        className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                      >
                        <option value="Approved">Approved (Production Ready)</option>
                        <option value="Approved with Conditions">Approved with Conditions</option>
                        <option value="Revision Required">Revision Required</option>
                        <option value="On Hold">On Hold</option>
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
                        reviewMutation.mutate({
                          id: record.id,
                          decision: reviewDecision,
                          comments: reviewCommentInput,
                        });
                        // Also update review board rows locally
                        const updatedReviewers = record.reviewers.map((r) =>
                          r.role === "QA Engineer"
                            ? { ...r, decision: reviewDecision, comments: reviewCommentInput, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
                            : r
                        );
                        setLocalRecord({
                          ...record,
                          reviewers: updatedReviewers,
                        });
                      }}
                      disabled={reviewMutation.isPending}
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
             8. SYSTEM AUDIT TRAIL & HISTORY (Full Width)
             ==================================================================== */}
          <Card id="section-system-info" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
            <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm font-bold">System Audit Trail & Telemetry History</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-mono">{record.auditTrail.length} Events</Badge>
            </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <div className="space-y-2">
                  {record.auditTrail.map((aud) => (
                    <div key={aud.id} className="rounded-lg border border-slate-200/80 dark:border-slate-800 p-3 text-xs flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <span className="font-bold text-foreground block">{aud.action}</span>
                        <span className="text-[11px] text-muted-foreground">{aud.details}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground block">{aud.timestamp}</span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">{aud.user} ({aud.ipAddress})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>

        {/* ====================================================================
           9. MODALS & DIALOGS
           ==================================================================== */}

        {/* 1. Test Execution Console Modal */}
        <Dialog open={isTestConsoleOpen} onOpenChange={setIsTestConsoleOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Play className="h-4 w-4 text-blue-600" />
                Live Laboratory Test Execution Console
              </DialogTitle>
              <DialogDescription>
                Automated hardware test bench telemetry & oscilloscope waveforms
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Active Protocol</span>
                <span className="font-bold text-foreground block">
                  {selectedTestCase?.title ?? "TC-FUNC-001 Power-On & Handshake Sequence (IEC 61851-1)"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Bench: Chroma AC/DC Load 63804 • Keysight Infiniium 4-Ch
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Execution Progress ({testExecutionProgress}%)</span>
                  <span className="font-mono text-blue-600">{testExecutionProgress}%</span>
                </div>
                <Progress value={testExecutionProgress} className="h-2" />
              </div>

              <div className="h-40 rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-1 border border-slate-800">
                {testLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  triggerBrowserDownload("oscilloscope_waveform_trace.json", JSON.stringify({
                    testCase: selectedTestCase?.title ?? "TC-FUNC-001",
                    sampleRate: "2.5 GSa/s",
                    dutyCyclePct: 53.4,
                    measuredCurrentA: 31.9,
                    cutoffMs: 18.2,
                    status: "PASS",
                  }, null, 2), "application/json");
                  toast.success("Exported oscilloscope waveform trace!");
                }}
                className="gap-1 text-xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Export Waveform (.JSON)
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleStartTestExecution}
                  disabled={isExecutingTest}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1 cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  {isExecutingTest ? "Testing..." : "Execute Test"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsTestConsoleOpen(false)} className="cursor-pointer">
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 2. Log Defect Modal */}
        <Dialog open={isDefectModalOpen} onOpenChange={setIsDefectModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> Log Quality Defect
              </DialogTitle>
              <DialogDescription>
                Record hardware, firmware, or mechanical non-conformance
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDefect} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">Defect Description *</label>
                <Input
                  value={newDefectTitle}
                  onChange={(e) => setNewDefectTitle(e.target.value)}
                  placeholder="e.g. Grommet seal tolerance loose during IP54 spray test"
                  className="text-xs h-8"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Severity</label>
                  <select
                    value={newDefectSeverity}
                    onChange={(e) => setNewDefectSeverity(e.target.value)}
                    className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="Minor">Minor</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Subsystem / Component</label>
                  <select
                    value={newDefectComponent}
                    onChange={(e) => setNewDefectComponent(e.target.value)}
                    className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="Enclosure / Thermal">Enclosure / Thermal</option>
                    <option value="Control Pilot (CP)">Control Pilot (CP)</option>
                    <option value="Power Electronics">Power Electronics</option>
                    <option value="Firmware / OCPI">Firmware / OCPI</option>
                    <option value="Connector Cable">Connector Cable</option>
                  </select>
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsDefectModalOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-amber-600 text-white hover:bg-amber-700 cursor-pointer">
                  Submit Defect
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 3. Upload Attachment Modal */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload Validation Attachment
              </DialogTitle>
              <DialogDescription>
                Attach test plans, calibration certificates, or accredited lab reports
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-foreground">File Name *</label>
                <Input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. emc_immunity_report_v2.pdf"
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
                  <option value="Test Plan">Test Plan & Protocols</option>
                  <option value="Calibration">Equipment Calibration Certificate</option>
                  <option value="EMC Report">EMC / EMI Compliance Report</option>
                  <option value="Safety Audit">Electrical Safety Audit Report</option>
                  <option value="HALT Results">HALT / HASS Burn-in Results</option>
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

        {/* 4. Document Preview Modal */}
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
                {selectedAttachment?.type} File • {selectedAttachment?.size} • Uploaded on {selectedAttachment?.date}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Accredited Testing Laboratory Verified
              </div>
              <div className="text-slate-300">File: {selectedAttachment?.name}</div>
              <div className="text-slate-400 text-[11px]">
                SHA-256: 3c9e102f89b456da87ec1209fb342e67a41289de6b2019f8564
              </div>
              <div className="text-slate-400 text-[11px]">Laboratory: Magnertia EV Accreditation Center (ISO 17025)</div>
              <div className="text-slate-400 text-[11px]">Calibration Cycle: Active (Valid through Nov 2024)</div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (selectedAttachment) {
                    triggerBrowserDownload(
                      selectedAttachment.name,
                      `=======================================================\nDOCUMENT: ${selectedAttachment.name}\nINTEGRITY SHA-256: 3c9e102f89b456da87ec1209fb342e67a41289de6b2019f8564\nLABORATORY: Magnertia EV Accreditation Center (ISO 17025)\nPROJECT: ${record.testProjectName}\n=======================================================`
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

        {/* 5. Add Reviewer Modal */}
        <Dialog open={isAddReviewerOpen} onOpenChange={setIsAddReviewerOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                Add QA Review Board Member
              </DialogTitle>
              <DialogDescription>
                Invite a test engineer or compliance officer to the review board
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddReviewer} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-foreground">Reviewer Full Name *</label>
                <Input
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  placeholder="e.g. Sanya Kapoor"
                  className="text-xs h-8"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-foreground">Engineering Role *</label>
                <Input
                  value={newReviewerRole}
                  onChange={(e) => setNewReviewerRole(e.target.value)}
                  placeholder="e.g. Senior EMC Certification Specialist"
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

        {/* 6. Linked Entity Details Modal */}
        <Dialog open={!!linkedEntityModal} onOpenChange={(open) => !open && setLinkedEntityModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                {linkedEntityModal?.type} Entity
              </DialogTitle>
              <DialogDescription>
                Linked engineering validation artifact reference details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Entity ID</span>
                <span className="font-bold text-foreground font-mono text-sm block">{linkedEntityModal?.id}</span>
                <span className="text-muted-foreground block font-medium pt-1">{linkedEntityModal?.title}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                This entity is coupled directly to the hardware test matrix and automated oscilloscope acquisition system. Physical measurements are correlated 1:1 against this reference.
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

export default TestingValidationNewPage;
