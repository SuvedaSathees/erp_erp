// Magnertia ERP - Internal Compliance Module
// Management -> Risk Management -> Internal Compliance
// Internal Compliance Form — MAICW Classification, Overview, Widgets, and Controlled Audit Reports

import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getInternalComplianceRecordFn } from "@/lib/internalComplianceFns.server";
import {
  FileText,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Upload,
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  ExternalLink,
  ChevronRight,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Save,
  Send,
  MoreVertical,
  Check,
  X,
  FileCheck,
  Building,
  UserCheck,
  Lock,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Sliders,
  Scale,
  Paperclip,
  History,
  FileSpreadsheet,
  BarChart3,
  Award,
  BookOpen,
  CalendarPlus,
  Tag,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import {
  internalComplianceService,
  PRIMARY_INTERNAL_RECORD,
  FULL_INTERNAL_COMPLIANCE_RECORDS,
  INTERNAL_EXECUTIVE_KPIS,
  INTERNAL_REPORT_DEFINITIONS,
  INTERNAL_KPI_MASTER,
  SOD_MATRIX_DATA,
  type InternalComplianceRecord,
  type InternalReportDefinition,
  type InternalControlItem,
  type InternalAssessmentItem,
  type InternalOpenActionItem,
  type ApplicablePolicySOP,
} from "@/services/internalComplianceService";

export const Route = createFileRoute(
  "/management/risk-management/internal-compliance"
)({
  component: InternalCompliancePage,
  head: () => ({
    meta: [
      { title: "Internal Compliance · Risk Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Internal Compliance Form — MAICW Classification, Policy & SOP Compliance, Controls, SOD Matrix, 19 Controlled Audit Reports, and Internal Governance Intelligence.",
      },
    ],
  }),
});

// All 13 Submodules planned in the rollout
const INTERNAL_SUBMODULE_TABS = [
  { id: "overview", label: "General" },
  { id: "requirements", label: "Requirements" },
  { id: "controls", label: "Controls" },
  { id: "evidence", label: "Evidence" },
  { id: "assessments", label: "Assessments" },
  { id: "audits", label: "Audits" },
  { id: "actions", label: "Actions" },
  { id: "related-records", label: "Related Records" },
  { id: "attachments", label: "Attachments" },
  { id: "history", label: "History" },
  { id: "reports", label: "Reports" },
];

function InternalCompliancePage() {
  const { toast } = useToast();

  // Prisma-backed query with inline fallback
  const { data: dbRecord } = useQuery({
    queryKey: ["internal-compliance", "record"],
    queryFn: () => getInternalComplianceRecordFn({ data: {} }),
  });

  // Active record state (matches screenshot by default)
  const [activeRecord, setActiveRecord] = useState<InternalComplianceRecord>(
    internalComplianceService.getPrimaryRecord()
  );
  useEffect(() => { if (dbRecord?.data) setActiveRecord(dbRecord.data as InternalComplianceRecord); }, [dbRecord]);

  // Tab state: "overview" (General) or "reports" (Reports)
  const [activeSubmodule, setActiveSubmodule] = useState<string>("overview");

  // Search in top header
  const [globalSearch, setGlobalSearch] = useState<string>("");

  // Report state
  const [selectedReportId, setSelectedReportId] = useState<string>("IREP-01");
  const [reportCategoryFilter, setReportCategoryFilter] = useState<string>("All");
  const [reportSearchQuery, setReportSearchQuery] = useState<string>("");
  const [reportDateRange, setReportDateRange] = useState<string>("Q1 2026");

  // Modals state
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [isScheduleAuditOpen, setIsScheduleAuditOpen] = useState(false);
  const [isCreateActionOpen, setIsCreateActionOpen] = useState(false);
  const [isAddExceptionOpen, setIsAddExceptionOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  const [isViewPolicyModalOpen, setIsViewPolicyModalOpen] = useState(false);

  // Modals form states
  const [newEvidence, setNewEvidence] = useState({
    title: "",
    type: "Approval Record",
    date: new Date().toISOString().split("T")[0],
    owner: activeRecord.controlOwner,
  });

  const [newAudit, setNewAudit] = useState({
    scope: "Procurement & Delegation of Authority",
    auditor: "Internal Audit Team",
    date: "10-Jun-2026",
    sampleSize: "50 Transactions",
  });

  const [newAction, setNewAction] = useState({
    id: `A-00${activeRecord.openActions.length + 1}`,
    description: "",
    owner: activeRecord.controlOwner,
    dueDate: "30-Apr-2026",
    status: "Open" as InternalOpenActionItem["status"],
  });

  const [newException, setNewException] = useState({
    reason: "",
    risk: "Medium",
    compensatingControl: "",
    approver: "Chief Financial Officer",
    expiryDate: "30-Jun-2026",
  });

  // Selected report object
  const currentReport = useMemo(() => {
    return (
      INTERNAL_REPORT_DEFINITIONS.find((r) => r.id === selectedReportId) ||
      INTERNAL_REPORT_DEFINITIONS[0]
    );
  }, [selectedReportId]);

  // Filtered reports
  const filteredReportsList = useMemo(() => {
    return INTERNAL_REPORT_DEFINITIONS.filter((r) => {
      const matchesCat =
        reportCategoryFilter === "All" || r.category === reportCategoryFilter;
      const matchesSearch =
        r.title.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
        r.purpose.toLowerCase().includes(reportSearchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [reportCategoryFilter, reportSearchQuery]);

  // Save handler
  const handleSave = () => {
    internalComplianceService.saveRecord(activeRecord);
    toast({
      title: "Internal Compliance Saved",
      description: `Record ${activeRecord.id} (${activeRecord.complianceName}) updated successfully.`,
    });
  };

  // Submit workflow handler
  const handleSubmit = () => {
    toast({
      title: "Internal Compliance Submitted",
      description: `Dispatched ${activeRecord.id} to Internal Audit Committee & Process Head.`,
    });
  };

  // Add Evidence Submit
  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.title) return;
    const newEv = {
      id: `EVD-00${activeRecord.evidence.length + 1}`,
      name: newEvidence.title,
      type: newEvidence.type,
      date: newEvidence.date,
      expiryDate: "-",
      issuer: newEvidence.owner,
      status: "Verified" as const,
    };
    const updated = {
      ...activeRecord,
      evidence: [newEv, ...activeRecord.evidence],
    };
    setActiveRecord(updated);
    internalComplianceService.saveRecord(updated);
    setIsAddEvidenceOpen(false);
    toast({
      title: "Evidence Cataloged",
      description: `Evidence '${newEvidence.title}' stored in internal compliance vault with digital signature.`,
    });
  };

  // Schedule Audit Submit
  const handleScheduleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAudItem = {
      id: `IA-2026-0${activeRecord.internalAudits.length + 1}`,
      date: newAudit.date,
      auditor: newAudit.auditor,
      scope: newAudit.scope,
      result: "Scheduled" as const,
      findings: 0,
    };
    const updated = {
      ...activeRecord,
      internalAudits: [newAudItem, ...activeRecord.internalAudits],
    };
    setActiveRecord(updated);
    internalComplianceService.saveRecord(updated);
    setIsScheduleAuditOpen(false);
    toast({
      title: "Internal Audit Scheduled",
      description: `Audit scheduled for ${newAudit.date} by ${newAudit.auditor}.`,
    });
  };

  // Create Action Submit
  const handleCreateActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.description) return;
    const updated = {
      ...activeRecord,
      openActions: [...activeRecord.openActions, { ...newAction }],
    };
    setActiveRecord(updated);
    internalComplianceService.saveRecord(updated);
    setIsCreateActionOpen(false);
    setNewAction({
      id: `A-00${updated.openActions.length + 1}`,
      description: "",
      owner: activeRecord.controlOwner,
      dueDate: "30-Apr-2026",
      status: "Open",
    });
    toast({
      title: "Corrective Action Created",
      description: `Action ${newAction.id} assigned to ${newAction.owner}.`,
    });
  };

  // Add Exception Submit
  const handleAddExceptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddExceptionOpen(false);
    toast({
      title: "Policy Exception Logged",
      description: `Temporary exception requested. Compensating control logged.`,
    });
  };

  // Export CSV Handler for current report
  const handleExportCSV = (report: InternalReportDefinition) => {
    const headers = report.columns.join(",");
    const rows = report.sampleData.map((row) =>
      report.columns
        .map((col) => {
          const val = row[col] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Magnertia_${report.code}_${report.title.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Exported",
      description: `Downloaded ${report.sampleData.length} records as CSV.`,
    });
  };

  // 5x5 Heatmap data
  const heatmapData = [
    { likelihood: 5, scores: [5, 10, 15, 20, 25], counts: [0, 1, 3, 1, 0] },
    { likelihood: 4, scores: [4, 8, 12, 16, 20], counts: [1, 4, 5, 2, 1] },
    { likelihood: 3, scores: [3, 6, 9, 12, 15], counts: [3, 6, 4, 1, 0] },
    { likelihood: 2, scores: [2, 4, 6, 8, 10], counts: [5, 4, 2, 0, 0] },
    { likelihood: 1, scores: [1, 2, 3, 4, 5], counts: [7, 3, 1, 0, 0] },
  ];

  // Chart data for domain distribution
  const domainChartData = [
    { name: "Procurement", count: 8, fill: "#0A3C75" },
    { name: "IT & Cyber", count: 7, fill: "#336B9F" },
    { name: "Quality", count: 6, fill: "#729FC9" },
    { name: "Finance", count: 5, fill: "#10B981" },
    { name: "HR", count: 4, fill: "#8B5CF6" },
    { name: "Operations", count: 4, fill: "#F59E0B" },
  ];

  return (
    <AppShell
      title="Internal Compliance"
      breadcrumb="Management > Compliance > Internal Compliance"
      description="Internal policy adherence, corporate governance charters, delegation of powers, and code of conduct."
      tabs={<ComplianceTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* =========================================================================
            1. TOP HEADER BANNER (EXACT 1:1 MATCH TO SCREENSHOT)
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card p-4 sm:p-5 rounded-2xl border border-border/80 shadow-xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground whitespace-nowrap">
                  Internal Compliance
                </h1>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-300 font-bold px-2.5 py-0.5 text-xs flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </Badge>
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                  {activeRecord.id}
                </span>
                <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                  v{activeRecord.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Comply Within. Operate Stronger.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            {/* Search Input matching screenshot top right */}
            <div className="relative w-48 sm:w-64 hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search policies, controls, processes..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-background/80 border-border/80"
              />
            </div>

            {/* Save Button */}
            <Button
              size="sm"
              className="h-8 text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-2xs shrink-0"
              onClick={handleSave}
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>

            {/* Submit Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 border-border shrink-0"
              onClick={handleSubmit}
            >
              <Send className="h-3.5 w-3.5 text-muted-foreground" />
              Submit
            </Button>

            {/* Generate Report Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 bg-primary/5 text-primary border-primary/25 hover:bg-primary/15 shrink-0"
              onClick={() => {
                setActiveSubmodule("reports");
                setIsGenerateReportModalOpen(true);
              }}
            >
              <FileText className="h-3.5 w-3.5" />
              Generate Report
            </Button>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-medium border-border gap-1 shrink-0"
                >
                  More Actions
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs w-56">
                <DropdownMenuItem onClick={() => setActiveSubmodule("reports")}>
                  <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-primary" /> View 19 Audit Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsScheduleAuditOpen(true)}>
                  <Calendar className="h-3.5 w-3.5 mr-2 text-blue-600" /> Schedule Internal Audit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddExceptionOpen(true)}>
                  <AlertTriangle className="h-3.5 w-3.5 mr-2 text-amber-600" /> Log Policy Exception
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportCSV(currentReport)}>
                  <Download className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> Export Compliance CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5 mr-2 text-muted-foreground" /> Print Governance Dossier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "SOD Conflict Scan Complete",
                      description: "Zero unmitigated Segregation of Duties conflicts found across ERP users.",
                    });
                  }}
                >
                  <ShieldCheck className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Run Automated SOD Scan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* =========================================================================
            EXECUTIVE 6 KPI METRIC WIDGETS (EXACT SCREENSHOT LAYOUT)
            ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Widget 1: Total Requirements */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 12%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">32</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Total Requirements
              </div>
            </div>
          </Card>

          {/* Widget 2: Non-Compliant */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-red-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-red-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 200%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">3</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Non-Compliant
              </div>
            </div>
          </Card>

          {/* Widget 3: Due in 30 Days */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 67%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">5</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Due in 30 Days
              </div>
            </div>
          </Card>

          {/* Widget 4: Compliant */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 33%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">24</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Compliant
              </div>
            </div>
          </Card>

          {/* Widget 5: Open Actions */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <FileCheck className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingDown className="h-3 w-3" /> 25%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">6</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Open Actions
              </div>
            </div>
          </Card>

          {/* Widget 6: Compliance Readiness */}
          <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 8%
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xl font-extrabold text-foreground tabular">92%</div>
              <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                Compliance Readiness
              </div>
            </div>
          </Card>
        </div>

        {/* =========================================================================
            TOP ENTERPRISE CONTEXT (DEDUPLICATED SCOPE - NO REPETITIVE INPUT CLUTTER)
            ========================================================================= */}
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-card border border-border/80 shadow-2xs text-xs flex-wrap">
          <div className="flex items-center gap-2 text-foreground font-semibold flex-wrap">
            <Building className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Magnertia Enterprise</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-normal">Plant: <strong className="text-foreground">Sanand Mega-Plant 01</strong></span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-normal">Dept: <strong className="text-foreground">Internal Governance & Controls</strong></span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-normal">Cost Center: <strong className="font-mono text-primary">CC-INT-702</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 font-bold bg-emerald-50/50">
              Deduplicated Scope
            </Badge>
            <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-300 font-bold bg-blue-50/50">
              Active Form: {INTERNAL_SUBMODULE_TABS.find(t => t.id === activeSubmodule)?.label || "General"}
            </Badge>
            {activeSubmodule !== "overview" && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[11px] px-2 font-semibold text-primary hover:bg-primary/10 gap-1 cursor-pointer"
                onClick={() => setActiveSubmodule("overview")}
              >
                ← Back to General
              </Button>
            )}
          </div>
        </div>

        {/* =========================================================================
            SUBMODULE 1: GENERAL / OVERVIEW (PIXEL-PERFECT MATCH TO SCREENSHOT)
            ========================================================================= */}
        {activeSubmodule === "overview" && (
          <div className="space-y-4">
            {/* ROW 1: 1. INTERNAL COMPLIANCE INFORMATION (LEFT 7 COLS) + 2. COMPLIANCE OVERVIEW & TIMELINE (RIGHT 5 COLS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* LEFT COLUMN: 1. Internal Compliance Information (MAICW) */}
              <div className="lg:col-span-7">
                <Card className="border-border/80 shadow-2xs bg-card h-full">
                  <CardHeader className="py-3 px-4 border-b border-border/60">
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>1. Internal Compliance Information</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                          MAICW Classification
                        </span>
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        ID: <strong className="text-foreground">{activeRecord.id}</strong>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {/* Row 1: ID, Code, Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Internal Compliance ID
                          <span className="text-[9px] text-primary font-bold">(A)</span>
                        </Label>
                        <Input
                          readOnly
                          value={activeRecord.id}
                          className="h-8 text-xs font-medium bg-muted/30 mt-1 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Compliance Code *
                          <span className="text-[9px] text-primary font-bold">(A)</span>
                        </Label>
                        <Input
                          value={activeRecord.complianceCode}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, complianceCode: e.target.value })
                          }
                          className="h-8 text-xs font-medium mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Compliance Name *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <Input
                          value={activeRecord.complianceName}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, complianceName: e.target.value })
                          }
                          className="h-8 text-xs font-medium mt-1"
                        />
                      </div>
                    </div>

                    {/* Row 2: Type, Domain, Policy */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Compliance Type *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <Select
                          value={activeRecord.complianceType}
                          onValueChange={(val: any) =>
                            setActiveRecord({ ...activeRecord, complianceType: val })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs font-medium mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Process">Process</SelectItem>
                            <SelectItem value="Policy">Policy</SelectItem>
                            <SelectItem value="SOP">SOP</SelectItem>
                            <SelectItem value="Control">Control</SelectItem>
                            <SelectItem value="Governance">Governance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Compliance Domain *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <Select
                          value={activeRecord.complianceDomain}
                          onValueChange={(val) =>
                            setActiveRecord({ ...activeRecord, complianceDomain: val })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs font-medium mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Procurement">Procurement</SelectItem>
                            <SelectItem value="Corporate Governance">Corporate Governance</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Quality">Quality</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="IT & Cybersecurity">IT & Cybersecurity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Policy *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <Input
                          value={activeRecord.policy}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, policy: e.target.value })
                          }
                          className="h-8 text-xs font-medium mt-1 truncate"
                        />
                      </div>
                    </div>

                    {/* Row 3: Function, Department, Process */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Business Function *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <Input
                          value={activeRecord.businessFunction}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, businessFunction: e.target.value })
                          }
                          className="h-8 text-xs font-medium mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Department *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <Input
                          value={activeRecord.department}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, department: e.target.value })
                          }
                          className="h-8 text-xs font-medium mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Process *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <Input
                          value={activeRecord.process}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, process: e.target.value })
                          }
                          className="h-8 text-xs font-medium mt-1"
                        />
                      </div>
                    </div>

                    {/* Row 4: Owners and Effective Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Control Owner *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <div className="relative mt-1">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                            {activeRecord.controlOwnerAvatar}
                          </span>
                          <Input
                            value={activeRecord.controlOwner}
                            onChange={(e) =>
                              setActiveRecord({ ...activeRecord, controlOwner: e.target.value })
                            }
                            className="h-8 text-xs font-medium pl-8"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Compliance Coordinator *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <div className="relative mt-1">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-purple-600 text-[10px] font-bold text-white flex items-center justify-center">
                            {activeRecord.complianceCoordinatorAvatar}
                          </span>
                          <Input
                            value={activeRecord.complianceCoordinator}
                            onChange={(e) =>
                              setActiveRecord({
                                ...activeRecord,
                                complianceCoordinator: e.target.value,
                              })
                            }
                            className="h-8 text-xs font-medium pl-8"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Effective Date *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            value={activeRecord.effectiveDate}
                            onChange={(e) =>
                              setActiveRecord({ ...activeRecord, effectiveDate: e.target.value })
                            }
                            className="h-8 text-xs font-medium pr-8"
                          />
                          <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Row 5: Review Date, Due Date, Status, Priority */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Review Date *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            value={activeRecord.reviewDate}
                            onChange={(e) =>
                              setActiveRecord({ ...activeRecord, reviewDate: e.target.value })
                            }
                            className="h-8 text-xs font-medium pr-7"
                          />
                          <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Due Date *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            value={activeRecord.dueDate}
                            onChange={(e) =>
                              setActiveRecord({ ...activeRecord, dueDate: e.target.value })
                            }
                            className="h-8 text-xs font-medium pr-7"
                          />
                          <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Status *
                          <span className="text-[9px] text-primary font-bold">(W)</span>
                        </Label>
                        <Select
                          value={activeRecord.status}
                          onValueChange={(val: any) =>
                            setActiveRecord({ ...activeRecord, status: val })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs font-medium mt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Due">Due</SelectItem>
                            <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                          Priority *
                          <span className="text-[9px] text-red-500 font-bold">(M)</span>
                        </Label>
                        <Select
                          value={activeRecord.priority}
                          onValueChange={(val: any) =>
                            setActiveRecord({ ...activeRecord, priority: val })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs font-medium mt-1 text-red-600 font-semibold">
                            <div className="flex items-center gap-1">
                              <span className="text-red-500">↑</span>
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Row 6: Version, Confidentiality, Tags */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                      <div className="sm:col-span-2">
                        <Label className="text-[11px] font-semibold text-muted-foreground">Version</Label>
                        <Input
                          readOnly
                          value={activeRecord.version}
                          className="h-8 text-xs font-medium bg-muted/30 mt-1 cursor-not-allowed"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <Label className="text-[11px] font-semibold text-muted-foreground">Confidentiality</Label>
                        <Select
                          value={activeRecord.confidentiality}
                          onValueChange={(val: any) =>
                            setActiveRecord({ ...activeRecord, confidentiality: val })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs font-medium mt-1">
                            <div className="flex items-center gap-1.5">
                              <Lock className="h-3 w-3 text-muted-foreground" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Internal">Internal</SelectItem>
                            <SelectItem value="Confidential">Confidential</SelectItem>
                            <SelectItem value="Restricted">Restricted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="sm:col-span-6">
                        <Label className="text-[11px] font-semibold text-muted-foreground">Tags</Label>
                        <div className="flex items-center gap-1.5 mt-1">
                          {activeRecord.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-[10px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50 gap-1 px-2 py-0.5"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveRecord({
                                    ...activeRecord,
                                    tags: activeRecord.tags.filter((_, i) => i !== idx),
                                  });
                                }}
                                className="text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newTag = prompt("Enter tag name:");
                              if (newTag && !activeRecord.tags.includes(newTag)) {
                                setActiveRecord({
                                  ...activeRecord,
                                  tags: [...activeRecord.tags, newTag],
                                });
                              }
                            }}
                            className="h-6 px-1.5 rounded border border-dashed border-border text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            + Tag
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT COLUMN: 2. Compliance Overview + Workflow + Key Dates + Quick Actions */}
              <div className="lg:col-span-5 space-y-4">
                {/* 2. Compliance Overview */}
                <Card className="border-border/80 shadow-2xs bg-card">
                  <CardHeader className="py-3 px-4 border-b border-border/60">
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                      <span>2. Compliance Overview</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px] font-bold">
                        {activeRecord.applicability}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        Internal Requirement
                      </Label>
                      <Textarea
                        rows={2}
                        value={activeRecord.internalRequirement}
                        onChange={(e) =>
                          setActiveRecord({ ...activeRecord, internalRequirement: e.target.value })
                        }
                        className="text-xs mt-1 resize-none bg-muted/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">
                          Business Objective
                        </Label>
                        <Input
                          value={activeRecord.businessObjective}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, businessObjective: e.target.value })
                          }
                          className="h-8 text-xs mt-1 truncate"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">
                          Current Status
                        </Label>
                        <Select
                          value={activeRecord.currentStatus}
                          onValueChange={(val: any) =>
                            setActiveRecord({ ...activeRecord, currentStatus: val })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs mt-1 text-emerald-600 font-semibold">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Compliant">Compliant</SelectItem>
                            <SelectItem value="Partially Compliant">Partially Compliant</SelectItem>
                            <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                            <SelectItem value="Requires Review">Requires Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">
                          Control Requirement
                        </Label>
                        <Input
                          value={activeRecord.controlRequirement}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, controlRequirement: e.target.value })
                          }
                          className="h-8 text-xs mt-1 truncate"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">
                          Evidence Required
                        </Label>
                        <Input
                          value={activeRecord.evidenceRequired}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, evidenceRequired: e.target.value })
                          }
                          className="h-8 text-xs mt-1 truncate"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">
                          Monitoring Frequency
                        </Label>
                        <Select
                          value={activeRecord.monitoringFrequency}
                          onValueChange={(val: any) =>
                            setActiveRecord({ ...activeRecord, monitoringFrequency: val })
                          }
                        >
                          <SelectTrigger className="h-8 text-xs mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Real-time">Real-time</SelectItem>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Annual">Annual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">
                          Review Frequency
                        </Label>
                        <Input
                          value={activeRecord.reviewFrequency}
                          onChange={(e) =>
                            setActiveRecord({ ...activeRecord, reviewFrequency: e.target.value })
                          }
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Workflow Card */}
                <Card className="border-border/80 shadow-2xs bg-card p-3.5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-foreground">Compliance Workflow</span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 font-semibold bg-emerald-500/5">
                      Stage: Monitor
                    </Badge>
                  </div>

                  {/* Horizontal Stepper */}
                  <div className="relative flex items-center justify-between px-3 pt-2 pb-4">
                    <div className="absolute left-6 right-6 top-4.5 h-0.5 bg-muted -translate-y-1/2 z-0" />
                    <div
                      className="absolute left-6 top-4.5 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all"
                      style={{ width: "60%" }}
                    />

                    {["Define", "Implement", "Monitor", "Audit", "Close"].map((step, idx) => {
                      const isDone = idx < 2;
                      const isCurrent = idx === 2;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div
                            className={cn(
                              "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                              isDone
                                ? "bg-emerald-500 text-white"
                                : isCurrent
                                ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {isDone ? <Check className="h-3 w-3" /> : idx + 1}
                          </div>
                          <span
                            className={cn(
                              "text-[10px] font-semibold mt-1",
                              isCurrent ? "text-emerald-600 font-bold" : "text-muted-foreground"
                            )}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* On Track Banner */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-300/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <div>
                        <strong className="font-bold mr-1">On Track</strong>
                        <span>Next review due in {activeRecord.reviewDueCountdownDays} days ({activeRecord.reviewDueDateFormatted})</span>
                      </div>
                    </div>
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                </Card>

                {/* Key Dates & Quick Actions side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Key Dates Card */}
                  <Card className="border-border/80 shadow-2xs bg-card p-3 space-y-2">
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5 pb-1 border-b border-border/60">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      Key Dates
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Effective Date</span>
                        <span className="font-medium text-foreground">{activeRecord.effectiveDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Review Date</span>
                        <span className="font-medium text-foreground">{activeRecord.reviewDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date</span>
                        <span className="font-semibold text-red-600">{activeRecord.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Assessment</span>
                        <span className="font-medium text-foreground">{activeRecord.lastAssessmentDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Audit</span>
                        <span className="font-semibold text-primary">{activeRecord.nextAuditDate}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Actions Card */}
                  <Card className="border-border/80 shadow-2xs bg-card p-3 space-y-1.5">
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5 pb-1 border-b border-border/60">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Quick Actions
                    </div>
                    <div className="flex flex-col gap-1 pt-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 justify-start text-[11px] font-medium px-2 hover:bg-primary/10 hover:text-primary gap-1.5"
                        onClick={() => setIsAddEvidenceOpen(true)}
                      >
                        <Upload className="h-3.5 w-3.5 text-blue-600" />
                        Add Evidence
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 justify-start text-[11px] font-medium px-2 hover:bg-primary/10 hover:text-primary gap-1.5"
                        onClick={() => setIsScheduleAuditOpen(true)}
                      >
                        <CalendarPlus className="h-3.5 w-3.5 text-emerald-600" />
                        Schedule Audit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 justify-start text-[11px] font-medium px-2 hover:bg-primary/10 hover:text-primary gap-1.5"
                        onClick={() => setIsCreateActionOpen(true)}
                      >
                        <Plus className="h-3.5 w-3.5 text-amber-600" />
                        Create Action
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 justify-start text-[11px] font-medium px-2 hover:bg-primary/10 hover:text-primary gap-1.5"
                        onClick={() => setIsAddExceptionOpen(true)}
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-purple-600" />
                        Add Exception
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 justify-start text-[11px] font-medium px-2 hover:bg-primary/10 hover:text-primary gap-1.5"
                        onClick={() => setIsViewPolicyModalOpen(true)}
                      >
                        <BookOpen className="h-3.5 w-3.5 text-slate-500" />
                        View Policy
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* ROW 2: 3. APPLICABLE POLICIES & SOPS (LEFT) + 4. CONTROLS (MIDDLE) + 5. COMPLIANCE RISK (RIGHT) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* 3. Applicable Policies & SOPs (4 cols) */}
              <div className="md:col-span-4">
                <Card className="border-border/80 shadow-2xs bg-card h-full flex flex-col justify-between">
                  <div>
                    <CardHeader className="py-2.5 px-3.5 border-b border-border/60 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold">3. Applicable Policies & SOPs</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[11px] font-semibold text-primary px-1.5 hover:bg-primary/10"
                        onClick={() => setIsViewPolicyModalOpen(true)}
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-[11px] text-left">
                        <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                          <tr>
                            <th className="py-2 px-3">Policy / SOP</th>
                            <th className="py-2 px-2">Type</th>
                            <th className="py-2 px-2">Version</th>
                            <th className="py-2 px-2">Effective Date</th>
                            <th className="py-2 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {activeRecord.policiesAndSops.map((p) => (
                            <tr key={p.id} className="hover:bg-muted/30">
                              <td className="py-2 px-3 font-semibold text-foreground">
                                {p.name}
                              </td>
                              <td className="py-2 px-2 text-muted-foreground">{p.type}</td>
                              <td className="py-2 px-2 font-mono text-[10px]">{p.version}</td>
                              <td className="py-2 px-2 text-muted-foreground">{p.effectiveDate}</td>
                              <td className="py-2 px-3 text-right">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* 4. Controls (4 cols) */}
              <div className="md:col-span-4">
                <Card className="border-border/80 shadow-2xs bg-card h-full flex flex-col justify-between">
                  <div>
                    <CardHeader className="py-2.5 px-3.5 border-b border-border/60 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold">4. Controls</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[11px] font-semibold text-primary px-1.5 hover:bg-primary/10"
                        onClick={() => {
                          setSelectedReportId("IREP-04");
                          setActiveSubmodule("reports");
                        }}
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-[11px] text-left">
                        <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                          <tr>
                            <th className="py-2 px-3">Control ID</th>
                            <th className="py-2 px-2">Control Description</th>
                            <th className="py-2 px-2">Type</th>
                            <th className="py-2 px-2">Frequency</th>
                            <th className="py-2 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {activeRecord.controls.map((c) => (
                            <tr key={c.id} className="hover:bg-muted/30">
                              <td className="py-2 px-3 font-mono font-bold text-foreground">
                                {c.id}
                              </td>
                              <td className="py-2 px-2 text-foreground truncate max-w-[110px]">
                                {c.name}
                              </td>
                              <td className="py-2 px-2 text-muted-foreground text-[10px]">{c.type}</td>
                              <td className="py-2 px-2 text-muted-foreground text-[10px]">{c.frequency}</td>
                              <td className="py-2 px-3 text-right">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  {c.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* 5. Compliance Risk (4 cols) */}
              <div className="md:col-span-4">
                <Card className="border-border/80 shadow-2xs bg-card h-full p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span className="text-xs font-bold text-foreground">5. Compliance Risk</span>
                      <span className="text-[10px] text-muted-foreground font-mono">Likelihood × Impact</span>
                    </div>

                    {/* 4 Score Widgets */}
                    <div className="grid grid-cols-4 gap-2 my-3 text-center">
                      <div className="p-2 rounded-lg bg-red-500/10 border border-red-200">
                        <div className="text-[10px] font-semibold text-muted-foreground">Risk Rating</div>
                        <div className="text-xs font-black text-red-600 mt-0.5">
                          {activeRecord.riskRating}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/40 border border-border/60">
                        <div className="text-[10px] font-semibold text-muted-foreground">Likelihood</div>
                        <div className="text-xs font-black text-foreground mt-0.5">
                          {activeRecord.likelihood}/5
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/40 border border-border/60">
                        <div className="text-[10px] font-semibold text-muted-foreground">Impact</div>
                        <div className="text-xs font-black text-foreground mt-0.5">
                          {activeRecord.impact}/5
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-red-500/10 border border-red-200">
                        <div className="text-[10px] font-semibold text-muted-foreground">Score</div>
                        <div className="text-sm font-black text-red-600 mt-0.5">
                          {activeRecord.riskScore}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div>
                        <span className="font-semibold text-foreground">Key Risk: </span>
                        <span className="text-muted-foreground">{activeRecord.keyRisk}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">Mitigation: </span>
                        <span className="text-muted-foreground">{activeRecord.mitigation}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* ROW 3: 6. RECENT ASSESSMENTS (4 cols) + 7. OPEN ACTIONS (4 cols) + 8. COMPLIANCE TIMELINE (4 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* 6. Recent Assessments (4 cols) */}
              <div className="md:col-span-4">
                <Card className="border-border/80 shadow-2xs bg-card h-full flex flex-col justify-between">
                  <div>
                    <CardHeader className="py-2.5 px-3.5 border-b border-border/60 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold">6. Recent Assessments</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[11px] font-semibold text-primary px-1.5 hover:bg-primary/10"
                        onClick={() => {
                          setSelectedReportId("IREP-06");
                          setActiveSubmodule("reports");
                        }}
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-[11px] text-left">
                        <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                          <tr>
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-2">Type</th>
                            <th className="py-2 px-2">Assessor</th>
                            <th className="py-2 px-2">Result</th>
                            <th className="py-2 px-3 text-right">Findings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {activeRecord.recentAssessments.map((a) => (
                            <tr key={a.id} className="hover:bg-muted/30">
                              <td className="py-2 px-3 font-mono text-[10px] text-muted-foreground">
                                {a.date}
                              </td>
                              <td className="py-2 px-2 font-medium text-foreground">{a.type}</td>
                              <td className="py-2 px-2 text-muted-foreground">{a.assessor}</td>
                              <td className="py-2 px-2">
                                <Badge
                                  className={cn(
                                    "text-[9px] px-1.5 py-0 font-bold",
                                    a.result === "Compliant"
                                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                                      : "bg-amber-500/10 text-amber-600 border-amber-300"
                                  )}
                                >
                                  {a.result}
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                                {a.findings}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* 7. Open Actions (4 cols) */}
              <div className="md:col-span-4">
                <Card className="border-border/80 shadow-2xs bg-card h-full flex flex-col justify-between">
                  <div>
                    <CardHeader className="py-2.5 px-3.5 border-b border-border/60 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold">7. Open Actions</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[11px] font-semibold text-primary px-1.5 hover:bg-primary/10"
                        onClick={() => {
                          setSelectedReportId("IREP-14");
                          setActiveSubmodule("reports");
                        }}
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-[11px] text-left">
                        <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-semibold">
                          <tr>
                            <th className="py-2 px-3">Action ID</th>
                            <th className="py-2 px-2">Description</th>
                            <th className="py-2 px-2">Owner</th>
                            <th className="py-2 px-2">Due Date</th>
                            <th className="py-2 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {activeRecord.openActions.map((act) => (
                            <tr key={act.id} className="hover:bg-muted/30">
                              <td className="py-2 px-3 font-mono font-bold text-foreground">
                                {act.id}
                              </td>
                              <td className="py-2 px-2 font-medium text-foreground truncate max-w-[120px]">
                                {act.description}
                              </td>
                              <td className="py-2 px-2 text-muted-foreground">{act.owner}</td>
                              <td className="py-2 px-2 text-muted-foreground font-mono text-[10px]">
                                {act.dueDate}
                              </td>
                              <td className="py-2 px-3 text-right">
                                <Badge
                                  className={cn(
                                    "text-[9px] px-1.5 py-0 font-bold",
                                    act.status === "Open"
                                      ? "bg-red-500/10 text-red-600 border-red-300"
                                      : "bg-blue-500/10 text-blue-600 border-blue-300"
                                  )}
                                >
                                  {act.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* 8. Compliance Timeline (4 cols) */}
              <div className="md:col-span-4">
                <Card className="border-border/80 shadow-2xs bg-card h-full p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2">
                      <span className="text-xs font-bold text-foreground">8. Compliance Timeline</span>
                      <span className="text-[10px] text-muted-foreground">Milestones</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {activeRecord.timelineMilestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full shrink-0",
                              milestone.statusColor
                            )}
                          />
                          <span className="font-mono text-[10px] text-muted-foreground w-20 shrink-0">
                            {milestone.date}
                          </span>
                          <span className="text-foreground text-[11px] truncate">
                            {milestone.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 2: REQUIREMENTS & POLICIES
            ========================================================================= */}
        {activeSubmodule === "requirements" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Internal Policy & SOP Requirements Register
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Mandatory standards, operating procedures, and governance directives for {activeRecord.complianceName}.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    const newReq = {
                      id: `POL-00${activeRecord.applicablePolicies.length + 1}`,
                      name: "Enterprise Delegation of Authority & Approval Thresholds v2.1",
                      type: "Policy" as const,
                      version: "2.1",
                      effectiveDate: "01-Jan-2026",
                      status: "Active" as const,
                      owner: activeRecord.controlOwner,
                    };
                    const updated = {
                      ...activeRecord,
                      applicablePolicies: [...activeRecord.applicablePolicies, newReq],
                    };
                    setActiveRecord(updated);
                    toast({
                      title: "Policy Requirement Added",
                      description: "New governance requirement linked successfully.",
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Link Requirement
                </Button>
              </div>

              <div className="space-y-2">
                {activeRecord.applicablePolicies.map((pol) => (
                  <div
                    key={pol.id}
                    className="p-3.5 rounded-lg border border-border/60 flex items-center justify-between gap-4 bg-muted/20 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {pol.id}
                      </span>
                      <div>
                        <p className="font-bold text-foreground">{pol.name}</p>
                        <span className="text-[11px] text-muted-foreground">
                          Type: {pol.type} • Version: {pol.version} • Effective: {pol.effectiveDate}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300 font-bold bg-emerald-50/40">
                      {pol.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 3: CONTROLS REGISTER
            ========================================================================= */}
        {activeSubmodule === "controls" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Internal Controls & Testing Effectiveness Matrix
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Preventive, detective, and automated control points enforcing internal compliance.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    const newCtrl = {
                      id: `CTL-00${activeRecord.controls.length + 1}`,
                      name: "Dual Verification for High-Value Wire Transfers > ₹ 1,000,000",
                      type: "Preventive" as const,
                      frequency: "Real-time" as const,
                      status: "Effective" as const,
                      owner: activeRecord.controlOwner,
                    };
                    const updated = {
                      ...activeRecord,
                      controls: [...activeRecord.controls, newCtrl],
                    };
                    setActiveRecord(updated);
                    toast({
                      title: "Control Activated",
                      description: "New preventive control registered in internal matrix.",
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Control Point
                </Button>
              </div>

              <div className="space-y-2">
                {activeRecord.controls.map((ctrl) => (
                  <div
                    key={ctrl.id}
                    className="p-3.5 rounded-lg border border-border/60 flex items-center justify-between gap-4 bg-muted/20 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{ctrl.id}</span>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {ctrl.type}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {ctrl.frequency}
                        </Badge>
                      </div>
                      <p className="font-semibold text-foreground mt-1">{ctrl.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        const updatedControls = activeRecord.controls.map((c) =>
                          c.id === ctrl.id
                            ? {
                                ...c,
                                status:
                                  c.status === "Effective"
                                    ? ("Partially Effective" as const)
                                    : c.status === "Partially Effective"
                                    ? ("Ineffective" as const)
                                    : ("Effective" as const),
                              }
                            : c
                        );
                        setActiveRecord({ ...activeRecord, controls: updatedControls });
                        toast({
                          title: "Control State Cycled",
                          description: `${ctrl.id} status updated.`,
                        });
                      }}
                      className="cursor-pointer"
                    >
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-bold transition-all",
                          ctrl.status === "Effective"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                            : ctrl.status === "Partially Effective"
                            ? "bg-amber-500/10 text-amber-600 border-amber-300"
                            : "bg-red-500/10 text-red-600 border-red-300"
                        )}
                      >
                        {ctrl.status} ↻
                      </Badge>
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 4: EVIDENCE VAULT
            ========================================================================= */}
        {activeSubmodule === "evidence" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Controlled Internal Compliance Evidence Vault
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Attested sign-off logs, approval tickets, and electronic audit trails.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsAddEvidenceOpen(true)}
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Evidence Proof
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Evidence ID</th>
                      <th className="py-2.5 px-3">Title / Document</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Recorded Date</th>
                      <th className="py-2.5 px-3">Custodian</th>
                      <th className="py-2.5 px-3">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {activeRecord.evidence.map((ev) => (
                      <tr key={ev.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{ev.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{ev.name}</td>
                        <td className="py-2.5 px-3">{ev.type}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{ev.date}</td>
                        <td className="py-2.5 px-3">{ev.issuer}</td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-300">
                            {ev.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 5: ASSESSMENTS
            ========================================================================= */}
        {activeSubmodule === "assessments" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Self-Assessments & Supervisory Reviews
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Periodic operational verification cycles conducted by department process heads.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    toast({
                      title: "Assessment Initialized",
                      description: "Q2 2026 self-assessment docket generated for process owner.",
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Initiate Self-Assessment
                </Button>
              </div>

              <div className="space-y-2">
                {activeRecord.assessments.map((ass) => (
                  <div
                    key={ass.id}
                    className="p-3.5 rounded-lg border border-border/60 flex items-center justify-between gap-4 bg-muted/20 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{ass.id}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {ass.type}
                        </Badge>
                        <span className="text-muted-foreground text-[11px]">Date: {ass.date}</span>
                      </div>
                      <p className="text-foreground font-medium mt-1">Assessor: {ass.assessor}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-bold",
                          ass.result === "Compliant"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                            : "bg-amber-500/10 text-amber-600 border-amber-300"
                        )}
                      >
                        {ass.result}
                      </Badge>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{ass.findings} Findings</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 6: AUDITS
            ========================================================================= */}
        {activeSubmodule === "audits" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Internal Audits & Surveillance Programs
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Independent internal audit schedules, scopes, and committee review notes.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => setIsScheduleAuditOpen(true)}
                >
                  <CalendarPlus className="h-3.5 w-3.5" />
                  Schedule Internal Audit
                </Button>
              </div>

              <div className="space-y-2">
                {activeRecord.internalAudits.map((aud) => (
                  <div
                    key={aud.id}
                    className="p-3.5 rounded-lg border border-border/60 flex items-center justify-between gap-4 bg-muted/20 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{aud.id}</span>
                        <span className="font-semibold text-foreground">{aud.scope}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        Auditor: {aud.auditor} • Date: {aud.date}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs font-bold bg-blue-500/10 text-blue-600 border-blue-300">
                      {aud.result}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 7: ACTIONS
            ========================================================================= */}
        {activeSubmodule === "actions" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Corrective & Preventative Actions (CAPA)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Action items assigned to process leads to eliminate non-conformances.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setIsCreateActionOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Action Item
                </Button>
              </div>

              <div className="space-y-2">
                {activeRecord.openActions.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-lg border border-border/60 flex items-center justify-between gap-4 bg-muted/20 text-xs"
                  >
                    <div>
                      <span className="font-bold text-foreground block">
                        {act.id}: {act.description}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Owner: {act.owner} • Due Date: {act.dueDate}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const updated = activeRecord.openActions.map((a) =>
                          a.id === act.id
                            ? {
                                ...a,
                                status: a.status === "Open" ? ("Closed" as const) : ("Open" as const),
                              }
                            : a
                        );
                        setActiveRecord({ ...activeRecord, openActions: updated });
                        toast({
                          title: "Action Updated",
                          description: `${act.id} marked as ${act.status === "Open" ? "Closed" : "Open"}.`,
                        });
                      }}
                      className="cursor-pointer"
                    >
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-bold",
                          act.status === "Open"
                            ? "bg-blue-500/10 text-blue-600 border-blue-300"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                        )}
                      >
                        {act.status} ↻
                      </Badge>
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 8: RELATED RECORDS & ATTACHMENTS & HISTORY
            ========================================================================= */}
        {activeSubmodule === "related-records" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-5">
              <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 mb-4">
                Cross-Functional ERP Integrations & Dependencies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
                  <span className="font-bold text-foreground block">Procurement Requisitions</span>
                  <span className="text-muted-foreground text-[11px] mt-1 block">5 Active Workflows Linked</span>
                </div>
                <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
                  <span className="font-bold text-foreground block">SAP / ERP Ledger Approvals</span>
                  <span className="text-muted-foreground text-[11px] mt-1 block">Real-time SOD Enforced</span>
                </div>
                <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
                  <span className="font-bold text-foreground block">Quality System Audits</span>
                  <span className="text-muted-foreground text-[11px] mt-1 block">Clause 9.2 ISO Conformance</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSubmodule === "attachments" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Internal Compliance Document Vault</h2>
                  <p className="text-xs text-muted-foreground">Certified annexures, signed policies, and committee approvals.</p>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsAddEvidenceOpen(true)}
                >
                  <Upload className="h-3.5 w-3.5" />
                  Attach File
                </Button>
              </div>
              <div className="p-4 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <span className="font-bold text-foreground">POL-PROC-2026-SIGNED.pdf</span>
                    <span className="text-muted-foreground text-[11px] block">Size: 2.4 MB • Uploaded: 01-Jan-2026</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs font-semibold"
                  onClick={() => {
                    toast({
                      title: "Download Started",
                      description: "POL-PROC-2026-SIGNED.pdf saved to downloads.",
                    });
                  }}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeSubmodule === "history" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs bg-card p-5">
              <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 mb-4">
                Internal Compliance Immutable Governance Log
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/60">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-foreground block">
                      Internal Compliance Program Certified — Antigravity Governance Engine
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Timestamp: 25-Sep-2026 10:30 IST • Actor: Governance Lead • Hash: #IC-COMP-2026-OK
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 2: REPORTS (COMPLETE 19 CONTROLLED AUDIT REPORTS & KPI MASTER)
            ========================================================================= */}
        {activeSubmodule === "reports" && (
          <div className="space-y-4">
            {/* Top Bar for Reports View */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Internal Compliance Governance Reports
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Section 38: 19 Controlled Registers, SOD Matrix, Heatmaps & KPI Masters
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5"
                  onClick={() => handleExportCSV(currentReport)}
                >
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5"
                  onClick={() => window.print()}
                >
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                  Print Dossier
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsGenerateReportModalOpen(true)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate Governance Deck
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5 text-muted-foreground"
                  onClick={() => setActiveSubmodule("overview")}
                >
                  ← Back to Overview
                </Button>
              </div>
            </div>

            {/* Filter and Report Catalog Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* LEFT: 19 Reports Navigator (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <Card className="border-border/80 shadow-2xs bg-card p-3">
                  <div className="space-y-2.5">
                    {/* Search reports */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search 19 internal reports..."
                        value={reportSearchQuery}
                        onChange={(e) => setReportSearchQuery(e.target.value)}
                        className="h-8 pl-8 text-xs"
                      />
                    </div>

                    {/* Filter categories */}
                    <div className="flex flex-wrap gap-1">
                      {[
                        "All",
                        "Registers & Policies",
                        "Controls & Testing",
                        "Audits & Non-Compliance",
                        "Governance & SOD",
                        "People & Training",
                        "Intelligence & Risk",
                      ].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setReportCategoryFilter(cat)}
                          className={cn(
                            "px-2 py-0.5 text-[10px] rounded-md font-semibold transition-colors cursor-pointer",
                            reportCategoryFilter === cat
                              ? "bg-primary text-primary-foreground font-bold"
                              : "bg-muted/60 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List of 19 Reports */}
                  <div className="mt-3 space-y-1 max-h-[500px] overflow-y-auto pr-1">
                    {filteredReportsList.map((rep) => {
                      const isSelected = rep.id === selectedReportId;
                      return (
                        <button
                          key={rep.id}
                          onClick={() => setSelectedReportId(rep.id)}
                          className={cn(
                            "w-full text-left p-2 rounded-lg transition-all border flex items-start justify-between cursor-pointer",
                            isSelected
                              ? "bg-primary/10 border-primary/30 text-foreground font-semibold"
                              : "bg-background border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                          )}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] font-bold text-primary px-1 rounded bg-primary/10">
                                {rep.code}
                              </span>
                              <span className="text-xs font-bold text-foreground">
                                {rep.title}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                              {rep.purpose}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-[9px] shrink-0 font-mono">
                            {rep.recordsCount} rows
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* RIGHT: Selected Report Detail & Interactive Table (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <Card className="border-border/80 shadow-2xs bg-card">
                  <CardHeader className="py-3 px-4 border-b border-border/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            {currentReport.code}
                          </span>
                          <CardTitle className="text-base font-bold text-foreground">
                            {currentReport.title}
                          </CardTitle>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px]">
                            {currentReport.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {currentReport.purpose}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          Freq: {currentReport.frequency}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          Last Run: {currentReport.lastGenerated}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                          {currentReport.columns.map((col, idx) => (
                            <th key={idx} className="py-2.5 px-3 whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {currentReport.sampleData.length === 0 ? (
                          <tr>
                            <td
                              colSpan={currentReport.columns.length}
                              className="py-8 text-center text-muted-foreground"
                            >
                              Zero records matching criteria. Perfect compliance health!
                            </td>
                          </tr>
                        ) : (
                          currentReport.sampleData.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-muted/30 transition-colors">
                              {currentReport.columns.map((col, colIdx) => {
                                const val = row[col];
                                const isStatusCol =
                                  col.toLowerCase().includes("status") ||
                                  col.toLowerCase().includes("state") ||
                                  col.toLowerCase().includes("result") ||
                                  col.toLowerCase().includes("outcome");
                                const isCritical =
                                  String(val).toLowerCase().includes("critical") ||
                                  String(val).toLowerCase().includes("major") ||
                                  String(val).toLowerCase().includes("non-compliant");
                                const isOk =
                                  String(val).toLowerCase().includes("optimal") ||
                                  String(val).toLowerCase().includes("effective") ||
                                  String(val).toLowerCase().includes("compliant") ||
                                  String(val).toLowerCase().includes("clean");

                                return (
                                  <td
                                    key={colIdx}
                                    className="py-2.5 px-3 whitespace-nowrap text-foreground"
                                  >
                                    {isStatusCol ? (
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-[10px] font-semibold px-2 py-0.5",
                                          isCritical
                                            ? "bg-red-500/10 text-red-600 border-red-300"
                                            : isOk
                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                                            : "bg-blue-500/10 text-blue-600 border-blue-300"
                                        )}
                                      >
                                        {val}
                                      </Badge>
                                    ) : (
                                      <span className={cn(colIdx === 0 && "font-mono font-bold")}>
                                        {val}
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                {/* Section 9: Segregation of Duties (SOD) Matrix Table */}
                <Card className="border-border/80 shadow-2xs bg-card p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">
                        Section 9: Segregation of Duties (SOD) Control Matrix
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        Enforced boundaries between Request, Approve, Execute, Verify, and Pay
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300 font-mono">
                      SOD Enforced
                    </Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/40 text-muted-foreground text-[10px] uppercase font-bold">
                        <tr>
                          <th className="py-2 px-3">Business Activity</th>
                          <th className="py-2 px-2 text-center">Request</th>
                          <th className="py-2 px-2 text-center">Approve</th>
                          <th className="py-2 px-2 text-center">Execute</th>
                          <th className="py-2 px-2 text-center">Verify</th>
                          <th className="py-2 px-2 text-center">Pay</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {SOD_MATRIX_DATA.map((row, idx) => (
                          <tr key={idx} className="hover:bg-muted/30">
                            <td className="py-2 px-3 font-medium text-foreground">{row.activity}</td>
                            <td className="py-2 px-2 text-center">
                              {row.request ? (
                                <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )}
                            </td>
                            <td className="py-2 px-2 text-center">
                              {row.approve ? (
                                <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )}
                            </td>
                            <td className="py-2 px-2 text-center">
                              {row.execute ? (
                                <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )}
                            </td>
                            <td className="py-2 px-2 text-center">
                              {row.verify ? (
                                <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )}
                            </td>
                            <td className="py-2 px-2 text-center">
                              {row.pay ? (
                                <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground/40">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Visual Analytics Row: 5x5 Heatmap & Domain Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 5x5 Compliance Risk Heatmap */}
                  <Card className="border-border/80 shadow-2xs bg-card p-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2">
                      <span className="text-xs font-bold text-foreground">
                        Section 20: Internal Compliance Risk Matrix (5×5)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Likelihood × Impact
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex text-[9px] font-bold text-muted-foreground justify-between px-1">
                        <span>LIKELIHOOD</span>
                        <span>IMPACT (1 → 5)</span>
                      </div>
                      {heatmapData.map((row) => (
                        <div key={row.likelihood} className="flex items-center gap-1.5">
                          <span className="w-3 text-[10px] font-bold text-muted-foreground text-center">
                            {row.likelihood}
                          </span>
                          <div className="grid grid-cols-5 gap-1 flex-1">
                            {row.scores.map((score, cellIdx) => {
                              const count = row.counts[cellIdx];
                              const isRed = score >= 16;
                              const isOrange = score >= 10 && score < 16;
                              const isYellow = score >= 5 && score < 10;
                              const isGreen = score < 5;

                              return (
                                <div
                                  key={cellIdx}
                                  title={`Score: ${score} (Items: ${count})`}
                                  className={cn(
                                    "h-7 rounded flex flex-col items-center justify-center font-mono text-[9px] font-bold transition-transform hover:scale-105 cursor-pointer",
                                    isRed && "bg-red-500 text-white",
                                    isOrange && "bg-amber-500 text-white",
                                    isYellow && "bg-yellow-400 text-slate-900",
                                    isGreen && "bg-emerald-500 text-white"
                                  )}
                                >
                                  <span>{score}</span>
                                  {count > 0 && (
                                    <span className="text-[8px] opacity-90">({count})</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Domain Distribution */}
                  <Card className="border-border/80 shadow-2xs bg-card p-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-2">
                      <span className="text-xs font-bold text-foreground">
                        Internal Compliance by Domain
                      </span>
                      <span className="text-[10px] text-muted-foreground">Active Requirements</span>
                    </div>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={domainChartData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 9 }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                          />
                          <YAxis tick={{ fontSize: 9 }} />
                          <RechartsTooltip />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {domainChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {/* Section 39: Internal Compliance KPI Master */}
                <Card className="border-border/80 shadow-2xs bg-card p-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">
                        Section 39: Internal Compliance KPI Master
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        Enterprise internal controls & governance scorecard
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Real-time Computed
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {INTERNAL_KPI_MASTER.map((cat, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2"
                      >
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          {cat.category}
                        </span>
                        <div className="space-y-1.5 text-[11px]">
                          {cat.metrics.map((m, mIdx) => (
                            <div key={mIdx} className="flex justify-between items-center">
                              <span className="text-muted-foreground">{m.label}</span>
                              <div className="text-right">
                                <span className="font-bold text-foreground tabular">{m.value}</span>
                                {m.sublabel && (
                                  <div className="text-[9px] text-muted-foreground">{m.sublabel}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 1: ADD EVIDENCE
            ========================================================================= */}
        <Dialog open={isAddEvidenceOpen} onOpenChange={setIsAddEvidenceOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                Upload Internal Compliance Evidence
              </DialogTitle>
              <DialogDescription className="text-xs">
                Upload verified proof, sign-off minutes, or system logs for {activeRecord.id}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEvidenceSubmit} className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px] font-semibold">Document Title / Reference *</Label>
                <Input
                  required
                  placeholder="e.g. ERP Purchase Order Electronic Sign-off Log Mar 2026"
                  value={newEvidence.title}
                  onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Evidence Type</Label>
                  <Select
                    value={newEvidence.type}
                    onValueChange={(val) => setNewEvidence({ ...newEvidence, type: val })}
                  >
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approval Record">Approval Record</SelectItem>
                      <SelectItem value="Policy Acknowledgement">Policy Acknowledgement</SelectItem>
                      <SelectItem value="Checklist / Inspection">Checklist / Inspection</SelectItem>
                      <SelectItem value="System Log">System Log</SelectItem>
                      <SelectItem value="Management Review Minutes">Management Review Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[11px] font-semibold">Verification Date</Label>
                  <Input
                    type="date"
                    value={newEvidence.date}
                    onChange={(e) => setNewEvidence({ ...newEvidence, date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Accountable Owner</Label>
                <Input
                  value={newEvidence.owner}
                  onChange={(e) => setNewEvidence({ ...newEvidence, owner: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setIsAddEvidenceOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Upload & Sign Proof
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            MODAL 2: SCHEDULE AUDIT
            ========================================================================= */}
        <Dialog open={isScheduleAuditOpen} onOpenChange={setIsScheduleAuditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <CalendarPlus className="h-4 w-4 text-emerald-600" />
                Schedule Internal Compliance Audit
              </DialogTitle>
              <DialogDescription className="text-xs">
                Plan a routine or targeted internal audit for {activeRecord.process}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleScheduleAuditSubmit} className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px] font-semibold">Audit Scope</Label>
                <Input
                  value={newAudit.scope}
                  onChange={(e) => setNewAudit({ ...newAudit, scope: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Audit Lead</Label>
                  <Input
                    value={newAudit.auditor}
                    onChange={(e) => setNewAudit({ ...newAudit, auditor: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold">Scheduled Date</Label>
                  <Input
                    value={newAudit.date}
                    onChange={(e) => setNewAudit({ ...newAudit, date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Sampling Strategy</Label>
                <Input
                  value={newAudit.sampleSize}
                  onChange={(e) => setNewAudit({ ...newAudit, sampleSize: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setIsScheduleAuditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm Audit Schedule
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            MODAL 3: CREATE ACTION
            ========================================================================= */}
        <Dialog open={isCreateActionOpen} onOpenChange={setIsCreateActionOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create Internal Corrective Action
              </DialogTitle>
              <DialogDescription className="text-xs">
                Log a remediation task for process or control improvements.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateActionSubmit} className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Action ID</Label>
                  <Input
                    value={newAction.id}
                    onChange={(e) => setNewAction({ ...newAction, id: e.target.value })}
                    className="h-8 text-xs font-mono mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold">Due Date</Label>
                  <Input
                    value={newAction.dueDate}
                    onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Action Description</Label>
                <Input
                  required
                  placeholder="e.g. Implement dual sign-off workflow in ERP"
                  value={newAction.description}
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Responsible Owner</Label>
                <Input
                  value={newAction.owner}
                  onChange={(e) => setNewAction({ ...newAction, owner: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setIsCreateActionOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Action
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            MODAL 4: ADD EXCEPTION
            ========================================================================= */}
        <Dialog open={isAddExceptionOpen} onOpenChange={setIsAddExceptionOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-purple-600" />
                Log Policy & DOA Exception
              </DialogTitle>
              <DialogDescription className="text-xs">
                Record an authorized deviation with documented compensating controls.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExceptionSubmit} className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-[11px] font-semibold">Reason for Exception *</Label>
                <Textarea
                  rows={2}
                  required
                  placeholder="e.g. Critical breakdown part purchase exceeding branch manager threshold"
                  value={newException.reason}
                  onChange={(e) => setNewException({ ...newException, reason: e.target.value })}
                  className="text-xs mt-1 resize-none"
                />
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Compensating Control</Label>
                <Input
                  placeholder="e.g. Secondary sign-off by VP Operations within 24h"
                  value={newException.compensatingControl}
                  onChange={(e) =>
                    setNewException({ ...newException, compensatingControl: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Approving Authority</Label>
                  <Input
                    value={newException.approver}
                    onChange={(e) => setNewException({ ...newException, approver: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold">Exception Expiry</Label>
                  <Input
                    value={newException.expiryDate}
                    onChange={(e) =>
                      setNewException({ ...newException, expiryDate: e.target.value })
                    }
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setIsAddExceptionOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Approve Exception
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            MODAL 5: VIEW POLICY DETAILS
            ========================================================================= */}
        <Dialog open={isViewPolicyModalOpen} onOpenChange={setIsViewPolicyModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Internal Policy Master Dossier
              </DialogTitle>
              <DialogDescription className="text-xs">
                Governing policy and SOP specifications connected to {activeRecord.complianceName}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground text-sm">{activeRecord.policy}</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300">
                    Active
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1">
                  <div>Department: <strong className="text-foreground">{activeRecord.department}</strong></div>
                  <div>Owner: <strong className="text-foreground">{activeRecord.controlOwner}</strong></div>
                  <div>Effective: <strong className="text-foreground">{activeRecord.effectiveDate}</strong></div>
                  <div>Next Review: <strong className="text-foreground">{activeRecord.reviewDate}</strong></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-foreground text-xs">Connected SOPs & Procedures:</span>
                <div className="space-y-1">
                  {activeRecord.policiesAndSops.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 rounded border border-border/60 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{item.id}</span>
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">({item.version})</span>
                      </div>
                      <Badge variant="outline" className="text-[9px]">
                        {item.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary text-primary-foreground font-bold w-full"
                  onClick={() => setIsViewPolicyModalOpen(false)}
                >
                  Close Dossier
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* =========================================================================
            MODAL 6: GENERATE REPORT MODAL
            ========================================================================= */}
        <Dialog open={isGenerateReportModalOpen} onOpenChange={setIsGenerateReportModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                Generate Internal Compliance Governance Dossier
              </DialogTitle>
              <DialogDescription className="text-xs">
                Package controlled internal compliance reports, SOD matrices, and CAPA logs.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold">Report Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">Executive PDF Governance Deck</SelectItem>
                      <SelectItem value="excel">Excel Internal Controls Sheet (.xlsx)</SelectItem>
                      <SelectItem value="board">Audit Committee Board Dossier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px] font-semibold">Audit Window</Label>
                  <Select
                    value={reportDateRange}
                    onValueChange={(val) => setReportDateRange(val)}
                  >
                    <SelectTrigger className="h-8 text-xs mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1 2026">Q1 2026 (Jan - Mar 2026)</SelectItem>
                      <SelectItem value="FY 2025-26">Full Year FY 2025-26</SelectItem>
                      <SelectItem value="Trailing 30 Days">Trailing 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Compliance Domain</Label>
                <Select defaultValue="All">
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All 7 Internal Governance Domains</SelectItem>
                    <SelectItem value="Procurement">Procurement & SCM</SelectItem>
                    <SelectItem value="IT & Cyber">IT & Cybersecurity</SelectItem>
                    <SelectItem value="Quality">Quality QMS & IPQC</SelectItem>
                    <SelectItem value="Finance">Finance & DOA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5 text-[11px]">
                <div className="font-semibold text-foreground">Included Governance Exhibits:</div>
                <div className="grid grid-cols-2 gap-1 text-muted-foreground text-[10px]">
                  <span>✓ 1. Form MAICW Master Record</span>
                  <span>✓ 2. Segregation of Duties Matrix</span>
                  <span>✓ 3. 19 Controlled Audit Registers</span>
                  <span>✓ 4. Section 39 KPI Master</span>
                  <span>✓ 5. Active Exception Log</span>
                  <span>✓ 6. Management Review Minutes</span>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setIsGenerateReportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={() => {
                    setIsGenerateReportModalOpen(false);
                    toast({
                      title: "Governance Dossier Generated",
                      description: `Package Magnertia_Internal_Governance_${reportDateRange.replace(/\s+/g, "_")}.pdf ready for download.`,
                    });
                  }}
                >
                  Generate & Download Package
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
