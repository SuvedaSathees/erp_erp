// Magnertia ERP - Licenses Module
// Management -> Compliance -> Licenses
// Licenses Form — MAICW Classification, Overview, Widgets, and Controlled Audit Reports

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
  Legend,
} from "recharts";
import {
  PRIMARY_LICENSE_RECORD,
  LICENSE_EXECUTIVE_KPIS,
  LICENSE_KEY_DATES,
  LINKED_DOCUMENTS,
  COMPLIANCE_CONDITIONS,
  RENEWAL_HISTORY,
  INSPECTION_RECORDS,
  LICENSE_RISK,
  RELATED_RECORDS,
  CONTROLLED_LICENSE_REPORTS,
  LICENSE_KPI_MASTER,
  SAMPLE_LICENSES_INVENTORY,
  LinkedDocument,
  ComplianceCondition,
  ControlledLicenseReport,
} from "@/services/licensesService";
import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";

export const Route = createFileRoute("/management/risk-management/licenses")({
  component: LicensesManagementPage,
});

export default function LicensesManagementPage() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "license-details"
    | "application-approval"
    | "documents-evidence"
    | "compliance-conditions"
    | "renewal"
    | "inspections-audit"
    | "actions"
    | "related-records"
    | "history"
    | "reports"
  >("overview");

  // Controlled form state
  const [formData, setFormData] = useState(PRIMARY_LICENSE_RECORD);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Documents state
  const [documents, setDocuments] = useState<LinkedDocument[]>(LINKED_DOCUMENTS);
  const [conditions, setConditions] = useState<ComplianceCondition[]>(COMPLIANCE_CONDITIONS);

  // Reports state
  const [reportSearch, setReportSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<ControlledLicenseReport>(CONTROLLED_LICENSE_REPORTS[0]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Dialog / Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // New Document modal input state
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState<LinkedDocument["type"]>("License");
  const [newDocExpiry, setNewDocExpiry] = useState("31-Dec-2027");

  // New Inspection modal input state
  const [newInspInspector, setNewInspInspector] = useState("Municipal Health & Fire Officer");
  const [newInspFindings, setNewInspFindings] = useState("Routine annual premises compliance check completed.");

  // New Action modal input state
  const [newActionTitle, setNewActionTitle] = useState("");
  const [newActionOwner, setNewActionOwner] = useState("Ramesh S");
  const [newActionDate, setNewActionDate] = useState("15-Oct-2026");

  // Filtered reports
  const filteredReports = useMemo(() => {
    return CONTROLLED_LICENSE_REPORTS.filter((rep) => {
      const matchesSearch =
        rep.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.code.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.purpose.toLowerCase().includes(reportSearch.toLowerCase());
      const matchesCat = selectedCategory === "All" || rep.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [reportSearch, selectedCategory]);

  const reportCategories = ["All", "Inventory", "Renewal & Expiry", "Compliance & Conditions", "Audit & Inspection", "Financial & Risk", "AI & Governance"];

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

  // Add Document handler
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const newDoc: LinkedDocument = {
      id: `DOC-00${documents.length + 1}`,
      documentName: newDocName,
      type: newDocType,
      version: "1.0",
      uploadDate: "25-Sep-2026",
      expiryDate: newDocExpiry,
      status: "Valid",
    };
    setDocuments([newDoc, ...documents]);
    setNewDocName("");
    setShowUploadModal(false);
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
      title="Licenses Management"
      breadcrumb="Management > Compliance > Licenses"
      description="Operating permits, statutory licenses repository, validity tracking, and proactive renewal pipelines."
      tabs={<ComplianceTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Banner Notice for Save/Submit */}
        {saveSuccess && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>License Record LIC-2026-001 changes saved successfully!</span>
          </div>
        )}
        {submitSuccess && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <Send className="w-5 h-5" />
            <span>License Renewal & Verification workflow dispatched to Authority Desk!</span>
          </div>
        )}

        {/* =========================================================================
            TOP EXECUTIVE COMMAND HEADER
            ========================================================================= */}
        <div className="max-w-[1720px] mx-auto px-4 md:px-6 pt-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Licenses Management
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                    LIC-2026-001
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Manage Licenses. Ensure Compliance. Drive Growth.
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
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
                        setShowUploadModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-500" /> Upload Document
                    </button>
                    <button
                      onClick={() => {
                        setShowRenewalModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-amber-500" /> Schedule Renewal
                    </button>
                    <button
                      onClick={() => {
                        setShowInspectionModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5 text-emerald-500" /> Log Inspection
                    </button>
                    <button
                      onClick={() => {
                        setShowCertificateModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-500" /> View Certificate PDF
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
          {/* 1. Total Licenses */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">28</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Total Licenses
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              ↑ 12%
            </span>
          </div>

          {/* 2. Active Licenses */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">22</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Active Licenses
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              ↑ 10%
            </span>
          </div>

          {/* 3. Renewal Due */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">4</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Renewal Due
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
              ↑ 33%
            </span>
          </div>

          {/* 4. Expired Licenses */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">2</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Expired Licenses
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
              ↓ 50%
            </span>
          </div>

          {/* 5. Applications in Progress */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">3</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Applications in Progress
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              ↓ 0%
            </span>
          </div>

          {/* 6. License Compliance */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">96%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  License Compliance
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              ↑ 8%
            </span>
          </div>
        </div>

        {/* View Switcher: Overview vs Reports vs Tab Guidance */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* ROW 1: Section 1 (License Info) + Section 2 (Overview) + Section 3-5 (Lifecycle, Key Dates, Quick Actions) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column (lg:col-span-5): 1. License Information */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  1. License Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* License ID */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      License ID
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.licenseId}
                      className="w-full text-xs font-mono px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                    />
                  </div>
                  {/* License Code */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      License Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.licenseCode}
                      onChange={(e) => setFormData({ ...formData, licenseCode: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  {/* License Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      License Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.licenseName}
                      onChange={(e) => setFormData({ ...formData, licenseName: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* License Type */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      License Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.licenseType}
                      onChange={(e) => setFormData({ ...formData, licenseType: e.target.value as typeof formData.licenseType })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Business">Business</option>
                      <option value="Regulatory">Regulatory</option>
                      <option value="Facility">Facility</option>
                      <option value="Product">Product</option>
                      <option value="Software">Software</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  {/* License Category */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      License Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.licenseCategory}
                      onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value as typeof formData.licenseCategory })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Statutory">Statutory</option>
                      <option value="Operational">Operational</option>
                      <option value="Professional">Professional</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Product">Product</option>
                      <option value="Trade">Trade</option>
                    </select>
                  </div>
                  {/* Regulatory Domain */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Regulatory Domain <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.regulatoryDomain}
                      onChange={(e) => setFormData({ ...formData, regulatoryDomain: e.target.value as typeof formData.regulatoryDomain })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Local Authority">Local Authority</option>
                      <option value="State Government">State Government</option>
                      <option value="Central Government">Central Government</option>
                      <option value="Industry Regulator">Industry Regulator</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Regulatory Authority */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Regulatory Authority <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.regulatoryAuthority}
                      onChange={(e) => setFormData({ ...formData, regulatoryAuthority: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Coimbatore City Municipal Corporation">Coimbatore City Municipal Corporation</option>
                      <option value="Directorate of Industrial Safety & Health">Directorate of Industrial Safety & Health</option>
                      <option value="Tamil Nadu Pollution Control Board">Tamil Nadu Pollution Control Board</option>
                      <option value="Bureau of Indian Standards">Bureau of Indian Standards</option>
                    </select>
                  </div>
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
                      <option value="Facilities">Facilities</option>
                      <option value="Quality">Quality</option>
                      <option value="Supply Chain">Supply Chain</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <option value="Administration">Administration</option>
                      <option value="Plant Engineering">Plant Engineering</option>
                      <option value="Legal & Compliance">Legal & Compliance</option>
                      <option value="Safety & Environment">Safety & Environment</option>
                    </select>
                  </div>
                  {/* Process */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Process <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Facility Management">Facility Management</option>
                      <option value="Factory Operations">Factory Operations</option>
                      <option value="Fire Safety Governance">Fire Safety Governance</option>
                      <option value="Waste Disposal Clearance">Waste Disposal Clearance</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* License Owner with Avatar */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      License Owner <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {formData.licenseOwner.initials}
                      </span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 flex-1 truncate">
                        {formData.licenseOwner.name}
                      </span>
                    </div>
                  </div>
                  {/* Compliance Coordinator with Avatar */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Compliance Coordinator <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {formData.complianceCoordinator.initials}
                      </span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 flex-1 truncate">
                        {formData.complianceCoordinator.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <option value="Magnertia Power & Mobility Corp">Magnertia Power & Mobility Corp</option>
                    </select>
                  </div>
                  {/* Location */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Coimbatore - Development Centre">Coimbatore - Development Centre</option>
                      <option value="Chennai - Corporate Headquarters">Chennai - Corporate Headquarters</option>
                      <option value="Bengaluru - Innovation Lab">Bengaluru - Innovation Lab</option>
                      <option value="Pune - Assembly Unit">Pune - Assembly Unit</option>
                    </select>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Issue Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.issueDate}
                        onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        className="w-full text-[11px] pl-2 pr-6 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <Calendar className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
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
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="w-full text-[11px] pl-2 pr-6 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <Calendar className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Renewal Due <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.renewalDueDate}
                        onChange={(e) => setFormData({ ...formData, renewalDueDate: e.target.value })}
                        className="w-full text-[11px] pl-2 pr-6 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <Calendar className="w-3.5 h-3.5 absolute right-2 top-2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Status, Priority, Version, Confidentiality */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Active</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-red-600 dark:text-red-400 font-bold text-xs">
                      <span>↑ High</span>
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
                    <select
                      value={formData.confidentiality}
                      onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value as typeof formData.confidentiality })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Internal">Internal</option>
                      <option value="Confidential">Confidential</option>
                      <option value="Restricted">Restricted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Middle Column (lg:col-span-4): 2. License Overview */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    2. License Overview
                  </h2>

                  <div className="space-y-3.5 mt-3">
                    {/* License Requirement */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        License Requirement
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {formData.requirement}
                      </p>
                    </div>

                    {/* Business Activity & Jurisdiction */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          Business Activity
                        </p>
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                          {formData.businessActivity}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          Jurisdiction
                        </p>
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                          {formData.jurisdiction}
                        </p>
                      </div>
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

                    {/* Key Conditions */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Key Conditions
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {formData.keyConditions}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Status Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Current Status
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Valid and Compliant</span>
                  </div>
                </div>
              </div>

              {/* Right Column (lg:col-span-3): 3. License Lifecycle, 4. Key Dates & 5. Quick Actions */}
              <div className="lg:col-span-3 space-y-4">
                {/* 3. License Lifecycle Stepper */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    3. License Lifecycle
                  </h2>

                  {/* Stepper Dots */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold px-1">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Apply</span>
                    </div>
                    <div className="h-0.5 w-4 bg-emerald-500" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Review</span>
                    </div>
                    <div className="h-0.5 w-4 bg-emerald-500" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Approved</span>
                    </div>
                    <div className="h-0.5 w-4 bg-emerald-500" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
                    </div>
                    <div className="h-0.5 w-4 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                        •
                      </div>
                      <span>Renewal</span>
                    </div>
                    <div className="h-0.5 w-4 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                        •
                      </div>
                      <span>Closed</span>
                    </div>
                  </div>

                  {/* Status Banner Card */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          License is Active
                        </p>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                          Valid till 31-Dec-2026 (267 days remaining)
                        </p>
                      </div>
                    </div>
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </div>
                </div>

                {/* 4. Key Dates */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                    4. Key Dates
                  </h2>
                  <div className="space-y-2 text-xs">
                    {LICENSE_KEY_DATES.map((item, idx) => (
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
                      onClick={() => setShowUploadModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Document</span>
                    </button>
                    <button
                      onClick={() => setShowRenewalModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-amber-600" />
                      <span>Schedule Renewal</span>
                    </button>
                    <button
                      onClick={() => setShowInspectionModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Add Inspection</span>
                    </button>
                    <button
                      onClick={() => setShowActionModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-600" />
                      <span>Create Action</span>
                    </button>
                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>View License PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Section 6 (Linked Documents), Section 7 (Compliance Conditions), Section 8 (Renewal & App History) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 6. Linked Documents (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    6. Linked Documents
                  </h2>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-2">Document Name</th>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-2">Version</th>
                        <th className="py-2 px-2">Upload Date</th>
                        <th className="py-2 px-2">Expiry Date</th>
                        <th className="py-2 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-2 font-medium text-slate-800 dark:text-slate-200">
                            {doc.documentName}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400">
                            {doc.type}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400">
                            {doc.version}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {doc.uploadDate}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {doc.expiryDate}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              {doc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 7. Compliance Conditions (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    7. Compliance Conditions
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-2">Condition</th>
                        <th className="py-2 px-2">Monitoring Frequency</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 pl-2 text-right">Last Checked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {conditions.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-2 font-medium text-slate-800 dark:text-slate-200">
                            {item.condition}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400">
                            {item.monitoringFrequency}
                          </td>
                          <td className="py-2.5 px-2">
                            {item.status === "Compliant" ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                Compliant
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                On Track
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 pl-2 text-right text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {item.lastChecked}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 8. Renewal & Application History (lg:col-span-3) */}
              <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    8. Renewal & Application History
                  </h2>
                  <button
                    onClick={() => setActiveTab("renewal")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-1">Type</th>
                        <th className="py-2 px-1">Date</th>
                        <th className="py-2 px-1">Reference No.</th>
                        <th className="py-2 pl-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {RENEWAL_HISTORY.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-1 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[90px]">
                            {item.type}
                          </td>
                          <td className="py-2.5 px-1 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {item.date}
                          </td>
                          <td className="py-2.5 px-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[110px]">
                            {item.referenceNo}
                          </td>
                          <td className="py-2.5 pl-1 text-right">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                item.status === "Approved" || item.status === "Resolved"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
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
            </div>

            {/* ROW 3: Section 9 (Inspections & Audits) + Section 10 (License Risk) + Section 11 (Related Records) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 9. Inspections & Audits (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    9. Inspections & Audits
                  </h2>
                  <button
                    onClick={() => setShowInspectionModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Inspection</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-2">Date</th>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-2">Inspector / Auditor</th>
                        <th className="py-2 px-2">Findings</th>
                        <th className="py-2 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {INSPECTION_RECORDS.map((insp) => (
                        <tr key={insp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-2 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {insp.date}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400">
                            {insp.type}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300">
                            {insp.inspector}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300">
                            {insp.findings}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              {insp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 10. License Risk (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  10. License Risk
                </h2>

                {/* 4 Score Tiles matching screenshot */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Risk Rating</p>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {LICENSE_RISK.rating}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Likelihood</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {LICENSE_RISK.likelihood}/5
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Impact</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {LICENSE_RISK.impact}/5
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Score</p>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {LICENSE_RISK.score}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Key Risk: </span>
                    <span className="text-slate-600 dark:text-slate-400">{LICENSE_RISK.keyRisk}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Mitigation: </span>
                    <span className="text-slate-600 dark:text-slate-400">{LICENSE_RISK.mitigation}</span>
                  </div>
                </div>
              </div>

              {/* 11. Related Records (lg:col-span-3) */}
              <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  11. Related Records
                </h2>

                <div className="space-y-1.5 text-xs">
                  {RELATED_RECORDS.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        {rec.id === "reg" && <Scale className="w-3.5 h-3.5 text-blue-500" />}
                        {rec.id === "internal" && <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />}
                        {rec.id === "risk" && <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />}
                        {rec.id === "audit" && <FileSearch className="w-3.5 h-3.5 text-indigo-500" />}
                        {rec.id === "actions" && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                        {rec.id === "notes" && <Paperclip className="w-3.5 h-3.5 text-teal-500" />}
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {rec.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                          {rec.count}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Controlled Reports View (Requested: "add over view and report with the widges") */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Header banner for reports */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-blue-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-1">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Statutory, Operational & Audited Governance Registers</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Controlled Licenses Audit Reports Register</h2>
                  <p className="text-xs text-blue-200 mt-1 max-w-3xl">
                    Statutory reports satisfying corporate governance, Section 39 controlled audit registers, Section 40 KPI Master, 5x5 exposure heatmaps, and authority filings.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setExportNotice("Exporting Complete License Register to Excel (xlsx)...");
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

            {/* Section 40: License KPI Master */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Section 40 — Controlled License KPI Master & Metrics Index
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">16 Master KPIs Across 6 Domains</span>
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
                    {LICENSE_KPI_MASTER.map((kpi) => (
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

            {/* Section 28: 5x5 License Risk Matrix & Category Breakdown Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 5x5 Matrix (lg:col-span-7) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Section 28 — License 5×5 Risk Matrix
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
                            const isCurrent = likelihood === 3 && impact === 3;
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
                                    LIC-001
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

              {/* License Portfolio Distribution (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Section 3 — Licenses by Category Distribution
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">28 Managed Holdings</span>
                </div>

                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Business", count: 7 },
                        { name: "Factory", count: 6 },
                        { name: "Facility", count: 5 },
                        { name: "Product", count: 4 },
                        { name: "Enviro", count: 3 },
                        { name: "Software", count: 3 },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Factory & Operations: 43%</span>
                  <span>Corporate & Trade: 25%</span>
                  <span>Product & Tech: 32%</span>
                </div>
              </div>
            </div>

            {/* Section 39: Controlled License Reports Catalog & Live Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Catalog List (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    20 Controlled Reports Catalog
                  </h3>
                  <span className="text-[10px] text-slate-500">Section 39</span>
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

                {/* Live Sample Inventory Table Preview */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                        <th className="py-2.5 px-3">License ID</th>
                        <th className="py-2.5 px-3">License Name</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Issuing Authority</th>
                        <th className="py-2.5 px-3">Site Location</th>
                        <th className="py-2.5 px-3">Expiry Date</th>
                        <th className="py-2.5 px-3">Cost</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {SAMPLE_LICENSES_INVENTORY.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 px-3 font-mono font-semibold text-blue-600">
                            {item.id}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                            {item.type}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {item.authority}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {item.location}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {item.expiry}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {item.cost}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                item.status === "Active"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : item.status === "Renewal"
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
                  <span>Showing 8 of 28 Active License Records</span>
                  <span>Audit Trail Verified by Antigravity Governance Engine</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 2: LICENSE DETAILS (FULL MAICW SPECIFICATION)
            ========================================================================= */}
        {activeTab === "license-details" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    License Specification & Statutory Master (MAICW)
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
                  <span>Save License Master</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    License Identifier (A)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.licenseId}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Statutory License Code (A)
                  </label>
                  <input
                    type="text"
                    value={formData.licenseCode}
                    onChange={(e) => setFormData({ ...formData, licenseCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    License Official Title (M)
                  </label>
                  <input
                    type="text"
                    value={formData.licenseName}
                    onChange={(e) => setFormData({ ...formData, licenseName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Issuing Authority (M)
                  </label>
                  <input
                    type="text"
                    value={formData.issuingAuthority}
                    onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    License Category (M)
                  </label>
                  <input
                    type="text"
                    value={formData.licenseCategory}
                    onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Issue Date (M)
                  </label>
                  <input
                    type="text"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Expiry Date (M)
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                  Authorized Operating Scope & Permitted Commercial Activities (M)
                </label>
                <textarea
                  rows={3}
                  value={formData.scopeOfAuthorization}
                  onChange={(e) => setFormData({ ...formData, scopeOfAuthorization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 3: APPLICATION & APPROVAL WORKFLOW
            ========================================================================= */}
        {activeTab === "application-approval" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Statutory Application Dossier & Approval Routing
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track formal authority submissions, challans, gate sign-offs, and department clearances.
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
                  <span>Transmit Application Docket</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Statutory Filing ID
                  </span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                    ARN-CMC-2024-8891
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Formal Filing Acknowledged
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Application Fee Paid
                  </span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                    ₹ 18,500.00
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">Treasury Challan: CH-99014</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Approval Status
                  </span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                    Clearance Granted
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">Approved by Commissioner</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 4: DOCUMENTS & EVIDENCE VAULT
            ========================================================================= */}
        {activeTab === "documents-evidence" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Linked License Documents & Evidence Dossier
                  </h2>
                  <p className="text-xs text-slate-500">
                    Controlled vault of attested license certs, inspection proofs, NOCs, and payment receipts.
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
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
                      <th className="py-2.5 px-3">Document Title</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Version</th>
                      <th className="py-2.5 px-3">Upload Date</th>
                      <th className="py-2.5 px-3">Expiry Date</th>
                      <th className="py-2.5 px-3">Verification</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{doc.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{doc.documentName}</td>
                        <td className="py-2.5 px-3">{doc.type}</td>
                        <td className="py-2.5 px-3 font-mono">{doc.version}</td>
                        <td className="py-2.5 px-3 text-slate-500">{doc.uploadDate}</td>
                        <td className="py-2.5 px-3 text-slate-500">{doc.expiryDate}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setShowCertificateModal(true)}
                            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                          >
                            Preview
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

        {/* =========================================================================
            SUBMODULE 5: COMPLIANCE CONDITIONS REGISTER
            ========================================================================= */}
        {activeTab === "compliance-conditions" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    License Conditions & Statutory Undertakings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mandatory operational conditions imposed by the Municipal / Statutory Licensing Authority.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newCond: ComplianceCondition = {
                      id: `CND-00${conditions.length + 1}`,
                      conditionDescription: "Annual electrical safety inspection certificate from accredited engineer",
                      complianceStatus: "Complied",
                      dueDate: "31-Dec-2026",
                      riskLevel: "Medium",
                    };
                    setConditions([...conditions, newCond]);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Condition</span>
                </button>
              </div>

              <div className="space-y-2">
                {conditions.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/30"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-primary mt-0.5">{c.id}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {c.conditionDescription}
                        </p>
                        <span className="text-[11px] text-slate-500">
                          Due Date: {c.dueDate} • Risk Level: {c.riskLevel}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const updated = conditions.map((item) =>
                          item.id === c.id
                            ? {
                                ...item,
                                complianceStatus:
                                  item.complianceStatus === "Complied"
                                    ? ("In Progress" as const)
                                    : ("Complied" as const),
                              }
                            : item
                        );
                        setConditions(updated);
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 2000);
                      }}
                      className="cursor-pointer"
                    >
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded text-xs font-bold transition-all",
                          c.complianceStatus === "Complied"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        )}
                      >
                        {c.complianceStatus} ↻
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 6: RENEWAL LIFECYCLE & SCHEDULING
            ========================================================================= */}
        {activeTab === "renewal" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    License Renewal Governance & Lifecycle Timeline
                  </h2>
                  <p className="text-xs text-slate-500">
                    Proactive 90-day renewal radar to guarantee uninterrupted legal operations without penalty.
                  </p>
                </div>
                <button
                  onClick={() => setShowRenewalModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Initiate Renewal Docket</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 block">Current License Expiry</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">31-Dec-2026</span>
                  <span className="text-emerald-600 font-semibold text-[11px]">828 Days Remaining</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 block">Early Filing Threshold</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">02-Oct-2026</span>
                  <span className="text-slate-500 text-[11px]">90-Day Window Alert</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 block">Projected Renewal Fee</span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1 block">₹ 18,500</span>
                  <span className="text-slate-500 text-[11px]">Budget Approved</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-500 block">Renewal Stage</span>
                  <span className="text-base font-bold text-emerald-600 mt-1 block">Protected / Active</span>
                  <span className="text-slate-500 text-[11px]">No Outstanding Actions</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 7: INSPECTIONS & AUDITS
            ========================================================================= */}
        {activeTab === "inspections-audit" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Authority Inspections & On-Site Audits Register
                  </h2>
                  <p className="text-xs text-slate-500">
                    Municipal inspections, health officer visits, and technical verifications.
                  </p>
                </div>
                <button
                  onClick={() => setShowInspectionModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Log Authority Inspection</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Annual Premises Inspection — Coimbatore City Municipal Corporation
                  </span>
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-700">
                    Passed with Zero Non-Conformances
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Conducted by Dr. K. Venkatraman (Chief Health Officer). Verified emergency exits, safety lighting, sanitization logs, and trade boundary markers.
                </p>
                <div className="text-[11px] text-slate-400">
                  Inspection Date: 14-Jan-2024 • Certificate Ref: CMC-INSP-2024-001
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 8: ACTIONS & REMEDIATION
            ========================================================================= */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    License Corrective Actions & Pre-Renewal Tasks
                  </h2>
                  <p className="text-xs text-slate-500">
                    Assigned operational action items to resolve findings and maintain 100% compliance.
                  </p>
                </div>
                <button
                  onClick={() => setShowActionModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Action Item</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      ACT-LIC-01: Update registered office floor plan with municipal revenue wing
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Owner: Ramesh S • Due Date: 30-Oct-2026 • Priority: Medium
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
                    Open
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 9: RELATED RECORDS & CROSS-LINKAGE
            ========================================================================= */}
        {activeTab === "related-records" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Connected ERP Modules & Operational Dependencies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {RELATED_RECORDS.map((rel) => (
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

        {/* =========================================================================
            SUBMODULE 10: AUDIT HISTORY & IMMUTABLE GOVERNANCE LOG
            ========================================================================= */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Controlled Audit History & Change Ledger
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      License Active Status Validated — Antigravity Governance Engine
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Timestamp: 25-Sep-2026 10:30 IST • Actor: System Governor • Hash: #9FA1-2026-TRD
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Initial Record Created and Formally Approved by Legal Counsel
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Timestamp: 01-Jan-2024 09:00 IST • Actor: Ramesh S (Head of Compliance)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Upload Document */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Upload Linked License Document
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Document Title / File Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Safety Inspection Certificate 2026"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Document Type
                  </label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as typeof newDocType)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="License">License</option>
                    <option value="Approval">Approval</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Agreement">Agreement</option>
                    <option value="Inspection Report">Inspection Report</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Document Expiry Date
                  </label>
                  <input
                    type="text"
                    value={newDocExpiry}
                    onChange={(e) => setNewDocExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-[11px] text-slate-500">Drag and drop scanned PDF/PNG or click to browse</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Maximum size: 25 MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  Attach & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Schedule Renewal */}
      {showRenewalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Schedule License Renewal
                </h3>
              </div>
              <button
                onClick={() => setShowRenewalModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Initiate early renewal docket for <span className="font-bold text-slate-800 dark:text-slate-200">LIC-2026-001 (Trade License)</span>. Statutory submission window starts 90 days before expiry.
              </p>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Submission Date
                </label>
                <input
                  type="text"
                  defaultValue="30-Sep-2026"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Responsible Officer
                </label>
                <input
                  type="text"
                  defaultValue="Ramesh S (Operations / Administration)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowRenewalModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRenewalModal(false);
                    setSubmitSuccess(true);
                    setTimeout(() => setSubmitSuccess(false), 3000);
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold cursor-pointer"
                >
                  Confirm Renewal Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Inspection */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Add Inspection / Audit Record
                </h3>
              </div>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Inspector / Agency Authority
                </label>
                <input
                  type="text"
                  value={newInspInspector}
                  onChange={(e) => setNewInspInspector(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Inspection Findings
                </label>
                <textarea
                  rows={3}
                  value={newInspFindings}
                  onChange={(e) => setNewInspFindings(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowInspectionModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowInspectionModal(false);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2800);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  Save Inspection Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Create Action */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Create Corrective Action
                </h3>
              </div>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Action Title / Task
                </label>
                <input
                  type="text"
                  placeholder="e.g. Renew lease endorsement before municipal inspection"
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
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
                    value={newActionOwner}
                    onChange={(e) => setNewActionOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="text"
                    value={newActionDate}
                    onChange={(e) => setNewActionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2800);
                  }}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer"
                >
                  Dispatch Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: View License Certificate Preview */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Official Trade License Certificate — Coimbatore City Municipal Corporation
                </h3>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Canvas Preview */}
            <div className="p-6 bg-amber-50/40 dark:bg-slate-800/60 rounded-xl border border-amber-200/60 dark:border-slate-700 space-y-4 font-serif">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-blue-900 text-amber-300 font-bold flex items-center justify-center mx-auto text-sm border-2 border-amber-400">
                  CMC
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                  COIMBATORE CITY MUNICIPAL CORPORATION
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                  Public Health & Town Planning Directorate — Controlled Trade Authorization
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans pt-2 border-t border-amber-200/50">
                <div>
                  <span className="text-slate-500 block">License Reference:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">TRD-CHN-001 / 2024</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Date of Issue:</span>
                  <span className="font-bold text-slate-900 dark:text-white">01-Jan-2024</span>
                </div>
                <div>
                  <span className="text-slate-500 block">License Holder:</span>
                  <span className="font-bold text-slate-900 dark:text-white">Magnertia Private Limited</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Validity Period:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">31-Dec-2026 (Active)</span>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded border border-amber-100 text-xs font-sans text-slate-700 dark:text-slate-300">
                <span className="font-bold">Authorized Scope: </span>
                Commercial premises operations for Software Engineering, Product Testing Lab, and Administrative Corporate Offices under Municipal By-Laws.
              </div>

              <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 pt-2">
                <span>Digital Signature Verified: 01-Jan-2024 10:14 IST</span>
                <span className="text-emerald-600 font-bold">Tamper-Proof Audit Hash: #9FA1-2026-TRD</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}
