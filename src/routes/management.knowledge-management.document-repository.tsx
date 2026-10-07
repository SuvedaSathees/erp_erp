// Magnertia ERP - Document Repository Module
// Management -> Knowledge Management -> Document Repository
// Document Repository Form — MAICW Classification, Content Storage, Access Control, and Analytics

import React, { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDocumentRepositoryRecordFn } from "@/lib/documentRepositoryFns.server";
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
  Tag,
  FolderTree,
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
  PRIMARY_DOCUMENT_RECORD,
  DOCUMENT_REPOSITORY_KPIS,
  DOCUMENT_APPROVAL_STEPS,
  DOCUMENT_ACCESS_RULES,
  DOCUMENT_RELATED_ITEMS,
  DOCUMENT_ANALYTICS_MONTHLY,
  DOCUMENT_MASTER_REGISTER,
  type DocumentRecord,
  type RelatedDocumentItem,
  type AccessControlRule,
} from "@/services/documentRepositoryService";

export const Route = createFileRoute("/management/knowledge-management/document-repository")({
  head: () => ({
    meta: [
      { title: "Document Repository · Knowledge · Magnertia ERP" },
      {
        name: "description",
        content:
          "Centralized organizational document storage, version control, role-based access management, and retention audit.",
      },
    ],
  }),
  component: DocumentRepositoryPage,
});

function DocumentRepositoryPage() {
  const { data: dbRecord } = useQuery({
    queryKey: ["document-repository", "record"],
    queryFn: () => getDocumentRepositoryRecordFn({ data: {} }),
  });

  const [activeTab, setActiveTab] = useState<
    | "register"
    | "create-edit"
    | "version-history"
    | "approval"
    | "distribution"
    | "access-control"
    | "review"
    | "retention"
    | "analytics"
    | "settings"
  >("create-edit");

  // Controlled form state
  const [formData, setFormData] = useState<DocumentRecord>(PRIMARY_DOCUMENT_RECORD);
  useEffect(() => { if (dbRecord?.data) setFormData(dbRecord.data); }, [dbRecord]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [docRegister, setDocRegister] = useState<DocumentRecord[]>(DOCUMENT_MASTER_REGISTER);
  const [tags, setTags] = useState<string[]>(["Inspection", "Quality", "EVSE", "Testing"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);
  const [newDocModal, setNewDocModal] = useState(false);

  // Search in register
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  const filteredRegister = useMemo(() => {
    return docRegister.filter((doc) => {
      const matchType = filterType === "All" || doc.documentType === filterType;
      const matchSearch =
        doc.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [docRegister, searchQuery, filterType]);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput("");
      setShowAddTag(false);
    }
  };

  return (
    <AppShell
      title="Document Repository"
      breadcrumb="Management > Knowledge > Document Repository"
      description="Centralized controlled documents vault, cryptographic verification, security classifications, and revision tracking."
      tabs={<KnowledgeTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Save Banner */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Document metadata saved and encrypted in Magnertia Repository!</span>
            </div>
            <button onClick={() => setSaveSuccess(false)} className="text-white/80 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TOP EXECUTIVE COMMAND HEADER */}
        <KnowledgeSubmoduleHeader
          icon={FolderTree}
          title="Document Repository"
          code="DOC-2026-001"
          version="v1.0"
          status="Active"
          subtitle="Enterprise Controlled Documents. Access Control. Version Integrity."
          onSave={handleSave}
          onSubmit={() => {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }}
          onGenerateReport={() => setActiveTab("analytics")}
        />


        {/* 6 Top KPI Cards matching Screenshot 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total Documents */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{DOCUMENT_REPOSITORY_KPIS.totalDocuments.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Total Documents</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {DOCUMENT_REPOSITORY_KPIS.totalChange}%</span>
            </div>
          </div>

          {/* 2. Active Documents */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <Check className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{DOCUMENT_REPOSITORY_KPIS.activeDocuments}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Active Documents</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>↑ {DOCUMENT_REPOSITORY_KPIS.activeChange}%</span>
            </div>
          </div>

          {/* 3. Under Review */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500 text-white">
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{DOCUMENT_REPOSITORY_KPIS.underReview}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Under Review</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span>↑ {DOCUMENT_REPOSITORY_KPIS.underReviewChange}%</span>
            </div>
          </div>

          {/* 4. Pending Approval */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-red-500 text-white">
                <UserCheck className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{DOCUMENT_REPOSITORY_KPIS.pendingApproval}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Pending Approval</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(DOCUMENT_REPOSITORY_KPIS.pendingApprovalChange)}%</span>
            </div>
          </div>

          {/* 5. Expiring Soon */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-600 text-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{DOCUMENT_REPOSITORY_KPIS.expiringSoon}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Expiring Soon</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <span>↓ {Math.abs(DOCUMENT_REPOSITORY_KPIS.expiringSoonChange)}%</span>
            </div>
          </div>

          {/* 6. Obsolete */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-teal-600 text-white">
                <Box className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-foreground">{DOCUMENT_REPOSITORY_KPIS.obsolete}</div>
                <div className="text-[10px] text-muted-foreground font-semibold">Obsolete</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
              <span>↑ 0%</span>
            </div>
          </div>
        </div>

        {/* Tab: Document Register */}
        {activeTab === "register" ? (
          <div className="bg-card rounded-xl border border-border p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <h2 className="text-sm font-bold text-foreground">Document Register</h2>
                <p className="text-xs text-muted-foreground">Master inventory of controlled policies, procedures, and manuals</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search documents..."
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
                  <option value="SOP">SOP</option>
                  <option value="Policy">Policy</option>
                  <option value="Work Instruction">Work Instruction</option>
                  <option value="Procedure">Procedure</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold bg-muted/20">
                    <th className="py-2.5 px-3">Document ID</th>
                    <th className="py-2.5 px-3">Doc Number</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Version</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRegister.map((doc) => (
                    <tr
                      key={doc.documentId}
                      onClick={() => {
                        setFormData(doc);
                        setActiveTab("create-edit");
                      }}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{doc.documentId}</td>
                      <td className="py-2.5 px-3 font-semibold text-foreground">{doc.documentNumber}</td>
                      <td className="py-2.5 px-3 font-medium text-foreground max-w-xs truncate">{doc.documentTitle}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{doc.documentType}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{doc.department}</td>
                      <td className="py-2.5 px-3 font-mono text-muted-foreground">{doc.currentVersion}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {doc.documentStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(doc);
                            setActiveTab("create-edit");
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
          /* Main Dashboard: Sections 1 through 10 matching Screenshot 2 */
          <div className="space-y-4">
            {/* Top Grid: Section 1, 2, 3, 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 1: Document Details (Col span 6) */}
              <div className="lg:col-span-6 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">1. Document Details</h2>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {formData.documentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Document ID</label>
                    <input
                      type="text"
                      readOnly
                      value={formData.documentId}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 font-mono font-medium text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Document Number *</label>
                    <input
                      type="text"
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background font-semibold text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Document Title *</label>
                    <input
                      type="text"
                      value={formData.documentTitle}
                      onChange={(e) => setFormData({ ...formData, documentTitle: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background font-semibold text-foreground text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Document Type *</label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="SOP">SOP</option>
                      <option value="Policy">Policy</option>
                      <option value="Procedure">Procedure</option>
                      <option value="Work Instruction">Work Instruction</option>
                      <option value="Manual">Manual</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Document Category *</label>
                    <select
                      value={formData.documentCategory}
                      onChange={(e) => setFormData({ ...formData, documentCategory: e.target.value as any })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    >
                      <option value="Quality">Quality</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Legal">Legal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Module / Submodule</label>
                    <input
                      type="text"
                      value={`${formData.module} > ${formData.submodule}`}
                      readOnly
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 text-muted-foreground text-xs"
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
                      <option value="Supply Chain">Supply Chain</option>
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
                      <option value="Assembly Verification">Assembly Verification</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Process / Doc Owner</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        RS
                      </span>
                      <span className="text-[11px] font-semibold text-foreground">Ramesh S</span>
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center ml-1">
                        PS
                      </span>
                      <span className="text-[11px] font-semibold text-foreground">Priya</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-semibold text-muted-foreground">Branch / Site</label>
                    <input
                      type="text"
                      value={formData.branchSite}
                      onChange={(e) => setFormData({ ...formData, branchSite: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Confidentiality</label>
                    <div className="flex items-center gap-1.5 mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs">
                      <Lock className="h-3 w-3 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{formData.confidentiality}</span>
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
                    <label className="text-[10px] font-semibold text-muted-foreground">Expiry Date</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Priority / Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-amber-600 text-xs">● {formData.priority}</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{formData.documentStatus}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Document Content (Col span 3) */}
              <div className="lg:col-span-3 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">2. Document Content</h2>
                  </div>

                  {/* Red PDF File Card */}
                  <div className="mt-3 p-3 rounded-xl border border-border bg-muted/20 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                      PDF
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-foreground truncate">
                        {formData.fileName || "Quality_Inspection_SOP_v2.1.pdf"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{formData.fileSize || "1.8 MB"}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    <button
                      onClick={handleSave}
                      className="py-1 border border-border bg-card hover:bg-muted text-foreground rounded text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="py-1 border border-border bg-card hover:bg-muted text-foreground rounded text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="py-1 border border-border bg-card hover:bg-muted text-foreground rounded text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Replace</span>
                    </button>
                  </div>

                  {/* File Metadata */}
                  <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>File Type</span>
                      <span className="font-semibold text-foreground">PDF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded By</span>
                      <span className="font-semibold text-foreground">Priya Sharma</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upload Date</span>
                      <span className="font-semibold text-foreground">28-Aug-2026 10:24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repository Path</span>
                      <span className="font-mono text-foreground text-[10px]">/Quality/SOP/Inspection/</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Checksum</span>
                      <span className="font-mono text-foreground text-[10px]">a3f5d2e6...9c1b</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Version / Status</span>
                      <span className="font-semibold text-emerald-600">v2.1 · Active</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("version-history")}
                  className="w-full py-1 text-center text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer pt-2 border-t border-border"
                >
                  View All Versions (4)
                </button>
              </div>

              {/* Column 3: Section 3 & 4 (Col span 3) */}
              <div className="lg:col-span-3 space-y-4">
                {/* Section 3: Approval Workflow */}
                <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">3. Approval Workflow</h2>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {DOCUMENT_APPROVAL_STEPS.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              step.status === "Completed"
                                ? "bg-emerald-500 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.status === "Completed" ? "✓" : "○"}
                          </span>
                          <span className="text-muted-foreground">{step.role}</span>
                        </div>
                        <span className="font-semibold text-foreground text-[11px]">
                          {step.person} ({step.date})
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full mt-2 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                  >
                    Send for Approval
                  </button>
                  <button
                    onClick={() => setActiveTab("approval")}
                    className="w-full text-center text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    View Workflow History
                  </button>
                </div>

                {/* Section 4: Distribution & Acknowledgement */}
                <div className="bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">4. Distribution & Acknowledgement</h2>
                    <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">View All</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[11px] pt-1">
                    <div>
                      <div className="text-muted-foreground">Acknowledged</div>
                      <div className="font-bold text-emerald-600 text-xs">● 156 (78%)</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Pending</div>
                      <div className="font-bold text-amber-500 text-xs">● 36 (18%)</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Overdue</div>
                      <div className="font-bold text-red-500 text-xs">● 8 (4%)</div>
                    </div>
                  </div>

                  {/* Multi-colored Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2 flex overflow-hidden mt-1">
                    <div className="bg-emerald-500 h-full" style={{ width: "78%" }} />
                    <div className="bg-amber-400 h-full" style={{ width: "18%" }} />
                    <div className="bg-red-500 h-full" style={{ width: "4%" }} />
                  </div>

                  <button
                    onClick={() => setActiveTab("distribution")}
                    className="w-full mt-1 py-1 border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold rounded-lg text-center cursor-pointer"
                  >
                    Manage Distribution
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Grid: Section 5, 6, 7 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 5: Classification & Tags (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">5. Classification & Tags</h2>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-muted-foreground">Classification Level</label>
                    <div className="p-1.5 rounded-lg border border-border bg-muted/20 font-medium text-foreground text-[11px]">
                      Level 2 - Department
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Information Category</label>
                    <div className="p-1.5 rounded-lg border border-border bg-muted/20 font-medium text-foreground text-[11px]">
                      Process Document
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Regulatory Category</label>
                    <div className="p-1.5 rounded-lg border border-border bg-muted/20 font-medium text-foreground text-[11px]">
                      Internal
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground">Retention Category</label>
                    <div className="p-1.5 rounded-lg border border-border bg-muted/20 font-medium text-foreground text-[11px]">
                      Operational (5 Years)
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-foreground border border-border"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {showAddTag ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                          placeholder="Tag..."
                          className="px-1.5 py-0.5 text-xs rounded border border-blue-400 w-16"
                          autoFocus
                        />
                        <button onClick={handleAddTag} className="text-xs text-blue-600 font-bold">
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddTag(true)}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                      >
                        + Add Tag
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 6: Related Documents (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">6. Related Documents</h2>
                  <button
                    onClick={handleSave}
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
                        <th className="pb-1.5">Document No.</th>
                        <th className="pb-1.5">Title</th>
                        <th className="pb-1.5">Type</th>
                        <th className="pb-1.5">Version</th>
                        <th className="pb-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {DOCUMENT_RELATED_ITEMS.map((doc) => (
                        <tr key={doc.id}>
                          <td className="py-2 font-mono font-semibold text-blue-600">{doc.documentNo}</td>
                          <td className="py-2 font-medium text-foreground max-w-[120px] truncate">{doc.title}</td>
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

              {/* Section 7: Lifecycle Timeline (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">7. Lifecycle Timeline</h2>
                  <button
                    onClick={() => setActiveTab("version-history")}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    View Timeline
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-[10px] font-bold text-foreground mt-1">Draft</span>
                    <span className="text-[8px] text-muted-foreground">10-Aug-2026</span>
                  </div>

                  <div className="flex-1 h-0.5 bg-emerald-500 -mt-5" />

                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-[10px] font-bold text-foreground mt-1">Review</span>
                    <span className="text-[8px] text-muted-foreground">25-Aug-2026</span>
                  </div>

                  <div className="flex-1 h-0.5 bg-emerald-500 -mt-5" />

                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-[10px] font-bold text-foreground mt-1">Approval</span>
                    <span className="text-[8px] text-muted-foreground">30-Aug-2026</span>
                  </div>

                  <div className="flex-1 h-0.5 bg-blue-600 -mt-5" />

                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      ●
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 mt-1">Published</span>
                    <span className="text-[8px] text-muted-foreground">01-Sep-2026</span>
                  </div>

                  <div className="flex-1 h-0.5 bg-muted -mt-5" />

                  <div className="flex flex-col items-center text-center opacity-60">
                    <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
                      ○
                    </div>
                    <span className="text-[10px] font-bold text-foreground mt-1">Next Review</span>
                    <span className="text-[8px] text-muted-foreground">31-Aug-2027</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Section 8, 9, 10 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Section 8: Access Control (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">8. Access Control</h2>
                  <span className="text-[11px] text-muted-foreground">RBAC Matrix</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-1.5">User / Group</th>
                        <th className="pb-1.5">Access</th>
                        <th className="pb-1.5 text-center">Download</th>
                        <th className="pb-1.5 text-center">Print</th>
                        <th className="pb-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {DOCUMENT_ACCESS_RULES.map((rule) => (
                        <tr key={rule.id}>
                          <td className="py-2 font-medium text-foreground">{rule.userGroup}</td>
                          <td className="py-2 text-muted-foreground">{rule.accessLevel}</td>
                          <td className="py-2 text-center">{rule.download ? "✓" : "-"}</td>
                          <td className="py-2 text-center">{rule.print ? "✓" : "-"}</td>
                          <td className="py-2 text-right">
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {rule.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 9: Review & Compliance (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground">9. Review & Compliance</h2>
                    <button
                      onClick={handleSave}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      + Schedule Review
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Last Review Date</div>
                      <div className="font-semibold text-foreground mt-0.5">30-Aug-2026</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">Next Review Date</div>
                      <div className="font-semibold text-foreground mt-0.5">31-Aug-2027</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] text-muted-foreground">Review Frequency</div>
                      <select className="w-full mt-1 p-1 text-xs rounded border border-border bg-background">
                        <option>Annual</option>
                        <option>Semi-Annual</option>
                        <option>Quarterly</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Compliance Status</div>
                      <div className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Compliant</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-muted-foreground">Linked Requirement</div>
                      <div className="font-semibold text-foreground text-[11px]">ISO 9001:2015 - Clause 8.6</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 10: Document Analytics (Col span 4) */}
              <div className="lg:col-span-4 bg-card rounded-xl border border-border p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground">10. Document Analytics</h2>
                  <span className="text-[11px] text-muted-foreground">Last 12 Months</span>
                </div>

                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DOCUMENT_ANALYTICS_MONTHLY} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} />
                      <Tooltip />
                      <Bar dataKey="views" name="Views" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="downloads" name="Downloads" fill="#10B981" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="edits" name="Edits" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Views
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Downloads
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Edits
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Document */}
        {newDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">Register New Document</h3>
                <button onClick={() => setNewDocModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground">Document Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Battery Management System Safety Manual"
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-muted-foreground">Type</label>
                    <select className="w-full mt-1 p-2 rounded-lg border border-border bg-background">
                      <option>SOP</option>
                      <option>Policy</option>
                      <option>Work Instruction</option>
                      <option>Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-muted-foreground">Department</label>
                    <input
                      type="text"
                      defaultValue="Engineering"
                      className="w-full mt-1 p-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setNewDocModal(false)}
                  className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setNewDocModal(false);
                    handleSave();
                  }}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
