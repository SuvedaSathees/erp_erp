import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  Award,
  Star,
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
  CheckSquare,
  Sparkles,
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
  Activity,
  Bell,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/procurement-management/vendor-evaluation")({
  head: () => ({
    meta: [
      { title: "Vendor Evaluation · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Vendor Evaluation Form — weighted scoring (Quality, Price, Delivery, Technical, Compliance, Risk), classification, audit scorecard, and corrective action plans (CAPA).",
      },
    ],
  }),
  component: VendorEvaluationPage,
});

// --- DATA TYPES ---

interface VendorDocExpiry {
  id: number;
  name: string;
  expiryDate: string;
  status: "Valid" | "Expiring Soon" | "Expiring";
  action: "View" | "Upload";
}

interface VendorOpenPO {
  poNumber: string;
  poDate: string;
  buyer: string;
  totalValue: number;
  deliverBy: string;
  orderStatus: "Partially Delivered" | "Accepted" | "Pending Delivery";
}

// --- INITIAL MASTER DATA ---

const EVALUATION_VENDORS = [
  {
    id: "SUP-000184",
    name: "ElectroMax Solutions Pvt. Ltd.",
    code: "EMS-184",
    score: 88.5,
    tier: "Preferred Supplier (Tier 1)",
    badge: "Verified Supplier",
    qualityScore: 92,
    qualityPpm: "142 PPM",
    otifScore: 88,
    otifPercent: "94.8%",
    priceScore: 85,
    priceSavings: "-3.2% vs Benchmark",
    complianceScore: 95,
  },
  {
    id: "SUP-00131",
    name: "PowerGrid Components",
    code: "PGC-131",
    score: 84.2,
    tier: "Approved Supplier (Tier 2)",
    badge: "Audited Supplier",
    qualityScore: 89,
    qualityPpm: "210 PPM",
    otifScore: 95,
    otifPercent: "97.2%",
    priceScore: 82,
    priceSavings: "+1.1% vs Benchmark",
    complianceScore: 90,
  },
  {
    id: "SUP-00241",
    name: "VoltTech Engineers",
    code: "VTE-241",
    score: 81.0,
    tier: "Under Observation",
    badge: "Probationary",
    qualityScore: 95,
    qualityPpm: "98 PPM",
    otifScore: 75,
    otifPercent: "82.4%",
    priceScore: 78,
    priceSavings: "+4.5% vs Benchmark",
    complianceScore: 92,
  },
  {
    id: "SUP-00095",
    name: "Schneider Electric India Pvt Ltd",
    code: "SEI-095",
    score: 94.0,
    tier: "Strategic Partner (Tier 1)",
    badge: "Global Partner",
    qualityScore: 98,
    qualityPpm: "45 PPM",
    otifScore: 96,
    otifPercent: "98.5%",
    priceScore: 91,
    priceSavings: "-5.0% vs Benchmark",
    complianceScore: 99,
  },
];

const INITIAL_VENDOR_HEADER = {
  vendorName: "ElectroMax Solutions Pvt. Ltd.",
  vendorBadge: "Verified Supplier",
  supplierId: "SUP-000184",
  supplierCode: "EMS-184",
  sinceDate: "15 Mar 2022",
  overallScore: 88.5,
  stars: 5,
  classification: "Preferred Supplier (Tier 1)",
  accountStatus: "Approved & Certified",
  auditPeriod: "FY 2026-27 (Annual Audit Cycle)",
  auditLead: "Quality & Sourcing Audit Council",
  auditDate: "26 Aug 2026",
  // Evaluation Performance Metrics
  qualityScore: 92,
  qualityPpm: "142 PPM",
  otifScore: 88,
  otifPercent: "94.8%",
  priceScore: 85,
  priceSavings: "-3.2% vs Benchmark",
  complianceScore: 95,
  capaSummary: "1 In Progress, 1 Resolved",
};

const INITIAL_DOC_EXPIRIES: VendorDocExpiry[] = [
  { id: 1, name: "ISO 9001:2015 Certificate", expiryDate: "15 Jun 2027", status: "Valid", action: "View" },
  { id: 2, name: "MSME Certificate", expiryDate: "31 Mar 2027", status: "Expiring Soon", action: "Upload" },
  { id: 3, name: "Insurance Certificate", expiryDate: "12 Sep 2026", status: "Expiring", action: "Upload" },
  { id: 4, name: "Factory License", expiryDate: "10 Dec 2026", status: "Valid", action: "View" },
];

const INITIAL_OPEN_POS: VendorOpenPO[] = [
  { poNumber: "PO-2026-00421", poDate: "20 Aug 2026", buyer: "Magnertia Manufacturing Ltd.", totalValue: 2450000.0, deliverBy: "15 Sep 2026", orderStatus: "Partially Delivered" },
  { poNumber: "PO-2026-00418", poDate: "18 Aug 2026", buyer: "Magnertia Manufacturing Ltd.", totalValue: 1180000.0, deliverBy: "05 Sep 2026", orderStatus: "Accepted" },
];

interface CAPTicket {
  id: number;
  ticketNo: string;
  issue: string;
  category: "Quality" | "Delivery" | "Documentation" | "Compliance";
  severity: "Critical" | "Major" | "Minor";
  targetDate: string;
  status: "Open" | "In Progress" | "Resolved";
  owner: string;
}

const INITIAL_CAP_TICKETS: CAPTicket[] = [
  {
    id: 1,
    ticketNo: "CAP-2026-0012",
    issue: "Calibration certificate renewal for batch testing multimeters",
    category: "Quality",
    severity: "Minor",
    targetDate: "15 Jul 2026",
    status: "Resolved",
    owner: "Amit Verma (Vendor QA)",
  },
  {
    id: 2,
    ticketNo: "CAP-2026-0015",
    issue: "Lead-time adherence for high-voltage contactors during peak order cycles",
    category: "Delivery",
    severity: "Major",
    targetDate: "30 Sep 2026",
    status: "In Progress",
    owner: "Supply Chain Team",
  },
];

export function VendorEvaluationPage() {
  // Navigation & Active Tab
  const [activeTab, setActiveTab] = useState<string>("scorecard");

  // State
  const [vendor, setVendor] = useState(INITIAL_VENDOR_HEADER);
  const [docExpiries, setDocExpiries] = useState<VendorDocExpiry[]>(INITIAL_DOC_EXPIRIES);
  const [openPos, setOpenPos] = useState<VendorOpenPO[]>(INITIAL_OPEN_POS);
  const [capTickets, setCapTickets] = useState<CAPTicket[]>(INITIAL_CAP_TICKETS);

  // Modals
  const [showNewEvalModal, setShowNewEvalModal] = useState<boolean>(false);
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [showCapModal, setShowCapModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // CAP Form
  const [capForm, setCapForm] = useState({
    issue: "",
    category: "Quality" as const,
    severity: "Major" as const,
    owner: "Vendor QA Lead",
    targetDate: "15 Oct 2026",
  });

  const handleCreateCapTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capForm.issue.trim()) return;
    const newTicket: CAPTicket = {
      id: capTickets.length + 1,
      ticketNo: `CAP-2026-00${capTickets.length + 16}`,
      issue: capForm.issue.trim(),
      category: capForm.category,
      severity: capForm.severity,
      targetDate: capForm.targetDate,
      status: "Open",
      owner: capForm.owner,
    };
    setCapTickets([newTicket, ...capTickets]);
    setShowCapModal(false);
    setCapForm({ issue: "", category: "Quality", severity: "Major", owner: "Vendor QA Lead", targetDate: "15 Oct 2026" });
    toast.success(`CAP Ticket ${newTicket.ticketNo} registered and dispatched to supplier!`);
  };

  const handleResolveCap = (id: number) => {
    setCapTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Resolved" as const } : t)));
    toast.success("CAP ticket marked as Resolved and verified by QA auditor!");
  };

  return (
    <AppShell
      title="Vendor Evaluation"
      breadcrumb="Management > Procurement Management"
      description="The Vendor Evaluation Form measures, scores, compares, approves, monitors, and ranks vendors based on quality, price, delivery, service, compliance, financial capability, risk, and overall performance."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP EVALUATION BANNER - Internal Procurement Audit Docket Header */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Left: Supplier Selector + Audit Identity */}
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary font-black text-xl border border-primary/20 shadow-xs">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                  <span>Audited Vendor Dossier</span>
                  <span>·</span>
                  <span className="text-primary font-semibold">{vendor.auditPeriod}</span>
                </div>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <select
                    value={vendor.supplierCode}
                    onChange={(e) => {
                      const selected = EVALUATION_VENDORS.find((v) => v.code === e.target.value);
                      if (selected) {
                        setVendor({
                          ...vendor,
                          vendorName: selected.name,
                          supplierId: selected.id,
                          supplierCode: selected.code,
                          overallScore: selected.score,
                          classification: selected.tier,
                          vendorBadge: selected.badge,
                          qualityScore: selected.qualityScore,
                          qualityPpm: selected.qualityPpm,
                          otifScore: selected.otifScore,
                          otifPercent: selected.otifPercent,
                          priceScore: selected.priceScore,
                          priceSavings: selected.priceSavings,
                          complianceScore: selected.complianceScore,
                        });
                        toast.success(`Loaded evaluation dossier for ${selected.name}`);
                      }
                    }}
                    className="text-lg font-extrabold tracking-tight text-foreground bg-transparent border border-border/60 rounded-lg px-2 py-0.5 cursor-pointer hover:border-primary focus:outline-hidden"
                  >
                    {EVALUATION_VENDORS.map((v) => (
                      <option key={v.code} value={v.code} className="bg-card text-foreground font-medium text-sm">
                        {v.name} ({v.code})
                      </option>
                    ))}
                  </select>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    {vendor.vendorBadge}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                  <span>Supplier ID: <strong className="text-foreground font-mono">{vendor.supplierId}</strong></span>
                  <span>·</span>
                  <span>Lead Auditor: <strong className="text-foreground">{vendor.auditLead}</strong></span>
                  <span>·</span>
                  <span>Audit Date: <strong className="text-foreground">{vendor.auditDate}</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Scores, Rating & Badges */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Overall Performance Score */}
              <div className="text-right">
                <div className="text-[11px] text-muted-foreground font-medium">Overall Performance Score</div>
                <div className="flex items-baseline justify-end gap-1 mt-0.5">
                  <span className="text-2xl font-black text-foreground font-mono">{vendor.overallScore}%</span>
                </div>
                <div className="flex items-center justify-end gap-0.5 text-amber-500 text-xs mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>

              {/* Classification Pill */}
              <div>
                <div className="text-[11px] text-muted-foreground font-medium">Vendor Classification</div>
                <div className="mt-1">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                    {vendor.classification}
                  </span>
                </div>
              </div>

              {/* Audit Status Pill */}
              <div>
                <div className="text-[11px] text-muted-foreground font-medium">Audit Approval Status</div>
                <div className="mt-1">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    {vendor.accountStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
            <div>Evaluation Cycle: <strong className="text-foreground">{vendor.auditPeriod}</strong></div>
            <div className="flex items-center gap-3 font-semibold">
              <button
                type="button"
                onClick={() => setShowScoreModal(true)}
                className="text-primary hover:underline transition-all cursor-pointer"
              >
                View Evaluation Scorecard
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="text-muted-foreground hover:text-foreground transition-all underline cursor-pointer"
              >
                Print Vendor Audit Certificate
              </button>
            </div>
          </div>
        </div>

        {/* 4 AUTHENTIC VENDOR EVALUATION KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Quality Performance */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold text-foreground">Quality Performance</span>
              </div>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">Grade A</span>
            </div>
            <div>
              <div className="text-2xl font-black text-foreground font-mono">{vendor.qualityScore}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Defect Rate: <strong className="text-foreground">{vendor.qualityPpm}</strong></div>
            </div>
            <button type="button" onClick={() => setActiveTab("quality")} className="text-[11px] font-semibold text-primary hover:underline text-left cursor-pointer">
              View Quality Rubric →
            </button>
          </div>

          {/* Card 2: Delivery & OTIF */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Truck className="h-5 w-5" />
                <span className="text-xs font-bold text-foreground">Delivery (OTIF SLA)</span>
              </div>
              <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">On Target</span>
            </div>
            <div>
              <div className="text-2xl font-black text-foreground font-mono">{vendor.otifPercent}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Delivery Score: <strong className="text-foreground">{vendor.otifScore}%</strong></div>
            </div>
            <button type="button" onClick={() => setActiveTab("commercialDelivery")} className="text-[11px] font-semibold text-blue-600 hover:underline text-left cursor-pointer">
              View Delivery History →
            </button>
          </div>

          {/* Card 3: Price Competitiveness */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Percent className="h-5 w-5" />
                <span className="text-xs font-bold text-foreground">Price Competitiveness</span>
              </div>
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">Cost Saver</span>
            </div>
            <div>
              <div className="text-2xl font-black text-foreground font-mono">{vendor.priceScore}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Variance: <strong className="text-foreground">{vendor.priceSavings}</strong></div>
            </div>
            <button type="button" onClick={() => setActiveTab("commercialDelivery")} className="text-[11px] font-semibold text-amber-600 hover:underline text-left cursor-pointer">
              View Price Variance →
            </button>
          </div>

          {/* Card 4: CAPA Corrective Actions */}
          <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs font-bold text-foreground">Corrective Actions (CAPA)</span>
              </div>
              <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-600">Active</span>
            </div>
            <div>
              <div className="text-xl font-black text-foreground font-mono">{vendor.capaSummary}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Statutory Compliance: <strong className="text-emerald-600 font-bold">{vendor.complianceScore}%</strong></div>
            </div>
            <button type="button" onClick={() => setActiveTab("cap")} className="text-[11px] font-semibold text-purple-600 hover:underline text-left cursor-pointer">
              Manage CAPA Tickets ({capTickets.length}) →
            </button>
          </div>
        </div>

        {/* SUB-TABS NAVIGATION - Streamlined & Essential */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "scorecard", label: "Weighted Scorecard & Matrix", icon: Award },
            { id: "quality", label: "Quality & Technical Capability", icon: ShieldCheck },
            { id: "commercialDelivery", label: "Price & Delivery (OTIF)", icon: Truck },
            { id: "cap", label: "Corrective Action Plans (CAPA)", icon: AlertTriangle },
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

        {/* TAB 1: WEIGHTED SCORECARD */}
        {activeTab === "scorecard" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Weighted Vendor Evaluation Scorecard & Rating Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">Evaluation Equation: Sum of (Parameter Score × Weightage) = Overall Performance Score</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowScoreModal(true)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  Confirm Classification
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs border border-border">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="p-2.5">Evaluation Parameter</th>
                      <th className="p-2.5 text-center">Weightage</th>
                      <th className="p-2.5 text-right">Raw Score (0–100)</th>
                      <th className="p-2.5 text-right">Weighted Score</th>
                      <th className="p-2.5 text-center">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    <tr>
                      <td className="p-2.5 font-semibold">Quality Performance</td>
                      <td className="p-2.5 text-center font-mono">20%</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">92</td>
                      <td className="p-2.5 text-right font-black">18.40</td>
                      <td className="p-2.5 text-center font-bold text-emerald-600">Excellent</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Price Competitiveness</td>
                      <td className="p-2.5 text-center font-mono">15%</td>
                      <td className="p-2.5 text-right font-bold text-amber-600">85</td>
                      <td className="p-2.5 text-right font-black">12.75</td>
                      <td className="p-2.5 text-center font-bold text-blue-600">Good</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Delivery Performance</td>
                      <td className="p-2.5 text-center font-mono">15%</td>
                      <td className="p-2.5 text-right font-bold text-blue-600">88</td>
                      <td className="p-2.5 text-right font-black">13.20</td>
                      <td className="p-2.5 text-center font-bold text-blue-600">Good</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Technical Capability</td>
                      <td className="p-2.5 text-center font-mono">10%</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">90</td>
                      <td className="p-2.5 text-right font-black">9.00</td>
                      <td className="p-2.5 text-center font-bold text-emerald-600">Excellent</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Service & Support</td>
                      <td className="p-2.5 text-center font-mono">10%</td>
                      <td className="p-2.5 text-right font-bold">86</td>
                      <td className="p-2.5 text-right font-black">8.60</td>
                      <td className="p-2.5 text-center font-bold text-blue-600">Good</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Financial Strength</td>
                      <td className="p-2.5 text-center font-mono">10%</td>
                      <td className="p-2.5 text-right font-bold">82</td>
                      <td className="p-2.5 text-right font-black">8.20</td>
                      <td className="p-2.5 text-center font-bold text-blue-600">Good</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Compliance</td>
                      <td className="p-2.5 text-center font-mono">10%</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">95</td>
                      <td className="p-2.5 text-right font-black">9.50</td>
                      <td className="p-2.5 text-center font-bold text-emerald-600">Excellent</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Risk Assessment</td>
                      <td className="p-2.5 text-center font-mono">5%</td>
                      <td className="p-2.5 text-right font-bold">80</td>
                      <td className="p-2.5 text-right font-black">4.00</td>
                      <td className="p-2.5 text-center font-bold text-amber-600">Low Risk</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold">Innovation Capability</td>
                      <td className="p-2.5 text-center font-mono">5%</td>
                      <td className="p-2.5 text-right font-bold">88</td>
                      <td className="p-2.5 text-right font-black">4.40</td>
                      <td className="p-2.5 text-center font-bold text-blue-600">Good</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-muted/40 font-black border-t-2 border-border text-xs">
                    <tr>
                      <td className="p-3 text-primary font-black">TOTAL OVERALL SCORE</td>
                      <td className="p-3 text-center font-mono">100%</td>
                      <td></td>
                      <td className="p-3 text-right text-emerald-700 dark:text-emerald-300 font-mono font-black text-sm">88.05%</td>
                      <td className="p-3 text-center font-bold text-emerald-700 dark:text-emerald-300">PREFERRED VENDOR</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUALITY & TECHNICAL CAPABILITY */}
        {activeTab === "quality" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4 text-xs">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Quality Performance & Defect Rate Metrics
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Lot Acceptance Rate</span>
                    <div className="text-xl font-bold text-emerald-600">99.1%</div>
                    <span className="text-[10px] text-muted-foreground">Target: &gt; 98.0%</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Rejection / RMA Rate</span>
                    <div className="text-xl font-bold text-emerald-600">0.9%</div>
                    <span className="text-[10px] text-muted-foreground">0 Critical Defects</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Quality Score</span>
                    <div className="text-xl font-bold text-primary">92%</div>
                    <span className="text-[10px] text-emerald-600 font-bold">Grade: Excellent</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4 text-xs">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  Technical Capability & Engineering Standards
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">R&D & Setup</span>
                    <div className="text-xl font-bold text-emerald-600">Class A</div>
                    <span className="text-[10px] text-muted-foreground">Dedicated CAD labs</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Certifications</span>
                    <div className="text-base font-bold font-mono text-primary truncate">ISO 9001/14001</div>
                    <span className="text-[10px] text-muted-foreground">BIS & CE mark verified</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Technical Score</span>
                    <div className="text-xl font-bold text-emerald-600">90%</div>
                    <span className="text-[10px] text-emerald-600 font-bold">Grade: Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRICE & DELIVERY PERFORMANCE */}
        {activeTab === "commercialDelivery" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4 text-xs">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Price Competitiveness & Benchmark Index
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Market Variance</span>
                    <div className="text-xl font-bold text-emerald-600">- 4.2%</div>
                    <span className="text-[10px] text-muted-foreground">Below industry avg</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Rebates Realized</span>
                    <div className="text-lg font-bold font-mono text-primary">₹ 3,45,000</div>
                    <span className="text-[10px] text-muted-foreground">Volume discounts YTD</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Commercial Score</span>
                    <div className="text-xl font-bold text-blue-600">85%</div>
                    <span className="text-[10px] text-muted-foreground">Good pricing</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4 text-xs">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <Truck className="h-4 w-4 text-primary" />
                  On-Time In-Full (OTIF) Delivery Performance
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">On-Time Delivery</span>
                    <div className="text-xl font-bold text-emerald-600">88.0%</div>
                    <span className="text-[10px] text-muted-foreground">Avg lead: 14 days</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">In-Full Delivery</span>
                    <div className="text-xl font-bold text-emerald-600">96.5%</div>
                    <span className="text-[10px] text-muted-foreground">Prompt reconciliation</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
                    <span className="text-muted-foreground">Delivery Score</span>
                    <div className="text-xl font-bold text-blue-600">88%</div>
                    <span className="text-[10px] text-blue-600 font-bold">Grade: Good</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CORRECTIVE ACTION PLANS (CAPA) */}
        {activeTab === "cap" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Corrective & Preventive Action Plans (CAPA) Register ({capTickets.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">Quality audit observations, delivery delay notifications, and root-cause resolution tracking</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCapModal(true)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Raise CAP Ticket
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs border border-border">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="p-2.5">Ticket No</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Issue & Root Cause</th>
                      <th className="p-2.5">Owner / Assignee</th>
                      <th className="p-2.5">Target Date</th>
                      <th className="p-2.5 text-center">Severity</th>
                      <th className="p-2.5 text-center">Status</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {capTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/20">
                        <td className="p-2.5 font-mono font-bold text-primary">{t.ticketNo}</td>
                        <td className="p-2.5 font-medium">{t.category}</td>
                        <td className="p-2.5 font-semibold text-foreground">{t.issue}</td>
                        <td className="p-2.5 text-muted-foreground">{t.owner}</td>
                        <td className="p-2.5 text-muted-foreground">{t.targetDate}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[9px] font-bold",
                              t.severity === "Critical" && "bg-rose-500/10 text-rose-600",
                              t.severity === "Major" && "bg-amber-500/10 text-amber-600",
                              t.severity === "Minor" && "bg-blue-500/10 text-blue-600"
                            )}
                          >
                            {t.severity}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[9px] font-bold",
                              t.status === "Resolved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                            )}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          {t.status !== "Resolved" ? (
                            <button
                              type="button"
                              onClick={() => handleResolveCap(t.id)}
                              className="rounded bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
                            >
                              Verify & Close
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-bold text-[10px]">✓ Closed</span>
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

        {/* MODAL: EVALUATION SCORECARD */}
        {showScoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-500" />
                  Vendor Audit Scorecard & Tier
                </h3>
                <button
                  type="button"
                  onClick={() => setShowScoreModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex justify-between">
                    <span>Vendor:</span>
                    <strong className="text-foreground font-bold">{vendor.vendorName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Calculated Score:</span>
                    <strong className="text-emerald-700 dark:text-emerald-300 font-mono font-black text-sm">88.05%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Tier:</span>
                    <strong className="text-emerald-700 dark:text-emerald-300 font-bold">Preferred Supplier (Active)</strong>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground">
                  Evaluation committee has cleared ElectroMax Solutions Pvt. Ltd. for large-scale enterprise contracts and priority RFQs.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowScoreModal(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Classification locked and vendor notified!");
                    setShowScoreModal(false);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm Classification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PRINT VENDOR AUDIT CERTIFICATE */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ENTERPRISE</div>
                  <div className="text-xs font-semibold text-slate-500">OFFICIAL VENDOR EVALUATION & PERFORMANCE CERTIFICATE</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-base font-black text-slate-900">VE-2026-000184</div>
                  <div className="text-slate-500">Audit Date: 26 Aug 2026</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Vendor Credentials</div>
                  <div className="mt-1 font-semibold">{vendor.vendorName}</div>
                  <div className="text-slate-500">Supplier ID: {vendor.supplierId} · Code: {vendor.supplierCode}</div>
                  <div className="text-slate-500">Status: Verified Supplier (Since {vendor.sinceDate})</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-700">Performance Assessment</div>
                  <div className="mt-1 font-semibold text-emerald-800">Overall Score: 88.05% (4.6 / 5.0 Stars)</div>
                  <div className="text-slate-500">Classification: Preferred Supplier</div>
                  <div className="text-emerald-700 font-bold">Audit Status: Approved for Master Supply</div>
                </div>
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
                  Print Certificate PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: RAISE CAP TICKET */}
        {showCapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Raise Corrective Action Plan (CAP)</h3>
                    <p className="text-xs text-muted-foreground">Formal notice to supplier for quality/delivery resolution</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCapModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCapTicket} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Issue Description & Root Cause *</label>
                  <textarea
                    rows={3}
                    required
                    value={capForm.issue}
                    onChange={(e) => setCapForm({ ...capForm, issue: e.target.value })}
                    placeholder="E.g., High-voltage insulation testing variance observed during lot #894 inspection..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Category</label>
                    <select
                      value={capForm.category}
                      onChange={(e) => setCapForm({ ...capForm, category: e.target.value as any })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Quality</option>
                      <option>Delivery</option>
                      <option>Documentation</option>
                      <option>Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Severity</label>
                    <select
                      value={capForm.severity}
                      onChange={(e) => setCapForm({ ...capForm, severity: e.target.value as any })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold cursor-pointer"
                    >
                      <option>Critical</option>
                      <option>Major</option>
                      <option>Minor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Owner / Assignee</label>
                    <input
                      type="text"
                      value={capForm.owner}
                      onChange={(e) => setCapForm({ ...capForm, owner: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-medium block mb-1">Target Resolution Date</label>
                    <input
                      type="date"
                      value={capForm.targetDate}
                      onChange={(e) => setCapForm({ ...capForm, targetDate: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background p-2 text-foreground font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowCapModal(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-700 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" /> Dispatch CAP to Vendor
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

export default VendorEvaluationPage;
