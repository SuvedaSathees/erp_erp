// Magnertia ERP - Legal Register Module
// Management -> Compliance -> Legal Register
// Legal Register Form — MAICW Classification, Overview, Widgets, and Controlled Audit Reports

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
  Building2,
  CheckCheck,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  PRIMARY_LEGAL_RECORD,
  LEGAL_EXECUTIVE_KPIS,
  LEGAL_KEY_DATES,
  RELATED_OBLIGATIONS,
  RECENT_ASSESSMENTS,
  LEGAL_RISK_ITEMS,
  REGULATORY_UPDATES,
  LEGAL_DOCUMENTS,
  COMPLIANCE_TREND_DATA,
  CONTROLLED_LEGAL_REPORTS,
  LEGAL_KPI_MASTER,
  SAMPLE_LEGAL_REGISTER,
  LegalRegisterRecord,
  LegalObligationItem,
  LegalAssessmentItem,
  LegalRiskItem,
  RegulatoryUpdateItem,
  LegalDocumentItem,
  ControlledLegalReport,
  LegalKPIMetric,
} from "@/services/legalRegisterService";
import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";

export const Route = createFileRoute("/management/risk-management/legal-register")({
  component: LegalRegisterManagementPage,
});

export default function LegalRegisterManagementPage() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "legal-requirements"
    | "obligations"
    | "compliance-assessment"
    | "risks-actions"
    | "licenses-permits"
    | "regulatory-communication"
    | "documents-evidence"
    | "calendar"
    | "reports"
  >("overview");

  // Controlled form state
  const [formData, setFormData] = useState<LegalRegisterRecord>(PRIMARY_LEGAL_RECORD);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dynamic tables state
  const [obligations, setObligations] = useState<LegalObligationItem[]>(RELATED_OBLIGATIONS);
  const [assessments, setAssessments] = useState<LegalAssessmentItem[]>(RECENT_ASSESSMENTS);
  const [riskItems, setRiskItems] = useState<LegalRiskItem[]>(LEGAL_RISK_ITEMS);
  const [updates, setUpdates] = useState<RegulatoryUpdateItem[]>(REGULATORY_UPDATES);
  const [documents, setDocuments] = useState<LegalDocumentItem[]>(LEGAL_DOCUMENTS);

  // Reports state
  const [reportSearch, setReportSearch] = useState("");
  const [selectedReportCategory, setSelectedReportCategory] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<ControlledLegalReport>(CONTROLLED_LEGAL_REPORTS[0]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Modal / Dialog states
  const [showNewRequirementModal, setShowNewRequirementModal] = useState(false);
  const [showAddObligationModal, setShowAddObligationModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showScheduleReviewModal, setShowScheduleReviewModal] = useState(false);
  const [showCreateActionModal, setShowCreateActionModal] = useState(false);
  const [showViewDocsModal, setShowViewDocsModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Dynamic legal register list
  const [legalRegisterList, setLegalRegisterList] = useState(SAMPLE_LEGAL_REGISTER);

  // New Law form fields
  const [newLawCode, setNewLawCode] = useState("");
  const [newLawTitle, setNewLawTitle] = useState("");
  const [newLawCategory, setNewLawCategory] = useState("Labour");
  const [newLawJurisdiction, setNewLawJurisdiction] = useState("Central");
  const [newLawAuthority, setNewLawAuthority] = useState("Ministry of Labour and Employment");
  const [newLawScope, setNewLawScope] = useState("");

  // New Obligation modal form fields
  const [newObligationTitle, setNewObligationTitle] = useState("");
  const [newObligationFrequency, setNewObligationFrequency] = useState<LegalObligationItem["frequency"]>("Annual");
  const [newObligationDueDate, setNewObligationDueDate] = useState("30-Jun-2025");

  // New Document modal form fields
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocType, setNewDocType] = useState<LegalDocumentItem["type"]>("Certificate");
  const [newDocVersion, setNewDocVersion] = useState("1.0");

  // New CAPA Action form fields
  const [newActionTitle, setNewActionTitle] = useState("");
  const [newActionOwner, setNewActionOwner] = useState("Ramesh S");
  const [newActionDueDate, setNewActionDueDate] = useState("15-May-2025");
  const [newActionRisk, setNewActionRisk] = useState("Medium");

  // Filter for Legal Requirements master tab
  const [reqSearch, setReqSearch] = useState("");
  const [reqCategoryFilter, setReqCategoryFilter] = useState("All");

  // Add Law Handler
  const handleAddLaw = () => {
    if (!newLawTitle.trim()) return;
    const code = newLawCode.trim() || `LEG-00${legalRegisterList.length + 1}`;
    const newLaw = {
      id: `LR-2025-00${legalRegisterList.length + 1}`,
      code: code,
      name: newLawTitle,
      category: newLawCategory,
      authority: newLawAuthority,
      location: "Coimbatore DC & Namakkal",
      risk: "Medium",
      status: "Compliant",
    };
    setLegalRegisterList([newLaw, ...legalRegisterList]);
    setFormData((prev) => ({
      ...prev,
      legalCode: code,
      legalRequirementTitle: newLawTitle,
      legalCategory: newLawCategory as any,
      regulatoryAuthority: newLawAuthority,
      complianceStatus: "Compliant",
    }));
    setNewLawCode("");
    setNewLawTitle("");
    setNewLawScope("");
    setShowNewRequirementModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Save handler
  const handleSave = () => {
    setLegalRegisterList((prev) =>
      prev.map((item) =>
        item.code === formData.legalCode
          ? {
              ...item,
              name: formData.legalRequirementTitle,
              category: formData.legalCategory,
              authority: formData.regulatoryAuthority,
              status: formData.complianceStatus,
            }
          : item,
      ),
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Submit handler
  const handleSubmit = () => {
    setFormData((prev) => ({
      ...prev,
      complianceStatus: "Compliant",
      lastAssessmentDate: "15-Apr-2025",
    }));
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return CONTROLLED_LEGAL_REPORTS.filter((rep) => {
      const matchCat = selectedReportCategory === "All" || rep.category === selectedReportCategory;
      const matchSearch =
        rep.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.code.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.purpose.toLowerCase().includes(reportSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [reportSearch, selectedReportCategory]);

  // Donut chart data for Compliance Status (Section 3)
  const complianceStatusData = [
    { name: "Compliant", value: 102, percentage: "80%", color: "#10b981" },
    { name: "Partial", value: 14, percentage: "11%", color: "#f59e0b" },
    { name: "Non-Compliant", value: 12, percentage: "9%", color: "#ef4444" },
  ];

  // Helper for status badge colors
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant":
      case "closed":
      case "valid":
      case "implemented":
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "due soon":
      case "partial":
      case "review":
      case "action required":
      case "in progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "non-compliant":
      case "overdue":
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <AppShell
      title="Legal Register"
      breadcrumb="Management > Compliance > Legal Register"
      description="Comprehensive register of applicable acts, legal obligations, statutory registers, and compliance status."
      tabs={<ComplianceTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Breadcrumb & Notification Banner */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-sm transition-all animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Legal Register record LR-2026-001 successfully saved to master registry.</span>
            </div>
            <button onClick={() => setSaveSuccess(false)} className="hover:opacity-75">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {submitSuccess && (
          <div className="bg-blue-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-sm transition-all animate-in fade-in">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Legal compliance verification package submitted for regulatory & legal sign-off.</span>
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
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Legal Register
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                    LR-2026-001
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Stay Compliant. Manage Risk. Enable Sustainable Growth.
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <button
                onClick={() => setShowNewRequirementModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Legal Requirement</span>
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
                      <span>Upload Statutory Evidence</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowScheduleReviewModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <CalendarPlus className="h-3.5 w-3.5 text-amber-500" />
                      <span>Schedule Legal Review</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateActionModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <CheckSquare className="h-3.5 w-3.5 text-purple-500" />
                      <span>Initiate CAPA Action</span>
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
                      <span>Open 18 Controlled Reports</span>
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
        {/* 6 TOP EXECUTIVE KPI WIDGETS (EXACTLY AS IN SCREENSHOT)                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Requirements */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
                <Scale className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ 12%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">128</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Total Requirements</div>
            </div>
          </div>

          {/* Card 2: Compliant */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-emerald-500 text-white shadow-xs">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ 8%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">102</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Compliant</div>
            </div>
          </div>

          {/* Card 3: Partial Compliance */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500 text-white shadow-xs">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                <span>↑ 27%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">14</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Partial Compliance</div>
            </div>
          </div>

          {/* Card 4: Non-Compliant */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-red-500 text-white shadow-xs">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-red-600">
                <span>↓ 8%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">12</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Non-Compliant</div>
            </div>
          </div>

          {/* Card 5: Due in 30 Days */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-purple-600 text-white shadow-xs">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ 50%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">18</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Due in 30 Days</div>
            </div>
          </div>

          {/* Card 6: Open Legal Risks */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-teal-600 text-white shadow-xs">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↓ 25%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">6</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Open Legal Risks</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OVERVIEW TAB CONTENT (SECTIONS 1 TO 11 1:1 WITH SCREENSHOT)               */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Grid: Section 1, Section 2, Section 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 1: Legal Requirement Information (Col span 6) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>1. Legal Requirement Information</span>
                  </h2>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    MAICW Classified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Row 1 */}
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Legal Register ID</label>
                    <input
                      type="text"
                      disabled
                      value={formData.legalRegisterId}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Legal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.legalCode}
                      onChange={(e) => setFormData({ ...formData, legalCode: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Legal Requirement Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.legalRequirementTitle}
                      onChange={(e) => setFormData({ ...formData, legalRequirementTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Legal Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.legalCategory}
                      onChange={(e) => setFormData({ ...formData, legalCategory: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Labour">Labour</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Tax">Finance & Tax</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Product">Product & Technology</option>
                      <option value="Safety">Workplace Safety</option>
                      <option value="Cyber">Cybersecurity & Data</option>
                      <option value="Customs">Import / Export</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Jurisdiction <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.jurisdiction}
                      onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Central">Central</option>
                      <option value="State">State</option>
                      <option value="Local">Local</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="European Union">European Union</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>

                  {/* Row 3 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">State / Region</label>
                    <select
                      value={formData.stateRegion}
                      onChange={(e) => setFormData({ ...formData, stateRegion: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Regulatory Authority <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.regulatoryAuthority}
                      onChange={(e) => setFormData({ ...formData, regulatoryAuthority: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Chief Inspector of Factories">Chief Inspector of Factories</option>
                      <option value="Tamil Nadu Pollution Control Board">Tamil Nadu Pollution Control Board</option>
                      <option value="Employees' Provident Fund Organisation">EPFO</option>
                      <option value="Ministry of Corporate Affairs">Ministry of Corporate Affairs</option>
                      <option value="Bureau of Indian Standards">Bureau of Indian Standards</option>
                      <option value="Central Board of Indirect Taxes and Customs">CBIC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Law / Regulation No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lawRegulationNo}
                      onChange={(e) => setFormData({ ...formData, lawRegulationNo: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Row 4 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Version / Amendment</label>
                    <input
                      type="text"
                      value={formData.versionAmendment}
                      onChange={(e) => setFormData({ ...formData, versionAmendment: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Business Function <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.businessFunction}
                      onChange={(e) => setFormData({ ...formData, businessFunction: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance & Tax">Finance & Tax</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="EHS & Safety">EHS & Safety</option>
                      <option value="Supply Chain">Supply Chain</option>
                      <option value="IT & Security">IT & Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Plant Maintenance">Plant Maintenance</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="Corporate Legal">Corporate Legal</option>
                    </select>
                  </div>

                  {/* Row 5 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Process</label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Factory Operations">Factory Operations</option>
                      <option value="Statutory Filing">Statutory Filing</option>
                      <option value="Effluent Treatment">Effluent Treatment</option>
                      <option value="Payroll & PF">Payroll & PF</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Legal Owner <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {formData.legalOwner.initials}
                      </span>
                      <span className="text-xs text-slate-800 font-medium truncate">{formData.legalOwner.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Compliance Coordinator</label>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-slate-200">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {formData.complianceCoordinator.initials}
                      </span>
                      <span className="text-xs text-slate-800 font-medium truncate">
                        {formData.complianceCoordinator.name}
                      </span>
                    </div>
                  </div>

                  {/* Row 6 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Site / Location</label>
                    <select
                      value={formData.siteLocation}
                      onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Namakkal - Manufacturing Plant">Namakkal - Manufacturing Plant</option>
                      <option value="Coimbatore - Engineering Center">Coimbatore - Engineering Center</option>
                      <option value="Chennai - Corporate Office">Chennai - Corporate Office</option>
                      <option value="Enterprise-Wide">Enterprise-Wide</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Effective Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs"
                      />
                      <Calendar className="absolute left-2 top-2 h-3.5 w-3.5 text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Review Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.reviewDate}
                        onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                        className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs"
                      />
                      <Calendar className="absolute left-2 top-2 h-3.5 w-3.5 text-blue-500" />
                    </div>
                  </div>

                  {/* Row 7 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-slate-800 font-medium">{formData.status}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Applicability <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.applicability}
                      onChange={(e) => setFormData({ ...formData, applicability: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs"
                    >
                      <option value="Applicable">Applicable</option>
                      <option value="Partially Applicable">Partially Applicable</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Compliance Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-slate-800 font-medium">{formData.complianceStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Legal Requirement Overview (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">2. Legal Requirement Overview</h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-0.5">Requirement Description</span>
                    <p className="text-slate-600 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      {formData.requirementDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <span className="font-semibold text-slate-700 block mb-0.5">Applicability</span>
                      <p className="text-slate-600 bg-slate-50/80 p-2 rounded-lg border border-slate-100 leading-snug">
                        {formData.applicabilityDetail}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 block mb-0.5">Compliance Deadline</span>
                      <p className="text-slate-600 bg-slate-50/80 p-2 rounded-lg border border-slate-100 leading-snug">
                        {formData.complianceDeadline}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 block mb-0.5">Scope</span>
                    <p className="text-slate-600 bg-slate-50/80 p-2 rounded-lg border border-slate-100 leading-snug">
                      {formData.scope}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Key Compliance Actions</span>
                    <ul className="space-y-1 pl-1">
                      {formData.keyComplianceActions.map((act, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Current Status</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{formData.currentStatus}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Compliance Status Donut (Col span 2) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                    3. Compliance Status
                  </h2>

                  {/* Donut Chart with center label */}
                  <div className="relative h-44 w-full flex items-center justify-center mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={complianceStatusData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={68}
                          paddingAngle={3}
                        >
                          {complianceStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-900 leading-none">128</span>
                      <span className="text-[10px] font-medium text-slate-500 mt-0.5">Requirements</span>
                    </div>
                  </div>
                </div>

                {/* Legend matching screenshot */}
                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-600">Compliant</span>
                    </div>
                    <span className="font-semibold text-slate-900">102 (80%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-600">Partial</span>
                    </div>
                    <span className="font-semibold text-slate-900">14 (11%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="text-slate-600">Non-Compliant</span>
                    </div>
                    <span className="font-semibold text-slate-900">12 (9%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row: Section 4 Key Dates & Section 5 Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 4: Key Dates (Col span 6) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">4. Key Dates</h2>
                  <span className="text-xs text-slate-500">Statutory Timelines</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {LEGAL_KEY_DATES.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                    >
                      <div className="p-1.5 rounded-md bg-blue-100 text-blue-700 shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-slate-500">{item.label}</div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Quick Actions (Col span 6) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">5. Quick Actions</h2>
                  <span className="text-xs text-slate-500">Shortcuts & Workflows</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setShowUploadDocModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4 text-blue-600" />
                    <span>Upload Evidence</span>
                  </button>
                  <button
                    onClick={() => setShowScheduleReviewModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <CalendarPlus className="h-4 w-4 text-purple-600" />
                    <span>Schedule Review</span>
                  </button>
                  <button
                    onClick={() => setShowCreateActionModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-emerald-600" />
                    <span>Create Action</span>
                  </button>
                  <button
                    onClick={() => setShowViewDocsModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-slate-600" />
                    <span>View Documents</span>
                  </button>
                  <button
                    onClick={() => setShowGenerateReportModal(true)}
                    className="col-span-2 p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-center gap-2 text-xs font-semibold text-blue-700 transition-colors cursor-pointer"
                  >
                    <Printer className="h-4 w-4 text-blue-600" />
                    <span>Generate Compliance Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Third Row: Section 6 Related Legal Obligations, Section 7 Recent Compliance Assessments, Section 8 Legal Risk Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 6: Related Legal Obligations (Col span 5) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">6. Related Legal Obligations</h2>
                  <button
                    onClick={() => setShowAddObligationModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Obligation</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-2">ID</th>
                        <th className="pb-2">Obligation</th>
                        <th className="pb-2">Frequency</th>
                        <th className="pb-2">Due Date</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {obligations.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-medium text-slate-700">{item.id}</td>
                          <td className="py-2.5 font-semibold text-slate-900">{item.obligation}</td>
                          <td className="py-2.5 text-slate-600">{item.frequency}</td>
                          <td className="py-2.5 text-slate-600">{item.dueDate}</td>
                          <td className="py-2.5 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                                item.status,
                              )}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === "Closed" || item.status === "Compliant"
                                    ? "bg-emerald-500"
                                    : item.status === "Due Soon"
                                      ? "bg-amber-500"
                                      : "bg-blue-500"
                                }`}
                              />
                              <span>{item.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 7: Recent Compliance Assessments (Col span 3) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">7. Recent Compliance Assessments</h2>
                  <button
                    onClick={() => setActiveTab("compliance-assessment")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Assessor</th>
                        <th className="pb-2">Result</th>
                        <th className="pb-2 text-right">Findings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {assessments.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 text-slate-600">{item.date}</td>
                          <td className="py-2.5 font-medium text-slate-800">{item.assessor}</td>
                          <td className="py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                item.result === "Compliant"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {item.result}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-semibold text-slate-800">{item.findings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 8: Legal Risk Matrix (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">8. Legal Risk Matrix</h2>
                  <button
                    onClick={() => setActiveTab("risks-actions")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-2">Risk</th>
                        <th className="pb-2">Likelihood</th>
                        <th className="pb-2">Impact</th>
                        <th className="pb-2">Score</th>
                        <th className="pb-2 text-right">Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {riskItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="py-2 font-medium text-slate-800 truncate max-w-[130px]">{item.risk}</td>
                          <td className="py-2 text-center text-slate-600">{item.likelihood}</td>
                          <td className="py-2 text-center text-slate-600">{item.impact}</td>
                          <td className="py-2 font-semibold text-slate-900">{item.score}</td>
                          <td className="py-2 text-right">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                item.level === "High"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {item.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Row: Section 9 Regulatory Updates, Section 10 Documents & Evidence, Section 11 Compliance Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 9: Regulatory Updates (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">9. Regulatory Updates</h2>
                  <button
                    onClick={() => setActiveTab("regulatory-communication")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Title</th>
                        <th className="pb-2">Authority</th>
                        <th className="pb-2">Impact</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {updates.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 text-slate-600 whitespace-nowrap">{item.date}</td>
                          <td className="py-2.5 font-medium text-slate-900 max-w-[140px] truncate">{item.title}</td>
                          <td className="py-2.5 text-slate-600">{item.authority}</td>
                          <td className="py-2.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                item.impact === "High"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {item.impact}
                            </span>
                          </td>
                          <td className="py-2.5 text-right">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                item.status === "Implemented"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : item.status === "Action Required"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
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
              </div>

              {/* Section 10: Documents & Evidence (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">10. Documents & Evidence</h2>
                  <button
                    onClick={() => setShowUploadDocModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
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
                      {documents.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-medium text-slate-900 max-w-[140px] truncate">
                            {item.documentName}
                          </td>
                          <td className="py-2.5 text-slate-600">{item.type}</td>
                          <td className="py-2.5 text-slate-600">{item.version}</td>
                          <td className="py-2.5 text-slate-600 whitespace-nowrap">{item.uploadDate}</td>
                          <td className="py-2.5 text-right">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="h-3 w-3" />
                              <span>Valid</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 11: Compliance Trend (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">11. Compliance Trend</h2>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Current: 80%</span>
                </div>

                <div className="h-44 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={COMPLIANCE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        ticks={[0, 25, 50, 75, 100]}
                      />
                      <Tooltip
                        formatter={(val: any) => [`${val}%`, "Compliance %"]}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#e2e8f0",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="compliance"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#2563eb", strokeWidth: 1.5, stroke: "#ffffff" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[11px] text-slate-500 text-center">
                  Statutory conformance progression across enterprise operational facilities (Jan 2024 - Jan 2025)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: LEGAL REQUIREMENTS MASTER REGISTRY                                   */}
        {/* ========================================================================= */}
        {activeTab === "legal-requirements" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Legal Requirement Master Register</h2>
                <p className="text-xs text-slate-500">
                  Comprehensive listing of all statutes, acts, notifications, and rules applicable to Magnertia
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by code or title..."
                    value={reqSearch}
                    onChange={(e) => setReqSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
                  />
                </div>
                <select
                  value={reqCategoryFilter}
                  onChange={(e) => setReqCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Labour">Labour</option>
                  <option value="Tax">Finance & Tax</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Product">Product</option>
                  <option value="Cyber">Cyber</option>
                </select>
                <button
                  onClick={() => setShowNewRequirementModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Law</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">Register ID</th>
                    <th className="p-3">Code</th>
                    <th className="p-3">Law / Statute Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Regulatory Authority</th>
                    <th className="p-3">Scope / Facility</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {legalRegisterList.filter((item) => {
                    const matchSearch =
                      item.name.toLowerCase().includes(reqSearch.toLowerCase()) ||
                      item.code.toLowerCase().includes(reqSearch.toLowerCase());
                    const matchCat = reqCategoryFilter === "All" || item.category === reqCategoryFilter;
                    return matchSearch && matchCat;
                  }).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-blue-600">{item.id}</td>
                      <td className="p-3 font-mono font-medium text-slate-700">{item.code}</td>
                      <td className="p-3 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{item.authority}</td>
                      <td className="p-3 text-slate-600">{item.location}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            item.risk === "High"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {item.risk}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                            item.status,
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "Compliant"
                                ? "bg-emerald-500"
                                : item.status === "Partial"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              legalRegisterId: item.id,
                              legalCode: item.code,
                              legalRequirementTitle: item.name,
                              legalCategory: item.category as any,
                              regulatoryAuthority: item.authority,
                              complianceStatus: item.status as any,
                            });
                            setActiveTab("overview");
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          Load Form
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
        {/* TAB: OBLIGATIONS MASTER REGISTER                                          */}
        {/* ========================================================================= */}
        {activeTab === "obligations" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Legal Obligation Register</h2>
                <p className="text-xs text-slate-500">
                  Statutory obligations, returns, registers, licenses, and periodic inspections
                </p>
              </div>
              <button
                onClick={() => setShowAddObligationModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Legal Obligation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="text-xs font-semibold text-slate-500">Total Statutory Obligations</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">242</div>
                <div className="text-[11px] text-emerald-600 mt-0.5">Across 8 legal categories</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="text-xs font-semibold text-slate-500">Completed / Closed</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">198</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Full documentary evidence</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="text-xs font-semibold text-slate-500">Due in 30 Days</div>
                <div className="text-2xl font-bold text-amber-600 mt-1">18</div>
                <div className="text-[11px] text-amber-600 mt-0.5">Under active preparation</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="text-xs font-semibold text-slate-500">Overdue Obligations</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">0</div>
                <div className="text-[11px] text-emerald-600 mt-0.5">100% on-time execution</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">Obligation ID</th>
                    <th className="p-3">Statutory Obligation</th>
                    <th className="p-3">Governing Law</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Accountable Owner</th>
                    <th className="p-3 text-right">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {obligations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-blue-600">{item.id}</td>
                      <td className="p-3 font-bold text-slate-900">{item.obligation}</td>
                      <td className="p-3 text-slate-600">{formData.legalRequirementTitle}</td>
                      <td className="p-3 text-slate-600">{item.frequency}</td>
                      <td className="p-3 text-slate-800 font-medium">{item.dueDate}</td>
                      <td className="p-3 text-slate-700">Ramesh S (Operations)</td>
                      <td className="p-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                            item.status,
                          )}`}
                        >
                          <span>{item.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: COMPLIANCE ASSESSMENT & AUDITS                                       */}
        {/* ========================================================================= */}
        {activeTab === "compliance-assessment" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Legal Compliance Assessments & Audits</h2>
                <p className="text-xs text-slate-500">
                  Statutory audit log, internal compliance testing, and external regulatory inspection records
                </p>
              </div>
              <button
                onClick={() => setShowScheduleReviewModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Schedule New Assessment</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">Assessment ID</th>
                    <th className="p-3">Audit Date</th>
                    <th className="p-3">Assessor / Inspector</th>
                    <th className="p-3">Scope</th>
                    <th className="p-3">Findings</th>
                    <th className="p-3">Compliance Result</th>
                    <th className="p-3 text-right">Verified Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-blue-600">{item.id}</td>
                      <td className="p-3 text-slate-800 font-medium">{item.date}</td>
                      <td className="p-3 font-semibold text-slate-900">{item.assessor}</td>
                      <td className="p-3 text-slate-600">Manufacturing Facility & Support Functions</td>
                      <td className="p-3 font-bold text-slate-900">{item.findings} Observations</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                            item.result === "Compliant"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {item.result}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-xs text-slate-500 font-medium">CAPA Verified & Closed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: RISKS & ACTIONS (5x5 MATRIX + TREATMENT)                             */}
        {/* ========================================================================= */}
        {activeTab === "risks-actions" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Legal Risk Matrix & Treatment Plan</h2>
                <p className="text-xs text-slate-500">
                  Evaluation of statutory non-compliance penalties, operational interruptions, and mitigation controls
                </p>
              </div>
              <button
                onClick={() => setShowCreateActionModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Mitigation Action</span>
              </button>
            </div>

            {/* 5x5 Matrix Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-2">5×5 Legal Exposure Matrix</div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                  {[
                    // Row 5
                    { score: 5, col: "bg-amber-200 text-amber-800" },
                    { score: 10, col: "bg-amber-300 text-amber-900" },
                    { score: 15, col: "bg-red-300 text-red-900" },
                    { score: 20, col: "bg-red-400 text-white" },
                    { score: 25, col: "bg-red-600 text-white" },
                    // Row 4
                    { score: 4, col: "bg-emerald-200 text-emerald-800" },
                    { score: 8, col: "bg-amber-200 text-amber-800" },
                    { score: 12, col: "bg-amber-300 text-amber-900" },
                    { score: 16, col: "bg-red-400 text-white" },
                    { score: 20, col: "bg-red-500 text-white" },
                    // Row 3
                    { score: 3, col: "bg-emerald-100 text-emerald-800" },
                    { score: 6, col: "bg-emerald-200 text-emerald-800" },
                    { score: 9, col: "bg-amber-200 text-amber-800" },
                    { score: 12, col: "bg-amber-300 text-amber-900" },
                    { score: 15, col: "bg-red-400 text-white" },
                    // Row 2
                    { score: 2, col: "bg-emerald-100 text-emerald-800" },
                    { score: 4, col: "bg-emerald-200 text-emerald-800" },
                    { score: 6, col: "bg-emerald-200 text-emerald-800" },
                    { score: 8, col: "bg-amber-200 text-amber-800" },
                    { score: 10, col: "bg-amber-300 text-amber-900" },
                    // Row 1
                    { score: 1, col: "bg-emerald-100 text-emerald-800" },
                    { score: 2, col: "bg-emerald-100 text-emerald-800" },
                    { score: 3, col: "bg-emerald-100 text-emerald-800" },
                    { score: 4, col: "bg-emerald-200 text-emerald-800" },
                    { score: 5, col: "bg-amber-200 text-amber-800" },
                  ].map((cell, idx) => (
                    <div
                      key={idx}
                      className={`h-9 flex items-center justify-center rounded ${cell.col} shadow-2xs font-semibold`}
                    >
                      {cell.score}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                  <span>Likelihood: 1 (Rare) → 5 (Almost Certain)</span>
                  <span>Impact: 1 (Minor) → 5 (Catastrophic)</span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-bold text-slate-800">Evaluated Legal Risks</div>
                <div className="space-y-2">
                  {riskItems.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 bg-white flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{r.risk}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Likelihood: {r.likelihood} | Impact: {r.impact} | Calculated Score: {r.score}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold border ${
                          r.level === "High"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {r.level} Risk
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: LICENSES & PERMITS INTEGRATION                                       */}
        {/* ========================================================================= */}
        {activeTab === "licenses-permits" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">License & Permit Integration (Section 17)</h2>
                <p className="text-xs text-slate-500">
                  Traceability link: Legal Requirement → License / Permit → Application → Approval → Conditions →
                  Compliance
                </p>
              </div>
              <button
                onClick={() => setShowUploadDocModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Link License / Permit</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">License / Consent Name</th>
                    <th className="p-3">Issuing Authority</th>
                    <th className="p-3">Reference No.</th>
                    <th className="p-3">Issue Date</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Renewal Status</th>
                    <th className="p-3 text-right">Validity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">Factory Operating License</td>
                    <td className="p-3 text-slate-600">Chief Inspector of Factories</td>
                    <td className="p-3 font-mono text-slate-700">TN/NK/FAC/2024/9912</td>
                    <td className="p-3 text-slate-600">01-Jan-2024</td>
                    <td className="p-3 text-slate-600">31-Dec-2025</td>
                    <td className="p-3 text-emerald-600 font-semibold">Active & Valid</td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Valid
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">Consent to Operate (Air & Water)</td>
                    <td className="p-3 text-slate-600">TN Pollution Control Board</td>
                    <td className="p-3 font-mono text-slate-700">TNPCB/CTO/IND/2023/881</td>
                    <td className="p-3 text-slate-600">15-Mar-2023</td>
                    <td className="p-3 text-slate-600">31-Mar-2026</td>
                    <td className="p-3 text-emerald-600 font-semibold">Active & Valid</td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Valid
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">Fire NOC & Safety Clearance</td>
                    <td className="p-3 text-slate-600">State Fire and Rescue Services</td>
                    <td className="p-3 font-mono text-slate-700">FRS/NOC/2024/440</td>
                    <td className="p-3 text-slate-600">10-Jan-2024</td>
                    <td className="p-3 text-slate-600">09-Jan-2025</td>
                    <td className="p-3 text-amber-600 font-semibold">Renewal in Progress</td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Renewal Due
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: REGULATORY COMMUNICATION                                             */}
        {/* ========================================================================= */}
        {activeTab === "regulatory-communication" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Regulatory Communication & Circulars (Section 20)</h2>
                <p className="text-xs text-slate-500">
                  Government notices, authority circulars, formal responses, and compliance clarifications
                </p>
              </div>
              <button
                onClick={() => setShowUploadDocModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Log New Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {updates.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          item.impact === "High"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {item.impact} Impact
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Authority: {item.authority}</span>
                      <span>•</span>
                      <span>Date: {item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        item.status === "Implemented"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : item.status === "Action Required"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {item.status}
                    </span>
                    <button
                      onClick={() => setShowViewDocsModal(true)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      View Notice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: DOCUMENTS & EVIDENCE                                                 */}
        {/* ========================================================================= */}
        {activeTab === "documents-evidence" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Legal Compliance Evidence Library (Section 13)</h2>
                <p className="text-xs text-slate-500">
                  Controlled statutory filings, inspection reports, certificates, and government receipts
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
                    <th className="p-3">Evidence ID</th>
                    <th className="p-3">Document Title</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Version</th>
                    <th className="p-3">Upload Date</th>
                    <th className="p-3">Storage / File Ref</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-blue-600">{item.id}</td>
                      <td className="p-3 font-bold text-slate-900">{item.documentName}</td>
                      <td className="p-3 text-slate-600">{item.type}</td>
                      <td className="p-3 text-slate-600">{item.version}</td>
                      <td className="p-3 text-slate-600">{item.uploadDate}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">s3://magnertia-legal/evidence/{item.id}.pdf</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="h-3 w-3" />
                          <span>Valid</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: CALENDAR (LEGAL CALENDAR & ALERT LEVELS)                             */}
        {/* ========================================================================= */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Legal Calendar & Statutory Deadlines (Section 25)</h2>
                <p className="text-xs text-slate-500">
                  Chronological schedule of statutory filings, license expiries, permit renewals, and inspections
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Alert Thresholds:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">180d</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">90d</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">30d</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">7d</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  date: "15-Mar-2025",
                  title: "Annual Safety Audit Inspection",
                  type: "Inspection",
                  owner: "EHS / Plant Head",
                  daysLeft: "Due in 18 Days",
                  urgent: true,
                },
                {
                  date: "31-Mar-2025",
                  title: "Factories Act Annual Statutory Return Submission",
                  type: "Statutory Filing",
                  owner: "Ramesh S",
                  daysLeft: "Due in 34 Days",
                  urgent: false,
                },
                {
                  date: "30-Apr-2025",
                  title: "Consent to Operate Air Quality Half-Yearly Manifest",
                  type: "Environmental Return",
                  owner: "Priya Sharma",
                  daysLeft: "Due in 64 Days",
                  urgent: false,
                },
                {
                  date: "31-Dec-2025",
                  title: "Factory Operating License Renewal Window Opens",
                  type: "License Renewal",
                  owner: "Legal Dept.",
                  daysLeft: "Due in 309 Days",
                  urgent: false,
                },
              ].map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs shrink-0 flex flex-col items-center">
                      <Calendar className="h-4 w-4 mb-0.5" />
                      <span>{ev.date.split("-")[0]}</span>
                      <span className="text-[10px] uppercase font-semibold">{ev.date.split("-")[1]}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{ev.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Category: {ev.type} | Responsible Owner: {ev.owner}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ev.urgent ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-slate-100 text-slate-700"
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
        {/* TAB: REPORTS (SECTION 32 - 18 CONTROLLED REPORTS & SECTION 33 KPI MASTER)  */}
        {/* ========================================================================= */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Section 33: Legal Compliance KPI Master */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Section 33: Legal Compliance KPI Master
                  </h2>
                  <p className="text-xs text-slate-500">
                    Key performance indicators governing enterprise compliance, filings, audits, licenses, and risk posture
                  </p>
                </div>
                <button
                  onClick={() => setShowGenerateReportModal(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Master Metrics</span>
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
                    {LEGAL_KPI_MASTER.map((kpi) => (
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
                                : "bg-blue-50 text-blue-700 border border-blue-200"
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

            {/* Section 32: 18 Controlled Legal Reports Register */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Section 32: Controlled Legal Reports Register (18 Reports)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Statutory inventories, compliance summaries, gap reports, filings, audits, and AI intelligence reports
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
                  "Inventory & Laws",
                  "Obligations & Deadlines",
                  "Audit & Inspection",
                  "CAPA & Gaps",
                  "Risk & Permits",
                  "AI & Governance",
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
      </div>

      {/* ========================================================================= */}
      {/* MODALS & WORKFLOW DIALOGS                                                 */}
      {/* ========================================================================= */}

      {/* 1. Modal: New Legal Requirement */}
      {showNewRequirementModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Legal Requirement</h3>
                <p className="text-xs text-slate-500">Record a new statute, act, rule or regulatory notification</p>
              </div>
              <button onClick={() => setShowNewRequirementModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Legal Code</label>
                <input
                  type="text"
                  value={newLawCode}
                  onChange={(e) => setNewLawCode(e.target.value)}
                  placeholder="e.g. LAB-008"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Requirement Title</label>
                <input
                  type="text"
                  value={newLawTitle}
                  onChange={(e) => setNewLawTitle(e.target.value)}
                  placeholder="e.g. Industrial Disputes Act, 1947"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Category</label>
                <select
                  value={newLawCategory}
                  onChange={(e) => setNewLawCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option>Labour</option>
                  <option>Corporate</option>
                  <option>Finance & Tax</option>
                  <option>Environmental</option>
                  <option>Product & Technology</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Jurisdiction</label>
                <select
                  value={newLawJurisdiction}
                  onChange={(e) => setNewLawJurisdiction(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option>Central</option>
                  <option>State</option>
                  <option>Local</option>
                  <option>International</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Regulatory Authority</label>
                <input
                  type="text"
                  value={newLawAuthority}
                  onChange={(e) => setNewLawAuthority(e.target.value)}
                  placeholder="e.g. Ministry of Labour and Employment"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Effective Date</label>
                <input type="text" defaultValue="01-Apr-2025" className="w-full px-3 py-2 rounded-lg border border-slate-200" />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Requirement Scope & Description</label>
                <textarea
                  rows={3}
                  value={newLawScope}
                  onChange={(e) => setNewLawScope(e.target.value)}
                  placeholder="Describe the applicable clauses and business impact..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowNewRequirementModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLaw}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Save Legal Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Add Obligation */}
      {showAddObligationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Related Legal Obligation</h3>
              <button onClick={() => setShowAddObligationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Obligation Title</label>
                <input
                  type="text"
                  value={newObligationTitle}
                  onChange={(e) => setNewObligationTitle(e.target.value)}
                  placeholder="e.g. Hazardous Waste Manifest Submission"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Frequency</label>
                <select
                  value={newObligationFrequency}
                  onChange={(e) => setNewObligationFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="One Time">One Time</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                  <option value="Continuous">Continuous</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Due Date</label>
                <input
                  type="text"
                  value={newObligationDueDate}
                  onChange={(e) => setNewObligationDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddObligationModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newObligationTitle.trim()) {
                    setObligations([
                      ...obligations,
                      {
                        id: `OB-00${obligations.length + 1}`,
                        obligation: newObligationTitle,
                        frequency: newObligationFrequency,
                        dueDate: newObligationDueDate,
                        status: "In Progress",
                      },
                    ]);
                    setNewObligationTitle("");
                  }
                  setShowAddObligationModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                Add Obligation
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
              <h3 className="text-base font-bold text-slate-900">Upload Statutory Evidence</h3>
              <button onClick={() => setShowUploadDocModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. Consent to Operate Renewal Acknowledgement"
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
                  <option value="Certificate">Certificate</option>
                  <option value="Document">Document</option>
                  <option value="Filing">Filing</option>
                  <option value="Audit Report">Audit Report</option>
                  <option value="License">License</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-700">Click to upload or drag & drop</div>
                <div className="text-[11px] text-slate-400 mt-1">PDF, JPG, PNG up to 25MB</div>
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
                  if (newDocTitle.trim()) {
                    setDocuments([
                      ...documents,
                      {
                        id: `DOC-00${documents.length + 1}`,
                        documentName: newDocTitle,
                        type: newDocType,
                        version: newDocVersion,
                        uploadDate: "25-Sep-2026",
                        status: "Valid",
                      },
                    ]);
                    setNewDocTitle("");
                  }
                  setShowUploadDocModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                Confirm Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Schedule Review */}
      {showScheduleReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Statutory Review</h3>
              <button onClick={() => setShowScheduleReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Review Scope</label>
                <input
                  type="text"
                  defaultValue="Factories Act & EHS Regulatory Conformance Review"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Planned Date</label>
                <input type="text" defaultValue="15-Apr-2025" className="w-full px-3 py-2 rounded-lg border border-slate-200" />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Lead Reviewer / Auditor</label>
                <input type="text" defaultValue="Priya Sharma (Legal Coordinator)" className="w-full px-3 py-2 rounded-lg border border-slate-200" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowScheduleReviewModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowScheduleReviewModal(false);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }}
                className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: Create Action */}
      {showCreateActionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Corrective Action (CAPA)</h3>
              <button onClick={() => setShowCreateActionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Action Description</label>
                <input
                  type="text"
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
                  placeholder="e.g. Calibrate effluent pH sensor & file verification log"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Accountable Owner</label>
                <input
                  type="text"
                  value={newActionOwner}
                  onChange={(e) => setNewActionOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newActionDueDate}
                    onChange={(e) => setNewActionDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Risk Level</label>
                  <select
                    value={newActionRisk}
                    onChange={(e) => setNewActionRisk(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCreateActionModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newActionTitle.trim()) {
                    setRiskItems((prev) => [
                      {
                        id: `LR-00${prev.length + 1}`,
                        law: "Factories Act, 1948",
                        riskExposure: newActionTitle,
                        inherentLikelihood: 3,
                        inherentImpact: 4,
                        inherentRiskScore: 12,
                        inherentRiskLevel: newActionRisk as any,
                        mitigationControl: `Assigned to ${newActionOwner} due ${newActionDueDate}`,
                        residualLikelihood: 2,
                        residualImpact: 2,
                        residualRiskScore: 4,
                        residualRiskLevel: "Low",
                        owner: newActionOwner,
                      },
                      ...prev,
                    ]);
                    setNewActionTitle("");
                  }
                  setShowCreateActionModal(false);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 cursor-pointer"
              >
                Create Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: View Documents */}
      {showViewDocsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Legal Documents & Statutory Filings</h3>
              <button onClick={() => setShowViewDocsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{doc.documentName}</div>
                      <div className="text-[11px] text-slate-500">
                        Type: {doc.type} | Version: {doc.version} | Uploaded: {doc.uploadDate}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setExportNotice(`Downloading ${doc.documentName}...`);
                      setTimeout(() => setExportNotice(null), 2500);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>

            {exportNotice && (
              <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {exportNotice}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowViewDocsModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: Generate Controlled Report Preview */}
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

            {/* Certificate Header Mockup */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900">MAGNERTIA ENTERPRISE ERP</span>
                  <div className="text-[11px] text-slate-500">Legal Risk & Statutory Compliance Directorate</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-600">{selectedReport.code}</span>
                  <div className="text-[11px] text-slate-500">Classification: Controlled Statutory Record</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Periodicity:</span>
                  <div className="font-semibold text-slate-900">{selectedReport.periodicity}</div>
                </div>
                <div>
                  <span className="text-slate-500">Active Records:</span>
                  <div className="font-semibold text-slate-900">{selectedReport.recordsCount} Statutes / Obligations</div>
                </div>
                <div>
                  <span className="text-slate-500">Generated On:</span>
                  <div className="font-semibold text-slate-900">{selectedReport.lastGenerated}</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                This document certifies that the statutory records, applicable laws, regulatory notifications, permits, and
                obligations summarized within this controlled register have been systematically identified, risk assessed,
                and maintained under Magnertia's Legal Register System in full conformity with statutory guidelines.
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
                  <span>Print Controlled Record</span>
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
