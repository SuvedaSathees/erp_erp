import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  CreditCard,
  Receipt,
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
  FileSpreadsheet,
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
  Landmark,
  Wallet,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Vendor Payment & Disbursement Governance Module · Magnertia ERP
export const Route = createFileRoute("/management/procurement-management/vendor-payment")({
  head: () => ({
    meta: [
      { title: "Vendor Payment · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Vendor Payment Form — payment proposals, multi-invoice allocation, tax & TDS deductions, 4-tier approval matrix, and banking UTR reconciliation.",
      },
    ],
  }),
  component: VendorPaymentPage,
});

// --- DATA TYPES ---

interface PaymentAllocationItem {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  outstandingAmount: number;
  allocateAmount: number;
  discount: number;
  tds: number;
  netSettlement: number;
  status: "Allocated" | "Pending" | "Partially Settled";
}

interface PaymentApprovalStep {
  level: number;
  approver: string;
  role: string;
  status: "Approved" | "Pending" | "Rejected";
  decisionDate?: string;
  comments?: string;
}

interface PaymentDocument {
  id: number;
  name: string;
  size: string;
  date: string;
}

// --- INITIAL MASTER DATA ---

const INITIAL_VP_HEADER = {
  paymentId: "VP-ID-1840",
  paymentNumber: "VP-2026-000184",
  paymentDate: "14 Jun 2026",
  paymentType: "Regular",
  paymentStatus: "Approved" as const,
  priority: "High" as const,
  vendor: "ElectroMax Solutions Pvt. Ltd.",
  vendorLegalName: "ElectroMax Solutions Private Limited",
  vendorCode: "VEND-00452",
  vendorInvoice: "INV-EM-2026-0842",
  invoiceVerification: "IV-2026-000218",
  purchaseOrder: "PO-2026-000152",
  grnNumber: "GRN-2026-000421",
  paymentCurrency: "INR - Indian Rupee",
  paymentOwner: "Neha Gupta",
  paymentReference: "PAY-EM-14062026",
  invoiceAmount: 502282.0,
  netPayable: 497259.0,
  totalDeductions: 5023.0,
  paidAmount: 497259.0,
  balance: 0.0,
  overallStatus: "Ready for Processing",
  // Bank Details
  bankAccountName: "ElectroMax Solutions Pvt. Ltd.",
  bankName: "HDFC Bank Limited",
  accountNumber: "**** **** **** 4821",
  ifscCode: "HDFC0001234",
  branch: "Okhla Industrial Area, Delhi",
  bankVerificationStatus: "Verified",
  lastVerifiedDate: "02 May 2026",
  // Payment Method
  paymentMethod: "NEFT",
  paymentInstrument: "NEFT",
  paymentAccount: "HDFC Bank - 4821",
  scheduledPaymentDate: "14 Jun 2026",
  transactionReference: "NEFT-14062026-EM",
  actualPaymentDate: "—",
  utrNumber: "—",
};

const INITIAL_ALLOCATIONS: PaymentAllocationItem[] = [
  {
    id: 1,
    invoiceNumber: "INV-EM-2026-0842",
    invoiceDate: "08 Jun 2026",
    dueDate: "15 Jun 2026",
    outstandingAmount: 502282.0,
    allocateAmount: 251141.0,
    discount: 0.0,
    tds: 2511.0,
    netSettlement: 248630.0,
    status: "Allocated",
  },
  {
    id: 2,
    invoiceNumber: "INV-EM-2026-0756",
    invoiceDate: "20 May 2026",
    dueDate: "10 Jun 2026",
    outstandingAmount: 241935.0,
    allocateAmount: 246118.0,
    discount: 0.0,
    tds: 2512.0,
    netSettlement: 243606.0,
    status: "Allocated",
  },
];

const INITIAL_APPROVALS: PaymentApprovalStep[] = [
  { level: 1, approver: "Amit Verma", role: "Accounts Payable", status: "Approved", decisionDate: "12 Jun 2026 10:25 AM", comments: "Verified" },
  { level: 2, approver: "Neha Gupta", role: "Finance Manager", status: "Approved", decisionDate: "13 Jun 2026 11:15 AM", comments: "Approved" },
  { level: 3, approver: "Sunil Deshmukh", role: "CFO", status: "Approved", decisionDate: "13 Jun 2026 04:40 PM", comments: "Approved" },
  { level: 4, approver: "Rakesh Kumar", role: "Authorized Signatory", status: "Approved", decisionDate: "14 Jun 2026 09:30 AM", comments: "Approved" },
];

const INITIAL_DOCUMENTS: PaymentDocument[] = [
  { id: 1, name: "INV-EM-2026-0842.pdf", size: "152 KB", date: "08 Jun 2026" },
  { id: 2, name: "IV-2026-000218_Verification.pdf", size: "196 KB", date: "10 Jun 2026" },
  { id: 3, name: "PO-2026-000152.pdf", size: "145 KB", date: "05 May 2026" },
  { id: 4, name: "GRN-2026-000421.pdf", size: "168 KB", date: "05 Jun 2026" },
  { id: 5, name: "TDS Certificate - May 2026.pdf", size: "98 KB", date: "01 Jun 2026" },
];

export function VendorPaymentPage() {
  // Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<string>("allocations");

  // State
  const [header, setHeader] = useState(INITIAL_VP_HEADER);
  const [allocations, setAllocations] = useState<PaymentAllocationItem[]>(INITIAL_ALLOCATIONS);
  const [approvals, setApprovals] = useState<PaymentApprovalStep[]>(INITIAL_APPROVALS);
  const [documents, setDocuments] = useState<PaymentDocument[]>(INITIAL_DOCUMENTS);

  // Modals
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [showProcessModal, setShowProcessModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);
  const [showAddAllocationModal, setShowAddAllocationModal] = useState<boolean>(false);

  // New Invoice Allocation Form State
  const [newAllocationForm, setNewAllocationForm] = useState({
    invoiceNumber: "INV-2026-000412",
    invoiceDate: "2026-05-10",
    dueDate: "2026-05-30",
    outstandingAmount: 345000,
    allocateAmount: 345000,
    discount: 0,
    tdsRate: 1.0,
    status: "Full Allocation",
  });

  // Dynamic Totals Calculation
  const totalOutstanding = allocations.reduce((sum, item) => sum + item.outstandingAmount, 0);
  const totalAllocated = allocations.reduce((sum, item) => sum + item.allocateAmount, 0);
  const totalDiscount = allocations.reduce((sum, item) => sum + item.discount, 0);
  const totalTds = allocations.reduce((sum, item) => sum + item.tds, 0);
  const totalNetSettlement = allocations.reduce((sum, item) => sum + item.netSettlement, 0);

  // Document Upload Form
  const [docUploadForm, setDocUploadForm] = useState({
    name: "",
    type: "Payment Voucher",
    user: "Neha Gupta",
  });

  // Actions
  const handleSaveDraft = () => {
    toast.success("Vendor payment draft saved.");
  };

  const handleSubmitApproval = () => {
    toast.success("Payment submitted to authorized signatory.");
  };

  const handleProcessPayment = () => {
    setShowProcessModal(true);
  };

  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTds = Math.round((newAllocationForm.allocateAmount * newAllocationForm.tdsRate) / 100);
    const calculatedNet = newAllocationForm.allocateAmount - newAllocationForm.discount - calculatedTds;
    const newRow: PaymentAllocationItem = {
      id: allocations.length + 1,
      invoiceNumber: newAllocationForm.invoiceNumber,
      invoiceDate: newAllocationForm.invoiceDate,
      dueDate: newAllocationForm.dueDate,
      outstandingAmount: newAllocationForm.outstandingAmount,
      allocateAmount: newAllocationForm.allocateAmount,
      discount: newAllocationForm.discount,
      tds: calculatedTds,
      netSettlement: calculatedNet,
      status: newAllocationForm.status,
    };
    setAllocations([...allocations, newRow]);
    setHeader((prev) => ({
      ...prev,
      grossAmount: totalAllocated + newAllocationForm.allocateAmount,
      totalDeductions: totalTds + calculatedTds,
      netPaymentAmount: totalNetSettlement + calculatedNet,
    }));
    setShowAddAllocationModal(false);
    toast.success(`Invoice ${newAllocationForm.invoiceNumber} allocated with Net Settlement of ₹ ${calculatedNet.toLocaleString("en-IN", { minimumFractionDigits: 2 })}!`);
  };

  const handleDeleteAllocation = (id: number) => {
    setAllocations(allocations.filter((a) => a.id !== id));
    toast.info("Invoice allocation removed.");
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = docUploadForm.name.trim() || `Payment_Doc_${Date.now()}.pdf`;
    const newDoc = {
      id: documents.length + 1,
      name: fileName,
      size: `${(Math.random() * 1.1 + 0.2).toFixed(1)} MB`,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadDocModal(false);
    setDocUploadForm({ name: "", type: "Payment Voucher", user: "Neha Gupta" });
    toast.success(`Document '${fileName}' attached to Vendor Payment docket!`);
  };

  const handleDownloadDocument = (fileName: string) => {
    try {
      const dummyContent = `MAGNERTIA ERP - VENDOR PAYMENT ATTACHMENT\nPayment Ref: VP-2026-000184\nVendor: ElectroMax Solutions Pvt. Ltd.\nFile: ${fileName}\nGenerated: ${new Date().toISOString()}\nStatus: Verified Bank / Tax Document\n\n[Authenticated via Magnertia Banking Gateway]`;
      const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName.endsWith(".pdf") || fileName.endsWith(".xlsx") ? fileName : `${fileName}.txt`;
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
      title="Vendor Payment"
      breadcrumb="Management > Procurement Management"
      description="The Vendor Payment Form manages the complete payment lifecycle after an invoice has been verified and approved."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP MASTER HEADER & CONTROLS (Pixel-Matched with Reference Mockup!) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Row: Icon + Number + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    Approved
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {header.paymentNumber}
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Payment Date: <strong className="text-foreground">{header.paymentDate}</strong> · Payment Type:{" "}
                  <strong className="text-foreground">{header.paymentType}</strong>
                </p>
              </div>
            </div>

            {/* Header Action Buttons - Streamlined & Purpose-built */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleProcessPayment}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Landmark className="h-3.5 w-3.5" />
                Process Payment
              </button>

              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New Payment
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print Payment Advice"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Master Detail Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Vendor</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{header.vendor}</div>
              <div className="text-[10px] text-muted-foreground font-mono">Invoice: {header.vendorInvoice}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Vendor Code</div>
              <div className="font-bold font-mono text-foreground mt-0.5">{header.vendorCode}</div>
              <div className="text-[10px] text-muted-foreground font-mono">IV: {header.invoiceVerification}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Payment Currency</div>
              <div className="font-bold text-foreground mt-0.5">{header.paymentCurrency}</div>
              <div className="text-[10px] text-muted-foreground font-mono">Ref: {header.paymentReference}</div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SUB-MODULE TABS - Streamlined & Essential Only */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "allocations", label: "Invoice Allocation & Settlement", icon: Receipt },
            { id: "deductions", label: "Statutory TDS & Deductions", icon: Percent },
            { id: "method", label: "Banking & Payment Release", icon: Landmark },
            { id: "documents", label: "Documents & Vouchers", icon: Paperclip },
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

        {/* TAB 1: INVOICE ALLOCATION */}
        {activeTab === "allocations" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    Invoice Allocation & Payment Settlement Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">Adjust disbursement amounts against verified vendor invoices and apply line-wise TDS</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddAllocationModal(true)}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 cursor-pointer transition-all shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Invoice Allocation
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Invoice Number</th>
                      <th className="py-2.5 px-3">Invoice Date</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3 text-right">Outstanding</th>
                      <th className="py-2.5 px-3 text-right">Allocate Amount</th>
                      <th className="py-2.5 px-3 text-right">Discount</th>
                      <th className="py-2.5 px-3 text-right">TDS (194C)</th>
                      <th className="py-2.5 px-3 text-right">Net Settlement</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {allocations.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3 font-mono font-bold text-primary">{item.invoiceNumber}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.invoiceDate}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.dueDate}</td>
                        <td className="py-3 px-3 text-right font-medium">₹ {item.outstandingAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right">
                          <input
                            type="text"
                            value={`₹ ${item.allocateAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                            readOnly
                            className="w-28 rounded border border-border bg-background px-2 py-1 text-right font-bold text-foreground font-mono text-xs"
                          />
                        </td>
                        <td className="py-3 px-3 text-right text-muted-foreground">₹ {item.discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right text-rose-600 font-medium">₹ {item.tds.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">₹ {item.netSettlement.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {allocations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAllocation(item.id)}
                              className="text-muted-foreground hover:text-rose-600 p-1 cursor-pointer"
                              title="Remove allocation"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/40 font-bold border-t border-border text-xs">
                    <tr>
                      <td colSpan={4} className="py-3 px-3">Total ({allocations.length} {allocations.length === 1 ? 'Invoice' : 'Invoices'})</td>
                      <td className="py-3 px-3 text-right font-bold">₹ {totalOutstanding.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right text-primary font-black">₹ {totalAllocated.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right">₹ {totalDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right text-rose-600 font-bold">₹ {totalTds.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right text-emerald-600 font-black">₹ {totalNetSettlement.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEDUCTIONS */}
        {activeTab === "deductions" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                Statutory TDS & Commercial Deductions Breakdown
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground font-medium">TDS Section</span>
                  <div className="text-base font-bold text-foreground">Section 194C (Contractor)</div>
                  <span className="text-[10px] text-muted-foreground">Rate: 1.00%</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground font-medium">Gross Taxable Base</span>
                  <div className="text-base font-bold font-mono">₹ 5,02,282.00</div>
                  <span className="text-[10px] text-muted-foreground">Before GST</span>
                </div>
                <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5 space-y-1">
                  <span className="text-rose-600 font-medium">TDS Amount Deducted</span>
                  <div className="text-base font-bold font-mono text-rose-600">₹ 5,023.00</div>
                  <span className="text-[10px] text-muted-foreground">Payable to ITD by 7th next month</span>
                </div>
                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">Net Settlement to Vendor</span>
                  <div className="text-base font-bold font-mono text-emerald-600">₹ 4,97,259.00</div>
                  <span className="text-[10px] text-muted-foreground">Approved for bank release</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT METHOD & BANK DETAILS */}
        {activeTab === "method" && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3 text-xs">
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  Vendor Bank Master (Verified)
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Beneficiary Name</span>
                    <strong className="text-foreground">{header.bankAccountName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name</span>
                    <strong className="text-foreground">{header.bankName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number</span>
                    <strong className="font-mono text-primary">{header.accountNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IFSC Code</span>
                    <strong className="font-mono text-emerald-600">{header.ifscCode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Branch</span>
                    <span>{header.branch}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 items-center">
                    <span className="text-muted-foreground">Verification Status</span>
                    <span className="rounded bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 text-[10px]">
                      {header.bankVerificationStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3 text-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Disbursement Instrument Details
                  </h3>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <strong className="text-foreground">NEFT / RTGS (Direct API)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled Date</span>
                      <strong>{header.paymentDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction Reference</span>
                      <strong className="font-mono text-primary">{header.paymentReference}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company Payout Account</span>
                      <span className="font-mono">HDFC Corporate A/c (****9012)</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="w-full rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  Initiate Direct Transfer Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTS & VOUCHERS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Supporting Payment Vouchers & Tax Challans
                  </h3>
                  <p className="text-xs text-muted-foreground">Bank payment advices, TDS certificates, and stamped vendor receipts</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
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
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Date</th>
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
                        <td className="py-3 px-3 font-mono text-[11px]">{doc.size}</td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.date}</td>
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
          </div>
        )}
        {/* MODAL: NEW VENDOR PAYMENT PROPOSAL */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Create Vendor Payment Proposal</h3>
                    <p className="text-xs text-muted-foreground">Disbursement authorization against verified invoice</p>
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
                  <label className="text-muted-foreground font-medium block mb-1">Vendor *</label>
                  <input
                    type="text"
                    defaultValue="ElectroMax Solutions Pvt. Ltd. (VEND-00452)"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Invoice Verification Ref *</label>
                  <input
                    type="text"
                    defaultValue="IV-2026-000218 (INV-EM-2026-0842)"
                    className="w-full rounded-lg border border-border bg-background p-2 text-primary font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Payment Method *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>NEFT (National Electronic Funds Transfer)</option>
                    <option>RTGS (Real Time Gross Settlement)</option>
                    <option>IMPS / UPI</option>
                    <option>Corporate Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Net Disbursement Amount (INR) *</label>
                  <input
                    type="text"
                    defaultValue="₹ 4,97,259.00"
                    className="w-full rounded-lg border border-border bg-background p-2 text-emerald-600 font-mono font-black"
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
                    toast.success("Vendor payment proposal generated!");
                    setShowNewModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Save & Queue for Approval
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PROCESS PAYMENT */}
        {showProcessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-emerald-500" />
                  Execute Direct Bank Payout
                </h3>
                <button
                  type="button"
                  onClick={() => setShowProcessModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Beneficiary:</span>
                    <strong className="text-foreground font-bold">ElectroMax Solutions Pvt. Ltd.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account / IFSC:</span>
                    <strong className="font-mono text-primary">**** 4821 (HDFC0001234)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Payout Amount:</span>
                    <strong className="text-emerald-700 dark:text-emerald-300 font-black text-sm">₹ 4,97,259.00</strong>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground">
                  The transaction will be pushed via secure HDFC Corporate API. A UTR confirmation will be logged automatically.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowProcessModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Disbursement confirmed! UTR: HDFC20260614088921 generated.");
                    setShowProcessModal(false);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm Payout & Send UTR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT PAYMENT ADVICE */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                  <div className="text-xs font-semibold text-slate-500">OFFICIAL VENDOR PAYMENT ADVICE</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{header.paymentNumber}</div>
                  <div className="text-slate-500">Payment Date: {header.paymentDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Vendor / Payee Details</div>
                  <div className="mt-1 font-semibold">{header.vendor}</div>
                  <div className="text-slate-500">Bank: {header.bankName} · A/C: {header.accountNumber}</div>
                  <div className="text-slate-500">IFSC: {header.ifscCode} · Method: {header.paymentMethod}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Payment Settlement</div>
                  <div className="mt-1 font-semibold text-emerald-800">Net Amount Paid: ₹ 4,97,259.00</div>
                  <div className="text-slate-500">Gross: ₹ 5,02,282.00 · TDS (194C): ₹ 5,023.00</div>
                  <div className="text-primary font-bold">Status: Approved & Ready</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Invoice Settlement Breakdown</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">Invoice No</th>
                      <th className="p-2">Date</th>
                      <th className="p-2 text-right">Outstanding</th>
                      <th className="p-2 text-right">TDS</th>
                      <th className="p-2 text-right">Net Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allocations.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2 font-mono font-bold">{item.invoiceNumber}</td>
                        <td className="p-2">{item.invoiceDate}</td>
                        <td className="p-2 text-right">₹ {item.outstandingAmount.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right text-rose-700">₹ {item.tds.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right font-bold text-emerald-700">₹ {item.netSettlement.toLocaleString("en-IN")}</td>
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
                  Print Payment Advice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD PAYMENT DOCUMENT */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upload Payment Attachment</h3>
                    <p className="text-xs text-muted-foreground">Attach bank advice, TDS remittance receipt, or vendor payment voucher</p>
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
                      Supports PDF, Bank Advice, Receipts (Max 25MB)
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
                    <label className="text-muted-foreground font-medium block mb-1">Document Type</label>
                    <select
                      value={docUploadForm.type}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, type: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Payment Voucher</option>
                      <option>Bank UTR Advice</option>
                      <option>TDS Remittance Challan</option>
                      <option>Vendor Receipt Acknowledgment</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Uploaded By</label>
                    <input
                      type="text"
                      value={docUploadForm.user}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, user: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
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

        {/* MODAL: ADD INVOICE ALLOCATION */}
        {showAddAllocationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Allocate Vendor Invoice</h3>
                    <p className="text-xs text-muted-foreground">Select verified invoice to allocate payment and calculate TDS</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAllocationModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddAllocation} className="space-y-4 text-xs">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Select Verified Invoice *</label>
                    <select
                      value={newAllocationForm.invoiceNumber}
                      onChange={(e) => {
                        const invDetails: Record<string, { date: string; due: string; outstanding: number }> = {
                          "INV-2026-000412": { date: "2026-05-10", due: "2026-05-30", outstanding: 345000 },
                          "INV-2026-000841": { date: "2026-05-15", due: "2026-06-05", outstanding: 215500 },
                          "INV-2026-000915": { date: "2026-05-20", due: "2026-06-10", outstanding: 180000 },
                          "INV-2026-001024": { date: "2026-05-24", due: "2026-06-15", outstanding: 450000 },
                        };
                        const selected = invDetails[e.target.value] || { date: "2026-05-10", due: "2026-05-30", outstanding: 100000 };
                        setNewAllocationForm({
                          ...newAllocationForm,
                          invoiceNumber: e.target.value,
                          invoiceDate: selected.date,
                          dueDate: selected.due,
                          outstandingAmount: selected.outstanding,
                          allocateAmount: selected.outstanding,
                        });
                      }}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-foreground font-bold font-mono cursor-pointer"
                    >
                      <option value="INV-2026-000412">INV-2026-000412 (PO-2026-000412 · ₹ 3,45,000.00 Outstanding)</option>
                      <option value="INV-2026-000841">INV-2026-000841 (PO-2026-000418 · ₹ 2,15,500.00 Outstanding)</option>
                      <option value="INV-2026-000915">INV-2026-000915 (PO-2026-000420 · ₹ 1,80,000.00 Outstanding)</option>
                      <option value="INV-2026-001024">INV-2026-001024 (PO-2026-000425 · ₹ 4,50,000.00 Outstanding)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Invoice Date</label>
                    <input
                      type="date"
                      value={newAllocationForm.invoiceDate}
                      onChange={(e) => setNewAllocationForm({ ...newAllocationForm, invoiceDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Payment Due Date</label>
                    <input
                      type="date"
                      value={newAllocationForm.dueDate}
                      onChange={(e) => setNewAllocationForm({ ...newAllocationForm, dueDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Total Outstanding (₹)</label>
                    <input
                      type="number"
                      readOnly
                      value={newAllocationForm.outstandingAmount}
                      className="w-full rounded-lg border border-border bg-muted/30 p-2 text-foreground font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Disbursement Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newAllocationForm.allocateAmount}
                      onChange={(e) => setNewAllocationForm({ ...newAllocationForm, allocateAmount: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-primary font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Cash Discount / Adjustment (₹)</label>
                    <input
                      type="number"
                      value={newAllocationForm.discount}
                      onChange={(e) => setNewAllocationForm({ ...newAllocationForm, discount: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">TDS Section & Rate</label>
                    <select
                      value={newAllocationForm.tdsRate}
                      onChange={(e) => setNewAllocationForm({ ...newAllocationForm, tdsRate: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option value={1.0}>Section 194C (Contractor - 1.0%)</option>
                      <option value={2.0}>Section 194J (Tech Services - 2.0%)</option>
                      <option value={10.0}>Section 194J (Professional - 10.0%)</option>
                      <option value={0.1}>Section 194Q (Goods Purchase - 0.1%)</option>
                      <option value={0.0}>No TDS (0.0%)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Settlement Classification</label>
                    <select
                      value={newAllocationForm.status}
                      onChange={(e) => setNewAllocationForm({ ...newAllocationForm, status: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Full Allocation</option>
                      <option>Partial Payment</option>
                      <option>Advance Reconciliation</option>
                    </select>
                  </div>
                </div>

                {/* Net Settlement Preview */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calculated TDS (Deduction):</span>
                    <strong className="text-rose-600 font-mono">
                      ₹ {Math.round((newAllocationForm.allocateAmount * newAllocationForm.tdsRate) / 100).toLocaleString("en-IN")}.00
                    </strong>
                  </div>
                  <div className="flex justify-between border-t border-emerald-500/20 pt-1.5 text-sm">
                    <span className="font-bold text-foreground">Net Bank Transfer:</span>
                    <strong className="text-emerald-600 font-mono font-black">
                      ₹ {(newAllocationForm.allocateAmount - newAllocationForm.discount - Math.round((newAllocationForm.allocateAmount * newAllocationForm.tdsRate) / 100)).toLocaleString("en-IN")}.00
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddAllocationModal(false)}
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" /> Confirm Invoice Allocation
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

export default VendorPaymentPage;
