import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
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
  CreditCard,
  Ban,
  Split,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Invoice Verification & 3-Way Match Module · Procurement Management
export const Route = createFileRoute("/management/procurement-management/invoice-verification")({
  head: () => ({
    meta: [
      { title: "Invoice Verification · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Invoice Verification Form — 2-way and 3-way matching engine validating Vendor Tax Invoices against Purchase Orders and Goods Receipts (GRN) before Accounts Payable authorization.",
      },
    ],
  }),
  component: InvoiceVerificationPage,
});

// --- DATA TYPES ---

interface IVSummaryRow {
  particulars: string;
  poAmount: number;
  grnAmount: number;
  invoiceAmount: number;
  varianceAmount: number;
  variancePercent: number;
}

interface IVException {
  id: number;
  type: string;
  itemService: string;
  expected: string;
  actual: string;
  variance: number;
  severity: "High" | "Medium" | "Low" | "Critical";
  status: "Open" | "Resolved" | "Under Clarification";
}

interface IVLineItem {
  id: number;
  itemService: string;
  itemCode: string;
  uom: string;
  poQty: number;
  grnAcceptedQty: number;
  invoiceQty: number;
  poUnitPrice: number;
  invoiceUnitPrice: number;
  poValue: number;
  grnValue: number;
  invoiceValue: number;
  result: "Match" | "Variance" | "Over-Billed";
}

interface IVDocument {
  id: number;
  name: string;
  size: string;
  date: string;
}

// --- INITIAL MOCK DATA ---

const INITIAL_IV_HEADER = {
  verificationId: "IV-ID-2180",
  verificationNumber: "IV-2026-000218",
  verificationDate: "08 Jun 2026 11:20 AM",
  invoiceType: "Material",
  verificationStatus: "Under Verification" as const,
  vendor: "ElectroMax Solutions Pvt. Ltd.",
  vendorCode: "VEND-00452",
  purchaseOrder: "PO-2026-000152",
  grnNumber: "GRN-2026-000421",
  currency: "INR",
  invoiceNumber: "INV-EM-2026-0842",
  invoiceDate: "08 Jun 2026",
  verificationOwner: "Neha Gupta",
  department: "Engineering",
  project: "Smart EV Charging System",
  priority: "High" as const,
  invoiceAmount: 558091.04,
  verifiedAmount: 502282.0,
  amountOnHold: 55809.04,
  exceptionsCount: 2,
  overallMatch: "Partially Verified",
  approvedAmount: 502282.0,
  tdsDeduction: 5023.0,
  otherDeductions: 0.0,
  netPayable: 497259.0,
  paymentDueDate: "18 Jun 2026",
  paymentStatus: "Pending Approval" as const,
};

const INITIAL_SUMMARY_ROWS: IVSummaryRow[] = [
  { particulars: "Basic Value", poAmount: 485900.0, grnAmount: 452120.0, invoiceAmount: 489000.0, varianceAmount: 36880.0, variancePercent: 8.16 },
  { particulars: "Discount", poAmount: 7941.5, grnAmount: 7200.0, invoiceAmount: 7500.0, varianceAmount: 300.0, variancePercent: 4.17 },
  { particulars: "Taxable Value", poAmount: 477958.5, grnAmount: 444920.0, invoiceAmount: 481500.0, varianceAmount: 36580.0, variancePercent: 8.22 },
  { particulars: "Tax Amount", poAmount: 85132.54, grnAmount: 79561.2, invoiceAmount: 86591.04, varianceAmount: 7029.84, variancePercent: 8.84 },
  { particulars: "TDS Amount", poAmount: 0.0, grnAmount: 0.0, invoiceAmount: 5023.0, varianceAmount: 5023.0, variancePercent: 0 },
];

const INITIAL_EXCEPTIONS: IVException[] = [
  {
    id: 1,
    type: "Quantity Variance",
    itemService: "Power Contactor (32A)",
    expected: "10 Nos (9 Acc)",
    actual: "10 Nos Billed",
    variance: 3136.0,
    severity: "High",
    status: "Open",
  },
  {
    id: 2,
    type: "Price Variance",
    itemService: "MCB (3P 63A)",
    expected: "₹ 841.50",
    actual: "₹ 900.00",
    variance: 58.5,
    severity: "Medium",
    status: "Open",
  },
];

const INITIAL_LINE_ITEMS: IVLineItem[] = [
  { id: 1, itemService: "Power Contactor (32A)", itemCode: "ELC-CON-32A", uom: "Nos", poQty: 50, grnAcceptedQty: 9, invoiceQty: 10, poUnitPrice: 3136, invoiceUnitPrice: 3136, poValue: 156800, grnValue: 28224, invoiceValue: 31360, result: "Variance" },
  { id: 2, itemService: "Energy Meter (3 Phase)", itemCode: "ELC-EM-3P", uom: "Nos", poQty: 25, grnAcceptedQty: 24, invoiceQty: 24, poUnitPrice: 4432.5, invoiceUnitPrice: 4432.5, poValue: 110812.5, grnValue: 106380, invoiceValue: 106380, result: "Match" },
  { id: 3, itemService: "Control Components Kit", itemCode: "ELC-CCK", uom: "Set", poQty: 50, grnAcceptedQty: 5, invoiceQty: 5, poUnitPrice: 2450, invoiceUnitPrice: 2450, poValue: 122500, grnValue: 12250, invoiceValue: 12250, result: "Match" },
  { id: 4, itemService: "MCB (3P 63A)", itemCode: "ELC-MCB-63A", uom: "Nos", poQty: 100, grnAcceptedQty: 4, invoiceQty: 5, poUnitPrice: 841.5, invoiceUnitPrice: 900, poValue: 84150, grnValue: 3366, invoiceValue: 4500, result: "Variance" },
  { id: 5, itemService: "Cable Lug (16mm)", itemCode: "ELC-LUG-16", uom: "Nos", poQty: 200, grnAcceptedQty: 3, invoiceQty: 3, poUnitPrice: 45, invoiceUnitPrice: 45, poValue: 9000, grnValue: 135, invoiceValue: 135, result: "Match" },
  { id: 6, itemService: "Electrical Accessories", itemCode: "ELC-ACC", uom: "Lot", poQty: 1, grnAcceptedQty: 0, invoiceQty: 0, poUnitPrice: 83990, invoiceUnitPrice: 83990, poValue: 83990, grnValue: 0, invoiceValue: 0, result: "Match" },
];

const INITIAL_DOCUMENTS: IVDocument[] = [
  { id: 1, name: "INV-EM-2026-0842.pdf", size: "191 KB", date: "08 Jun 2026" },
  { id: 2, name: "Delivery Challan_DC-EM-2026-0482.pdf", size: "142 KB", date: "05 Jun 2026" },
  { id: 3, name: "GRN-2026-000421.pdf", size: "168 KB", date: "05 Jun 2026" },
  { id: 4, name: "E-Way Bill_7859654321.pdf", size: "96 KB", date: "06 Jun 2026" },
  { id: 5, name: "Tax Invoice_Signed.pdf", size: "132 KB", date: "06 Jun 2026" },
  { id: 6, name: "Quality Report_QC-000421.pdf", size: "110 KB", date: "05 Jun 2026" },
];

export function InvoiceVerificationPage() {
  // Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<string>("lineMatching");

  // State
  const [header, setHeader] = useState(INITIAL_IV_HEADER);
  const [summaryRows, setSummaryRows] = useState<IVSummaryRow[]>(INITIAL_SUMMARY_ROWS);
  const [exceptions, setExceptions] = useState<IVException[]>(INITIAL_EXCEPTIONS);
  const [lineItems, setLineItems] = useState<IVLineItem[]>(INITIAL_LINE_ITEMS);
  const [documents, setDocuments] = useState<IVDocument[]>(INITIAL_DOCUMENTS);

  // Modals
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [showMatchModal, setShowMatchModal] = useState<boolean>(false);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);

  // New Verification Form
  const [newVerificationForm, setNewVerificationForm] = useState({
    vendor: "ElectroMax Solutions Pvt. Ltd.",
    invoiceNumber: "INV-EM-2026-0845",
    invoiceDate: "2026-05-18",
    purchaseOrder: "PO-2026-000842",
    grnNumber: "GRN-2026-000318",
    invoiceType: "Tax Invoice (Standard)",
    grossAmount: 558091.04,
    taxRate: 18,
    owner: "Neha Gupta",
  });

  // Approval Form
  const [approvalForm, setApprovalForm] = useState({
    approver: "Neha Gupta (Finance Controller)",
    paymentMethod: "NEFT Direct Credit",
    dueDate: "2026-06-15",
    remarks: "3-Way Match completed. Accepted quantities verified against GRN-2026-000318. Released for AP disbursement.",
    decision: "Approve for AP (Disbursement Authorized)",
  });

  // Document Upload Form
  const [docUploadForm, setDocUploadForm] = useState({
    name: "",
    type: "Vendor Tax Invoice",
    user: "Neha Gupta",
  });

  // Actions
  const handleSaveDraft = () => {
    toast.success("Invoice verification draft saved.");
  };

  const handleRunMatch = () => {
    setShowMatchModal(true);
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    setHeader((prev) => ({
      ...prev,
      verificationStatus: "Approved for AP" as any,
      paymentStatus: "Authorized" as any,
    }));
    setShowApproveModal(false);
    toast.success(`Vendor Invoice ${header.invoiceNumber} verified and approved for Accounts Payable disbursement via ${approvalForm.paymentMethod}!`);
  };

  const handleCreateVerification = (e: React.FormEvent) => {
    e.preventDefault();
    const newIVNumber = `IV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setHeader((prev) => ({
      ...prev,
      verificationNumber: newIVNumber,
      invoiceNumber: newVerificationForm.invoiceNumber,
      vendor: newVerificationForm.vendor,
      purchaseOrder: newVerificationForm.purchaseOrder,
      grnNumber: newVerificationForm.grnNumber,
      invoiceType: newVerificationForm.invoiceType,
      verificationOwner: newVerificationForm.owner,
      verificationDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      verificationStatus: "Partially Verified",
      paymentStatus: "Pending Match",
      grossAmount: newVerificationForm.grossAmount,
    }));
    setShowNewModal(false);
    toast.success(`Created New Invoice Verification Docket ${newIVNumber} for ${newVerificationForm.vendor}!`);
  };

  const handleResolveException = (id: number) => {
    setExceptions((prev) => prev.map((ex) => (ex.id === id ? { ...ex, status: "Resolved" as const } : ex)));
    toast.success("Exception cleared! Debit note adjusted against supplier ledger.");
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = docUploadForm.name.trim() || `Invoice_Doc_${Date.now()}.pdf`;
    const newDoc = {
      id: documents.length + 1,
      name: fileName,
      size: `${(Math.random() * 1.1 + 0.2).toFixed(1)} MB`,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadDocModal(false);
    setDocUploadForm({ name: "", type: "Vendor Tax Invoice", user: "Neha Gupta" });
    toast.success(`Document '${fileName}' attached to Invoice Verification docket!`);
  };

  const handleDownloadDocument = (fileName: string) => {
    try {
      const dummyContent = `MAGNERTIA ERP - INVOICE VERIFICATION ATTACHMENT\nIV Reference: IV-2026-000218\nInvoice Number: INV-EM-2026-0842\nVendor: ElectroMax Solutions Pvt. Ltd.\nFile: ${fileName}\nGenerated: ${new Date().toISOString()}\nStatus: Verified Tax Document\n\n[Authenticated via Magnertia ECM Gateway]`;
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
      title="Invoice Verification"
      breadcrumb="Management > Procurement Management"
      description="The Invoice Verification Form validates a vendor invoice against the Purchase Order (PO) and Goods Receipt (GR/GRN) before it is approved for Accounts Payable and payment."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP MASTER HEADER & CONTROLS (Matching provided Screenshot Layout!) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Row: Icon + Number + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <Receipt className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    Under Verification
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {header.verificationNumber}
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verification Date: <strong className="text-foreground">{header.verificationDate}</strong> · Invoice Type:{" "}
                  <strong className="text-foreground">{header.invoiceType}</strong>
                </p>
              </div>
            </div>

            {/* Header Action Buttons - Streamlined & Purpose-built */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowApproveModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve Invoice
              </button>

              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New Verification
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print Verification"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Master Detail Grid (Matching Exact Screenshot Attributes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Vendor</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{header.vendor}</div>
              <div className="text-[10px] text-muted-foreground font-mono">PO: <Link to="/management/procurement-management/purchase-order" className="text-primary hover:underline">{header.purchaseOrder}</Link></div>
              <div className="text-[10px] text-muted-foreground">Currency: {header.currency}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Invoice Number</div>
              <div className="font-bold font-mono text-primary mt-0.5">{header.invoiceNumber}</div>
              <div className="text-[10px] text-muted-foreground font-mono">GRN: <Link to="/management/procurement-management/goods-receipt" className="text-foreground font-semibold hover:underline">{header.grnNumber}</Link></div>
              <div className="text-[10px] text-muted-foreground">Owner: <strong className="text-foreground">{header.verificationOwner}</strong></div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Invoice Date</div>
              <div className="font-bold text-foreground mt-0.5">{header.invoiceDate}</div>
              <div className="text-[10px] text-muted-foreground">Dept: {header.department}</div>
              <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                ● Priority: {header.priority}
              </div>
            </div>

            {/* Right-aligned Verification Summary Box */}
            <div className="lg:col-span-4 p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-[11px] text-muted-foreground font-semibold">Verification Summary:</div>
                <div>Invoice Amount: <strong className="text-foreground">₹ {header.invoiceAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
                <div>Verified Amount: <strong className="text-emerald-600 font-bold">₹ {header.verifiedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
              </div>
              <div className="space-y-0.5 text-right">
                <div>Amount on Hold: <strong className="text-amber-600 font-bold">₹ {header.amountOnHold.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-rose-600 font-bold">Exceptions: {header.exceptionsCount}</span>
                  <span className="rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                    {header.overallMatch}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SUB-MODULE TABS - Streamlined & Essential Only */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "lineMatching", label: "Line Item 3-Way Match", icon: ShoppingCart },
            { id: "exceptions", label: "Variances & Exceptions", icon: AlertTriangle },
            { id: "tax", label: "Audit & Tax Check", icon: Percent },
            { id: "documents", label: "Documents & Tax Dossiers", icon: Paperclip },
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

        {/* TAB 1: LINE MATCHING */}
        {activeTab === "lineMatching" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Line Item 3-Way Matching Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">Detailed reconciliation of PO Order vs GRN Accepted vs Vendor Invoice</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item / Service</th>
                      <th className="py-2.5 px-3 text-right">PO Qty</th>
                      <th className="py-2.5 px-3 text-right">GRN Acc. Qty</th>
                      <th className="py-2.5 px-3 text-right">Invoice Qty</th>
                      <th className="py-2.5 px-3 text-right">PO Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Inv. Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Invoice Value</th>
                      <th className="py-2.5 px-3 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold">{item.itemService}</td>
                        <td className="py-3 px-3 text-right">{item.poQty}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600">{item.grnAcceptedQty}</td>
                        <td className="py-3 px-3 text-right font-bold text-primary">{item.invoiceQty}</td>
                        <td className="py-3 px-3 text-right">₹ {item.poUnitPrice.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-right font-medium">₹ {item.invoiceUnitPrice.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">₹ {item.invoiceValue.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold",
                              item.result === "Match" && "bg-emerald-500/10 text-emerald-600",
                              item.result === "Variance" && "bg-amber-500/10 text-amber-600"
                            )}
                          >
                            {item.result}
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

        {/* TAB 2: EXCEPTIONS & VARIANCES */}
        {activeTab === "exceptions" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    3-Way Match Exceptions & Variance Resolution Registry
                  </h3>
                  <p className="text-xs text-muted-foreground">Discrepancies exceeding authorized tolerance thresholds flagged for AP action</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Exception Type</th>
                      <th className="py-2.5 px-3">Item / Service</th>
                      <th className="py-2.5 px-3">Expected (GRN / PO)</th>
                      <th className="py-2.5 px-3">Billed in Invoice</th>
                      <th className="py-2.5 px-3 text-right">Variance Amount</th>
                      <th className="py-2.5 px-3 text-center">Severity</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Resolution Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {exceptions.map((ex) => (
                      <tr key={ex.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-bold text-foreground">{ex.type}</td>
                        <td className="py-3 px-3">{ex.itemService}</td>
                        <td className="py-3 px-3 text-emerald-600 font-semibold">{ex.expected}</td>
                        <td className="py-3 px-3 font-mono text-rose-600 font-semibold">{ex.actual}</td>
                        <td className="py-3 px-3 text-right font-black text-rose-600 font-mono">₹ {ex.variance.toLocaleString("en-IN")}.00</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold",
                              ex.severity === "High" && "bg-rose-500/10 text-rose-600",
                              ex.severity === "Medium" && "bg-amber-500/10 text-amber-600",
                              ex.severity === "Low" && "bg-blue-500/10 text-blue-600"
                            )}
                          >
                            {ex.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold",
                              ex.status === "Open" ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
                            )}
                          >
                            {ex.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {ex.status === "Open" ? (
                            <button
                              type="button"
                              onClick={() => handleResolveException(ex.id)}
                              className="rounded-lg bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                            >
                              Issue Debit Note
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-bold">✓ Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT & TAX CHECK */}
        {activeTab === "tax" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3 text-xs">
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">Commercial Reconciliation Summary</h3>
                {summaryRows.map((row, idx) => (
                  <div key={idx} className="flex justify-between p-2 rounded bg-muted/20">
                    <span className="text-muted-foreground">{row.particulars}:</span>
                    <div className="flex gap-4 font-mono">
                      <span>PO: ₹ {row.poAmount.toLocaleString("en-IN")}</span>
                      <span className="font-bold text-foreground">Inv: ₹ {row.invoiceAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3 text-xs">
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">Statutory Deductions & Net Payable</h3>
                <div className="flex justify-between p-2 rounded bg-muted/20">
                  <span className="text-muted-foreground">Verified Invoice Amount:</span>
                  <span className="font-bold font-mono">₹ {header.verifiedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/20 text-rose-600">
                  <span>TDS Deduction (Sec 194Q - 0.1% / 2%):</span>
                  <span className="font-bold font-mono">- ₹ {header.tdsDeduction.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/20 text-amber-600">
                  <span>Amount on Hold (Pending Exception):</span>
                  <span className="font-bold font-mono">- ₹ {header.amountOnHold.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-black text-sm border border-emerald-500/30">
                  <span>Authorized Net Payable:</span>
                  <span className="font-mono">₹ {header.netPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTS & TAX DOSSIERS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Verified Invoice Dossiers & Tax Filings
                  </h3>
                  <p className="text-xs text-muted-foreground">Supplier tax invoices, E-Way bills, GRN copies, and TDS deduction certificates</p>
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

        {/* MODAL: RUN 3-WAY MATCH */}
        {showMatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-500" />
                  Execute 3-Way Match Verification
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMatchModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1.5">
                  <div className="flex justify-between">
                    <span>PO Match:</span>
                    <strong className="text-emerald-600">✓ PO-2026-000152 Verified</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>GRN Inward Match:</span>
                    <strong className="text-emerald-600">✓ GRN-2026-000421 Verified</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity Check:</span>
                    <strong className="text-amber-600">⚠ Variance Found (₹ 55,809.04 On Hold)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Price & GST Check:</span>
                    <strong className="text-emerald-600">✓ Matched Within Tolerance</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold flex justify-between">
                  <span>Verified Clean Amount:</span>
                  <span>₹ 5,02,282.00 (Ready for AP)</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    toast.success("3-Way matching completed.");
                    setShowMatchModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Confirm Match Result
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: APPROVE INVOICE */}
        {showApproveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Authorize Accounts Payable Voucher
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vendor:</span>
                    <strong className="text-foreground">{header.vendor}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice No:</span>
                    <strong className="font-mono text-primary">{header.invoiceNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Approved Net Payable:</span>
                    <strong className="text-emerald-700 dark:text-emerald-300 font-black text-sm">₹ 4,97,259.00</strong>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground">
                  The approved amount excludes ₹ 55,809.04 on hold for quantity variance clarification with supplier.
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
                    toast.success("Accounts Payable Voucher released! Invoice approved.");
                    setShowApproveModal(false);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Release AP Voucher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT INVOICE VERIFICATION DOCKET */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                  <div className="text-xs font-semibold text-slate-500">3-WAY MATCH INVOICE VERIFICATION CERTIFICATE</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{header.verificationNumber}</div>
                  <div className="text-slate-500">Date: {header.verificationDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Vendor & Document References</div>
                  <div className="mt-1 font-semibold">{header.vendor}</div>
                  <div className="text-slate-500">Invoice: {header.invoiceNumber} · PO: {header.purchaseOrder}</div>
                  <div className="text-slate-500">GRN: {header.grnNumber} · Owner: {header.verificationOwner}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Payment Authorization</div>
                  <div className="mt-1 font-semibold text-primary">Approved Net Payable: ₹ 4,97,259.00</div>
                  <div className="text-slate-500">Invoice Total: ₹ 5,58,091.04 · On Hold: ₹ 55,809.04</div>
                  <div className="text-emerald-700 font-bold">Result: Partially Verified (Ready for AP)</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Reconciliation Summary</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">Item Description</th>
                      <th className="p-2 text-right">PO Qty</th>
                      <th className="p-2 text-right">GRN Acc</th>
                      <th className="p-2 text-right">Inv Qty</th>
                      <th className="p-2 text-right">Approved Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2 font-bold">{item.itemService}</td>
                        <td className="p-2 text-right">{item.poQty}</td>
                        <td className="p-2 text-right text-emerald-700 font-bold">{item.grnAcceptedQty}</td>
                        <td className="p-2 text-right">{item.invoiceQty}</td>
                        <td className="p-2 text-right font-bold">₹ {item.grnValue.toLocaleString("en-IN")}</td>
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
                  Print Verification Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD INVOICE DOCUMENT */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upload Verification Document</h3>
                    <p className="text-xs text-muted-foreground">Attach supplier tax invoices, E-Way bills, or TDS certificates</p>
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
                      Supports PDF, XML Invoices, E-Way Bills (Max 25MB)
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
                    <label className="text-muted-foreground font-medium block mb-1">Document Category</label>
                    <select
                      value={docUploadForm.type}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, type: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Vendor Tax Invoice</option>
                      <option>E-Way Bill</option>
                      <option>GRN Attachment</option>
                      <option>Debit Note Copy</option>
                      <option>TDS Certificate</option>
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
        {/* MODAL: NEW INVOICE VERIFICATION DOCKET */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">New Invoice Verification Docket</h3>
                    <p className="text-xs text-muted-foreground">Initiate 3-way match audit against PO, GRN, and vendor tax invoice</p>
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

              <form onSubmit={handleCreateVerification} className="space-y-4 text-xs">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Vendor / Supplier Name *</label>
                    <select
                      value={newVerificationForm.vendor}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, vendor: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-foreground font-semibold cursor-pointer"
                    >
                      <option>ElectroMax Solutions Pvt. Ltd.</option>
                      <option>PowerGrid Components Pvt. Ltd.</option>
                      <option>VoltTech Engineers</option>
                      <option>Techno Electric Pvt. Ltd.</option>
                      <option>Energo Systems India</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Vendor Invoice Number *</label>
                    <input
                      type="text"
                      required
                      value={newVerificationForm.invoiceNumber}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, invoiceNumber: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Vendor Invoice Date *</label>
                    <input
                      type="date"
                      required
                      value={newVerificationForm.invoiceDate}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, invoiceDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Linked Purchase Order *</label>
                    <input
                      type="text"
                      required
                      value={newVerificationForm.purchaseOrder}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, purchaseOrder: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Linked Goods Receipt (GRN) *</label>
                    <input
                      type="text"
                      required
                      value={newVerificationForm.grnNumber}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, grnNumber: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Invoice Classification</label>
                    <select
                      value={newVerificationForm.invoiceType}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, invoiceType: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Tax Invoice (Standard)</option>
                      <option>Service Tax Invoice</option>
                      <option>Import / Commercial Invoice</option>
                      <option>Proforma / Advance Invoice</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Total Invoice Gross Amount (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newVerificationForm.grossAmount}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, grossAmount: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-primary font-bold text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Verification Officer / Owner</label>
                    <input
                      type="text"
                      value={newVerificationForm.owner}
                      onChange={(e) => setNewVerificationForm({ ...newVerificationForm, owner: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
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
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Create Verification Docket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: APPROVE INVOICE & AP AUTHORIZATION */}
        {showApproveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Approve Invoice & Authorize AP Disbursement</h3>
                    <p className="text-xs text-muted-foreground">Sign off 3-way match reconciliation and queue payment voucher</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Summary Audit Card */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Invoice Ref</span>
                    <div className="font-bold text-foreground mt-0.5">{header.invoiceNumber}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Vendor</span>
                    <div className="font-bold text-foreground mt-0.5 truncate">{header.vendor}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Invoice Total</span>
                    <div className="font-bold text-foreground mt-0.5">₹ 5,58,091.04</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Approved Net Payable</span>
                    <div className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5 text-sm">₹ 4,97,259.00</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-500/20 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
                    <Check className="h-3.5 w-3.5" /> PO Price: Matched
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
                    <Check className="h-3.5 w-3.5" /> GRN Qty: Matched
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
                    <Check className="h-3.5 w-3.5" /> GST / TDS: Verified
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmApproval} className="space-y-4 text-xs">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Approval Decision *</label>
                    <select
                      value={approvalForm.decision}
                      onChange={(e) => setApprovalForm({ ...approvalForm, decision: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-foreground font-bold cursor-pointer"
                    >
                      <option>Approve for AP (Disbursement Authorized)</option>
                      <option>Approve with Retention (Hold ₹ 55,809.04 for Debit Note)</option>
                      <option>Provisional Approval (Pending Final TDS Certificate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Disbursement Payment Method *</label>
                    <select
                      value={approvalForm.paymentMethod}
                      onChange={(e) => setApprovalForm({ ...approvalForm, paymentMethod: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>NEFT Direct Credit</option>
                      <option>RTGS Immediate Settlement</option>
                      <option>Letter of Credit (LC)</option>
                      <option>Corporate Bank Cheque</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Payment Due Date *</label>
                    <input
                      type="date"
                      required
                      value={approvalForm.dueDate}
                      onChange={(e) => setApprovalForm({ ...approvalForm, dueDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Authorizing Approver</label>
                    <input
                      type="text"
                      required
                      value={approvalForm.approver}
                      onChange={(e) => setApprovalForm({ ...approvalForm, approver: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Approval Comments & Audit Note *</label>
                    <textarea
                      rows={3}
                      required
                      value={approvalForm.remarks}
                      onChange={(e) => setApprovalForm({ ...approvalForm, remarks: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowApproveModal(false)}
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Authorize & Release to AP
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

export default InvoiceVerificationPage;
