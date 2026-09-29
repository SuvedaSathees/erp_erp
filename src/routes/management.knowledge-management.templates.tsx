// Magnertia ERP - Templates Module
// Management -> Knowledge Management -> Templates
// Templates Form — MAICW Classification, Standard Structure, Required Fields & Usage Intelligence

import React, { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTemplatesRecordFn } from "@/lib/templatesFns.server";
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
  Box,
  Lock,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { KnowledgeTabBar } from "@/components/erp/KnowledgeManagementTabBar";
import { KnowledgeSubmoduleHeader } from "@/components/erp/KnowledgeSubmoduleHeader";
import {
  PRIMARY_TEMPLATE_RECORD,
  TEMPLATES_EXECUTIVE_KPIS,
  TEMPLATE_STRUCTURE_ITEMS,
  TEMPLATE_REQUIRED_FIELDS,
  TEMPLATE_VERSION_HISTORY,
  TEMPLATE_RELATED_ITEMS,
  TEMPLATE_AI_INSIGHTS,
  TEMPLATE_MASTER_REGISTER,
  type TemplateRecord,
  type StandardStructureItem,
  type RequiredFieldItem,
} from "@/services/templatesService";

export const Route = createFileRoute("/management/knowledge-management/templates")({
  head: () => ({
    meta: [
      { title: "Templates · Knowledge · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled Document & Form Templates, Standard Structure, Required Fields, Validation Rules, and Usage Governance.",
      },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "register"
    | "create-edit"
    | "structure"
    | "approval"
    | "usage"
    | "review"
    | "analytics"
    | "settings"
  >("overview");

  // Controlled form state
  const { data: dbRecord } = useQuery({
    queryKey: ["templates", "record"],
    queryFn: () => getTemplatesRecordFn({ data: {} }),
  });

  const [formData, setFormData] = useState<TemplateRecord>(PRIMARY_TEMPLATE_RECORD);
  useEffect(() => { if (dbRecord?.data) setFormData(dbRecord.data); }, [dbRecord]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [templateRegister, setTemplateRegister] = useState<TemplateRecord[]>(TEMPLATE_MASTER_REGISTER);
  const [structureItems, setStructureItems] = useState<StandardStructureItem[]>(TEMPLATE_STRUCTURE_ITEMS);
  const [requiredFields, setRequiredFields] = useState<RequiredFieldItem[]>(TEMPLATE_REQUIRED_FIELDS);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [newTemplateModal, setNewTemplateModal] = useState(false);

  // Register filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  const filteredRegister = useMemo(() => {
    return templateRegister.filter((tpl) => {
      const matchType = filterType === "All" || tpl.templateType === filterType;
      const matchSearch =
        tpl.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.templateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.templateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [templateRegister, searchQuery, filterType]);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <AppShell
      title="Templates"
      breadcrumb="Management > Knowledge > Templates"
      description="Controlled enterprise document blueprints, inspection forms, engineering schematics, and standardized schemas."
      tabs={<KnowledgeTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Save Banner */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Template structure and fields saved to Master Library!</span>
            </div>
            <button onClick={() => setSaveSuccess(false)} className="text-white/80 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP EXECUTIVE COMMAND HEADER */}
        <KnowledgeSubmoduleHeader
          icon={Layers}
          title="Templates Management"
          code="TMP-2026-001"
          version="v1.0"
          status="Active"
          subtitle="Controlled Document Blueprints. Standardize Forms. Ensure Quality."
          onSave={handleSave}
          onSubmit={() => {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }}
          onGenerateReport={() => setActiveTab("ai-insights")}
        />


        {/* 6 Top KPI Cards matching Screenshot 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total Templates */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <Layers className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{TEMPLATES_EXECUTIVE_KPIS.totalTemplates}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Templates</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {TEMPLATES_EXECUTIVE_KPIS.totalChange}%</span>
            </div>
          </div>

          {/* 2. Published */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <Check className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{TEMPLATES_EXECUTIVE_KPIS.published}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Published</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {TEMPLATES_EXECUTIVE_KPIS.publishedChange}%</span>
            </div>
          </div>

          {/* 3. Under Review */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500 text-white">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{TEMPLATES_EXECUTIVE_KPIS.underReview}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Under Review</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(TEMPLATES_EXECUTIVE_KPIS.underReviewChange)}%</span>
            </div>
          </div>

          {/* 4. Due for Review */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{TEMPLATES_EXECUTIVE_KPIS.dueForReview}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Due for Review</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(TEMPLATES_EXECUTIVE_KPIS.dueForReviewChange)}%</span>
            </div>
          </div>

          {/* 5. Times Used */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-600 text-white">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{TEMPLATES_EXECUTIVE_KPIS.timesUsed}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Times Used</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {TEMPLATES_EXECUTIVE_KPIS.timesUsedChange}%</span>
            </div>
          </div>

          {/* 6. Obsolete */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-teal-600 text-white">
                <Box className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{TEMPLATES_EXECUTIVE_KPIS.obsolete}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Obsolete</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(TEMPLATES_EXECUTIVE_KPIS.obsoleteChange)}%</span>
            </div>
          </div>
        </div>

        {/* Tab: Template Register */}
        {activeTab === "register" ? (
          <div className="bg-card rounded-xl border border-border p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h2 className="text-sm font-bold text-foreground">Template Register</h2>
                <p className="text-xs text-muted-foreground">Standardized form, checklist, audit, and workflow templates</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background font-semibold"
                >
                  <option value="All">All Types</option>
                  <option value="Form Template">Form Template</option>
                  <option value="Audit Template">Audit Template</option>
                  <option value="Checklist Template">Checklist Template</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold bg-muted/20">
                    <th className="py-2.5 px-3">Template ID</th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Template Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Version</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRegister.map((tpl) => (
                    <tr
                      key={tpl.templateId}
                      onClick={() => {
                        setFormData(tpl);
                        setActiveTab("overview");
                      }}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{tpl.templateId}</td>
                      <td className="py-2.5 px-3 font-semibold text-foreground">{tpl.templateCode}</td>
                      <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate">{tpl.templateName}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{tpl.templateType}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{tpl.department}</td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">{tpl.version}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {tpl.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(tpl);
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
          /* Main Dashboard: Sections 1 through 10 matching Screenshot 3 */
          <div className="space-y-4">
            {/* Top Grid: Section 1, 2, 3 & 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 1: Template Details (Col span 5) */}
              <div className="lg:col-span-5 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">1. Template Details</h2>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {formData.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Template ID</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.templateId}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 font-mono text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Template Code</label>
                    <input
                      type="text"
                      value={formData.templateCode}
                      onChange={(e) => setFormData({ ...formData, templateCode: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background font-semibold text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Template Name *</label>
                    <input
                      type="text"
                      value={formData.templateName}
                      onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background font-semibold text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Template Type *</label>
                    <select
                      value={formData.templateType}
                      onChange={(e) => setFormData({ ...formData, templateType: e.target.value as any })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="Form Template">Form Template</option>
                      <option value="Checklist Template">Checklist Template</option>
                      <option value="Audit Template">Audit Template</option>
                      <option value="Workflow Template">Workflow Template</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Category *</label>
                    <select
                      value={formData.templateCategory}
                      onChange={(e) => setFormData({ ...formData, templateCategory: e.target.value as any })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="Quality">Quality</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Supply Chain">Supply Chain</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Module / Submodule</label>
                    <input
                      type="text"
                      value={`${formData.module} > ${formData.submodule}`}
                      readOnly
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 text-muted-foreground text-[11px]"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="text-[10px] font-semibold text-muted-foreground">Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="Quality">Quality</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Process *</label>
                    <select
                      value={formData.process}
                      onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="Final Inspection">Final Inspection</option>
                      <option value="Incoming Inspection">Incoming Inspection</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Owners</label>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        RS
                      </span>
                      <span className="text-[11px] font-medium text-foreground">Ramesh</span>
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center ml-1">
                        PS
                      </span>
                      <span className="text-[11px] font-medium text-foreground">Priya</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-semibold text-muted-foreground">Organization</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Version / Status</label>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-mono text-xs font-bold text-foreground">{formData.version}</span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        ● {formData.status}
                      </span>
                    </div>
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
                    <label className="text-[10px] font-semibold text-muted-foreground">Confidentiality</label>
                    <div className="mt-1 px-2 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground">
                      {formData.confidentiality}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Template Preview (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">2. Template Preview</h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Page 1 of 4</span>
                      <button onClick={() => setZoomLevel(Math.max(80, zoomLevel - 10))} className="p-0.5 hover:text-foreground">
                        <ZoomOut className="h-3 w-3" />
                      </button>
                      <span className="text-[10px] font-semibold">{zoomLevel}%</span>
                      <button onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))} className="p-0.5 hover:text-foreground">
                        <ZoomIn className="h-3 w-3" />
                      </button>
                      <button onClick={handleSave} className="p-0.5 hover:text-foreground">
                        <Maximize2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Clean Form Preview Canvas */}
                  <div className="mt-2 p-3 bg-white text-slate-800 rounded-lg border border-slate-200 shadow-inner text-[10px] space-y-2 font-sans select-none">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-1.5">
                      <div>
                        <div className="font-extrabold tracking-wider text-blue-900 text-xs">MAGNERTIA</div>
                        <div className="text-[8px] text-slate-500">Quality Management System</div>
                      </div>
                      <div className="text-right text-[8px] text-slate-500">
                        <div>TPL-QA-017</div>
                        <div>Version: v2.1</div>
                        <div>Effective: 01-Sep-2026</div>
                      </div>
                    </div>

                    <div className="text-center font-bold text-[11px] text-slate-900 tracking-wide uppercase">
                      PRODUCT INSPECTION CHECKLIST
                    </div>

                    <div className="border border-slate-200 rounded p-1.5 bg-slate-50 text-[9px] space-y-1">
                      <div className="font-bold text-slate-700">1. General Information</div>
                      <div className="grid grid-cols-2 gap-1 text-[8px] text-slate-600">
                        <div>Product Name: EV Fast Charger 350kW</div>
                        <div>Product Code: EVC-350-01</div>
                        <div>Batch No: B-2026-09</div>
                        <div>Date: 01-Sep-2026</div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded overflow-hidden">
                      <div className="bg-slate-100 font-bold p-1 text-[8px] text-slate-700">2. Inspection Checklist</div>
                      <table className="w-full text-[8px] text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                            <th className="p-1">Sl.</th>
                            <th className="p-1">Inspection Item</th>
                            <th className="p-1">Specification</th>
                            <th className="p-1 text-center">Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="p-1">1</td>
                            <td className="p-1">Visual Appearance</td>
                            <td className="p-1">As per drawing</td>
                            <td className="p-1 text-center font-bold text-emerald-600">Pass</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="p-1">2</td>
                            <td className="p-1">Dimensions</td>
                            <td className="p-1">±0.5 mm</td>
                            <td className="p-1 text-center font-bold text-emerald-600">Pass</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="p-1">3</td>
                            <td className="p-1">Electrical Test</td>
                            <td className="p-1">As per SOP</td>
                            <td className="p-1 text-center font-bold text-emerald-600">Pass</td>
                          </tr>
                          <tr>
                            <td className="p-1">4</td>
                            <td className="p-1">Function Test</td>
                            <td className="p-1">100% Operational</td>
                            <td className="p-1 text-center font-bold text-emerald-600">Pass</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="text-right text-[7px] text-slate-400 pt-1">
                      Confidential - Magnertia Private Limited · Page 1 of 4
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Section 3 & 4 (Col span 3) */}
              <div className="lg:col-span-3 space-y-4">
                {/* Section 3: Template Classification */}
                <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">3. Template Classification</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Classification Level</div>
                      <div className="font-semibold text-foreground text-[11px]">Department</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Information Category</div>
                      <div className="font-semibold text-foreground text-[11px]">Process Document</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Regulatory Category</div>
                      <div className="font-semibold text-foreground text-[11px]">Internal</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Business Criticality</div>
                      <div className="font-semibold text-rose-600 text-[11px]">● High</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground">Owner: Ramesh S</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      ● Active
                    </span>
                  </div>
                </div>

                {/* Section 4: Standard Structure */}
                <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">4. Standard Structure</h2>
                    <button
                      onClick={() => setActiveTab("structure")}
                      className="text-[11px] text-blue-600 font-semibold cursor-pointer"
                    >
                      Manage Structure
                    </button>
                  </div>

                  <div className="space-y-1 text-xs">
                    {structureItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground">#{item.id}</span>
                          <span className="font-medium text-foreground text-[11px]">{item.sectionName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.mandatory && (
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                              Req
                            </span>
                          )}
                          <span className="text-emerald-600 text-xs">✓</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Grid: Section 5, 6, 7 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 5: Required Fields (Col span 5) */}
              <div className="lg:col-span-5 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">5. Required Fields</h2>
                  <button
                    onClick={handleSave}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Field</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-1.5">Field Name</th>
                        <th className="pb-1.5">Type</th>
                        <th className="pb-1.5 text-center">Req.</th>
                        <th className="pb-1.5">Validation Rule</th>
                        <th className="pb-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {requiredFields.map((field, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-medium text-foreground">{field.fieldName}</td>
                          <td className="py-2 text-muted-foreground">{field.fieldType}</td>
                          <td className="py-2 text-center text-blue-600 font-bold">{field.mandatory ? "✓" : "-"}</td>
                          <td className="py-2 text-muted-foreground text-[11px]">{field.validationRule}</td>
                          <td className="py-2 text-right">
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 6: Version History (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">6. Version History</h2>
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-1.5">Version</th>
                        <th className="pb-1.5">Date</th>
                        <th className="pb-1.5">Changed By</th>
                        <th className="pb-1.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {TEMPLATE_VERSION_HISTORY.map((v) => (
                        <tr key={v.version}>
                          <td className="py-1.5 font-mono font-bold text-blue-600">{v.version}</td>
                          <td className="py-1.5 text-muted-foreground">{v.date}</td>
                          <td className="py-1.5 text-foreground">{v.changedBy}</td>
                          <td className="py-1.5 text-muted-foreground truncate max-w-[120px]">{v.changeDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 7: Distribution & Usage (Col span 3) */}
              <div className="lg:col-span-3 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">7. Distribution & Usage</h2>
                    <button onClick={handleSave} className="text-[11px] text-blue-600 font-semibold cursor-pointer">
                      Distribute
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="p-2 rounded-lg bg-muted/40 border border-border">
                      <div className="text-lg font-bold text-foreground">98</div>
                      <div className="text-[9px] text-muted-foreground font-semibold">Distributed</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40 border border-border">
                      <div className="text-lg font-bold text-emerald-600">92</div>
                      <div className="text-[9px] text-muted-foreground font-semibold">Ack (94%)</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40 border border-border">
                      <div className="text-lg font-bold text-purple-600">642</div>
                      <div className="text-[9px] text-muted-foreground font-semibold">Total Usage</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold text-emerald-600">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>↑ 28% Usage Surge</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">30-day window</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Section 8, 9, 10 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 8: Related Templates (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">8. Related Templates</h2>
                  <button onClick={handleSave} className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                    + Link Template
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-1.5">Code</th>
                        <th className="pb-1.5">Template Name</th>
                        <th className="pb-1.5">Type</th>
                        <th className="pb-1.5 text-right">Relationship</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {TEMPLATE_RELATED_ITEMS.map((item) => (
                        <tr key={item.templateCode}>
                          <td className="py-2 font-mono font-semibold text-blue-600">{item.templateCode}</td>
                          <td className="py-2 font-medium text-foreground">{item.templateName}</td>
                          <td className="py-2 text-muted-foreground">{item.type}</td>
                          <td className="py-2 text-right text-[11px] text-muted-foreground">{item.relationship}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 9: Review & Approval (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">9. Review & Approval</h2>
                  <button onClick={() => setActiveTab("approval")} className="text-[11px] text-blue-600 font-semibold cursor-pointer">
                    View Workflow
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-[9px] font-bold text-foreground mt-1">Draft</span>
                    <span className="text-[8px] text-muted-foreground">10-Aug</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-emerald-500 -mt-4" />

                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-[9px] font-bold text-foreground mt-1">Review</span>
                    <span className="text-[8px] text-muted-foreground">20-Aug</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-emerald-500 -mt-4" />

                  <div className="flex flex-col items-center text-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-[9px] font-bold text-foreground mt-1">Approval</span>
                    <span className="text-[8px] text-muted-foreground">25-Aug</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-blue-600 -mt-4" />

                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      ●
                    </div>
                    <span className="text-[9px] font-bold text-blue-600 mt-1">Published</span>
                    <span className="text-[8px] text-muted-foreground">01-Sep</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-muted -mt-4" />

                  <div className="flex flex-col items-center text-center opacity-60">
                    <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold">
                      ○
                    </div>
                    <span className="text-[9px] font-bold text-foreground mt-1">Archive</span>
                    <span className="text-[8px] text-muted-foreground">-</span>
                  </div>
                </div>
              </div>

              {/* Section 10: AI Template Insights (Col span 4) */}
              <div className="lg:col-span-4 bg-linear-to-br from-purple-500/5 to-transparent rounded-xl border border-purple-500/20 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded bg-purple-600 text-white">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <h2 className="text-sm font-bold text-foreground">10. AI Template Insights</h2>
                    </div>
                    <button onClick={handleSave} className="text-[11px] text-purple-600 font-semibold cursor-pointer">
                      View Insights
                    </button>
                  </div>

                  <div className="space-y-1.5 mt-2 text-xs">
                    {TEMPLATE_AI_INSIGHTS.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                        <span className="text-muted-foreground text-[11px] leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Engine: MagTemplate-AI v2</span>
                  <span className="text-blue-600 font-semibold cursor-pointer">Re-evaluate</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Template */}
        {newTemplateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">Create Standard Template</h3>
                <button onClick={() => setNewTemplateModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground">Template Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. PPAP Part Submission Warrant Template"
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-muted-foreground">Template Type</label>
                    <select className="w-full mt-1 p-2 rounded-lg border border-border bg-background">
                      <option>Form Template</option>
                      <option>Checklist Template</option>
                      <option>Audit Template</option>
                      <option>Workflow Template</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-muted-foreground">Category</label>
                    <select className="w-full mt-1 p-2 rounded-lg border border-border bg-background">
                      <option>Quality</option>
                      <option>Manufacturing</option>
                      <option>Engineering</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setNewTemplateModal(false)}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setNewTemplateModal(false);
                    handleSave();
                  }}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
