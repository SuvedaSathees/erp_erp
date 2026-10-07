// Magnertia ERP - Best Practices Module
// Management -> Knowledge Management -> Best Practices
// Best Practices Form — MAICW Classification, Impact Metrics, Actions, Standardization, and Reuse

import React, { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getBestPracticesRecordFn } from "@/lib/bestPracticesFns.server";
import {
  FileText,
  FileCheck,
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
  Save,
  Check,
  X,
  Building,
  UserCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Sliders,
  History,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Share2,
  FileSpreadsheet,
  Link as LinkIcon,
  ChevronDown,
  Layers,
  Award,
  Box,
  Lock,
  Lightbulb,
  CheckCircle2,
  XCircle,
  BarChart3,
  Edit,
  FolderKanban,
  CheckCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { KnowledgeTabBar } from "@/components/erp/KnowledgeManagementTabBar";
import { KnowledgeSubmoduleHeader } from "@/components/erp/KnowledgeSubmoduleHeader";
import {
  PRIMARY_BEST_PRACTICE_RECORD,
  BEST_PRACTICES_EXECUTIVE_KPIS,
  BEST_PRACTICE_IMPACT_METRICS,
  BEST_PRACTICE_ACTIONS,
  BEST_PRACTICE_AI_INSIGHTS,
  BEST_PRACTICES_MASTER_REGISTER,
  type BestPracticeRecord,
  type PerformanceImpactItem,
  type PracticeActionItem,
} from "@/services/bestPracticesService";

export const Route = createFileRoute("/management/knowledge-management/best-practices")({
  head: () => ({
    meta: [
      { title: "Best Practices · Knowledge · Magnertia ERP" },
      {
        name: "description",
        content:
          "Capture, standardize, share, reuse, and drive continuous improvement with proven operational and engineering best practices.",
      },
    ],
  }),
  component: BestPracticesManagementPage,
});

function BestPracticesManagementPage() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "practice-register"
    | "create-edit"
    | "evidence-validation"
    | "review-approval"
    | "implementation"
    | "knowledge-reuse"
    | "analytics"
    | "settings"
  >("overview");

  // Form State
  const { data: dbRecord } = useQuery({
    queryKey: ["best-practices", "record"],
    queryFn: () => getBestPracticesRecordFn({ data: {} }),
  });

  const [formData, setFormData] = useState<BestPracticeRecord>(PRIMARY_BEST_PRACTICE_RECORD);
  useEffect(() => { if (dbRecord?.data) setFormData(dbRecord.data); }, [dbRecord]);
  const [kpis, setKpis] = useState(BEST_PRACTICES_EXECUTIVE_KPIS);
  const [impactMetrics, setImpactMetrics] = useState<PerformanceImpactItem[]>(BEST_PRACTICE_IMPACT_METRICS);
  const [actionsList, setActionsList] = useState<PracticeActionItem[]>(BEST_PRACTICE_ACTIONS);
  const [activeActionSubTab, setActiveActionSubTab] = useState<"corrective" | "preventive" | "recommendations">("corrective");

  // Notification banners
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Tags State
  const [tags, setTags] = useState<string[]>(PRIMARY_BEST_PRACTICE_RECORD.tags);
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  // Related Documents State
  const [relatedDocs, setRelatedDocs] = useState([
    { name: "Docking Alignment SOP", type: "SOP", version: "v1.2", linkedOn: "10-Aug-2026" },
    { name: "Sensor Calibration Guide", type: "Work Instruction", version: "v1.0", linkedOn: "12-Aug-2026" },
    { name: "Test Report - Docking Trial", type: "Report", version: "v2.0", linkedOn: "15-Aug-2026" },
    { name: "EVSE Design Drawing", type: "Drawing", version: "v3.1", linkedOn: "18-Aug-2026" },
  ]);

  // Master register search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [showNewPracticeModal, setShowNewPracticeModal] = useState(false);
  const [showLinkDocModal, setShowLinkDocModal] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState("SOP");
  const [showMoreActions, setShowMoreActions] = useState(false);

  // New Practice form state
  const [newPracticeTitle, setNewPracticeTitle] = useState("");
  const [newPracticeType, setNewPracticeType] = useState<BestPracticeRecord["practiceType"]>("Process");
  const [newPracticeCategory, setNewPracticeCategory] = useState<BestPracticeRecord["knowledgeCategory"]>("Manufacturing");
  const [newPracticeDept, setNewPracticeDept] = useState("R&D");

  // Handlers
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

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSubmitReview = () => {
    setFormData((prev) => ({ ...prev, status: "Review" }));
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleCreateNewPractice = () => {
    if (!newPracticeTitle.trim()) return;
    const newId = `BP-2026-00${kpis.totalBestPractices + 1}`;
    const newCode = `BP-${newPracticeDept.slice(0, 3).toUpperCase()}-0${kpis.totalBestPractices + 2}`;

    const newRecord: BestPracticeRecord = {
      ...PRIMARY_BEST_PRACTICE_RECORD,
      bestPracticeId: newId,
      practiceCode: newCode,
      practiceTitle: newPracticeTitle,
      practiceType: newPracticeType,
      knowledgeCategory: newPracticeCategory,
      department: newPracticeDept,
      status: "Draft",
      version: "v1.0",
      effectiveDate: "27-Sep-2026",
      reviewDate: "27-Sep-2027",
    };

    setFormData(newRecord);
    setKpis((prev) => ({
      ...prev,
      totalBestPractices: prev.totalBestPractices + 1,
    }));
    setShowNewPracticeModal(false);
    setNewPracticeTitle("");
    setActiveTab("overview");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLinkDoc = () => {
    if (!newDocName.trim()) return;
    setRelatedDocs((prev) => [
      ...prev,
      {
        name: newDocName,
        type: newDocType,
        version: "v1.0",
        linkedOn: "27-Sep-2026",
      },
    ]);
    setNewDocName("");
    setShowLinkDocModal(false);
  };

  // Filtered master records
  const filteredPractices = useMemo(() => {
    return BEST_PRACTICES_MASTER_REGISTER.filter((p) => {
      const matchCat = selectedCategory === "All" || p.knowledgeCategory === selectedCategory;
      const matchSearch =
        p.practiceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.practiceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bestPracticeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <AppShell
      title="Best Practices"
      breadcrumb="Management > Knowledge > Best Practices"
      description="Enterprise excellence benchmarks, standardized operational protocols, safety guidelines, and industry standards."
      tabs={<KnowledgeTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Save & Submit Success Banners */}
        {saveSuccess && (
          <div className="bg-blue-600 text-white px-6 py-2.5 flex items-center justify-between shadow-md rounded-md animate-fade-in text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200" />
              <span>Best Practice record successfully synchronized and saved to Knowledge Base repository.</span>
            </div>
            <button onClick={() => setSaveSuccess(false)} className="text-blue-200 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {submitSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between shadow-md rounded-md animate-fade-in text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-200" />
              <span>Practice submitted to Technical Review Board for validation and standardization.</span>
            </div>
            <button onClick={() => setSubmitSuccess(false)} className="text-emerald-200 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP EXECUTIVE COMMAND HEADER */}
        <KnowledgeSubmoduleHeader
          icon={Award}
          title="Best Practices"
          code="BP-2026-001"
          version="v1.0"
          status="Active"
          subtitle="Validated Standards. Lean & Kaizen Excellence. High-Yield Benchmarks."
          onSave={handleSave}
          onSubmit={handleSubmitReview}
          onGenerateReport={() => setActiveTab("analytics")}
          moreActions={[
            {
              label: activeTab === "practice-register" ? "View Controlled Form" : "View Practice Register",
              icon: FileText,
              onClick: () => setActiveTab(activeTab === "practice-register" ? "overview" : "practice-register"),
            },
          ]}
        />

        {/* 6 Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total Best Practices */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.totalBestPractices}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Best Practices</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.totalChange}%</span>
            </div>
          </div>

          {/* 2. Published */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <Check className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.published}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Published</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.publishedChange}%</span>
            </div>
          </div>

          {/* 3. Under Review */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500 text-white">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.underReview}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Under Review</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(kpis.underReviewChange)}%</span>
            </div>
          </div>

          {/* 4. Due for Review */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.dueForReview}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Due for Review</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(kpis.dueForReviewChange)}%</span>
            </div>
          </div>

          {/* 5. Times Reused */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-600 text-white">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.timesReused}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Times Reused</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.timesReusedChange}%</span>
            </div>
          </div>

          {/* 6. Implementation Rate */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.implementationRate}%</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Implementation Rate</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.implementationRateChange}%</span>
            </div>
          </div>
        </div>

        {/* MAIN OVERVIEW TAB CONTENT (Sections 1-11 matching Image 5) */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Top Grid: Section 1 (Best Practice Header - span 7), Right Column (Sections 2, 3, 4 - span 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* SECTION 1: Best Practice Header (Col span 7) */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>1. Best Practice Header</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold rounded-full flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>{formData.status}</span>
                  </span>
                </div>

                {/* Row 1: ID, Code, Title */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-600">Best Practice ID</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.bestPracticeId}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700 font-mono"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-600">Practice Code</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.practiceCode}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700 font-mono"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Practice Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.practiceTitle}
                      onChange={(e) => setFormData({ ...formData, practiceTitle: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Row 2: Practice Type, Knowledge Category, Source Module, Source Record */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Practice Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.practiceType}
                      onChange={(e) => setFormData({ ...formData, practiceType: e.target.value as any })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Process">Process</option>
                      <option value="Technical">Technical</option>
                      <option value="Quality">Quality</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Knowledge Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.knowledgeCategory}
                      onChange={(e) => setFormData({ ...formData, knowledgeCategory: e.target.value as any })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Quality">Quality</option>
                      <option value="Supply Chain">Supply Chain</option>
                      <option value="Safety">Safety</option>
                      <option value="Project Management">Project Management</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Source Module</label>
                    <select
                      value={formData.sourceModule}
                      onChange={(e) => setFormData({ ...formData, sourceModule: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Project Management">Project Management</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Quality">Quality</option>
                      <option value="R&D">R&D</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Source Record</label>
                    <input
                      type="text"
                      value={formData.sourceRecord}
                      onChange={(e) => setFormData({ ...formData, sourceRecord: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Row 3: Description */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 w-full bg-white border border-slate-200 rounded-md p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Row 4: Department, Process, Process Owner, Practice Owner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Department <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="R&D">R&D</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Quality">Quality</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Process <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Assembly & Testing">Assembly & Testing</option>
                      <option value="Inspection">Inspection</option>
                      <option value="Calibration">Calibration</option>
                      <option value="Fastening">Fastening</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Process Owner</label>
                    <div className="mt-1 flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                      <div className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        RS
                      </div>
                      <span className="text-xs text-slate-800">{formData.processOwner}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Practice Owner <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1 flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                      <div className="h-5 w-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                        PS
                      </div>
                      <span className="text-xs text-slate-800">{formData.practiceOwner}</span>
                    </div>
                  </div>
                </div>

                {/* Row 5: Organization, Branch/Site, Version, Status */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Organization <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Magnertia Private Limited">Magnertia Private Limited</option>
                      <option value="Magnertia Mobility Corp">Magnertia Mobility Corp</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Branch / Site <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.branchSite}
                      onChange={(e) => setFormData({ ...formData, branchSite: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Coimbatore - Dev Centre">Coimbatore - Dev Centre</option>
                      <option value="Plant 1 - Chennai">Plant 1 - Chennai</option>
                      <option value="Bengaluru Tech Park">Bengaluru Tech Park</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Version</label>
                    <select
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="v2.1">v2.1</option>
                      <option value="v2.0">v2.0</option>
                      <option value="v1.1">v1.1</option>
                      <option value="v1.0">v1.0</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 font-medium"
                    >
                      <option value="Published">Published</option>
                      <option value="Review">Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Draft">Draft</option>
                      <option value="Revision">Revision</option>
                    </select>
                  </div>
                </div>

                {/* Row 6: Confidentiality, Effective Date, Review Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Confidentiality</label>
                    <select
                      value={formData.confidentiality}
                      onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value as any })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800"
                    >
                      <option value="Internal">Internal</option>
                      <option value="Public">Public</option>
                      <option value="Confidential">Confidential</option>
                      <option value="Restricted">Restricted</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Effective Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800"
                      />
                      <Calendar className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-2" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Review Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        value={formData.reviewDate}
                        onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800"
                      />
                      <Calendar className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (Col span 5): Section 2, Section 3, Section 4 */}
              <div className="lg:col-span-5 space-y-4">
                {/* SECTION 2: Practice Statement */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm font-bold text-slate-900">2. Practice Statement</span>
                    <button
                      onClick={() => alert("Editing Practice Statement")}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">Practice Statement: </span>
                      <span className="text-slate-700">{formData.practiceStatement}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Problem Addressed: </span>
                      <span className="text-slate-600">{formData.problemAddressed}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Recommended Method: </span>
                      <span className="text-slate-600">{formData.recommendedMethod}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Expected Result: </span>
                      <span className="text-slate-600">{formData.expectedResult}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Applicability: </span>
                      <span className="text-slate-600">{formData.applicability}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Limitations: </span>
                      <span className="text-slate-600">{formData.limitations}</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Impact & Performance */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm font-bold text-slate-900">3. Impact & Performance</span>
                    <button
                      onClick={() => alert("Viewing full statistical impact analysis...")}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                          <th className="py-1">KPI</th>
                          <th className="py-1">Before</th>
                          <th className="py-1">After</th>
                          <th className="py-1 text-right">Improvement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {impactMetrics.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1 text-slate-800 font-medium">{row.kpi}</td>
                            <td className="py-1 text-slate-600">{row.before}</td>
                            <td className="py-1 text-slate-800 font-semibold">{row.after}</td>
                            <td className="py-1 text-right text-emerald-600 font-semibold">
                              <span className="inline-flex items-center gap-0.5">
                                <TrendingDown className="h-3 w-3" />
                                {row.improvement}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION 4: Knowledge Classification */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm font-bold text-slate-900">4. Knowledge Classification</span>
                    <button
                      onClick={() => alert("Editing Classification & Taxonomies")}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Knowledge Category</label>
                      <select
                        value={formData.knowledgeCategory}
                        onChange={(e) => setFormData({ ...formData, knowledgeCategory: e.target.value as any })}
                        className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                      >
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Quality">Quality</option>
                        <option value="Supply Chain">Supply Chain</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600">Sub Category</label>
                      <select className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800">
                        <option value="Assembly & Testing">Assembly & Testing</option>
                        <option value="Autonomous Systems">Autonomous Systems</option>
                        <option value="Tooling">Tooling</option>
                      </select>
                    </div>
                  </div>

                  {/* Interactive Tags */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Tags</label>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-md flex items-center gap-1"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}

                      {showAddTagInput ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddTag();
                              if (e.key === "Escape") setShowAddTagInput(false);
                            }}
                            placeholder="Tag name..."
                            className="px-2 py-0.5 text-xs border border-blue-400 rounded-md w-24 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={handleAddTag}
                            className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-xs"
                          >
                            Add
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddTagInput(true)}
                          className="px-2 py-0.5 text-xs text-blue-600 hover:bg-blue-50 border border-dashed border-blue-300 rounded-md flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Tag</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Grid: Section 5 (Source & Origin - span 4), Section 6 (Root Cause & Learnings - span 4), Section 7 (Actions & Recommendations - span 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* SECTION 5: Source & Origin (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">5. Source & Origin</span>
                  <button
                    onClick={() => alert("Editing Source & Origin...")}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Source Type</label>
                    <select className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800">
                      <option value="Project">Project</option>
                      <option value="Lessons Learned">Lessons Learned</option>
                      <option value="Quality Improvement">Quality Improvement</option>
                      <option value="NCR / CAPA">NCR / CAPA</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Source Record</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.sourceRecord}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Project</label>
                    <input
                      type="text"
                      readOnly
                      value="Autonomous EVSE Pilot"
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Discovery Date</label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        readOnly
                        value="15-Jun-2026"
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700"
                      />
                      <Calendar className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: Root Cause & Learnings (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">6. Root Cause & Learnings</span>
                  <button
                    onClick={() => alert("Editing Root Cause and learnings...")}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-700">Root Cause: </span>
                  <p className="text-xs text-slate-600 mt-0.5">{formData.rootCause}</p>
                </div>

                {/* Two side-by-side boxes: What Went Well (Green) vs What Failed (Red) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Left: What Went Well? */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-2.5">
                    <span className="text-xs font-bold text-emerald-800">What Went Well?</span>
                    <ul className="mt-1.5 space-y-1 text-[11px] text-emerald-900 list-disc list-inside">
                      {formData.whatWentWell.map((w, idx) => (
                        <li key={idx} className="leading-tight">{w}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: What Failed? */}
                  <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-2.5">
                    <span className="text-xs font-bold text-rose-800">What Failed?</span>
                    <ul className="mt-1.5 space-y-1 text-[11px] text-rose-900 list-disc list-inside">
                      {formData.whatFailed.map((f, idx) => (
                        <li key={idx} className="leading-tight">{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* SECTION 7: Actions & Recommendations (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">7. Actions & Recommendations</span>
                  <button
                    onClick={() => alert("Viewing all Actions & Recommendations...")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>

                {/* Sub-tabs: Corrective Action, Preventive Action, Recommendations */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setActiveActionSubTab("corrective")}
                    className={`flex-1 py-1 text-center font-medium rounded-md transition-colors ${
                      activeActionSubTab === "corrective"
                        ? "bg-blue-600 text-white font-semibold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Corrective Action
                  </button>
                  <button
                    onClick={() => setActiveActionSubTab("preventive")}
                    className={`flex-1 py-1 text-center font-medium rounded-md transition-colors ${
                      activeActionSubTab === "preventive"
                        ? "bg-blue-600 text-white font-semibold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Preventive Action
                  </button>
                  <button
                    onClick={() => setActiveActionSubTab("recommendations")}
                    className={`flex-1 py-1 text-center font-medium rounded-md transition-colors ${
                      activeActionSubTab === "recommendations"
                        ? "bg-blue-600 text-white font-semibold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Recommendations
                  </button>
                </div>

                {/* Actions Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="py-1 w-6">#</th>
                        <th className="py-1">Action Description</th>
                        <th className="py-1">Owner</th>
                        <th className="py-1">Due Date</th>
                        <th className="py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {actionsList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-1 text-slate-500">{item.id}</td>
                          <td className="py-1 text-slate-800 font-medium">{item.actionDescription}</td>
                          <td className="py-1 text-slate-600">{item.owner}</td>
                          <td className="py-1 text-slate-500 font-mono text-[11px]">{item.dueDate}</td>
                          <td className="py-1">
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 w-fit ${
                                item.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : item.status === "In Progress"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  item.status === "Completed"
                                    ? "bg-emerald-500"
                                    : item.status === "In Progress"
                                    ? "bg-amber-500"
                                    : "bg-slate-400"
                                }`}
                              ></span>
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

            {/* Bottom Grid: Section 8 (Related Documents - span 4), Section 9 (Implementation & Reuse - span 4), Right Column (Section 10 Review Stepper + Section 11 AI Insights - span 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* SECTION 8: Related Documents (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">8. Related Documents</span>
                  <button
                    onClick={() => setShowLinkDocModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Link Document</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="py-1">Document Name</th>
                        <th className="py-1">Type</th>
                        <th className="py-1">Version</th>
                        <th className="py-1">Linked On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {relatedDocs.map((doc, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-1 text-slate-800 font-medium">{doc.name}</td>
                          <td className="py-1 text-slate-600">{doc.type}</td>
                          <td className="py-1 text-slate-600 font-mono text-[11px]">{doc.version}</td>
                          <td className="py-1 text-slate-500 text-[11px]">{doc.linkedOn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 9: Implementation & Reuse (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">9. Implementation & Reuse</span>
                  <button
                    onClick={() => alert("Viewing complete reuse metrics & audit logs...")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details
                  </button>
                </div>

                {/* 3 Quick Highlight Badges */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center">
                    <FolderKanban className="h-4 w-4 text-emerald-600 mx-auto" />
                    <div className="text-xs font-bold text-slate-900 mt-1">12</div>
                    <div className="text-[10px] text-slate-500">Projects Implemented</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-2 text-center">
                    <Users className="h-4 w-4 text-purple-600 mx-auto" />
                    <div className="text-xs font-bold text-slate-900 mt-1">420</div>
                    <div className="text-[10px] text-slate-500">Total Reuse Count</div>
                  </div>
                  <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-2 text-center">
                    <BarChart3 className="h-4 w-4 text-cyan-600 mx-auto" />
                    <div className="text-xs font-bold text-slate-900 mt-1">96%</div>
                    <div className="text-[10px] text-slate-500">Success Rate</div>
                  </div>
                </div>

                {/* Recently Implemented in List */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-1.5">
                    <span>Recently Implemented In</span>
                    <button onClick={() => alert("Viewing all projects...")} className="text-blue-600 hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded border border-slate-100">
                      <span className="font-mono text-slate-500 text-[11px]">PRJ-2026-008</span>
                      <span className="text-slate-800 font-medium">Chennai Airport EV Station</span>
                      <span className="text-slate-400 text-[11px]">20-Aug-2026</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded border border-slate-100">
                      <span className="font-mono text-slate-500 text-[11px]">PRJ-2026-011</span>
                      <span className="text-slate-800 font-medium">Bengaluru Fleet Depot</span>
                      <span className="text-slate-400 text-[11px]">12-Aug-2026</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded border border-slate-100">
                      <span className="font-mono text-slate-500 text-[11px]">PRJ-2026-013</span>
                      <span className="text-slate-800 font-medium">Hyderabad Commercial Hub</span>
                      <span className="text-slate-400 text-[11px]">05-Aug-2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT STACK: Section 10 Review Stepper + Section 11 AI Insights (Col span 4) */}
              <div className="lg:col-span-4 space-y-4">
                {/* SECTION 10: Review & Approval Stepper */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm font-bold text-slate-900">10. Review & Approval</span>
                    <button
                      onClick={() => alert("Opening full review workflow matrix...")}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Workflow
                    </button>
                  </div>

                  {/* Horizontal 5-Step Stepper */}
                  <div className="flex items-center justify-between relative px-2 py-1">
                    {/* Step 1: Draft */}
                    <div className="flex flex-col items-center text-center">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-800 mt-1">Draft</span>
                      <span className="text-[9px] text-slate-400">01-Aug-2026</span>
                    </div>

                    <div className="flex-1 h-0.5 bg-emerald-200 mx-1 mb-5"></div>

                    {/* Step 2: Review */}
                    <div className="flex flex-col items-center text-center">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-800 mt-1">Review</span>
                      <span className="text-[9px] text-slate-400">10-Aug-2026</span>
                    </div>

                    <div className="flex-1 h-0.5 bg-emerald-200 mx-1 mb-5"></div>

                    {/* Step 3: Approval */}
                    <div className="flex flex-col items-center text-center">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-800 mt-1">Approval</span>
                      <span className="text-[9px] text-slate-400">18-Aug-2026</span>
                    </div>

                    <div className="flex-1 h-0.5 bg-blue-200 mx-1 mb-5"></div>

                    {/* Step 4: Published (Active) */}
                    <div className="flex flex-col items-center text-center">
                      <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 mt-1">Published</span>
                      <span className="text-[9px] text-blue-500 font-medium">01-Aug-2026</span>
                    </div>

                    <div className="flex-1 h-0.5 bg-slate-200 mx-1 mb-5"></div>

                    {/* Step 5: Next Review */}
                    <div className="flex flex-col items-center text-center">
                      <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 mt-1">Next Review</span>
                      <span className="text-[9px] text-slate-400">01-Aug-2027</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 11: AI Insights [Beta] */}
                <div className="bg-white rounded-xl border border-purple-200 shadow-sm p-4 space-y-2.5 bg-gradient-to-br from-white to-purple-50/20">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900">11. AI Insights</span>
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">
                        Beta
                      </span>
                    </div>
                    <button
                      onClick={() => alert("Loading advanced AI analysis...")}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View Insights ▾
                    </button>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {BEST_PRACTICE_AI_INSIGHTS.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRACTICE REGISTER TAB CONTENT */}
        {activeTab === "practice-register" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Best Practices Register</h3>
                <p className="text-xs text-slate-500">Comprehensive inventory of validated organizational practices.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search practices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white text-slate-700"
                >
                  <option value="All">All Categories</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Quality">Quality</option>
                </select>
                <button
                  onClick={() => alert("Exporting register...")}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/75">
                    <th className="py-2 px-3">Practice ID</th>
                    <th className="py-2 px-3">Practice Code</th>
                    <th className="py-2 px-3">Title</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Department</th>
                    <th className="py-2 px-3">Owner</th>
                    <th className="py-2 px-3">Version</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPractices.map((prac) => (
                    <tr key={prac.bestPracticeId} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-semibold text-blue-600">{prac.bestPracticeId}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">{prac.practiceCode}</td>
                      <td className="py-2 px-3 font-medium text-slate-900 max-w-xs truncate">{prac.practiceTitle}</td>
                      <td className="py-2 px-3 text-slate-600">{prac.practiceType}</td>
                      <td className="py-2 px-3 text-slate-600">{prac.knowledgeCategory}</td>
                      <td className="py-2 px-3 text-slate-600">{prac.department}</td>
                      <td className="py-2 px-3 text-slate-700">{prac.practiceOwner}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">{prac.version}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            prac.status === "Published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {prac.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => {
                            setFormData(prac);
                            setActiveTab("overview");
                          }}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EVIDENCE & VALIDATION TAB CONTENT */}
        {activeTab === "evidence-validation" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Empirical Evidence & Validation Matrix
            </h3>
            <p className="text-xs text-slate-600">
              Statistical baseline measurements vs post-implementation results across trial deployments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="text-xs font-bold text-slate-800">Key Performance Metric Improvements</span>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Docking Time (s)", before: 120, after: 28 },
                        { name: "Success Rate (%)", before: 78, after: 96 },
                        { name: "Intervention (%)", before: 35, after: 5 },
                        { name: "Maint. Calls (/mo)", before: 12, after: 3 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="before" fill="#94a3b8" name="Before" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="after" fill="#2563eb" name="After (With Best Practice)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 space-y-3 text-xs text-slate-700">
                <span className="text-xs font-bold text-slate-800">Validation Sign-Off Checklist</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-800 font-medium">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Trial sample size n=1,200 autonomous dockings validated with 99.2% statistical confidence.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-800 font-medium">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>EHS & Functional Safety certified compliant with ISO 15118 and IEC 61851 standards.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-800 font-medium">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Cross-functional manufacturing and plant engineering acceptance approved without exceptions.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER TABS FALLBACK */}
        {(activeTab === "create-edit" ||
          activeTab === "review-approval" ||
          activeTab === "implementation" ||
          activeTab === "knowledge-reuse" ||
          activeTab === "analytics" ||
          activeTab === "settings") && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center space-y-3">
            <Award className="h-10 w-10 text-blue-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 capitalize">
              {activeTab.replace("-", " ")} Workspace
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Interactive configuration and governance module for Best Practices under Knowledge.
            </p>
            <button
              onClick={() => setActiveTab("overview")}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors"
            >
              Return to Best Practice Overview
            </button>
          </div>
        )}

        {/* MODAL: New Best Practice */}
        {showNewPracticeModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span>Create New Best Practice</span>
                </h3>
                <button
                  onClick={() => setShowNewPracticeModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Practice Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Closed-Loop Robotic Solder Inspection"
                    value={newPracticeTitle}
                    onChange={(e) => setNewPracticeTitle(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">Practice Type</label>
                    <select
                      value={newPracticeType}
                      onChange={(e) => setNewPracticeType(e.target.value as any)}
                      className="mt-1 w-full border border-slate-200 rounded-md p-1.5 text-xs"
                    >
                      <option value="Process">Process</option>
                      <option value="Technical">Technical</option>
                      <option value="Quality">Quality</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Category</label>
                    <select
                      value={newPracticeCategory}
                      onChange={(e) => setNewPracticeCategory(e.target.value as any)}
                      className="mt-1 w-full border border-slate-200 rounded-md p-1.5 text-xs"
                    >
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Quality">Quality</option>
                      <option value="Supply Chain">Supply Chain</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Responsible Department</label>
                  <select
                    value={newPracticeDept}
                    onChange={(e) => setNewPracticeDept(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-md p-1.5 text-xs"
                  >
                    <option value="R&D">R&D</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Quality">Quality</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowNewPracticeModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewPractice}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm"
                >
                  Create Practice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Link Document */}
        {showLinkDocModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-4 space-y-3 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900">Link Supporting Document</h4>
                <button onClick={() => setShowLinkDocModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Document Name</label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="e.g., High-Voltage Safety Manual"
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Document Type</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  >
                    <option value="SOP">SOP</option>
                    <option value="Work Instruction">Work Instruction</option>
                    <option value="Report">Report</option>
                    <option value="Drawing">Drawing</option>
                    <option value="Checklist">Checklist</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowLinkDocModal(false)}
                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLinkDoc}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                >
                  Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
