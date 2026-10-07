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
  { id: "VER-203", version: "v1.2", effectiveFrom: "01 Apr 2024", effectiveTo: "-", changeType: "Minor Update", changedBy: "Kavita Shah", status: "Active", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  { id: "VER-202", version: "v1.1", effectiveFrom: "01 Jan 2024", effectiveTo: "31 Mar 2024", changeType: "Attribute Update", changedBy: "Kavita Shah", status: "Superseded", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { id: "VER-201", version: "v1.0", effectiveFrom: "01 Jan 2023", effectiveTo: "31 Dec 2023", changeType: "Initial Version", changedBy: "Kavita Shah", status: "Superseded", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
];

function MasterDataManagementPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "attributes" | "governance" | "audit">("overview");

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
    dataOwner: "Deepak Rao",
    dataSteward: "Kavita Shah",
    status: "Active",
    effectiveFrom: "2024-04-01",
    effectiveTo: "",
    version: "v1.2",
    tags: ["Corporate", "IT Solutions", "High Value"],
  });

  // Dynamic Attributes State
  const [attributesList, setAttributesList] = useState([
    { id: "ATT-1", name: "Customer Name", code: "CUST_NAME", type: "Text", mandatory: true, unique: true, status: "Active" },
    { id: "ATT-2", name: "Legal Entity Name", code: "LEGAL_NAME", type: "Text", mandatory: true, unique: false, status: "Active" },
    { id: "ATT-3", name: "Customer Type", code: "CUST_TYPE", type: "Dropdown", mandatory: true, unique: false, status: "Active" },
    { id: "ATT-4", name: "Country Code", code: "COUNTRY", type: "Lookup", mandatory: true, unique: false, status: "Active" },
    { id: "ATT-5", name: "Billing State", code: "STATE", type: "Lookup", mandatory: false, unique: false, status: "Active" },
    { id: "ATT-6", name: "Corporate Email", code: "EMAIL", type: "Text", mandatory: false, unique: true, status: "Active" },
    { id: "ATT-7", name: "Primary Contact Phone", code: "PHONE", type: "Text", mandatory: false, unique: true, status: "Active" },
    { id: "ATT-8", name: "Tax Identification (GSTIN)", code: "TAX_ID", type: "Text", mandatory: true, unique: true, status: "Active" },
  ]);

  // Dynamic Master Registry Records
  const [masterRegistryList, setMasterRegistryList] = useState([
    { id: "MD-001", code: "CUST-000245", name: "ABC Technologies Pvt. Ltd.", type: "CUSTOMER", mod: "CRM", steward: "Kavita Shah", ver: "v1.2", status: "Active" },
    { id: "MD-002", code: "SUPP-000102", name: "Delta Global Hardware Corp", type: "SUPPLIER", mod: "Procurement", steward: "Tanvi Saxena", ver: "v2.0", status: "Active" },
    { id: "MD-003", code: "PROD-000891", name: "Enterprise ERP Cloud License", type: "PRODUCT", mod: "Inventory", steward: "Dinesh Patil", ver: "v1.0", status: "Active" },
    { id: "MD-004", code: "GL-000450", name: "Accounts Receivable - Domestic", type: "CHART OF ACCOUNT", mod: "Finance", steward: "Raghavan Sundaram", ver: "v3.1", status: "Active" },
  ]);

  const [showAddAttrModal, setShowAddAttrModal] = useState(false);
  const [newAttrForm, setNewAttrForm] = useState({
    name: "",
    code: "",
    type: "Text",
    mandatory: true,
    unique: false,
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
      breadcrumb="Management > Organization > Master Data Management"
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
                  <option value="Deepak Rao">Deepak Rao (Commercial Director)</option>
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
                  <option value="Kavita Shah">Kavita Shah (CRM Data Steward)</option>
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
              <div className="relative inline-flex items-center justify-center">
                <svg width="48" height="48" className="transform -rotate-90">
                  <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="3.5" className="text-muted/30" fill="transparent" />
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 19}
                    strokeDashoffset={2 * Math.PI * 19 * (1 - 0.95)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold font-mono text-emerald-600">95%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Workspace Navigation Tabs (Centered & Streamlined) */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 overflow-x-auto border-b border-border/80 pb-2 scrollbar-none">
            {[
              { key: "overview", label: "Master Entity Overview", icon: Layers },
              { key: "attributes", label: "Data Model & Schema Attributes", icon: Sliders },
              { key: "governance", label: "Governance & Quality Matrix", icon: CheckCircle2 },
              { key: "audit", label: "Master Registry & Audit Trail", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer",
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


          {/* OVERVIEW TAB CONTENT */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Row 1: Master Schema Definition | Governance Ownership */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* 2. Master Schema Classification */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    2. Master Schema & Classification
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Entity Domain Type:</span>
                      <span className="font-semibold text-foreground">{masterData.masterType}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Governing Module:</span>
                      <span className="font-semibold text-foreground">{masterData.module}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Primary Key Code:</span>
                      <span className="font-mono font-bold text-primary">{masterData.masterCode}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Deduplication Matching:</span>
                      <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                        Exact & Fuzzy Match Enforced
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Data Governance Custodianship */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                    3. Data Ownership & Stewardship
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Data Owner:</span>
                      <span className="font-semibold text-foreground">{masterData.dataOwner}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Data Steward / Custodian:</span>
                      <span className="font-semibold text-foreground">{masterData.dataSteward}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Effective From:</span>
                      <span className="font-mono text-muted-foreground">{masterData.effectiveFrom}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Synchronization Protocol:</span>
                      <span className="font-semibold text-foreground">Real-time ERP Event Bus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ATTRIBUTES WORKSPACE */}
          {activeTab === "attributes" && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <h4 className="text-xs font-bold text-foreground">Data Model & Key Attributes Schema ({attributesList.length} Fields)</h4>
                <button
                  onClick={() => setShowAddAttrModal(true)}
                  className="px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  + Add Schema Field
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3">Field Name</th>
                      <th className="py-2.5 px-3">Attribute Code</th>
                      <th className="py-2.5 px-3">Data Type</th>
                      <th className="py-2.5 px-3 text-center">Mandatory</th>
                      <th className="py-2.5 px-3 text-center">Unique Index</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-[11px]">
                    {attributesList.map((attr) => (
                      <tr key={attr.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-3 font-semibold text-foreground">{attr.name}</td>
                        <td className="py-2 px-3 font-mono font-bold text-primary">{attr.code}</td>
                        <td className="py-2 px-3 text-muted-foreground">{attr.type}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold", attr.mandatory ? "bg-blue-500/10 text-blue-600" : "text-muted-foreground")}>
                            {attr.mandatory ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold", attr.unique ? "bg-primary/10 text-primary" : "text-muted-foreground")}>
                            {attr.unique ? "Unique" : "-"}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                            {attr.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setAttributesList((prev) => prev.filter((a) => a.id !== attr.id));
                              showNotification(`Attribute ${attr.code} removed.`);
                            }}
                            className="text-rose-500 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GOVERNANCE & QUALITY WORKSPACE */}
          {activeTab === "governance" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Duplicate Detection Rate</span>
                  <div className="text-xl font-bold font-mono text-emerald-600">99.8%</div>
                  <p className="text-[10px] text-muted-foreground">Automated checksum & fuzzy matching</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Golden Record Health</span>
                  <div className="text-xl font-bold font-mono text-blue-600">95.4% Score</div>
                  <p className="text-[10px] text-muted-foreground">All required mandatory fields populated</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 space-y-1">
                  <span className="text-xs text-muted-foreground">Sync Latency</span>
                  <div className="text-xl font-bold font-mono text-primary">&lt; 150 ms</div>
                  <p className="text-[10px] text-muted-foreground">Cross-subsystem replication speed</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-foreground border-b border-border/60 pb-2">
                  Active Data Cleansing & Validation Rules
                </h4>

                <div className="space-y-2.5 text-xs">
                  {[
                    { name: "Tax Identification Strict Format Verification", rule: "Regex validation for standard 15-digit GSTIN format", state: "Active" },
                    { name: "Phone & E.164 Country Code Normalization", rule: "Auto-strips non-numeric characters and formats international prefixes", state: "Active" },
                    { name: "Email Domain Validation & DNS MX Lookup", rule: "Verifies deliverability and prohibits disposable domains", state: "Active" },
                    { name: "Duplicate Legal Name Fuzzy Match Threshold", rule: "Levenshtein distance & similarity index > 85% flags warning", state: "Active" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/15">
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground">{r.name}</span>
                        <p className="text-muted-foreground font-mono text-[11px]">{r.rule}</p>
                      </div>
                      <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/20">
                        {r.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MASTER REGISTRY & AUDIT WORKSPACE */}
          {activeTab === "audit" && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Enterprise Master Records Registry & Lineage Log
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">Unified Golden Records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3">Master ID</th>
                      <th className="py-2.5 px-3">Entity Name</th>
                      <th className="py-2.5 px-3">Domain Type</th>
                      <th className="py-2.5 px-3">Module</th>
                      <th className="py-2.5 px-3">Data Steward</th>
                      <th className="py-2.5 px-3">Version</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-[11px]">
                    {masterRegistryList.map((m) => (
                      <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-primary">{m.code}</td>
                        <td className="py-2 px-3 font-semibold text-foreground">{m.name}</td>
                        <td className="py-2 px-3 text-muted-foreground">{m.type}</td>
                        <td className="py-2 px-3 text-muted-foreground">{m.mod}</td>
                        <td className="py-2 px-3 text-foreground">{m.steward}</td>
                        <td className="py-2 px-3 font-mono">{m.ver}</td>
                        <td className="py-2 px-3">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- ADD ATTRIBUTE MODAL --- */}
        {showAddAttrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Add Master Schema Field</h3>
                </div>
                <button onClick={() => setShowAddAttrModal(false)} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Field Label *</label>
                  <input
                    type="text"
                    placeholder="e.g. Credit Rating Score"
                    value={newAttrForm.name}
                    onChange={(e) => setNewAttrForm({ ...newAttrForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Attribute Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. CREDIT_SCORE"
                    value={newAttrForm.code}
                    onChange={(e) => setNewAttrForm({ ...newAttrForm, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block">Data Type</label>
                  <select
                    value={newAttrForm.type}
                    onChange={(e) => setNewAttrForm({ ...newAttrForm, type: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                  >
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Lookup">Lookup</option>
                    <option value="Date">Date</option>
                    <option value="Boolean">Boolean</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddAttrModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newAttrForm.name || !newAttrForm.code) {
                      alert("Please provide field name and attribute code.");
                      return;
                    }
                    setAttributesList((prev) => [
                      ...prev,
                      {
                        id: `ATT-${prev.length + 1}`,
                        name: newAttrForm.name,
                        code: newAttrForm.code.toUpperCase(),
                        type: newAttrForm.type,
                        mandatory: newAttrForm.mandatory,
                        unique: newAttrForm.unique,
                        status: "Active",
                      },
                    ]);
                    setShowAddAttrModal(false);
                    showNotification(`Attribute ${newAttrForm.code.toUpperCase()} added to schema.`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90"
                >
                  Save Attribute
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Footer Classification & Modification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-[11px] text-muted-foreground font-mono">
          <div>
            MAICW: <span className="text-blue-500 font-bold">M</span> (Mandatory) |{" "}
            <span className="text-amber-500 font-bold">A</span> (Auto) |{" "}
            <span className="text-emerald-500 font-bold">I</span> (Informational) |{" "}
            <span className="text-blue-600 font-bold">C</span> (Calculated) |{" "}
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
