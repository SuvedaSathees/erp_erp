// Magnertia ERP - Certifications Module
// Management -> Compliance -> Certifications
// Certifications Form — MAICW Classification, Overview, Widgets, and Controlled Audit Reports

import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCertificationsRecordFn } from "@/lib/certificationsFns.server";
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
  Flame,
  BadgeCheck,
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
  PRIMARY_CERTIFICATION_RECORD,
  CERTIFICATION_EXECUTIVE_KPIS,
  CERTIFICATION_KEY_DATES,
  RELATED_STANDARDS,
  DOCUMENTS_EVIDENCE,
  AUDIT_HISTORY,
  RENEWAL_PLAN,
  CERTIFICATION_RISK,
  CATEGORY_BREAKDOWN,
  CONTROLLED_CERT_REPORTS,
  CERTIFICATION_KPI_MASTER,
  SAMPLE_CERTIFICATIONS_INVENTORY,
  RelatedStandardItem,
  DocumentEvidenceItem,
  RenewalPlanItem,
  ControlledCertReport,
} from "@/services/certificationsService";
import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";

export const Route = createFileRoute("/management/risk-management/certifications")({
  component: CertificationsManagementPage,
});

function CertificationsManagementPage() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "certification-details"
    | "requirements-scope"
    | "gap-assessment"
    | "audit-testing"
    | "documents-evidence"
    | "surveillance-renewal"
    | "actions"
    | "related-records"
    | "history"
    | "reports"
  >("overview");

  // Prisma-backed query with inline fallback
  const { data: dbRecord } = useQuery({
    queryKey: ["certifications", "record"],
    queryFn: () => getCertificationsRecordFn({ data: {} }),
  });

  // Controlled form state
  const [formData, setFormData] = useState(PRIMARY_CERTIFICATION_RECORD);
  useEffect(() => { if (dbRecord?.data) setFormData(dbRecord.data as typeof PRIMARY_CERTIFICATION_RECORD); }, [dbRecord]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dynamic tables state
  const [standards, setStandards] = useState<RelatedStandardItem[]>(RELATED_STANDARDS);
  const [evidenceList, setEvidenceList] = useState<DocumentEvidenceItem[]>(DOCUMENTS_EVIDENCE);
  const [renewalPlans, setRenewalPlans] = useState<RenewalPlanItem[]>(RENEWAL_PLAN);

  // Reports state
  const [reportSearch, setReportSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<ControlledCertReport>(CONTROLLED_CERT_REPORTS[0]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Dialog / Modal states
  const [showNewCertModal, setShowNewCertModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showSurveillanceModal, setShowSurveillanceModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showAddStandardModal, setShowAddStandardModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Inputs for modals
  const [newStdName, setNewStdName] = useState("");
  const [newStdEdition, setNewStdEdition] = useState("2025");
  const [newStdScope, setNewStdScope] = useState("");

  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState<DocumentEvidenceItem["type"]>("Certificate");

  const [newPlanActivity, setNewPlanActivity] = useState("");
  const [newPlanDate, setNewPlanDate] = useState("15-Nov-2026");
  const [newPlanOwner, setNewPlanOwner] = useState("Quality Team");

  // Filtered reports
  const filteredReports = useMemo(() => {
    return CONTROLLED_CERT_REPORTS.filter((rep) => {
      const matchesSearch =
        rep.title.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.code.toLowerCase().includes(reportSearch.toLowerCase()) ||
        rep.purpose.toLowerCase().includes(reportSearch.toLowerCase());
      const matchesCat = selectedCategory === "All" || rep.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [reportSearch, selectedCategory]);

  const reportCategories = ["All", "Inventory", "Audit & Testing", "Readiness & Gap", "Renewal & Surveillance", "Risk & Financial", "AI & Governance"];

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

  // Add Standard handler
  const handleAddStandard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName.trim()) return;
    const item: RelatedStandardItem = {
      id: `STD-00${standards.length + 1}`,
      standard: newStdName,
      edition: newStdEdition,
      scope: newStdScope || "Product & Plant Operations",
      status: "In Progress",
    };
    setStandards([...standards, item]);
    setNewStdName("");
    setNewStdScope("");
    setShowAddStandardModal(false);
  };

  // Add Document handler
  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const doc: DocumentEvidenceItem = {
      id: `EVD-00${evidenceList.length + 1}`,
      documentName: newDocName,
      type: newDocType,
      version: "1.0",
      uploadDate: "25-Sep-2026",
      status: "Valid",
    };
    setEvidenceList([doc, ...evidenceList]);
    setNewDocName("");
    setShowUploadModal(false);
  };

  // Add Renewal Plan handler
  const handleAddRenewalPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanActivity.trim()) return;
    const plan: RenewalPlanItem = {
      id: `REN-00${renewalPlans.length + 1}`,
      planDate: newPlanDate,
      activity: newPlanActivity,
      owner: newPlanOwner,
      status: "Planned",
    };
    setRenewalPlans([...renewalPlans, plan]);
    setNewPlanActivity("");
    setShowRenewalModal(false);
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
      title="Certifications"
      breadcrumb="Management > Compliance > Certifications"
      description="Quality, safety, and environmental certifications repository, renewal roadmaps, and issuing body audits."
      tabs={<ComplianceTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Banner Notice for Save/Submit */}
        {saveSuccess && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Certification record CERT-2026-001 updated and saved!</span>
          </div>
        )}
        {submitSuccess && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <Send className="w-5 h-5" />
            <span>Certification audit file dispatched to Certification Body review desk!</span>
          </div>
        )}

        {/* =========================================================================
            TOP EXECUTIVE COMMAND HEADER
            ========================================================================= */}
        <div className="max-w-[1720px] mx-auto px-4 md:px-6 pt-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Certifications Management
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                    CERT-2026-001
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Build Trust. Ensure Quality. Enable Global Markets.
                </p>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <button
                onClick={() => setShowNewCertModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Certification</span>
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
                        setShowUploadModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-500" /> Upload Certificate
                    </button>
                    <button
                      onClick={() => {
                        setShowAuditModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-amber-500" /> Schedule Audit
                    </button>
                    <button
                      onClick={() => {
                        setShowSurveillanceModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5 text-emerald-500" /> Add Surveillance
                    </button>
                    <button
                      onClick={() => {
                        setShowRenewalModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Clock className="w-3.5 h-3.5 text-purple-500" /> Add Renewal Plan
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
          {/* 1. Total Certifications */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">18</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Total Certifications
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              ↑ 20%
            </span>
          </div>

          {/* 2. Active Certifications */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">12</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Active Certifications
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              ↑ 9%
            </span>
          </div>

          {/* 3. Expiring in 90 Days */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">3</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Expiring in 90 Days
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
              ↑ 50%
            </span>
          </div>

          {/* 4. Expired Certifications */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">2</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Expired Certifications
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
              ↑ 100%
            </span>
          </div>

          {/* 5. In Progress */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">4</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  In Progress
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              ↓ 33%
            </span>
          </div>

          {/* 6. Certification Compliance */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">94%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Certification Compliance
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
            {/* ROW 1: Section 1 (Cert Info) + Section 2 (Overview) + Section 3-5 (Lifecycle, Key Dates, Quick Actions) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column (lg:col-span-5): 1. Certification Information */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  1. Certification Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Certification ID */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Certification ID
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.certificationId}
                      className="w-full text-xs font-mono px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                    />
                  </div>
                  {/* Certification Code */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Certification Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.certificationCode}
                      onChange={(e) => setFormData({ ...formData, certificationCode: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  {/* Certification Name */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Certification Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.certificationName}
                      onChange={(e) => setFormData({ ...formData, certificationName: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Certification Type */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Certification Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.certificationType}
                      onChange={(e) => setFormData({ ...formData, certificationType: e.target.value as typeof formData.certificationType })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Management System">Management System</option>
                      <option value="Product">Product</option>
                      <option value="Process">Process</option>
                      <option value="Organization">Organization</option>
                      <option value="Personnel">Personnel</option>
                    </select>
                  </div>
                  {/* Certification Category */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Certification Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.certificationCategory}
                      onChange={(e) => setFormData({ ...formData, certificationCategory: e.target.value as typeof formData.certificationCategory })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Quality">Quality</option>
                      <option value="Safety">Safety</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Energy">Energy</option>
                      <option value="Automotive">Automotive</option>
                    </select>
                  </div>
                  {/* Standard / Scheme */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Standard / Scheme <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.standardScheme}
                      onChange={(e) => setFormData({ ...formData, standardScheme: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="ISO 9001:2015">ISO 9001:2015</option>
                      <option value="ISO 14001:2015">ISO 14001:2015</option>
                      <option value="ISO 45001:2018">ISO 45001:2018</option>
                      <option value="ISO 27001:2022">ISO 27001:2022</option>
                      <option value="IEC 61851-1">IEC 61851-1</option>
                      <option value="SAE J2954">SAE J2954</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Certification Body */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Certification Body <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.certificationBody}
                      onChange={(e) => setFormData({ ...formData, certificationBody: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="TÜV SÜD">TÜV SÜD</option>
                      <option value="DNV GL">DNV GL</option>
                      <option value="BSI Group">BSI Group</option>
                      <option value="UL Solutions">UL Solutions</option>
                      <option value="Bureau Veritas">Bureau Veritas</option>
                    </select>
                  </div>
                  {/* Testing Laboratory */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Testing Laboratory
                    </label>
                    <input
                      type="text"
                      value={formData.testingLaboratory}
                      onChange={(e) => setFormData({ ...formData, testingLaboratory: e.target.value })}
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
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
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="R&D Engineering">R&D Engineering</option>
                      <option value="Operations">Operations</option>
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
                      <option value="Quality Management">Quality Management</option>
                      <option value="Production & Assembly">Production & Assembly</option>
                      <option value="Environmental Health & Safety">Environmental Health & Safety</option>
                      <option value="Information Security">Information Security</option>
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
                      <option value="All QMS Processes">All QMS Processes</option>
                      <option value="Production Quality Inspection">Production Quality Inspection</option>
                      <option value="Supplier Quality Engineering">Supplier Quality Engineering</option>
                      <option value="Product Life Cycle Release">Product Life Cycle Release</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Certification Owner with Avatar */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Certification Owner <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {formData.certificationOwner.initials}
                      </span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 flex-1 truncate">
                        {formData.certificationOwner.name}
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
                      <option value="Magnertia Technologies Inc">Magnertia Technologies Inc</option>
                    </select>
                  </div>
                  {/* Location */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Location
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="Coimbatore - Main Facility">Coimbatore - Main Facility</option>
                      <option value="Chennai - Technical Center">Chennai - Technical Center</option>
                      <option value="Bengaluru - R&D Lab">Bengaluru - R&D Lab</option>
                      <option value="Pune - Plant 2">Pune - Plant 2</option>
                    </select>
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Issue Date
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
                      Renewal Due Date
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
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Certified</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1 p-1.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-red-600 dark:text-red-400 font-bold text-xs">
                      <span>↑ Critical</span>
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

              {/* Middle Column (lg:col-span-4): 2. Certification Overview */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    2. Certification Overview
                  </h2>

                  <div className="space-y-3.5 mt-3">
                    {/* Certification Requirement */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Certification Requirement
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {formData.requirement}
                      </p>
                    </div>

                    {/* Business Objective */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Business Objective
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {formData.businessObjective}
                      </p>
                    </div>

                    {/* Scope */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Scope
                      </p>
                      <textarea
                        readOnly
                        rows={3}
                        value={formData.scope}
                        className="w-full text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded border border-slate-200 dark:border-slate-800 resize-none font-sans"
                      />
                    </div>

                    {/* Validity Period & Surveillance Requirement */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          Validity Period
                        </p>
                        <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {formData.validityPeriod}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          Surveillance Requirement
                        </p>
                        <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {formData.surveillanceRequirement}
                        </div>
                      </div>
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
                    <span>Valid and Certified</span>
                  </div>
                </div>
              </div>

              {/* Right Column (lg:col-span-3): 3. Certification Lifecycle, 4. Key Dates & 5. Quick Actions */}
              <div className="lg:col-span-3 space-y-4">
                {/* 3. Certification Lifecycle Stepper */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    3. Certification Lifecycle
                  </h2>

                  {/* Stepper Dots */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold px-1">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Plan</span>
                    </div>
                    <div className="h-0.5 w-4 bg-emerald-500" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Implement</span>
                    </div>
                    <div className="h-0.5 w-4 bg-emerald-500" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>Audit</span>
                    </div>
                    <div className="h-0.5 w-4 bg-emerald-500" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Certified</span>
                    </div>
                    <div className="h-0.5 w-4 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                        •
                      </div>
                      <span>Surveillance</span>
                    </div>
                    <div className="h-0.5 w-4 bg-slate-200 dark:bg-slate-700" />
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                        •
                      </div>
                      <span>Renewal</span>
                    </div>
                  </div>

                  {/* Status Banner Card */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          Certification Active
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
                    {CERTIFICATION_KEY_DATES.map((item, idx) => (
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
                      <span>Upload Certificate</span>
                    </button>
                    <button
                      onClick={() => setShowAuditModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-amber-600" />
                      <span>Schedule Audit</span>
                    </button>
                    <button
                      onClick={() => setShowSurveillanceModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Add Surveillance</span>
                    </button>
                    <button
                      onClick={() => setShowActionModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-600" />
                      <span>Create Action</span>
                    </button>
                    <button
                      onClick={() => setShowRenewalModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Add Renewal Plan</span>
                    </button>
                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>View Certificate PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Section 6 (Related Standards & Scope), Section 7 (Documents & Evidence), Section 8 (Compliance & Risk) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 6. Related Standards & Scope (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    6. Related Standards & Scope
                  </h2>
                  <button
                    onClick={() => setShowAddStandardModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Standard</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-2">Standard</th>
                        <th className="py-2 px-2">Edition</th>
                        <th className="py-2 px-2">Scope</th>
                        <th className="py-2 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {standards.map((std) => (
                        <tr key={std.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-2 font-medium text-slate-800 dark:text-slate-200">
                            {std.standard}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400">
                            {std.edition}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300">
                            {std.scope}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                std.status === "Certified"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : std.status === "In Progress"
                                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                  : std.status === "Gap Assessment"
                                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {std.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 7. Documents & Evidence (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    7. Documents & Evidence
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
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400">
                            {doc.version}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {doc.uploadDate}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                doc.status === "Valid" || doc.status === "Closed"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                              }`}
                            >
                              {doc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 8. Compliance & Risk (lg:col-span-3) */}
              <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  8. Compliance & Risk
                </h2>

                {/* 4 Score Tiles matching screenshot */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Risk Rating</p>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {CERTIFICATION_RISK.rating}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Likelihood</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {CERTIFICATION_RISK.likelihood}/5
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Impact</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {CERTIFICATION_RISK.impact}/5
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Score</p>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {CERTIFICATION_RISK.score}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Key Risk: </span>
                    <span className="text-slate-600 dark:text-slate-400">{CERTIFICATION_RISK.keyRisk}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Mitigation: </span>
                    <span className="text-slate-600 dark:text-slate-400">{CERTIFICATION_RISK.mitigation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: Section 9 (Audit & Surveillance History) + Section 10 (Renewal Plan) + Section 11 (Certifications by Category) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 9. Audit & Surveillance History (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    9. Audit & Surveillance History
                  </h2>
                  <button
                    onClick={() => setActiveTab("audit-testing")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-2">Date</th>
                        <th className="py-2 px-2">Audit Type</th>
                        <th className="py-2 px-2">Auditor / Body</th>
                        <th className="py-2 px-2">Findings</th>
                        <th className="py-2 px-2">Result</th>
                        <th className="py-2 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {AUDIT_HISTORY.map((audit) => (
                        <tr key={audit.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-2 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {audit.date}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300">
                            {audit.auditType}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300">
                            {audit.auditorBody}
                          </td>
                          <td className="py-2.5 px-2 text-slate-600 dark:text-slate-300">
                            {audit.findings}
                          </td>
                          <td className="py-2.5 px-2">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                audit.result === "Pass"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                              }`}
                            >
                              {audit.result}
                            </span>
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              {audit.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 10. Renewal Plan (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    10. Renewal Plan
                  </h2>
                  <button
                    onClick={() => setShowRenewalModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Renewal Plan</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-2">Plan Date</th>
                        <th className="py-2 px-2">Activity</th>
                        <th className="py-2 px-2">Owner</th>
                        <th className="py-2 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {renewalPlans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="py-2.5 pr-2 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {plan.planDate}
                          </td>
                          <td className="py-2.5 px-2 text-slate-700 dark:text-slate-300">
                            {plan.activity}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400">
                            {plan.owner}
                          </td>
                          <td className="py-2.5 pl-2 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                              {plan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 11. Certifications by Category Donut Chart (lg:col-span-3) */}
              <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  11. Certifications by Category
                </h2>

                <div className="relative flex items-center justify-center h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_BREAKDOWN}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {CATEGORY_BREAKDOWN.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text in Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                      18
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Certifications
                    </span>
                  </div>
                </div>

                {/* Legend matching screenshot */}
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                  {CATEGORY_BREAKDOWN.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums text-[11px]">
                        {item.value}
                      </span>
                    </div>
                  ))}
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
                    <span>Statutory, Laboratory & Certification Body Registers</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Controlled Certifications Audit Reports Register</h2>
                  <p className="text-xs text-blue-200 mt-1 max-w-3xl">
                    Executive registers meeting ISO/IEC 17021 requirements, Section 44 controlled audit reports, Section 45 KPI Master, 5x5 exposure heatmaps, and accredited laboratory testing dossiers.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setExportNotice("Exporting Complete Certification Register to Excel (xlsx)...");
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

            {/* Section 45: Certification KPI Master */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Section 45 — Controlled Certification KPI Master & Performance Metrics
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
                    {CERTIFICATION_KPI_MASTER.map((kpi) => (
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

            {/* Section 30: 5x5 Certification Risk Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 5x5 Matrix (lg:col-span-7) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Section 30 — Certification 5×5 Risk Matrix
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Likelihood × Impact = Risk Exposure</span>
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[420px] text-center">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2">
                      IMPACT → (1: Minor, 2: Low, 3: Moderate, 4: High, 5: Critical)
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
                                    CERT-001
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

              {/* Scope & Readiness Summary (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Section 11 — Certification Readiness Scorecard
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Stage-Gate Audit Readiness</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    { area: "Governance & Policies", readiness: 100, status: "Ready" },
                    { area: "Process Documentation & SOPs", readiness: 98, status: "Ready" },
                    { area: "Product & Laboratory Testing", readiness: 92, status: "Pass" },
                    { area: "Training & Personnel Competency", readiness: 95, status: "Ready" },
                    { area: "Internal Audit & Management Review", readiness: 100, status: "Closed" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{item.area}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.readiness}% ({item.status})</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${item.readiness}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 44: Controlled Certification Reports Catalog & Live Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Catalog List (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    22 Controlled Reports Catalog
                  </h3>
                  <span className="text-[10px] text-slate-500">Section 44</span>
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

                {/* Live Sample Table Preview */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                        <th className="py-2.5 px-3">Cert ID</th>
                        <th className="py-2.5 px-3">Certification Title</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Standard</th>
                        <th className="py-2.5 px-3">Certification Body</th>
                        <th className="py-2.5 px-3">Expiry Date</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {SAMPLE_CERTIFICATIONS_INVENTORY.map((item) => (
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
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                            {item.standard}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                            {item.body}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {item.expiry}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                item.status === "Certified"
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : item.status === "In Progress"
                                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                  : item.status === "Gap Assessment"
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
                  <span>Showing 8 of 18 Active Certification Records</span>
                  <span>Accreditation Verified under IAF MLA & ISO/IEC 17021 Guidelines</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 2: CERTIFICATION DETAILS (FULL MAICW SPECIFICATION)
            ========================================================================= */}
        {activeTab === "certification-details" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Certification Scheme & Standard Details (MAICW)
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
                  <span>Save Certification Master</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Certification Record ID (A)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.certificationId}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Certification Code (A)
                  </label>
                  <input
                    type="text"
                    value={formData.certCode}
                    onChange={(e) => setFormData({ ...formData, certCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-primary"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Standard & Official Title (M)
                  </label>
                  <input
                    type="text"
                    value={formData.certificationName}
                    onChange={(e) => setFormData({ ...formData, certificationName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Certification Body (M)
                  </label>
                  <input
                    type="text"
                    value={formData.certificationBody}
                    onChange={(e) => setFormData({ ...formData, certificationBody: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Accreditation Board (M)
                  </label>
                  <input
                    type="text"
                    value={formData.accreditationBody}
                    onChange={(e) => setFormData({ ...formData, accreditationBody: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Initial Issue Date (M)
                  </label>
                  <input
                    type="text"
                    value={formData.initialIssueDate}
                    onChange={(e) => setFormData({ ...formData, initialIssueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Valid Until (M)
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                  Certified Facilities Scope & Product Lines (M)
                </label>
                <textarea
                  rows={3}
                  value={formData.scopeOfCertification}
                  onChange={(e) => setFormData({ ...formData, scopeOfCertification: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 3: REQUIREMENTS & STANDARDS SCOPE
            ========================================================================= */}
        {activeTab === "requirements-scope" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Related Standards & Mandatory Clauses Matrix
                  </h2>
                  <p className="text-xs text-slate-500">
                    Applicable standards integrated into the Magnertia enterprise management system.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddStandardModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Standard</span>
                </button>
              </div>

              <div className="space-y-2">
                {standards.map((std) => (
                  <div
                    key={std.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/30"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-primary mt-0.5">{std.id}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {std.standardCode} — {std.title}
                        </p>
                        <span className="text-[11px] text-slate-500">
                          Edition: {std.edition} • Coverage: {std.coverage}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700">
                      {std.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 4: GAP ASSESSMENT WORKSPACE
            ========================================================================= */}
        {activeTab === "gap-assessment" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Clause-by-Clause Certification Gap Assessment
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive compliance readiness matrix ahead of external certification audit.
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
                  <span>Update Gap Readiness</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Clauses Assessed</span>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">54 / 54</span>
                  <span className="text-xs text-emerald-600 font-semibold mt-1 block">100% Scope Evaluated</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Fully Compliant</span>
                  <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">51 Clauses</span>
                  <span className="text-xs text-slate-500 mt-1 block">Audit-Ready Controls Active</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">Minor Remediation</span>
                  <span className="text-2xl font-extrabold text-amber-600 mt-1 block">3 Gaps</span>
                  <span className="text-xs text-slate-500 mt-1 block">CAPA Assigned with Due Dates</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 5: AUDIT & TESTING SCHEDULE
            ========================================================================= */}
        {activeTab === "audit-testing" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Certification Body Audits & Lab Testing Schedule
                  </h2>
                  <p className="text-xs text-slate-500">
                    Stage 1, Stage 2, surveillance visits, and accredited laboratory test dossiers.
                  </p>
                </div>
                <button
                  onClick={() => setShowAuditModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Schedule External Audit</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Triennial Recertification Audit — TÜV SÜD South Asia
                  </span>
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-700">
                    Certified / Verified
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Lead Auditor: Dr. M. Sundarajan. Scope: Design, manufacturing, testing, and distribution of electronic control systems and power assemblies.
                </p>
                <div className="text-[11px] text-slate-400">
                  Audit Window: 15-Jan-2024 to 18-Jan-2024 • Report Ref: TUV-9001-2024-RECERT
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 6: DOCUMENTS & EVIDENCE VAULT
            ========================================================================= */}
        {activeTab === "documents-evidence" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Controlled Certification Evidence & Dossier Vault
                  </h2>
                  <p className="text-xs text-slate-500">
                    Accredited certificate PDFs, audit reports, lab test logs, and quality manuals.
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Evidence</span>
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
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {evidenceList.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{doc.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{doc.title}</td>
                        <td className="py-2.5 px-3">{doc.type}</td>
                        <td className="py-2.5 px-3 font-mono">{doc.version}</td>
                        <td className="py-2.5 px-3 text-slate-500">{doc.uploadDate}</td>
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
            SUBMODULE 7: SURVEILLANCE & RENEWAL CYCLES
            ========================================================================= */}
        {activeTab === "surveillance-renewal" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    3-Year Certification Surveillance & Recertification Program
                  </h2>
                  <p className="text-xs text-slate-500">
                    Maintained cycle tracking to eliminate surprise lapses and guarantee continuous validity.
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
                  <span>Transmit Cycle Status</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {renewalPlans.map((plan) => (
                  <div
                    key={plan.cycle}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{plan.cycle}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        {plan.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div>Target Date: <strong className="text-slate-800 dark:text-slate-200">{plan.targetDate}</strong></div>
                      <div>Certification Body: {plan.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMODULE 8: ACTIONS & CAPA
            ========================================================================= */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Certification CAPA & Pre-Audit Action Items
                  </h2>
                  <p className="text-xs text-slate-500">
                    Corrective actions and preventative tasks assigned to process owners.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewActionModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Action Item</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    CAPA-CERT-01: Update internal auditor qualification log for Clause 9.2 compliance
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Owner: Quality Lead • Due Date: 30-Nov-2026 • Priority: High
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
            SUBMODULE 9: RELATED RECORDS & INTEGRATION
            ========================================================================= */}
        {activeTab === "related-records" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Integrated ERP Modules & Cross-Functional Linkages
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
            SUBMODULE 10: AUDIT HISTORY & CHANGE LEDGER
            ========================================================================= */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Certification Lifecycle Audit Trail & Immutable Governance Log
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      ISO 9001:2015 Recertification Status Affirmed — Antigravity Governance Engine
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Timestamp: 25-Sep-2026 10:30 IST • Actor: Quality Directorate • Hash: #ISO-9001-2026-OK
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      External Audit Report Signed off by TÜV SÜD Lead Auditor
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Timestamp: 18-Jan-2024 16:30 IST • Actor: Dr. M. Sundarajan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: New Certification */}
      {showNewCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Register New Certification Scheme
                </h3>
              </div>
              <button onClick={() => setShowNewCertModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Certification Title / Standard
                </label>
                <input
                  type="text"
                  placeholder="e.g. ISO 14001:2015 Environmental Management System"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Certification Body
                  </label>
                  <select className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    <option value="TÜV SÜD">TÜV SÜD</option>
                    <option value="DNV GL">DNV GL</option>
                    <option value="UL Solutions">UL Solutions</option>
                    <option value="BSI Group">BSI Group</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Certification Date
                  </label>
                  <input
                    type="text"
                    defaultValue="30-Nov-2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCertModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowNewCertModal(false);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2800);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  Create Certification File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Upload Document / Certificate */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Upload Certification Document / Evidence
                </h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Document Title / File Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage 2 Audit Closing Report 2026"
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
                  <option value="Certificate">Certificate</option>
                  <option value="Audit Report">Audit Report</option>
                  <option value="Scope">Scope</option>
                  <option value="CAPA">CAPA</option>
                  <option value="Test Report">Test Report</option>
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

      {/* MODAL 3: Schedule Audit */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Schedule Certification Audit
                </h3>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Audit Type
                </label>
                <select className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  <option value="Surveillance">Annual Surveillance Audit</option>
                  <option value="Recertification">Triennial Recertification Audit</option>
                  <option value="Special Audit">Scope Extension / Special Audit</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Scheduled Audit Date
                </label>
                <input
                  type="text"
                  defaultValue="15-Jan-2026"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lead Auditor / Certification Body
                </label>
                <input
                  type="text"
                  defaultValue="TÜV SÜD Lead Auditor Team"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAuditModal(false);
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

      {/* MODAL 4: Add Standard */}
      {showAddStandardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Add Related Standard & Scope
                </h3>
              </div>
              <button onClick={() => setShowAddStandardModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStandard} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Standard Code / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ISO 50001:2018 Energy Management"
                  value={newStdName}
                  onChange={(e) => setNewStdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Edition / Year
                  </label>
                  <input
                    type="text"
                    value={newStdEdition}
                    onChange={(e) => setNewStdEdition(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Covered Scope
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coimbatore Plant Operations"
                    value={newStdScope}
                    onChange={(e) => setNewStdScope(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStandardModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  Add Standard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Add Renewal Plan */}
      {showRenewalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Add Renewal / Recertification Milestone
                </h3>
              </div>
              <button onClick={() => setShowRenewalModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRenewalPlan} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Activity Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct Mock Pre-Assessment Audit"
                  value={newPlanActivity}
                  onChange={(e) => setNewPlanActivity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Milestone Date
                  </label>
                  <input
                    type="text"
                    value={newPlanDate}
                    onChange={(e) => setNewPlanDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Responsible Owner
                  </label>
                  <input
                    type="text"
                    value={newPlanOwner}
                    onChange={(e) => setNewPlanOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRenewalModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer"
                >
                  Schedule Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: View Official TÜV SÜD Certificate Preview */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Official Certificate — TÜV SÜD Management Service GmbH
                </h3>
              </div>
              <button onClick={() => setShowCertificateModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Canvas Preview */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 font-serif">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center mx-auto text-xs border-2 border-blue-400">
                  TÜV
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                  CERTIFICATE OF REGISTRATION
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                  TÜV SÜD Management Service GmbH certifies that the organization has established and applies a Quality Management System.
                </p>
              </div>

              <div className="text-center py-2 border-y border-slate-200 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Magnertia Private Limited
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Coimbatore - Main Facility, Tamil Nadu, India
                </p>
              </div>

              <div className="text-xs font-sans space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="font-semibold">Standard:</span>
                  <span className="font-bold text-blue-600">ISO 9001:2015</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Certificate Registration No.:</span>
                  <span className="font-mono font-bold">12 100 58926 TMS</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Valid From:</span>
                  <span>01-Jan-2024 to 31-Dec-2026</span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-[11px] leading-relaxed">
                  <span className="font-bold">Scope of Certification: </span>
                  Design, development, manufacturing and supply of autonomous wireless EV charging stations and energy storage management units.
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Munich, Germany · Certified Lead Auditor</span>
                <span className="text-emerald-600 font-bold">DAkkS Accredited #D-ZM-14143-01-00</span>
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
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}
