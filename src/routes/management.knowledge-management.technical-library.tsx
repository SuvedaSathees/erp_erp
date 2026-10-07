// Magnertia ERP - Technical Library Module
// Management -> Knowledge Management -> Technical Library
// Technical Specifications, Engineering Parameters, CAD/STEP Drawings, Simulation & Standards References

import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTechnicalLibraryRecordFn } from "@/lib/technicalLibraryFns.server";
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
  Cpu,
  BookOpen,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  FolderOpen,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { KnowledgeTabBar } from "@/components/erp/KnowledgeManagementTabBar";
import { KnowledgeSubmoduleHeader } from "@/components/erp/KnowledgeSubmoduleHeader";
import {
  PRIMARY_TECHNICAL_RECORD,
  TECHNICAL_LIBRARY_KPIS,
  TECHNICAL_PARAMETERS_DATA,
  TECHNICAL_DOCUMENTS_FILES,
  TECHNICAL_LIBRARY_AI_INSIGHTS,
  TECHNICAL_USAGE_METRICS,
  type TechnicalLibraryRecord,
  type TechnicalParameterItem,
  type TechnicalDocumentFileItem,
} from "@/services/technicalLibraryService";

export const Route = createFileRoute("/management/knowledge-management/technical-library")({
  head: () => ({
    meta: [
      { title: "Technical Library · Knowledge · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled technical specifications, engineering references, simulation reports, and component datasheets.",
      },
    ],
  }),
  component: TechnicalLibraryPage,
});

function TechnicalLibraryPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "library-register"
    | "create-edit"
    | "classification"
    | "technical-content"
    | "references-drawings"
    | "review-approval"
    | "analytics"
    | "settings"
  >("overview");

  // Form State
  const { data: dbRecord } = useQuery({
    queryKey: ["technical-library", "record"],
    queryFn: () => getTechnicalLibraryRecordFn({ data: {} }),
  });

  const [formData, setFormData] = useState<TechnicalLibraryRecord>(PRIMARY_TECHNICAL_RECORD);
  useEffect(() => { if (dbRecord?.data) setFormData(dbRecord.data); }, [dbRecord]);
  const [kpis, setKpis] = useState(TECHNICAL_LIBRARY_KPIS);
  const [parameters, setParameters] = useState<TechnicalParameterItem[]>(TECHNICAL_PARAMETERS_DATA);
  const [files, setFiles] = useState<TechnicalDocumentFileItem[]>(TECHNICAL_DOCUMENTS_FILES);
  const [keywords, setKeywords] = useState<string[]>(PRIMARY_TECHNICAL_RECORD.keywords);
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [showAddKeyword, setShowAddKeyword] = useState(false);

  // Notifications
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Modals
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocType, setNewDocType] = useState<TechnicalLibraryRecord["technicalType"]>("Design Guide");
  const [newDocDept, setNewDocDept] = useState("R&D");

  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<TechnicalDocumentFileItem["type"]>("PDF");

  const [showAddParamModal, setShowAddParamModal] = useState(false);
  const [newParamName, setNewParamName] = useState("");
  const [newParamVal, setNewParamVal] = useState("");
  const [newParamUnit, setNewParamUnit] = useState("");
  const [newParamTol, setNewParamTol] = useState("±5%");

  const [showMoreActions, setShowMoreActions] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Handlers
  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSubmitReview = () => {
    setFormData((prev) => ({ ...prev, status: "Review" }));
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleCreateDocument = () => {
    if (!newDocTitle.trim()) return;
    const newId = `TL-2026-00${kpis.totalDocuments + 1}`;
    const newRef = `EV-WPT-DS-0${kpis.totalDocuments + 2}`;

    setFormData((prev) => ({
      ...prev,
      technicalKnowledgeId: newId,
      technicalRefNo: newRef,
      technicalTitle: newDocTitle,
      technicalType: newDocType,
      department: newDocDept,
      status: "Draft",
      version: "v1.0",
    }));

    setKpis((prev) => ({
      ...prev,
      totalDocuments: prev.totalDocuments + 1,
    }));

    setShowNewDocModal(false);
    setNewDocTitle("");
    setActiveTab("overview");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    setFiles((prev) => [
      ...prev,
      {
        fileName: newFileName,
        type: newFileType,
        size: "3.2 MB",
        version: "v1.0",
        uploadedOn: "27-Sep-2026",
      },
    ]);
    setNewFileName("");
    setShowAddFileModal(false);
  };

  const handleAddParam = () => {
    if (!newParamName.trim()) return;
    setParameters((prev) => [
      ...prev,
      {
        parameter: newParamName,
        value: newParamVal || "-",
        unit: newParamUnit || "-",
        min: "-",
        nominal: newParamVal || "-",
        max: "-",
        tolerance: newParamTol,
      },
    ]);
    setNewParamName("");
    setNewParamVal("");
    setNewParamUnit("");
    setShowAddParamModal(false);
  };

  const handleAddKeyword = () => {
    if (newKeywordInput.trim() && !keywords.includes(newKeywordInput.trim())) {
      setKeywords((prev) => [...prev, newKeywordInput.trim()]);
      setNewKeywordInput("");
      setShowAddKeyword(false);
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kwToRemove));
  };

  return (
    <AppShell
      breadcrumb="Management > Knowledge > Technical Library"
      title="Technical Library"
      description="Hardware schematics, CAD models, wiring diagrams, register maps, and engineering design specifications."
      tabs={<KnowledgeTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Save & Submit Alerts */}
        {saveSuccess && (
          <div className="bg-blue-600 text-white px-6 py-2.5 flex items-center justify-between shadow-md rounded-md animate-fade-in text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200" />
              <span>Technical Library record saved and parameters verified against engineering baseline.</span>
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
              <span>Specification submitted to Technical Review Board and SME sign-off queue.</span>
            </div>
            <button onClick={() => setSubmitSuccess(false)} className="text-emerald-200 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP EXECUTIVE COMMAND HEADER */}
        <KnowledgeSubmoduleHeader
          icon={Cpu}
          title="Technical Library"
          code="TECH-2026-001"
          version="v1.0"
          status="Active"
          subtitle="Engineering Specifications. CAD & Schematics. Product Vault."
          onSave={handleSave}
          onSubmit={handleSubmitReview}
          onGenerateReport={() => setActiveTab("analytics")}
          moreActions={[
            {
              label: activeTab === "library-register" ? "View Controlled Form" : "View Library Register",
              icon: FileText,
              onClick: () => setActiveTab(activeTab === "library-register" ? "overview" : "library-register"),
            },
          ]}
        />

        {/* 6 Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total Documents */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.totalDocuments}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Documents</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.totalDocumentsChange}%</span>
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

          {/* 4. Obsolete */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.obsolete}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Obsolete</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(kpis.obsoleteChange)}%</span>
            </div>
          </div>

          {/* 5. Standards */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-600 text-white">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.standards}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Standards</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.standardsChange}%</span>
            </div>
          </div>

          {/* 6. Component Datasheets */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.componentDatasheets}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Component Datasheets</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.componentDatasheetsChange}%</span>
            </div>
          </div>
        </div>

        {/* OVERVIEW CONTENT (Sections 1-10 matching Image 6) */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Row 1: Section 1 Header (span 6), Section 2 Preview (span 3), Right Column: Sec 3 Classification & Sec 4 Related Info (span 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* SECTION 1: Technical Library Header (Col span 6) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">1. Technical Library Header</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold rounded-full flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>{formData.status}</span>
                  </span>
                </div>

                {/* Row 1: ID, Ref No, Title */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-600">Technical Knowledge ID</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.technicalKnowledgeId}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 font-mono"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Technical Reference No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.technicalRefNo}
                      onChange={(e) => setFormData({ ...formData, technicalRefNo: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 font-mono"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Technical Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.technicalTitle}
                      onChange={(e) => setFormData({ ...formData, technicalTitle: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Row 2: Type, Category, Module, Submodule */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Technical Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.technicalType}
                      onChange={(e) => setFormData({ ...formData, technicalType: e.target.value as any })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Design Guide">Design Guide</option>
                      <option value="Specification">Specification</option>
                      <option value="Datasheet">Datasheet</option>
                      <option value="Application Note">Application Note</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">
                      Technical Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.technicalCategory}
                      onChange={(e) => setFormData({ ...formData, technicalCategory: e.target.value as any })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Wireless Charging">Wireless Charging</option>
                      <option value="Power Electronics">Power Electronics</option>
                      <option value="Embedded Systems">Embedded Systems</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Module</label>
                    <select
                      value={formData.module}
                      onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Product Development">Product Development</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Quality">Quality</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Submodule</label>
                    <select
                      value={formData.submodule}
                      onChange={(e) => setFormData({ ...formData, submodule: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="EV Charging System">EV Charging System</option>
                      <option value="Power Train">Power Train</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Description */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 w-full bg-white border border-slate-200 rounded-md p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Row 4: Dept, Process, Technical Owner, SME */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
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
                      <option value="Engineering">Engineering</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Process</label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Technology Development">Technology Development</option>
                      <option value="Hardware Architecture">Hardware Architecture</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Technical Owner</label>
                    <div className="mt-1 flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                      <div className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        RS
                      </div>
                      <span className="text-xs text-slate-800">{formData.technicalOwner}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Subject Matter Expert</label>
                    <div className="mt-1 flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
                      <div className="h-5 w-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                        PS
                      </div>
                      <span className="text-xs text-slate-800">{formData.subjectMatterExpert}</span>
                    </div>
                  </div>
                </div>

                {/* Row 5: Organization, Branch/Site, Version, Status */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Organization</label>
                    <select
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Magnertia Private Limited">Magnertia Private Limited</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Branch / Site</label>
                    <select
                      value={formData.branchSite}
                      onChange={(e) => setFormData({ ...formData, branchSite: e.target.value })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Coimbatore - Dev Centre">Coimbatore - Dev Centre</option>
                      <option value="Plant 1 - Chennai">Plant 1 - Chennai</option>
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
                      <option value="Draft">Draft</option>
                      <option value="Obsolete">Obsolete</option>
                    </select>
                  </div>
                </div>

                {/* Row 6: Confidentiality, Effective Date, Review Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Confidentiality</label>
                    <select
                      value={formData.confidentiality}
                      onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value as any })}
                      className="mt-1 w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800"
                    >
                      <option value="Internal">Internal</option>
                      <option value="Public">Public</option>
                      <option value="Confidential">Confidential</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Effective Date</label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800"
                      />
                      <Calendar className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1.5" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Review Date</label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        value={formData.reviewDate}
                        onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800"
                      />
                      <Calendar className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Document Preview (Col span 3) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">2. Document Preview</span>
                    <button
                      onClick={() => alert("Opening full specification in high-resolution PDF viewer...")}
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Open in New Tab</span>
                    </button>
                  </div>

                  {/* Viewer Controls */}
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1 font-mono">
                      <span>1</span>
                      <span>/</span>
                      <span>42</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                        className="p-0.5 hover:bg-slate-100 rounded"
                      >
                        <ZoomOut className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-[10px] font-mono">{zoomLevel}%</span>
                      <button
                        onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                        className="p-0.5 hover:bg-slate-100 rounded"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => alert("Toggling fullscreen")}
                        className="p-0.5 hover:bg-slate-100 rounded"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Document Cover Sheet */}
                  <div className="mt-2.5 p-3 rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white text-center space-y-2">
                    <div className="font-extrabold text-blue-700 tracking-wider text-xs">MAGNERTIA</div>
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">
                      Wireless Power Transfer (WPT) System Design Guide
                    </div>
                    <div className="text-[9px] text-slate-500">For Electric Vehicle Charging Applications</div>
                    <div className="text-[9px] text-slate-400 font-mono">Version 2.1 | August 2026</div>

                    {/* Electric car preview illustration block */}
                    <div className="relative h-28 bg-gradient-to-b from-slate-100 via-blue-50/50 to-slate-100 rounded flex flex-col items-center justify-center overflow-hidden border border-slate-200/60 p-2">
                      <div className="h-10 w-24 bg-slate-300 rounded-t-xl mx-auto opacity-70 flex items-center justify-center text-[10px] text-slate-600 font-semibold shadow-inner">
                        EV Car
                      </div>
                      <div className="h-2 w-16 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
                      <div className="text-[8px] text-blue-600 font-mono mt-0.5">85 kHz Resonance Flux</div>
                      <div className="h-3 w-28 bg-slate-700 rounded-md mt-1 flex items-center justify-center text-[8px] text-white">
                        Ground Pad (Tx)
                      </div>
                    </div>

                    {/* Core value pills */}
                    <div className="grid grid-cols-5 gap-1 pt-1 text-[8px] text-slate-600 font-medium">
                      <span className="p-1 bg-slate-100 rounded">Efficient</span>
                      <span className="p-1 bg-slate-100 rounded">Safe</span>
                      <span className="p-1 bg-slate-100 rounded">Autonomous</span>
                      <span className="p-1 bg-slate-100 rounded">Scalable</span>
                      <span className="p-1 bg-slate-100 rounded">Sustainable</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT STACK: Section 3 Classification & Section 4 Related Info (Col span 3) */}
              <div className="lg:col-span-3 space-y-4">
                {/* SECTION 3: Classification & Metadata */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-bold text-slate-900 text-xs">3. Classification & Metadata</span>
                    <button
                      onClick={() => alert("Editing Classification")}
                      className="text-blue-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Knowledge Domain</label>
                    <select
                      value={formData.knowledgeDomain}
                      onChange={(e) => setFormData({ ...formData, knowledgeDomain: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="Electrical & Electronics">Electrical & Electronics</option>
                      <option value="Mechanical & Thermal">Mechanical & Thermal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Technology Area</label>
                    <select
                      value={formData.technologyArea}
                      onChange={(e) => setFormData({ ...formData, technologyArea: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="Wireless Power Transfer (WPT)">Wireless Power Transfer (WPT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Engineering Discipline</label>
                    <div className="mt-1 flex items-center gap-1 flex-wrap">
                      {formData.engineeringDisciplines.map((d, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded border border-blue-200">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Keywords</label>
                    <div className="mt-1 flex items-center gap-1 flex-wrap">
                      {keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded flex items-center gap-1 border border-slate-200"
                        >
                          <span>{kw}</span>
                          <button onClick={() => handleRemoveKeyword(kw)} className="text-slate-400 hover:text-slate-600">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                      {showAddKeyword ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={newKeywordInput}
                            onChange={(e) => setNewKeywordInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddKeyword();
                              if (e.key === "Escape") setShowAddKeyword(false);
                            }}
                            placeholder="keyword..."
                            className="px-1 py-0.5 text-[10px] border border-blue-400 rounded w-16"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAddKeyword(true)}
                          className="px-1.5 py-0.5 text-[10px] text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Related Information */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-bold text-slate-900 text-xs">4. Related Information</span>
                    <button
                      onClick={() => alert("Linking related system components...")}
                      className="text-blue-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>Link</span>
                    </button>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Related Product:</span>
                      <span className="font-semibold text-slate-800">{formData.relatedProduct}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Related Project:</span>
                      <span className="font-semibold text-slate-800 font-mono text-[10px]">{formData.relatedProject}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Related Component:</span>
                      <span className="font-semibold text-slate-800">{formData.relatedComponent}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Related Standard:</span>
                      <span className="font-semibold text-blue-600">{formData.relatedStandard}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Related Best Practice:</span>
                      <span className="font-semibold text-slate-800">{formData.relatedBestPractice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Related Lesson Learned:</span>
                      <span className="font-semibold text-slate-800">{formData.relatedLessonLearned}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Section 5 Technical Parameters (span 5), Section 6 Documents & Files (span 4), Section 7 Review Stepper (span 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* SECTION 5: Technical Parameters (Col span 5) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">5. Technical Parameters</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddParamModal(true)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => alert("Editing parameter tolerance envelope...")}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="py-1">Parameter</th>
                        <th className="py-1">Value</th>
                        <th className="py-1">Unit</th>
                        <th className="py-1">Min</th>
                        <th className="py-1">Nominal</th>
                        <th className="py-1">Max</th>
                        <th className="py-1 text-right">Tolerance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {parameters.map((param, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-1 text-slate-800 font-medium">{param.parameter}</td>
                          <td className="py-1 font-semibold text-slate-900">{param.value}</td>
                          <td className="py-1 text-slate-500">{param.unit}</td>
                          <td className="py-1 text-slate-600">{param.min}</td>
                          <td className="py-1 text-slate-600">{param.nominal}</td>
                          <td className="py-1 text-slate-600">{param.max}</td>
                          <td className="py-1 text-right font-mono text-slate-600 text-[11px]">{param.tolerance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 6: Documents & Files (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">6. Documents & Files</span>
                  <button
                    onClick={() => setShowAddFileModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add File</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                        <th className="py-1">File Name</th>
                        <th className="py-1">Type</th>
                        <th className="py-1">Size</th>
                        <th className="py-1">Version</th>
                        <th className="py-1">Uploaded On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {files.map((file, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-1 font-medium text-slate-800 max-w-[130px] truncate" title={file.fileName}>
                            {file.fileName}
                          </td>
                          <td className="py-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                file.type === "PDF"
                                  ? "bg-rose-50 text-rose-700"
                                  : file.type === "STEP"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {file.type}
                            </span>
                          </td>
                          <td className="py-1 text-slate-500 text-[11px]">{file.size}</td>
                          <td className="py-1 font-mono text-[11px] text-slate-600">{file.version}</td>
                          <td className="py-1 text-slate-400 text-[11px]">{file.uploadedOn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 7: Review & Approval (Col span 3) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">7. Review & Approval</span>
                  <button
                    onClick={() => alert("Viewing complete engineering sign-off workflow...")}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Workflow
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Draft</div>
                      <div className="text-[10px] text-slate-400">10-Jul-2026</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Technical Review</div>
                      <div className="text-[10px] text-slate-400">20-Jul-2026</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Quality Review</div>
                      <div className="text-[10px] text-slate-400">25-Jul-2026</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-700">Approved</div>
                      <div className="text-[10px] text-blue-500 font-medium">01-Aug-2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Section 8 Usage & Reuse (span 4), Section 9 Applicability (span 4), Section 10 AI Insights (span 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* SECTION 8: Usage & Reuse (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <span className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 block">
                  8. Usage & Reuse
                </span>
                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                    <Eye className="h-4 w-4 text-blue-600 mx-auto" />
                    <div className="text-xs font-bold text-slate-900 mt-1">{TECHNICAL_USAGE_METRICS.totalViews}</div>
                    <div className="text-[10px] text-slate-500">Total Views</div>
                    <div className="text-[9px] text-emerald-600 font-semibold">↑{TECHNICAL_USAGE_METRICS.totalViewsChange}%</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                    <Download className="h-4 w-4 text-emerald-600 mx-auto" />
                    <div className="text-xs font-bold text-slate-900 mt-1">{TECHNICAL_USAGE_METRICS.downloads}</div>
                    <div className="text-[10px] text-slate-500">Downloads</div>
                    <div className="text-[9px] text-emerald-600 font-semibold">↑{TECHNICAL_USAGE_METRICS.downloadsChange}%</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                    <Users className="h-4 w-4 text-purple-600 mx-auto" />
                    <div className="text-xs font-bold text-slate-900 mt-1">{TECHNICAL_USAGE_METRICS.timesReused}</div>
                    <div className="text-[10px] text-slate-500">Times Reused</div>
                    <div className="text-[9px] text-emerald-600 font-semibold">↑{TECHNICAL_USAGE_METRICS.timesReusedChange}%</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                    <FolderKanban className="h-4 w-4 text-cyan-600 mx-auto" />
                    <div className="text-xs font-bold text-slate-900 mt-1">{TECHNICAL_USAGE_METRICS.projectsUsed}</div>
                    <div className="text-[10px] text-slate-500">Projects Used</div>
                    <div className="text-[9px] text-emerald-600 font-semibold">↑{TECHNICAL_USAGE_METRICS.projectsUsedChange}%</div>
                  </div>
                </div>
              </div>

              {/* SECTION 9: Applicability (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-900">9. Applicability</span>
                  <button
                    onClick={() => alert("Editing Applicability")}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-600">Applicable Project Types: </span>
                  <div className="mt-1 flex items-center gap-1 flex-wrap">
                    {formData.applicableProjectTypes.map((t, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-600">Applicable Products: </span>
                  <div className="mt-1 flex items-center gap-1 flex-wrap">
                    {formData.applicableProducts.map((p, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded border border-slate-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-600">Applicability Criteria: </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">{formData.applicabilityCriteria}</p>
                </div>
              </div>

              {/* SECTION 10: AI Insights (Col span 4) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-purple-200 shadow-sm p-4 space-y-2.5 bg-gradient-to-br from-white to-purple-50/20">
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">10. AI Insights</span>
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">Beta</span>
                  </div>
                  <button
                    onClick={() => alert("Running deep semantic scan for technical citations...")}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View Insights
                  </button>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {TECHNICAL_LIBRARY_AI_INSIGHTS.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-1 leading-snug">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: New Technical Document */}
        {showNewDocModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-600" />
                  <span>Create Technical Document</span>
                </h3>
                <button onClick={() => setShowNewDocModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Technical Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Inverter Topology Specification"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">Type</label>
                    <select
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value as any)}
                      className="mt-1 w-full border border-slate-200 rounded-md p-1.5 text-xs"
                    >
                      <option value="Design Guide">Design Guide</option>
                      <option value="Specification">Specification</option>
                      <option value="Datasheet">Datasheet</option>
                      <option value="Application Note">Application Note</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Department</label>
                    <select
                      value={newDocDept}
                      onChange={(e) => setNewDocDept(e.target.value)}
                      className="mt-1 w-full border border-slate-200 rounded-md p-1.5 text-xs"
                    >
                      <option value="R&D">R&D</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowNewDocModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDocument}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm"
                >
                  Create Document
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add Parameter */}
        {showAddParamModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-4 space-y-3 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900">Add Technical Parameter</h4>
                <button onClick={() => setShowAddParamModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Parameter Name *</label>
                  <input
                    type="text"
                    value={newParamName}
                    onChange={(e) => setNewParamName(e.target.value)}
                    placeholder="e.g. Max Resonant Current"
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700">Value</label>
                    <input
                      type="text"
                      value={newParamVal}
                      onChange={(e) => setNewParamVal(e.target.value)}
                      placeholder="e.g. 35"
                      className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Unit</label>
                    <input
                      type="text"
                      value={newParamUnit}
                      onChange={(e) => setNewParamUnit(e.target.value)}
                      placeholder="e.g. Arms"
                      className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowAddParamModal(false)}
                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddParam}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                >
                  Add Parameter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add File */}
        {showAddFileModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-4 space-y-3 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900">Upload Engineering File</h4>
                <button onClick={() => setShowAddFileModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">File Name *</label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g. Inverter_3D_Model.step"
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">File Type</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  >
                    <option value="PDF">PDF</option>
                    <option value="XLSX">XLSX (Calculations)</option>
                    <option value="STEP">STEP (CAD Model)</option>
                    <option value="DOCX">DOCX</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowAddFileModal(false)}
                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFile}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
