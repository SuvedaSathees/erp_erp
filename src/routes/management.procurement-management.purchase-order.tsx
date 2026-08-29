import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  FileBadge,
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
  Receipt,
  PackageCheck,
  CreditCard,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Purchase Order Module · Procurement Management
export const Route = createFileRoute("/management/procurement-management/purchase-order")({
  head: () => ({
    meta: [
      { title: "Purchase Orders · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Purchase Order Form — end-to-end procurement commitment from approved quotation/tender to supplier acknowledgement, delivery schedules, GRN integration, 3-way invoice matching, and payment.",
      },
    ],
  }),
  component: PurchaseOrderPage,
});

// --- DATA TYPES ---

interface POLineItem {
  id: number;
  itemService: string;
  itemCode: string;
  uom: string;
  orderedQty: number;
  receivedQty: number;
  pendingQty: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  lineTotal: number;
  deliveryDate: string;
  status: "Approved" | "Pending" | "Partially Received" | "Closed";
}

interface PODeliveryScheduleItem {
  id: number;
  itemService: string;
  quantity: string;
  promisedBy: string;
  deliveryTerms: string;
}

interface POPaymentMilestone {
  id: number;
  milestone: string;
  percentage: number;
  amount: number;
  payableOn: string;
}

interface POApprovalStep {
  level: number;
  approver: string;
  role: string;
  decision: "Approved" | "Pending" | "Rejected";
  dateTime: string;
  comments: string;
}

// --- INITIAL MOCK DATA ---

const INITIAL_PO_HEADER = {
  poId: "PO-ID-1520",
  poNumber: "PO-2026-000152",
  poDate: "18 May 2026",
  requiredByDate: "05 Jun 2026",
  vendor: "ElectroMax Solutions Pvt. Ltd.",
  vendorCode: "VEND-00452",
  vendorContact: "Mr. Vivek Patel",
  vendorPhone: "+91 98765 43210",
  vendorEmail: "vivek.patel@electromax.com",
  department: "Engineering",
  project: "Smart EV Charging System",
  poType: "Material",
  currency: "INR",
  paymentTerms: "30% Advance, 70% on Delivery",
  deliveryTerms: "DAP (Delivered at Place)",
  sourceType: "RFQ",
  sourceNumber: "RFQ-2026-000089",
  refQuotation: "VQ-2026-000186",
  buyer: "Rahul Sharma",
  poStatus: "Approved" as const,
  approvalStatus: "Approved" as const,
  approverName: "Rahul Sharma",
  gstin: "27AAACE1234E1Z5",
  pan: "AAACE1234E",
  vendorAddress: "Plot No. 45, Phase-2, Industrial Area, Pune - 411028, Maharashtra, India",
  bankName: "HDFC Bank",
  bankAccount: "502000012345678",
  ifscCode: "HDFC0001234",
};

const INITIAL_PO_LINES: POLineItem[] = [
  {
    id: 1,
    itemService: "Power Contactor (32A)",
    itemCode: "ELC-CON-32A",
    uom: "Nos",
    orderedQty: 50,
    receivedQty: 0,
    pendingQty: 50,
    unitPrice: 3136.0,
    discountPercent: 2.0,
    taxPercent: 18,
    lineTotal: 156800.0,
    deliveryDate: "25 May 2026",
    status: "Approved",
  },
  {
    id: 2,
    itemService: "Energy Meter (3 Phase)",
    itemCode: "ELC-EM-3P",
    uom: "Nos",
    orderedQty: 25,
    receivedQty: 0,
    pendingQty: 25,
    unitPrice: 4432.5,
    discountPercent: 1.5,
    taxPercent: 18,
    lineTotal: 110812.5,
    deliveryDate: "27 May 2026",
    status: "Approved",
  },
  {
    id: 3,
    itemService: "Control Components Kit",
    itemCode: "ELC-CCK",
    uom: "Set",
    orderedQty: 50,
    receivedQty: 0,
    pendingQty: 50,
    unitPrice: 2450.0,
    discountPercent: 2.0,
    taxPercent: 18,
    lineTotal: 122500.0,
    deliveryDate: "28 May 2026",
    status: "Approved",
  },
  {
    id: 4,
    itemService: "MCB (3P 63A)",
    itemCode: "ELC-MCB-63A",
    uom: "Nos",
    orderedQty: 100,
    receivedQty: 0,
    pendingQty: 100,
    unitPrice: 841.5,
    discountPercent: 1.0,
    taxPercent: 18,
    lineTotal: 84150.0,
    deliveryDate: "25 May 2026",
    status: "Approved",
  },
  {
    id: 5,
    itemService: "Cable Lug (16mm)",
    itemCode: "ELC-LUG-16",
    uom: "Nos",
    orderedQty: 200,
    receivedQty: 0,
    pendingQty: 200,
    unitPrice: 45.0,
    discountPercent: 0.0,
    taxPercent: 18,
    lineTotal: 9000.0,
    deliveryDate: "30 May 2026",
    status: "Approved",
  },
  {
    id: 6,
    itemService: "Electrical Accessories",
    itemCode: "ELC-ACC",
    uom: "Lot",
    orderedQty: 1,
    receivedQty: 0,
    pendingQty: 1,
    unitPrice: 83990.0,
    discountPercent: 1.18,
    taxPercent: 18,
    lineTotal: 83990.0,
    deliveryDate: "02 Jun 2026",
    status: "Approved",
  },
];

const INITIAL_DELIVERY_SCHEDULE: PODeliveryScheduleItem[] = [
  { id: 1, itemService: "Power Contactor (32A)", quantity: "50 Nos", promisedBy: "25 May 2026", deliveryTerms: "25 May 2026" },
  { id: 2, itemService: "Energy Meter (3 Phase)", quantity: "25 Nos", promisedBy: "27 May 2026", deliveryTerms: "27 May 2026" },
  { id: 3, itemService: "Control Components Kit", quantity: "50 Set", promisedBy: "28 May 2026", deliveryTerms: "28 May 2026" },
  { id: 4, itemService: "MCB (3P 63A)", quantity: "100 Nos", promisedBy: "25 May 2026", deliveryTerms: "25 May 2026" },
  { id: 5, itemService: "Cable Lug (16mm)", quantity: "200 Nos", promisedBy: "30 May 2026", deliveryTerms: "30 May 2026" },
  { id: 6, itemService: "Electrical Accessories", quantity: "1 Lot", promisedBy: "02 Jun 2026", deliveryTerms: "02 Jun 2026" },
];

const INITIAL_PAYMENT_SCHEDULE: POPaymentMilestone[] = [
  { id: 1, milestone: "Advance", percentage: 30, amount: 167427.31, payableOn: "Within 7 days" },
  { id: 2, milestone: "On Delivery", percentage: 60, amount: 334854.62, payableOn: "On Delivery" },
  { id: 3, milestone: "Retention", percentage: 10, amount: 55809.11, payableOn: "After 30 days" },
];

const INITIAL_APPROVALS: POApprovalStep[] = [
  { level: 1, approver: "Rahul Sharma", role: "Procurement Officer", decision: "Approved", dateTime: "18 May 2026 11:20 AM", comments: "Verified & Approved" },
  { level: 2, approver: "Amit Verma", role: "Department Head", decision: "Approved", dateTime: "18 May 2026 12:05 PM", comments: "OK" },
  { level: 3, approver: "Neha Gupta", role: "Finance Manager", decision: "Approved", dateTime: "18 May 2026 12:45 PM", comments: "Approved" },
  { level: 4, approver: "Sanjeev Kumar", role: "Purchase Head", decision: "Approved", dateTime: "18 May 2026 01:10 PM", comments: "Proceed" },
];

const INITIAL_PO_DOCUMENTS = [
  { id: 1, name: "Purchase_Order_PO-152_Signed.pdf", type: "Signed PO Docket", size: "450 KB", date: "18 May 2026", user: "Rahul Sharma" },
  { id: 2, name: "Vendor_Acknowledgement_Slip.pdf", type: "Vendor Acceptance", size: "280 KB", date: "19 May 2026", user: "ElectroMax Portal" },
  { id: 3, name: "Approved_Quotation_EM-126.pdf", type: "Commercial Quotation", size: "1.1 MB", date: "18 May 2026", user: "Rahul Sharma" },
  { id: 4, name: "Technical_Specifications_SpecSheet.pdf", type: "Technical Spec", size: "820 KB", date: "18 May 2026", user: "Rahul Sharma" },
];

export function PurchaseOrderPage() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<string>("lineItems");

  // State
  const [poHeader, setPoHeader] = useState(INITIAL_PO_HEADER);
  const [lines, setLines] = useState<POLineItem[]>(INITIAL_PO_LINES);
  const [deliverySchedule, setDeliverySchedule] = useState<PODeliveryScheduleItem[]>(INITIAL_DELIVERY_SCHEDULE);
  const [paymentSchedule, setPaymentSchedule] = useState<POPaymentMilestone[]>(INITIAL_PAYMENT_SCHEDULE);
  const [approvals, setApprovals] = useState<POApprovalStep[]>(INITIAL_APPROVALS);
  const [documents, setDocuments] = useState(INITIAL_PO_DOCUMENTS);

  // Modals
  const [showNewPoModal, setShowNewPoModal] = useState<boolean>(false);
  const [showGrnModal, setShowGrnModal] = useState<boolean>(false);
  const [showMatchModal, setShowMatchModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);

  // Document Upload Form State
  const [docUploadForm, setDocUploadForm] = useState({
    name: "",
    type: "Signed PO Docket",
    user: "Rahul Sharma",
  });

  // Financials (Exact Match with Reference Mockup)
  const poValueBeforeTax = 472958.5;
  const totalTax = 85132.54;
  const grandTotal = 558091.04;
  const amountPaid = 0.0;
  const balanceAmount = 558091.04;

  const basicValue = 485900.0;
  const itemDiscount = 7941.5;
  const overallDiscount = 5000.0;
  const taxableValue = 472958.5;
  const cgst = 42566.27;
  const sgst = 42566.27;

  // Handlers
  const handleSaveDraft = () => {
    toast.success("Purchase Order draft saved.");
  };

  const handleSubmitForApproval = () => {
    toast.success("PO submitted to Workflow Approvers.");
  };

  const handleIssuePo = () => {
    toast.success("Purchase Order PO-2026-000152 issued to vendor via portal & email!");
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = docUploadForm.name.trim() || `PO_Doc_${Date.now()}.pdf`;
    const newDoc = {
      id: documents.length + 1,
      name: fileName,
      type: docUploadForm.type,
      size: `${(Math.random() * 1.5 + 0.3).toFixed(1)} MB`,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      user: docUploadForm.user || "Rahul Sharma",
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadDocModal(false);
    setDocUploadForm({ name: "", type: "Signed PO Docket", user: "Rahul Sharma" });
    toast.success(`Document '${fileName}' attached to Purchase Order docket!`);
  };

  const handleDownloadDocument = (fileName: string) => {
    try {
      const dummyContent = `MAGNERTIA ERP - PURCHASE ORDER ATTACHMENT\nPO Number: PO-2026-000152\nVendor: ElectroMax Solutions Pvt. Ltd.\nFile: ${fileName}\nGenerated: ${new Date().toISOString()}\nStatus: Verified PO Document\n\n[Authenticated via Magnertia ECM]`;
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
      title="Purchase Order"
      breadcrumb="Management > Procurement Management"
      description="The Purchase Order (PO) Form manages the complete purchasing commitment after vendor selection—from approved quotation/tender to supplier order, delivery, GRN, invoice, and payment."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP MASTER HEADER & CONTROLS (Clean, High-Contrast Executive ERP Layout) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Row: Icon + Number + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <FileBadge className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {poHeader.poNumber}
                  </h1>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {poHeader.poStatus}
                  </span>
                  <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:text-sky-300 border border-sky-500/20 uppercase tracking-wide">
                    {poHeader.poType}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PO Date: <strong className="text-foreground">{poHeader.poDate}</strong> · Required Delivery By:{" "}
                  <strong className="text-foreground">{poHeader.requiredByDate}</strong>
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGrnModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Receipt className="h-3.5 w-3.5" />
                Create Goods Receipt (GRN)
              </button>

              <button
                type="button"
                onClick={() => setShowNewPoModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New PO
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print Purchase Order"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Master Detail Grid (6-column balanced layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Vendor</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{poHeader.vendor}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{poHeader.vendorCode}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{poHeader.gstin}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Vendor Contact</div>
              <div className="font-bold text-foreground mt-0.5">{poHeader.vendorContact}</div>
              <div className="text-[10px] text-muted-foreground">{poHeader.vendorPhone}</div>
              <div className="text-[10px] text-muted-foreground truncate">{poHeader.vendorEmail}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Project & Cost Center</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{poHeader.project}</div>
              <div className="text-[10px] text-muted-foreground font-mono">CC-ENG-01 · {poHeader.department}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Source Document</div>
              <div className="font-bold font-mono text-primary mt-0.5">
                <Link to="/management/procurement-management/rfq-quotation" className="hover:underline">
                  {poHeader.sourceNumber}
                </Link>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                Ref. Quotation:{" "}
                <Link to="/management/procurement-management/vendor-quotation" className="text-foreground font-semibold hover:underline">
                  {poHeader.refQuotation}
                </Link>
              </div>
              <div className="text-[10px] text-muted-foreground">Buyer: <strong className="text-foreground">{poHeader.buyer}</strong></div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Terms & Logistics</div>
              <div className="font-bold text-primary mt-0.5">{poHeader.deliveryTerms}</div>
              <div className="text-[10px] text-muted-foreground truncate">{poHeader.paymentTerms}</div>
            </div>

            <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-muted-foreground">Total PO Value</div>
                <div className="text-sm font-extrabold text-foreground font-mono mt-0.5">₹ 5,58,091.04</div>
                <div className="text-[10px] text-muted-foreground">Approver: <strong>{poHeader.approverName}</strong></div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ✓ Approved
              </span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SUB-MODULE TABS - Streamlined & Essential Only */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "lineItems", label: "Line Items", icon: ShoppingCart },
            { id: "deliveryPayment", label: "Delivery & Payment Terms", icon: Truck },
            { id: "taxes", label: "Taxes & Commercials", icon: DollarSign },
            { id: "grnMatch", label: "GRN & 3-Way Match", icon: Receipt },
            { id: "documents", label: "Documents", icon: Paperclip },
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

        {/* TAB 1: LINE ITEMS */}
        {activeTab === "lineItems" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Purchase Order Line Items (6 Items)
                  </h3>
                  <p className="text-xs text-muted-foreground">Detailed commitment lines, unit prices, HSN/SAC, and delivery locations</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item / Service</th>
                      <th className="py-2.5 px-3">Item Code</th>
                      <th className="py-2.5 px-3">UOM</th>
                      <th className="py-2.5 px-3 text-right">Ordered Qty</th>
                      <th className="py-2.5 px-3 text-right">Received Qty</th>
                      <th className="py-2.5 px-3 text-right">Pending Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Line Total</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {lines.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold">{item.itemService}</td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">{item.itemCode}</td>
                        <td className="py-3 px-3">{item.uom}</td>
                        <td className="py-3 px-3 text-right font-bold">{item.orderedQty}</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-600">{item.receivedQty}</td>
                        <td className="py-3 px-3 text-right font-mono text-rose-600">{item.pendingQty}</td>
                        <td className="py-3 px-3 text-right">₹ {item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">
                          ₹ {item.lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="rounded bg-emerald-500/10 px-2 py-0.2 text-[10px] font-bold text-emerald-600">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/40 font-bold border-t border-border">
                    <tr>
                      <td colSpan={4} className="py-3 px-3">Total Ordered (426 Units)</td>
                      <td className="py-3 px-3 text-right">426</td>
                      <td className="py-3 px-3 text-right">0</td>
                      <td className="py-3 px-3 text-right">426</td>
                      <td className="text-right">Grand Total:</td>
                      <td className="py-3 px-3 text-right text-sm font-extrabold text-foreground">
                        ₹ 5,67,252.50
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DELIVERY & PAYMENT TERMS */}
        {activeTab === "deliveryPayment" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Delivery Schedule */}
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                  <Truck className="h-4 w-4 text-primary" /> Delivery Schedule & Milestones
                </h3>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Item / Service</th>
                        <th className="py-2.5 px-3">Quantity</th>
                        <th className="py-2.5 px-3">Promised Date</th>
                        <th className="py-2.5 px-3">Terms</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-foreground">
                      {deliverySchedule.map((d) => (
                        <tr key={d.id} className="hover:bg-muted/20">
                          <td className="py-2.5 px-3 font-semibold">{d.itemService}</td>
                          <td className="py-2.5 px-3 font-bold">{d.quantity}</td>
                          <td className="py-2.5 px-3 text-primary font-mono">{d.promisedBy}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{d.deliveryTerms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Milestones */}
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                  <DollarSign className="h-4 w-4 text-emerald-500" /> Payment Milestone Tranches
                </h3>
                <div className="space-y-3 text-xs">
                  {paymentSchedule.map((p) => (
                    <div key={p.id} className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-foreground text-sm">{p.milestone} ({p.percentage}%)</div>
                        <div className="text-muted-foreground text-[11px] mt-0.5">Payable condition: {p.payableOn}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-foreground font-mono">₹ {p.amount.toLocaleString("en-IN")}</div>
                        <span className="inline-block mt-0.5 rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] font-bold text-emerald-600">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TAXES & COMMERCIALS */}
        {activeTab === "taxes" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3 text-xs">
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">Commercial Summary</h3>
                <div className="flex justify-between p-2 rounded bg-muted/20">
                  <span className="text-muted-foreground">Basic Item Value:</span>
                  <span className="font-bold font-mono">₹ {basicValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/20 text-emerald-600">
                  <span>Item Discounts:</span>
                  <span className="font-bold font-mono">- ₹ {itemDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/20 text-emerald-600">
                  <span>Overall Commercial Discount:</span>
                  <span className="font-bold font-mono">- ₹ {overallDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-primary/10 text-primary font-bold">
                  <span>Taxable Commercial Value:</span>
                  <span className="font-mono">₹ {taxableValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3 text-xs">
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">Statutory Taxes & Landed Total</h3>
                <div className="flex justify-between p-2 rounded bg-muted/20">
                  <span className="text-muted-foreground">CGST (9%):</span>
                  <span className="font-bold font-mono">₹ {cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/20">
                  <span className="text-muted-foreground">SGST (9%):</span>
                  <span className="font-bold font-mono">₹ {sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-muted/20">
                  <span className="text-muted-foreground">Total Statutory Taxes:</span>
                  <span className="font-bold font-mono">₹ {totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 font-black text-sm border border-emerald-500/30">
                  <span>Grand Total (Landed Cost):</span>
                  <span className="font-mono">₹ {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GRN & 3-WAY MATCH */}
        {activeTab === "grnMatch" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    Goods Receipt & 3-Way Matching Engine
                  </h3>
                  <p className="text-xs text-muted-foreground">Automated cross-reconciliation across Purchase Order, Goods Receipt (GRN), and Vendor Invoice</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMatchModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Execute 3-Way Match
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs border border-border">
                  <thead className="bg-muted/50 text-foreground font-bold border-b border-border">
                    <tr>
                      <th className="p-3">Matching Parameter</th>
                      <th className="p-3 text-center">Purchase Order</th>
                      <th className="p-3 text-center">Goods Receipt (GRN)</th>
                      <th className="p-3 text-center">Vendor Invoice</th>
                      <th className="p-3 text-center">Reconciliation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">Vendor Entity</td>
                      <td className="p-3 text-center font-bold">ElectroMax Solutions</td>
                      <td className="p-3 text-center font-bold">ElectroMax Solutions</td>
                      <td className="p-3 text-center font-bold">ElectroMax Solutions</td>
                      <td className="p-3 text-center text-emerald-600 font-black">✓ MATCHED</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">Item Code & Descriptions</td>
                      <td className="p-3 text-center font-bold">6 Line Items Verified</td>
                      <td className="p-3 text-center font-bold">6 Line Items Verified</td>
                      <td className="p-3 text-center font-bold">6 Line Items Verified</td>
                      <td className="p-3 text-center text-emerald-600 font-black">✓ MATCHED</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">Quantity Reconciliation</td>
                      <td className="p-3 text-center font-bold">426 Units</td>
                      <td className="p-3 text-center font-bold">426 Units Accepted</td>
                      <td className="p-3 text-center font-bold">426 Units Billed</td>
                      <td className="p-3 text-center text-emerald-600 font-black">✓ MATCHED</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-muted-foreground">Unit Price Check</td>
                      <td className="p-3 text-center font-bold">As per Approved VQ</td>
                      <td className="p-3 text-center text-muted-foreground">—</td>
                      <td className="p-3 text-center font-bold">Exact Match</td>
                      <td className="p-3 text-center text-emerald-600 font-black">✓ MATCHED</td>
                    </tr>
                    <tr className="bg-muted/30 font-black text-sm">
                      <td className="p-3 text-primary">TOTAL RECONCILED VALUE</td>
                      <td className="p-3 text-center text-foreground">₹ 5,58,091.04</td>
                      <td className="p-3 text-center text-foreground">₹ 5,58,091.04</td>
                      <td className="p-3 text-center text-foreground">₹ 5,58,091.04</td>
                      <td className="p-3 text-center text-emerald-600 dark:text-emerald-400 font-black">
                        🏆 PASSED (Ready for Payment)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Purchase Order Dossiers & Attachments
                  </h3>
                  <p className="text-xs text-muted-foreground">Signed dockets, vendor acceptance receipts, and technical datasheets</p>
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
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Uploaded By</th>
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
                        <td className="py-3 px-3 text-muted-foreground">{doc.type}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{doc.size}</td>
                        <td className="py-3 px-3">{doc.user}</td>
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

        {/* MODAL: NEW PURCHASE ORDER WIZARD */}
        {showNewPoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Create Purchase Order</h3>
                    <p className="text-xs text-muted-foreground">Generate a purchasing commitment from Quotation / Tender</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPoModal(false)}
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
                    defaultValue="ElectroMax Solutions Pvt. Ltd."
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Source RFQ / Tender *</label>
                  <input
                    type="text"
                    defaultValue="RFQ-2026-000089"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Payment Terms *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>30% Advance, 70% on Delivery</option>
                    <option>Net 30 Days</option>
                    <option>Net 45 Days</option>
                    <option>100% Advance</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Required Delivery Date *</label>
                  <input
                    type="date"
                    defaultValue="2026-06-05"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewPoModal(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Purchase order created successfully!");
                    setShowNewPoModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Save & Add Line Items
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREATE GOODS RECEIPT (GRN) */}
        {showGrnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Create Goods Receipt Note (GRN)</h3>
                    <p className="text-xs text-muted-foreground">Record warehouse material inward against PO-2026-000152</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGrnModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">GRN Number</label>
                  <input
                    type="text"
                    disabled
                    defaultValue="GRN-2026-00084"
                    className="w-full rounded-lg border border-border bg-muted/40 p-2 text-foreground font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Receipt Date *</label>
                  <input
                    type="date"
                    defaultValue="2026-05-20"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Vendor Challan / Delivery Note # *</label>
                  <input
                    type="text"
                    defaultValue="DC-EM-2026-441"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Receiving Warehouse / Location *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>WH-01 Central Engineering Warehouse (Pune)</option>
                    <option>WH-02 EV Assembly Plant (Chakan)</option>
                    <option>Site Store (Project Location)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1 text-xs">
                <div className="font-bold text-foreground">Inward Items Summary:</div>
                <div className="flex justify-between text-muted-foreground">
                  <span>6 PO Line Items (426 Total Quantity)</span>
                  <span className="text-emerald-600 font-bold">100% Inward Ready</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowGrnModal(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLines(lines.map((l) => ({ ...l, receivedQty: l.orderedQty, pendingQty: 0, status: "Closed" as any })));
                    toast.success("Goods Receipt Note GRN-2026-00084 generated and line items marked as received!");
                    setShowGrnModal(false);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <PackageCheck className="h-4 w-4" /> Generate GRN & Receive Stock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: 3-WAY MATCHING */}
        {showMatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-emerald-500" />
                  Execute 3-Way Match Reconciliation
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
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex justify-between">
                    <span>PO Match:</span>
                    <strong className="text-emerald-600 font-bold">PO-2026-000152 (100% Match)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>GRN Inward:</span>
                    <strong className="text-emerald-600 font-bold">GRN-2026-00084 (426 / 426 Accepted)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Invoice Check:</span>
                    <strong className="text-emerald-600 font-bold">INV-EM-9921 (₹ 5,58,091.04)</strong>
                  </div>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  All 3 documents reconciled without discrepancy. Approved for automated accounts payable voucher release.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    toast.success("3-Way Match cleared! Payment released.");
                    setShowMatchModal(false);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Approve for Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT PURCHASE ORDER DOCKET */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                  <div className="text-xs font-semibold text-slate-500">OFFICIAL PURCHASE ORDER DOCKET</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{poHeader.poNumber}</div>
                  <div className="text-slate-500">PO Date: {poHeader.poDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Vendor Details</div>
                  <div className="mt-1 font-semibold">{poHeader.vendor} ({poHeader.vendorCode})</div>
                  <div className="text-slate-500">{poHeader.vendorAddress}</div>
                  <div className="text-slate-500">GSTIN: {poHeader.gstin} · Contact: {poHeader.vendorContact}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Order Milestones & Value</div>
                  <div className="mt-1 font-semibold text-primary">Grand Total: ₹ 5,58,091.04</div>
                  <div className="text-slate-500">Required By: {poHeader.requiredByDate}</div>
                  <div className="text-slate-500">Payment: {poHeader.paymentTerms}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Ordered Line Items (BOQ)</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Item Description</th>
                      <th className="p-2">UOM</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Unit Price</th>
                      <th className="p-2 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lines.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2 font-mono">{idx + 1}</td>
                        <td className="p-2 font-bold">{item.itemService}</td>
                        <td className="p-2">{item.uom}</td>
                        <td className="p-2 text-right font-bold">{item.orderedQty}</td>
                        <td className="p-2 text-right">₹ {item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="p-2 text-right font-bold">₹ {item.lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
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
                  Print PO PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD PO DOCUMENT */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upload Purchase Order Document</h3>
                    <p className="text-xs text-muted-foreground">Attach signed PO copies, vendor acceptances, or datasheets</p>
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
                      Supports PDF, XLSX, DOCX, Images (Max 25MB)
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
                      <option>Signed PO Docket</option>
                      <option>Vendor Acceptance</option>
                      <option>Commercial Quotation</option>
                      <option>Technical Spec</option>
                      <option>Inspection Report</option>
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
      </div>
    </AppShell>
  );
}

export default PurchaseOrderPage;
