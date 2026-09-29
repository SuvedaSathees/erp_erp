// Magnertia ERP - Training Materials Module
// Management -> Knowledge Management -> Training Materials
// Learning Content, Course Modules, Assessments, Quizzes, Competency & Learner Analytics

import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTrainingMaterialsRecordFn } from "@/lib/trainingMaterialsFns.server";
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
  GraduationCap,
  BookOpen,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Image as ImageIcon,
  CheckSquare,
  HelpCircle,
  Star,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { KnowledgeTabBar } from "@/components/erp/KnowledgeManagementTabBar";
import { KnowledgeSubmoduleHeader } from "@/components/erp/KnowledgeSubmoduleHeader";
import {
  PRIMARY_TRAINING_RECORD,
  TRAINING_KPIS,
  TRAINING_LEARNING_OBJECTIVES,
  TRAINING_MATERIALS_FILES,
  TARGET_AUDIENCE_DATA,
  TRAINING_ANALYTICS_METRICS,
  type TrainingMaterialRecord,
  type LearningObjectiveItem,
  type TrainingFileItem,
  type TargetAudienceItem,
} from "@/services/trainingMaterialsService";

export const Route = createFileRoute("/management/knowledge-management/training-materials")({
  head: () => ({
    meta: [
      { title: "Training Materials · Knowledge · Magnertia ERP" },
      {
        name: "description",
        content:
          "Create, deliver, learn, and build competence with controlled curriculum, assessments, and learning modules.",
      },
    ],
  }),
  component: TrainingMaterialsManagementPage,
});

function TrainingMaterialsManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "training-register"
    | "create-edit"
    | "modules-content"
    | "assessment"
    | "review-approval"
    | "deployment"
    | "analytics"
    | "settings"
  >("create-edit");

  // Form State
  const { data: dbRecord } = useQuery({
    queryKey: ["training-materials", "record"],
    queryFn: () => getTrainingMaterialsRecordFn({ data: {} }),
  });

  const [formData, setFormData] = useState<TrainingMaterialRecord>(PRIMARY_TRAINING_RECORD);
  useEffect(() => { if (dbRecord?.data) setFormData(dbRecord.data); }, [dbRecord]);
  const [kpis, setKpis] = useState(TRAINING_KPIS);
  const [objectives, setObjectives] = useState<LearningObjectiveItem[]>(TRAINING_LEARNING_OBJECTIVES);
  const [trainingFiles, setTrainingFiles] = useState<TrainingFileItem[]>(TRAINING_MATERIALS_FILES);
  const [audienceList, setAudienceList] = useState<TargetAudienceItem[]>(TARGET_AUDIENCE_DATA);
  const [contentMode, setContentMode] = useState<"design" | "preview" | "markdown">("preview");

  // Keywords
  const [keywords, setKeywords] = useState<string[]>(PRIMARY_TRAINING_RECORD.keywords);
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [showAddKeyword, setShowAddKeyword] = useState(false);

  // Related knowledge tabs
  const [relatedTab, setRelatedTab] = useState<"wiki" | "sops" | "docs" | "standards">("wiki");

  // Notifications
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Modals
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseType, setNewCourseType] = useState<TrainingMaterialRecord["trainingType"]>("Technical Training");

  const [showAddObjectiveModal, setShowAddObjectiveModal] = useState(false);
  const [newObjText, setNewObjText] = useState("");
  const [newObjType, setNewObjType] = useState<LearningObjectiveItem["type"]>("Knowledge");
  const [newObjAssessment, setNewObjAssessment] = useState<LearningObjectiveItem["assessment"]>("Quiz");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileType, setUploadFileType] = useState<TrainingFileItem["type"]>("PDF");

  const [showAddAudienceModal, setShowAddAudienceModal] = useState(false);
  const [newAudienceType, setNewAudienceType] = useState("Engineers");
  const [newAudienceDept, setNewAudienceDept] = useState("R&D / Design");
  const [newAudienceMandatory, setNewAudienceMandatory] = useState(true);

  const [showMoreActions, setShowMoreActions] = useState(false);

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

  const handleCreateCourse = () => {
    if (!newCourseTitle.trim()) return;
    const newId = `TM-2026-00${kpis.totalMaterials + 1}`;
    const newCode = `TRN-EV-0${kpis.totalMaterials + 2}`;

    setFormData((prev) => ({
      ...prev,
      trainingMaterialId: newId,
      trainingCode: newCode,
      trainingTitle: newCourseTitle,
      trainingType: newCourseType,
      status: "Draft",
      version: "v1.0",
    }));

    setKpis((prev) => ({
      ...prev,
      totalMaterials: prev.totalMaterials + 1,
      draft: prev.draft + 1,
    }));

    setShowNewCourseModal(false);
    setNewCourseTitle("");
    setActiveTab("create-edit");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddObjective = () => {
    if (!newObjText.trim()) return;
    setObjectives((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        learningObjective: newObjText,
        type: newObjType,
        assessment: newObjAssessment,
        status: "Active",
      },
    ]);
    setNewObjText("");
    setShowAddObjectiveModal(false);
  };

  const handleUploadFile = () => {
    if (!uploadFileName.trim()) return;
    setTrainingFiles((prev) => [
      ...prev,
      {
        fileName: uploadFileName,
        type: uploadFileType,
        size: "3.5 MB",
        version: "v1.0",
        uploadedOn: "27-Sep-2026",
      },
    ]);
    setUploadFileName("");
    setShowUploadModal(false);
  };

  const handleAddAudience = () => {
    setAudienceList((prev) => [
      ...prev,
      {
        audienceType: newAudienceType,
        departmentRole: newAudienceDept,
        mandatory: newAudienceMandatory,
        status: "Active",
      },
    ]);
    setShowAddAudienceModal(false);
  };

  const handleAddKeyword = () => {
    if (newKeywordInput.trim() && !keywords.includes(newKeywordInput.trim())) {
      setKeywords((prev) => [...prev, newKeywordInput.trim()]);
      setNewKeywordInput("");
      setShowAddKeyword(false);
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  return (
    <AppShell
      breadcrumb="Management > Knowledge > Training Materials"
      title="Training Materials"
      description="Interactive onboarding modules, equipment operation manuals, compliance training, and skill certifications."
      tabs={<KnowledgeTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Save & Submit Alerts */}
        {saveSuccess && (
          <div className="bg-blue-600 text-white px-6 py-2.5 flex items-center justify-between shadow-md rounded-md animate-fade-in text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200" />
              <span>Training curriculum saved and mapped to HRMS LMS Competency Matrix.</span>
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
              <span>Curriculum submitted for SME Review & Functional Validation before publishing.</span>
            </div>
            <button onClick={() => setSubmitSuccess(false)} className="text-emerald-200 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP EXECUTIVE COMMAND HEADER */}
        <KnowledgeSubmoduleHeader
          icon={GraduationCap}
          title="Training Materials"
          code="TRN-2026-001"
          version="v1.0"
          status="Active"
          subtitle="Workforce Qualification. Curriculums & Tests. Knowledge Assessment."
          onSave={handleSave}
          onSubmit={handleSubmitReview}
          onGenerateReport={() => setActiveTab("analytics")}
          moreActions={[
            {
              label: activeTab === "training-register" ? "View Controlled Form" : "View Training Register",
              icon: FileText,
              onClick: () => setActiveTab(activeTab === "training-register" ? "overview" : "training-register"),
            },
          ]}
        />

        {/* 6 Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total Materials */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.totalMaterials}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Materials</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.totalMaterialsChange}%</span>
            </div>
          </div>

          {/* 2. Published */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <GraduationCap className="h-4 w-4" />
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

          {/* 4. Draft */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <Edit className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.draft}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Draft</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(kpis.draftChange)}%</span>
            </div>
          </div>

          {/* 5. Total Learners */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-600 text-white">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.totalLearners.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Learners</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.totalLearnersChange}%</span>
            </div>
          </div>

          {/* 6. Completion Rate */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <Award className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.completionRate}%</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Completion Rate</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.completionRateChange}%</span>
            </div>
          </div>
        </div>

        {/* ACTIVE CREATE / EDIT CONTENT (Sections 1-10 matching Image 8) */}
        <div className="space-y-4">
          {/* Top Row: Section 1 Header (span 5), Section 2 Content (span 4), Right Column (span 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* SECTION 1: Training Material Header (Col span 5) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">1. Training Material Header</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>{formData.status}</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Training Material ID</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.trainingMaterialId}
                      className="mt-0.5 w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Training Code</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.trainingCode}
                      className="mt-0.5 w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600">
                    Training Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.trainingTitle}
                    onChange={(e) => setFormData({ ...formData, trainingTitle: e.target.value })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Training Type</label>
                    <select
                      value={formData.trainingType}
                      onChange={(e) => setFormData({ ...formData, trainingType: e.target.value as any })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="Technical Training">Technical Training</option>
                      <option value="Product Training">Product Training</option>
                      <option value="Operator Training">Operator Training</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Category</label>
                    <select
                      value={formData.trainingCategory}
                      onChange={(e) => setFormData({ ...formData, trainingCategory: e.target.value as any })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="Product Training">Product Training</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-0.5 w-full border border-slate-200 rounded p-1.5 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="R&D">R&D</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Process</label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="Technology Development">Technology Development</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Training Owner</label>
                    <div className="mt-0.5 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[11px]">
                      <span className="h-4 w-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                        RS
                      </span>
                      <span>{formData.trainingOwner}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Subject Matter Expert</label>
                    <div className="mt-0.5 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[11px]">
                      <span className="h-4 w-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                        PS
                      </span>
                      <span>{formData.subjectMatterExpert}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Version</label>
                    <select
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="v1.0">v1.0</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Effective Date</label>
                    <input
                      type="text"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Review Date</label>
                    <input
                      type="text"
                      value={formData.reviewDate}
                      onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Training Content (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">2. Training Content</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <button className="p-0.5 hover:bg-slate-100 rounded"><Bold className="h-3 w-3" /></button>
                    <button className="p-0.5 hover:bg-slate-100 rounded"><Italic className="h-3 w-3" /></button>
                    <button className="p-0.5 hover:bg-slate-100 rounded"><Underline className="h-3 w-3" /></button>
                    <button className="p-0.5 hover:bg-slate-100 rounded"><ImageIcon className="h-3 w-3" /></button>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <h4 className="font-bold text-slate-900 text-xs">{formData.contentHeading}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {formData.contentBody}
                  </p>

                  {/* Banner illustration */}
                  <div className="mt-2 p-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-lg text-center space-y-1 relative overflow-hidden shadow-sm">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-blue-300">Magnertia Mobility</div>
                    <div className="text-xs font-extrabold text-white">
                      WIRELESS CHARGING A CLEANER TOMORROW
                    </div>
                    <div className="text-[9px] text-slate-300">Inductive Resonance · 11kW Standard</div>
                  </div>
                </div>
              </div>

              {/* Bottom Mode Switch Buttons */}
              <div className="flex items-center gap-1 border-t border-slate-100 pt-2 text-[11px]">
                <button
                  onClick={() => setContentMode("design")}
                  className={`px-3 py-1 rounded font-medium ${contentMode === "design" ? "bg-blue-600 text-white font-semibold" : "bg-slate-100 text-slate-700"}`}
                >
                  Design
                </button>
                <button
                  onClick={() => setContentMode("preview")}
                  className={`px-3 py-1 rounded font-medium ${contentMode === "preview" ? "bg-blue-600 text-white font-semibold" : "bg-slate-100 text-slate-700"}`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setContentMode("markdown")}
                  className={`px-3 py-1 rounded font-medium ${contentMode === "markdown" ? "bg-blue-600 text-white font-semibold" : "bg-slate-100 text-slate-700"}`}
                >
                  Markdown
                </button>
              </div>
            </div>

            {/* Right Column: Section 3 & Section 4 (Col span 3) */}
            <div className="lg:col-span-3 space-y-4">
              {/* SECTION 3: Classification & Tags */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-slate-900 text-xs">3. Classification & Tags</span>
                  <button
                    onClick={() => alert("Editing Classification")}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Knowledge Domain</label>
                  <select
                    value={formData.knowledgeDomain}
                    onChange={(e) => setFormData({ ...formData, knowledgeDomain: e.target.value })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                  >
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Skill Level</label>
                  <select
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as any })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs font-semibold text-blue-700"
                  >
                    <option value="Beginner">● Beginner</option>
                    <option value="Intermediate">● Intermediate</option>
                    <option value="Advanced">● Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Keywords</label>
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
                          placeholder="tag..."
                          className="px-1 py-0.5 text-[10px] border border-blue-400 rounded w-14"
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

              {/* SECTION 4: Related Knowledge */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-slate-900 text-xs">4. Related Knowledge</span>
                  <button
                    onClick={() => alert("Linking related articles, SOPs, and standards...")}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
                  >
                    <LinkIcon className="h-3 w-3" />
                    <span>Link</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[10px]">
                  <button
                    onClick={() => setRelatedTab("wiki")}
                    className={`flex-1 py-0.5 text-center font-medium rounded ${
                      relatedTab === "wiki" ? "bg-blue-600 text-white font-semibold" : "text-slate-600"
                    }`}
                  >
                    Wiki (3)
                  </button>
                  <button
                    onClick={() => setRelatedTab("sops")}
                    className={`flex-1 py-0.5 text-center font-medium rounded ${
                      relatedTab === "sops" ? "bg-blue-600 text-white font-semibold" : "text-slate-600"
                    }`}
                  >
                    SOPs (2)
                  </button>
                  <button
                    onClick={() => setRelatedTab("docs")}
                    className={`flex-1 py-0.5 text-center font-medium rounded ${
                      relatedTab === "docs" ? "bg-blue-600 text-white font-semibold" : "text-slate-600"
                    }`}
                  >
                    Docs (4)
                  </button>
                  <button
                    onClick={() => setRelatedTab("standards")}
                    className={`flex-1 py-0.5 text-center font-medium rounded ${
                      relatedTab === "standards" ? "bg-blue-600 text-white font-semibold" : "text-slate-600"
                    }`}
                  >
                    Standards (2)
                  </button>
                </div>

                <div className="space-y-1 text-[11px] pt-1">
                  <div className="flex items-center justify-between py-0.5 text-slate-700">
                    <span className="truncate max-w-[170px] font-medium">WPT Basics - Wiki Article</span>
                    <span className="text-[9px] bg-slate-100 px-1 py-0.2 rounded text-slate-500">Wiki</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5 text-slate-700">
                    <span className="truncate max-w-[170px] font-medium">Coil Design Guidelines</span>
                    <span className="text-[9px] bg-slate-100 px-1 py-0.2 rounded text-slate-500">Technical Library</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5 text-slate-700">
                    <span className="truncate max-w-[170px] font-medium">EV Charging Safety SOP</span>
                    <span className="text-[9px] bg-slate-100 px-1 py-0.2 rounded text-slate-500">SOP Library</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: Section 5 Learning Objectives (span 4), Section 6 Files (span 4), Section 7 Assessment (span 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* SECTION 5: Learning Objectives (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">5. Learning Objectives</span>
                <button
                  onClick={() => setShowAddObjectiveModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Objective</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                      <th className="py-1 w-6">#</th>
                      <th className="py-1">Learning Objective</th>
                      <th className="py-1">Type</th>
                      <th className="py-1">Assessment</th>
                      <th className="py-1 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {objectives.map((obj) => (
                      <tr key={obj.id} className="hover:bg-slate-50">
                        <td className="py-1 text-slate-400">{obj.id}</td>
                        <td className="py-1 text-slate-800 font-medium">{obj.learningObjective}</td>
                        <td className="py-1 text-slate-600">{obj.type}</td>
                        <td className="py-1 text-slate-600">{obj.assessment}</td>
                        <td className="py-1 text-right">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            {obj.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 6: Training Materials & Files (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">6. Training Materials & Files</span>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Upload File</span>
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
                      <th className="py-1 text-right">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {trainingFiles.map((f, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-1 font-medium text-slate-800 max-w-[130px] truncate" title={f.fileName}>
                          {f.fileName}
                        </td>
                        <td className="py-1">
                          <span className="px-1 py-0.2 bg-slate-100 rounded text-[9px] font-mono text-slate-600">
                            {f.type}
                          </span>
                        </td>
                        <td className="py-1 text-slate-500 text-[10px]">{f.size}</td>
                        <td className="py-1 font-mono text-[10px] text-slate-600">{f.version}</td>
                        <td className="py-1 text-slate-400 text-[10px] text-right">{f.uploadedOn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 7: Assessment & Evaluation (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="font-bold text-slate-900 text-xs">7. Assessment & Evaluation</span>
                <button
                  onClick={() => alert("Editing Assessment Criteria & Question Banks...")}
                  className="text-blue-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Assessment Type</label>
                  <select
                    value={formData.assessmentType}
                    onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value as any })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Written Test">Written Test</option>
                    <option value="Practical Test">Practical Test</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Passing Score</label>
                  <select
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs font-semibold text-emerald-700"
                  >
                    <option value={70}>70 %</option>
                    <option value={80}>80 %</option>
                    <option value={85}>85 %</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">No. of Questions</label>
                  <input
                    type="number"
                    value={formData.numberOfQuestions}
                    onChange={(e) => setFormData({ ...formData, numberOfQuestions: Number(e.target.value) })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Duration</label>
                  <select
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Max Attempts</label>
                  <input
                    type="number"
                    value={formData.maximumAttempts}
                    onChange={(e) => setFormData({ ...formData, maximumAttempts: Number(e.target.value) })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600">Evaluation Method</label>
                  <select
                    value={formData.evaluationMethod}
                    onChange={(e) => setFormData({ ...formData, evaluationMethod: e.target.value })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-1 py-1 text-[11px]"
                  >
                    <option value="Auto + Manual Review">Auto + Manual</option>
                    <option value="Auto Graded">Auto Graded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Section 8 Target Audience (span 4), Section 9 Review Stepper (span 4), Section 10 Analytics (span 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* SECTION 8: Target Audience (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">8. Target Audience</span>
                <button
                  onClick={() => setShowAddAudienceModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Audience</span>
                </button>
              </div>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="py-1">Audience Type</th>
                    <th className="py-1">Department / Role</th>
                    <th className="py-1 text-center">Mandatory</th>
                    <th className="py-1 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {audienceList.map((aud, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1 font-medium text-slate-800">{aud.audienceType}</td>
                      <td className="py-1 text-slate-600">{aud.departmentRole}</td>
                      <td className="py-1 text-center">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                            aud.mandatory ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {aud.mandatory ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-1 text-right">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                          {aud.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SECTION 9: Review & Approval Stepper (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">9. Review & Approval</span>
                <button
                  onClick={() => alert("Viewing complete learning review workflow...")}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  View Workflow
                </button>
              </div>

              <div className="flex items-center justify-between relative px-2 py-2">
                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-800 mt-1">Draft</span>
                  <span className="text-[9px] text-slate-400">10-Sep-2026</span>
                </div>

                <div className="flex-1 h-0.5 bg-emerald-200 mx-1 mb-5"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-800 mt-1">SME Review</span>
                  <span className="text-[9px] text-slate-400">15-Sep-2026</span>
                </div>

                <div className="flex-1 h-0.5 bg-emerald-200 mx-1 mb-5"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-800 mt-1">Functional</span>
                  <span className="text-[9px] text-slate-400">20-Sep-2026</span>
                </div>

                <div className="flex-1 h-0.5 bg-blue-200 mx-1 mb-5"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 mt-1">Approval</span>
                  <span className="text-[9px] text-blue-500 font-medium">25-Sep-2026</span>
                </div>

                <div className="flex-1 h-0.5 bg-slate-200 mx-1 mb-5"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 mt-1">Published</span>
                  <span className="text-[9px] text-slate-400">-</span>
                </div>
              </div>
            </div>

            {/* SECTION 10: Training Analytics (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">10. Training Analytics (Last 6 Months)</span>
                <span className="text-[10px] text-slate-400">Live LMS</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                <div className="p-2 bg-blue-50/70 border border-blue-100 rounded-lg">
                  <div className="text-sm font-bold text-blue-900">{TRAINING_ANALYTICS_METRICS.enrollments}</div>
                  <div className="text-[10px] text-slate-600">Enrollments</div>
                  <div className="text-[9px] text-emerald-600 font-semibold">↑{TRAINING_ANALYTICS_METRICS.enrollmentsChange}%</div>
                </div>
                <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                  <div className="text-sm font-bold text-emerald-900">{TRAINING_ANALYTICS_METRICS.completions}</div>
                  <div className="text-[10px] text-slate-600">Completions</div>
                  <div className="text-[9px] text-emerald-600 font-semibold">↑{TRAINING_ANALYTICS_METRICS.completionsChange}%</div>
                </div>
                <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-lg">
                  <div className="text-sm font-bold text-purple-900">{TRAINING_ANALYTICS_METRICS.passRate}%</div>
                  <div className="text-[10px] text-slate-600">Pass Rate</div>
                  <div className="text-[9px] text-emerald-600 font-semibold">↑{TRAINING_ANALYTICS_METRICS.passRateChange}%</div>
                </div>
                <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-lg">
                  <div className="text-sm font-bold text-amber-900">{TRAINING_ANALYTICS_METRICS.feedbackScore}/5</div>
                  <div className="text-[10px] text-slate-600">Feedback Score</div>
                  <div className="text-[9px] text-emerald-600 font-semibold">↑{TRAINING_ANALYTICS_METRICS.feedbackScoreChange}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: New Training Material */}
        {showNewCourseModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span>Create Training Material</span>
                </h3>
                <button onClick={() => setShowNewCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Course / Material Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. EVSE High-Voltage Testing Procedures"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Type</label>
                  <select
                    value={newCourseType}
                    onChange={(e) => setNewCourseType(e.target.value as any)}
                    className="mt-1 w-full border border-slate-200 rounded-md p-1.5 text-xs"
                  >
                    <option value="Technical Training">Technical Training</option>
                    <option value="Product Training">Product Training</option>
                    <option value="Operator Training">Operator Training</option>
                    <option value="Compliance Training">Compliance Training</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowNewCourseModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourse}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm"
                >
                  Create Material
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add Learning Objective */}
        {showAddObjectiveModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-4 space-y-3 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900">Add Learning Objective</h4>
                <button onClick={() => setShowAddObjectiveModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Learning Objective Statement *</label>
                  <input
                    type="text"
                    value={newObjText}
                    onChange={(e) => setNewObjText(e.target.value)}
                    placeholder="e.g. Calibrate receiver resonant frequency"
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700">Type</label>
                    <select
                      value={newObjType}
                      onChange={(e) => setNewObjType(e.target.value as any)}
                      className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                    >
                      <option value="Knowledge">Knowledge</option>
                      <option value="Skill">Skill</option>
                      <option value="Competency">Competency</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Assessment</label>
                    <select
                      value={newObjAssessment}
                      onChange={(e) => setNewObjAssessment(e.target.value as any)}
                      className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                    >
                      <option value="Quiz">Quiz</option>
                      <option value="Practical">Practical</option>
                      <option value="Test">Test</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => setShowAddObjectiveModal(false)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  Cancel
                </button>
                <button onClick={handleAddObjective} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                  Add Objective
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Upload File */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-4 space-y-3 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900">Upload Learning File</h4>
                <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">File Name *</label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g. Lab_Exercise_Workbook.pdf"
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">File Type</label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value as any)}
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  >
                    <option value="PDF">PDF</option>
                    <option value="PPTX">PPTX (Presentation)</option>
                    <option value="Image">Image</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => setShowUploadModal(false)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  Cancel
                </button>
                <button onClick={handleUploadFile} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                  Upload File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Add Audience */}
        {showAddAudienceModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-4 space-y-3 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-900">Add Target Learner Audience</h4>
                <button onClick={() => setShowAddAudienceModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Audience Group</label>
                  <input
                    type="text"
                    value={newAudienceType}
                    onChange={(e) => setNewAudienceType(e.target.value)}
                    placeholder="e.g. Quality Auditors"
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Department / Role</label>
                  <input
                    type="text"
                    value={newAudienceDept}
                    onChange={(e) => setNewAudienceDept(e.target.value)}
                    placeholder="e.g. Quality Assurance"
                    className="mt-1 w-full border border-slate-200 rounded p-1.5 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="mand"
                    checked={newAudienceMandatory}
                    onChange={(e) => setNewAudienceMandatory(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <label htmlFor="mand" className="text-slate-700 font-medium">Mandatory Training Requirement</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => setShowAddAudienceModal(false)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  Cancel
                </button>
                <button onClick={handleAddAudience} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                  Add Audience
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
