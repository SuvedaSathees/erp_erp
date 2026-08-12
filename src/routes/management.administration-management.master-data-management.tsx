import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Save,
  Send,
  Plus,
  Sliders,
  Clock,
  UserCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Upload,
  Download,
  Share2,
  Lock,
  Archive,
  Edit,
  Building,
  Briefcase,
  FolderTree,
  User,
  Shield,
  Activity,
  History,
  File,
  Check,
  ChevronRight,
  Users,
  Copy,
  GitBranch,
  RefreshCw,
  Tag,
  X,
  FileSpreadsheet,
  Power,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/management/administration-management/master-data-management")({
  head: () => ({
    meta: [
      { title: "Master Data Management · Magnertia ERP" },
      {
        name: "description",
        content: "Central administrative form for creating, maintaining, validating, governing, versioning, and controlling reusable master records across Magnertia ERP.",
      },
    ],
  }),
  component: MasterDataManagementPage,
});

// --- Data & Mock Definitions ---

const MASTER_DATA_TYPES = [
  "CUSTOMER",
  "SUPPLIER",
  "VENDOR",
  "PRODUCT",
  "SERVICE",
  "MATERIAL",
  "ASSET",
  "EMPLOYEE",
  "USER",
  "ROLE",
  "DEPARTMENT",
  "BRANCH",
  "WAREHOUSE",
  "LOCATION",
  "PROJECT",
  "COST CENTRE",
  "PROFIT CENTRE",
  "TAX",
  "CURRENCY",
  "UNIT OF MEASURE",
  "PAYMENT TERM",
  "PRICE LIST",
  "CHART OF ACCOUNT",
  "BANK",
  "COUNTRY",
  "STATE",
  "CITY",
  "INDUSTRY",
  "CATEGORY",
  "BRAND",
  "CUSTOMER SEGMENT",
  "SUPPLIER CATEGORY",
  "DOCUMENT TYPE",
  "POLICY TYPE",
  "WORKFLOW TYPE",
];

const KEY_ATTRIBUTES_DATA = [
  { id: "ATT-1", name: "Customer Name", code: "CUST_NAME", type: "Text", mandatory: true, unique: true, status: "Active", order: 1 },
  { id: "ATT-2", name: "Legal Name", code: "LEGAL_NAME", type: "Text", mandatory: true, unique: false, status: "Active", order: 2 },
  { id: "ATT-3", name: "Customer Type", code: "CUST_TYPE", type: "Dropdown", mandatory: true, unique: false, status: "Active", order: 3 },
  { id: "ATT-4", name: "Country", code: "COUNTRY", type: "Lookup", mandatory: true, unique: false, status: "Active", order: 4 },
  { id: "ATT-5", name: "State", code: "STATE", type: "Lookup", mandatory: false, unique: false, status: "Active", order: 5 },
  { id: "ATT-6", name: "Email", code: "EMAIL", type: "Text", mandatory: false, unique: true, status: "Active", order: 6 },
  { id: "ATT-7", name: "Phone", code: "PHONE", type: "Text", mandatory: false, unique: true, status: "Active", order: 7 },
  { id: "ATT-8", name: "Status", code: "STATUS", type: "Dropdown", mandatory: true, unique: false, status: "Active", order: 8 },
];

const RECENT_MASTER_VERSIONS = [
  { id: "VER-203", version: "v1.2", effectiveFrom: "01 Apr 2024", effectiveTo: "-", changeType: "Minor Update", changedBy: "Neha Kapoor", status: "Active", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "VER-202", version: "v1.1", effectiveFrom: "01 Jan 2024", effectiveTo: "31 Mar 2024", changeType: "Attribute Update", changedBy: "Amit Verma", status: "Superseded", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "VER-201", version: "v1.0", effectiveFrom: "01 Jan 2023", effectiveTo: "31 Dec 2023", changeType: "Initial Version", changedBy: "Amit Verma", status: "Superseded", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
];

export function MasterDataManagementPage() {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "attributes"
    | "relationships"
    | "classification"
    | "ownership"
    | "validation"
    | "approval"
    | "versions"
    | "change-control"
    | "usage"
    | "attachments"
    | "audit"
  >("overview");

  // Master Form State
  const [masterData, setMasterData] = useState({
    masterId: "MD-2024-000127",
    masterCode: "CUST-000245",
    masterName: "ABC Technologies Pvt. Ltd.",
    masterType: "CUSTOMER",
    masterCategory: "Customer",
    description: "Corporate customer for IT hardware and software solutions.",
    module: "CRM",
    submodule: "Customer Management",
    businessFunction: "Sales & Marketing",
    organization: "Magnertia Pvt. Ltd.",
    dataOwner: "Neha Kapoor",
    dataSteward: "Amit Verma",
    status: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "",
    version: "v1.2",
    tags: ["Corporate", "IT Solutions", "High Value"],
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const removeTag = (tagToRemove: string) => {
    setMasterData({
      ...masterData,
      tags: masterData.tags.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <AppShell
      title="Master Data Management"
      breadcrumb="Management > Administration Management > Master Data Management"
      description="Central administrative form for creating, maintaining, validating, governing, versioning, and controlling reusable master records across Magnertia ERP."
      tabs={<AdminManagementTabBar />}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#0a192f] border border-primary/40 px-4 py-3 text-sm text-white shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Top Header Actions & Workflow Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-foreground">Master Data Form</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  {masterData.status}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                  {masterData.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                MAICW Classification · Enterprise Master Repository & Data Governance Engine
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showNotification("Duplicate detection scan complete: No matching records found.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5 text-primary" />
              Duplicate Check
            </button>

            <button
              onClick={() => showNotification("Data Quality audit complete: 95% Completeness & Consistency score.")}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Data Quality
            </button>

            <button
              onClick={() => showNotification("Master Data record saved successfully.")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>

            <button
              onClick={() => showNotification("Submitted for Data Steward Review & Business Owner Approval.")}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* 1. Master Data Master Form & Snapshot Side Card (Matching Attached Reference Screenshot) */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left 9 columns: Master Data Fields */}
          <div className="lg:col-span-9 rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="text-primary">1.</span> Master Data Master
              </h3>
              <span className="text-[11px] text-muted-foreground font-medium">
                MAICW Fields: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
                <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
                <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
                <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
                <span className="text-rose-500 font-bold">W</span> (Workflow)
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Auto Fields */}
              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Master Data ID</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={masterData.masterId}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Master Code *</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  value={masterData.masterCode}
                  onChange={(e) => setMasterData({ ...masterData, masterCode: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Master Name *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <input
                  type="text"
                  value={masterData.masterName}
                  onChange={(e) => setMasterData({ ...masterData, masterName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Master Type *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={masterData.masterType}
                  onChange={(e) => setMasterData({ ...masterData, masterType: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {MASTER_DATA_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Master Category *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <select
                  value={masterData.masterCategory}
                  onChange={(e) => setMasterData({ ...masterData, masterCategory: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Customer">Customer</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Product">Product</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Module *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={masterData.module}
                  onChange={(e) => setMasterData({ ...masterData, module: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="CRM">CRM</option>
                  <option value="SCM">SCM</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Submodule</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={masterData.submodule}
                  onChange={(e) => setMasterData({ ...masterData, submodule: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Customer Management">Customer Management</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Business Function</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={masterData.businessFunction}
                  onChange={(e) => setMasterData({ ...masterData, businessFunction: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Sales & Marketing">Sales & Marketing</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Organization *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={masterData.organization}
                  onChange={(e) => setMasterData({ ...masterData, organization: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Magnertia Pvt. Ltd.">Magnertia Pvt. Ltd.</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Data Owner *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={masterData.dataOwner}
                  onChange={(e) => setMasterData({ ...masterData, dataOwner: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Neha Kapoor">Neha Kapoor (Sales Director)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Data Steward *</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">I</span>
                </label>
                <select
                  value={masterData.dataSteward}
                  onChange={(e) => setMasterData({ ...masterData, dataSteward: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Amit Verma">Amit Verma (CRM Data Steward)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Status *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <select
                  value={masterData.status}
                  onChange={(e) => setMasterData({ ...masterData, status: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective From *</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={masterData.effectiveFrom}
                  onChange={(e) => setMasterData({ ...masterData, effectiveFrom: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Effective To</span>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1 rounded">W</span>
                </label>
                <input
                  type="date"
                  value={masterData.effectiveTo}
                  onChange={(e) => setMasterData({ ...masterData, effectiveTo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Version</span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">A</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={masterData.version}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              {/* Description Box */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Description *</span>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1 rounded">M</span>
                </label>
                <textarea
                  rows={2}
                  value={masterData.description}
                  onChange={(e) => setMasterData({ ...masterData, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* Tags Box */}
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground block mb-1">Tags</label>
                <div className="flex flex-wrap items-center gap-1.5 bg-muted/20 p-2 rounded-lg border border-border/60 min-h-[38px]">
                  {masterData.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-md bg-background border border-border px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                      {t}
                      <button onClick={() => removeTag(t)} className="text-muted-foreground hover:text-rose-500 cursor-pointer">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const nt = prompt("Enter tag:");
                      if (nt) setMasterData({ ...masterData, tags: [...masterData.tags, nt] });
                    }}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer ml-1"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right 3 columns: Master Data Snapshot Side Card */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Master Data Snapshot</h4>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {masterData.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-bold text-foreground font-mono">v1.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created On</span>
                  <span className="font-mono text-muted-foreground text-[10px]">01 Apr 2024 09:15 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Created By</span>
                  <span className="font-semibold text-foreground">Amit Verma</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-mono text-muted-foreground text-[10px]">15 Apr 2024 11:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Updated By</span>
                  <span className="font-semibold text-foreground">Neha Kapoor</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Approval Status</span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                    Approved
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duplicate Check</span>
                  <span className="font-bold text-emerald-600 text-[11px] flex items-center gap-1">
                    <Check className="h-3 w-3" /> No Duplicates
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active References</span>
                  <span className="font-bold text-primary font-mono">18</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">Data Quality Score</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Excellent</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-full border-4 border-emerald-500 text-xs font-bold font-mono text-emerald-600">
                95%
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "overview", label: "Overview", icon: Layers },
              { key: "attributes", label: "Attributes", icon: Sliders },
              { key: "relationships", label: "Relationships", icon: GitBranch },
              { key: "classification", label: "Classification", icon: Shield },
              { key: "ownership", label: "Ownership", icon: UserCheck },
              { key: "validation", label: "Validation", icon: CheckCircle2 },
              { key: "approval", label: "Approval", icon: FileCheck },
              { key: "versions", label: "Versions", icon: History },
              { key: "change-control", label: "Change Control", icon: RefreshCw },
              { key: "usage", label: "Usage", icon: TrendingUp },
              { key: "attachments", label: "Attachments", icon: File },
              { key: "audit", label: "Audit Trail", icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* OVERVIEW TAB CONTENT (Matching attached screenshot layout) */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: 2. Classification | 4. Key Attributes (8) | 5. Relationships Overview */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 2. Classification */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Classification
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[11px] text-muted-foreground block">Classification Level</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Level 2 - Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Data Domain</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>Customer Domain</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Data Category</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>External Master</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">Criticality</span>
                      <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-500/20">
                        High
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">Confidentiality</span>
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                        Internal
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Regulatory Classification</label>
                      <select className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                        <option>General</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[11px]">Sensitivity</span>
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                        Internal
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground block">Classification Owner</label>
                      <input
                        type="text"
                        readOnly
                        value="Pooja Mehta"
                        className="mt-0.5 w-full rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-border/50">
                      <span className="text-muted-foreground text-[11px]">Classification Status</span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Key Attributes (8) */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground">4. Key Attributes (8)</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                          <th className="py-1 px-1">Attribute Name</th>
                          <th className="py-1 px-1">Code</th>
                          <th className="py-1 px-1">Data Type</th>
                          <th className="py-1 px-1 text-center">Mandatory</th>
                          <th className="py-1 px-1 text-center">Unique</th>
                          <th className="py-1 px-1">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-[10px]">
                        {KEY_ATTRIBUTES_DATA.map((att) => (
                          <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-1 px-1 font-medium text-foreground">{att.name}</td>
                            <td className="py-1 px-1 font-mono text-[9px] text-muted-foreground">{att.code}</td>
                            <td className="py-1 px-1 text-muted-foreground">{att.type}</td>
                            <td className="py-1 px-1 text-center">
                              {att.mandatory ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 inline" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="py-1 px-1 text-center">
                              {att.unique ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 inline" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="py-1 px-1">
                              <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[9px] font-bold text-emerald-600">
                                {att.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => showNotification("Full attributes catalog opened.")}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer pt-1"
                  >
                    View All Attributes
                  </button>
                </div>

                {/* 5. Relationships Overview */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      5. Relationships Overview
                    </h4>

                    {/* Hierarchy Tree Diagram */}
                    <div className="space-y-2 py-2 text-center text-[10px]">
                      <div className="rounded-lg border border-primary/40 bg-primary/10 p-2 font-bold text-primary">
                        ABC Technologies Pvt. Ltd.
                      </div>
                      <div className="h-2 w-0.5 bg-border mx-auto" />

                      <div className="grid grid-cols-3 gap-1">
                        <div className="rounded border border-border bg-muted/20 p-1.5">
                          <span className="text-muted-foreground block text-[9px]">Customer Group</span>
                          <span className="font-bold text-foreground truncate block">Corporate</span>
                        </div>

                        <div className="rounded border border-border bg-muted/20 p-1.5">
                          <span className="text-muted-foreground block text-[9px]">Customer Category</span>
                          <span className="font-bold text-foreground truncate block">IT Services</span>
                        </div>

                        <div className="rounded border border-border bg-muted/20 p-1.5">
                          <span className="text-muted-foreground block text-[9px]">Company Hierarchy</span>
                          <span className="font-bold text-foreground truncate block">Level 2</span>
                        </div>
                      </div>

                      <div className="h-2 w-0.5 bg-border mx-auto" />

                      <div className="grid grid-cols-3 gap-1">
                        <div className="rounded border border-border bg-card p-1.5">
                          <span className="text-muted-foreground block text-[9px]">Price List</span>
                          <span className="font-mono text-foreground font-bold text-[9px]">CORP-PL-01</span>
                        </div>

                        <div className="rounded border border-border bg-card p-1.5">
                          <span className="text-muted-foreground block text-[9px]">Payment Term</span>
                          <span className="font-mono text-foreground font-bold text-[9px]">NET 30</span>
                        </div>

                        <div className="rounded border border-border bg-card p-1.5">
                          <span className="text-muted-foreground block text-[9px]">Tax Classification</span>
                          <span className="font-mono text-foreground font-bold text-[9px]">GST-REG</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Entity relationship graph loaded.")}
                    className="w-full text-center py-1.5 rounded-lg border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    View All Relationships
                  </button>
                </div>
              </div>

              {/* Row 2: 3. Ownership Summary | 7. Version History | 8. Quick Actions */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* 3. Ownership Summary */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Ownership Summary
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Completeness</span>
                        <span className="font-mono font-bold text-foreground">96%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[96%] rounded-full bg-emerald-500" />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-mono font-bold text-foreground">94%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[94%] rounded-full bg-emerald-500" />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Consistency</span>
                        <span className="font-mono font-bold text-foreground">93%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[93%] rounded-full bg-blue-500" />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Timeliness</span>
                        <span className="font-mono font-bold text-foreground">98%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full w-[98%] rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                    <div>
                      <span className="text-muted-foreground text-[10px] block">Usage Count</span>
                      <span className="font-bold text-foreground font-mono">18</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-[10px] block">Last Used On</span>
                      <span className="font-mono text-muted-foreground text-[10px]">15 Apr 2024</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-[10px] block">Active In Modules</span>
                      <span className="font-semibold text-foreground text-[11px]">CRM, SCM, FIN</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-[10px] block">Change Requests</span>
                      <span className="font-bold text-primary font-mono">2</span>
                    </div>
                  </div>
                </div>

                {/* 7. Version History */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                      7. Version History
                    </h4>

                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[10px]">
                            <th className="py-1 px-1">Version</th>
                            <th className="py-1 px-1">Effective From</th>
                            <th className="py-1 px-1">Effective To</th>
                            <th className="py-1 px-1">Change Type</th>
                            <th className="py-1 px-1">Changed By</th>
                            <th className="py-1 px-1">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 text-[10px]">
                          {RECENT_MASTER_VERSIONS.map((v) => (
                            <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-1 px-1 font-mono font-bold text-foreground">{v.version}</td>
                              <td className="py-1 px-1 font-mono text-muted-foreground">{v.effectiveFrom}</td>
                              <td className="py-1 px-1 font-mono text-muted-foreground">{v.effectiveTo}</td>
                              <td className="py-1 px-1 font-medium">{v.changeType}</td>
                              <td className="py-1 px-1 text-muted-foreground">{v.changedBy}</td>
                              <td className="py-1 px-1">
                                <span className={cn("rounded px-1 py-0.2 text-[9px] font-bold border", v.badge)}>
                                  {v.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification("Complete version diff audit trail loaded.")}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer pt-1"
                  >
                    View All Versions
                  </button>
                </div>

                {/* 8. Quick Actions */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    8. Quick Actions
                  </h4>

                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <button
                      onClick={() => showNotification("New master record creation opened.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-4 w-4 text-emerald-600" />
                      <span>New Record</span>
                    </button>

                    <button
                      onClick={() => showNotification("Edit record enabled.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                      <span>Edit Record</span>
                    </button>

                    <button
                      onClick={() => showNotification("Master record cloned.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-4 w-4 text-purple-600" />
                      <span>Clone Record</span>
                    </button>

                    <button
                      onClick={() => showNotification("Deactivation process initiated.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer text-rose-600"
                    >
                      <Power className="h-4 w-4" />
                      <span>Deactivate</span>
                    </button>

                    <button
                      onClick={() => showNotification("Change request form opened.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4 text-amber-600" />
                      <span>Change Request</span>
                    </button>

                    <button
                      onClick={() => showNotification("Approval sign-off granted.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Approve Record</span>
                    </button>

                    <button
                      onClick={() => showNotification("Cross-module references loaded.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>View References</span>
                    </button>

                    <button
                      onClick={() => showNotification("Master data export started.")}
                      className="p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted font-medium flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-emerald-600" />
                      <span>Export Data</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS PLACEHOLDER */}
          {activeTab !== "overview" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="text-sm font-bold text-foreground capitalize">{activeTab} Workspace</h4>
                <span className="text-xs text-muted-foreground">Master Data ID: MD-2024-000127</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed parameters for <span className="font-semibold text-foreground capitalize">{activeTab}</span> adhering to MAICW specification.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Data Uniqueness</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">Verified Unique</span>
                  <p className="text-[11px] text-muted-foreground">0 duplicate records found in customer domain.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">ERP Synchronization</span>
                  <span className="text-xl font-bold font-mono text-blue-600">Sync Complete</span>
                  <p className="text-[11px] text-muted-foreground">Active in CRM, SCM, and Finance modules.</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1">
                  <span className="text-xs font-bold text-foreground block">Governance Rating</span>
                  <span className="text-xl font-bold font-mono text-emerald-600">High Quality</span>
                  <p className="text-[11px] text-muted-foreground">95% complete master record profile.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Classification & Modification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-purple-500 font-bold">C</span> (Calculated) |{" "}
            <span className="text-rose-500 font-bold">W</span> (Workflow)
          </div>
          <div>
            Last Modified: <span className="font-sans font-semibold text-foreground">15 Apr 2024 11:30 AM</span> by <span className="font-sans font-semibold text-foreground">Neha Kapoor</span> | Created By: <span className="font-sans font-semibold text-foreground">Amit Verma</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
