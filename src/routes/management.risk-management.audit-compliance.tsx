// Magnertia ERP - Audit Compliance Module
// Management -> Compliance -> Audit Compliance
// Audit Compliance Form — MAICW Classification, Overview, Widgets, and Controlled Audit Reports

import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAuditComplianceRecordFn } from "@/lib/auditComplianceFns.server";
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
  Play,
  RotateCcw,
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
  PRIMARY_AUDIT_RECORD,
  AUDIT_EXECUTIVE_KPIS,
  AUDIT_KEY_DATES,
  AUDIT_CHECKLIST_SUMMARY,
  AUDIT_RECENT_FINDINGS,
  COMPLIANCE_BY_SOURCE_DATA,
  AUDIT_CAPA_ITEMS,
  AUDIT_DOCUMENTS,
  AUDIT_COMPLIANCE_TREND,
  CONTROLLED_AUDIT_REPORTS,
  AUDIT_KPI_MASTER,
  AuditComplianceRecord,
  AuditFindingItem,
  AuditCAPAItem,
  AuditDocumentItem,
  ControlledAuditReport,
} from "@/services/auditComplianceService";
import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";

export const Route = createFileRoute("/management/risk-management/audit-compliance")({
  component: AuditComplianceManagementPage,
});

export default function AuditComplianceManagementPage() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "audit-details"
    | "compliance-requirements"
    | "checklist"
    | "findings-ncr"
    | "capa"
    | "evidence"
    | "audit-report"
    | "follow-up"
    | "related-records"
    | "history"
    | "reports"
  >("overview");

  // Prisma-backed query with inline fallback
  const { data: dbRecord } = useQuery({
    queryKey: ["audit-compliance", "record"],
    queryFn: () => getAuditComplianceRecordFn({ data: {} }),
  });

  // Controlled form state
  const [formData, setFormData] = useState<AuditComplianceRecord>(PRIMARY_AUDIT_RECORD);
  useEffect(() => { if (dbRecord?.data) setFormData(dbRecord.data as AuditComplianceRecord); }, [dbRecord]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dynamic tables state
  const [findings, setFindings] = useState<AuditFindingItem[]>(AUDIT_RECENT_FINDINGS);
  const [capaList, setCapaList] = useState<AuditCAPAItem[]>(AUDIT_CAPA_ITEMS);
  const [documents, setDocuments] = useState<AuditDocumentItem[]>(AUDIT_DOCUMENTS);
  const [ncrList, setNcrList] = useState([
    {
      id: "NCR-2026-004",
      findingId: "F-001",
      clause: "ISO 9001: 7.5.3",
      issue: "Work instructions for EVSE potting process not updated to Rev 3.0",
      containment: "Immediate hold placed on Lot #9822 until engineering sign-off",
      owner: "RS",
      dueDate: "20-Sep-2026",
      status: "Open",
    },
    {
      id: "NCR-2026-005",
      findingId: "F-002",
      clause: "ISO 9001: 7.1.5",
      issue: "Hi-pot dielectric breakdown tester calibration certificate expired on 10-Sep-2026",
      containment: "Equipment tagged out; secondary calibrated tester deployed",
      owner: "AK",
      dueDate: "18-Sep-2026",
      status: "In Progress",
    },
  ]);

  // Interactive checklist state
  const [checklistItems, setChecklistItems] = useState([
    {
      id: "CHK-001",
      clause: "4.1",
      question: "Has the organization determined external and internal issues relevant to its purpose?",
      status: "Conform" as "Conform" | "Minor NC" | "Major NC" | "OFI",
      auditorNotes: "Documented in Risk Register & Annual Strategic Plan.",
    },
    {
      id: "CHK-002",
      clause: "5.2.1",
      question: "Has top management established and maintained a quality policy?",
      status: "Conform" as "Conform" | "Minor NC" | "Major NC" | "OFI",
      auditorNotes: "Quality policy signed by MD and displayed across assembly stations.",
    },
    {
      id: "CHK-003",
      clause: "7.1.5",
      question: "Are monitoring and measuring resources calibrated and traceable to standards?",
      status: "Minor NC" as "Conform" | "Minor NC" | "Major NC" | "OFI",
      auditorNotes: "Hi-pot tester calibration expired on 10-Sep-2026. NCR raised.",
    },
    {
      id: "CHK-004",
      clause: "7.5.3",
      question: "Is documented information controlled and available at points of use?",
      status: "Minor NC" as "Conform" | "Minor NC" | "Major NC" | "OFI",
      auditorNotes: "Rev 2.0 found on Line 2 potting station while Rev 3.0 is approved in ERP.",
    },
    {
      id: "CHK-005",
      clause: "8.5.1",
      question: "Is production and service provision conducted under controlled conditions?",
      status: "Conform" as "Conform" | "Minor NC" | "Major NC" | "OFI",
      auditorNotes: "Line clearance and hourly checklist signed by operator.",
    },
    {
      id: "CHK-006",
      clause: "8.7.1",
      question: "Are nonconforming outputs identified and controlled to prevent unintended use?",
      status: "Conform" as "Conform" | "Minor NC" | "Major NC" | "OFI",
      auditorNotes: "Red bin quarantine process rigorously maintained.",
    },
  ]);

  // Reports state
  const [reportSearch, setReportSearch] = useState("");
  const [selectedReportCategory, setSelectedReportCategory] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<ControlledAuditReport>(CONTROLLED_AUDIT_REPORTS[0]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Modals / Dialog states
  const [showNewFindingModal, setShowNewFindingModal] = useState(false);
  const [showCreateNCRModal, setShowCreateNCRModal] = useState(false);
  const [showCreateCAPAModal, setShowCreateCAPAModal] = useState(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showStartAuditModal, setShowStartAuditModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // New Finding form fields
  const [newFindingCategory, setNewFindingCategory] = useState("Process");
  const [newFindingText, setNewFindingText] = useState("");
  const [newFindingSeverity, setNewFindingSeverity] = useState<AuditFindingItem["severity"]>("Minor");

  // New NCR form fields
  const [newNCRFindingId, setNewNCRFindingId] = useState("F-001");
  const [newNCRIssue, setNewNCRIssue] = useState("");
  const [newNCRContainment, setNewNCRContainment] = useState("");
  const [newNCRDueDate, setNewNCRDueDate] = useState("30-Sep-2026");

  // New CAPA form fields
  const [newCAPATitle, setNewCAPATitle] = useState("");
  const [newCAPAOwner, setNewCAPAOwner] = useState("Ramesh S");
  const [newCAPADueDate, setNewCAPADueDate] = useState("15-Oct-2026");

  // New Document form fields
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState<AuditDocumentItem["type"]>("Evidence");

  // Save handler
  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Submit handler - closes audit and marks completion
  const handleSubmit = () => {
    setFormData((prev) => ({
      ...prev,
      auditStatus: "Closed",
      actualEnd: "15-Sep-2026 17:30",
    }));
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3500);
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return CONTROLLED_AUDIT_REPORTS.filter((rep) => {
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
      title="Audit Compliance"
      breadcrumb="Management > Compliance > Audit Compliance"
      description="Internal and statutory audit schedules, observation logging, CAPA workflows, and closure verification."
      tabs={<ComplianceTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Save & Submit Banners */}
        {saveSuccess && (
          <div className="bg-blue-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Audit record AC-2026-0018 successfully saved.</span>
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
              <span>Audit report submitted to Lead Auditor and Quality Manager for formal closure.</span>
            </div>
            <button onClick={() => setSubmitSuccess(false)} className="hover:opacity-75">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}        {/* =========================================================================
            TOP EXECUTIVE COMMAND HEADER
            ========================================================================= */}
        <div className="max-w-[1720px] mx-auto px-4 md:px-6 pt-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Audit Compliance
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Progress
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                    AC-2026-0018
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Ensure Compliance. Drive Improvement. Build Trust.
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
                        setShowNewFindingModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Plus className="h-3.5 w-3.5 text-slate-500" />
                      <span>Create Finding</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateNCRModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span>Raise NCR</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateCAPAModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Create CAPA</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUploadDocModal(true);
                        setShowMoreActions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Upload className="h-3.5 w-3.5 text-blue-500" />
                      <span>Upload Evidence</span>
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
                      <span>18 Controlled Reports</span>
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
        {/* 6 TOP EXECUTIVE KPI CARDS (MATCHING SCREENSHOT)                           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Audits */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ 26%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">24</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Total Audits</div>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-emerald-500 text-white shadow-xs">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ 14%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">16</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Completed</div>
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500 text-white shadow-xs">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                <span>↑ 50%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">6</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">In Progress</div>
            </div>
          </div>

          {/* Card 4: Overdue */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-red-500 text-white shadow-xs">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-red-600">
                <span>↓ 25%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">3</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Overdue</div>
            </div>
          </div>

          {/* Card 5: Open Findings */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-purple-600 text-white shadow-xs">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ 20%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">18</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Open Findings</div>
            </div>
          </div>

          {/* Card 6: Compliance Rate */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-teal-600 text-white shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                <span>↑ 8%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">92%</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Compliance Rate</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OVERVIEW CONTENT: 11 SECTIONS MATCHING THE SCREENSHOT                    */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Grid: Section 1 (Header), Section 2 (Source), Section 3 (Progress) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 1: Audit Compliance Header (Col span 5) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">1. Audit Compliance Header</h2>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    MAICW Controlled
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                  {/* Row 1 */}
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Audit Compliance ID</label>
                    <input
                      type="text"
                      disabled
                      value={formData.auditComplianceId}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Audit Number</label>
                    <input
                      type="text"
                      value={formData.auditNumber}
                      onChange={(e) => setFormData({ ...formData, auditNumber: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Audit Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.auditDate}
                        onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })}
                        className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                      />
                      <Calendar className="absolute left-2 top-2 h-3.5 w-3.5 text-blue-500" />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Audit Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.auditType}
                      onChange={(e) => setFormData({ ...formData, auditType: e.target.value as any })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    >
                      <option value="Internal Compliance Audit">Internal Compliance Audit</option>
                      <option value="Supplier Audit">Supplier Audit</option>
                      <option value="Process Audit">Process Audit</option>
                      <option value="Product Audit">Product Audit</option>
                      <option value="System Audit">System Audit</option>
                      <option value="Customer Audit">Customer Audit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Audit Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.auditCategory}
                      onChange={(e) => setFormData({ ...formData, auditCategory: e.target.value as any })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    >
                      <option value="Planned">Planned</option>
                      <option value="Special">Special</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Surveillance">Surveillance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Audit Program <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.auditProgram}
                      onChange={(e) => setFormData({ ...formData, auditProgram: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    >
                      <option value="FY26 Internal Audit Program">FY26 Internal Audit Program</option>
                      <option value="ISO 9001 Recertification Program">ISO 9001 Recertification</option>
                      <option value="Supplier Quality Qualification">Supplier Quality</option>
                    </select>
                  </div>

                  {/* Row 3 (Objective & Scope col span) */}
                  <div className="col-span-1 md:col-span-1.5">
                    <label className="block text-slate-600 font-medium mb-1">
                      Audit Objective <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.auditObjective}
                      onChange={(e) => setFormData({ ...formData, auditObjective: e.target.value })}
                      className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 leading-snug"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1.5">
                    <label className="block text-slate-600 font-medium mb-1">
                      Audit Scope <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.auditScope}
                      onChange={(e) => setFormData({ ...formData, auditScope: e.target.value })}
                      className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 leading-snug"
                    />
                  </div>

                  {/* Row 4 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Organization <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    >
                      <option value="Magnertia Private Limited">Magnertia Private Limited</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Plant / Site <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.plantSite}
                      onChange={(e) => setFormData({ ...formData, plantSite: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    >
                      <option value="Namakkal - Manufacturing Plant">Namakkal - Manufacturing Plant</option>
                      <option value="Coimbatore - Engineering Center">Coimbatore - Engineering Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    >
                      <option value="Quality">Quality</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  {/* Row 5 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Process <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    >
                      <option value="EVSE Assembly & Testing">EVSE Assembly & Testing</option>
                      <option value="PCB Assembly">PCB Assembly</option>
                      <option value="Incoming Quality Verification">Incoming Quality</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Lead Auditor <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-slate-200">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {formData.leadAuditor.initials}
                      </span>
                      <span className="text-xs text-slate-800 font-medium truncate">{formData.leadAuditor.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Audit Team</label>
                    <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded border border-blue-200">
                        Priya S ×
                      </span>
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded border border-blue-200">
                        Arun K ×
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                        +2
                      </span>
                    </div>
                  </div>

                  {/* Row 6 */}
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Audit Status</label>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white border border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-slate-800 font-medium">{formData.auditStatus}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-semibold">
                      <span>↑</span>
                      <span>High</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Planned Start</label>
                    <input
                      type="text"
                      value={formData.plannedStart}
                      onChange={(e) => setFormData({ ...formData, plannedStart: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Compliance Source & Requirement (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">2. Compliance Source & Requirement</h2>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Audit Trigger <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.auditTrigger}
                      onChange={(e) => setFormData({ ...formData, auditTrigger: e.target.value as any })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    >
                      <option value="Annual Plan">Annual Plan</option>
                      <option value="NCR">NCR</option>
                      <option value="CAPA">CAPA</option>
                      <option value="Customer">Customer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Source Reference</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.sourceReference}
                        onChange={(e) => setFormData({ ...formData, sourceReference: e.target.value })}
                        className="w-full pr-7 pl-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                      />
                      <Search className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Applicable ISO Standard</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.applicableIsoStandard}
                        onChange={(e) => setFormData({ ...formData, applicableIsoStandard: e.target.value })}
                        className="w-full pr-7 pl-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                      />
                      <Search className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Standard Revision</label>
                    <input
                      type="text"
                      value={formData.standardRevision}
                      onChange={(e) => setFormData({ ...formData, standardRevision: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">ISO Clause / Requirement</label>
                    <input
                      type="text"
                      value={formData.isoClauseRequirement}
                      onChange={(e) => setFormData({ ...formData, isoClauseRequirement: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Regulatory Requirement</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.regulatoryRequirement}
                        onChange={(e) => setFormData({ ...formData, regulatoryRequirement: e.target.value })}
                        className="w-full pr-7 pl-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                      />
                      <Search className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Internal Policy</label>
                    <input
                      type="text"
                      value={formData.internalPolicy}
                      onChange={(e) => setFormData({ ...formData, internalPolicy: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Customer Requirement</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.customerRequirement}
                        onChange={(e) => setFormData({ ...formData, customerRequirement: e.target.value })}
                        className="w-full pr-7 pl-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                      />
                      <Search className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Certification Requirement</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.certificationRequirement}
                        onChange={(e) => setFormData({ ...formData, certificationRequirement: e.target.value })}
                        className="w-full pr-7 pl-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800"
                      />
                      <Search className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Risk Reference</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.riskReference}
                        onChange={(e) => setFormData({ ...formData, riskReference: e.target.value })}
                        className="w-full pr-7 pl-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono text-xs"
                      />
                      <Search className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Audit Progress Stepper (Col span 3) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                    3. Audit Progress
                  </h2>

                  {/* Stepper matching screenshot */}
                  <div className="py-4">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute left-2 right-2 top-3 h-0.5 bg-slate-200 -z-0" />
                      {[
                        { label: "Plan", status: "completed" },
                        { label: "Execution", status: "active" },
                        { label: "Findings", status: "pending" },
                        { label: "CAPA", status: "pending" },
                        { label: "Review", status: "pending" },
                        { label: "Closure", status: "pending" },
                      ].map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              step.status === "completed"
                                ? "bg-teal-600 text-white"
                                : step.status === "active"
                                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                  : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {step.status === "completed" ? <Check className="h-3 w-3" /> : idx + 1}
                          </div>
                          <span className="text-[10px] font-medium text-slate-600 mt-1">{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Banner Card */}
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Audit in Progress</div>
                        <div className="text-[11px] text-teal-700 mt-0.5">Started on 15-Sep-2026 at 09:15 AM</div>
                      </div>
                    </div>
                    <Calendar className="h-5 w-5 text-teal-600" />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Scope Coverage: 44 Requirements</span>
                  <span className="font-semibold text-emerald-600">33 Conforming</span>
                </div>
              </div>
            </div>

            {/* Middle Grid: Section 4 Key Dates & Section 5 Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 4: Key Dates (Col span 6) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">4. Key Dates</h2>
                  <span className="text-xs text-slate-500">Audit Schedule Milestones</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AUDIT_KEY_DATES.map((item, idx) => (
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
                  <span className="text-xs text-slate-500">Execution Workflows</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setShowStartAuditModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Play className="h-4 w-4 text-blue-600" />
                    <span>Start Audit</span>
                  </button>
                  <button
                    onClick={() => setShowUploadDocModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4 text-purple-600" />
                    <span>Upload Evidence</span>
                  </button>
                  <button
                    onClick={() => setShowNewFindingModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-emerald-600" />
                    <span>Create Finding</span>
                  </button>
                  <button
                    onClick={() => setShowCreateNCRModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Create NCR</span>
                  </button>
                  <button
                    onClick={() => setShowCreateCAPAModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <CheckSquare className="h-4 w-4 text-slate-600" />
                    <span>Create CAPA</span>
                  </button>
                  <button
                    onClick={() => setShowGenerateReportModal(true)}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-center gap-2 text-xs font-semibold text-blue-700 transition-colors cursor-pointer"
                  >
                    <Printer className="h-4 w-4 text-blue-600" />
                    <span>Generate Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Third Row: Section 6 Checklist Summary, Section 7 Recent Findings, Section 8 Compliance by Source */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 6: Audit Checklist Summary (Col span 5) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">6. Audit Checklist Summary</h2>
                  <button
                    onClick={() => setActiveTab("checklist")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View Checklist
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-2">#</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2 text-center">Total</th>
                        <th className="pb-2 text-center text-emerald-600">Conforming</th>
                        <th className="pb-2 text-center text-red-600">Non-Conf.</th>
                        <th className="pb-2 text-center text-amber-600">Obs.</th>
                        <th className="pb-2 text-center text-slate-400">N/A</th>
                        <th className="pb-2 text-right">Completion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {AUDIT_CHECKLIST_SUMMARY.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/60">
                          <td className="py-2 text-slate-400 font-medium">{c.id}</td>
                          <td className="py-2 font-medium text-slate-800">{c.category}</td>
                          <td className="py-2 text-center text-slate-700">{c.total}</td>
                          <td className="py-2 text-center font-semibold text-emerald-600">{c.conforming}</td>
                          <td className="py-2 text-center font-semibold text-red-600">{c.nonConforming}</td>
                          <td className="py-2 text-center text-amber-600">{c.observation}</td>
                          <td className="py-2 text-center text-slate-400">{c.na}</td>
                          <td className="py-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${c.completion}%` }}
                                />
                              </div>
                              <span className="font-semibold text-slate-700 text-[11px]">{c.completion}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-slate-50/80">
                        <td className="py-2" colSpan={2}>
                          Total
                        </td>
                        <td className="py-2 text-center">44</td>
                        <td className="py-2 text-center text-emerald-600">33</td>
                        <td className="py-2 text-center text-red-600">7</td>
                        <td className="py-2 text-center text-amber-600">4</td>
                        <td className="py-2 text-center text-slate-400">0</td>
                        <td className="py-2 text-right">75%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 7: Recent Findings (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">7. Recent Findings</h2>
                  <button
                    onClick={() => setActiveTab("findings-ncr")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-2">ID</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2">Finding</th>
                        <th className="pb-2 text-center">Severity</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {findings.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50/60">
                          <td className="py-2 font-semibold text-blue-600">{f.id}</td>
                          <td className="py-2 text-slate-600">{f.category}</td>
                          <td className="py-2 font-medium text-slate-800 max-w-[130px] truncate">{f.finding}</td>
                          <td className="py-2 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                f.severity === "Major"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : f.severity === "Minor"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {f.severity}
                            </span>
                          </td>
                          <td className="py-2 text-right">
                            <span
                              className={`font-semibold text-[11px] ${
                                f.status === "Open" ? "text-red-600" : "text-blue-600"
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

              {/* Section 8: Compliance by Source Donut (Col span 3) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900">8. Compliance by Source</h2>
                    <button
                      onClick={() => setActiveTab("compliance-requirements")}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      View Checklist
                    </button>
                  </div>

                  {/* Donut Chart with center label */}
                  <div className="relative h-44 w-full flex items-center justify-center mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={COMPLIANCE_BY_SOURCE_DATA}
                          dataKey="count"
                          nameKey="name"
                          innerRadius={48}
                          outerRadius={66}
                          paddingAngle={2}
                        >
                          {COMPLIANCE_BY_SOURCE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-900 leading-none">44</span>
                      <span className="text-[10px] font-medium text-slate-500 mt-0.5">Requirements</span>
                    </div>
                  </div>
                </div>

                {/* Legend matching screenshot */}
                <div className="space-y-1 text-[11px] pt-2 border-t border-slate-100">
                  {COMPLIANCE_BY_SOURCE_DATA.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {item.count} ({item.percentage})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Section 9 Open CAPA, Section 10 Audit Documents, Section 11 Compliance Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Section 9: Open Corrective Actions CAPA (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">9. Open Corrective Actions (CAPA)</h2>
                  <button
                    onClick={() => setActiveTab("capa")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="pb-2">CAPA ID</th>
                        <th className="pb-2">Related</th>
                        <th className="pb-2">Action</th>
                        <th className="pb-2">Owner</th>
                        <th className="pb-2">Due Date</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {capaList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="py-2 font-mono font-semibold text-blue-600">{item.id}</td>
                          <td className="py-2 text-slate-600">{item.relatedFinding}</td>
                          <td className="py-2 font-medium text-slate-900 max-w-[130px] truncate">{item.action}</td>
                          <td className="py-2 font-semibold text-slate-700">{item.owner}</td>
                          <td className="py-2 text-slate-600 whitespace-nowrap">{item.dueDate}</td>
                          <td className="py-2 text-right">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.status === "Overdue"
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : item.status === "In Progress"
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-red-600"
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

              {/* Section 10: Audit Documents & Evidence (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">10. Audit Documents & Evidence</h2>
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
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 font-medium text-slate-900 max-w-[140px] truncate">
                            {doc.documentName}
                          </td>
                          <td className="py-2.5 text-slate-600">{doc.type}</td>
                          <td className="py-2.5 text-slate-600">{doc.version}</td>
                          <td className="py-2.5 text-slate-600 whitespace-nowrap">{doc.uploadDate}</td>
                          <td className="py-2.5 text-right">
                            {doc.status === "Valid" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="h-3 w-3" />
                                <span>Valid</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
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

              {/* Section 11: Compliance Trend (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900">11. Compliance Trend</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Past 6 Months</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      Current: 92%
                    </span>
                  </div>
                </div>

                <div className="h-44 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={AUDIT_COMPLIANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        ticks={[0, 20, 40, 60, 80, 100]}
                      />
                      <Tooltip
                        formatter={(val: any) => [`${val}%`, "Compliance Rate"]}
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
                  Evolution of audit conformance score across manufacturing operations (Apr 2026 - Sep 2026)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: REPORTS (SECTION 22: 18 CONTROLLED REPORTS & SECTION 23 KPI MASTER)  */}
        {/* ========================================================================= */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Section 23: Key KPIs Master */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Section 23: Audit Compliance Key KPI Master
                  </h2>
                  <p className="text-xs text-slate-500">
                    Audit execution rates, weighted compliance, finding recurrence, and CAPA effectiveness metrics
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
                    {AUDIT_KPI_MASTER.map((kpi) => (
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

            {/* Section 22: Controlled Audit Reports Register */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Section 22: Controlled Audit Reports Register (18 Reports)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Statutory audit summaries, finding Pareto charts, ISO audits, CAPA registers, and AI intelligence reports
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
                  "Audit Program & Planning",
                  "Findings & Non-Conformance",
                  "Standards & Compliance",
                  "CAPA & Follow-up",
                  "Risk & AI Analytics",
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
        {/* TAB: AUDIT DETAILS (CONTROLLED AUDIT MASTER RECORD)                       */}
        {/* ========================================================================= */}
        {activeTab === "audit-details" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Audit Header & Master Configuration</h2>
                <p className="text-xs text-slate-500">
                  Audit program assignment, organizational scope, lead auditor assignment, and timeline tracking
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStartAuditModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Start Live Session</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Details</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Audit Compliance ID</label>
                <input
                  type="text"
                  disabled
                  value={formData.auditComplianceId}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Audit Reference Number</label>
                <input
                  type="text"
                  value={formData.auditNumber}
                  onChange={(e) => setFormData({ ...formData, auditNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Audit Date</label>
                <input
                  type="text"
                  value={formData.auditDate}
                  onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Audit Type</label>
                <select
                  value={formData.auditType}
                  onChange={(e) => setFormData({ ...formData, auditType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                >
                  <option value="Internal Compliance Audit">Internal Compliance Audit</option>
                  <option value="Supplier Audit">Supplier Audit</option>
                  <option value="Process Audit">Process Audit</option>
                  <option value="Product Audit">Product Audit</option>
                  <option value="System Audit">System Audit</option>
                  <option value="Customer Audit">Customer Audit</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Audit Category</label>
                <select
                  value={formData.auditCategory}
                  onChange={(e) => setFormData({ ...formData, auditCategory: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                >
                  <option value="Planned">Planned</option>
                  <option value="Special">Special</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Surveillance">Surveillance</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Audit Program</label>
                <input
                  type="text"
                  value={formData.auditProgram}
                  onChange={(e) => setFormData({ ...formData, auditProgram: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Audit Objective</label>
                <input
                  type="text"
                  value={formData.auditObjective}
                  onChange={(e) => setFormData({ ...formData, auditObjective: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Lead Auditor</label>
                <input
                  type="text"
                  value={formData.leadAuditor.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      leadAuditor: { ...formData.leadAuditor, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-slate-600 font-medium mb-1">Audit Scope & Boundaries</label>
                <textarea
                  rows={2}
                  value={formData.auditScope}
                  onChange={(e) => setFormData({ ...formData, auditScope: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: COMPLIANCE REQUIREMENTS (SOURCE STANDARD & CLAUSES)                  */}
        {/* ========================================================================= */}
        {activeTab === "compliance-requirements" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Audit Scope & Requirements Traceability Matrix</h2>
                <p className="text-xs text-slate-500">
                  Standard criteria, clauses, internal procedures, and customer requirements governing this audit
                </p>
              </div>
              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Requirements</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Applicable ISO Standard & Clauses</span>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Standard & Edition</label>
                  <input
                    type="text"
                    value={formData.applicableIsoStandard}
                    onChange={(e) => setFormData({ ...formData, applicableIsoStandard: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Focal ISO Clause Requirement</label>
                  <input
                    type="text"
                    value={formData.isoClauseRequirement}
                    onChange={(e) => setFormData({ ...formData, isoClauseRequirement: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-purple-600" />
                  <span>Statutory, Policy & Customer Criteria</span>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Internal Policy / SOP</label>
                  <input
                    type="text"
                    value={formData.internalPolicy}
                    onChange={(e) => setFormData({ ...formData, internalPolicy: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Customer Mandate Reference</label>
                  <input
                    type="text"
                    value={formData.customerRequirement}
                    onChange={(e) => setFormData({ ...formData, customerRequirement: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: CHECKLIST (INTERACTIVE AUDIT CHECKLIST WITH LIVE TOGGLES)            */}
        {/* ========================================================================= */}
        {activeTab === "checklist" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Interactive Audit Checklist & Objective Evidence</h2>
                <p className="text-xs text-slate-500">
                  Assess conformity per requirement. Click status badges to toggle Conformance, Minor NC, Major NC, or OFI.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                  {checklistItems.filter((i) => i.status === "Conform").length} Conforming
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800">
                  {checklistItems.filter((i) => i.status === "Minor NC").length} Minor NC
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-800">
                  {checklistItems.filter((i) => i.status === "Major NC").length} Major NC
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">Item ID</th>
                    <th className="p-3">Clause</th>
                    <th className="p-3">Audit Question & Requirement</th>
                    <th className="p-3">Auditor Objective Notes</th>
                    <th className="p-3 text-center">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {checklistItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-semibold text-blue-600">{item.id}</td>
                      <td className="p-3 font-semibold text-slate-800">{item.clause}</td>
                      <td className="p-3 font-medium text-slate-900 max-w-sm">{item.question}</td>
                      <td className="p-3 text-slate-600 max-w-xs">{item.auditorNotes}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setChecklistItems((prev) =>
                                prev.map((x) => (x.id === item.id ? { ...x, status: "Conform" } : x)),
                              );
                            }}
                            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                              item.status === "Conform"
                                ? "bg-emerald-600 text-white font-bold"
                                : "bg-slate-100 text-slate-600 hover:bg-emerald-50"
                            }`}
                          >
                            Conform
                          </button>
                          <button
                            onClick={() => {
                              setChecklistItems((prev) =>
                                prev.map((x) => (x.id === item.id ? { ...x, status: "Minor NC" } : x)),
                              );
                            }}
                            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                              item.status === "Minor NC"
                                ? "bg-amber-500 text-white font-bold"
                                : "bg-slate-100 text-slate-600 hover:bg-amber-50"
                            }`}
                          >
                            Minor NC
                          </button>
                          <button
                            onClick={() => {
                              setChecklistItems((prev) =>
                                prev.map((x) => (x.id === item.id ? { ...x, status: "Major NC" } : x)),
                              );
                            }}
                            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                              item.status === "Major NC"
                                ? "bg-red-600 text-white font-bold"
                                : "bg-slate-100 text-slate-600 hover:bg-red-50"
                            }`}
                          >
                            Major NC
                          </button>
                          <button
                            onClick={() => {
                              setChecklistItems((prev) =>
                                prev.map((x) => (x.id === item.id ? { ...x, status: "OFI" } : x)),
                              );
                            }}
                            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                              item.status === "OFI"
                                ? "bg-blue-600 text-white font-bold"
                                : "bg-slate-100 text-slate-600 hover:bg-blue-50"
                            }`}
                          >
                            OFI
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
        {/* TAB: FINDINGS & NCR (AUDIT FINDINGS AND NON-CONFORMANCE REPORTS)           */}
        {/* ========================================================================= */}
        {activeTab === "findings-ncr" && (
          <div className="space-y-6">
            {/* Findings Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Audit Findings Register</h2>
                  <p className="text-xs text-slate-500">
                    Observations, opportunities for improvement, and documented deviations identified during audit
                  </p>
                </div>
                <button
                  onClick={() => setShowNewFindingModal(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Record Finding</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-3">Finding ID</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Finding Statement</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {findings.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-semibold text-blue-600">{f.id}</td>
                        <td className="p-3 text-slate-700 font-medium">{f.category}</td>
                        <td className="p-3 font-medium text-slate-900">{f.finding}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              f.severity === "Major"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : f.severity === "Minor"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {f.severity}
                          </span>
                        </td>
                        <td className="p-3 text-right font-semibold text-slate-800">{f.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Non-Conformance Reports (NCR) Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Controlled Non-Conformance Reports (NCR)</h2>
                  <p className="text-xs text-slate-500">
                    Formal non-conformance records requiring immediate containment and corrective action plans
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateNCRModal(true)}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Raise NCR</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="p-3">NCR ID</th>
                      <th className="p-3">Finding Ref</th>
                      <th className="p-3">Clause</th>
                      <th className="p-3">Non-Conformance Issue</th>
                      <th className="p-3">Immediate Containment Action</th>
                      <th className="p-3">Target Date</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ncrList.map((ncr) => (
                      <tr key={ncr.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono font-bold text-amber-700">{ncr.id}</td>
                        <td className="p-3 font-semibold text-blue-600">{ncr.findingId}</td>
                        <td className="p-3 text-slate-700 font-medium">{ncr.clause}</td>
                        <td className="p-3 font-bold text-slate-900">{ncr.issue}</td>
                        <td className="p-3 text-slate-600">{ncr.containment}</td>
                        <td className="p-3 text-slate-800 font-medium">{ncr.dueDate}</td>
                        <td className="p-3 text-right">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {ncr.status}
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

        {/* ========================================================================= */}
        {/* TAB: CAPA (CORRECTIVE AND PREVENTIVE ACTIONS)                             */}
        {/* ========================================================================= */}
        {activeTab === "capa" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Corrective & Preventive Action (CAPA) Tracker</h2>
                <p className="text-xs text-slate-500">
                  Track root cause analysis, action assignments, milestone due dates, and closure verification
                </p>
              </div>
              <button
                onClick={() => setShowCreateCAPAModal(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create CAPA</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-3">CAPA ID</th>
                    <th className="p-3">Related Finding</th>
                    <th className="p-3">Corrective Action Statement</th>
                    <th className="p-3">Accountable Owner</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {capaList.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-emerald-700">{c.id}</td>
                      <td className="p-3 text-blue-600 font-medium">{c.relatedFinding}</td>
                      <td className="p-3 font-bold text-slate-900">{c.action}</td>
                      <td className="p-3 text-slate-700 font-medium">{c.owner}</td>
                      <td className="p-3 text-slate-800">{c.dueDate}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === "Verified" || c.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setCapaList((prev) =>
                              prev.map((item) =>
                                item.id === c.id
                                  ? {
                                      ...item,
                                      status: item.status === "In Progress" ? "Verified" : "In Progress",
                                    }
                                  : item,
                              ),
                            );
                            setSaveSuccess(true);
                            setTimeout(() => setSaveSuccess(false), 2000);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        >
                          Toggle Status
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
        {/* TAB: EVIDENCE (ATTACHED DOCUMENTS & AUDIT PROOFS)                         */}
        {/* ========================================================================= */}
        {activeTab === "evidence" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Audit Evidence & Digital Attachments</h2>
                <p className="text-xs text-slate-500">
                  Calibration certificates, work instructions, objective photos, and operator checklists
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
                    <th className="p-3">Status</th>
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
        {/* TAB: AUDIT REPORT (FORMAL EXECUTIVE AUDIT REPORT)                         */}
        {/* ========================================================================= */}
        {activeTab === "audit-report" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Executive Audit Summary & Formal Report</h2>
                <p className="text-xs text-slate-500">
                  Consolidated audit findings, non-conformance closure status, and Lead Auditor formal sign-off
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Summary</span>
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Formally Close Audit</span>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <span className="font-bold text-base text-slate-900">MAGNERTIA ENTERPRISE AUDIT REPORT</span>
                  <div className="text-slate-500">Audit Compliance Directorate | Ref: {formData.auditComplianceId}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-600">{formData.auditNumber}</span>
                  <div className="text-slate-500">Status: {formData.auditStatus}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-500">Audited Department:</span>
                  <div className="font-bold text-slate-900">{formData.department} ({formData.plantSite})</div>
                </div>
                <div>
                  <span className="text-slate-500">Lead Auditor:</span>
                  <div className="font-bold text-slate-900">{formData.leadAuditor.name}</div>
                </div>
                <div>
                  <span className="text-slate-500">Target Standard:</span>
                  <div className="font-bold text-slate-900">{formData.applicableIsoStandard}</div>
                </div>
                <div>
                  <span className="text-slate-500">Overall Compliance Rate:</span>
                  <div className="font-bold text-emerald-600">{formData.complianceRate}% Conforming</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                The internal quality compliance audit for {formData.process} was executed according to ISO 19011:2018 guidelines.
                A total of {findings.length} findings were recorded ({findings.filter((f) => f.severity === "Major").length} Major,{" "}
                {findings.filter((f) => f.severity === "Minor").length} Minor). Containment actions and CAPA assignments
                have been established with full digital verification.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: FOLLOW-UP, RELATED-RECORDS, HISTORY                                   */}
        {/* ========================================================================= */}
        {(activeTab === "follow-up" || activeTab === "related-records" || activeTab === "history") && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 capitalize">
                  {activeTab.replace("-", " ")} Audit Log
                </h2>
                <p className="text-xs text-slate-500">
                  Traceable chronological register and related compliance cross-references for {formData.auditComplianceId}
                </p>
              </div>
              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Audit Note</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Follow-up Verification Audit</div>
                  <div className="text-slate-500">Scheduled for 15-Oct-2026 to verify CAPA-001 closure on potting line</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Scheduled
                </span>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">ISO 9001:2015 Annual Surveillance Audit Link</div>
                  <div className="text-slate-500">Linked to certification body audit scheduled November 2026</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  External Standard
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODALS & WORKFLOW DIALOGS                                                 */}
      {/* ========================================================================= */}

      {/* 1. Modal: Create Finding */}
      {showNewFindingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record Audit Finding</h3>
              <button onClick={() => setShowNewFindingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Finding Category</label>
                <select
                  value={newFindingCategory}
                  onChange={(e) => setNewFindingCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Document Control">Document Control</option>
                  <option value="Training">Training</option>
                  <option value="Process">Process</option>
                  <option value="Safety">Safety</option>
                  <option value="Records">Records</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Finding Statement</label>
                <textarea
                  rows={3}
                  value={newFindingText}
                  onChange={(e) => setNewFindingText(e.target.value)}
                  placeholder="Detail the objective evidence and non-conformance..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Severity</label>
                <select
                  value={newFindingSeverity}
                  onChange={(e) => setNewFindingSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Major">Major Non-Conformance</option>
                  <option value="Minor">Minor Non-Conformance</option>
                  <option value="Observation">Observation</option>
                  <option value="OFI">Opportunity for Improvement</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowNewFindingModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newFindingText.trim()) {
                    setFindings([
                      ...findings,
                      {
                        id: `F-00${findings.length + 1}`,
                        category: newFindingCategory,
                        finding: newFindingText,
                        severity: newFindingSeverity,
                        status: "Open",
                      },
                    ]);
                    setNewFindingText("");
                  }
                  setShowNewFindingModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                Record Finding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Create NCR */}
      {showCreateNCRModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Initiate Non-Conformance Report (NCR)</h3>
              <button onClick={() => setShowCreateNCRModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Related Finding</label>
                <select
                  value={newNCRFindingId}
                  onChange={(e) => setNewNCRFindingId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  {findings.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.id} - {f.finding}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Non-Conformance Statement / Issue</label>
                <input
                  type="text"
                  value={newNCRIssue}
                  onChange={(e) => setNewNCRIssue(e.target.value)}
                  placeholder="e.g. Deviation from standard operating procedure..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Immediate Containment Action</label>
                <textarea
                  rows={2}
                  value={newNCRContainment}
                  onChange={(e) => setNewNCRContainment(e.target.value)}
                  placeholder="Immediate segregation or hold instructions..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Target Date</label>
                <input
                  type="text"
                  value={newNCRDueDate}
                  onChange={(e) => setNewNCRDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCreateNCRModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newNCRIssue.trim() || newNCRContainment.trim()) {
                    setNcrList((prev) => [
                      {
                        id: `NCR-2026-00${prev.length + 6}`,
                        findingId: newNCRFindingId,
                        clause: "ISO 9001: 8.5.1",
                        issue: newNCRIssue || "Documented non-conformance identified during internal audit",
                        containment: newNCRContainment || "Lot segregated pending quality manager review",
                        owner: "RS",
                        dueDate: newNCRDueDate,
                        status: "Open",
                      },
                      ...prev,
                    ]);
                    setNewNCRIssue("");
                    setNewNCRContainment("");
                  }
                  setShowCreateNCRModal(false);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 cursor-pointer"
              >
                Issue NCR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Create CAPA */}
      {showCreateCAPAModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Corrective Action (CAPA)</h3>
              <button onClick={() => setShowCreateCAPAModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Corrective Action</label>
                <input
                  type="text"
                  value={newCAPATitle}
                  onChange={(e) => setNewCAPATitle(e.target.value)}
                  placeholder="e.g. Implement secondary verification checklist"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Accountable Owner</label>
                <input
                  type="text"
                  value={newCAPAOwner}
                  onChange={(e) => setNewCAPAOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Due Date</label>
                <input
                  type="text"
                  value={newCAPADueDate}
                  onChange={(e) => setNewCAPADueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCreateCAPAModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newCAPATitle.trim()) {
                    setCapaList([
                      ...capaList,
                      {
                        id: `CAPA-00${capaList.length + 1}`,
                        relatedFinding: "F-001",
                        action: newCAPATitle,
                        owner: "RS",
                        dueDate: newCAPADueDate,
                        status: "In Progress",
                      },
                    ]);
                    setNewCAPATitle("");
                  }
                  setShowCreateCAPAModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
              >
                Create CAPA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Upload Evidence */}
      {showUploadDocModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Audit Evidence</h3>
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
                  placeholder="e.g. Dielectric Tester Calibration Certificate"
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
                  <option value="Evidence">Evidence</option>
                  <option value="Internal">Internal</option>
                  <option value="Checklist">Checklist</option>
                  <option value="Report">Report</option>
                  <option value="Certificate">Certificate</option>
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
                  if (newDocName.trim()) {
                    setDocuments([
                      ...documents,
                      {
                        id: `DOC-AUD-00${documents.length + 1}`,
                        documentName: newDocName,
                        type: newDocType,
                        version: "1.0",
                        uploadDate: "15-Sep-2026",
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

      {/* 5. Modal: Start Audit confirmation */}
      {showStartAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Start Live Audit Session</h3>
              <button onClick={() => setShowStartAuditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Commencing live audit execution for <strong className="text-slate-900">EVSE Assembly & Testing</strong> under{" "}
              <strong className="text-slate-900">AC-2026-0018</strong>. This will notify the audited department and log the opening meeting.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowStartAuditModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    auditStatus: "In Progress",
                    actualStart: "15-Sep-2026 09:15",
                  }));
                  setShowStartAuditModal(false);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Confirm Start
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
                  <div className="text-[11px] text-slate-500">Quality Assurance & Audit Compliance Directorate</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-600">{selectedReport.code}</span>
                  <div className="text-[11px] text-slate-500">Classification: Official Controlled Record</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Audit Reference:</span>
                  <div className="font-semibold text-slate-900">AC-2026-0018</div>
                </div>
                <div>
                  <span className="text-slate-500">Target Standard:</span>
                  <div className="font-semibold text-slate-900">ISO 9001:2015</div>
                </div>
                <div>
                  <span className="text-slate-500">Generated On:</span>
                  <div className="font-semibold text-slate-900">{selectedReport.lastGenerated}</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                This document certifies that the audit findings, checklist assessments, non-conformance records, and CAPA
                remediations summarized within this register have been executed under Magnertia's Audit Compliance Framework
                in accordance with ISO 19011:2018 guidelines.
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
