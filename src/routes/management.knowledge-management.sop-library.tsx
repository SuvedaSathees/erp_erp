// Magnertia ERP - SOP Library Module
// Management -> Knowledge Management -> SOP Library
// SOP Library Form — MAICW Classification, Overview, Distribution, Training & Controlled Audit Reports

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { KnowledgeTabBar } from "@/components/erp/KnowledgeManagementTabBar";
import { KnowledgeSubmoduleHeader } from "@/components/erp/KnowledgeSubmoduleHeader";
import {
  PRIMARY_SOP_RECORD,
  SOP_EXECUTIVE_KPIS,
  SOP_DISTRIBUTION_DATA,
  SOP_RELATED_DOCUMENTS,
  SOP_TRAINING_MODULES,
  SOP_COMPLIANCE_LINKS,
  SOP_REVISIONS,
  SOP_AI_INSIGHTS,
  SOP_MASTER_REGISTER,
  type SOPRecord,
  type RelatedDocumentItem,
  type SOPRevisionItem,
} from "@/services/sopLibraryService";

export const Route = createFileRoute("/management/knowledge-management/sop-library")({
  head: () => ({
    meta: [
      { title: "SOP Library · Knowledge · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled Standard Operating Procedures repository, MAICW classification, approval workflows, and employee acknowledgement tracking.",
      },
    ],
  }),
  component: SOPLibraryPage,
});

function SOPLibraryPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "sop-register"
    | "create-edit"
    | "approval"
    | "distribution"
    | "review"
    | "training"
    | "compliance"
    | "analytics"
    | "history"
  >("overview");

  // Controlled form state
  const [formData, setFormData] = useState<SOPRecord>(PRIMARY_SOP_RECORD);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [linkDocModal, setLinkDocModal] = useState(false);
  const [newSOPModal, setNewSOPModal] = useState(false);
  const [relatedDocs, setRelatedDocs] = useState<RelatedDocumentItem[]>(SOP_RELATED_DOCUMENTS);
  const [sopRegister, setSopRegister] = useState<SOPRecord[]>(SOP_MASTER_REGISTER);

  // New SOP form state
  const [newSOPTitle, setNewSOPTitle] = useState("");
  const [newSOPNumber, setNewSOPNumber] = useState("");
  const [newSOPCategory, setNewSOPCategory] = useState<SOPRecord["sopCategory"]>("Quality");
  const [newSOPDepartment, setNewSOPDepartment] = useState("Product Inspection");

  // Filter for SOP Register
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const filteredRegister = useMemo(() => {
    return sopRegister.filter((sop) => {
      const matchCat = filterCategory === "All" || sop.sopCategory === filterCategory;
      const matchSearch =
        sop.sopTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sop.sopNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sop.sopId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sop.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [sopRegister, searchQuery, filterCategory]);

  const distributionPieData = [
    { name: "Acknowledged", value: SOP_DISTRIBUTION_DATA.acknowledged, color: "#10B981" },
    { name: "Pending", value: SOP_DISTRIBUTION_DATA.pending, color: "#F59E0B" },
    { name: "Overdue", value: SOP_DISTRIBUTION_DATA.overdue, color: "#EF4444" },
  ];

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCreateSOP = () => {
    if (!newSOPTitle.trim()) return;
    const newNum = newSOPNumber.trim() || `SOP-QA-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: SOPRecord = {
      ...formData,
      sopId: `SOP-2026-0${sopRegister.length + 150}`,
      sopNumber: newNum,
      sopTitle: newSOPTitle,
      sopCategory: newSOPCategory,
      department: newSOPDepartment,
      status: "Draft",
      version: "v1.0",
      effectiveDate: "27-Sep-2026",
      reviewDate: "27-Sep-2027",
    };

    setSopRegister((prev) => [newRecord, ...prev]);
    setFormData(newRecord);
    setNewSOPTitle("");
    setNewSOPNumber("");
    setNewSOPModal(false);
    setActiveTab("overview");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <AppShell
      title="SOP Library"
      breadcrumb="Management > Knowledge > SOP Library"
      description="Standard Operating Procedures repository, version governance, QA approval chains, and digital signoffs."
      tabs={<KnowledgeTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Save Banner */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>SOP record saved and synced to Knowledge Master!</span>
            </div>
            <button onClick={() => setSaveSuccess(false)} className="text-white/80 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP EXECUTIVE COMMAND HEADER */}
        <KnowledgeSubmoduleHeader
          icon={FileCheck}
          title="SOP Library"
          code="SOP-2026-001"
          version="v1.0"
          status="Active"
          subtitle="Manage Standard Operating Procedures. Ensure Compliance. Drive Operational Excellence."
          onSave={handleSave}
          onSubmit={() => {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }}
          onGenerateReport={() => setActiveTab("analytics")}
        />


        {/* 6 Top KPI Cards matching Screenshot 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total SOPs */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{SOP_EXECUTIVE_KPIS.totalSops}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total SOPs</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {SOP_EXECUTIVE_KPIS.totalChange}%</span>
            </div>
          </div>

          {/* 2. Published */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <Check className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{SOP_EXECUTIVE_KPIS.published}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Published</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {SOP_EXECUTIVE_KPIS.publishedChange}%</span>
            </div>
          </div>

          {/* 3. Under Review */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500 text-white">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{SOP_EXECUTIVE_KPIS.underReview}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Under Review</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(SOP_EXECUTIVE_KPIS.underReviewChange)}%</span>
            </div>
          </div>

          {/* 4. Due for Review */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{SOP_EXECUTIVE_KPIS.dueForReview}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Due for Review</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(SOP_EXECUTIVE_KPIS.dueForReviewChange)}%</span>
            </div>
          </div>

          {/* 5. Obsolete */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-600 text-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{SOP_EXECUTIVE_KPIS.obsolete}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Obsolete</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(SOP_EXECUTIVE_KPIS.obsoleteChange)}%</span>
            </div>
          </div>

          {/* 6. Acknowledgement Rate */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{SOP_EXECUTIVE_KPIS.acknowledgementRate}%</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Acknowledgement Rate</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {SOP_EXECUTIVE_KPIS.acknowledgementRateChange}%</span>
            </div>
          </div>
        </div>

        {/* Tab: SOP Register */}
        {activeTab === "sop-register" ? (
          <div className="bg-card rounded-xl border border-border p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h2 className="text-sm font-bold text-foreground">SOP Master Register</h2>
                <p className="text-xs text-muted-foreground">Complete inventory of controlled standard operating procedures</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search SOPs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background font-semibold"
                >
                  <option value="All">All Categories</option>
                  <option value="Quality">Quality</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Safety">Safety</option>
                  <option value="Supply Chain">Supply Chain</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold bg-muted/20">
                    <th className="py-2.5 px-3">SOP ID</th>
                    <th className="py-2.5 px-3">SOP Number</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Version</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRegister.map((sop) => (
                    <tr
                      key={sop.sopId}
                      onClick={() => {
                        setFormData(sop);
                        setActiveTab("overview");
                      }}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{sop.sopId}</td>
                      <td className="py-2.5 px-3 font-semibold text-foreground">{sop.sopNumber}</td>
                      <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate">{sop.sopTitle}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{sop.sopCategory}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{sop.department}</td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">{sop.version}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {sop.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(sop);
                            setActiveTab("overview");
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded"
                        >
                          View Form
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Main Dashboard: Sections 1 through 10 matching Screenshot 1 */
          <div className="space-y-4">
            {/* Top Grid: Section 1, 2, 3, 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 1: SOP Details (Col span 6) */}
              <div className="lg:col-span-6 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">1. SOP Details</h2>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {formData.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">SOP ID</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.sopId}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 font-mono font-medium text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">SOP Number</label>
                    <input
                      type="text"
                      value={formData.sopNumber}
                      onChange={(e) => setFormData({ ...formData, sopNumber: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background font-semibold text-foreground text-xs"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-semibold text-muted-foreground">Organization *</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-semibold text-muted-foreground">SOP Title *</label>
                    <input
                      type="text"
                      value={formData.sopTitle}
                      onChange={(e) => setFormData({ ...formData, sopTitle: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background font-semibold text-foreground text-xs"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-semibold text-muted-foreground">Plant / Site</label>
                    <input
                      type="text"
                      value={formData.plantSite}
                      onChange={(e) => setFormData({ ...formData, plantSite: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">SOP Type *</label>
                    <select
                      value={formData.sopType}
                      onChange={(e) => setFormData({ ...formData, sopType: e.target.value as any })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-medium"
                    >
                      <option value="Process SOP">Process SOP</option>
                      <option value="Corporate SOP">Corporate SOP</option>
                      <option value="Department SOP">Department SOP</option>
                      <option value="Operational SOP">Operational SOP</option>
                      <option value="Technical SOP">Technical SOP</option>
                      <option value="Quality SOP">Quality SOP</option>
                      <option value="Safety SOP">Safety SOP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">SOP Category *</label>
                    <select
                      value={formData.sopCategory}
                      onChange={(e) => setFormData({ ...formData, sopCategory: e.target.value as any })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-medium"
                    >
                      <option value="Quality">Quality</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Safety">Safety</option>
                      <option value="Management">Management</option>
                      <option value="Supply Chain">Supply Chain</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Effective Date *</label>
                    <input
                      type="text"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Review Date *</label>
                    <input
                      type="text"
                      value={formData.reviewDate}
                      onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="Product Inspection">Product Inspection</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="R&D Engineering">R&D Engineering</option>
                      <option value="EHS Safety">EHS Safety</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Process *</label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="Final Assembly Inspection">Final Assembly Inspection</option>
                      <option value="Incoming Material Check">Incoming Material Check</option>
                      <option value="In-Process Verification">In-Process Verification</option>
                      <option value="Calibration Verification">Calibration Verification</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Process Owner</label>
                    <div className="flex items-center gap-2 mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/20">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        RS
                      </span>
                      <span className="font-semibold text-foreground">{formData.processOwner}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">SOP Owner *</label>
                    <div className="flex items-center gap-2 mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/20">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                        PS
                      </span>
                      <span className="font-semibold text-foreground">{formData.sopOwner}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Priority</label>
                    <div className="mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background font-semibold text-rose-600 text-xs">
                      ↑ {formData.priority}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Status / Version</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{formData.status}</span>
                      </span>
                      <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-muted text-muted-foreground">
                        {formData.version}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: SOP Document (Col span 3) */}
              <div className="lg:col-span-3 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">2. SOP Document</h2>
                  </div>

                  {/* Document Cover Card */}
                  <div className="mt-3 p-3.5 rounded-xl border border-border bg-muted/30 text-center space-y-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-blue-600" />
                      <span className="text-xs font-extrabold text-foreground tracking-wider">MAGNERTIA</span>
                    </div>
                    <div className="text-[10px] font-semibold text-muted-foreground">Standard Operating Procedure</div>
                    <div className="text-xs font-bold text-foreground leading-snug line-clamp-2">
                      {formData.sopTitle}
                    </div>
                    <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                      <div>SOP No: <span className="font-semibold text-foreground">{formData.sopNumber}</span></div>
                      <div>Version: <span className="font-semibold text-foreground">{formData.version}</span></div>
                      <div>Effective Date: <span className="font-semibold text-foreground">{formData.effectiveDate}</span></div>
                    </div>
                  </div>

                  {/* File Metadata */}
                  <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>File Name</span>
                      <span className="font-semibold text-foreground">SOP_QA_017_v2.1.pdf</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Size</span>
                      <span className="font-semibold text-foreground">1.8 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Type</span>
                      <span className="font-semibold text-foreground">PDF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded On</span>
                      <span className="font-semibold text-foreground">28-Aug-2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded By</span>
                      <span className="font-semibold text-foreground">Priya Sharma</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-1.5 pt-2">
                  <button
                    onClick={handleSave}
                    className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Document</span>
                  </button>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={handleSave}
                      className="py-1.5 border border-border bg-card hover:bg-muted text-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("history")}
                      className="py-1.5 border border-border bg-card hover:bg-muted text-foreground rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <History className="h-3 w-3" />
                      <span>Revision History</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 3: Section 3 & 4 (Col span 3) */}
              <div className="lg:col-span-3 space-y-4">
                {/* Section 3: Distribution & Acknowledgment */}
                <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">3. Distribution & Acknowledgment</h2>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="h-28 w-28 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distributionPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={44}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {distributionPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs font-bold text-foreground">92%</span>
                        <span className="text-[8px] text-muted-foreground">Ack</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground text-[11px]">Acknowledged:</span>
                        <span className="font-bold text-foreground">184</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-muted-foreground text-[11px]">Pending:</span>
                        <span className="font-bold text-foreground">12</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-muted-foreground text-[11px]">Overdue:</span>
                        <span className="font-bold text-foreground">4</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("distribution")}
                    className="w-full mt-1 py-1 border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold rounded-lg text-center cursor-pointer"
                  >
                    View Distribution List
                  </button>
                </div>

                {/* Section 4: Review & Approval */}
                <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">4. Review & Approval</h2>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                        <span className="text-muted-foreground">Prepared by</span>
                      </div>
                      <span className="font-semibold text-foreground text-[11px]">Priya Sharma (25-Aug)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                        <span className="text-muted-foreground">Reviewed by</span>
                      </div>
                      <span className="font-semibold text-foreground text-[11px]">Ramesh S (28-Aug)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                        <span className="text-muted-foreground">Approved by</span>
                      </div>
                      <span className="font-semibold text-foreground text-[11px]">Quality Mgr (30-Aug)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                        <span className="text-muted-foreground">Published on</span>
                      </div>
                      <span className="font-semibold text-foreground text-[11px]">01-Sep-2026</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("approval")}
                    className="w-full mt-1 py-1 border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold rounded-lg text-center cursor-pointer"
                  >
                    View Approval Workflow
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Grid: Section 5, 6, 7 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 5: Related Documents (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">5. Related Documents</h2>
                  <button
                    onClick={() => setLinkDocModal(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Link Document</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-1.5">Document Name</th>
                        <th className="pb-1.5">Type</th>
                        <th className="pb-1.5">Version</th>
                        <th className="pb-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {relatedDocs.map((doc) => (
                        <tr key={doc.id}>
                          <td className="py-2 font-medium text-foreground">{doc.documentName}</td>
                          <td className="py-2 text-muted-foreground">{doc.type}</td>
                          <td className="py-2 font-mono text-muted-foreground">{doc.version}</td>
                          <td className="py-2 text-right">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{doc.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 6: Training & Competency (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">6. Training & Competency</h2>
                  <button
                    onClick={() => setActiveTab("training")}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View Training Records
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {SOP_TRAINING_MODULES.map((tm) => (
                    <div key={tm.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground text-[11px]">{tm.trainingModule}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground font-semibold">{tm.trained}</span>
                          <span className="text-[10px] font-bold text-emerald-600">{tm.completion}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${tm.completion}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 7: Compliance & Links (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">7. Compliance & Links</h2>
                  <span className="text-[11px] text-muted-foreground">Governing Framework</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">ISO Clause</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <span>{SOP_COMPLIANCE_LINKS.isoClause}</span>
                      <LinkIcon className="h-3 w-3 text-blue-600" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Regulatory Req.</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <span>{SOP_COMPLIANCE_LINKS.regulatoryRequirement}</span>
                      <LinkIcon className="h-3 w-3 text-blue-600" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Legal Req.</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <span>{SOP_COMPLIANCE_LINKS.legalRequirement}</span>
                      <LinkIcon className="h-3 w-3 text-blue-600" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Risk Reference</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <span>{SOP_COMPLIANCE_LINKS.riskReference}</span>
                      <LinkIcon className="h-3 w-3 text-blue-600" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">Related Policies</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <span>{SOP_COMPLIANCE_LINKS.relatedPolicies}</span>
                      <LinkIcon className="h-3 w-3 text-blue-600" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Section 8, 9, 10 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 8: SOP Lifecycle Chevron (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">8. SOP Lifecycle</h2>
                  <span className="text-[10px] text-muted-foreground">8 Stages</span>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-[10px]">
                  <div className="px-2 py-1 bg-muted text-muted-foreground rounded text-center">
                    <div>Draft</div>
                    <div className="text-[8px]">10-Aug</div>
                  </div>
                  <span>→</span>
                  <div className="px-2 py-1 bg-muted text-muted-foreground rounded text-center">
                    <div>Review</div>
                    <div className="text-[8px]">20-Aug</div>
                  </div>
                  <span>→</span>
                  <div className="px-2 py-1 bg-muted text-muted-foreground rounded text-center">
                    <div>Approval</div>
                    <div className="text-[8px]">30-Aug</div>
                  </div>
                  <span>→</span>
                  <div className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded text-center shadow-xs">
                    <div>Published</div>
                    <div className="text-[8px]">01-Sep</div>
                  </div>
                  <span>→</span>
                  <div className="px-2 py-1 bg-muted text-muted-foreground rounded text-center">
                    <div>Review Due</div>
                    <div className="text-[8px]">01-Sep-27</div>
                  </div>
                </div>
              </div>

              {/* Section 9: Recent Revisions (Col span 5) */}
              <div className="lg:col-span-5 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">9. Recent Revisions</h2>
                  <button
                    onClick={() => setActiveTab("history")}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View All Revisions
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-1.5">Version</th>
                        <th className="pb-1.5">Date</th>
                        <th className="pb-1.5">Changed By</th>
                        <th className="pb-1.5">Change Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {SOP_REVISIONS.map((rev) => (
                        <tr key={rev.version}>
                          <td className="py-1.5 font-mono font-bold text-blue-600">{rev.version}</td>
                          <td className="py-1.5 text-muted-foreground">{rev.date}</td>
                          <td className="py-1.5 text-foreground">{rev.changedBy}</td>
                          <td className="py-1.5 text-muted-foreground truncate max-w-[140px]">{rev.changeDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 10: AI SOP Insights (Col span 3) */}
              <div className="lg:col-span-3 bg-linear-to-br from-purple-500/5 to-transparent rounded-xl border border-purple-500/20 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <div className="p-1 rounded bg-purple-600 text-white">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <h2 className="text-sm font-bold text-foreground">10. AI SOP Insights</h2>
                  </div>

                  <div className="space-y-2 mt-2 text-xs">
                    {SOP_AI_INSIGHTS.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                        <span className="text-muted-foreground text-[11px] leading-tight">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Model: SOP-Audit v3.2</span>
                  <span className="text-blue-600 font-semibold cursor-pointer">Re-Scan</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New SOP */}
        {newSOPModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">Create New Controlled SOP</h3>
                <button onClick={() => setNewSOPModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground">SOP Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dielectric Withstand Test for EV Inverters"
                    value={newSOPTitle}
                    onChange={(e) => setNewSOPTitle(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground">SOP Number (optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank (e.g. SOP-QA-018)"
                    value={newSOPNumber}
                    onChange={(e) => setNewSOPNumber(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-muted-foreground">Category</label>
                    <select
                      value={newSOPCategory}
                      onChange={(e) => setNewSOPCategory(e.target.value as any)}
                      className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                    >
                      <option value="Quality">Quality</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Safety">Safety</option>
                      <option value="Supply Chain">Supply Chain</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-muted-foreground">Department</label>
                    <input
                      type="text"
                      value={newSOPDepartment}
                      onChange={(e) => setNewSOPDepartment(e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setNewSOPModal(false)}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSOP}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Create SOP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Link Document */}
        {linkDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">Link Supporting Document</h3>
                <button onClick={() => setLinkDocModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground">Document Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Inverter Wiring Schematic"
                    id="newDocName"
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground">Document Type</label>
                  <select id="newDocType" className="w-full mt-1 p-2 rounded-lg border border-border bg-background">
                    <option value="Work Instruction">Work Instruction</option>
                    <option value="Checklist">Checklist</option>
                    <option value="Drawing">Engineering Drawing</option>
                    <option value="Standard">Standard Specification</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setLinkDocModal(false)}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const name = (document.getElementById("newDocName") as HTMLInputElement)?.value;
                    const type = (document.getElementById("newDocType") as HTMLSelectElement)?.value;
                    if (name) {
                      setRelatedDocs([
                        ...relatedDocs,
                        { id: `RD-${Date.now()}`, documentName: name, type, version: "v1.0", status: "Active" },
                      ]);
                    }
                    setLinkDocModal(false);
                  }}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
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
