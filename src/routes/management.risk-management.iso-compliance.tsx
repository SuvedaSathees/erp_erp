// Magnertia ERP - ISO Compliance Module
// Management -> Compliance -> ISO Compliance
// ISO Compliance Form — MAICW Classification, Overview, Widgets, and Controlled Audit Reports

import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  DollarSign,
  Building2,
  CheckCheck,
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
} from "recharts";
import {
  PRIMARY_ISO_RECORD,
  ISO_EXECUTIVE_KPIS,
  ISO_KEY_DATES,
  ISO_CLAUSE_COMPLIANCE,
  ISO_AUDIT_FINDINGS,
  ISO_TIMELINE_MILESTONES,
  ISO_OBJECTIVES_KPIS,
  ISO_DOCUMENTS_EVIDENCE,
  ISO_RISK,
  CONTROLLED_ISO_REPORTS,
  ISO_KPI_MASTER,
  SAMPLE_ISO_PROGRAMS,
  ISOClauseItem,
  ISOAuditFindingItem,
  ISOObjectiveKPIItem,
  ISODocumentEvidenceItem,
  ControlledISOReport,
} from "@/services/isoComplianceService";
import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";

export const Route = createFileRoute("/management/risk-management/iso-compliance")({
  component: ISOComplianceManagementPage,
});

export default function ISOComplianceManagementPage() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "compliance-details"
    | "requirements-clauses"
    | "risk-opportunities"
    | "objectives-kpis"
    | "documentation"
    | "audits-findings"
    | "capa"
    | "management-review"
    | "related-records"
    | "history"
    | "reports"
  >("overview");

  // Controlled form state
  const [formData, setFormData] = useState(PRIMARY_ISO_RECORD);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dynamic tables state
  const [clauses, setClauses] = useState<ISOClauseItem[]>(ISO_CLAUSE_COMPLIANCE);
  const [findings, setFindings] = useState<ISOAuditFindingItem[]>(ISO_AUDIT_FINDINGS);
  const [objectives, setObjectives] = useState<ISOObjectiveKPIItem[]>(ISO_OBJECTIVES_KPIS);
  const [evidenceList, setEvidenceList] = useState<ISODocumentEvidenceItem[]>(ISO_DOCUMENTS_EVIDENCE);

  // Reports state
  const [reportSearch, setReportSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<ControlledISOReport>(CONTROLLED_ISO_REPORTS[0]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Dialog / Modal states
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [showClauseModal, setShowClauseModal] = useState(false);
  const [showUploadEvidenceModal, setShowUploadEvidenceModal] = useState(false);
  const [showScheduleAuditModal, setShowScheduleAuditModal] = useState(false);
  const [showAddFindingModal, setShowAddFindingModal] = useState(false);
  const [showCreateCAPAModal, setShowCreateCAPAModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Inputs for modals
  const [newFindingClause, setNewFindingClause] = useState("8.5");
  const [newFindingText, setNewFindingText] = useState("");
  const [newFindingSeverity, setNewFindingSeverity] = useState<ISOAuditFindingItem["severity"]>("Minor");

  const [newCAPATitle, setNewCAPATitle] = useState("");
  const [newCAPAOwner, setNewCAPAOwner] = useState("Ramesh S");
  const [newCAPADueDate, setNewCAPADueDate] = useState("30-Oct-2026");

  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState<ISODocumentEvidenceItem["type"]>("Record");

  // Progress Donut Data
  const progressData = [
    { name: "Compliant", value: 102, color: "#10b981", percent: "82%" },
    { name: "Partial", value: 15, color: "#f59e0b", percent: "12%" },
    { name: "Non-Compliant", value: 8, color: "#ef4444", percent: "6%" },
  ];

  // Filtered reports
  const filteredReports = useMemo(() => {
    return CONTROLLED_ISO_REPORTS.filter((rep) => {
      const matchesSearch =
        rep.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.code.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.purpose.toLowerCase().includes(reportSearch.toLowerCase());
      const matchesCat = selectedCategory === "All" || rep.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [reportSearch, selectedCategory]);

  const reportCategories = ["All", "Inventory & Standards", "Clause & Requirements", "Audit & Findings", "CAPA & Performance", "Risk & Certification", "AI & Governance"];

  // Save handler
  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2800);
  };

  // Submit handler
  const handleSubmit = () => {
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // Add Finding handler
  const handleAddFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFindingText.trim()) return;
    const item: ISOAuditFindingItem = {
      id: `F-00${findings.length + 1}`,
      clause: newFindingClause,
      finding: newFindingText,
      severity: newFindingSeverity,
      status: "Open",
    };
    setFindings([item, ...findings]);
    setNewFindingText("");
    setShowAddFindingModal(false);
  };

  // Add Document handler
  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const doc: ISODocumentEvidenceItem = {
      id: `DOC-00${evidenceList.length + 1}`,
      documentName: newDocName,
      type: newDocType,
      version: "1.0",
      uploadDate: "25-Sep-2026",
      status: "Uploaded",
    };
    setEvidenceList([doc, ...evidenceList]);
    setNewDocName("");
    setShowUploadEvidenceModal(false);
  };

  // 5x5 Risk Matrix cell helper
  const getMatrixCellClass = (score: number) => {
    if (score >= 15) return "bg-rose-500 text-white font-bold border-rose-600";
    if (score >= 10) return "bg-amber-500 text-white font-bold border-amber-600";
    if (score >= 6) return "bg-yellow-400 text-slate-900 font-semibold border-yellow-500";
    return "bg-emerald-400 text-slate-900 font-semibold border-emerald-500";
  };

  return (
    <AppShell
      title="ISO Compliance"
      breadcrumb="Management > Compliance > ISO Compliance"
      description="ISO standards compliance matrix, clause requirements, certification surveillance, and external audit readiness."
      tabs={<ComplianceTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Banner Notice for Save/Submit */}
        {saveSuccess && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>ISO Program ISO-2026-001 updated and saved!</span>
          </div>
        )}
        {submitSuccess && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <Send className="w-5 h-5" />
            <span>ISO audit documentation package dispatched to TÜV SÜD Review Portal!</span>
          </div>
        )}

        {/* =========================================================================
            TOP EXECUTIVE COMMAND HEADER
            ========================================================================= */}
        <div className="max-w-[1720px] mx-auto px-4 md:px-6 pt-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    ISO Compliance Management
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                    ISO-2026-001
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Standards Today. Sustainable Tomorrow.
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <button
                onClick={() => setShowNewRecordModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Record</span>
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
                onClick={() => setActiveTab("reports")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Generate Report</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                >
                  <span>More Actions</span>
                  <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
                </button>
                {showMoreActions && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        setShowClauseModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" /> View Clause Mapping
                    </button>
                    <button
                      onClick={() => {
                        setShowUploadEvidenceModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-500" /> Upload Evidence
                    </button>
                    <button
                      onClick={() => {
                        setShowScheduleAuditModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-amber-500" /> Schedule Audit
                    </button>
                    <button
                      onClick={() => {
                        setShowAddFindingModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Add Audit Finding
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateCAPAModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-500" /> Create CAPA Action
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Main Container */}
      <div className="max-w-[1720px] mx-auto px-4 md:px-6 py-5 space-y-5">
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

        {/* Top 6 Executive KPI Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. Total Requirements */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">125</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Total Requirements
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              ↑ 12%
            </span>
          </div>

          {/* 2. Compliant */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">102</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Compliant
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              ↑ 8%
            </span>
          </div>

          {/* 3. Partial Compliance */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">15</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Partial Compliance
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
              ↑ 50%
            </span>
          </div>

          {/* 4. Non-Compliant */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">8</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Non-Compliant
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
              ↓ 20%
            </span>
          </div>

          {/* 5. Open Findings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">6</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Open Findings
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              ↑ 0%
            </span>
          </div>

          {/* 6. Compliance Rate */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">92%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Compliance Rate
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              ↑ 6%
            </span>
          </div>
        </div>

        {/* View Switcher: Overview vs Reports vs Tab Guidance */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* ROW 1: Section 1 (ISO Info) + Section 2 (Overview) + Section 3-5 (Progress, Key Dates, Quick Actions) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column (lg:col-span-5): 1. ISO Compliance Information */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  1. ISO Compliance Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* ISO Compliance ID */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      ISO Compliance ID
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.complianceId}
                      className="w-full text-xs font-mono px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                    />
                  </div>
                  {/* Compliance Code */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Compliance Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.complianceCode}
                      onChange={(e) => setFormData({ ...formData, complianceCode: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  {/* Compliance Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Compliance Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.complianceName}
                      onChange={(e) => setFormData({ ...formData, complianceName: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* ISO Standard */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      ISO Standard <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.isoStandard}
                      onChange={(e) => setFormData({ ...formData, isoStandard: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="ISO 9001:2015">ISO 9001:2015</option>
                      <option value="ISO 14001:2015">ISO 14001:2015</option>
                      <option value="ISO 45001:2018">ISO 45001:2018</option>
                      <option value="ISO 27001:2022">ISO 27001:2022</option>
                    </select>
                  </div>
                  {/* Standard Edition */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Standard Edition <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.standardEdition}
                      onChange={(e) => setFormData({ ...formData, standardEdition: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  {/* ISO Category */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      ISO Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.isoCategory}
                      onChange={(e) => setFormData({ ...formData, isoCategory: e.target.value as typeof formData.isoCategory })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Quality Management">Quality Management</option>
                      <option value="Environmental Management">Environmental Management</option>
                      <option value="Information Security">Information Security</option>
                      <option value="Occupational Health & Safety">Occupational Health & Safety</option>
                      <option value="Energy Management">Energy Management</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Certification Status */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Certification Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.certificationStatus}
                      onChange={(e) => setFormData({ ...formData, certificationStatus: e.target.value as typeof formData.certificationStatus })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Certified">Certified</option>
                      <option value="Not Certified">Not Certified</option>
                    </select>
                  </div>
                  {/* Compliance Status */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Compliance Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.complianceStatus}
                      onChange={(e) => setFormData({ ...formData, complianceStatus: e.target.value as typeof formData.complianceStatus })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Partial Compliance">Partial Compliance</option>
                      <option value="Compliant">Compliant</option>
                      <option value="Gap">Gap</option>
                      <option value="Non-Compliant">Non-Compliant</option>
                    </select>
                  </div>
                  {/* Priority */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-red-600 dark:text-red-400 font-bold text-xs">
                      <span>↑ High</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Business Function */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Business Function <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.businessFunction}
                      onChange={(e) => setFormData({ ...formData, businessFunction: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Quality">Quality</option>
                    </select>
                  </div>
                  {/* Department */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Quality Management">Quality Management</option>
                      <option value="Production Engineering">Production Engineering</option>
                      <option value="Plant Operations">Plant Operations</option>
                    </select>
                  </div>
                  {/* Process */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Process
                    </label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="All Core Processes">All Core Processes</option>
                      <option value="Manufacturing & Quality Control">Manufacturing & Quality Control</option>
                      <option value="Supplier Governance">Supplier Governance</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Compliance Owner */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Compliance Owner <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {formData.complianceOwner.initials}
                      </span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {formData.complianceOwner.name}
                      </span>
                    </div>
                  </div>
                  {/* Compliance Coordinator */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Compliance Coordinator <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {formData.complianceCoordinator.initials}
                      </span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {formData.complianceCoordinator.name}
                      </span>
                    </div>
                  </div>
                  {/* Certification Body */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Certification Body
                    </label>
                    <input
                      type="text"
                      value={formData.certificationBody}
                      onChange={(e) => setFormData({ ...formData, certificationBody: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Legal Entity */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Legal Entity <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.legalEntity}
                      onChange={(e) => setFormData({ ...formData, legalEntity: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Magnertia Private Limited">Magnertia Private Limited</option>
                      <option value="Magnertia Technologies Inc">Magnertia Technologies Inc</option>
                    </select>
                  </div>
                  {/* Site / Location */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Site / Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.siteLocation}
                      onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Coimbatore - Development Centre">Coimbatore - Development Centre</option>
                      <option value="Chennai - Corporate Office">Chennai - Corporate Office</option>
                      <option value="Bengaluru - Innovation Hub">Bengaluru - Innovation Hub</option>
                    </select>
                  </div>
                  {/* Audit Date */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Audit Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.auditDate}
                        onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })}
                        className="w-full text-[11px] pl-2 pr-6 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <Calendar className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Dates Row & Confidentiality */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Effective Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        className="w-full text-[11px] pl-2 pr-6 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <Calendar className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Review Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.reviewDate}
                        onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                        className="w-full text-[11px] pl-2 pr-6 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <Calendar className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.version}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Confidentiality
                    </label>
                    <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-xs">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Internal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column (lg:col-span-4): 2. ISO Compliance Overview */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    2. ISO Compliance Overview
                  </h2>

                  <div className="space-y-3.5 mt-3">
                    {/* Compliance Objective */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Compliance Objective
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {formData.complianceObjective}
                      </p>
                    </div>

                    {/* Scope */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Scope
                      </p>
                      <textarea
                        readOnly
                        rows={2}
                        value={formData.scope}
                        className="w-full text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-800 resize-none font-sans"
                      />
                    </div>

                    {/* Applicable Departments Tags */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                        Applicable Departments
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.applicableDepartments.map((dept, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          >
                            <span>{dept}</span>
                            <span className="text-blue-400 hover:text-blue-600 cursor-pointer">×</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Applicable Products */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Applicable Products
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                        {formData.applicableProducts}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Compliance Status Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Current Compliance Status
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Partial Compliance</span>
                  </div>
                </div>
              </div>

              {/* Right Column (lg:col-span-3): 3. Compliance Progress, 4. Key Dates & 5. Quick Actions */}
              <div className="lg:col-span-3 space-y-4">
                {/* 3. Compliance Progress Donut */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    3. Compliance Progress
                  </h2>

                  <div className="flex items-center justify-between gap-2">
                    {/* Donut */}
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={progressData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={48}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {progressData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                          125
                        </span>
                        <span className="text-[8px] text-slate-500">Requirements</span>
                      </div>
                    </div>

                    {/* Legend on right */}
                    <div className="space-y-1.5 text-xs flex-1">
                      {progressData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                            {item.value} ({item.percent})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Key Dates */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                    4. Key Dates
                  </h2>
                  <div className="space-y-2 text-xs">
                    {ISO_KEY_DATES.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>{item.label}</span>
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                          {item.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                    5. Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => setShowClauseModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Clause Mapping</span>
                    </button>
                    <button
                      onClick={() => setShowUploadEvidenceModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload Evidence</span>
                    </button>
                    <button
                      onClick={() => setShowScheduleAuditModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-amber-600" />
                      <span>Schedule Audit</span>
                    </button>
                    <button
                      onClick={() => setShowAddFindingModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-rose-600" />
                      <span>Add Finding</span>
                    </button>
                    <button
                      onClick={() => setShowCreateCAPAModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-600" />
                      <span>Create CAPA</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("reports")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>View Reports</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Section 6 (Clause Compliance) + Section 7 (Recent Audit Findings) + Section 8 (Certification Timeline) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 6. ISO Clause Compliance (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    6. ISO Clause Compliance
                  </h2>
                  <button
                    onClick={() => setShowClauseModal(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All Clauses
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-1">Clause</th>
                        <th className="py-2 px-2">Title</th>
                        <th className="py-2 px-1 text-center">Total Reqs</th>
                        <th className="py-2 px-1 text-center text-emerald-600">Compliant</th>
                        <th className="py-2 px-1 text-center text-amber-600">Partial</th>
                        <th className="py-2 px-1 text-center text-red-600">Non-Compliant</th>
                        <th className="py-2 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {clauses.map((c) => (
                        <tr key={c.clause} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2 pr-1 font-mono font-bold text-blue-600">
                            {c.clause}
                          </td>
                          <td className="py-2 px-2 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                            {c.title}
                          </td>
                          <td className="py-2 px-1 text-center tabular-nums text-slate-600 dark:text-slate-400">
                            {c.totalReqs}
                          </td>
                          <td className="py-2 px-1 text-center tabular-nums font-semibold text-emerald-600">
                            {c.compliant}
                          </td>
                          <td className="py-2 px-1 text-center tabular-nums font-semibold text-amber-600">
                            {c.partial}
                          </td>
                          <td className="py-2 px-1 text-center tabular-nums font-semibold text-red-600">
                            {c.nonCompliant}
                          </td>
                          <td className="py-2 pl-2 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <div className="w-12 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    c.complianceRate >= 90
                                      ? "bg-emerald-500"
                                      : c.complianceRate >= 75
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${c.complianceRate}%` }}
                                />
                              </div>
                              <span className="font-bold text-[11px] tabular-nums text-slate-700 dark:text-slate-300">
                                {c.complianceRate}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 7. Recent Audit Findings (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    7. Recent Audit Findings
                  </h2>
                  <button
                    onClick={() => setActiveTab("audits-findings")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All Findings
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-1">ID</th>
                        <th className="py-2 px-1">Clause</th>
                        <th className="py-2 px-2">Finding</th>
                        <th className="py-2 px-1 text-center">Severity</th>
                        <th className="py-2 pl-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {findings.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-1 font-mono font-bold text-blue-600">
                            {f.id}
                          </td>
                          <td className="py-2.5 px-1 font-mono text-slate-600 dark:text-slate-400">
                            {f.clause}
                          </td>
                          <td className="py-2.5 px-2 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                            {f.finding}
                          </td>
                          <td className="py-2.5 px-1 text-center">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                f.severity === "Major"
                                  ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200"
                                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200"
                              }`}
                            >
                              {f.severity}
                            </span>
                          </td>
                          <td className="py-2.5 pl-1 text-right">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                f.status === "Open"
                                  ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200"
                                  : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200"
                              }`}
                            >
                              {f.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 8. Certification Timeline (lg:col-span-3) */}
              <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  8. Certification Timeline
                </h2>

                <div className="space-y-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {ISO_TIMELINE_MILESTONES.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-2.5 text-xs">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-900 mt-1 shrink-0 ${
                          item.dotColor === "emerald"
                            ? "bg-emerald-500"
                            : item.dotColor === "amber"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] leading-tight">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 3: Section 9 (Objectives & KPIs) + Section 10 (Documents & Evidence) + Section 11 (Compliance Risk) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 9. ISO Objectives & KPIs (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    9. ISO Objectives & KPIs
                  </h2>
                  <button
                    onClick={() => setActiveTab("objectives-kpis")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All Objectives
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-2">Objective</th>
                        <th className="py-2 px-2">KPI</th>
                        <th className="py-2 px-2 text-center">Target</th>
                        <th className="py-2 px-2 text-center">Current</th>
                        <th className="py-2 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {objectives.map((obj) => (
                        <tr key={obj.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-2 font-medium text-slate-800 dark:text-slate-200">
                            {obj.objective}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">
                            {obj.kpi}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-slate-700 dark:text-slate-300">
                            {obj.target}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-slate-900 dark:text-white tabular-nums">
                            {obj.current}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                obj.status === "On Track"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                              }`}
                            >
                              {obj.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 10. Documents & Evidence (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    10. Documents & Evidence
                  </h2>
                  <button
                    onClick={() => setShowUploadEvidenceModal(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All Documents
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-2">Document Name</th>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-1">Version</th>
                        <th className="py-2 px-2">Upload Date</th>
                        <th className="py-2 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {evidenceList.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-2 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                            {doc.documentName}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400">
                            {doc.type}
                          </td>
                          <td className="py-2.5 px-1 text-slate-500 dark:text-slate-400">
                            {doc.version}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {doc.uploadDate}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                                doc.status === "Approved"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              <span>{doc.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 11. Compliance Risk (lg:col-span-3) */}
              <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  11. Compliance Risk
                </h2>

                {/* 4 Score Tiles matching screenshot */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Risk Rating</p>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {ISO_RISK.rating}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Likelihood</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {ISO_RISK.likelihood}/5
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Impact</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {ISO_RISK.impact}/5
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Score</p>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {ISO_RISK.score}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Key Risk: </span>
                    <span className="text-slate-600 dark:text-slate-400">{ISO_RISK.keyRisk}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mitigation: </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1 text-[11px]">
                      {ISO_RISK.mitigations.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Controlled Reports View */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Header banner for reports */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-blue-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-1">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>ISO Clause Conformity & Third-Party Audit Governance</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Controlled ISO Compliance Reports & Audit Register</h2>
                  <p className="text-xs text-blue-200 mt-1 max-w-3xl">
                    Controlled audit registers satisfying ISO 9001:2015, ISO 14001, and ISO 27001 conformity frameworks, Section 34 controlled registers, Section 35 KPI Master, and 5×5 exposure heatmaps.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setExportNotice("Exporting Complete ISO Compliance Register to Excel (xlsx)...");
                      setTimeout(() => setExportNotice(null), 3500);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export All Reports (ZIP)</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>
            </div>

            {exportNotice && (
              <div className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-xs font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{exportNotice}</span>
              </div>
            )}

            {/* Section 35: ISO Compliance KPI Master */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Section 35 — Controlled ISO Compliance KPI Master & Metrics Index
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">16 Master KPIs Across 7 Domains</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                      <th className="py-2.5 px-3">Domain</th>
                      <th className="py-2.5 px-3">Metric Name</th>
                      <th className="py-2.5 px-3">Target</th>
                      <th className="py-2.5 px-3">Actual Result</th>
                      <th className="py-2.5 px-3">Variance</th>
                      <th className="py-2.5 px-3">Trend</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {ISO_KPI_MASTER.map((kpi) => (
                      <tr key={kpi.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">
                          {kpi.domain}
                        </td>
                        <td className="py-2 px-3 text-slate-800 dark:text-slate-200">
                          {kpi.metric}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-600 dark:text-slate-400">
                          {kpi.target}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-white tabular-nums">
                          {kpi.actual}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {kpi.variance}
                        </td>
                        <td className="py-2 px-3">
                          {kpi.trend === "up" && <span className="text-emerald-600 font-bold">↑ Favorable</span>}
                          {kpi.trend === "down" && <span className="text-rose-600 font-bold">↓ Critical</span>}
                          {kpi.trend === "neutral" && <span className="text-slate-500">→ Stable</span>}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              kpi.status === "Optimal"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : kpi.status === "Good"
                                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                : kpi.status === "Attention"
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
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

            {/* Section 27: 5x5 ISO Risk Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 5x5 Matrix (lg:col-span-7) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Section 27 — ISO Compliance 5×5 Risk Matrix
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Likelihood × Impact = Risk Exposure</span>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[420px] text-center">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">
                      IMPACT → (1: Insignificant, 2: Minor, 3: Moderate, 4: Major, 5: Critical)
                    </div>
                    <div className="space-y-1.5">
                      {[5, 4, 3, 2, 1].map((likelihood) => (
                        <div key={likelihood} className="flex items-center gap-1.5 justify-center">
                          <span className="w-14 text-[11px] font-bold text-slate-600 dark:text-slate-400 text-right">
                            L-{likelihood}
                          </span>
                          {[1, 2, 3, 4, 5].map((impact) => {
                            const score = likelihood * impact;
                            const isCurrent = likelihood === 3 && impact === 4;
                            return (
                              <div
                                key={impact}
                                className={`w-14 h-10 flex flex-col items-center justify-center rounded border text-xs transition-all ${getMatrixCellClass(
                                  score
                                )} ${isCurrent ? "ring-4 ring-blue-600 shadow-lg scale-105" : ""}`}
                              >
                                <span className="tabular-nums font-bold">{score}</span>
                                {isCurrent && (
                                  <span className="text-[9px] uppercase tracking-wider font-extrabold bg-blue-700 text-white px-1 rounded">
                                    ISO-001
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clause Conformance Distribution (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Clause Compliance Rate (%)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Clauses 4 to 10</span>
                </div>

                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ISO_CLAUSE_COMPLIANCE.map((c) => ({
                        name: `Cl ${c.clause}`,
                        rate: c.complianceRate,
                      }))}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Highest: Clause 10 (96%)</span>
                  <span>Lowest: Clause 6 & 8 (75%)</span>
                </div>
              </div>
            </div>

            {/* Section 34: Controlled ISO Reports Catalog & Live Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Catalog List (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    19 Controlled Reports Catalog
                  </h3>
                  <span className="text-[10px] text-slate-500">Section 34</span>
                </div>

                {/* Search & Category Filter */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search reports by title or code..."
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
                    {reportCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                          selectedCategory === cat
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Report Items List */}
                <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                  {filteredReports.map((rep) => {
                    const isSelected = selectedReport.id === rep.id;
                    return (
                      <div
                        key={rep.id}
                        onClick={() => setSelectedReport(rep)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-2xs"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                            {rep.code}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">{rep.periodicity}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                          {rep.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {rep.purpose}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Live Preview Viewer (lg:col-span-8) */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                        {selectedReport.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {selectedReport.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                        {selectedReport.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {selectedReport.purpose}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setExportNotice(`Exported ${selectedReport.title} to CSV successfully.`);
                        setTimeout(() => setExportNotice(null), 3000);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Live Sample Programs Table Preview */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                        <th className="py-2.5 px-3">ISO Program ID</th>
                        <th className="py-2.5 px-3">Standard Title</th>
                        <th className="py-2.5 px-3">Issuing Body</th>
                        <th className="py-2.5 px-3">Site Location</th>
                        <th className="py-2.5 px-3">Total Reqs</th>
                        <th className="py-2.5 px-3">Compliance Rate</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {SAMPLE_ISO_PROGRAMS.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-mono font-semibold text-blue-600">
                            {item.id}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {item.body}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {item.location}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                            {item.reqs}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white tabular-nums">
                            {item.rate}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                item.status === "Compliant"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : item.status === "Partial Compliance"
                                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                  : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Showing Active Programs under Magnertia ISO Compliance Management</span>
                  <span>Integrated with Audit Management & CAPA Engine</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs: Guidance View */}
        {/* =========================================================================
            SUBMODULE 2: COMPLIANCE DETAILS (FULL MAICW SPECIFICATION)
            ========================================================================= */}
        {activeTab === "compliance-details" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    ISO Compliance Program Master Specification (MAICW)
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2500);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save ISO Master</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    ISO Compliance Record ID (A)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.complianceId}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Controlled Reference Code (A)
                  </label>
                  <input
                    type="text"
                    value={formData.complianceCode}
                    onChange={(e) => setFormData({ ...formData, complianceCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Compliance Program Title (M)
                  </label>
                  <input
                    type="text"
                    value={formData.complianceName}
                    onChange={(e) => setFormData({ ...formData, complianceName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Standard & Edition (M)
                  </label>
                  <input
                    type="text"
                    value={`${formData.isoStandard} (${formData.standardEdition})`}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category (M)
                  </label>
                  <input
                    type="text"
                    value={formData.isoCategory}
                    onChange={(e) => setFormData({ ...formData, isoCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Management Rep (MR) (M)
                  </label>
                  <input
                    type="text"
                    value={formData.managementRep}
                    onChange={(e) => setFormData({ ...formData, managementRep: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Lead Internal Auditor (M)
                  </label>
                  <input
                    type="text"
                    value={formData.leadInternalAuditor}
                    onChange={(e) => setFormData({ ...formData, leadInternalAuditor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                  Scope of Management System (M)
                </label>
                <textarea
                  rows={3}
                  value={formData.scopeOfCompliance}
                  onChange={(e) => setFormData({ ...formData, scopeOfCompliance: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 3: REQUIREMENTS & CLAUSES REGISTER
            ========================================================================= */}
        {activeTab === "requirements-clauses" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    ISO Standard Clauses & Compliance Assessment Matrix
                  </h2>
                  <p className="text-xs text-slate-500">
                    Clauses 4 through 10 compliance state, evidence verification, and process ownership.
                  </p>
                </div>
                <button
                  onClick={() => setShowClauseModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Evaluate New Clause</span>
                </button>
              </div>

              <div className="space-y-2">
                {clauses.map((clause) => (
                  <div
                    key={clause.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/30 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900">
                        {clause.clauseNumber}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {clause.clauseTitle}
                        </p>
                        <span className="text-[11px] text-slate-500">
                          Process: {clause.processOwner} • Evidence: {clause.evidence}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updated = clauses.map((c) =>
                          c.id === clause.id
                            ? {
                                ...c,
                                status:
                                  c.status === "Compliant"
                                    ? ("Partial" as const)
                                    : c.status === "Partial"
                                    ? ("Non-Compliant" as const)
                                    : ("Compliant" as const),
                              }
                            : c
                        );
                        setClauses(updated);
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 2000);
                      }}
                      className="cursor-pointer"
                    >
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded text-xs font-bold transition-all",
                          clause.status === "Compliant"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : clause.status === "Partial"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        )}
                      >
                        {clause.status} ↻
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 4: RISKS & OPPORTUNITIES (CLAUSE 6.1)
            ========================================================================= */}
        {activeTab === "risk-opportunities" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Clause 6.1 Actions to Address Risks and Opportunities
                  </h2>
                  <p className="text-xs text-slate-500">
                    Risk register integrated with quality objectives and operational process controls.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Risk Register</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 uppercase font-semibold block text-[11px]">Identified Risks</span>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">18 Active</span>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 block">All with Assigned Controls</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 uppercase font-semibold block text-[11px]">Residual High Risks</span>
                  <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">0 Critical</span>
                  <span className="text-xs text-slate-500 mt-1 block">Tolerable Risk Threshold</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 uppercase font-semibold block text-[11px]">Strategic Opportunities</span>
                  <span className="text-2xl font-extrabold text-primary mt-1 block">7 Captured</span>
                  <span className="text-xs text-slate-500 mt-1 block">Process Optimization Programs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 5: OBJECTIVES & MEASUREMENT (CLAUSE 6.2)
            ========================================================================= */}
        {activeTab === "objectives-kpis" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Clause 6.2 Quality & System Objectives Scorecard
                  </h2>
                  <p className="text-xs text-slate-500">
                    Measurable targets consistent with the quality policy and monitored for achievement.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Refresh Metrics</span>
                </button>
              </div>

              <div className="space-y-2">
                {objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/30 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{obj.objective}</p>
                      <span className="text-[11px] text-slate-500">
                        Owner: {obj.owner} • Frequency: {obj.frequency}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        Actual: {obj.actual} / Target: {obj.target}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        {obj.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 6: DOCUMENTED INFORMATION (CLAUSE 7.5)
            ========================================================================= */}
        {activeTab === "documentation" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Clause 7.5 Documented Information Vault
                  </h2>
                  <p className="text-xs text-slate-500">
                    Controlled manual, SOPs, work instructions, forms, and audit evidence records.
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadEvidenceModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Document Reference</th>
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Clause</th>
                      <th className="py-2.5 px-3">Version</th>
                      <th className="py-2.5 px-3">Approved Date</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {evidenceList.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{doc.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{doc.title}</td>
                        <td className="py-2.5 px-3">{doc.type}</td>
                        <td className="py-2.5 px-3 font-mono">{doc.clause}</td>
                        <td className="py-2.5 px-3 font-mono">{doc.version}</td>
                        <td className="py-2.5 px-3 text-slate-500">{doc.uploadDate}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 7: AUDITS & FINDINGS (CLAUSE 9.2)
            ========================================================================= */}
        {activeTab === "audits-findings" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Clause 9.2 Internal Audits & Findings Register
                  </h2>
                  <p className="text-xs text-slate-500">
                    Internal audit programs, checklists, auditor reports, and Non-Conformance (NCR) records.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowScheduleAuditModal(true)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Schedule Audit</span>
                  </button>
                  <button
                    onClick={() => setShowAddFindingModal(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Finding / NCR</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {findings.map((finding) => (
                  <div
                    key={finding.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/30 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{finding.id}</span>
                        <span className="font-mono text-slate-500">Clause: {finding.clause}</span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold",
                            finding.severity === "Major"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                          )}
                        >
                          {finding.severity}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-white mt-1">
                        {finding.finding}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        Auditor: {finding.auditor} • Date: {finding.date}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
                      {finding.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 8: CAPA (CLAUSE 10.2)
            ========================================================================= */}
        {activeTab === "capa" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Clause 10.2 Nonconformity and Corrective Action (CAPA)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Root cause investigation, containment actions, corrective tasks, and effectiveness verifications.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateCAPAModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Initiate CAPA</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    CAPA-ISO-01: Update calibrated instrument validation protocol for Clause 7.1.5
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Owner: Ramesh S • Target Due Date: 30-Oct-2026 • Effectiveness Verified: In Progress
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
                  Open
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 9: MANAGEMENT REVIEW (CLAUSE 9.3)
            ========================================================================= */}
        {activeTab === "management-review" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Clause 9.3 Management Review Meeting (MRM) Docket
                  </h2>
                  <p className="text-xs text-slate-500">
                    Executive inputs, suitability reviews, resource allocations, and continual improvement outputs.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitSuccess(true);
                    setTimeout(() => setSubmitSuccess(false), 2500);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish MRM Minutes</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    MRM-2026-Q1 Executive Review Completed
                  </span>
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-700">
                    Approved by Executive Board
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Chairperson: Managing Director. All 12 mandatory ISO input agendas reviewed: customer feedback, audit results, process performance, risk mitigation, and resource adequacy.
                </p>
                <div className="text-[11px] text-slate-400">
                  Meeting Date: 12-Feb-2026 • Document Ref: MRM-DOC-2026-01
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 10: RELATED RECORDS & HISTORY
            ========================================================================= */}
        {activeTab === "related-records" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Connected ERP Modules & Operational Integrations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ISO_RELATED_RECORDS.map((rel) => (
                  <Link
                    key={rel.id}
                    to={rel.to as any}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-slate-50 dark:bg-slate-800/40 transition-colors block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{rel.label}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {rel.count} Links
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-2 block font-mono">{rel.to} →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                ISO Compliance Program Change Ledger & Audit Trail
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      ISO 9001:2015 Annual Surveillance Program Validated
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Timestamp: 25-Sep-2026 10:30 IST • Actor: Lead Auditor • Hash: #ISO-COMP-9001-OK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: New Record */}
      {showNewRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Initialize New ISO Compliance Program
                </h3>
              </div>
              <button onClick={() => setShowNewRecordModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Program Name / Standard
                </label>
                <input
                  type="text"
                  placeholder="e.g. ISO 14001:2015 Environmental Management Program"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    ISO Standard
                  </label>
                  <select className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    <option value="ISO 14001:2015">ISO 14001:2015</option>
                    <option value="ISO 27001:2022">ISO 27001:2022</option>
                    <option value="ISO 45001:2018">ISO 45001:2018</option>
                    <option value="ISO 50001:2018">ISO 50001:2018</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Scheduled Audit Date
                  </label>
                  <input
                    type="text"
                    defaultValue="15-Feb-2027"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRecordModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowNewRecordModal(false);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2800);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  Create Program File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: View Clause Mapping */}
      {showClauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ISO 9001:2015 Clause-to-Process Mapping Register
                </h3>
              </div>
              <button onClick={() => setShowClauseModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto space-y-2 text-xs pr-1">
              {ISO_CLAUSE_COMPLIANCE.map((c) => (
                <div key={c.clause} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-blue-600">Clause {c.clause}</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{c.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {c.compliant} Compliant · {c.partial} Partial · {c.nonCompliant} Gaps
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">{c.complianceRate}%</span>
                    <p className="text-[10px] text-emerald-600 font-semibold">Conformity Score</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowClauseModal(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
              >
                Close Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Upload Evidence */}
      {showUploadEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Upload Documented Information Evidence
                </h3>
              </div>
              <button onClick={() => setShowUploadEvidenceModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Document Title / Record
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calibration Register 2026"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Document Type
                </label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as typeof newDocType)}
                  className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="Manual">Manual</option>
                  <option value="Process Document">Process Document</option>
                  <option value="Audit Report">Audit Report</option>
                  <option value="Record">Record</option>
                  <option value="SOP">SOP</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-[11px] text-slate-500">Drag and drop scanned PDF/PNG or click to browse</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size: 25 MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadEvidenceModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  Attach & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Schedule Audit */}
      {showScheduleAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Schedule ISO Audit Session
                </h3>
              </div>
              <button onClick={() => setShowScheduleAuditModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Audit Scope / Type
                </label>
                <select className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  <option value="Certification Audit">Stage 1 & 2 Certification Audit</option>
                  <option value="Internal Audit">Internal QMS Management Audit</option>
                  <option value="Surveillance Audit">Annual Surveillance Audit</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Scheduled Audit Date
                </label>
                <input
                  type="text"
                  defaultValue="15-Feb-2027"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lead Auditor Body
                </label>
                <input
                  type="text"
                  defaultValue="TÜV SÜD Lead Auditor Team"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowScheduleAuditModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowScheduleAuditModal(false);
                    setSubmitSuccess(true);
                    setTimeout(() => setSubmitSuccess(false), 3000);
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold cursor-pointer"
                >
                  Confirm Audit Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Add Finding */}
      {showAddFindingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Log Audit Non-Conformity / Finding
                </h3>
              </div>
              <button onClick={() => setShowAddFindingModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFinding} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Related ISO Clause
                  </label>
                  <select
                    value={newFindingClause}
                    onChange={(e) => setNewFindingClause(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="4.1">4.1 Context</option>
                    <option value="5.1">5.1 Leadership</option>
                    <option value="6.1">6.1 Risks & Opps</option>
                    <option value="7.2">7.2 Competence</option>
                    <option value="8.1">8.1 Operations</option>
                    <option value="8.5">8.5 Supplier Control</option>
                    <option value="9.1">9.1 Performance</option>
                    <option value="10.2">10.2 Non-Conformity</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Severity
                  </label>
                  <select
                    value={newFindingSeverity}
                    onChange={(e) => setNewFindingSeverity(e.target.value as typeof newFindingSeverity)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Minor">Minor Non-Conformity</option>
                    <option value="Major">Major Non-Conformity</option>
                    <option value="Observation">Observation / OFI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Finding Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail objective evidence and standard clause violation..."
                  value={newFindingText}
                  onChange={(e) => setNewFindingText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFindingModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
                >
                  Log Finding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Create CAPA Action */}
      {showCreateCAPAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Create Corrective Action (CAPA)
                </h3>
              </div>
              <button onClick={() => setShowCreateCAPAModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Corrective Action Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Update Supplier Evaluation Criteria and Audit Records"
                  value={newCAPATitle}
                  onChange={(e) => setNewCAPATitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Assignee Owner
                  </label>
                  <input
                    type="text"
                    value={newCAPAOwner}
                    onChange={(e) => setNewCAPAOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="text"
                    value={newCAPADueDate}
                    onChange={(e) => setNewCAPADueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCreateCAPAModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCreateCAPAModal(false);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2800);
                  }}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer"
                >
                  Dispatch CAPA
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
