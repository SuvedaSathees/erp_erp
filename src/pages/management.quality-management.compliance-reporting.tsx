// Magnertia ERP - Compliance Reporting Module
// Management -> Compliance -> Compliance Reporting
// Compliance Reporting Form — MAICW Classification, Overview, Widgets, and Controlled Audit Reports

import { useState, useMemo, useEffect } from "react";
import { redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getComplianceReportingRecordFn } from "@/lib/complianceReportingFns.server";
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
  Briefcase,
  Compass,
  FileSearch,
  CheckSquare,
  Building2,
  CheckCheck,
  ChevronDown,
  RotateCcw,
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
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  PRIMARY_COMPLIANCE_REPORT,
  COMPLIANCE_REPORTING_KPIS,
  COMPLIANCE_STATUS_DATA,
  REPORTING_KEY_DATES,
  LINKED_REQUIREMENTS,
  ATTACHED_DOCUMENTS,
  RECENT_COMPLIANCE_REPORTS,
  CATEGORY_BAR_DATA,
  AI_COMPLIANCE_INSIGHTS,
  CONTROLLED_REPORTING_REPORTS,
  COMPLIANCE_REPORTING_KPI_MASTER,
  ComplianceReportingRecord,
  LinkedRequirementItem,
  AttachedEvidenceItem,
  RecentReportItem,
  ControlledReportingReport,
} from "@/services/complianceReportingService";
import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";

export default function ComplianceReportingManagementPage() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "report-register"
    | "new-report"
    | "requirements"
    | "evidence"
    | "submissions"
    | "approvals"
    | "calendar"
    | "analytics"
    | "settings"
    | "reports"
  >("overview");

  // Prisma-backed query with inline fallback
  const { data: dbRecord } = useQuery({
    queryKey: ["compliance-reporting", "record"],
    queryFn: () => getComplianceReportingRecordFn({ data: {} }),
  });

  // Controlled form state
  const [formData, setFormData] = useState<ComplianceReportingRecord>(PRIMARY_COMPLIANCE_REPORT);
  useEffect(() => { if (dbRecord?.data) setFormData(dbRecord.data as ComplianceReportingRecord); }, [dbRecord]);
  // Dynamic KPIs state
  const [kpis, setKpis] = useState({
    total: 42,
    submitted: 27,
    inPrep: 11,
    overdue: 4,
    compliance: 90.5,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [approvalStep2, setApprovalStep2] = useState<"Pending" | "Approved">("Pending");
  const [approvalStep3, setApprovalStep3] = useState<"Pending" | "Approved">("Pending");

  // Dynamic tables state
  const [linkedReqs, setLinkedReqs] = useState<LinkedRequirementItem[]>(LINKED_REQUIREMENTS);
  const [documents, setDocuments] = useState<AttachedEvidenceItem[]>(ATTACHED_DOCUMENTS);
  const [recentReports, setRecentReports] = useState<RecentReportItem[]>(RECENT_COMPLIANCE_REPORTS);

  // Reports state
  const [reportSearch, setReportSearch] = useState("");
  const [selectedReportCategory, setSelectedReportCategory] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<ControlledReportingReport>(CONTROLLED_REPORTING_REPORTS[0]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Interactive Tags state (Image 2 style)
  const [tags, setTags] = useState<string[]>([
    "Procurement",
    "Approval",
    "Statutory",
    "Pollution Control",
  ]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags((prev) => [...prev, newTagInput.trim()]);
      setNewTagInput("");
      setShowAddTagInput(false);
    }
  };

  // Modals / Dialog states
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [showLinkReqModal, setShowLinkReqModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showAddExceptionModal, setShowAddExceptionModal] = useState(false);
  const [showValidateDataModal, setShowValidateDataModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // New Report form fields
  const [newReportNumber, setNewReportNumber] = useState("");
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportType, setNewReportType] = useState("Regulatory");
  const [newReportAuthority, setNewReportAuthority] = useState("Pollution Control Board");
  const [newReportDueDate, setNewReportDueDate] = useState("30-Oct-2026");
  const [newReportOwner, setNewReportOwner] = useState("Ramesh S (Operations)");

  // New Linked Requirement form fields
  const [newReqName, setNewReqName] = useState("");
  const [newReqType, setNewReqType] = useState("Regulation");
  const [newReqAuthority, setNewReqAuthority] = useState("CBIC");
  const [newReqFrequency, setNewReqFrequency] = useState("Monthly");

  // New Document form fields
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState<AttachedEvidenceItem["type"]>("Supporting Document");

  // Save handler - persists current form into recentReports list and shows notification
  const handleSave = () => {
    setRecentReports((prev) => {
      const idx = prev.findIndex((r) => r.reportNo === formData.reportNumber);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          title: formData.reportTitle,
          type: formData.reportType,
          status: formData.status,
          dueDate: formData.submissionDueDate,
        };
        return updated;
      }
      return [
        {
          reportNo: formData.reportNumber,
          title: formData.reportTitle,
          type: formData.reportType,
          period: formData.reportingPeriod,
          dueDate: formData.submissionDueDate,
          status: formData.status,
        },
        ...prev,
      ];
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Submit handler - transitions report to Submitted, generates ARN, updates KPIs
  const handleSubmit = () => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const arn =
      formData.acknowledgementNo && formData.acknowledgementNo !== "Pending"
        ? formData.acknowledgementNo
        : `ARN-2026-GST-${Math.floor(10000 + Math.random() * 90000)}`;

    setFormData((prev) => ({
      ...prev,
      status: "Submitted",
      acceptanceStatus: "Accepted",
      submissionDate: today + " 16:45",
      acknowledgementNo: arn,
    }));

    setRecentReports((prev) =>
      prev.map((r) =>
        r.reportNo === formData.reportNumber ? { ...r, status: "Submitted" } : r
      )
    );

    setKpis((prev) => {
      const newSubmitted = prev.submitted + 1;
      const newInPrep = Math.max(0, prev.inPrep - 1);
      return {
        ...prev,
        submitted: newSubmitted,
        inPrep: newInPrep,
        compliance: Math.min(100, Math.round((newSubmitted / prev.total) * 1000) / 10),
      };
    });

    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3500);
  };

  // Create Report handler - prepends to master reports list and selects it
  const handleCreateReport = () => {
    if (!newReportTitle.trim()) return;
    const repNo = newReportNumber.trim() || `CR-2026-0${recentReports.length + 18}`;
    const newReportItem: RecentReportItem = {
      reportNo: repNo,
      title: newReportTitle,
      type: newReportType as any,
      period: "Monthly (September 2026)",
      dueDate: newReportDueDate || "30-Oct-2026",
      status: "In Preparation",
    };

    setRecentReports((prev) => [newReportItem, ...prev]);

    setFormData((prev) => ({
      ...prev,
      reportId: `REP-2026-00${recentReports.length + 43}`,
      reportNumber: repNo,
      reportTitle: newReportTitle,
      reportType: newReportType as any,
      issuingAuthority: newReportAuthority || "Regulatory Body",
      submissionDueDate: newReportDueDate || "30-Oct-2026",
      status: "In Preparation",
      submissionDate: "",
      acknowledgementNo: "Pending",
    }));

    setKpis((prev) => ({
      ...prev,
      total: prev.total + 1,
      inPrep: prev.inPrep + 1,
      compliance: Math.min(100, Math.round((prev.submitted / (prev.total + 1)) * 1000) / 10),
    }));

    setNewReportTitle("");
    setNewReportNumber("");
    setShowNewReportModal(false);
    setActiveTab("overview");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Filtered controlled reports
  const filteredReports = useMemo(() => {
    return CONTROLLED_REPORTING_REPORTS.filter((rep) => {
      const matchCat = selectedReportCategory === "All" || rep.category === selectedReportCategory;
      const matchSearch =
        rep.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.code.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.purpose.toLowerCase().includes(reportSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [reportSearch, selectedReportCategory]);

  return (
    <AppShell
      title="Statutory Filings"
      description="Track statutory returns, pollution control filings, and regulatory submissions."
      breadcrumb="Management > Compliance > Statutory Filings"
      tabs={<ComplianceTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Save & Submit Banners */}
        {saveSuccess && (
          <div className="bg-blue-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Compliance report REP-2026-0042 (CR-2026-017) successfully saved.</span>
            </div>
            <button onClick={() => setSaveSuccess(false)} className="hover:opacity-75">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {submitSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Compliance report submitted to authority portal with cryptographic receipt generation.</span>
            </div>
            <button onClick={() => setSubmitSuccess(false)} className="hover:opacity-75">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            TOP EXECUTIVE COMMAND HEADER
            ========================================================================= */}
        <div className="max-w-[1720px] mx-auto px-4 md:px-6 pt-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Statutory Filings & Reporting
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                    STAT-2026-001
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Track statutory returns, pollution control filings, and regulatory submissions.
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <button
                onClick={() => setShowNewReportModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Report</span>
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <Save className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Save</span>
              </button>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span>Submit</span>
              </button>
              <button
                onClick={() => setShowGenerateReportModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Generate Report</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                >
                  <span>More Actions</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
                {showMoreActions && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        setShowUploadDocModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Upload className="h-3.5 w-3.5 text-blue-500" />
                      <span>Upload Supporting File</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowValidateDataModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Run Data Validation</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAddExceptionModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span>Log Exception</span>
                    </button>
                    <hr className="my-1 border-slate-100 dark:border-slate-700" />
                    <button
                      onClick={() => {
                        setActiveTab("reports");
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Controlled Reports Register</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      <div className="max-w-[1720px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {activeTab !== "overview" && (
          <div className="flex items-center justify-between bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 px-4 py-2 rounded-xl text-xs">
            <span className="font-semibold text-blue-900 dark:text-blue-300">
              Viewing: <strong className="capitalize">{activeTab.replace(/-/g, " ")}</strong>
            </span>
            <button
              onClick={() => setActiveTab("overview")}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to Overview
            </button>
          </div>
        )}
        {/* ========================================================================= */}
        {/* 5 TOP EXECUTIVE KPI CARDS (MATCHING SCREENSHOT)                           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Reports */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ +20%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpis.total}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Total Reports</div>
            </div>
          </div>

          {/* Card 2: Submitted */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-emerald-500 text-white shadow-xs">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ 17%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpis.submitted}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Submitted</div>
            </div>
          </div>

          {/* Card 3: In Preparation */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500 text-white shadow-xs">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-red-600">
                <span>↓ -8%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpis.inPrep}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">In Preparation</div>
            </div>
          </div>

          {/* Card 4: Overdue */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-red-500 text-white shadow-xs">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-red-600">
                <span>↓ -33%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpis.overdue}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Overdue</div>
            </div>
          </div>

          {/* Card 5: Submission Compliance */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-purple-600 text-white shadow-xs">
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ 5%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpis.compliance}%</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Submission Compliance</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OVERVIEW CONTENT: 12 SECTIONS MATCHING THE SCREENSHOT                    */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Grid: Section 1 (MAICW Form matching Image 2) + Section 2 & 4 (Schedule & Status) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 1: Statutory Compliance Information (Col span 7 on LG, 8 on XL - matching Image 2) */}
              <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                      1. Statutory Compliance Information
                    </h2>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      MAICW CLASSIFICATION
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ID: <strong className="font-mono font-bold text-slate-900 dark:text-white">{formData.reportId || "STAT-2026-001"}</strong>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Row 1: ID, Code, Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Report ID <span className="text-blue-600 font-bold ml-0.5">(A)</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.reportId}
                        className="w-full px-3 py-2 text-xs font-mono font-medium rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-not-allowed shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Report Number * <span className="text-blue-600 font-bold ml-0.5">(A)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.reportNumber}
                        onChange={(e) => setFormData({ ...formData, reportNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Report Title * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.reportTitle}
                        onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 truncate transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Type, Category, Requirement */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Report Type * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <select
                        value={formData.reportType}
                        onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="Statutory">Statutory</option>
                        <option value="Regulatory">Regulatory</option>
                        <option value="ISO">ISO</option>
                        <option value="Legal">Legal</option>
                        <option value="Internal">Internal</option>
                        <option value="Customer">Customer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Report Domain / Category * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <select
                        value={formData.reportCategory}
                        onChange={(e) => setFormData({ ...formData, reportCategory: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="Statutory Filing">Statutory Filing</option>
                        <option value="Government Return">Government Return</option>
                        <option value="Declaration">Declaration</option>
                        <option value="Disclosure">Disclosure</option>
                        <option value="Audit Report">Audit Report</option>
                        <option value="Incident Report">Incident Report</option>
                        <option value="Environmental">Environmental</option>
                        <option value="Tax Return">Tax Return</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Compliance Requirement / Policy * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.complianceRequirement}
                          onChange={(e) => setFormData({ ...formData, complianceRequirement: e.target.value })}
                          className="w-full pl-3 pr-8 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 truncate transition-all"
                        />
                        <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Organization, Department, Process */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Business Function / Org * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <select
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs truncate"
                      >
                        <option value="Magnertia Private Limited">Magnertia Private Limited</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Department * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      >
                        <option value="Finance">Finance</option>
                        <option value="EHS & Sustainability">EHS & Sustainability</option>
                        <option value="Quality">Quality</option>
                        <option value="Legal">Legal</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Process * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.process}
                        onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Row 4: Owners with avatar pills and Report Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Control / Filing Owner * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs pointer-events-none">
                          {formData.responsibleOwner.initials || "RS"}
                        </span>
                        <input
                          type="text"
                          value={formData.responsibleOwner.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              responsibleOwner: { ...formData.responsibleOwner, name: e.target.value },
                            })
                          }
                          className="w-full pl-8 pr-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Compliance Coordinator / Reviewer * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs pointer-events-none">
                          {formData.reviewer.initials || "PS"}
                        </span>
                        <input
                          type="text"
                          value={formData.reviewer.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reviewer: { ...formData.reviewer, name: e.target.value },
                            })
                          }
                          className="w-full pl-8 pr-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Effective / Report Date * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.reportDate}
                          onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                          className="w-full pl-3 pr-8 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs"
                        />
                        <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Review Date, Due Date, Status (W), Priority (M) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Review Date * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.periodEndDate}
                          onChange={(e) => setFormData({ ...formData, periodEndDate: e.target.value })}
                          className="w-full pl-2.5 pr-7 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs"
                        />
                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Due Date * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.submissionDueDate}
                          onChange={(e) => setFormData({ ...formData, submissionDueDate: e.target.value })}
                          className="w-full pl-2.5 pr-7 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs"
                        />
                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-red-500 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Status * <span className="text-blue-600 font-bold ml-0.5">(W)</span>
                      </label>
                      <div className="relative">
                        <span
                          className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                            formData.status === "Submitted"
                              ? "bg-emerald-500"
                              : formData.status === "Overdue"
                                ? "bg-red-500"
                                : "bg-amber-500"
                          }`}
                        />
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full pl-6 pr-6 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
                        >
                          <option value="Active">Active</option>
                          <option value="Submitted">Submitted</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Review">Review</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Priority * <span className="text-red-500 font-bold ml-0.5">(M)</span>
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-2.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 rounded-xl bg-red-50/50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 shadow-2xs cursor-pointer"
                      >
                        <option value="Critical">↑ Critical</option>
                        <option value="High">↑ High</option>
                        <option value="Medium">• Medium</option>
                        <option value="Low">↓ Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 6: Version, Confidentiality, Tags (Image 2 style) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 items-end">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Version
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.version || "1.0"}
                        className="w-full px-3 py-2 text-xs font-mono font-medium rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-center shadow-2xs cursor-not-allowed"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Confidentiality
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        <select
                          value={formData.confidentiality}
                          onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value as any })}
                          className="w-full pl-7 pr-4 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
                        >
                          <option value="Internal">Internal</option>
                          <option value="Confidential">Confidential</option>
                          <option value="Restricted">Restricted</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-7">
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Tags
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap min-h-[38px] p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs">
                        {tags.map((tagItem) => (
                          <span
                            key={tagItem}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                          >
                            <span>{tagItem}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tagItem)}
                              className="hover:text-blue-950 dark:hover:text-blue-100 text-slate-400 hover:text-slate-600 font-bold ml-0.5 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {showAddTagInput ? (
                          <div className="inline-flex items-center gap-1">
                            <input
                              type="text"
                              autoFocus
                              placeholder="New tag..."
                              value={newTagInput}
                              onChange={(e) => setNewTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddTag();
                                } else if (e.key === "Escape") {
                                  setShowAddTagInput(false);
                                }
                              }}
                              className="h-6 w-20 px-1.5 text-[11px] rounded border border-blue-300 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddTag}
                              className="text-[10px] text-blue-600 font-bold px-1 hover:underline cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowAddTagInput(true)}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:border-slate-400 border border-dashed border-slate-300 dark:border-slate-600 cursor-pointer"
                          >
                            <Plus className="h-2.5 w-2.5" />
                            <span>Tag</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Section 2 & 3 Filing Schedule & Authority + Section 4 Compliance Status (Col span 5 on LG, 4 on XL) */}
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
                {/* Section 2 & 3: Filing Schedule & Authority Submission Information */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>2. Filing Schedule & Authority</span>
                      </h2>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {formData.acceptanceStatus}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs pt-2">
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Issuing Authority</label>
                          <div className="font-semibold text-slate-900 dark:text-white truncate" title={formData.issuingAuthority}>
                            {formData.issuingAuthority}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Submission Method</label>
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {formData.submissionMethod}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Filing Frequency</label>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {formData.reportingPeriodType} ({formData.frequency})
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Period</label>
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {formData.periodMonth} {formData.periodYear}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Submission Date</label>
                          <div className="font-medium text-slate-700 dark:text-slate-300 font-mono">
                            {formData.submissionDate}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">ARN / Reference</label>
                          <div className="font-mono font-bold text-blue-600 dark:text-blue-400 truncate">
                            {formData.submissionReference}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Resubmission: <strong>{formData.resubmissionRequired}</strong></span>
                    <button
                      onClick={() => setShowValidateDataModal(true)}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      Audit Trail →
                    </button>
                  </div>
                </div>

                {/* Section 4: Compliance Status Donut Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      3. Statutory Filing Status
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">YTD 2026</span>
                  </div>

                  <div className="relative h-36 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={COMPLIANCE_STATUS_DATA}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={44}
                          outerRadius={60}
                          paddingAngle={3}
                        >
                          {COMPLIANCE_STATUS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">42</span>
                      <span className="text-[10px] font-semibold text-slate-500 mt-0.5">Total Filings</span>
                    </div>
                  </div>

                  {/* Legend matching screenshot */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <div className="text-center p-1.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                      <div className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Submitted</span>
                      </div>
                      <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">27 (64%)</div>
                    </div>
                    <div className="text-center p-1.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                      <div className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>In Prep</span>
                      </div>
                      <div className="font-bold text-amber-700 dark:text-amber-400 mt-0.5">11 (26%)</div>
                    </div>
                    <div className="text-center p-1.5 rounded-lg bg-red-50/60 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                      <div className="flex items-center justify-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>Overdue</span>
                      </div>
                      <div className="font-bold text-red-700 dark:text-red-400 mt-0.5">4 (10%)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Grid: Section 5 Key Dates, Section 6 Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 5: Key Dates (Col span 6) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">5. Key Dates</h2>
                  <span className="text-xs text-slate-500">Milestone Deadlines</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                  {REPORTING_KEY_DATES.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                        item.alert ? "bg-red-50/50 border-red-200" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                        <Calendar className={`h-3.5 w-3.5 ${item.alert ? "text-red-500" : "text-blue-500"}`} />
                        <span className={item.alert ? "text-red-600 font-semibold" : ""}>{item.label}</span>
                      </div>
                      <div className={`text-xs font-bold mt-2 ${item.alert ? "text-red-600" : "text-slate-900"}`}>
                        {item.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6: Quick Actions (Col span 6) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">6. Quick Actions</h2>
                  <span className="text-xs text-slate-500">Shortcuts & Workflows</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={() => setShowUploadDocModal(true)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">Upload Document</span>
                  </button>
                  <button
                    onClick={() => setShowValidateDataModal(true)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    <span className="truncate">Validate Data</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="p-2 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Submit Report</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("requirements")}
                    className="p-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <FileSearch className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                    <span className="truncate">View Requirement</span>
                  </button>
                  <button
                    onClick={() => setShowAddExceptionModal(true)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">Add Exception</span>
                  </button>
                  <button
                    onClick={() => {
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 2500);
                    }}
                    className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <CalendarPlus className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">Create Follow-up</span>
                  </button>
                  <button
                    onClick={() => setShowGenerateReportModal(true)}
                    className="col-span-2 p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-center gap-2 text-xs font-semibold text-blue-700 transition-colors cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Third Row: Section 7 Linked Requirements, Section 8 Attached Evidence, Section 9 Review & Approval */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 7: Linked Requirements (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">7. Linked Requirements</h2>
                  <button
                    onClick={() => setShowLinkReqModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Link Requirement</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-2">Req ID</th>
                        <th className="pb-2">Requirement Name</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Authority</th>
                        <th className="pb-2">Frequency</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {linkedReqs.map((req) => (
                        <tr key={req.reqId} className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-semibold text-blue-600">{req.reqId}</td>
                          <td className="py-2.5 font-bold text-slate-900 truncate max-w-[110px]">
                            {req.requirementName}
                          </td>
                          <td className="py-2.5 text-slate-600">{req.type}</td>
                          <td className="py-2.5 text-slate-600">{req.authority}</td>
                          <td className="py-2.5 text-slate-600">{req.frequency}</td>
                          <td className="py-2.5 text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="h-3 w-3" />
                              <span>Applicable</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 8: Attached Documents & Evidence (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">8. Attached Documents & Evidence</h2>
                  <button
                    onClick={() => setShowUploadDocModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Upload Document</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-2">Document Name</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Version</th>
                        <th className="pb-2">Upload Date</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-medium text-slate-900 max-w-[130px] truncate">
                            {doc.documentName}
                          </td>
                          <td className="py-2.5 text-slate-600 truncate max-w-[90px]">{doc.type}</td>
                          <td className="py-2.5 text-slate-600">{doc.version}</td>
                          <td className="py-2.5 text-slate-600 whitespace-nowrap">{doc.uploadDate}</td>
                          <td className="py-2.5 text-right">
                            {doc.status === "Valid" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="h-3 w-3" />
                                <span>Valid</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Draft
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 9: Review & Approval Timeline (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">9. Review & Approval</h2>
                  <span className="text-xs text-slate-500">Workflow Sign-off</span>
                </div>

                <div className="space-y-3 text-xs pt-1">
                  {/* Step 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Prepared by</div>
                        <div className="text-[11px] text-slate-500">Ramesh S</div>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-700">19-Sep-2026</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          approvalStep2 === "Approved" ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Reviewed by</div>
                        <div className="text-[11px] text-slate-500">Priya Sharma</div>
                      </div>
                    </div>
                    {approvalStep2 === "Approved" ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Approved
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">Pending</span>
                    )}
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          approvalStep3 === "Approved"
                            ? "bg-emerald-600 text-white"
                            : approvalStep2 === "Approved"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {approvalStep3 === "Approved" ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-700">Approved by</div>
                        <div className="text-[11px] text-slate-500">Finance Head</div>
                      </div>
                    </div>
                    {approvalStep3 === "Approved" ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Approved
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">
                        {approvalStep2 === "Approved" ? "Action Required" : "Pending"}
                      </span>
                    )}
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          formData.status === "Submitted" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {formData.status === "Submitted" ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        )}
                      </div>
                      <div className="font-bold text-slate-700">Submitted to Authority</div>
                    </div>
                    {formData.status === "Submitted" ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Submitted
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Pending</span>
                    )}
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          formData.status === "Submitted" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {formData.status === "Submitted" ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        )}
                      </div>
                      <div className="font-bold text-slate-700">Acknowledgement</div>
                    </div>
                    {formData.status === "Submitted" ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ARN Generated
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Section 10 Recent Reports, Section 11 Bar Chart, Section 12 AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 10: Recent Compliance Reports (Col span 5 on XL, 12 on LG) */}
              <div className="lg:col-span-12 xl:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        10. Recent Compliance Reports
                      </h2>
                      <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                        {recentReports.length} records
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab("report-register")}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                          <th className="pb-2">Report No.</th>
                          <th className="pb-2">Title</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Due Date</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {recentReports.slice(0, 5).map((rep) => (
                          <tr key={rep.reportNo} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                              {rep.reportNo}
                            </td>
                            <td className="py-2.5 font-bold text-slate-900 dark:text-white truncate max-w-[140px]" title={rep.title}>
                              {rep.title}
                            </td>
                            <td className="py-2.5 text-slate-600 dark:text-slate-400">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                                {rep.type}
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap font-mono text-[11px]">
                              {rep.dueDate}
                            </td>
                            <td className="py-2.5 text-right">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  rep.status === "Submitted"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                    : rep.status === "Overdue"
                                      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    rep.status === "Submitted"
                                      ? "bg-emerald-500"
                                      : rep.status === "Overdue"
                                        ? "bg-red-500"
                                        : "bg-amber-500"
                                  }`}
                                />
                                <span>{rep.status}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <span>Showing 5 of {recentReports.length} statutory filings</span>
                  <button
                    onClick={() => setActiveTab("report-register")}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Full Register</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Section 11: Compliance Reports by Category Bar Chart (Col span 4 on XL, 6 on LG) */}
              <div className="lg:col-span-6 xl:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      11. Compliance Reports by Category
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">Distribution</span>
                  </div>

                  <div className="h-40 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CATEGORY_BAR_DATA} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="category" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderColor: "#e2e8f0",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {CATEGORY_BAR_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Metric Breakdown Chips (Eliminates dead white space completely!) */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <div className="p-1.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-center">
                    <div className="text-[10px] text-slate-500 font-medium truncate">Statutory</div>
                    <div className="text-xs font-bold text-blue-700 dark:text-blue-300">14 (33%)</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center">
                    <div className="text-[10px] text-slate-500 font-medium truncate">ISO</div>
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">8 (19%)</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-center">
                    <div className="text-[10px] text-slate-500 font-medium truncate">Environment</div>
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-300">6 (14%)</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-center">
                    <div className="text-[10px] text-slate-500 font-medium truncate">Tax / ROC</div>
                    <div className="text-xs font-bold text-rose-700 dark:text-rose-300">5 (12%)</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 text-center">
                    <div className="text-[10px] text-slate-500 font-medium truncate">Legal</div>
                    <div className="text-xs font-bold text-teal-700 dark:text-teal-300">5 (12%)</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-center">
                    <div className="text-[10px] text-slate-500 font-medium truncate">Internal</div>
                    <div className="text-xs font-bold text-purple-700 dark:text-purple-300">4 (10%)</div>
                  </div>
                </div>
              </div>

              {/* Section 12: AI Compliance Insights (Col span 3 on XL, 6 on LG) */}
              <div className="lg:col-span-6 xl:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>12. AI Compliance Insights</span>
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                        AI
                      </span>
                    </h2>
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  </div>

                  <div className="space-y-2.5 pt-2 text-xs">
                    {AI_COMPLIANCE_INSIGHTS.map((item) => (
                      <div key={item.id} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 leading-snug">
                        <span
                          className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                            item.color === "red"
                              ? "bg-red-500"
                              : item.color === "amber"
                                ? "bg-amber-500"
                                : item.color === "emerald"
                                  ? "bg-emerald-500"
                                  : item.color === "blue"
                                    ? "bg-blue-500"
                                    : "bg-purple-500"
                          }`}
                        />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
                  <button
                    onClick={() => setActiveTab("reports")}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Insights</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: REPORTS (SECTION 20: 25 CONTROLLED REPORTS & SECTION 21 KPI MASTER)  */}
        {/* ========================================================================= */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Section 21: Key KPIs Master */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Section 21: Compliance Reporting Key KPI Master
                  </h2>
                  <p className="text-xs text-slate-500">
                    Submission timeliness, evidence completeness, authority acceptance rate, and exception closure metrics
                  </p>
                </div>
                <button
                  onClick={() => setShowGenerateReportModal(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Master KPIs</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-3">Domain</th>
                      <th className="p-3">Key Performance Indicator</th>
                      <th className="p-3">Target</th>
                      <th className="p-3">Actual Value</th>
                      <th className="p-3">Variance</th>
                      <th className="p-3">Trend</th>
                      <th className="p-3 text-right">Health Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {COMPLIANCE_REPORTING_KPI_MASTER.map((kpi) => (
                      <tr key={kpi.id} className="hover:bg-slate-50/80">
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                            {kpi.domain}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">{kpi.metric}</td>
                        <td className="p-3 text-slate-600 font-medium">{kpi.target}</td>
                        <td className="p-3 font-semibold text-slate-900">{kpi.actual}</td>
                        <td className="p-3 text-slate-700">{kpi.variance}</td>
                        <td className="p-3">
                          {kpi.trend === "up" ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                              <TrendingUp className="h-3 w-3" /> Up
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium flex items-center gap-0.5">Stable</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              kpi.status === "Optimal"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : kpi.status === "Good"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {kpi.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 20: Controlled Reports Register */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Section 20: Controlled Compliance Reports Register (20 Reports)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Statutory filings, tax submissions, ISO certificates, environmental manifests, and AI intelligence registers
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search controlled report..."
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  "All",
                  "Statutory & Filings",
                  "Quality & ISO",
                  "Submissions & Timelines",
                  "Evidence & Exceptions",
                  "AI & Performance",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedReportCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedReportCategory === cat
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Reports Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-3">Report Code</th>
                      <th className="p-3">Report Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Purpose & Description</th>
                      <th className="p-3">Periodicity</th>
                      <th className="p-3">Records</th>
                      <th className="p-3">Last Generated</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-600">{rep.code}</td>
                        <td className="p-3 font-bold text-slate-900">{rep.title}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {rep.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs">{rep.purpose}</td>
                        <td className="p-3 text-slate-700 font-medium">{rep.periodicity}</td>
                        <td className="p-3 font-semibold text-slate-900">{rep.recordsCount}</td>
                        <td className="p-3 text-slate-500 whitespace-nowrap">{rep.lastGenerated}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedReport(rep);
                              setShowGenerateReportModal(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Preview</span>
                          </button>
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
        {/* TAB: REPORT REGISTER (FULL MASTER DATATABLE & MANAGEMENT)                 */}
        {/* ========================================================================= */}
        {activeTab === "report-register" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Compliance Report Master Register</h2>
                <p className="text-xs text-slate-500">
                  Comprehensive listing of all regulatory, statutory, ISO, and customer compliance submissions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewReportModal(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Initiate New Report</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">Report Number</th>
                    <th className="p-3">Report Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Reporting Period</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Submission Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentReports.map((rep) => (
                    <tr key={rep.reportNo} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-semibold text-blue-600">{rep.reportNo}</td>
                      <td className="p-3 font-bold text-slate-900">{rep.title}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {rep.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{rep.period}</td>
                      <td className="p-3 font-medium text-slate-800">{rep.dueDate}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            rep.status === "Submitted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : rep.status === "Overdue"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              rep.status === "Submitted"
                                ? "bg-emerald-500"
                                : rep.status === "Overdue"
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                            }`}
                          />
                          <span>{rep.status}</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setFormData({
                                ...formData,
                                reportNumber: rep.reportNo,
                                reportTitle: rep.title,
                                reportType: rep.type as any,
                                submissionDueDate: rep.dueDate,
                                status: rep.status as any,
                              });
                              setActiveTab("overview");
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          >
                            Load Form
                          </button>
                          <button
                            onClick={() => {
                              setRecentReports(recentReports.filter((r) => r.reportNo !== rep.reportNo));
                            }}
                            className="px-2 py-1 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Archive Report"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: REQUIREMENTS (LINKED STATUTORY & REGULATORY REQUIREMENTS)            */}
        {/* ========================================================================= */}
        {activeTab === "requirements" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Linked Statutory & Regulatory Obligations</h2>
                <p className="text-xs text-slate-500">
                  Traceability register connecting legal acts, rules, and customer mandates to reporting forms
                </p>
              </div>
              <button
                onClick={() => setShowLinkReqModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Link Requirement</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">Requirement ID</th>
                    <th className="p-3">Statutory Obligation Name</th>
                    <th className="p-3">Requirement Type</th>
                    <th className="p-3">Enforcing Authority</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3 text-right">Applicability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {linkedReqs.map((req) => (
                    <tr key={req.reqId} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-blue-600">{req.reqId}</td>
                      <td className="p-3 font-bold text-slate-900">{req.requirementName}</td>
                      <td className="p-3 text-slate-600">{req.type}</td>
                      <td className="p-3 font-medium text-slate-700">{req.authority}</td>
                      <td className="p-3 text-slate-600">{req.frequency}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setLinkedReqs(
                              linkedReqs.map((r) =>
                                r.reqId === req.reqId
                                  ? {
                                      ...r,
                                      status: r.status === "Applicable" ? "Partially Applicable" : "Applicable",
                                    }
                                  : r,
                              ),
                            );
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                          <span>{req.status}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: EVIDENCE (COMPLIANCE EVIDENCE & PROOFS LIBRARY)                      */}
        {/* ========================================================================= */}
        {activeTab === "evidence" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Evidence & Digital Document Repository</h2>
                <p className="text-xs text-slate-500">
                  Controlled statutory proofs, filing receipts, inspection certificates, and calculation sheets
                </p>
              </div>
              <button
                onClick={() => setShowUploadDocModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Evidence</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">File ID</th>
                    <th className="p-3">Document Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Version</th>
                    <th className="p-3">Upload Date</th>
                    <th className="p-3">Verification</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-medium text-slate-600">{doc.id}</td>
                      <td className="p-3 font-bold text-slate-900">{doc.documentName}</td>
                      <td className="p-3 text-slate-600">{doc.type}</td>
                      <td className="p-3 text-slate-600">{doc.version}</td>
                      <td className="p-3 text-slate-600">{doc.uploadDate}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="h-3 w-3" />
                          <span>Valid Proof</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setExportNotice(`Downloading ${doc.documentName}...`);
                            setTimeout(() => setExportNotice(null), 2500);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {exportNotice && (
              <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {exportNotice}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: SUBMISSIONS (AUTHORITY SUBMISSIONS & ACKNOWLEDGEMENT ARNS)            */}
        {/* ========================================================================= */}
        {activeTab === "submissions" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Government & Authority Submissions Register</h2>
                <p className="text-xs text-slate-500">
                  Audit trail of electronic filings, ARN numbers, official timestamps, and acceptance receipts
                </p>
              </div>
              <button
                onClick={handleSubmit}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Current Report (CR-2026-017)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">Report Number</th>
                    <th className="p-3">Authority / Portal</th>
                    <th className="p-3">Submission Method</th>
                    <th className="p-3">Filed Date</th>
                    <th className="p-3">Acknowledgement (ARN)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-blue-600">CR-2026-016</td>
                    <td className="p-3 font-medium text-slate-900">EPFO Portal (Govt. of India)</td>
                    <td className="p-3 text-slate-600">Government Portal</td>
                    <td className="p-3 text-slate-600">15-Sep-2026 14:22</td>
                    <td className="p-3 font-mono text-emerald-700 font-bold">ARN-EPF-2026-98124</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Accepted
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setExportNotice("Downloading EPFO Filing Receipt...");
                          setTimeout(() => setExportNotice(null), 2500);
                        }}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Challan PDF
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-blue-600">CR-2026-014</td>
                    <td className="p-3 font-medium text-slate-900">TÜV SÜD Certification Portal</td>
                    <td className="p-3 text-slate-600">Certification Portal</td>
                    <td className="p-3 text-slate-600">15-Sep-2026 10:45</td>
                    <td className="p-3 font-mono text-emerald-700 font-bold">TUV-ISO-2026-4421</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Accepted
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setExportNotice("Downloading ISO Audit Submission Deck...");
                          setTimeout(() => setExportNotice(null), 2500);
                        }}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Deck PDF
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-blue-600">{formData.reportNumber}</td>
                    <td className="p-3 font-medium text-slate-900">{formData.issuingAuthority}</td>
                    <td className="p-3 text-slate-600">{formData.submissionMethod}</td>
                    <td className="p-3 text-slate-400">{formData.submissionDate}</td>
                    <td className="p-3 font-mono text-slate-400">{formData.acknowledgementNo}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {formData.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={handleSubmit}
                        className="px-2.5 py-1 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                      >
                        Submit Now
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {exportNotice && (
              <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {exportNotice}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: APPROVALS (MULTI-TIER SIGN-OFF WORKFLOW)                              */}
        {/* ========================================================================= */}
        {activeTab === "approvals" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Multi-Tier Compliance Approval Matrix</h2>
                <p className="text-xs text-slate-500">
                  Role-based sign-offs across Report Preparer, Compliance Reviewer, and Department Executive
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">1. Report Preparation</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                    Signed Off
                  </span>
                </div>
                <div className="text-xs text-slate-700">Preparer: Ramesh S (Operations)</div>
                <div className="text-[11px] text-slate-500">Date: 19-Sep-2026 09:30 AM</div>
                <div className="pt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Worksheet and reconciliation verified</span>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  approvalStep2 === "Approved" ? "border-emerald-200 bg-emerald-50/40" : "border-blue-200 bg-blue-50/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">2. Compliance Review</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      approvalStep2 === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {approvalStep2 === "Approved" ? "Signed Off" : "Action Required"}
                  </span>
                </div>
                <div className="text-xs text-slate-700">Reviewer: Priya Sharma (Compliance)</div>
                <div className="text-[11px] text-slate-500">Due: 18-Sep-2026</div>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setApprovalStep2(approvalStep2 === "Approved" ? "Pending" : "Approved");
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 2500);
                    }}
                    className={`px-3 py-1 text-white text-xs font-semibold rounded cursor-pointer transition-colors ${
                      approvalStep2 === "Approved"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {approvalStep2 === "Approved" ? "Signed Off ✓" : "Approve Review"}
                  </button>
                  <button
                    onClick={() => setShowAddExceptionModal(true)}
                    className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50 cursor-pointer"
                  >
                    Flag Issue
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  approvalStep3 === "Approved"
                    ? "border-emerald-200 bg-emerald-50/40"
                    : approvalStep2 === "Approved"
                      ? "border-blue-200 bg-blue-50/40"
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">3. Executive Approval</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      approvalStep3 === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : approvalStep2 === "Approved"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {approvalStep3 === "Approved"
                      ? "Signed Off"
                      : approvalStep2 === "Approved"
                        ? "Action Required"
                        : "Queued"}
                  </span>
                </div>
                <div className="text-xs text-slate-700">Approver: Finance Head</div>
                <div className="text-[11px] text-slate-500">Due: 19-Sep-2026</div>
                <div className="pt-2">
                  {approvalStep3 === "Approved" ? (
                    <div className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Executive sign-off completed</span>
                    </div>
                  ) : approvalStep2 === "Approved" ? (
                    <button
                      onClick={() => {
                        setApprovalStep3("Approved");
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 2500);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded cursor-pointer"
                    >
                      Authorize Submission
                    </button>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      Awaiting Step 2 Compliance Review completion
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: CALENDAR (STATUTORY DEADLINE CALENDAR)                               */}
        {/* ========================================================================= */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Statutory Reporting Calendar & Due Dates</h2>
                <p className="text-xs text-slate-500">
                  Chronological schedule of tax returns, environmental manifests, and compliance disclosures
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-800">1 Overdue</span>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800">
                  1 Due in 24h
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800">3 Next 30 Days</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  date: "20-Sep-2026",
                  title: "GST Return Filing - GSTR-3B (August 2026)",
                  authority: "CBIC / GST Portal",
                  owner: "Ramesh S",
                  daysLeft: "Due Tomorrow",
                  urgent: true,
                },
                {
                  date: "25-Sep-2026",
                  title: "Customer Quality Compliance Report (August)",
                  authority: "Tier-1 OEM Customer",
                  owner: "Quality Team",
                  daysLeft: "Overdue",
                  overdue: true,
                },
                {
                  date: "30-Sep-2026",
                  title: "Quarterly Environmental Manifest & Hazardous Waste Log",
                  authority: "Pollution Control Board",
                  owner: "EHS Manager",
                  daysLeft: "Due in 11 Days",
                  urgent: false,
                },
                {
                  date: "15-Oct-2026",
                  title: "Quarterly TDS Return - Q2",
                  authority: "Income Tax Department",
                  owner: "Finance Team",
                  daysLeft: "Due in 26 Days",
                  urgent: false,
                },
              ].map((ev, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    ev.overdue
                      ? "border-red-300 bg-red-50/20"
                      : ev.urgent
                        ? "border-amber-300 bg-amber-50/20"
                        : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-lg font-bold text-xs shrink-0 flex flex-col items-center ${
                        ev.overdue
                          ? "bg-red-100 text-red-700"
                          : ev.urgent
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      <Calendar className="h-4 w-4 mb-0.5" />
                      <span>{ev.date.split("-")[0]}</span>
                      <span className="text-[10px] uppercase font-semibold">{ev.date.split("-")[1]}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{ev.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Issuing Authority: {ev.authority} | Accountable Owner: {ev.owner}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ev.overdue
                          ? "bg-red-600 text-white"
                          : ev.urgent
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {ev.daysLeft}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: ANALYTICS (PERFORMANCE CHARTS & ON-TIME METRICS)                     */}
        {/* ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Compliance Reporting Performance Analytics</h2>
                <p className="text-xs text-slate-500">
                  Statistical evaluation of statutory filing SLA, submission error rate, and category volumes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="text-xs font-bold text-slate-800">Reporting Volume by Legal Category</div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CATEGORY_BAR_DATA} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="category" tick={{ fontSize: 9, fill: "#64748b" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="text-xs font-bold text-slate-800">On-Time Submission Rate (90.5%)</div>
                <div className="h-48 flex flex-col justify-center items-center space-y-3">
                  <div className="text-4xl font-extrabold text-purple-600">90.5%</div>
                  <div className="text-xs text-slate-500 text-center max-w-xs">
                    Target: ≥ 95% on-time execution. Current variance: -4.5% due to 1 delayed customer compliance filing.
                  </div>
                  <div className="w-48 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: "90.5%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: SETTINGS (ALERT THRESHOLDS & ESCALATION RULES)                        */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Compliance Reporting Configuration & Alerts</h2>
                <p className="text-xs text-slate-500">
                  Notification trigger rules, alert thresholds, and automated management escalation triggers
                </p>
              </div>
              <button
                onClick={() => {
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2500);
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="font-bold text-slate-900">Automated Alert Windows Before Submission Due Date:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["180 Days", "90 Days", "30 Days", "7 Days"].map((window, idx) => (
                    <label key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                      <span className="font-semibold text-slate-700">{window} Notice</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="font-bold text-slate-900">Authority Escalation Routing:</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Overdue Escalation Recipient</label>
                    <input
                      type="text"
                      defaultValue="arun.kumar@magnertia.com (Compliance Manager)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">AI Discrepancy Detection Sensitivity</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white">
                      <option>High (Flag any calculation delta &gt; 0)</option>
                      <option>Medium (Flag deltas &gt; 1%)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODALS & WORKFLOW DIALOGS                                                 */}
      {/* ========================================================================= */}

      {/* 1. Modal: New Report */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Initiate Compliance Report</h3>
              <button onClick={() => setShowNewReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Report Number</label>
                <input
                  type="text"
                  value={newReportNumber}
                  onChange={(e) => setNewReportNumber(e.target.value)}
                  placeholder="e.g. CR-2026-018"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Report Title</label>
                <input
                  type="text"
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
                  placeholder="e.g. Annual Hazardous Waste Manifest 2026"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Report Type</label>
                <select
                  value={newReportType}
                  onChange={(e) => setNewReportType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option>Regulatory</option>
                  <option>Statutory</option>
                  <option>ISO</option>
                  <option>Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Issuing Authority</label>
                <input
                  type="text"
                  value={newReportAuthority}
                  onChange={(e) => setNewReportAuthority(e.target.value)}
                  placeholder="e.g. Pollution Control Board"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Due Date</label>
                <input
                  type="text"
                  value={newReportDueDate}
                  onChange={(e) => setNewReportDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Responsible Owner</label>
                <input
                  type="text"
                  value={newReportOwner}
                  onChange={(e) => setNewReportOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowNewReportModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Link Requirement */}
      {showLinkReqModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Link Compliance Requirement</h3>
              <button onClick={() => setShowLinkReqModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Requirement Name</label>
                <input
                  type="text"
                  value={newReqName}
                  onChange={(e) => setNewReqName(e.target.value)}
                  placeholder="e.g. Factory Act Annual Return"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Type</label>
                  <select
                    value={newReqType}
                    onChange={(e) => setNewReqType(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option>Regulation</option>
                    <option>Statutory</option>
                    <option>Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Authority</label>
                  <input
                    type="text"
                    value={newReqAuthority}
                    onChange={(e) => setNewReqAuthority(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowLinkReqModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newReqName.trim()) {
                    setLinkedReqs([
                      ...linkedReqs,
                      {
                        reqId: `REQ-0${linkedReqs.length + 1 * 12}`,
                        requirementName: newReqName,
                        type: newReqType,
                        authority: newReqAuthority,
                        frequency: newReqFrequency,
                        status: "Applicable",
                      },
                    ]);
                    setNewReqName("");
                  }
                  setShowLinkReqModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                Link Requirement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Upload Evidence */}
      {showUploadDocModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Supporting Document</h3>
              <button onClick={() => setShowUploadDocModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Bank Challan Payment Receipt August"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Document Type</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Working File">Working File</option>
                  <option value="Supporting Document">Supporting Document</option>
                  <option value="Reference">Reference</option>
                  <option value="Filing Receipt">Filing Receipt</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-700">Click to upload or drag & drop</div>
                <div className="text-[11px] text-slate-400 mt-1">PDF, Excel (.xlsx), XML up to 25MB</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowUploadDocModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newDocName.trim()) {
                    setDocuments([
                      ...documents,
                      {
                        id: `DOC-REP-0${documents.length + 1}`,
                        documentName: newDocName,
                        type: newDocType,
                        version: "1.0",
                        uploadDate: "19-Sep-2026",
                        status: "Valid",
                      },
                    ]);
                    setNewDocName("");
                  }
                  setShowUploadDocModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Add Exception */}
      {showAddExceptionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Log Reporting Exception</h3>
              <button onClick={() => setShowAddExceptionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Exception Type</label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white">
                  <option>Data Discrepancy</option>
                  <option>Missing Supporting Receipt</option>
                  <option>Portal Downtime</option>
                  <option>Authority Clarification Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Detail the exception and required corrective action..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddExceptionModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddExceptionModal(false);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700"
              >
                Log Exception
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: Validate Data */}
      {showValidateDataModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Run Automated Validation</h3>
              <button onClick={() => setShowValidateDataModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <Check className="h-4 w-4" />
                <span>GSTIN and Legal Entity ID Verified</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <Check className="h-4 w-4" />
                <span>Tax calculations match General Ledger</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                <span>Supporting working sheet is in Draft status</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowValidateDataModal(false)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: Generate Controlled Report Preview */}
      {showGenerateReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Controlled Report: {selectedReport.title} ({selectedReport.code})
                </h3>
                <p className="text-xs text-slate-500">{selectedReport.purpose}</p>
              </div>
              <button onClick={() => setShowGenerateReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Controlled Header Mockup */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900">MAGNERTIA ENTERPRISE ERP</span>
                  <div className="text-[11px] text-slate-500">Statutory Filing & Compliance Reporting Directorate</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-600">{selectedReport.code}</span>
                  <div className="text-[11px] text-slate-500">Classification: Controlled Compliance Document</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Periodicity:</span>
                  <div className="font-semibold text-slate-900">{selectedReport.periodicity}</div>
                </div>
                <div>
                  <span className="text-slate-500">Report Reference:</span>
                  <div className="font-semibold text-slate-900">CR-2026-017 (August 2026)</div>
                </div>
                <div>
                  <span className="text-slate-500">Generated On:</span>
                  <div className="font-semibold text-slate-900">{selectedReport.lastGenerated}</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                This document certifies that the statutory submissions, periodic returns, and compliance declarations
                detailed herein have been prepared from verified source records under Magnertia's Compliance Reporting
                Framework with full digital traceability.
              </div>
            </div>

            {exportNotice && (
              <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {exportNotice}
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setExportNotice(`Exporting ${selectedReport.code} as Adobe PDF...`);
                    setTimeout(() => setExportNotice(null), 2500);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>PDF Export</span>
                </button>
                <button
                  onClick={() => {
                    setExportNotice(`Exporting ${selectedReport.code} as Microsoft Excel (.xlsx)...`);
                    setTimeout(() => setExportNotice(null), 2500);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>Excel (.xlsx)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowGenerateReportModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}
