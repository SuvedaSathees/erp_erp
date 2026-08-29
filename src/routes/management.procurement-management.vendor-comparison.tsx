import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  Scale,
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
  Handshake,
  MessageSquare,
  FileCheck,
  Shield,
  Truck,
  Percent,
  Bot,
  BrainCircuit,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Vendor Comparison & Multi-Criteria Evaluation Module · Magnertia ERP
export const Route = createFileRoute("/management/procurement-management/vendor-comparison")({
  head: () => ({
    meta: [
      { title: "Vendor Comparison Management · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Vendor Comparison Form — multi-criteria decision engine evaluating Price, Technical Compliance, Quality, Delivery, Payment, and Risk to select and recommend the optimal supplier.",
      },
    ],
  }),
  component: VendorComparisonPage,
});

// --- DATA TYPES ---

interface ComparedVendor {
  id: string;
  name: string;
  companyName: string;
  code: string;
  quotationNumber: string;
  basicQuote: number;
  discount: number;
  freight: number;
  tax: number;
  otherCharges: number;
  landedCost: number;
  commercialRank: string;
  technicalScore: number;
  deliveryScore: number;
  qualityScore: number;
  paymentScore: number;
  afterSalesScore: number;
  performanceScore: number;
  riskScore: number;
  overallScore: number;
  overallRank: number;
  leadTimeDays: number;
  warrantyMonths: number;
  riskLevel: "Low" | "Medium" | "High";
  status: "Recommended" | "Alternate" | "Review";
}

interface ItemComparisonLine {
  id: number;
  itemDescription: string;
  uom: string;
  requiredQty: number;
  vendorA_Landed: number;
  vendorB_Landed: number;
  vendorC_Landed: number;
  bestVendor: string;
}

// --- INITIAL MASTER DATA ---

const INITIAL_COMPARISON_HEADER = {
  comparisonId: "VCMP-ID-7401",
  comparisonNumber: "VCMP-2026-000074",
  comparisonTitle: "Vendor Comparison for EV Charging System Components",
  comparisonDate: "18 May 2026",
  status: "Recommendation" as const,
  evaluationMethod: "Weighted Scoring",
  sourceType: "RFQ",
  sourceNumber: "RFQ-2026-000089",
  tenderNumber: "TND-2026-000041",
  estimatedValue: 5500000,
  comparisonCurrency: "INR",
  requirementTitle: "Electrical Components for EV Charging System",
  department: "Engineering",
  project: "Smart EV Charging System",
  comparisonOwner: "Rahul Sharma",
  procurementCategory: "Electrical Components",
  vendorsComparedCount: 3,
  lowestLandedCost: 5465000,
  lowestCostVendor: "Vendor B (PowerGrid Components)",
  highestScore: 91.5,
  highestScoreVendor: "Vendor C (VoltTech Engineers)",
  potentialSavings: 35000,
  recommendedVendor: "Vendor C - VoltTech Engineers",
  recommendedRank: "Rank #1",
};

const INITIAL_VENDORS: ComparedVendor[] = [
  {
    id: "Vendor A",
    name: "Vendor A",
    companyName: "ElectroMax Solutions Pvt. Ltd.",
    code: "VEND-00452",
    quotationNumber: "EM-Q-2026-126",
    basicQuote: 4650000,
    discount: 120000,
    freight: 80000,
    tax: 830400,
    otherCharges: 25000,
    landedCost: 5480400,
    commercialRank: "#2",
    technicalScore: 90.5,
    deliveryScore: 91.0,
    qualityScore: 90.0,
    paymentScore: 88.0,
    afterSalesScore: 90.0,
    performanceScore: 91.0,
    riskScore: 90.0,
    overallScore: 90.4,
    overallRank: 2,
    leadTimeDays: 21,
    warrantyMonths: 24,
    riskLevel: "Low",
    status: "Alternate",
  },
  {
    id: "Vendor B",
    name: "Vendor B",
    companyName: "PowerGrid Components",
    code: "VEND-00318",
    quotationNumber: "PG-Q-2026-088",
    basicQuote: 4580000,
    discount: 80000,
    freight: 120000,
    tax: 810000,
    otherCharges: 15000,
    landedCost: 5465000,
    commercialRank: "#1",
    technicalScore: 88.5,
    deliveryScore: 86.0,
    qualityScore: 88.0,
    paymentScore: 78.0,
    afterSalesScore: 75.0,
    performanceScore: 88.0,
    riskScore: 65.0,
    overallScore: 89.5,
    overallRank: 3,
    leadTimeDays: 15,
    warrantyMonths: 18,
    riskLevel: "Medium",
    status: "Review",
  },
  {
    id: "Vendor C",
    name: "Vendor C",
    companyName: "VoltTech Engineers",
    code: "VEND-00509",
    quotationNumber: "VT-Q-2026-144",
    basicQuote: 4820000,
    discount: 150000,
    freight: 60000,
    tax: 850000,
    otherCharges: 30000,
    landedCost: 5520000, // or 54,20,000 negotiated
    commercialRank: "#3",
    technicalScore: 94.3,
    deliveryScore: 94.0,
    qualityScore: 94.0,
    paymentScore: 95.0,
    afterSalesScore: 96.0,
    performanceScore: 93.0,
    riskScore: 92.0,
    overallScore: 91.5,
    overallRank: 1,
    leadTimeDays: 30,
    warrantyMonths: 36,
    riskLevel: "Low",
    status: "Recommended",
  },
];

const INITIAL_ITEM_LINES: ItemComparisonLine[] = [
  { id: 1, itemDescription: "Power Contactor (32A)", uom: "Nos", requiredQty: 50, vendorA_Landed: 3136, vendorB_Landed: 3090, vendorC_Landed: 3200, bestVendor: "Vendor B" },
  { id: 2, itemDescription: "Energy Meter (3 Phase RS485)", uom: "Nos", requiredQty: 25, vendorA_Landed: 4432.5, vendorB_Landed: 4480, vendorC_Landed: 4390, bestVendor: "Vendor C" },
  { id: 3, itemDescription: "Control Components Kit", uom: "Set", requiredQty: 50, vendorA_Landed: 2450, vendorB_Landed: 2420, vendorC_Landed: 2440, bestVendor: "Vendor B" },
  { id: 4, itemDescription: "MCB (3P 63A C-Curve)", uom: "Nos", requiredQty: 100, vendorA_Landed: 841.5, vendorB_Landed: 830, vendorC_Landed: 825, bestVendor: "Vendor C" },
  { id: 5, itemDescription: "Cable Lug (16mm Heavy Duty)", uom: "Nos", requiredQty: 200, vendorA_Landed: 45, vendorB_Landed: 44, vendorC_Landed: 43.5, bestVendor: "Vendor C" },
  { id: 6, itemDescription: "Electrical Accessories Kit", uom: "Lot", requiredQty: 1, vendorA_Landed: 83990, vendorB_Landed: 84500, vendorC_Landed: 82000, bestVendor: "Vendor C" },
];

const INITIAL_COMPARISON_DOCS = [
  { id: 1, name: "Comparative_Statement_CS-7401.xlsx", type: "Comparative Statement (CS)", size: "480 KB", uploadedBy: "Rahul Sharma", date: "18 May 2026" },
  { id: 2, name: "Technical_Compliance_Matrix_QCBS.pdf", type: "Technical Evaluation", size: "1.2 MB", uploadedBy: "Rahul Sharma", date: "18 May 2026" },
  { id: 3, name: "Vendor_C_Commercial_Bid_EM-144.pdf", type: "Vendor Bid Dossier", size: "950 KB", uploadedBy: "VoltTech (Portal)", date: "16 May 2026" },
  { id: 4, name: "Tender_Committee_Sanction_Minutes.pdf", type: "Approval Sanction", size: "620 KB", uploadedBy: "Vikas Jain", date: "18 May 2026" },
];

export function VendorComparisonPage() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<string>("itemComparison");

  // State
  const [header, setHeader] = useState(INITIAL_COMPARISON_HEADER);
  const [vendors, setVendors] = useState<ComparedVendor[]>(INITIAL_VENDORS);
  const [itemLines, setItemLines] = useState<ItemComparisonLine[]>(INITIAL_ITEM_LINES);
  const [documents, setDocuments] = useState(INITIAL_COMPARISON_DOCS);

  // Modals
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showUploadDocModal, setShowUploadDocModal] = useState<boolean>(false);

  // New Comparison Form State
  const [newComparisonForm, setNewComparisonForm] = useState({
    sourceType: "RFQ",
    sourceNumber: "RFQ-2026-000412",
    requirementTitle: "Smart EV Charging Infrastructure Equipment",
    evaluationMethod: "Multi-Criteria Weighted Scoring (QCBS)",
    estimatedValue: 4850000,
    evaluator: "Rahul Sharma",
  });

  // Recommend Award Form State
  const [recommendForm, setRecommendForm] = useState({
    winner: "VoltTech Engineers (Vendor C)",
    agreedValue: 5510000,
    sanctionAuthority: "Vikas Jain (VP Procurement)",
    sanctionType: "Executive Committee Sanction",
    targetPoDate: "2026-05-25",
    remarks: "Unanimously approved for Purchase Order and Contract issuance based on QCBS score of 91.5 and superior SLA terms.",
  });

  // Document Upload Form
  const [docUploadForm, setDocUploadForm] = useState({
    name: "",
    type: "Comparative Statement (CS)",
    uploadedBy: "Rahul Sharma",
  });

  // Actions
  const handleSaveDraft = () => {
    toast.success("Vendor Comparison saved as draft.");
  };

  const handleRecalculateScores = () => {
    toast.success("Multi-criteria weighted scores recalculated across all 3 vendors!");
  };

  const handleRecommend = () => {
    setShowApprovalModal(true);
  };

  const handleConfirmAwardRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    setHeader((prev) => ({ ...prev, status: "Award Approved" as any }));
    setShowApprovalModal(false);
    toast.success(`Formal Procurement Award Sanction issued for ${recommendForm.winner} with agreed value of ₹ ${recommendForm.agreedValue.toLocaleString("en-IN")}!`);
  };

  const handleCreateNewComparison = (e: React.FormEvent) => {
    e.preventDefault();
    const newVCMPNumber = `VCMP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setHeader((prev) => ({
      ...prev,
      comparisonNumber: newVCMPNumber,
      sourceType: newComparisonForm.sourceType as any,
      sourceNumber: newComparisonForm.sourceNumber,
      requirementTitle: newComparisonForm.requirementTitle,
      evaluationMethod: newComparisonForm.evaluationMethod as any,
      estimatedValue: newComparisonForm.estimatedValue,
      evaluator: newComparisonForm.evaluator,
      comparisonDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Active Evaluation" as any,
    }));
    setShowNewModal(false);
    toast.success(`Created New Vendor Comparison Docket ${newVCMPNumber}!`);
  };

  const handleAwardVendor = (vendorName: string) => {
    setHeader((prev) => ({ ...prev, status: "Award Approved" as any }));
    toast.success(`Formal Procurement Award Sanction issued for ${vendorName}!`);
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = docUploadForm.name.trim() || `Comparison_Doc_${Date.now()}.pdf`;
    const newDoc = {
      id: documents.length + 1,
      name: fileName,
      type: docUploadForm.type,
      size: `${(Math.random() * 1.5 + 0.4).toFixed(1)} MB`,
      uploadedBy: docUploadForm.uploadedBy || "Rahul Sharma",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadDocModal(false);
    setDocUploadForm({ name: "", type: "Comparative Statement (CS)", uploadedBy: "Rahul Sharma" });
    toast.success(`Document '${fileName}' attached to comparison docket!`);
  };

  const handleDownloadDocument = (fileName: string) => {
    try {
      const dummyContent = `MAGNERTIA ERP - VENDOR COMPARISON ATTACHMENT\nComparison Ref: VCMP-2026-000074\nFile Name: ${fileName}\nGenerated: ${new Date().toISOString()}\nStatus: Verified Document\n\n[Content authenticated via Magnertia ECM Gateway]`;
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
      title="Vendor Comparison"
      breadcrumb="Management > Procurement Management"
      description="The Vendor Comparison Form is the decision engine that compares multiple eligible vendor quotations against the same RFQ, Tender, Purchase Requisition, or Procurement Requirement."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP MASTER HEADER & ACTIONS (Matching provided Screenshot Layout!) */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          {/* Top Row: Icon + Number + Status + Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/25 shadow-xs">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Scoring Completed
                  </span>
                  <h1 className="text-xl font-extrabold tracking-tight text-foreground font-mono">
                    {header.comparisonNumber}
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Comparison Date: <strong className="text-foreground">{header.comparisonDate}</strong> · Status:{" "}
                  <strong className="text-primary">{header.status}</strong> · Method:{" "}
                  <strong className="text-foreground">{header.evaluationMethod}</strong>
                </p>
              </div>
            </div>

            {/* Header Action Buttons - Streamlined & Purpose-built */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRecommend}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Award className="h-3.5 w-3.5" />
                Recommend Award
              </button>

              <button
                type="button"
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 text-primary" />
                New Comparison
              </button>

              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
                title="Print Comparison Sheet"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
            </div>
          </div>

          {/* Master Detail Grid (Matching Exact Screenshot Layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Source Type</div>
              <div className="font-bold text-foreground mt-0.5">{header.sourceType}</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                <Link to="/management/procurement-management/rfq-quotation" className="text-primary hover:underline">
                  {header.sourceNumber}
                </Link>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Estimated Value (INR)</div>
              <div className="font-extrabold text-foreground mt-0.5 text-sm">
                ₹ {header.estimatedValue.toLocaleString("en-IN")}.00
              </div>
              <div className="text-[10px] text-muted-foreground">Currency: {header.comparisonCurrency}</div>
            </div>

            <div className="lg:col-span-2">
              <div className="text-[11px] text-muted-foreground font-medium">Requirement Title</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{header.requirementTitle}</div>
              <div className="text-[10px] text-muted-foreground">Project: {header.project}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Department</div>
              <div className="font-bold text-foreground mt-0.5">{header.department}</div>
              <div className="text-[10px] text-muted-foreground">Owner: {header.comparisonOwner}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Procurement Category</div>
              <div className="font-bold text-foreground mt-0.5 truncate">{header.procurementCategory}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Tender: {header.tenderNumber}</div>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground font-medium">Comparison Status</div>
              <span className="inline-block mt-0.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 border border-blue-500/20">
                {header.status}
              </span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SUB-MODULE TABS - Streamlined & Essential Only */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "itemComparison", label: "Item Comparison", icon: ShoppingCart },
            { id: "commercial", label: "Commercial & Landed Cost", icon: DollarSign },
            { id: "technical", label: "Technical & Quality Scorecard", icon: ShieldCheck },
            { id: "recommendation", label: "Recommendation & Award", icon: Award },
            { id: "documents", label: "Documents & CS Dossiers", icon: Paperclip },
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

        {/* TAB 1: ITEM-WISE COMPARISON */}
        {activeTab === "itemComparison" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Item-wise Landed Cost Comparison Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">Line-by-line evaluated pricing across all 6 requirement items</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">UOM</th>
                      <th className="py-2.5 px-3 text-right">Required Qty</th>
                      <th className="py-2.5 px-3 text-right">Vendor A Landed</th>
                      <th className="py-2.5 px-3 text-right">Vendor B Landed</th>
                      <th className="py-2.5 px-3 text-right">Vendor C Landed</th>
                      <th className="py-2.5 px-3 text-center">Best Evaluated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {itemLines.map((line, idx) => (
                      <tr key={line.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold">{line.itemDescription}</td>
                        <td className="py-3 px-3">{line.uom}</td>
                        <td className="py-3 px-3 text-right font-bold">{line.requiredQty}</td>
                        <td className="py-3 px-3 text-right">₹ {line.vendorA_Landed.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-right">₹ {line.vendorB_Landed.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-right">₹ {line.vendorC_Landed.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                            {line.bestVendor}
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

        {/* TAB 2: COMMERCIAL COMPARISON */}
        {activeTab === "commercial" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {vendors.map((v) => (
                <div
                  key={v.id}
                  className={cn(
                    "rounded-xl border p-4 shadow-xs space-y-3",
                    v.id === "Vendor C"
                      ? "border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/20"
                      : "border-border/80 bg-card"
                  )}
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <div className="font-bold text-foreground">{v.companyName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{v.quotationNumber}</div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        v.commercialRank === "#1"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {v.commercialRank === "#1" ? "L1 Bidder" : `Rank ${v.commercialRank}`}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic Quote:</span>
                      <span className="font-semibold">₹ {v.basicQuote.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount:</span>
                      <span>- ₹ {v.discount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Freight & Other:</span>
                      <span>+ ₹ {(v.freight + v.otherCharges).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST Taxes:</span>
                      <span>+ ₹ {v.tax.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-1 font-extrabold text-sm">
                      <span className="text-foreground">Landed Cost:</span>
                      <span className="text-primary font-mono">₹ {v.landedCost.toLocaleString("en-IN")}.00</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Lead Time: <strong>{v.leadTimeDays} Days</strong></span>
                    <span>Warranty: <strong>{v.warrantyMonths} Months</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TECHNICAL & QUALITY SCORECARD */}
        {activeTab === "technical" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Multi-Criteria Evaluation Matrix (QCBS 70:30)
                  </h3>
                  <p className="text-xs text-muted-foreground">Comprehensive scoring across technical compliance, quality certifications, warranty, and risk</p>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground border-b border-border font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Vendor / Criteria</th>
                      <th className="py-2.5 px-3 text-right">Technical Score</th>
                      <th className="py-2.5 px-3 text-right">Quality Score</th>
                      <th className="py-2.5 px-3 text-right">Delivery Track</th>
                      <th className="py-2.5 px-3 text-right">Warranty</th>
                      <th className="py-2.5 px-3 text-center">Risk Level</th>
                      <th className="py-2.5 px-3 text-right font-black">QCBS Score</th>
                      <th className="py-2.5 px-3 text-center">Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {vendors.map((v) => (
                      <tr key={v.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3">
                          <div className="font-bold text-foreground">{v.companyName}</div>
                          <div className="text-[11px] text-muted-foreground">{v.code}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold">{v.technicalScore}%</td>
                        <td className="py-3 px-3 text-right font-semibold">{v.qualityScore}%</td>
                        <td className="py-3 px-3 text-right font-semibold">{v.deliveryScore}%</td>
                        <td className="py-3 px-3 text-right font-semibold">{v.warrantyMonths} Months</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold",
                              v.riskLevel === "Low"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600"
                            )}
                          >
                            {v.riskLevel} Risk
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-sm text-primary">{v.overallScore}</td>
                        <td className="py-3 px-3 text-center font-black">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold",
                              v.overallRank === 1
                                ? "bg-emerald-500 text-white"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            #{v.overallRank}
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

        {/* TAB 4: RECOMMENDATION & AWARD */}
        {activeTab === "recommendation" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white shadow-xs">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-foreground">Recommended Vendor: VoltTech Engineers (Vendor C)</h3>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-black text-emerald-700 dark:text-emerald-300">
                        Rank #1 (Score: 91.5)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Optimal balance of technical excellence, 36-month warranty, and reliability</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAwardVendor("VoltTech Engineers")}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve & Confirm Award
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div className="p-3.5 rounded-lg border border-border/80 bg-card space-y-1">
                  <span className="text-muted-foreground">Evaluated Landed Cost:</span>
                  <div className="text-base font-black text-foreground font-mono">₹ 55,20,000.00</div>
                  <p className="text-[11px] text-muted-foreground">Within approved budget head ceiling</p>
                </div>

                <div className="p-3.5 rounded-lg border border-border/80 bg-card space-y-1">
                  <span className="text-muted-foreground">Warranty & Lifecycle Value:</span>
                  <div className="text-base font-black text-emerald-600">36 Months Comprehensive</div>
                  <p className="text-[11px] text-muted-foreground">Includes free annual preventive maintenance</p>
                </div>

                <div className="p-3.5 rounded-lg border border-border/80 bg-card space-y-1">
                  <span className="text-muted-foreground">Lead Time & Delivery:</span>
                  <div className="text-base font-black text-foreground">30 Days (Direct to Site)</div>
                  <p className="text-[11px] text-muted-foreground">Guaranteed SLA alignment with project timeline</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENTS & DOSSIERS */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Comparative Statements & Evaluation Dossiers
                  </h3>
                  <p className="text-xs text-muted-foreground">Comparative sheets, technical scorecards, and committee audit minutes</p>
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
                        <td className="py-3 px-3">{doc.uploadedBy}</td>
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

        {/* MODAL: AI DEEP INSIGHTS */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">AI Procurement Strategy & Analysis</h3>
                    <p className="text-xs text-muted-foreground">Generated by Antigravity Decision Model</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                  <div className="font-bold text-emerald-800 dark:text-emerald-200 text-sm">
                    Recommended Supplier: Vendor C (VoltTech Engineers)
                  </div>
                  <p className="text-foreground leading-relaxed">
                    Although Vendor C is ₹ 55,000 higher than the lowest bidder (Vendor B), it provides significant strategic advantages:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground pl-1">
                    <li><strong>36 Months Warranty</strong> (vs 18 Months on Vendor B) saving ~₹ 1.2 Lakhs in AMC costs.</li>
                    <li><strong>96% Delivery Reliability</strong> eliminating commissioning delays on Smart EV Charging Stations.</li>
                    <li><strong>0% Advance Required</strong> (vs 20% on Vendor B) improving corporate cash flow.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                  <div className="font-bold text-foreground">Negotiation Action Plan:</div>
                  <div className="text-muted-foreground">
                    Engage Vendor C in Round 1 negotiation targeting ₹ 52,50,000.00 (~4.8% reduction). Retain Vendor A as secondary fallback.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Close & Apply Strategy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT COMPARISON DOCKET */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                  <div className="text-xs font-semibold text-slate-500">EXECUTIVE VENDOR COMPARISON & SELECTION DOCKET</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">{header.comparisonNumber}</div>
                  <div className="text-slate-500">Date: {header.comparisonDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Requirement Overview</div>
                  <div className="mt-1 font-semibold">{header.requirementTitle}</div>
                  <div className="text-slate-500">Source: {header.sourceType} ({header.sourceNumber})</div>
                  <div className="text-slate-500">Estimated Budget: ₹ {header.estimatedValue.toLocaleString("en-IN")}.00</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Evaluation Outcome</div>
                  <div className="mt-1 font-semibold text-emerald-800">Winner: Vendor C (VoltTech Engineers)</div>
                  <div className="text-slate-500">Weighted Score: 91.5 / 100 · Overall Rank: #1</div>
                  <div className="text-slate-500">Method: Weighted Scoring (QCBS)</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Evaluated Summary Table</div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                    <tr>
                      <th className="p-2">Vendor</th>
                      <th className="p-2 text-right">Landed Cost</th>
                      <th className="p-2 text-right">Tech Score</th>
                      <th className="p-2 text-right">Delivery Score</th>
                      <th className="p-2 text-right">Total Score</th>
                      <th className="p-2 text-center">Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {vendors.map((v) => (
                      <tr key={v.id}>
                        <td className="p-2 font-bold">{v.companyName}</td>
                        <td className="p-2 text-right">₹ {v.landedCost.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right">{v.technicalScore}%</td>
                        <td className="p-2 text-right">{v.deliveryScore}%</td>
                        <td className="p-2 text-right font-bold">{v.overallScore}</td>
                        <td className="p-2 text-center font-black">#{v.overallRank}</td>
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
                  Print Comparison Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD COMPARISON DOCUMENT */}
        {showUploadDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Upload Comparison Document</h3>
                    <p className="text-xs text-muted-foreground">Attach comparative statements, QCBS scorecards or approval minutes</p>
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
                      Supports PDF, XLSX, DOCX, CS Sheets (Max 25MB)
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
                      <option>Comparative Statement (CS)</option>
                      <option>Technical Evaluation</option>
                      <option>Vendor Bid Dossier</option>
                      <option>Approval Sanction</option>
                      <option>QCBS Scorecard</option>
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
        {/* MODAL: NEW VENDOR COMPARISON DOCKET */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">New Vendor Comparative Statement</h3>
                    <p className="text-xs text-muted-foreground">Setup comparative matrix against RFQ quotations or tender envelopes</p>
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

              <form onSubmit={handleCreateNewComparison} className="space-y-4 text-xs">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Source Procurement Type *</label>
                    <select
                      value={newComparisonForm.sourceType}
                      onChange={(e) => setNewComparisonForm({ ...newComparisonForm, sourceType: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-foreground font-semibold cursor-pointer"
                    >
                      <option>RFQ</option>
                      <option>Tender</option>
                      <option>Requisition</option>
                      <option>Direct Sourcing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Source Reference Number *</label>
                    <input
                      type="text"
                      required
                      value={newComparisonForm.sourceNumber}
                      onChange={(e) => setNewComparisonForm({ ...newComparisonForm, sourceNumber: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Requirement / Project Title *</label>
                    <input
                      type="text"
                      required
                      value={newComparisonForm.requirementTitle}
                      onChange={(e) => setNewComparisonForm({ ...newComparisonForm, requirementTitle: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Evaluation Methodology</label>
                    <select
                      value={newComparisonForm.evaluationMethod}
                      onChange={(e) => setNewComparisonForm({ ...newComparisonForm, evaluationMethod: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Multi-Criteria Weighted Scoring (QCBS)</option>
                      <option>Least Cost Selection (L1)</option>
                      <option>Quality Based Selection (QBS)</option>
                      <option>Total Cost of Ownership (TCO)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Estimated Budget Value (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newComparisonForm.estimatedValue}
                      onChange={(e) => setNewComparisonForm({ ...newComparisonForm, estimatedValue: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-primary font-bold text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Lead Procurement Evaluator</label>
                    <input
                      type="text"
                      value={newComparisonForm.evaluator}
                      onChange={(e) => setNewComparisonForm({ ...newComparisonForm, evaluator: e.target.value })}
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
                    <Plus className="h-3.5 w-3.5" /> Initialize Comparison Docket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: RECOMMEND AWARD & COMMERCIAL SANCTION */}
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Recommend Award & Issue Commercial Sanction</h3>
                    <p className="text-xs text-muted-foreground">Formally sanction procurement award and trigger Purchase Order generation</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Award Recommendation Summary Card */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-muted-foreground text-[10px]">Comparison Ref</span>
                    <div className="font-bold text-foreground mt-0.5">{header.comparisonNumber}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Top Evaluated Bidder</span>
                    <div className="font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{recommendForm.winner}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">QCBS Score</span>
                    <div className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5">91.5 / 100 (#1)</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px]">Evaluated Landed Value</span>
                    <div className="font-bold text-foreground mt-0.5">₹ 55,10,000.00</div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground pt-2 border-t border-emerald-500/20 leading-relaxed">
                  ✓ Passed all technical qualifications (95%), offers comprehensive 36-month OEM warranty, 96% delivery reliability, and zero advance payment requirement.
                </div>
              </div>

              <form onSubmit={handleConfirmAwardRecommendation} className="space-y-4 text-xs">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Selected Awardee Vendor *</label>
                    <select
                      value={recommendForm.winner}
                      onChange={(e) => setRecommendForm({ ...recommendForm, winner: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2.5 text-foreground font-bold cursor-pointer"
                    >
                      <option>VoltTech Engineers (Vendor C - Highest QCBS Score 91.5)</option>
                      <option>PowerGrid Components (Vendor B - Lowest Price L1)</option>
                      <option>ElectroMax Solutions (Vendor A - Balanced Score 87.8)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Agreed Final Contract Value (₹) *</label>
                    <input
                      type="number"
                      required
                      value={recommendForm.agreedValue}
                      onChange={(e) => setRecommendForm({ ...recommendForm, agreedValue: Number(e.target.value) })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-primary font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Target PO Issuance Date *</label>
                    <input
                      type="date"
                      required
                      value={recommendForm.targetPoDate}
                      onChange={(e) => setRecommendForm({ ...recommendForm, targetPoDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Sanctioning Authority *</label>
                    <input
                      type="text"
                      required
                      value={recommendForm.sanctionAuthority}
                      onChange={(e) => setRecommendForm({ ...recommendForm, sanctionAuthority: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Sanction Classification</label>
                    <select
                      value={recommendForm.sanctionType}
                      onChange={(e) => setRecommendForm({ ...recommendForm, sanctionType: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Executive Committee Sanction</option>
                      <option>CEO / Board Approval</option>
                      <option>Delegated Procurement Head Approval</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-muted-foreground font-medium block mb-1">Recommendation Remarks & Audit Note *</label>
                    <textarea
                      rows={3}
                      required
                      value={recommendForm.remarks}
                      onChange={(e) => setRecommendForm({ ...recommendForm, remarks: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowApprovalModal(false)}
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Award className="h-3.5 w-3.5" /> Sanction & Authorize Award
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

function CreditCardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

export default VendorComparisonPage;
