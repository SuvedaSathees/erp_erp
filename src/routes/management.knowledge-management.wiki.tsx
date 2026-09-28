// Magnertia ERP - Wiki Module
// Management -> Knowledge Management -> Wiki
// Collaborative Articles, Rich/Markdown Editor, Article Structure, Knowledge Tree & Analytics

import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  BookOpen,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Image as ImageIcon,
  Code,
  Table as TableIcon,
  Star,
  Film,
  FileCode,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { KnowledgeTabBar } from "@/components/erp/KnowledgeManagementTabBar";
import { KnowledgeSubmoduleHeader } from "@/components/erp/KnowledgeSubmoduleHeader";
import {
  PRIMARY_WIKI_ARTICLE,
  WIKI_KPIS,
  WIKI_ARTICLE_STRUCTURE,
  WIKI_MEDIA_FILES,
  WIKI_VERSION_HISTORY,
  WIKI_RELATED_KNOWLEDGE,
  WIKI_AI_INSIGHTS,
  type WikiArticleRecord,
  type ArticleStructureItem,
  type WikiMediaItem,
} from "@/services/wikiService";

export const Route = createFileRoute("/management/knowledge-management/wiki")({
  head: () => ({
    meta: [
      { title: "Wiki · Knowledge · Magnertia ERP" },
      {
        name: "description",
        content:
          "Collaborative knowledge base, technical articles, how-to guides, and institutional knowledge repository.",
      },
    ],
  }),
  component: WikiManagementPage,
});

function WikiManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "article-register"
    | "create-edit"
    | "classification"
    | "content-media"
    | "review-approval"
    | "related-knowledge"
    | "analytics"
    | "settings"
  >("create-edit");

  // Form State
  const [formData, setFormData] = useState<WikiArticleRecord>(PRIMARY_WIKI_ARTICLE);
  const [kpis, setKpis] = useState(WIKI_KPIS);
  const [structure, setStructure] = useState<ArticleStructureItem[]>(WIKI_ARTICLE_STRUCTURE);
  const [mediaFiles, setMediaFiles] = useState<WikiMediaItem[]>(WIKI_MEDIA_FILES);
  const [mediaFilter, setMediaFilter] = useState<"all" | "images" | "docs" | "videos">("all");
  const [relatedTab, setRelatedTab] = useState<"articles" | "sops" | "docs" | "practices">("articles");
  const [editorMode, setEditorMode] = useState<"editor" | "preview" | "markdown" | "ai">("editor");

  // Keywords
  const [keywords, setKeywords] = useState<string[]>(PRIMARY_WIKI_ARTICLE.keywords);
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [showAddKeyword, setShowAddKeyword] = useState(false);

  // Notifications
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Modals
  const [showNewArticleModal, setShowNewArticleModal] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleType, setNewArticleType] = useState<WikiArticleRecord["articleType"]>("Technical Note");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileType, setUploadFileType] = useState<WikiMediaItem["type"]>("PNG");
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Handlers
  const handleSaveDraft = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSubmitReview = () => {
    setFormData((prev) => ({ ...prev, status: "Review" }));
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleCreateArticle = () => {
    if (!newArticleTitle.trim()) return;
    const newId = `WK-2026-00${kpis.totalArticles + 1}`;
    const newNo = `WIKI-ENG-0${kpis.totalArticles + 2}`;

    setFormData((prev) => ({
      ...prev,
      wikiArticleId: newId,
      articleNumber: newNo,
      articleTitle: newArticleTitle,
      articleType: newArticleType,
      status: "Draft",
      version: "v1.0",
    }));

    setKpis((prev) => ({
      ...prev,
      totalArticles: prev.totalArticles + 1,
      draft: prev.draft + 1,
    }));

    setShowNewArticleModal(false);
    setNewArticleTitle("");
    setActiveTab("create-edit");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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

  const handleUploadFile = () => {
    if (!uploadFileName.trim()) return;
    setMediaFiles((prev) => [
      ...prev,
      {
        fileName: uploadFileName,
        type: uploadFileType,
        size: "2.4 MB",
        uploadedOn: "27-Sep-2026",
      },
    ]);
    setUploadFileName("");
    setShowUploadModal(false);
  };

  // Filter media files
  const filteredMedia = mediaFiles.filter((m) => {
    if (mediaFilter === "all") return true;
    if (mediaFilter === "images") return m.type === "PNG";
    if (mediaFilter === "docs") return m.type === "PDF" || m.type === "XLSX";
    if (mediaFilter === "videos") return m.type === "MP4";
    return true;
  });

  return (
    <AppShell
      breadcrumb="Management > Knowledge > Wiki"
      title="Wiki"
      description="Collaborative knowledge articles, technical notes, how-to guides, and troubleshooting knowledge base."
      tabs={<KnowledgeTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Save & Submit Alerts */}
        {saveSuccess && (
          <div className="bg-blue-600 text-white px-6 py-2.5 flex items-center justify-between shadow-md rounded-md animate-fade-in text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-200" />
              <span>Draft saved and version synchronized to collaborative Knowledge Graph.</span>
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
              <span>Article submitted for SME Review (Priya Sharma). Notifications dispatched.</span>
            </div>
            <button onClick={() => setSubmitSuccess(false)} className="text-emerald-200 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP EXECUTIVE COMMAND HEADER */}
        <KnowledgeSubmoduleHeader
          icon={BookOpen}
          title="Wiki Knowledge Base"
          code="WIKI-2026-001"
          version="v1.0"
          status="Active"
          subtitle="Collaborative Knowledge. Engineering Manuals. System Troubleshooting."
          onSave={handleSaveDraft}
          onSubmit={handleSubmitReview}
          onGenerateReport={() => setActiveTab("analytics")}
          moreActions={[
            {
              label: activeTab === "article-register" ? "View Controlled Form" : "View Article Register",
              icon: FileText,
              onClick: () => setActiveTab(activeTab === "article-register" ? "overview" : "article-register"),
            },
          ]}
        />

        {/* 6 Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total Articles */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.totalArticles}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Articles</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.totalArticlesChange}%</span>
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

          {/* 5. Total Views */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-600 text-white">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.totalViews.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Views (30 Days)</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.totalViewsChange}%</span>
            </div>
          </div>

          {/* 6. User Satisfaction */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <Award className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{kpis.userSatisfaction}%</div>
                <div className="text-[10px] text-muted-foreground font-semibold">User Satisfaction</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {kpis.userSatisfactionChange}%</span>
            </div>
          </div>
        </div>

        {/* CREATE / EDIT ACTIVE VIEW (Sections 1-11 matching Image 7) */}
        <div className="space-y-4">
          {/* Top Row: Section 1 Header (span 4), Section 5 Content Editor (span 5), Right Column (span 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* SECTION 1: Article Header (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">1. Article Header</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>{formData.status}</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Wiki Article ID</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.wikiArticleId}
                      className="mt-0.5 w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Article Number</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.articleNumber}
                      className="mt-0.5 w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600">
                    Article Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.articleTitle}
                    onChange={(e) => setFormData({ ...formData, articleTitle: e.target.value })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Article Type</label>
                    <select
                      value={formData.articleType}
                      onChange={(e) => setFormData({ ...formData, articleType: e.target.value as any })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="Technical Note">Technical Note</option>
                      <option value="How-To Guide">How-To Guide</option>
                      <option value="FAQ">FAQ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Category</label>
                    <select
                      value={formData.knowledgeCategory}
                      onChange={(e) => setFormData({ ...formData, knowledgeCategory: e.target.value as any })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Module</label>
                    <select
                      value={formData.module}
                      onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="Product Development">Product Dev</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="R&D">R&D</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Process</label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="Technology Development">Tech Dev</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Owner</label>
                    <div className="mt-0.5 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[11px]">
                      <span className="h-4 w-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                        RS
                      </span>
                      <span className="truncate">{formData.articleOwner}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">SME</label>
                    <div className="mt-0.5 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[11px]">
                      <span className="h-4 w-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                        PS
                      </span>
                      <span className="truncate">{formData.subjectMatterExpert}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Version</label>
                    <select
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="v1.0">v1.0</option>
                      <option value="v0.9">v0.9</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs font-medium"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Review">Review</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Effective Date</label>
                    <div className="mt-0.5 relative">
                      <input
                        type="text"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                      <Calendar className="h-3 w-3 text-slate-400 absolute right-2 top-1.5" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600">Review Date</label>
                    <div className="mt-0.5 relative">
                      <input
                        type="text"
                        value={formData.reviewDate}
                        onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs"
                      />
                      <Calendar className="h-3 w-3 text-slate-400 absolute right-2 top-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: Article Content & Rich Editor (Col span 5) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">5. Article Content</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px]">
                  <button
                    onClick={() => setEditorMode("editor")}
                    className={`px-2 py-0.5 rounded font-medium ${
                      editorMode === "editor" ? "bg-blue-600 text-white font-semibold shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => setEditorMode("preview")}
                    className={`px-2 py-0.5 rounded font-medium ${
                      editorMode === "preview" ? "bg-blue-600 text-white font-semibold shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setEditorMode("markdown")}
                    className={`px-2 py-0.5 rounded font-medium ${
                      editorMode === "markdown" ? "bg-blue-600 text-white font-semibold shadow-xs" : "text-slate-600"
                    }`}
                  >
                    Markdown
                  </button>
                  <button
                    onClick={() => alert("AI Assistant analyzing article readability & technical completeness...")}
                    className="px-2 py-0.5 rounded font-medium text-purple-700 hover:bg-purple-100 flex items-center gap-0.5"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>AI Assist</span>
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 border border-slate-200 rounded-md p-1 bg-slate-50 text-slate-600 text-xs flex-wrap">
                <select className="bg-transparent text-xs font-medium border-0 focus:ring-0 pr-2">
                  <option>Normal</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <button className="p-1 hover:bg-slate-200 rounded"><Bold className="h-3 w-3" /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><Italic className="h-3 w-3" /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><Underline className="h-3 w-3" /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><Strikethrough className="h-3 w-3" /></button>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <button className="p-1 hover:bg-slate-200 rounded"><List className="h-3 w-3" /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><ListOrdered className="h-3 w-3" /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><LinkIcon className="h-3 w-3" /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><ImageIcon className="h-3 w-3" /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><Code className="h-3 w-3" /></button>
                <button className="p-1 hover:bg-slate-200 rounded"><TableIcon className="h-3 w-3" /></button>
              </div>

              {/* Content Body Editor or Preview */}
              {editorMode === "markdown" ? (
                <textarea
                  rows={8}
                  value={formData.contentBody}
                  onChange={(e) => setFormData({ ...formData, contentBody: e.target.value })}
                  className="w-full border border-slate-200 rounded p-2 text-xs font-mono text-slate-800"
                />
              ) : (
                <div className="border border-slate-200 rounded-md p-3 space-y-2 text-xs text-slate-800 bg-white">
                  <h4 className="font-bold text-sm text-slate-900">{formData.articleTitle}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Wireless Power Transfer (WPT) uses magnetic fields to transfer electrical energy between a transmitter (Tx) coil and a receiver (Rx) coil without physical contact. This article explains the basic principles, components, types, advantages, limitations and applications of inductive WPT for Electric Vehicle (EV) charging.
                  </p>

                  <div className="pt-1">
                    <span className="font-bold text-slate-900 text-xs block mb-1">1. How It Works</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                      <li>AC power is converted to high-frequency AC (20-100 kHz).</li>
                      <li>Current through the transmitter coil creates a varying magnetic field.</li>
                      <li>The magnetic field induces a voltage in the receiver coil.</li>
                      <li>The received power is converted back to DC and used to charge the battery.</li>
                    </ul>
                  </div>

                  {/* Embedded Graphic Illustration */}
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-2 flex items-center justify-between text-center mt-2">
                    <div className="text-[10px] text-slate-500 font-medium">Vehicle (Rx) Mounted Unit</div>
                    <div className="h-8 w-24 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-[10px] text-blue-700 font-bold">
                      Resonant Link
                    </div>
                    <div className="text-[10px] text-slate-700 font-semibold">Ground Pad (Tx) Station</div>
                  </div>
                </div>
              )}
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
                  <label className="text-[10px] font-semibold text-slate-600">Technology Area</label>
                  <select
                    value={formData.technologyArea}
                    onChange={(e) => setFormData({ ...formData, technologyArea: e.target.value })}
                    className="mt-0.5 w-full border border-slate-200 rounded px-1.5 py-1 text-xs"
                  >
                    <option value="Wireless Power Transfer (WPT)">Wireless Power Transfer (WPT)</option>
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

                {/* Sub-tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[10px]">
                  <button
                    onClick={() => setRelatedTab("articles")}
                    className={`flex-1 py-0.5 text-center font-medium rounded ${
                      relatedTab === "articles" ? "bg-blue-600 text-white font-semibold" : "text-slate-600"
                    }`}
                  >
                    Articles (4)
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
                    Docs (3)
                  </button>
                  <button
                    onClick={() => setRelatedTab("practices")}
                    className={`flex-1 py-0.5 text-center font-medium rounded ${
                      relatedTab === "practices" ? "bg-blue-600 text-white font-semibold" : "text-slate-600"
                    }`}
                  >
                    Best Practices (2)
                  </button>
                </div>

                <div className="space-y-1 text-[11px] pt-1">
                  {WIKI_RELATED_KNOWLEDGE.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5 text-slate-700">
                      <span className="truncate max-w-[170px] font-medium">{item.title}</span>
                      <span className="text-[9px] bg-slate-100 px-1 py-0.2 rounded text-slate-500">{item.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: Section 6 Structure (span 4), Section 7 Media (span 5), Section 8 Version History (span 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* SECTION 6: Article Structure (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">6. Article Structure</span>
                <button
                  onClick={() => alert("Managing section outline hierarchy...")}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  Manage Structure
                </button>
              </div>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="py-1 w-6">#</th>
                    <th className="py-1">Section Name</th>
                    <th className="py-1 text-center">Mandatory</th>
                    <th className="py-1 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {structure.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-1 text-slate-400">{item.id}</td>
                      <td className="py-1 text-slate-800 font-medium">{item.sectionName}</td>
                      <td className="py-1 text-center">
                        {item.mandatory && <Check className="h-3 w-3 text-blue-600 mx-auto" />}
                      </td>
                      <td className="py-1 text-right">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                            item.status === "Complete"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "In Progress"
                              ? "bg-amber-50 text-amber-700 font-semibold"
                              : "bg-slate-100 text-slate-500"
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

            {/* SECTION 7: Attachments & Media (Col span 5) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">7. Attachments & Media</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[10px]">
                    <button
                      onClick={() => setMediaFilter("all")}
                      className={`px-1.5 py-0.2 rounded ${mediaFilter === "all" ? "bg-white font-bold" : ""}`}
                    >
                      All (5)
                    </button>
                    <button
                      onClick={() => setMediaFilter("images")}
                      className={`px-1.5 py-0.2 rounded ${mediaFilter === "images" ? "bg-white font-bold" : ""}`}
                    >
                      Images (2)
                    </button>
                    <button
                      onClick={() => setMediaFilter("docs")}
                      className={`px-1.5 py-0.2 rounded ${mediaFilter === "docs" ? "bg-white font-bold" : ""}`}
                    >
                      Documents (2)
                    </button>
                    <button
                      onClick={() => setMediaFilter("videos")}
                      className={`px-1.5 py-0.2 rounded ${mediaFilter === "videos" ? "bg-white font-bold" : ""}`}
                    >
                      Videos (1)
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>Upload Files</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                      <th className="py-1">File Name</th>
                      <th className="py-1">Type</th>
                      <th className="py-1">Size</th>
                      <th className="py-1">Uploaded On</th>
                      <th className="py-1 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredMedia.map((file, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-1 font-medium text-slate-800 max-w-[140px] truncate" title={file.fileName}>
                          {file.fileName}
                        </td>
                        <td className="py-1">
                          <span className="px-1 py-0.2 bg-slate-100 rounded text-[9px] font-mono text-slate-600">
                            {file.type}
                          </span>
                        </td>
                        <td className="py-1 text-slate-500 text-[10px]">{file.size}</td>
                        <td className="py-1 text-slate-400 text-[10px]">{file.uploadedOn}</td>
                        <td className="py-1 text-right">
                          <button
                            onClick={() => alert(`Downloading ${file.fileName}...`)}
                            className="p-0.5 text-slate-400 hover:text-blue-600"
                          >
                            <Download className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 8: Version History (Col span 3) */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">8. Version History</span>
                <button
                  onClick={() => alert("Viewing complete revision comparison...")}
                  className="text-[11px] text-blue-600 hover:underline font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-1.5 text-xs">
                {WIKI_VERSION_HISTORY.map((vh, idx) => (
                  <div key={idx} className="p-1.5 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-blue-700 text-[11px]">{vh.version}</span>
                      <div className="text-[10px] text-slate-500">{vh.changeDescription}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-700 font-medium">{vh.changedBy}</div>
                      <div className="text-[9px] text-slate-400">{vh.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Section 9 Review Stepper (span 4), Section 10 Usage Analytics (span 4), Section 11 AI Insights (span 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* SECTION 9: Review & Approval Stepper (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">9. Review & Approval</span>
                <button
                  onClick={() => alert("Viewing full editorial workflow...")}
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
                  <span className="text-[9px] text-slate-400">15-Sep-2026</span>
                </div>

                <div className="flex-1 h-0.5 bg-blue-200 mx-1 mb-5"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 mt-1">SME Review</span>
                  <span className="text-[9px] text-blue-500 font-medium">In Progress</span>
                </div>

                <div className="flex-1 h-0.5 bg-slate-200 mx-1 mb-5"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 mt-1">Functional</span>
                  <span className="text-[9px] text-slate-400">Pending</span>
                </div>

                <div className="flex-1 h-0.5 bg-slate-200 mx-1 mb-5"></div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 mt-1">Published</span>
                  <span className="text-[9px] text-slate-400">-</span>
                </div>
              </div>
            </div>

            {/* SECTION 10: Usage Analytics (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-bold text-slate-900">10. Usage Analytics (Last 6 Months)</span>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 text-blue-600 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-blue-600"></span> Views
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Unique Users
                  </span>
                </div>
              </div>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Apr", views: 180, users: 120 },
                      { name: "May", views: 240, users: 160 },
                      { name: "Jun", views: 290, users: 190 },
                      { name: "Jul", views: 320, users: 210 },
                      { name: "Aug", views: 390, users: 240 },
                      { name: "Sep", views: 420, users: 280 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#2563eb" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="users" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SECTION 11: AI Insights (Col span 4) */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-purple-200 shadow-sm p-4 space-y-2 bg-gradient-to-br from-white to-purple-50/20">
              <div className="flex items-center justify-between border-b border-purple-100 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">11. AI Insights</span>
                  <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 text-[9px] font-bold rounded">Beta</span>
                </div>
                <button
                  onClick={() => alert("Viewing AI article recommendations...")}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  View Insights
                </button>
              </div>
              <div className="flex items-start gap-2 pt-0.5">
                <div className="h-7 w-7 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <ul className="space-y-1 text-[11px] text-slate-700">
                  {WIKI_AI_INSIGHTS.map((insight, idx) => (
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

        {/* MODAL: New Wiki Article */}
        {showNewArticleModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span>Create Wiki Article</span>
                </h3>
                <button onClick={() => setShowNewArticleModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Article Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Battery Management System Architecture"
                    value={newArticleTitle}
                    onChange={(e) => setNewArticleTitle(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Article Type</label>
                  <select
                    value={newArticleType}
                    onChange={(e) => setNewArticleType(e.target.value as any)}
                    className="mt-1 w-full border border-slate-200 rounded-md p-1.5 text-xs"
                  >
                    <option value="Technical Note">Technical Note</option>
                    <option value="How-To Guide">How-To Guide</option>
                    <option value="Knowledge Article">Knowledge Article</option>
                    <option value="FAQ">FAQ</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowNewArticleModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateArticle}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm"
                >
                  Create Article
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
                <h4 className="text-xs font-bold text-slate-900">Upload Media Attachment</h4>
                <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">File Name</label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="e.g. Coil_Layout_Schematic.png"
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
                    <option value="PNG">PNG (Image)</option>
                    <option value="PDF">PDF (Document)</option>
                    <option value="XLSX">XLSX (Data)</option>
                    <option value="MP4">MP4 (Video)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => setShowUploadModal(false)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  Cancel
                </button>
                <button onClick={handleUploadFile} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
