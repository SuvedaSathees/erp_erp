import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
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
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Vendor Quotation Module · Procurement Management
export const Route = createFileRoute("/management/procurement-management/vendor-quotation")({
  head: () => ({
    meta: [
      { title: "Vendor Quotation Management · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Vendor Quotation Form — commercial and technical quotation management from supplier submission through validation, technical evaluation, landed cost calculation, comparative statement, negotiation, and Purchase Order conversion.",
      },
    ],
  }),
  component: VendorQuotationPage,
});

// --- DATA TYPES ---

interface VendorQuoteLineItem {
  id: number;
  itemService: string;
  uom: string;
  rfqQty: number;
  quotedQty: number;
  unitPrice: number;
  discountPercent: number;
  netUnitPrice: number;
  lineValue: number;
  deliveryDays: number;
  status: "Compliant" | "Deviation" | "Alternative" | "Non-Compliant";
  brand?: string;
  model?: string;
  hsnSac?: string;
  taxRate?: number;
}

interface VendorAttachment {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedDate: string;
  uploadedBy: string;
  status: "Verified" | "Under Review";
}

interface VendorClarification {
  id: number;
  queryNumber: string;
  query: string;
  askedOn: string;
  status: "Answered" | "Pending";
  response?: string;
  responseDate?: string;
}

// --- INITIAL MOCK DATA ---

const INITIAL_QUOTATION_HEADER = {
  quotationId: "VQ-ID-9186",
  quotationNumber: "VQ-2026-000186",
  vendorQuotationRef: "EM-Q-2026-126",
  quotationDate: "12 May 2026",
  receivedDate: "12 May 2026 16:20",
  rfqNumber: "RFQ-2026-000089",
  tenderNumber: "TND-2026-000041",
  vendor: "ElectroMax Solutions Pvt. Ltd.",
  vendorCode: "VEND-00452",
  contactPerson: "Mr. Vivek Patel",
  vendorEmail: "vivek.patel@electromax.com",
  vendorPhone: "+91 98765 43210",
  vendorCategory: "Authorized OEM Distributor",
  vendorRating: 4.9,
  gstin: "29AABCE1234F1Z8",
  pan: "AABCE1234F",
  msmeStatus: "MSME Registered (Medium)",
  startupStatus: "No",
  currency: "INR",
  exchangeRate: 1.0,
  validUntil: "30 Jun 2026",
  submissionMethod: "Vendor Portal",
  quotationStatus: "Under Validation" as const,
  deliveryLocation: "Mumbai Warehouse (Bhiwandi Hub)",
  deliveryLeadTime: 21,
  partialDelivery: "Allowed",
  paymentTerms: "30% Advance, 70% on Delivery",
  warranty: "24 Months Comprehensive OEM Warranty",
  incoterms: "DAP (Delivered at Place)",
  sellersRemarks:
    "We confirm our best offer as per the technical specifications and terms mentioned in the RFQ. All items will be delivered within the committed lead time with full warranty and quality assurance.",
  authorizedBy: "Vivek Patel (Sales Manager)",
};

const INITIAL_LINE_ITEMS: VendorQuoteLineItem[] = [
  {
    id: 1,
    itemService: "Power Contactor (32A)",
    uom: "Nos",
    rfqQty: 50,
    quotedQty: 50,
    unitPrice: 3200,
    discountPercent: 2.0,
    netUnitPrice: 3136,
    lineValue: 156800,
    deliveryDays: 21,
    status: "Compliant",
    brand: "Schneider Electric",
    model: "TeSys D LC1D32M7",
    hsnSac: "8536",
    taxRate: 18,
  },
  {
    id: 2,
    itemService: "Energy Meter (3 Phase)",
    uom: "Nos",
    rfqQty: 25,
    quotedQty: 25,
    unitPrice: 4500,
    discountPercent: 1.5,
    netUnitPrice: 4432.5,
    lineValue: 110812.5,
    deliveryDays: 18,
    status: "Compliant",
    brand: "Secure Meters",
    model: "Elite 440 Modbus",
    hsnSac: "9028",
    taxRate: 18,
  },
  {
    id: 3,
    itemService: "Control Components Kit",
    uom: "Set",
    rfqQty: 50,
    quotedQty: 50,
    unitPrice: 2500,
    discountPercent: 2.0,
    netUnitPrice: 2450,
    lineValue: 122500,
    deliveryDays: 21,
    status: "Compliant",
    brand: "Phoenix Contact",
    model: "RIF-1 Module Pack",
    hsnSac: "8537",
    taxRate: 18,
  },
  {
    id: 4,
    itemService: "MCB (3P 63A)",
    uom: "Nos",
    rfqQty: 100,
    quotedQty: 100,
    unitPrice: 850,
    discountPercent: 1.0,
    netUnitPrice: 841.5,
    lineValue: 84150,
    deliveryDays: 15,
    status: "Compliant",
    brand: "Schneider Acti9",
    model: "iC60N 63A C-Curve",
    hsnSac: "8536",
    taxRate: 18,
  },
  {
    id: 5,
    itemService: "Cable Lug (16mm)",
    uom: "Nos",
    rfqQty: 200,
    quotedQty: 200,
    unitPrice: 45,
    discountPercent: 0.0,
    netUnitPrice: 45,
    lineValue: 9000,
    deliveryDays: 10,
    status: "Compliant",
    brand: "Dowells",
    model: "Heavy Duty Tin Copper",
    hsnSac: "8538",
    taxRate: 18,
  },
  {
    id: 6,
    itemService: "Electrical Accessories",
    uom: "Lot",
    rfqQty: 1,
    quotedQty: 1,
    unitPrice: 85000,
    discountPercent: 1.18,
    netUnitPrice: 83990,
    lineValue: 83990,
    deliveryDays: 20,
    status: "Compliant",
    brand: "Lapp / Wago",
    model: "Accessories Lot Rev3",
    hsnSac: "8538",
    taxRate: 18,
  },
];

const INITIAL_ATTACHMENTS: VendorAttachment[] = [
  { id: 1, name: "Commercial_Offer.pdf", type: "Commercial Bid", size: "652 KB", uploadedDate: "12 May 2026", uploadedBy: "Vivek Patel", status: "Verified" },
  { id: 2, name: "Technical_Proposal.pdf", type: "Technical Offer", size: "1.3 MB", uploadedDate: "12 May 2026", uploadedBy: "Vivek Patel", status: "Verified" },
  { id: 3, name: "Gate_Certificate.pdf", type: "Quality Cert", size: "289 KB", uploadedDate: "12 May 2026", uploadedBy: "Vivek Patel", status: "Verified" },
  { id: 4, name: "GST_Certificate.pdf", type: "Statutory", size: "412 KB", uploadedDate: "12 May 2026", uploadedBy: "Vivek Patel", status: "Verified" },
  { id: 5, name: "MSME_Registration_Cert.pdf", type: "Statutory", size: "320 KB", uploadedDate: "12 May 2026", uploadedBy: "Vivek Patel", status: "Verified" },
  { id: 6, name: "Energy_Meter_Calibration_Report.pdf", type: "Test Report", size: "890 KB", uploadedDate: "12 May 2026", uploadedBy: "Vivek Patel", status: "Verified" },
  { id: 7, name: "Contactor_Endurance_Test_Cert.pdf", type: "Test Report", size: "750 KB", uploadedDate: "12 May 2026", uploadedBy: "Vivek Patel", status: "Verified" },
  { id: 8, name: "Bank_Mandate_Form.pdf", type: "Financial", size: "210 KB", uploadedDate: "12 May 2026", uploadedBy: "Vivek Patel", status: "Verified" },
];

const INITIAL_CLARIFICATIONS: VendorClarification[] = [
  {
    id: 1,
    queryNumber: "Q-01",
    query: "Please confirm the warranty period.",
    askedOn: "11 May 2026",
    status: "Answered",
    response: "We confirm 24 months standard OEM comprehensive replacement warranty from the date of commissioning.",
    responseDate: "11 May 2026 18:00",
  },
  {
    id: 2,
    queryNumber: "Q-02",
    query: "Kindly provide test certificate for Energy Meter.",
    askedOn: "12 May 2026",
    status: "Answered",
    response: "NABL calibrated laboratory test certificate attached under Technical Dossier (Doc Ref: Energy_Meter_Calibration_Report.pdf).",
    responseDate: "12 May 2026 15:40",
  },
];

export function VendorQuotationPage() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<string>("lineItems");

  // State
  const [header, setHeader] = useState(INITIAL_QUOTATION_HEADER);
  const [lineItems, setLineItems] = useState<VendorQuoteLineItem[]>(INITIAL_LINE_ITEMS);
  const [attachments, setAttachments] = useState<VendorAttachment[]>(INITIAL_ATTACHMENTS);
  const [clarifications, setClarifications] = useState<VendorClarification[]>(INITIAL_CLARIFICATIONS);

  // Modals
  const [showNewQuoteModal, setShowNewQuoteModal] = useState<boolean>(false);
  const [showAddLineModal, setShowAddLineModal] = useState<boolean>(false);
  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);
  const [showClarificationModal, setShowClarificationModal] = useState<boolean>(false);
  const [showPoModal, setShowPoModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);
  const [showEvalModal, setShowEvalModal] = useState<boolean>(false);

  // New Quotation Form State
  const [newQuoteForm, setNewQuoteForm] = useState({
    vendor: "ElectroMax Solutions Pvt. Ltd.",
    vendorCode: "VEN-EMS-001",
    rfqNumber: "RFQ-2026-000412",
    quotationNumber: "EM-Q-2026-128",
    quotationDate: "2026-05-18",
    paymentTerms: "30 Days Net",
    deliveryPeriod: "15 Days",
    validityDays: 60,
    grossValue: 676507,
  });

  // Evaluation Form State
  const [evalForm, setEvalForm] = useState({
    evaluator: "Rahul Sharma (Sourcing Lead)",
    evaluationStage: "Two-Envelope Technical & Commercial (QCBS)",
    targetDate: "2026-05-25",
    priority: "High",
    remarks: "Quotation validated against RFQ-2026-000412. All 6 line items, HSN codes, and GST rates verified. Forwarding for technical compliance committee review.",
  });

  // Document Upload Form
  const [docUploadForm, setDocUploadForm] = useState({
    name: "",
    type: "Commercial Bid",
    uploadedBy: "Vivek Patel",
  });

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = docUploadForm.name.trim() || `VQ_Doc_${Date.now()}.pdf`;
    const newDoc: VendorAttachment = {
      id: attachments.length + 1,
      name: fileName,
      type: docUploadForm.type,
      size: `${(Math.random() * 1.5 + 0.4).toFixed(1)} MB`,
      uploadedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      uploadedBy: docUploadForm.uploadedBy || "Vivek Patel",
      status: "Verified",
    };
    setAttachments([newDoc, ...attachments]);
    setShowUploadDocModal(false);
    setDocUploadForm({ name: "", type: "Commercial Bid", uploadedBy: "Vivek Patel" });
    toast.success(`Document '${fileName}' attached to vendor quotation dossier!`);
  };

  const handleDownloadDocument = (fileName: string) => {
    try {
      const dummyContent = `MAGNERTIA ERP - VENDOR QUOTATION ATTACHMENT\nQuote Ref: EM-Q-2026-126\nFile Name: ${fileName}\nVendor: ElectroMax Solutions Pvt. Ltd.\nGenerated: ${new Date().toISOString()}\nStatus: Verified Document\n\n[Content authenticated via Magnertia ECM Gateway]`;
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
    setAttachments(attachments.filter((a) => a.id !== id));
    toast.info(`Document '${name}' removed.`);
  };

  // Calculations (Exact Pixel Match with Screenshot Figures)
  const basicItemValue = 567252.5;
  const itemDiscount = 7941.5;
  const overallDiscount = 5000.0;
  const subTotal = 554311.0;
  const freightCharges = 12500.0;
  const packingCharges = 3000.0;
  const insuranceCharges = 1500.0;
  const installationCharges = 0.0;
  const otherCharges = 2000.0;
  const taxableValue = 573311.0;
  const cgst = 51598.0;
  const sgst = 51598.0;
  const igst = 0.0;
  const totalTax = 103196.0;
  const grandTotal = 676507.0;

  // Actions
  const handleSaveDraft = () => {
    toast.success("Vendor Quotation saved as draft.");
  };

  const handleValidate = () => {
    setShowValidationModal(true);
  };

  const handleConfirmEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    setHeader((prev) => ({ ...prev, quotationStatus: "Technical Evaluation" as any }));
    setShowEvalModal(false);
    toast.success(`Quotation ${header.quotationNumber} from ${header.vendor} submitted for Technical & Commercial Evaluation!`);
  };

  const handleCreateNewQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setHeader((prev) => ({
      ...prev,
      quotationNumber: newQuoteForm.quotationNumber,
      vendor: newQuoteForm.vendor,
      vendorCode: newQuoteForm.vendorCode,
      rfqNumber: newQuoteForm.rfqNumber,
      quotationDate: newQuoteForm.quotationDate,
      paymentTerms: newQuoteForm.paymentTerms,
      deliveryPeriod: newQuoteForm.deliveryPeriod,
      validityDays: newQuoteForm.validityDays,
      quotationStatus: "Received" as any,
    }));
    setShowNewQuoteModal(false);
    toast.success(`Created New Vendor Quotation ${newQuoteForm.quotationNumber} for ${newQuoteForm.vendor}!`);
  };

  const handleCreatePo = () => {
    toast.success(`Purchase Order generated for ${header.vendor} with value ₹ ${grandTotal.toLocaleString("en-IN")}.00!`);
    setShowPoModal(false);
  };

  return (
    <AppShell
      title="Vendor Quotation"
      breadcrumb="Management > Procurement Management"
      description="The Vendor Quotation Form manages quotations received from suppliers against an RFQ or Tender. It captures commercial, technical, delivery, tax, and compliance details and feeds into quotation comparison, evaluation, negotiation, and supplier selection."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP QUOTATION MASTER BANNER & CONTROLS (Matching Provided Screenshot Layout!) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Bar: Icon + Number + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Received
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {header.quotationNumber}
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Quotation Date: <strong className="text-foreground">{header.quotationDate}</strong> · Received Date:{" "}
                  <strong className="text-foreground">{header.receivedDate}</strong>
                </p>
              </div>
            </div>

            {/* Header Action Buttons - Streamlined & Purpose-built */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEvalModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Submit for Evaluation
              </button>

              <button
                type="button"
                onClick={() => setShowNewQuoteModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New Quotation
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print Quotation"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Master Detail Grid (Matching exact screenshot attributes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">RFQ Number</div>
              <div className="font-bold font-mono text-primary mt-0.5">
                <Link to="/management/procurement-management/rfq-quotation" className="hover:underline">
                  {header.rfqNumber}
                </Link>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Tender: {header.tenderNumber}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Vendor</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{header.vendor}</div>
              <div className="text-[10px] text-muted-foreground">Contact: {header.contactPerson}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Vendor Person</div>
              <div className="font-bold text-foreground mt-0.5 font-mono">{header.vendorCode}</div>
              <div className="text-[10px] text-muted-foreground truncate">{header.vendorEmail}</div>
              <div className="text-[10px] text-muted-foreground">{header.vendorPhone}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Currency</div>
              <div className="font-bold text-foreground mt-0.5">{header.currency}</div>
              <div className="text-[10px] text-muted-foreground">Ex. Rate: {header.exchangeRate.toFixed(4)}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Valid Until</div>
              <div className="font-bold text-foreground mt-0.5">{header.validUntil}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">49 Days Left</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Submission Method</div>
              <div className="font-bold text-foreground mt-0.5">{header.submissionMethod}</div>
              <div className="text-[10px] text-muted-foreground">Encrypted Submission</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Quotation Status</div>
              <span className="inline-block mt-0.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                {header.quotationStatus}
              </span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SUB-MODULE TABS NAVIGATION - Streamlined & Essential Only */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "lineItems", label: "Line Items", icon: ShoppingCart },
            { id: "commercial", label: "Commercial Summary", icon: DollarSign },
            { id: "technical", label: "Technical Offer", icon: ShieldCheck },
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

        {/* TAB 2: LINE ITEMS */}
        {activeTab === "lineItems" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Quotation Line Items (6 Items)
                  </h3>
                  <p className="text-xs text-muted-foreground">Item descriptions, unit pricing, discounts, and HSN/SAC taxes</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item / Service</th>
                      <th className="py-2.5 px-3">Brand & Model</th>
                      <th className="py-2.5 px-3">UOM</th>
                      <th className="py-2.5 px-3 text-right">Quoted Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Discount %</th>
                      <th className="py-2.5 px-3 text-right">Net Price</th>
                      <th className="py-2.5 px-3 text-right">Total Line Value</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold">{item.itemService}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.brand} ({item.model})</td>
                        <td className="py-3 px-3">{item.uom}</td>
                        <td className="py-3 px-3 text-right font-bold">{item.quotedQty}</td>
                        <td className="py-3 px-3 text-right">₹ {item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right text-emerald-600 font-semibold">{item.discountPercent.toFixed(2)}%</td>
                        <td className="py-3 px-3 text-right font-medium">₹ {item.netUnitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">
                          ₹ {item.lineValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
                      <td colSpan={8} className="py-3 px-3 text-right text-xs">Total Basic Line Value:</td>
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

        {/* TAB 3: COMMERCIAL SUMMARY */}
        {activeTab === "commercial" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  Commercial Terms & Grand Total Computation
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 text-xs">
                <div className="space-y-2 p-4 rounded-xl border border-border bg-muted/10">
                  <div className="font-bold text-foreground text-sm border-b border-border pb-2">Item Pricing & Charges</div>
                  <div className="flex justify-between"><span>Basic Item Value:</span><strong>₹ 5,67,252.50</strong></div>
                  <div className="flex justify-between text-rose-600"><span>Item Discount:</span><strong>- ₹ 7,941.50</strong></div>
                  <div className="flex justify-between text-rose-600"><span>Overall Special Discount:</span><strong>- ₹ 5,000.00</strong></div>
                  <div className="flex justify-between font-bold border-t border-border pt-1"><span>Net Subtotal:</span><strong>₹ 5,54,311.00</strong></div>
                  <div className="flex justify-between"><span>Freight & Transit Charges:</span><strong>+ ₹ 12,500.00</strong></div>
                  <div className="flex justify-between"><span>Packing & Forwarding:</span><strong>+ ₹ 3,000.00</strong></div>
                  <div className="flex justify-between"><span>Transit Insurance:</span><strong>+ ₹ 1,500.00</strong></div>
                  <div className="flex justify-between"><span>Other Handling Charges:</span><strong>+ ₹ 2,000.00</strong></div>
                </div>

                <div className="space-y-2 p-4 rounded-xl border border-border bg-muted/10">
                  <div className="font-bold text-foreground text-sm border-b border-border pb-2">Tax Breakdown & Landed Total</div>
                  <div className="flex justify-between"><span>Total Taxable Value:</span><strong>₹ 5,73,311.00</strong></div>
                  <div className="flex justify-between"><span>CGST @ 9%:</span><strong>₹ 51,598.00</strong></div>
                  <div className="flex justify-between"><span>SGST @ 9%:</span><strong>₹ 51,598.00</strong></div>
                  <div className="flex justify-between font-bold border-t border-border pt-1"><span>Total Tax Outlay:</span><strong>₹ 1,03,196.00</strong></div>
                  <div className="p-3 mt-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between text-sm">
                    <span className="font-black text-foreground">FINAL GRAND TOTAL (INR):</span>
                    <span className="font-black text-primary text-base">₹ 6,76,507.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TECHNICAL OFFER */}
        {activeTab === "technical" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Technical Offer & Deviation Statement
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">Compliance Status</span>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5">Fully Compliant (92%)</div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">Warranty Guarantee</span>
                  <div className="text-sm font-bold text-foreground mt-0.5">24 Months Comprehensive</div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-muted-foreground text-[11px]">Alternative Offered</span>
                  <div className="text-sm font-bold text-foreground mt-0.5">No Alternative (Exact OEM)</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="font-bold text-foreground">Technical Remarks & Certification Details:</div>
                <p className="p-3 rounded-lg bg-muted/20 border border-border text-foreground leading-relaxed">
                  All components supplied with original test certificates (IEC 60947-4-1 for Contactors, IEC 62053-22 for Energy Meters). Schneider TeSys D Contactors and Secure Elite 440 Meters meet all operational telemetry protocols for EV charging infrastructure.
                </p>
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
                    Vendor Quotation Dossier & Attachments (8 Files)
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload File
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
                      <th className="py-2.5 px-3">Uploaded Date</th>
                      <th className="py-2.5 px-3">Uploaded By</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {attachments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{doc.id}</td>
                        <td className="py-3 px-3 font-bold text-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-primary" /> {doc.name}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.type}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">{doc.size}</td>
                        <td className="py-3 px-3 text-muted-foreground">{doc.uploadedDate}</td>
                        <td className="py-3 px-3">{doc.uploadedBy}</td>
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

        {/* MODAL: NEW QUOTATION WIZARD */}
        {showNewQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Record Vendor Quotation</h3>
                    <p className="text-xs text-muted-foreground">Capture supplier bid details for RFQ or Tender</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewQuoteModal(false)}
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
                  <label className="text-muted-foreground font-medium block mb-1">Vendor Quote Reference No *</label>
                  <input
                    type="text"
                    defaultValue="EM-Q-2026-126"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Linked RFQ Number</label>
                  <input
                    type="text"
                    defaultValue="RFQ-2026-000089"
                    className="w-full rounded-lg border border-border bg-background p-2 text-primary font-mono"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Quote Validity Date *</label>
                  <input
                    type="date"
                    defaultValue="2026-06-30"
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewQuoteModal(false)}
                  className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("New vendor quotation recorded successfully!");
                    setShowNewQuoteModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Save & Add Line Items
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: VALIDATION CHECK */}
        {showValidationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Quotation Automated Validation
                </h3>
                <button
                  type="button"
                  onClick={() => setShowValidationModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <span>RFQ Quantity Match:</span>
                  <strong className="text-emerald-600">100% (426 / 426)</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <span>Vendor Eligibility:</span>
                  <strong className="text-emerald-600">Verified (Active Tier-1)</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <span>Mandatory Documents:</span>
                  <strong className="text-emerald-600">100% (8 / 8 Attached)</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <span>Quote Validity Period:</span>
                  <strong className="text-emerald-600">Valid (49 Days Left)</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-500/20">
                  <span>Validation Result:</span>
                  <span>✓ VALID FOR EVALUATION</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Quotation validation audit logged.");
                    setShowValidationModal(false);
                  }}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Confirm Validation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT DOCKET */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                  <div className="text-xs font-semibold text-slate-500">OFFICIAL VENDOR QUOTATION DOCKET</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{header.quotationNumber}</div>
                  <div className="text-slate-500">Received: {header.receivedDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Vendor Information</div>
                  <div className="mt-1 font-semibold">{header.vendor} ({header.vendorCode})</div>
                  <div className="text-slate-500">Contact: {header.contactPerson} · {header.vendorEmail}</div>
                  <div className="text-slate-500">GSTIN: {header.gstin} · Rating: ★ {header.vendorRating}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Commercial & Financials</div>
                  <div className="mt-1 font-semibold text-primary">Grand Total: ₹ 6,76,507.00</div>
                  <div className="text-slate-500">Payment: {header.paymentTerms}</div>
                  <div className="text-emerald-700 font-bold">Technical Compliance: 92% (Qualified)</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Quoted Line Items (BOQ)</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Item Description</th>
                      <th className="p-2">UOM</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Unit Price</th>
                      <th className="p-2 text-right">Line Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lineItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2 font-mono">{idx + 1}</td>
                        <td className="p-2 font-bold">{item.itemService}</td>
                        <td className="p-2">{item.uom}</td>
                        <td className="p-2 text-right font-bold">{item.quotedQty}</td>
                        <td className="p-2 text-right">₹ {item.netUnitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="p-2 text-right font-bold">₹ {item.lineValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
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
                  Print PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD VENDOR DOCUMENT */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upload Vendor Attachment</h3>
                    <p className="text-xs text-muted-foreground">Attach commercial offer, technical proposal, or quality certificates</p>
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
                      Supports PDF, XLSX, DOCX, Certificates (Max 25MB)
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
                      <option>Commercial Bid</option>
                      <option>Technical Offer</option>
                      <option>Quality Cert</option>
                      <option>Statutory</option>
                      <option>Test Report</option>
                      <option>Financial</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Uploaded By</label>
                    <input
                      type="text"
                      value={docUploadForm.uploadedBy}
                      onChange={(e) => setDocUploadForm({ ...docUploadForm, uploadedBy: e.target.value })}
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
        {/* MODAL: SUBMIT FOR EVALUATION */}
        {showEvalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Submit Quotation for Evaluation</h3>
                    <p className="text-xs text-muted-foreground">Route vendor commercial & technical dossier to evaluation committee</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEvalModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Summary Banner */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-2.5 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Quotation Ref</span>
                    <div className="font-bold text-foreground font-mono mt-0.5">{header.quotationNumber}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Vendor Name</span>
                    <div className="font-bold text-foreground truncate mt-0.5">{header.vendor}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Quoted Landed Value</span>
                    <div className="font-bold text-primary mt-0.5">₹ {grandTotal.toLocaleString("en-IN")}.00</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Current Status</span>
                    <div className="font-bold text-emerald-600 mt-0.5">{header.quotationStatus}</div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground pt-2 border-t border-blue-500/20">
                  ✓ Verified all 6 quoted line items, OEM warranty terms, HSN codes, and 18% GST tax rate against RFQ baseline.
                </div>
              </div>

              <form onSubmit={handleConfirmEvaluation} className="space-y-4 text-xs">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Assigned Sourcing Reviewer *</label>
                    <input
                      type="text"
                      required
                      value={evalForm.evaluator}
                      onChange={(e) => setEvalForm({ ...evalForm, evaluator: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Evaluation Methodology Stage</label>
                    <select
                      value={evalForm.evaluationStage}
                      onChange={(e) => setEvalForm({ ...evalForm, evaluationStage: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Two-Envelope Technical & Commercial (QCBS)</option>
                      <option>Least Cost Evaluation (L1)</option>
                      <option>Direct Technical Qualification</option>
                      <option>Commercial Price Bid Opening</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Target Evaluation Due Date *</label>
                    <input
                      type="date"
                      required
                      value={evalForm.targetDate}
                      onChange={(e) => setEvalForm({ ...evalForm, targetDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Evaluation Priority</label>
                    <select
                      value={evalForm.priority}
                      onChange={(e) => setEvalForm({ ...evalForm, priority: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>High</option>
                      <option>Urgent</option>
                      <option>Normal</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Evaluation Routing & Committee Remarks *</label>
                    <textarea
                      rows={3}
                      required
                      value={evalForm.remarks}
                      onChange={(e) => setEvalForm({ ...evalForm, remarks: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowEvalModal(false)}
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit to Evaluation Committee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: NEW VENDOR QUOTATION MASTER DOCKET */}
        {showNewQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">New Vendor Quotation Docket</h3>
                    <p className="text-xs text-muted-foreground">Register received quotation offer against RFQ or Tender</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewQuoteModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNewQuote} className="space-y-4 text-xs">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Vendor Name *</label>
                    <select
                      value={newQuoteForm.vendor}
                      onChange={(e) => {
                        const vendorMap: Record<string, string> = {
                          "ElectroMax Solutions Pvt. Ltd.": "VEN-EMS-001",
                          "PowerGrid Components Ltd.": "VEN-PGC-002",
                          "VoltTech Engineers LLP": "VEN-VTE-003",
                          "Techno Electric Solutions": "VEN-TES-004",
                        };
                        setNewQuoteForm({
                          ...newQuoteForm,
                          vendor: e.target.value,
                          vendorCode: vendorMap[e.target.value] || "VEN-GEN-001",
                        });
                      }}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-foreground font-semibold cursor-pointer"
                    >
                      <option>ElectroMax Solutions Pvt. Ltd.</option>
                      <option>PowerGrid Components Ltd.</option>
                      <option>VoltTech Engineers LLP</option>
                      <option>Techno Electric Solutions</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">RFQ Reference Number *</label>
                    <input
                      type="text"
                      required
                      value={newQuoteForm.rfqNumber}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, rfqNumber: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Supplier Quotation Ref No *</label>
                    <input
                      type="text"
                      required
                      value={newQuoteForm.quotationNumber}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, quotationNumber: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Quotation Date *</label>
                    <input
                      type="date"
                      required
                      value={newQuoteForm.quotationDate}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, quotationDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Gross Quotation Value (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newQuoteForm.grossValue}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, grossValue: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-primary font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Delivery Lead Time</label>
                    <input
                      type="text"
                      value={newQuoteForm.deliveryPeriod}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, deliveryPeriod: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Payment Terms</label>
                    <select
                      value={newQuoteForm.paymentTerms}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, paymentTerms: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>30 Days Net</option>
                      <option>100% Against Delivery</option>
                      <option>20% Advance / 80% Delivery</option>
                      <option>Letter of Credit (LC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Quote Validity (Days)</label>
                    <input
                      type="number"
                      value={newQuoteForm.validityDays}
                      onChange={(e) => setNewQuoteForm({ ...newQuoteForm, validityDays: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowNewQuoteModal(false)}
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Create Quotation Docket
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

export default VendorQuotationPage;
