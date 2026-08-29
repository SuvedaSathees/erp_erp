import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  PackageCheck,
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
  QrCode,
  Scan,
  Warehouse,
  Boxes,
  ClipboardList,
  FileBadge,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Goods Receipt (GRN) Module · Procurement Management
export const Route = createFileRoute("/management/procurement-management/goods-receipt")({
  head: () => ({
    meta: [
      { title: "Goods Receipt · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Goods Receipt Form — physical receiving, barcode verification, quality inspection, GRN generation, warehouse put-away, and 3-way invoice matching.",
      },
    ],
  }),
  component: GoodsReceiptPage,
});

// --- DATA TYPES ---

interface GRLineItem {
  id: number;
  itemDescription: string;
  itemCode: string;
  uom: string;
  orderedQty: number;
  prevReceivedQty: number;
  pendingQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  damagedQty: number;
  shortQty: number;
  excessQty: number;
  unitPrice: number;
  lineStatus: "Accepted" | "Under Inspection" | "Rejected" | "Pending";
  storageBin?: string;
  batchNumber?: string;
}

interface GRDocument {
  id: number;
  name: string;
  size: string;
  date: string;
}

interface GRApprovalStep {
  level: number;
  approver: string;
  role: string;
  status: "Approved" | "Pending" | "Rejected";
  dateTime?: string;
  comments?: string;
}

// --- INITIAL MASTER DATA ---

const INITIAL_GR_HEADER = {
  grId: "GR-ID-4210",
  grNumber: "GR-2026-000421",
  receiptDate: "05 Jun 2026 10:30 AM",
  receiptType: "Material",
  receiptStatus: "Under Inspection" as const,
  purchaseOrder: "PO-2026-000152",
  vendor: "ElectroMax Solutions Pvt. Ltd.",
  vendorCode: "VEND-00452",
  vendorInvoiceNo: "INV-EM-2026-0842",
  deliveryChallanNo: "DC-EM-2026-0482",
  shipmentLrNo: "LR-789654321",
  transporter: "Speed Cargo Logistics",
  vehicleNumber: "MH12AB1234",
  driverName: "Ramesh Patil",
  driverMobile: "9876543210",
  deliveryDate: "05 Jun 2026 09:45 AM",
  warehouse: "Main Warehouse",
  receivingLocation: "Bay 4 (Inward Inspection Dock)",
  department: "Engineering",
  project: "Smart EV Charging System",
  receivedBy: "Amit Verma",
  poTotalValue: 558091.04,
  thisReceiptBeforeTax: 127500.0,
  taxAmount: 22950.0,
  thisReceiptAfterTax: 150450.0,
  totalItemsCount: 6,
  totalOrderedQty: 426,
  totalReceivedQty: 50,
  totalAcceptedQty: 45,
  totalRejectedQty: 3,
  totalDamagedQty: 2,
  acceptanceRate: 90,
  rejectionRate: 6,
  damagedRate: 4,
};

const INITIAL_GR_LINES: GRLineItem[] = [
  {
    id: 1,
    itemDescription: "Power Contactor (32A)",
    itemCode: "ELC-CON-32A",
    uom: "Nos",
    orderedQty: 50,
    prevReceivedQty: 20,
    pendingQty: 30,
    receivedQty: 10,
    acceptedQty: 9,
    rejectedQty: 1,
    damagedQty: 0,
    shortQty: 20,
    excessQty: 0,
    unitPrice: 3136.0,
    lineStatus: "Accepted",
    storageBin: "WH-Z1-R04-B02",
    batchNumber: "BAT-PC-2026-089",
  },
  {
    id: 2,
    itemDescription: "Energy Meter (3 Phase)",
    itemCode: "ELC-EM-3P",
    uom: "Nos",
    orderedQty: 25,
    prevReceivedQty: 0,
    pendingQty: 25,
    receivedQty: 25,
    acceptedQty: 24,
    rejectedQty: 1,
    damagedQty: 0,
    shortQty: 0,
    excessQty: 0,
    unitPrice: 4432.5,
    lineStatus: "Under Inspection",
    storageBin: "WH-Z1-R02-B08",
    batchNumber: "BAT-EM-2026-012",
  },
  {
    id: 3,
    itemDescription: "Control Components Kit",
    itemCode: "ELC-CCK",
    uom: "Set",
    orderedQty: 50,
    prevReceivedQty: 0,
    pendingQty: 50,
    receivedQty: 5,
    acceptedQty: 5,
    rejectedQty: 0,
    damagedQty: 0,
    shortQty: 45,
    excessQty: 0,
    unitPrice: 2450.0,
    lineStatus: "Under Inspection",
    storageBin: "WH-Z2-R01-B03",
    batchNumber: "BAT-CCK-2026-004",
  },
  {
    id: 4,
    itemDescription: "MCB (3P 63A)",
    itemCode: "ELC-MCB-63A",
    uom: "Nos",
    orderedQty: 100,
    prevReceivedQty: 0,
    pendingQty: 100,
    receivedQty: 5,
    acceptedQty: 4,
    rejectedQty: 1,
    damagedQty: 0,
    shortQty: 95,
    excessQty: 0,
    unitPrice: 841.5,
    lineStatus: "Under Inspection",
    storageBin: "WH-Z1-R06-B05",
    batchNumber: "BAT-MCB-2026-044",
  },
  {
    id: 5,
    itemDescription: "Cable Lug (16mm)",
    itemCode: "ELC-LUG-16",
    uom: "Nos",
    orderedQty: 200,
    prevReceivedQty: 0,
    pendingQty: 200,
    receivedQty: 5,
    acceptedQty: 3,
    rejectedQty: 1,
    damagedQty: 1,
    shortQty: 195,
    excessQty: 0,
    unitPrice: 45.0,
    lineStatus: "Under Inspection",
    storageBin: "WH-Z3-R02-B01",
    batchNumber: "BAT-LUG-2026-112",
  },
  {
    id: 6,
    itemDescription: "Electrical Accessories",
    itemCode: "ELC-ACC",
    uom: "Lot",
    orderedQty: 1,
    prevReceivedQty: 0,
    pendingQty: 1,
    receivedQty: 0,
    acceptedQty: 0,
    rejectedQty: 0,
    damagedQty: 1,
    shortQty: 1,
    excessQty: 0,
    unitPrice: 83990.0,
    lineStatus: "Rejected",
    storageBin: "QUARANTINE-BAY",
    batchNumber: "BAT-ACC-2026-001",
  },
];

const INITIAL_DOCUMENTS: GRDocument[] = [
  { id: 1, name: "PO-2026-000152.pdf", size: "196 KB", date: "18 May 2026" },
  { id: 2, name: "DC-EM-2026-0482.pdf", size: "142 KB", date: "05 Jun 2026" },
  { id: 3, name: "INV-EM-2026-0842.pdf", size: "178 KB", date: "05 Jun 2026" },
  { id: 4, name: "QC Report - GR-000421.pdf", size: "256 KB", date: "05 Jun 2026" },
  { id: 5, name: "Packing List.pdf", size: "98 KB", date: "05 Jun 2026" },
];

const INITIAL_APPROVALS: GRApprovalStep[] = [
  { level: 1, approver: "Amit Verma", role: "Warehouse Incharge", status: "Approved", dateTime: "05 Jun 2026 11:05 AM", comments: "Verified" },
  { level: 2, approver: "Neha Gupta", role: "Quality Engineer", status: "Pending" },
  { level: 3, approver: "Sunil Deshmukh", role: "Procurement Manager", status: "Pending" },
];

export function GoodsReceiptPage() {
  // Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<string>("lineItems");

  // State
  const [header, setHeader] = useState(INITIAL_GR_HEADER);
  const [lines, setLines] = useState<GRLineItem[]>(INITIAL_GR_LINES);
  const [documents, setDocuments] = useState<GRDocument[]>(INITIAL_DOCUMENTS);
  const [approvals, setApprovals] = useState<GRApprovalStep[]>(INITIAL_APPROVALS);

  // Modals
  const [showNewGrModal, setShowNewGrModal] = useState<boolean>(false);
  const [showQcModal, setShowQcModal] = useState<boolean>(false);
  const [showGrnModal, setShowGrnModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);

  // Document Upload Form
  const [docUploadForm, setDocUploadForm] = useState({
    name: "",
    type: "Delivery Challan",
    user: "Amit Verma",
  });

  // Actions
  const handleSaveDraft = () => {
    toast.success("Goods receipt draft saved.");
  };

  const handleReceiveGoods = () => {
    toast.success("Physical inward verified. Quality inspection initiated.");
  };

  const handleGenerateGrn = () => {
    setShowGrnModal(true);
  };

  const handleApproveQcAll = () => {
    setLines((prev) =>
      prev.map((line) =>
        line.lineStatus === "Under Inspection" ? { ...line, lineStatus: "Accepted" as const, acceptedQty: line.receivedQty, rejectedQty: 0 } : line
      )
    );
    setHeader((prev) => ({
      ...prev,
      receiptStatus: "Accepted (GRN Ready)" as any,
      totalAcceptedQty: 48,
      totalRejectedQty: 2,
    }));
    toast.success("Quality inspection approved for all pending items!");
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = docUploadForm.name.trim() || `GR_Doc_${Date.now()}.pdf`;
    const newDoc = {
      id: documents.length + 1,
      name: fileName,
      size: `${(Math.random() * 1.2 + 0.3).toFixed(1)} MB`,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadDocModal(false);
    setDocUploadForm({ name: "", type: "Delivery Challan", user: "Amit Verma" });
    toast.success(`Document '${fileName}' attached to Goods Receipt docket!`);
  };

  const handleDownloadDocument = (fileName: string) => {
    try {
      const dummyContent = `MAGNERTIA ERP - GOODS RECEIPT ATTACHMENT\nGR Number: GR-2026-000421\nPO Reference: PO-2026-000152\nVendor: ElectroMax Solutions Pvt. Ltd.\nFile: ${fileName}\nGenerated: ${new Date().toISOString()}\nStatus: Verified Inward Document\n\n[Authenticated via Magnertia ECM Gateway]`;
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
      title="Goods Receipt"
      breadcrumb="Management > Procurement Management"
      description="The Goods Receipt Form records and controls the physical receipt of materials/services against a Purchase Order (PO). It is the bridge between Procurement, Warehouse, Quality, Inventory, and Accounts Payable."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP MASTER HEADER & CONTROLS (Pixel-Matched with Screenshot!) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Row: Icon + Number + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <PackageCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    Under Inspection
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {header.grNumber}
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Receipt Date: <strong className="text-foreground">{header.receiptDate}</strong> · Receipt Type:{" "}
                  <strong className="text-foreground">{header.receiptType}</strong>
                </p>
              </div>
            </div>

            {/* Header Action Buttons - Streamlined & Purpose-built */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateGrn}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <FileBadge className="h-3.5 w-3.5" />
                Generate GRN
              </button>

              <button
                type="button"
                onClick={() => setShowNewGrModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New GR
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print Goods Receipt"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Master Detail Grid (Matching Exact Screenshot Attributes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Purchase Order</div>
              <div className="font-bold font-mono text-primary mt-0.5">
                <Link to="/management/procurement-management/purchase-order" className="hover:underline">
                  {header.purchaseOrder}
                </Link>
              </div>
              <div className="text-[10px] text-muted-foreground">Invoice: {header.vendorInvoiceNo}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Vendor</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{header.vendor}</div>
              <div className="text-[10px] text-muted-foreground">DC No: {header.deliveryChallanNo}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Warehouse</div>
              <div className="font-bold text-foreground mt-0.5">{header.warehouse}</div>
              <div className="text-[10px] text-muted-foreground">Vehicle: {header.vehicleNumber}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Department</div>
              <div className="font-bold text-foreground mt-0.5">{header.department}</div>
              <div className="text-[10px] text-muted-foreground">Received By: <strong className="text-foreground">{header.receivedBy}</strong></div>
            </div>

            {/* Right-aligned Receipt Summary Widget */}
            <div className="lg:col-span-3 p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Receipt Summary:</span>
                <div className="font-bold text-foreground mt-0.5">Total Items: <strong>6</strong> · Ordered: <strong>426</strong></div>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <div><span className="text-muted-foreground text-[10px]">Received:</span> <strong className="text-foreground">{header.totalReceivedQty}</strong></div>
                <div><span className="text-emerald-600 text-[10px]">Accepted:</span> <strong className="text-emerald-600">{header.totalAcceptedQty}</strong></div>
                <div><span className="text-rose-600 text-[10px]">Rejected:</span> <strong className="text-rose-600">{header.totalRejectedQty}</strong></div>
                <div><span className="text-amber-600 text-[10px]">Damaged:</span> <strong className="text-amber-600">{header.totalDamagedQty}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SUB-MODULE TABS - Streamlined & Essential Only */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "lineItems", label: "Line Items & Quantities", icon: ShoppingCart },
            { id: "quality", label: "Quality Inspection & Rejections", icon: ShieldCheck },
            { id: "putaway", label: "Put-away & Warehouse Bins", icon: Warehouse },
            { id: "documents", label: "Documents & Dossiers", icon: Paperclip },
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
                    Receipt Line Items & Batch Tracking
                  </h3>
                  <p className="text-xs text-muted-foreground">Reconciliation of Ordered, Received, Accepted, Rejected, and Storage Location Bins</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Batch Number</th>
                      <th className="py-2.5 px-3">Storage Bin</th>
                      <th className="py-2.5 px-3 text-right">Ordered</th>
                      <th className="py-2.5 px-3 text-right">Received</th>
                      <th className="py-2.5 px-3 text-right">Accepted</th>
                      <th className="py-2.5 px-3 text-right">Rejected</th>
                      <th className="py-2.5 px-3 text-center">Line Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {lines.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold">{item.itemDescription}</td>
                        <td className="py-3 px-3 font-mono text-primary">{item.batchNumber}</td>
                        <td className="py-3 px-3 font-mono">{item.storageBin}</td>
                        <td className="py-3 px-3 text-right font-bold">{item.orderedQty}</td>
                        <td className="py-3 px-3 text-right font-bold text-primary">{item.receivedQty}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600">{item.acceptedQty}</td>
                        <td className="py-3 px-3 text-right text-rose-600">{item.rejectedQty + item.damagedQty}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-bold",
                              item.lineStatus === "Accepted" && "bg-emerald-500/10 text-emerald-600",
                              item.lineStatus === "Under Inspection" && "bg-amber-500/10 text-amber-600",
                              item.lineStatus === "Rejected" && "bg-rose-500/10 text-rose-600"
                            )}
                          >
                            {item.lineStatus}
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

        {/* TAB 2: QUALITY INSPECTION & REJECTIONS */}
        {activeTab === "quality" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Incoming Material Quality Control & Inspection Sheet
                  </h3>
                  <p className="text-xs text-muted-foreground">Parameter verification against purchase requisition engineering specifications</p>
                </div>

                <button
                  type="button"
                  onClick={handleApproveQcAll}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve Pending QC
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Inspected Parameter</th>
                      <th className="py-2.5 px-3">Tolerance Limit</th>
                      <th className="py-2.5 px-3 text-right">Inspected Qty</th>
                      <th className="py-2.5 px-3 text-right">Accepted</th>
                      <th className="py-2.5 px-3 text-right">Rejected</th>
                      <th className="py-2.5 px-3 text-center">QC Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    <tr className="hover:bg-muted/20">
                      <td className="py-3 px-3 font-bold">Power Contactor (32A)</td>
                      <td className="py-3 px-3">Dielectric Strength & Coil Resistance</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">2.5kV AC / 50Hz (±2%)</td>
                      <td className="py-3 px-3 text-right font-bold">10</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">9</td>
                      <td className="py-3 px-3 text-right font-bold text-rose-600">1 (Coil Open)</td>
                      <td className="py-3 px-3 text-center">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Passed</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="py-3 px-3 font-bold">Energy Meter (3 Phase)</td>
                      <td className="py-3 px-3">RS485 Modbus Protocol & Accuracy Class</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">Class 0.5s (IEC 62053-22)</td>
                      <td className="py-3 px-3 text-right font-bold">25</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">24</td>
                      <td className="py-3 px-3 text-right font-bold text-rose-600">1 (Comms CRC)</td>
                      <td className="py-3 px-3 text-center">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Passed</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="py-3 px-3 font-bold">Control Components Kit</td>
                      <td className="py-3 px-3">Component Completeness & Visual Checklist</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">100% Visual Inspection</td>
                      <td className="py-3 px-3 text-right font-bold">5</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600">5</td>
                      <td className="py-3 px-3 text-right font-bold text-muted-foreground">0</td>
                      <td className="py-3 px-3 text-center">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Passed</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PUT-AWAY & WAREHOUSE BINS */}
        {activeTab === "putaway" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-primary" />
                    Put-away & Bin Routing Register
                  </h3>
                  <p className="text-xs text-muted-foreground">Automated destination rack, zone routing, and inventory credit confirmation</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Zone 1 · Electrical Racks</span>
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Racks 02-06</span>
                  </div>
                  <p className="text-muted-foreground">Allocated for 32A Contactors, MCBs, and Energy Meters</p>
                  <div className="pt-2 border-t border-border flex justify-between font-mono text-[11px]">
                    <span>Put-away items: <strong>38 Units</strong></span>
                    <span className="text-emerald-600 font-bold">✓ Routed</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Zone 2 · Assemblies</span>
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Rack 01</span>
                  </div>
                  <p className="text-muted-foreground">Allocated for Control Component Kits</p>
                  <div className="pt-2 border-t border-border flex justify-between font-mono text-[11px]">
                    <span>Put-away items: <strong>5 Sets</strong></span>
                    <span className="text-emerald-600 font-bold">✓ Routed</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700 dark:text-rose-300">Quarantine Bay</span>
                    <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600">Dock Bay 4</span>
                  </div>
                  <p className="text-muted-foreground">Held for vendor replacement / Return to Vendor (RTV)</p>
                  <div className="pt-2 border-t border-rose-500/20 flex justify-between font-mono text-[11px]">
                    <span>Quarantine items: <strong>5 Units</strong></span>
                    <span className="text-rose-600 font-bold">⚠ On Hold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTS & DOSSIERS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Inward Receipt Dossiers & Delivery Challans
                  </h3>
                  <p className="text-xs text-muted-foreground">Delivery challans, packing slips, gate passes, and QC inspection certificates</p>
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

        {/* MODAL: NEW GOODS RECEIPT */}
        {showNewGrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Record Inward Goods Receipt</h3>
                    <p className="text-xs text-muted-foreground">Inward gate logging against purchase order</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewGrModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Purchase Order *</label>
                  <input
                    type="text"
                    defaultValue="PO-2026-000152"
                    className="w-full rounded-lg border border-border bg-background p-2 text-primary font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Delivery Challan No *</label>
                  <input
                    type="text"
                    defaultValue="DC-EM-2026-0482"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Receiving Warehouse *</label>
                  <select className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer">
                    <option>Main Warehouse (Bay 4)</option>
                    <option>Plant 2 Inward Dock</option>
                    <option>Raw Material Store</option>
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Vehicle / Transporter LR *</label>
                  <input
                    type="text"
                    defaultValue="MH12AB1234 (LR-789654321)"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewGrModal(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Goods receipt recorded successfully!");
                    setShowNewGrModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Save & Inward Items
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: GENERATE GRN */}
        {showGrnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileBadge className="h-4 w-4 text-emerald-500" />
                  Generate Official Goods Receipt Note (GRN)
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGrnModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generated GRN No:</span>
                    <strong className="font-mono text-primary text-sm">GRN-2026-00084</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Accepted Qty:</span>
                    <strong className="text-emerald-700 dark:text-emerald-300 font-bold">45 Units</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GRN Value (After Tax):</span>
                    <strong className="text-foreground font-black text-sm">₹ 1,50,450.00</strong>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground">
                  Inventory will be automatically credited to <strong>Main Warehouse</strong> and quarantine stock will be cleared for 3-way matching.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowGrnModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("GRN-2026-00084 generated and inventory posted!");
                    setShowGrnModal(false);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm & Post to Inventory
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT GRN DOCKET */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                  <div className="text-xs font-semibold text-slate-500">OFFICIAL GOODS RECEIPT NOTE (GRN) DOCKET</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{header.grNumber}</div>
                  <div className="text-slate-500">Receipt: {header.receiptDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Receipt Details</div>
                  <div className="mt-1 font-semibold">{header.vendor}</div>
                  <div className="text-slate-500">PO: {header.purchaseOrder} · DC: {header.deliveryChallanNo}</div>
                  <div className="text-slate-500">Warehouse: {header.warehouse} · Recv By: {header.receivedBy}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Inward Summary</div>
                  <div className="mt-1 font-semibold text-emerald-800">Accepted Qty: 45 / 50 Units (90%)</div>
                  <div className="text-slate-500">Receipt Value: ₹ {header.thisReceiptAfterTax.toLocaleString("en-IN")}.00</div>
                  <div className="text-rose-700 font-bold">Rejected: 3 Units · Damaged: 2 Units</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Received Line Items</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Item Description</th>
                      <th className="p-2">Batch</th>
                      <th className="p-2 text-right">Recv</th>
                      <th className="p-2 text-right">Acc</th>
                      <th className="p-2 text-right">Rej</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lines.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2 font-mono">{idx + 1}</td>
                        <td className="p-2 font-bold">{item.itemDescription}</td>
                        <td className="p-2 font-mono text-[10px]">{item.batchNumber}</td>
                        <td className="p-2 text-right">{item.receivedQty}</td>
                        <td className="p-2 text-right font-bold text-emerald-700">{item.acceptedQty}</td>
                        <td className="p-2 text-right text-rose-700">{item.rejectedQty + item.damagedQty}</td>
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
                  Print GRN PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD GR DOCUMENT */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upload Goods Receipt Document</h3>
                    <p className="text-xs text-muted-foreground">Attach vendor delivery challan, gate pass, or QC reports</p>
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
                      Supports PDF, Images, Scanned DC (Max 25MB)
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
                      <option>Delivery Challan</option>
                      <option>Vendor Invoice Copy</option>
                      <option>QC Inspection Report</option>
                      <option>Packing Slip</option>
                      <option>Gate Inward Pass</option>
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

export default GoodsReceiptPage;
