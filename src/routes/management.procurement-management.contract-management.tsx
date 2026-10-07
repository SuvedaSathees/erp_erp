import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  FileSpreadsheet,
  FileText,
  ShoppingCart,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Plus,
  Save,
  Send,
  Printer,
  MoreHorizontal,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  User,
  Users,
  ShieldCheck,
  Check,
  X,
  Edit,
  Trash2,
  Paperclip,
  Upload,
  ArrowRight,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Info,
  Sliders,
  AlertCircle,
  Zap,
  Tag,
  Star,
  CheckSquare,
  Sparkles,
  Award,
  Eye,
  Copy,
  FolderOpen,
  HelpCircle,
  FileCode,
  StickyNote,
  Mail,
  Phone,
  BarChart3,
  Scale,
  Handshake,
  MessageSquare,
  FileCheck,
  Shield,
  Truck,
  Percent,
  FileBadge,
  PackageCheck,
  CreditCard,
  Ban,
  FilePenLine,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Contract Management Module · Procurement Management
export const Route = createFileRoute("/management/procurement-management/contract-management")({
  head: () => ({
    meta: [
      { title: "Contract Management · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Contract Management Form — lifecycle administration, legal review, milestone tracking, value utilization, amendments, renewals, and risk management.",
      },
    ],
  }),
  component: ContractManagementPage,
});

// --- DATA TYPES ---

interface ContractMilestone {
  id: number;
  milestoneName: string;
  plannedDate: string;
  actualDate?: string;
  value: number;
  paymentPercent: number;
  status: "Pending" | "In Progress" | "Completed";
  progressPercent: number;
}

interface ContractAmendment {
  amendmentNo: string;
  type: string;
  effectiveDate: string;
  valueChange: number;
  status: "Approved" | "Under Review" | "Draft";
}

interface ContractDoc {
  id: number;
  name: string;
  version: string;
  uploadedOn: string;
  status: "Signed" | "Approved" | "Pending";
}

// --- INITIAL MASTER DATA ---

const INITIAL_CONTRACT_HEADER = {
  contractId: "CNT-ID-8400",
  contractNumber: "CNT-2026-000084",
  contractTitle: "Smart EV Charging Infrastructure Supply Agreement",
  contractType: "Supply Agreement",
  contractStatus: "Active" as const,
  vendor: "ElectroMax Solutions Pvt. Ltd.",
  vendorCode: "VEND-00452",
  contractOwner: "Rahul Sharma",
  department: "Procurement",
  project: "EV Infrastructure Project",
  costCenter: "CC-ELEC-402",
  currency: "INR - Indian Rupee",
  effectiveDate: "01 Jun 2026",
  expiryDate: "31 May 2027",
  contractDuration: "12 Months",
  contractPriority: "High" as const,
  // Commercials
  contractValue: 24800000.0,
  minimumCommitment: 10000000.0,
  maximumCommitment: 30000000.0,
  taxIncluded: "GST @ 18%",
  paymentTerms: "30 Days Credit",
  advancePayment: 2480000.0,
  advancePercent: 10,
  performanceGuarantee: 1240000.0,
  guaranteePercent: 5,
  noticePeriod: "60 Days",
  autoRenewal: "No",
  renewalOption: "Yes",
  nextReviewDate: "01 Nov 2026",
  // Utilization
  committedValue: 14200000.0,
  deliveredValue: 9600000.0,
  invoicedValue: 8250000.0,
  paidValue: 7500000.0,
  remainingValue: 10600000.0,
  utilizationPercent: 71,
  // Contracting Party
  legalName: "ElectroMax Solutions Pvt. Ltd.",
  gstin: "07AABCE1234F1Z5",
  pan: "AABCE1234F",
  contactPerson: "Amit Verma",
  email: "amit.verma@electromax.com",
  phone: "+91 98765 43210",
  authorizedSignatory: "Amit Verma",
  designation: "Director - Operations",
  // Performance
  overallRating: 4.6,
  onTimeDelivery: 94,
  qualityAcceptance: 97,
  slaCompliance: 96,
  costCompliance: 98,
  safetyCompliance: 100,
};

const INITIAL_MILESTONES: ContractMilestone[] = [
  { id: 1, milestoneName: "Design Approval", plannedDate: "15 Jun 2026", value: 1240000.0, paymentPercent: 5, status: "Pending", progressPercent: 0 },
  { id: 2, milestoneName: "Prototype Delivery", plannedDate: "30 Jun 2026", value: 2480000.0, paymentPercent: 10, status: "Pending", progressPercent: 0 },
  { id: 3, milestoneName: "Phase 1 Supply", plannedDate: "31 Aug 2026", value: 7440000.0, paymentPercent: 30, status: "In Progress", progressPercent: 45 },
  { id: 4, milestoneName: "Phase 2 Supply", plannedDate: "30 Nov 2026", value: 6200000.0, paymentPercent: 25, status: "Pending", progressPercent: 0 },
  { id: 5, milestoneName: "Final Delivery & Handover", plannedDate: "31 Mar 2027", value: 7440000.0, paymentPercent: 30, status: "Pending", progressPercent: 0 },
];

const INITIAL_AMENDMENTS: ContractAmendment[] = [
  { amendmentNo: "AMND-2026-0001", type: "Price Revision", effectiveDate: "01 Apr 2026", valueChange: 500000.0, status: "Approved" },
];

const INITIAL_DOCS: ContractDoc[] = [
  { id: 1, name: "Smart_EV_Contract_Final.pdf", version: "1.0", uploadedOn: "25 May 2026", status: "Signed" },
  { id: 2, name: "Scope_of_Work.pdf", version: "1.0", uploadedOn: "20 May 2026", status: "Approved" },
  { id: 3, name: "Legal_Review_Report.pdf", version: "1.0", uploadedOn: "20 May 2026", status: "Approved" },
];

export function ContractManagementPage() {
  // Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<string>("scope");

  // State
  const [header, setHeader] = useState(INITIAL_CONTRACT_HEADER);
  const [milestones, setMilestones] = useState<ContractMilestone[]>(INITIAL_MILESTONES);
  const [amendments, setAmendments] = useState<ContractAmendment[]>(INITIAL_AMENDMENTS);
  const [documents, setDocuments] = useState<ContractDoc[]>(INITIAL_DOCS);

  // Modals
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);

  // Document Upload Form
  const [docUploadForm, setDocUploadForm] = useState({
    name: "",
    version: "1.0",
    status: "Signed" as const,
  });

  // Actions
  const handleSaveDraft = () => {
    toast.success("Contract record draft saved.");
  };

  const handleSubmitReview = () => {
    setShowReviewModal(true);
  };

  const handleApproveContract = () => {
    setShowApproveModal(true);
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = docUploadForm.name.trim() || `Contract_Doc_${Date.now()}.pdf`;
    const newDoc: ContractDoc = {
      id: documents.length + 1,
      name: fileName,
      version: docUploadForm.version || "1.0",
      uploadedOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: docUploadForm.status,
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadDocModal(false);
    setDocUploadForm({ name: "", version: "1.0", status: "Signed" });
    toast.success(`Document '${fileName}' attached to Contract docket!`);
  };

  const handleDownloadDocument = (fileName: string) => {
    try {
      const dummyContent = `MAGNERTIA ERP - CONTRACT DOCUMENT ATTACHMENT\nContract Ref: CNT-2026-000084\nTitle: Smart EV Charging Infrastructure Supply Agreement\nVendor: ElectroMax Solutions Pvt. Ltd.\nFile: ${fileName}\nGenerated: ${new Date().toISOString()}\nStatus: Verified Legal Contract\n\n[Authenticated via Magnertia Legal Gateway]`;
      const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName.endsWith(".pdf") || fileName.endsWith(".docx") ? fileName : `${fileName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded '${fileName}'`);
    } catch {
      toast.info(`Downloading '${fileName}'...`);
    }
  };

  const handleDeleteDocument = (id: number, name: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    toast.info(`Document '${name}' removed.`);
  };

  return (
    <AppShell
      title="Contract Management"
      breadcrumb="Management > Procurement Management"
      description="The Contract Management Form manages the complete lifecycle of supplier, vendor, service, and project contracts—from drafting and negotiation to approval, execution, performance monitoring, renewal, and closure."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP MASTER HEADER & CONTROLS (Pixel-Matched with Screenshot!) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Row: Icon + Number + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    Active
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {header.contractNumber}
                  </h1>
                </div>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {header.contractTitle}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleApproveContract}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve Contract
              </button>

              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New Contract
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print Contract Document"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Vendor / Party</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{header.vendor}</div>
              <div className="text-[10px] text-muted-foreground font-mono">({header.vendorCode})</div>
              <div className="text-[10px] text-muted-foreground mt-1">Type: <strong>{header.contractType}</strong></div>
              <div className="text-[10px] text-muted-foreground">Owner: <strong>{header.contractOwner}</strong></div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Effective Date</div>
              <div className="font-bold text-foreground mt-0.5">{header.effectiveDate}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Expiry Date: <strong className="text-foreground">{header.expiryDate}</strong></div>
              <div className="text-[10px] text-muted-foreground mt-1">Contract Value:</div>
              <div className="font-black text-primary font-mono text-xs">₹ {header.contractValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Department</div>
              <div className="font-bold text-foreground mt-0.5">{header.department}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Project: <strong className="text-foreground">{header.project}</strong></div>
              <div className="text-[10px] text-muted-foreground mt-1">Currency: {header.currency}</div>
              <div className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                ● Priority: {header.contractPriority} · Duration: {header.contractDuration}
              </div>
            </div>

            <div className="lg:col-span-4 p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="28" className="stroke-muted/30" strokeWidth="5.5" fill="transparent" />
                    <circle
                      cx="36"
                      cy="36"
                      r="28"
                      className="stroke-emerald-500 transition-all duration-500"
                      strokeWidth="5.5"
                      strokeDasharray={175.93}
                      strokeDashoffset={175.93 * (1 - header.utilizationPercent / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 leading-none">{header.utilizationPercent}%</span>
                    <span className="text-[8px] text-muted-foreground font-bold uppercase mt-0.5">Utilized</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-blue-600 font-medium flex items-center gap-1">● Committed</span>
                    <strong>₹ 1,42,00,000</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-amber-600 font-medium flex items-center gap-1">● Delivered</span>
                    <strong>₹ 96,00,000</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-teal-600 font-medium flex items-center gap-1">● Invoiced</span>
                    <strong>₹ 82,50,000</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-emerald-600 font-medium flex items-center gap-1">● Paid</span>
                    <strong>₹ 75,00,000</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3 col-span-2 pt-0.5 border-t border-border">
                    <span className="text-primary font-medium flex items-center gap-1">● Remaining</span>
                    <strong className="text-primary">₹ 1,06,00,000</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SUB-MODULE TABS - Streamlined & Essential Only */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "scope", label: "Scope & Deliverables", icon: CheckSquare },
            { id: "lineItems", label: "Bill of Quantities & Rates", icon: ShoppingCart },
            { id: "milestones", label: "Milestones & Triggers", icon: Calendar },
            { id: "documents", label: "Legal Dossiers & Amendments", icon: Paperclip },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-all border-b-2 cursor-pointer",
                  isActive
                    ? "border-primary text-primary font-bold bg-primary/5 rounded-t-lg"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SCOPE & DELIVERABLES */}
        {activeTab === "scope" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                Scope of Work, Deliverables & Legal Terms
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-2">
                  <span className="font-bold text-foreground text-sm">Hardware & Equipment Scope</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Supply of 250 units of High-voltage EV Charging Stations (Model EV-PRO-60kW) compliant with BIS and IEC-61851 standards. Includes on-site delivery, unloading, and foundational anchoring.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-2">
                  <span className="font-bold text-foreground text-sm">Installation & SLA Scope</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Turnkey installation, testing, commissioning, grid synchronization, and 3-year comprehensive warranty with 99.5% uptime SLA and 4-hour max response time.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                  <strong className="text-foreground block mb-0.5">Clause 4.1: Liquidated Damages (LD)</strong>
                  <p className="text-muted-foreground">0.5% per week of delay up to a ceiling cap of 10% of total milestone value.</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                  <strong className="text-foreground block mb-0.5">Clause 7.3: Performance Guarantee (PBG)</strong>
                  <p className="text-muted-foreground">5% Bank Guarantee valid for 36 months + 60 days claim period from bank.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LINE ITEMS */}
        {activeTab === "lineItems" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Contract Bill of Quantities & Schedule of Rates
                  </h3>
                  <p className="text-xs text-muted-foreground">Contractual pricing and schedule of items</p>
                </div>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5">Code</th>
                      <th className="p-2.5">UOM</th>
                      <th className="p-2.5 text-right">Agreed Qty</th>
                      <th className="p-2.5 text-right">Rate (INR)</th>
                      <th className="p-2.5 text-right">Total Value</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    <tr>
                      <td className="p-2.5 font-mono">1</td>
                      <td className="p-2.5 font-bold">Fast DC Charger 60kW Dual Gun</td>
                      <td className="p-2.5 font-mono text-muted-foreground">EV-CHG-60KW</td>
                      <td className="p-2.5">Nos</td>
                      <td className="p-2.5 text-right font-medium">100</td>
                      <td className="p-2.5 text-right font-mono">₹ 1,50,000.00</td>
                      <td className="p-2.5 text-right font-bold font-mono">₹ 1,50,00,000.00</td>
                      <td className="p-2.5 text-center">
                        <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[9px] font-bold">Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono">2</td>
                      <td className="p-2.5 font-bold">AC Type-2 Commercial Charger 22kW</td>
                      <td className="p-2.5 font-mono text-muted-foreground">EV-CHG-22KW</td>
                      <td className="p-2.5">Nos</td>
                      <td className="p-2.5 text-right font-medium">150</td>
                      <td className="p-2.5 text-right font-mono">₹ 65,333.33</td>
                      <td className="p-2.5 text-right font-bold font-mono">₹ 98,00,000.00</td>
                      <td className="p-2.5 text-center">
                        <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[9px] font-bold">Active</span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-muted/40 font-bold border-t border-border text-xs">
                    <tr>
                      <td colSpan={6} className="p-2.5">Total Contract Value</td>
                      <td className="p-2.5 text-right text-primary font-black">₹ 2,48,00,000.00</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MILESTONES */}
        {activeTab === "milestones" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Contract Milestones & Payment Schedule
                  </h3>
                  <p className="text-xs text-muted-foreground">Tracking delivery phases, progress bars, and payment release triggers</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("Add milestone...")}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  + Add Milestone
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="p-2.5">Milestone</th>
                      <th className="p-2.5">Target Date</th>
                      <th className="p-2.5 text-right">Value (INR)</th>
                      <th className="p-2.5 text-right">% Weight</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {milestones.map((m) => (
                      <tr key={m.id}>
                        <td className="p-2.5 font-bold">{m.milestoneName}</td>
                        <td className="p-2.5 text-muted-foreground">{m.plannedDate}</td>
                        <td className="p-2.5 text-right font-mono font-medium">₹ {m.value.toLocaleString("en-IN")}</td>
                        <td className="p-2.5 text-right font-mono">{m.paymentPercent}%</td>
                        <td className="p-2.5 text-center">
                          <span className={cn("rounded px-2 py-0.5 text-[9px] font-bold", m.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600")}>
                            {m.status}
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

        {/* TAB 4: DOCUMENTS & AMENDMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            {/* Legal Documents */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Contract Legal Documents & Signed Annexures ({documents.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">Executed agreements, scope of work addendums, and legal clearances</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(true)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Document
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Document Name</th>
                      <th className="py-2.5 px-3">Version</th>
                      <th className="py-2.5 px-3">Uploaded On</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{doc.id}</td>
                        <td className="py-3 px-3 font-bold text-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-primary" /> {doc.name}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px]">v{doc.version}</td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.uploadedOn}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleDownloadDocument(doc.name)}
                              className="text-primary hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" /> Download
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDocument(doc.id, doc.name)}
                              className="text-muted-foreground hover:text-rose-600 p-1 cursor-pointer transition-colors"
                              title="Delete Document"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Amendments Table */}
            <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FilePenLine className="h-4 w-4 text-primary" />
                    Contract Variation Orders & Amendments ({amendments.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">Formal changes to contract scope, timelines, or pricing</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info("New amendment draft...")}
                  className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 cursor-pointer"
                >
                  + Create Amendment
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="p-2.5">Amendment No</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5 text-right">Value Impact</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {amendments.map((am) => (
                      <tr key={am.amendmentNo}>
                        <td className="p-2.5 font-mono font-bold text-primary">{am.amendmentNo}</td>
                        <td className="p-2.5 text-muted-foreground">{am.effectiveDate}</td>
                        <td className="p-2.5">{am.type}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-600">+ ₹ {am.valueChange.toLocaleString("en-IN")}</td>
                        <td className="p-2.5 text-center">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[9px] font-bold">
                            {am.status}
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

        {/* MODAL: NEW CONTRACT */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Create New Enterprise Contract</h3>
                    <p className="text-xs text-muted-foreground">Draft agreement with commercial and legal clauses</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Contract Title *</label>
                  <input
                    type="text"
                    defaultValue="Smart EV Charging Infrastructure Supply Agreement"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Contract Type *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Supply Agreement</option>
                    <option>Annual Maintenance Contract (AMC)</option>
                    <option>Framework Agreement / Rate Contract</option>
                    <option>Master Service Agreement (MSA)</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Vendor / Contracting Party *</label>
                  <input
                    type="text"
                    defaultValue="ElectroMax Solutions Pvt. Ltd. (VEND-00452)"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Total Contract Value (INR) *</label>
                  <input
                    type="text"
                    defaultValue="₹ 2,48,00,000.00"
                    className="w-full rounded-lg border border-border bg-background p-2 text-primary font-mono font-black"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Contract draft initialized!");
                    setShowNewModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Create & Initiate Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: SUBMIT REVIEW */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FilePenLine className="h-4 w-4 text-blue-500" />
                  Initiate Legal & Departmental Review
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
                  <div>Contract: <strong className="text-foreground">{header.contractNumber}</strong></div>
                  <div>Legal Counsel: <strong>Adv. Siddharth Sen (Head of Legal)</strong></div>
                  <div>Clauses Under Scan: <strong>15 Core Clauses (Indemnity, Liability, Warranty)</strong></div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Legal review requested.");
                    setShowReviewModal(false);
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                >
                  Send to Legal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: APPROVE CONTRACT */}
        {showApproveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Executive Contract Sign-off
                </h3>
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div>Contract Value: <strong className="text-emerald-700 dark:text-emerald-300 font-bold">₹ 2,48,00,000.00</strong></div>
                  <div>Approver: <strong>Rahul Sharma (Procurement Head)</strong></div>
                  <div>Digital Signatures: <strong>Both Parties Verified</strong></div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Contract CNT-2026-000084 activated!");
                    setShowApproveModal(false);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Approve & Activate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT CONTRACT DOCKET */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ENTERPRISE</div>
                  <div className="text-xs font-semibold text-slate-500">OFFICIAL LEGAL CONTRACT AGREEMENT</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{header.contractNumber}</div>
                  <div className="text-slate-500">Effective: {header.effectiveDate} · Expiry: {header.expiryDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">First Party (Company)</div>
                  <div className="mt-1 font-semibold">Magnertia Systems Private Limited</div>
                  <div className="text-slate-500">Owner: {header.contractOwner} · Dept: {header.department}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Second Party (Vendor / Contractor)</div>
                  <div className="mt-1 font-semibold">{header.legalName}</div>
                  <div className="text-slate-500">GSTIN: {header.gstin} · Signatory: {header.authorizedSignatory}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Milestone Schedule & Payment Tranches</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">Milestone</th>
                      <th className="p-2">Planned Date</th>
                      <th className="p-2 text-right">Tranche Value</th>
                      <th className="p-2 text-center">% Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {milestones.map((m) => (
                      <tr key={m.id}>
                        <td className="p-2 font-bold">{m.milestoneName}</td>
                        <td className="p-2">{m.plannedDate}</td>
                        <td className="p-2 text-right font-bold">₹ {m.value.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-center">{m.paymentPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  Print Legal Agreement PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD CONTRACT DOCUMENT */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upload Contract Document</h3>
                    <p className="text-xs text-muted-foreground">Attach signed contract, legal clearance, or scope addendum</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleUploadDocument} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Select File *</label>
                  <div className="rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-5 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-primary mb-2 opacity-80" />
                    <div className="font-semibold text-foreground">
                      {docUploadForm.name ? (
                        <span className="text-primary font-mono">{docUploadForm.name}</span>
                      ) : (
                        "Click to browse or drop file here"
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Supports PDF, DOCX, Signed Scans (Max 25MB)
                    </p>
                    <input
                      type="file"
                      required={!docUploadForm.name}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocUploadForm((prev) => ({
                            ...prev,
                            name: file.name,
                          }));
                        }
                      }}
                      className="mt-3 block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Version</label>
                    <input
                      type="text"
                      value={docUploadForm.version}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, version: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Execution Status</label>
                    <select
                      value={docUploadForm.status}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, status: e.target.value as any })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Signed</option>
                      <option>Approved</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowUploadDocModal(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload & Attach
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default ContractManagementPage;
