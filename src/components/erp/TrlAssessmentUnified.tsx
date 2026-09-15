import React, { useState, useEffect, useMemo, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Gauge,
  CheckCircle2,
  Award,
  ArrowRight,
  Plus,
  Save,
  Send,
  MoreHorizontal,
  Calendar,
  User,
  Building2,
  FileText,
  Download,
  Printer,
  FileCode,
  Sparkles,
  Zap,
  Target,
  Clock,
  Layers,
  Edit,
  Search,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  X,
  ExternalLink,
  FlaskConical,
  Rocket,
  Activity,
} from "lucide-react";

import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import {
  TrlAssessmentPageTabBar,
  TRL_STATUS_LABEL,
  type TrlTabId,
} from "@/components/erp/TrlAssessmentTabBar";
import { StatCard } from "@/components/erp/StatCard";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ErpButton } from "@/components/erp/Button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { trlAssessmentService } from "@/services/trlAssessmentService";
import type {
  TrlApprovalDecision,
  TrlFormInput,
  TrlLevelNumber,
  TrlStatus,
} from "@/services/types";

function fmtDate(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const TRL_SCALE_GUIDE: { level: TrlLevelNumber; title: string; desc: string }[] = [
  { level: 1, title: "Basic Principles Observed", desc: "Scientific research begins to be translated into applied R&D." },
  { level: 2, title: "Technology Concept Formulated", desc: "Practical applications can be invented; principles are postulated." },
  { level: 3, title: "Experimental Proof of Concept", desc: "Analytical and laboratory studies validate predictions." },
  { level: 4, title: "Technology Validated in Laboratory", desc: "Basic technological components integrated in lab environment." },
  { level: 5, title: "Technology Validated in Relevant Environment", desc: "Fidelity of technology increases; validated in realistic environment." },
  { level: 6, title: "Technology Demonstrated in Relevant Environment", desc: "Representative model or prototype tested in relevant environment." },
  { level: 7, title: "System Prototype Demonstrated in Operational Environment", desc: "Prototype near or at planned operational system level." },
  { level: 8, title: "System Complete and Qualified", desc: "Technology proven through test and demonstration in final form." },
  { level: 9, title: "Actual System Proven in Operational Environment", desc: "Actual application of technology in its final operational environment." },
];

function ReadinessGauge({ percent }: { percent: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="h-32 w-32 -rotate-90 stroke-current">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/30"
          fill="transparent"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-emerald-500 transition-all duration-700 ease-out"
          fill="transparent"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black text-foreground">{percent}%</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Readiness</div>
      </div>
    </div>
  );
}

const FILTERS: { key: TrlStatus | "all"; label: string }[] = [
  { key: "all", label: "All Statuses" },
  { key: "draft", label: "Draft" },
  { key: "technology_assessment", label: "Assessment" },
  { key: "technical_validation", label: "Validation" },
  { key: "demonstration_review", label: "Demonstration" },
  { key: "executive_review", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "approved_with_improvements", label: "Conditional" },
  { key: "revision_required", label: "Revision" },
  { key: "rejected", label: "Rejected" },
];

export function TrlAssessmentUnifiedPage({
  initialTab = "register",
  breadcrumb,
  tabs,
}: {
  initialTab?: TrlTabId;
  breadcrumb?: string;
  tabs?: ReactNode;
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TrlTabId>(initialTab);
  const [filter, setFilter] = useState<TrlStatus | "all">("all");
  const [selectedRecordId, setSelectedRecordId] = useState<string>("trl-record-0087");

  // Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [reviewDecisionChoice, setReviewDecisionChoice] = useState<TrlApprovalDecision>("Approved");
  const [reviewCommentsInput, setReviewCommentsInput] = useState("");

  // List Query
  const listQuery = useQuery({
    queryKey: ["trl-assessment", "list"],
    queryFn: () => trlAssessmentService.fetchList(),
  });

  // Record Query
  const recordQuery = useQuery({
    queryKey: ["trl-assessment", "record", selectedRecordId],
    queryFn: () => trlAssessmentService.fetchRecord(selectedRecordId),
  });

  const record = recordQuery.data;

  // Form State
  const [form, setForm] = useState<TrlFormInput>({
    assessmentTitle: "Autonomous Docking System Readiness Assessment",
    businessUnit: "Automotive & Fleet Mobility",
    leadAssessor: "Dr. Vikram Sharma",
    assessmentDate: "2024-05-20",
    currentTrlLevel: 5,
    targetTrlLevel: 7,
    recommendedTrlLevel: 6,
    linkedProjectId: "PRJ-2024-0042",
    linkedTechnologyId: "TECH-2024-0089",
    technologySummary: "High-power automated docking connection system for autonomous commercial fleet charging operations.",
    assessmentScope: "Full hardware-in-the-loop and vehicle proving ground telemetry verification.",
    keyStrengths: [
      "Sub-15ms optical handshake response verified in simulation and lab.",
      "IP68 environmental protection against dust and water immersion.",
      "Patented multi-axis thermal compensation mechanism.",
    ],
    identifiedGaps: [
      "Extreme cold weather (-20°C) latching durability requires extended thermal cycling.",
      "EMC immunity testing under full 350kW charging surge needs final laboratory sign-off.",
    ],
    advancementRecommendations: [
      "Execute 500-cycle cold chamber latching test before advancing to TRL 7.",
      "Conduct field trial with DISCOM partner in Delhi NCR depot.",
    ],
    technicalMaturityScore: 84,
    testingCompletenessScore: 78,
    manufacturingReadinessScore: 72,
    regulatoryComplianceScore: 80,
    reviewComments: "",
  });

  useEffect(() => {
    if (record) {
      setForm({
        assessmentTitle: record.assessmentTitle,
        businessUnit: record.businessUnit,
        leadAssessor: record.leadAssessor,
        assessmentDate: record.assessmentDate,
        currentTrlLevel: record.currentTrlLevel,
        targetTrlLevel: record.targetTrlLevel,
        recommendedTrlLevel: record.recommendedTrlLevel,
        linkedProjectId: record.linkedProjectId,
        linkedTechnologyId: record.linkedTechnologyId,
        technologySummary: record.technologySummary,
        assessmentScope: record.assessmentScope,
        keyStrengths: record.keyStrengths,
        identifiedGaps: record.identifiedGaps,
        advancementRecommendations: record.advancementRecommendations,
        technicalMaturityScore: record.technicalMaturityScore,
        testingCompletenessScore: record.testingCompletenessScore,
        manufacturingReadinessScore: record.manufacturingReadinessScore,
        regulatoryComplianceScore: record.regulatoryComplianceScore,
        approvalDecision: record.approvalDecision,
        reviewComments: record.reviewComments || "",
        approvalDate: record.approvalDate || "",
      });
    }
  }, [record]);

  // Derived Overall Score
  const derivedOverallScore = useMemo(() => {
    return Math.round(
      (form.technicalMaturityScore * 0.35) +
      (form.testingCompletenessScore * 0.30) +
      (form.manufacturingReadinessScore * 0.20) +
      (form.regulatoryComplianceScore * 0.15)
    );
  }, [
    form.technicalMaturityScore,
    form.testingCompletenessScore,
    form.manufacturingReadinessScore,
    form.regulatoryComplianceScore,
  ]);

  const rows = useMemo(() => listQuery.data ?? [], [listQuery.data]);

  // Deduplicate and filter rows
  const uniqueRows = useMemo(() => {
    const seen = new Set<string>();
    return rows.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [rows]);

  const filteredRows = useMemo(() => {
    return filter === "all" ? uniqueRows : uniqueRows.filter((r) => r.status === filter);
  }, [uniqueRows, filter]);

  // KPIs
  const kpis = useMemo(() => {
    return {
      total: uniqueRows.length || 2,
      active: uniqueRows.filter((r) => !["approved", "rejected", "archived"].includes(r.status)).length || 2,
      approved: uniqueRows.filter((r) => r.status === "approved" || r.status === "approved_with_improvements").length,
      avgScore: uniqueRows.length > 0 ? Math.round(uniqueRows.reduce((a, b) => a + b.finalTrlScore, 0) / uniqueRows.length) : 78,
    };
  }, [uniqueRows]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: TrlFormInput) => trlAssessmentService.saveDraft(input, selectedRecordId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["trl-assessment", "record", selectedRecordId], updated);
      queryClient.invalidateQueries({ queryKey: ["trl-assessment", "list"] });
      toast.success("TRL Assessment draft saved!", {
        description: "All maturity scores and TRL level criteria updated.",
      });
    },
    onError: (err: any) => toast.error("Failed to save draft", { description: err?.message }),
  });

  const submitMutation = useMutation({
    mutationFn: () => trlAssessmentService.submitForReview(selectedRecordId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["trl-assessment", "record", selectedRecordId], updated);
      queryClient.invalidateQueries({ queryKey: ["trl-assessment", "list"] });
      toast.success("Submitted for Executive TRL Review!", {
        description: "Notifications dispatched to Technical Review Committee.",
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (args: { decision: TrlApprovalDecision; comments?: string }) =>
      trlAssessmentService.review({ id: selectedRecordId, ...args }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["trl-assessment", "record", selectedRecordId], updated);
      queryClient.invalidateQueries({ queryKey: ["trl-assessment", "list"] });
      setShowReviewModal(false);
      toast.success(`Decision recorded: ${reviewDecisionChoice}`, {
        description: "TRL Assessment status updated successfully.",
      });
    },
  });

  const handleExportPDF = () => {
    const content = `=====================================================
TECHNOLOGY READINESS LEVEL (TRL) ASSESSMENT DOSSIER
=====================================================
Title: ${form.assessmentTitle}
Record ID: ${record?.trlAssessmentId || "TRL-2024-0087"}
Business Unit: ${form.businessUnit}
Lead Assessor: ${form.leadAssessor}
Assessment Date: ${form.assessmentDate}
Workflow Status: ${record?.status || "executive_review"}

TRL LEVEL ADVANCEMENT:
-----------------------------------------------------
Current Level: TRL ${form.currentTrlLevel} (${TRL_SCALE_GUIDE[form.currentTrlLevel - 1]?.title})
Target Level: TRL ${form.targetTrlLevel} (${TRL_SCALE_GUIDE[form.targetTrlLevel - 1]?.title})
Assessed Recommendation: TRL ${form.recommendedTrlLevel} (${TRL_SCALE_GUIDE[form.recommendedTrlLevel - 1]?.title})

READINESS SCORES:
-----------------------------------------------------
Technical Maturity: ${form.technicalMaturityScore}/100
Testing Completeness: ${form.testingCompletenessScore}/100
Manufacturing Readiness: ${form.manufacturingReadinessScore}/100
Regulatory Compliance: ${form.regulatoryComplianceScore}/100
Overall Composite TRL Score: ${derivedOverallScore}/100

KEY STRENGTHS:
-----------------------------------------------------
${form.keyStrengths?.map((s, i) => `${i + 1}. ${s}`).join("\n")}

IDENTIFIED GAPS:
-----------------------------------------------------
${form.identifiedGaps?.map((g, i) => `${i + 1}. ${g}`).join("\n")}

ADVANCEMENT RECOMMENDATIONS:
-----------------------------------------------------
${form.advancementRecommendations?.map((r, i) => `${i + 1}. ${r}`).join("\n")}

APPROVAL DECISION:
-----------------------------------------------------
Decision: ${form.approvalDecision || "Under Review"}
Review Notes: ${form.reviewComments || "Executive committee TRL gate sign-off."}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record?.trlAssessmentId || "TRL-2024-0087"}_TRL_Dossier.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("TRL Assessment Dossier exported successfully!");
  };

  const handleOpenRecordInForm = (recId: string) => {
    setSelectedRecordId(recId);
    setActiveTab("form");
    toast.success(`Loaded assessment ${recId} in editor`);
  };

  return (
    <AppShell
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > TRL Assessment"}
      title="TRL Assessment"
      description="Assess and advance technology readiness levels."
      tabs={tabs ?? <InnovationAreaTabs sub={<TrlAssessmentPageTabBar activeTab={activeTab} onTabChange={setActiveTab} />} />}
      topbarActions={
        <div className="flex items-center gap-2">
          {activeTab === "form" ? (
            <>
              <ErpButton
                variant="outline"
                size="sm"
                onClick={() => saveDraftMutation.mutate(form)}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 text-xs cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Draft</span>
              </ErpButton>
              <ErpButton
                variant="primary"
                size="sm"
                onClick={() => (record?.status === "executive_review" ? setShowReviewModal(true) : submitMutation.mutate())}
                disabled={submitMutation.isPending}
                className="gap-1.5 text-xs bg-primary text-white cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{record?.status === "executive_review" ? "Committee Decision" : "Submit for Review"}</span>
              </ErpButton>
            </>
          ) : (
            <ErpButton
              variant="primary"
              size="sm"
              onClick={() => setActiveTab("form")}
              className="gap-1.5 text-xs bg-primary text-white cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1" />
              New TRL Assessment
            </ErpButton>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 text-xs">
              <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                <Printer className="mr-2 h-4 w-4 text-primary" /> Export Dossier (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowScheduleModal(true)} className="cursor-pointer">
                <Calendar className="mr-2 h-4 w-4 text-blue-600" /> Schedule Committee Gate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(JSON.stringify(form, null, 2)); toast.success("Form JSON copied!"); }} className="cursor-pointer">
                <FileCode className="mr-2 h-4 w-4 text-emerald-600" /> Copy TRL JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    >
      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* TAB 1: TRL REGISTER                                                       */}
        {/* ========================================================================= */}
        {activeTab === "register" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Direct Clean Stat Cards (NO Templates / Edit Dashboard header) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Assessments"
                value={String(kpis.total)}
                neutralText="All Technology TRL Records"
                icon={<Gauge className="h-5 w-5" />}
                iconBg="bg-primary/10"
                iconColor="text-primary"
              />
              <StatCard
                label="Under Assessment"
                value={String(kpis.active)}
                neutralText="Active Progression Gates"
                icon={<Activity className="h-5 w-5" />}
                iconBg="bg-amber-500/10"
                iconColor="text-amber-600 dark:text-amber-400"
              />
              <StatCard
                label="Approved TRLs"
                value={String(kpis.approved)}
                neutralText="Validated & Certified Levels"
                icon={<CheckCircle2 className="h-5 w-5" />}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-600 dark:text-emerald-400"
              />
              <StatCard
                label="Avg Readiness Score"
                value={`${kpis.avgScore}/100`}
                neutralText="Composite Maturity Average"
                icon={<Award className="h-5 w-5" />}
                iconBg="bg-blue-500/10"
                iconColor="text-blue-600 dark:text-blue-400"
              />
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer select-none",
                      filter === f.key
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-medium text-muted-foreground">
                Showing {filteredRows.length} of {uniqueRows.length} records
              </div>
            </div>

            {/* Register Data Table */}
            <div className="card-soft bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border text-muted-foreground font-medium">
                      <th className="p-3">TRL ID</th>
                      <th className="p-3">Assessment Title</th>
                      <th className="p-3">TRL Levels</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Readiness Score</th>
                      <th className="p-3">Recommended</th>
                      <th className="p-3">Updated</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredRows.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td
                          className="p-3 font-semibold text-primary font-mono cursor-pointer"
                          onClick={() => handleOpenRecordInForm(r.id)}
                        >
                          {r.trlAssessmentId}
                        </td>
                        <td className="p-3">
                          <span
                            onClick={() => handleOpenRecordInForm(r.id)}
                            className="font-semibold text-foreground hover:text-primary cursor-pointer block"
                          >
                            {r.assessmentTitle}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{r.linkedTechnologyName}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border">
                            TRL {r.currentTrlLevel} → TRL {r.targetTrlLevel}
                          </span>
                        </td>
                        <td className="p-3"><StatusBadge status={r.status} /></td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${r.finalTrlScore}%` }}
                              />
                            </div>
                            <span className="font-bold text-foreground">{r.finalTrlScore}/100</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                            TRL {r.recommendedTrlLevel}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground font-mono">{fmtDate(r.updatedAt)}</td>
                        <td className="p-3 text-right">
                          <ErpButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRecordInForm(r.id)}
                            className="text-xs h-7 px-2.5 cursor-pointer"
                          >
                            <Edit className="h-3 w-3 mr-1" /> Open Form
                          </ErpButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TRL ASSESSMENT FORM                                                */}
        {/* ========================================================================= */}
        {activeTab === "form" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Metadata Ribbon */}
            <Card className="border border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
              <div className="p-4 sm:p-5 pb-4 bg-slate-50/70 dark:bg-slate-900/90 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-200/50 dark:border-emerald-800/50 shadow-2xs">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/60">
                        {record?.trlAssessmentId || "TRL-2024-0087"}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <Badge variant="outline" className="font-mono text-[11px] font-semibold">
                        {form.businessUnit}
                      </Badge>
                      <StatusBadge status={record?.status || "executive_review"} />
                    </div>
                    <input
                      type="text"
                      value={form.assessmentTitle}
                      onChange={(e) => setForm((prev) => ({ ...prev, assessmentTitle: e.target.value }))}
                      className="text-base sm:text-lg font-bold text-foreground bg-transparent hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary px-2 py-0.5 transition-all rounded-md max-w-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <ErpButton
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("register")}
                    className="text-xs cursor-pointer"
                  >
                    View Register
                  </ErpButton>
                  <ErpButton
                    variant="outline"
                    size="sm"
                    onClick={() => saveDraftMutation.mutate(form)}
                    disabled={saveDraftMutation.isPending}
                    className="gap-1 text-xs cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Draft</span>
                  </ErpButton>
                  <ErpButton
                    variant="primary"
                    size="sm"
                    onClick={() => (record?.status === "executive_review" ? setShowReviewModal(true) : submitMutation.mutate())}
                    disabled={submitMutation.isPending}
                    className="gap-1 text-xs bg-primary text-white cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{record?.status === "executive_review" ? "Committee Review" : "Submit for Review"}</span>
                  </ErpButton>
                </div>
              </div>

              {/* Ribbon Grid */}
              <div className="px-4 py-2.5 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                <div className="flex flex-col gap-0.5 sm:pr-2">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <User className="h-3 w-3 text-slate-400" /> Lead Assessor
                  </span>
                  <span className="font-semibold text-foreground truncate">{form.leadAssessor}</span>
                </div>

                <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" /> Assessment Date
                  </span>
                  <span className="font-semibold text-foreground truncate">{form.assessmentDate}</span>
                </div>

                <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <FlaskConical className="h-3 w-3 text-blue-500" /> Current → Target
                  </span>
                  <span className="font-bold text-primary truncate">TRL {form.currentTrlLevel} → TRL {form.targetTrlLevel}</span>
                </div>

                <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <Award className="h-3 w-3 text-emerald-500" /> Recommended TRL
                  </span>
                  <span className="font-bold text-emerald-600 truncate">TRL {form.recommendedTrlLevel}</span>
                </div>

                <div className="flex flex-col gap-0.5 sm:pl-2 pt-2 sm:pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-primary" /> Overall Maturity
                  </span>
                  <span className="font-bold text-primary truncate">{derivedOverallScore}%</span>
                </div>
              </div>
            </Card>

            {/* Form Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-6">
                {/* TRL Levels Progression Selection */}
                <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-primary" />
                      1. Technology Readiness Levels
                    </h3>
                    <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                      Target: TRL {form.targetTrlLevel}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Current Baseline TRL</label>
                      <select
                        value={form.currentTrlLevel}
                        onChange={(e) => setForm((prev) => ({ ...prev, currentTrlLevel: Number(e.target.value) as TrlLevelNumber }))}
                        className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                      >
                        {TRL_SCALE_GUIDE.map((t) => (
                          <option key={t.level} value={t.level}>TRL {t.level}: {t.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Target Gate TRL</label>
                      <select
                        value={form.targetTrlLevel}
                        onChange={(e) => setForm((prev) => ({ ...prev, targetTrlLevel: Number(e.target.value) as TrlLevelNumber }))}
                        className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                      >
                        {TRL_SCALE_GUIDE.map((t) => (
                          <option key={t.level} value={t.level}>TRL {t.level}: {t.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Assessed Recommended TRL</label>
                      <select
                        value={form.recommendedTrlLevel}
                        onChange={(e) => setForm((prev) => ({ ...prev, recommendedTrlLevel: Number(e.target.value) as TrlLevelNumber }))}
                        className="w-full p-2 text-xs rounded-lg border border-border bg-background font-bold text-emerald-600"
                      >
                        {TRL_SCALE_GUIDE.map((t) => (
                          <option key={t.level} value={t.level}>TRL {t.level}: {t.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1 text-xs">Technology & System Summary</label>
                      <textarea
                        rows={2}
                        value={form.technologySummary}
                        onChange={(e) => setForm((prev) => ({ ...prev, technologySummary: e.target.value }))}
                        className="w-full p-2.5 text-xs rounded-lg border border-border bg-background"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1 text-xs">Assessment Scope & Testing Protocol</label>
                      <textarea
                        rows={2}
                        value={form.assessmentScope}
                        onChange={(e) => setForm((prev) => ({ ...prev, assessmentScope: e.target.value }))}
                        className="w-full p-2.5 text-xs rounded-lg border border-border bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantitative Score Dimensions */}
                <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-emerald-600" />
                      2. Quantitative Readiness Dimensions
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Technical Maturity (35%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={form.technicalMaturityScore}
                        onChange={(e) => setForm((prev) => ({ ...prev, technicalMaturityScore: Number(e.target.value) }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Testing Completeness (30%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={form.testingCompletenessScore}
                        onChange={(e) => setForm((prev) => ({ ...prev, testingCompletenessScore: Number(e.target.value) }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Mfg Readiness (20%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={form.manufacturingReadinessScore}
                        onChange={(e) => setForm((prev) => ({ ...prev, manufacturingReadinessScore: Number(e.target.value) }))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Compliance & Safety (15%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={form.regulatoryComplianceScore}
                        onChange={(e) => setForm((prev) => ({ ...prev, regulatoryComplianceScore: Number(e.target.value) }))}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Findings, Strengths & Gaps */}
                <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                      3. Strengths, Gaps & Advancement Plan
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Key Verified Strengths</label>
                      <textarea
                        rows={2}
                        value={form.keyStrengths?.join("\n")}
                        onChange={(e) => setForm((prev) => ({ ...prev, keyStrengths: e.target.value.split("\n") }))}
                        className="w-full p-2.5 text-xs rounded-lg border border-border bg-background"
                        placeholder="One strength per line..."
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Identified Gaps & Risks</label>
                      <textarea
                        rows={2}
                        value={form.identifiedGaps?.join("\n")}
                        onChange={(e) => setForm((prev) => ({ ...prev, identifiedGaps: e.target.value.split("\n") }))}
                        className="w-full p-2.5 text-xs rounded-lg border border-border bg-background"
                        placeholder="One gap per line..."
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Advancement Action Plan</label>
                      <textarea
                        rows={2}
                        value={form.advancementRecommendations?.join("\n")}
                        onChange={(e) => setForm((prev) => ({ ...prev, advancementRecommendations: e.target.value.split("\n") }))}
                        className="w-full p-2.5 text-xs rounded-lg border border-border bg-background"
                        placeholder="One recommendation per line..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Score Matrix */}
              <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-6 space-y-4">
                  <Card className="border border-border/80 shadow-xs bg-card">
                    <CardHeader className="p-4 pb-2 border-b">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>TRL Readiness Matrix</span>
                        <Award className="h-4 w-4 text-primary" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 text-center space-y-4">
                      <ReadinessGauge percent={derivedOverallScore} />

                      <div className="space-y-2 text-left text-xs border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Technical Maturity</span>
                          <span className="font-bold text-foreground">{form.technicalMaturityScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Testing Completeness</span>
                          <span className="font-bold text-emerald-600">{form.testingCompletenessScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mfg Readiness</span>
                          <span className="font-bold text-blue-600">{form.manufacturingReadinessScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Regulatory Compliance</span>
                          <span className="font-bold text-foreground">{form.regulatoryComplianceScore}/100</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-bold text-primary">
                          <span>Recommended Level</span>
                          <span>TRL {form.recommendedTrlLevel}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decision Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              Technical Review Committee Decision
            </DialogTitle>
            <DialogDescription className="text-xs">
              Submit formal TRL stage-gate sign-off.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <label className="font-semibold block mb-1">Decision:</label>
              <select
                value={reviewDecisionChoice}
                onChange={(e) => setReviewDecisionChoice(e.target.value as TrlApprovalDecision)}
                className="w-full p-2 text-xs rounded-lg border border-border bg-background"
              >
                <option value="Approved">Approved (Authorize TRL Level Gate)</option>
                <option value="Approved with Improvements">Approved with Improvements</option>
                <option value="Revision Required">Revision Required</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Committee Comments:</label>
              <textarea
                rows={3}
                value={reviewCommentsInput}
                onChange={(e) => setReviewCommentsInput(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-border bg-background"
                placeholder="Enter committee sign-off notes and verification comments..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowReviewModal(false)}>Cancel</Button>
            <Button
              size="sm"
              onClick={() => reviewMutation.mutate({ decision: reviewDecisionChoice, comments: reviewCommentsInput })}
              className="bg-primary text-white"
            >
              Submit Decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule TRL Committee Gate
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <label className="font-semibold block mb-1">Select Date:</label>
              <Input type="date" defaultValue="2024-06-15" className="text-xs" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Reviewers & Assessors:</label>
              <Input defaultValue="Dr. Vikram Sharma (Lead), Chief Scientist, VP Engineering" className="text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
            <Button
              size="sm"
              onClick={() => {
                setShowScheduleModal(false);
                toast.success("TRL Gate review meeting scheduled!");
              }}
              className="bg-primary text-white"
            >
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default TrlAssessmentUnifiedPage;
