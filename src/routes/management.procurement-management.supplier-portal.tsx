import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import {
  Globe,
  LayoutDashboard,
  User,
  FileCheck,
  Building2,
  ShoppingCart,
  FileBadge,
  Truck,
  Receipt,
  CreditCard,
  Award,
  Paperclip,
  HelpCircle,
  MessageSquare,
  Landmark,
  BarChart3,
  Star,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Plus,
  Save,
  Send,
  Printer,
  ChevronRight,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Check,
  X,
  Edit,
  Trash2,
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
  FileCode,
  StickyNote,
  Mail,
  Phone,
  Scale,
  Handshake,
  Shield,
  Percent,
  PackageCheck,
  Bell,
  Activity,
  PhoneCall,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/procurement-management/supplier-portal")({
  head: () => ({
    meta: [
      { title: "Supplier Portal · Procurement Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Supplier Portal — self-service procurement cockpit for suppliers to manage RFQs, tenders, quotations, purchase orders, deliveries, invoices, and payments.",
      },
    ],
  }),
  component: SupplierPortalPage,
});

// --- DATA TYPES ---

interface SupplierDoc {
  id: number;
  name: string;
  expiryDate: string;
  status: "Valid" | "Expiring Soon" | "Expiring";
  action: "View" | "Upload" | "Renew";
}

interface SupplierPO {
  poNumber: string;
  poDate: string;
  buyer: string;
  totalValue: number;
  deliverBy: string;
  orderStatus: "Partially Delivered" | "Accepted" | "Pending Delivery";
}

// --- INITIAL MASTER DATA ---

const INITIAL_SUPPLIER = {
  name: "ElectroMax Solutions Pvt. Ltd.",
  badge: "Verified Supplier",
  supplierId: "SUP-000184",
  supplierCode: "EMS-184",
  sinceDate: "15 Mar 2022",
  overallScore: 88.5,
  classification: "Preferred Supplier",
  accountStatus: "Active",
  lastLogin: "26 Aug 2026 09:15 AM",
  // KPIs
  openRfqs: 12,
  quotations: 8,
  activePos: 6,
  pendingDeliveries: 4,
  pendingInvoices: 5,
  pendingPaymentValue: "₹ 12.4 L",
};

const INITIAL_DOCS: SupplierDoc[] = [
  { id: 1, name: "ISO 9001:2015 Certificate", expiryDate: "15 Jun 2027", status: "Valid", action: "View" },
  { id: 2, name: "MSME Certificate", expiryDate: "31 Mar 2027", status: "Expiring Soon", action: "Upload" },
  { id: 3, name: "Insurance Certificate", expiryDate: "12 Sep 2026", status: "Expiring", action: "Upload" },
  { id: 4, name: "Factory License", expiryDate: "10 Dec 2026", status: "Valid", action: "View" },
];

const INITIAL_POS: SupplierPO[] = [
  { poNumber: "PO-2026-00421", poDate: "20 Aug 2026", buyer: "Magnertia Manufacturing Ltd.", totalValue: 2450000.0, deliverBy: "15 Sep 2026", orderStatus: "Partially Delivered" },
  { poNumber: "PO-2026-00418", poDate: "18 Aug 2026", buyer: "Magnertia Manufacturing Ltd.", totalValue: 1180000.0, deliverBy: "05 Sep 2026", orderStatus: "Accepted" },
];

export function SupplierPortalPage() {
  // Navigation & Active Sub-Menu
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // State
  const [supplier, setSupplier] = useState(INITIAL_SUPPLIER);
  const [docs, setDocs] = useState<SupplierDoc[]>(INITIAL_DOCS);
  const [orders, setOrders] = useState<SupplierPO[]>(INITIAL_POS);

  // Modals
  const [showRfqModal, setShowRfqModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  return (
    <AppShell
      title="Supplier Portal"
      breadcrumb="Management > Procurement Management"
      description="The Supplier Portal is the external-facing procurement workspace where suppliers can manage their profile, respond to RFQs/tenders, submit quotations, receive purchase orders, update deliveries, upload invoices, track payments, and monitor performance."
      tabs={<ProcurementManagementTabBar />}
    >
      <div className="space-y-6">
        {/* TOP SUPPLIER BANNER - Standard ERP Header Card */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Left: Supplier Logo + Identity */}
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary font-black text-xl border border-primary/20 shadow-xs">
                M
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">Welcome back,</div>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <h1 className="text-lg font-extrabold tracking-tight text-foreground">{supplier.name}</h1>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    {supplier.badge}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                  <span>Supplier ID: <strong className="text-foreground font-mono">{supplier.supplierId}</strong></span>
                  <span>·</span>
                  <span>Supplier Code: <strong className="text-foreground font-mono">{supplier.supplierCode}</strong></span>
                  <span>·</span>
                  <span>Since: <strong className="text-foreground">{supplier.sinceDate}</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Scores, Rating & Badges */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Overall Performance Score */}
              <div className="text-right">
                <div className="text-[11px] text-muted-foreground font-medium">Overall Performance Score</div>
                <div className="flex items-baseline justify-end gap-1 mt-0.5">
                  <span className="text-2xl font-black text-foreground font-mono">{supplier.overallScore}</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ 100</span>
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
                    {supplier.classification}
                  </span>
                </div>
              </div>

              {/* Account Status Pill */}
              <div>
                <div className="text-[11px] text-muted-foreground font-medium">Account Status</div>
                <div className="mt-1">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    {supplier.accountStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
            <div>Last Login: <strong className="text-foreground">{supplier.lastLogin}</strong></div>
            <div className="flex items-center gap-3 font-semibold">
              <button
                type="button"
                onClick={() => setShowRfqModal(true)}
                className="text-primary hover:underline transition-all cursor-pointer"
              >
                + Submit Technical Quotation
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setShowTicketModal(true)}
                className="text-muted-foreground hover:text-foreground transition-all underline cursor-pointer"
              >
                Supplier Helpdesk
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="text-muted-foreground hover:text-foreground transition-all underline cursor-pointer"
              >
                Download Statement
              </button>
            </div>
          </div>
        </div>

        {/* 6 TOP KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Open RFQs */}
          <div className="rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-3.5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <FileCheck className="h-4 w-4" />
              <span className="text-xs font-bold text-foreground">Open RFQs</span>
            </div>
            <div className="text-2xl font-black text-foreground font-mono">{supplier.openRfqs}</div>
            <button type="button" onClick={() => setActiveTab("rfqs")} className="text-[10px] font-semibold text-primary hover:underline text-left cursor-pointer">
              View All RFQs →
            </button>
          </div>

          {/* Card 2: Quotations */}
          <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs font-bold text-foreground">Quotations</span>
            </div>
            <div className="text-2xl font-black text-foreground font-mono">{supplier.quotations}</div>
            <button type="button" onClick={() => setActiveTab("quotations")} className="text-[10px] font-semibold text-emerald-600 hover:underline text-left cursor-pointer">
              View All Quotations →
            </button>
          </div>

          {/* Card 3: Active POs */}
          <div className="rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 p-3.5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <FileBadge className="h-4 w-4" />
              <span className="text-xs font-bold text-foreground">Active POs</span>
            </div>
            <div className="text-2xl font-black text-foreground font-mono">{supplier.activePos}</div>
            <button type="button" onClick={() => setActiveTab("purchaseOrders")} className="text-[10px] font-semibold text-amber-600 hover:underline text-left cursor-pointer">
              View All POs →
            </button>
          </div>

          {/* Card 4: Pending Deliveries */}
          <div className="rounded-xl border border-purple-200/60 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 p-3.5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
              <Truck className="h-4 w-4" />
              <span className="text-xs font-bold text-foreground">Pending Deliveries</span>
            </div>
            <div className="text-2xl font-black text-foreground font-mono">{supplier.pendingDeliveries}</div>
            <button type="button" onClick={() => setActiveTab("purchaseOrders")} className="text-[10px] font-semibold text-purple-600 hover:underline text-left cursor-pointer">
              View Deliveries →
            </button>
          </div>

          {/* Card 5: Pending Invoices */}
          <div className="rounded-xl border border-teal-200/60 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20 p-3.5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
              <Receipt className="h-4 w-4" />
              <span className="text-xs font-bold text-foreground">Pending Invoices</span>
            </div>
            <div className="text-2xl font-black text-foreground font-mono">{supplier.pendingInvoices}</div>
            <button type="button" onClick={() => setActiveTab("invoices")} className="text-[10px] font-semibold text-teal-600 hover:underline text-left cursor-pointer">
              View Invoices →
            </button>
          </div>

          {/* Card 6: Pending Payment */}
          <div className="rounded-xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 p-3.5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs font-bold text-foreground">Pending Payment</span>
            </div>
            <div className="text-xl font-black text-foreground font-mono">{supplier.pendingPaymentValue}</div>
            <button type="button" onClick={() => setActiveTab("invoices")} className="text-[10px] font-semibold text-rose-600 hover:underline text-left cursor-pointer">
              View Payments →
            </button>
          </div>
        </div>

        {/* SUB-TABS NAVIGATION - Standard Top Horizontal Bar */}
        <div className="flex items-center gap-1.5 border-b border-border/80 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
            { id: "rfqs", label: "RFQs & Bidding", icon: FileCheck },
            { id: "quotations", label: "My Quotations", icon: ShoppingCart },
            { id: "purchaseOrders", label: "Purchase Orders & ASN", icon: FileBadge },
            { id: "invoices", label: "Invoices & Payments", icon: Receipt },
            { id: "documents", label: "Compliance & Certificates", icon: Paperclip },
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

        {/* VIEW: DASHBOARD OVERVIEW IN KPI FORMAT */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* 4 CORE EXECUTIVE KPI CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* KPI 1: Overall Vendor Score */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Performance Score</span>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/20">
                    Tier 1 Preferred
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground font-mono">88.5</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ 100 Rating</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border text-muted-foreground">
                  <span>Quality & SLA: <strong className="text-emerald-600">92%</strong></span>
                  <span className="text-emerald-600 font-bold">▲ +2.4% MoM</span>
                </div>
              </div>

              {/* KPI 2: Total PO Volume & Committed Value */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Committed PO Value</span>
                  <span className="rounded-full bg-blue-500/10 text-blue-600 px-2 py-0.5 text-[10px] font-bold border border-blue-500/20">
                    14 Total POs
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-foreground font-mono">₹ 1.42 Cr</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border text-muted-foreground">
                  <span>Delivered: <strong className="text-foreground font-mono">₹ 96.00 L (67.6%)</strong></span>
                  <span className="text-blue-600 font-bold">6 Active POs</span>
                </div>
              </div>

              {/* KPI 3: Bidding & Quotation Win Rate */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Quotation Win Rate</span>
                  <span className="rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold border border-amber-500/20">
                    High Conversion
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-foreground font-mono">66.7%</span>
                  <span className="text-xs text-muted-foreground font-semibold">(8 Bids / 6 Won)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border text-muted-foreground">
                  <span>Avg Bid Cycle: <strong className="text-foreground">4.2 Days</strong></span>
                  <span className="text-amber-600 font-bold">3 RFQs Open</span>
                </div>
              </div>

              {/* KPI 4: Financial Settlement & Liquidity */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Settlement Liquidity</span>
                  <span className="rounded-full bg-teal-500/10 text-teal-600 px-2 py-0.5 text-[10px] font-bold border border-teal-500/20">
                    Net 30 Terms
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-foreground font-mono">₹ 75.00 L</span>
                  <span className="text-xs text-muted-foreground font-semibold">Cleared</span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border text-muted-foreground">
                  <span>Pending AP: <strong className="text-primary font-mono">₹ 7.50 L</strong></span>
                  <span className="text-emerald-600 font-bold">Next: 30 Aug</span>
                </div>
              </div>
            </div>

            {/* FULFILLMENT & SETTLEMENT KPI BREAKDOWN ROW */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Card A: Performance Scorecard Meters */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-primary" />
                    Supplier Performance Metric Scorecard
                  </h3>
                  <Link
                    to="/management/procurement-management/vendor-evaluation"
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    Full Scorecard →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 text-center space-y-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Quality</span>
                    <div className="text-base font-black text-emerald-600 font-mono">92%</div>
                    <div className="text-[9px] text-muted-foreground">0 Defect Rate</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 text-center space-y-1">
                    <span className="text-[10px] text-muted-foreground font-medium">OTIF Delivery</span>
                    <div className="text-base font-black text-blue-600 font-mono">88%</div>
                    <div className="text-[9px] text-muted-foreground">24/28 On-Time</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 text-center space-y-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Pricing</span>
                    <div className="text-base font-black text-amber-600 font-mono">85%</div>
                    <div className="text-[9px] text-muted-foreground">High Win Rate</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 text-center space-y-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Service & SLA</span>
                    <div className="text-base font-black text-purple-600 font-mono">90%</div>
                    <div className="text-[9px] text-muted-foreground">3.8h Response</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 text-center space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-muted-foreground font-medium">Statutory</span>
                    <div className="text-base font-black text-teal-600 font-mono">94%</div>
                    <div className="text-[9px] text-muted-foreground">100% Tax Compliant</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-medium text-muted-foreground">Quality & OEM Test Compliance</span>
                      <strong className="text-emerald-600 font-mono">92%</strong>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-medium text-muted-foreground">On-Time In-Full (OTIF) Dispatch</span>
                      <strong className="text-blue-600 font-mono">88%</strong>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "88%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card B: Order Fulfillment & Logistics Pipeline */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-primary" />
                    Order Fulfillment & In-Transit Pipeline
                  </h3>
                  <span className="text-[11px] text-muted-foreground">Value Breakdown</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-emerald-200/50 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/10">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block mb-1">Delivered & Accepted</span>
                    <div className="text-base font-black text-foreground font-mono">₹ 96.00 L</div>
                    <span className="text-[10px] text-muted-foreground">67.6% of committed value</span>
                  </div>

                  <div className="p-3 rounded-lg border border-blue-200/50 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10">
                    <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold block mb-1">In-Transit ASN</span>
                    <div className="text-base font-black text-foreground font-mono">₹ 22.50 L</div>
                    <span className="text-[10px] text-muted-foreground">4 Active Shipments</span>
                  </div>

                  <div className="p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10">
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold block mb-1">Work In Progress</span>
                    <div className="text-base font-black text-foreground font-mono">₹ 23.50 L</div>
                    <span className="text-[10px] text-muted-foreground">Manufacturing backlog</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Active Contract Commitment:</span>
                  <strong className="text-foreground font-mono font-bold text-sm">₹ 1,42,00,000.00</strong>
                </div>
              </div>
            </div>

            {/* Action Required (Left) + Recent Activity (Right) */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Card 1: Action Required */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-foreground border-b border-border pb-1.5 flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-amber-500" />
                    Action Required (3 Alerts)
                  </h3>

                  <div className="space-y-2.5 pt-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/30">
                      <div>
                        <div className="font-bold text-foreground">3 RFQs closing within 2 days</div>
                        <div className="text-[10px] text-muted-foreground">Respond before deadline to avoid missing opportunities.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("rfqs")}
                        className="rounded bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shrink-0 shadow-xs hover:bg-primary/90 cursor-pointer"
                      >
                        View RFQs
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30">
                      <div>
                        <div className="font-bold text-foreground">2 Purchase Orders require delivery updates</div>
                        <div className="text-[10px] text-muted-foreground">Please update dispatch / delivery information.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDispatchModal(true)}
                        className="rounded bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white shrink-0 shadow-xs hover:bg-amber-700 cursor-pointer"
                      >
                        Update ASN
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/40 dark:border-rose-900/30">
                      <div>
                        <div className="font-bold text-foreground">1 Invoice requires TDS correction</div>
                        <div className="text-[10px] text-muted-foreground">Invoice INV-2026-00875 returned by Accounts Payable.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowInvoiceModal(true)}
                        className="rounded bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shrink-0 shadow-xs hover:bg-rose-700 cursor-pointer"
                      >
                        Correct Invoice
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast.info("Viewing all supplier notifications...")}
                  className="text-primary text-[11px] font-semibold hover:underline pt-1 text-left cursor-pointer"
                >
                  View All Notifications →
                </button>
              </div>

              {/* Card 2: Recent Activity */}
              <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-foreground border-b border-border pb-1.5 flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-primary" />
                    Recent Sourcing & Fulfillment Activity
                  </h3>

                  <div className="space-y-2.5 pt-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/20">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-500/10 text-blue-600 font-bold px-1.5 py-0.5 text-[9px] font-mono">RFQ</span>
                        <div>
                          <div className="font-bold text-foreground font-mono text-[11px]">RFQ-2026-00124</div>
                          <div className="text-[10px] text-muted-foreground">Power Cables & Connectors</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                          Submitted Quotation <Check className="h-3 w-3" />
                        </div>
                        <div className="text-[10px] text-muted-foreground">25 Aug 2026</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/20">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-amber-500/10 text-amber-600 font-bold px-1.5 py-0.5 text-[9px] font-mono">PO</span>
                        <div>
                          <div className="font-bold text-foreground font-mono text-[11px]">PO-2026-00421</div>
                          <div className="text-[10px] text-muted-foreground">MCB Distribution Panel</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-amber-600 flex items-center gap-1 justify-end">
                          Delivery Due <AlertTriangle className="h-3 w-3" />
                        </div>
                        <div className="text-[10px] text-muted-foreground">28 Aug 2026</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/20">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-teal-500/10 text-teal-600 font-bold px-1.5 py-0.5 text-[9px] font-mono">INV</span>
                        <div>
                          <div className="font-bold text-foreground font-mono text-[11px]">INV-2026-00841</div>
                          <div className="text-[10px] text-muted-foreground">LED High Bay Lights</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                          Payment Scheduled <Check className="h-3 w-3" />
                        </div>
                        <div className="text-[10px] text-muted-foreground">30 Aug 2026</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toast.info("Viewing all recent logs...")}
                  className="text-primary text-[11px] font-semibold hover:underline pt-1 text-left cursor-pointer"
                >
                  View All Activity →
                </button>
              </div>
            </div>

            {/* Document Expiry Alert */}
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-foreground border-b border-border pb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Document Expiry Alert
                </h3>

                <table className="w-full text-left text-xs mt-2">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="py-1.5 px-2">Document Name</th>
                      <th className="py-1.5 px-2">Expiry Date</th>
                      <th className="py-1.5 px-2 text-center">Status</th>
                      <th className="py-1.5 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground text-[11px]">
                    {docs.map((d) => (
                      <tr key={d.id} className="hover:bg-muted/20">
                        <td className="py-2 px-2 font-medium">{d.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{d.expiryDate}</td>
                        <td className="py-2 px-2 text-center">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[9px] font-bold",
                              d.status === "Valid" && "bg-emerald-500/10 text-emerald-600",
                              d.status === "Expiring Soon" && "bg-amber-500/10 text-amber-600",
                              d.status === "Expiring" && "bg-rose-500/10 text-rose-600"
                            )}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => toast.info(`Action initiated for ${d.name}`)}
                            className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-semibold cursor-pointer",
                              d.action === "Upload" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border text-foreground hover:bg-muted"
                            )}
                          >
                            {d.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMenu("documents")}
                className="text-primary text-[11px] font-semibold hover:underline pt-2 cursor-pointer text-left"
              >
                Manage All Certificates →
              </button>
            </div>

            {/* Open Purchase Orders Table (Wide) */}
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <FileBadge className="h-4 w-4 text-primary" />
                  Open Purchase Orders & Dispatches
                </h3>

                <Link to="/management/procurement-management/purchase-order" className="text-primary text-[11px] font-semibold hover:underline">
                  View All Purchase Orders →
                </Link>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="py-2 px-3">PO Number</th>
                      <th className="py-2 px-3">PO Date</th>
                      <th className="py-2 px-3">Buyer</th>
                      <th className="py-2 px-3 text-right">Total Value</th>
                      <th className="py-2 px-3">Deliver By</th>
                      <th className="py-2 px-3 text-center">Order Status</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground text-[11px]">
                    {orders.map((po) => (
                      <tr key={po.poNumber} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{po.poNumber}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{po.poDate}</td>
                        <td className="py-2.5 px-3 font-semibold">{po.buyer}</td>
                        <td className="py-2.5 px-3 text-right font-black font-mono">₹ {po.totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{po.deliverBy}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[9px] font-bold",
                              po.orderStatus === "Accepted" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                            )}
                          >
                            {po.orderStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setShowDispatchModal(true)}
                            className="rounded bg-primary/10 border border-primary/20 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/20 cursor-pointer"
                          >
                            Dispatch ASN
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

          {/* VIEW: RFQS */}
          {activeTab === "rfqs" && (
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    Open Requests for Quotation (RFQs)
                  </h3>
                  <p className="text-xs text-muted-foreground">Active tender opportunities and invitations to submit technical bids</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRfqModal(true)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1"
                >
                  + Submit Bid Quotation
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="p-2.5">RFQ Number</th>
                      <th className="p-2.5">Title / Requirement</th>
                      <th className="p-2.5">Closing Date</th>
                      <th className="p-2.5 text-center">Status</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-primary">RFQ-2026-00124</td>
                      <td className="p-2.5 font-semibold">Power Cables & Connectors (1000m)</td>
                      <td className="p-2.5 text-rose-600 font-bold">29 Aug 2026 (2 Days Left)</td>
                      <td className="p-2.5 text-center">
                        <span className="rounded bg-amber-500/10 text-amber-600 px-2 py-0.5 text-[9px] font-bold">Bid Open</span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setShowRfqModal(true)}
                          className="rounded bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        >
                          Submit Quotation
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-primary">RFQ-2026-00130</td>
                      <td className="p-2.5 font-semibold">MCB Distribution Units (50 Units)</td>
                      <td className="p-2.5 text-muted-foreground">05 Sep 2026</td>
                      <td className="p-2.5 text-center">
                        <span className="rounded bg-blue-500/10 text-blue-600 px-2 py-0.5 text-[9px] font-bold">Bid Open</span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setShowRfqModal(true)}
                          className="rounded bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        >
                          Submit Quotation
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: QUOTATIONS */}
          {activeTab === "quotations" && (
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Submitted Quotations & Commercial Offers
                  </h3>
                  <p className="text-xs text-muted-foreground">Status of bids under review by buyer procurement committees</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRfqModal(true)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  + New Quotation
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="p-2.5">Quotation No</th>
                      <th className="p-2.5">RFQ Ref</th>
                      <th className="p-2.5">Submission Date</th>
                      <th className="p-2.5 text-right">Quoted Value</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-primary">QUOT-2026-00384</td>
                      <td className="p-2.5 font-mono text-muted-foreground">RFQ-2026-00124</td>
                      <td className="p-2.5">25 Aug 2026</td>
                      <td className="p-2.5 text-right font-mono font-bold">₹ 6,76,507.00</td>
                      <td className="p-2.5 text-center">
                        <span className="rounded bg-blue-500/10 text-blue-600 px-2 py-0.5 text-[9px] font-bold">Under Technical Review</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-primary">QUOT-2026-00360</td>
                      <td className="p-2.5 font-mono text-muted-foreground">RFQ-2026-00109</td>
                      <td className="p-2.5">14 Aug 2026</td>
                      <td className="p-2.5 text-right font-mono font-bold">₹ 24,50,000.00</td>
                      <td className="p-2.5 text-center">
                        <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[9px] font-bold">Awarded (PO Issued)</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: PURCHASE ORDERS */}
          {activeTab === "purchaseOrders" && (
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileBadge className="h-4 w-4 text-primary" />
                    Purchase Orders & Delivery Milestones
                  </h3>
                  <p className="text-xs text-muted-foreground">Active delivery schedules and advance shipping notice (ASN) filings</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(true)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1"
                >
                  <Truck className="h-3.5 w-3.5" /> Submit ASN Dispatch
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="p-2.5">PO Number</th>
                      <th className="p-2.5">Buyer Company</th>
                      <th className="p-2.5 text-right">Value (INR)</th>
                      <th className="p-2.5">Delivery Due</th>
                      <th className="p-2.5 text-center">Status</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {orders.map((po) => (
                      <tr key={po.poNumber}>
                        <td className="p-2.5 font-mono font-bold text-primary">{po.poNumber}</td>
                        <td className="p-2.5 font-medium">{po.buyer}</td>
                        <td className="p-2.5 text-right font-mono font-bold">₹ {po.totalValue.toLocaleString("en-IN")}</td>
                        <td className="p-2.5 text-muted-foreground">{po.deliverBy}</td>
                        <td className="p-2.5 text-center">
                          <span className={cn("rounded px-2 py-0.5 text-[9px] font-bold", po.orderStatus === "Accepted" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>
                            {po.orderStatus}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => setShowDispatchModal(true)}
                            className="rounded bg-amber-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-amber-700 cursor-pointer"
                          >
                            Update Dispatch
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: INVOICES & PAYMENTS */}
          {activeTab === "invoices" && (
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    Tax Invoices & Payment Ledger
                  </h3>
                  <p className="text-xs text-muted-foreground">Upload tax invoices, check 3-way match verification, and track settlement release</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 cursor-pointer inline-flex items-center gap-1"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Tax Invoice
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="p-2.5">Invoice No</th>
                      <th className="p-2.5">PO Ref</th>
                      <th className="p-2.5 text-right">Amount (INR)</th>
                      <th className="p-2.5">Payment Date</th>
                      <th className="p-2.5 text-center">Match Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-primary">INV-2026-00841</td>
                      <td className="p-2.5 font-mono text-muted-foreground">PO-2026-00418</td>
                      <td className="p-2.5 text-right font-mono font-bold">₹ 11,80,000.00</td>
                      <td className="p-2.5 text-emerald-600 font-semibold">30 Aug 2026 (Scheduled)</td>
                      <td className="p-2.5 text-center">
                        <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[9px] font-bold">Matched & Approved</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-primary">INV-2026-00875</td>
                      <td className="p-2.5 font-mono text-muted-foreground">PO-2026-00421</td>
                      <td className="p-2.5 text-right font-mono font-bold">₹ 5,02,282.00</td>
                      <td className="p-2.5 text-rose-600 font-semibold">Correction Required</td>
                      <td className="p-2.5 text-center">
                        <span className="rounded bg-rose-500/10 text-rose-600 px-2 py-0.5 text-[9px] font-bold">Quantity Variance</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-primary" />
                    Statutory & Compliance Certificates
                  </h3>
                  <p className="text-xs text-muted-foreground">Maintain verified certificates, GST filings, and QA audit clearances</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("Upload certificate modal...")}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer inline-flex items-center gap-1"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload Certificate
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                    <tr>
                      <th className="p-2.5">Document Name</th>
                      <th className="p-2.5">Expiry Date</th>
                      <th className="p-2.5 text-center">Status</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground">
                    {docs.map((d) => (
                      <tr key={d.id}>
                        <td className="p-2.5 font-semibold text-foreground">{d.name}</td>
                        <td className="p-2.5 text-muted-foreground">{d.expiryDate}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[9px] font-bold",
                              d.status === "Valid" && "bg-emerald-500/10 text-emerald-600",
                              d.status === "Expiring Soon" && "bg-amber-500/10 text-amber-600",
                              d.status === "Expiring" && "bg-rose-500/10 text-rose-600"
                            )}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => toast.info(`Viewing ${d.name}`)}
                            className="text-primary hover:underline font-semibold cursor-pointer"
                          >
                            View / Renew
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>

      {/* MODAL: SUBMIT RFQ PROPOSAL */}
      {showRfqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                Submit Technical & Commercial Quotation
              </h3>
              <button
                type="button"
                onClick={() => setShowRfqModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <label className="text-muted-foreground font-medium block mb-1">Target RFQ *</label>
                <input
                  type="text"
                  defaultValue="RFQ-2026-00124 (Power Cables & Connectors)"
                  className="w-full rounded-lg border border-border bg-background p-2 font-mono text-primary font-bold"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-medium block mb-1">Quoted Net Value (INR) *</label>
                <input
                  type="text"
                  defaultValue="₹ 6,76,507.00"
                  className="w-full rounded-lg border border-border bg-background p-2 font-mono text-emerald-600 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowRfqModal(false)}
                className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Quotation submitted successfully to Buyer!");
                  setShowRfqModal(false);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                Submit Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE DISPATCH */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-500" />
                Update Dispatch & Vehicle Tracking
              </h3>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-muted-foreground font-medium block mb-1">Purchase Order</label>
                <input
                  type="text"
                  defaultValue="PO-2026-00421"
                  className="w-full rounded-lg border border-border bg-background p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-medium block mb-1">LR / Consignment Note No.</label>
                <input
                  type="text"
                  defaultValue="LR-8899214"
                  className="w-full rounded-lg border border-border bg-background p-2 font-mono font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Dispatch update logged! Inward alert sent to warehouse.");
                  setShowDispatchModal(false);
                }}
                className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-700 cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD INVOICE */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Receipt className="h-4 w-4 text-teal-500" />
                Submit Corrected Tax Invoice
              </h3>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-muted-foreground font-medium block mb-1">Invoice Number</label>
                <input
                  type="text"
                  defaultValue="INV-2026-00875-REV"
                  className="w-full rounded-lg border border-border bg-background p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-muted-foreground font-medium block mb-1">Invoice Amount (INR)</label>
                <input
                  type="text"
                  defaultValue="₹ 5,02,282.00"
                  className="w-full rounded-lg border border-border bg-background p-2 font-mono text-emerald-600 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Invoice uploaded and linked to 3-way match!");
                  setShowInvoiceModal(false);
                }}
                className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-700 cursor-pointer"
              >
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUPPORT TICKET */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Raise Supplier Support Ticket
              </h3>
              <button
                type="button"
                onClick={() => setShowTicketModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-muted-foreground font-medium block mb-1">Query Category *</label>
                <select className="w-full rounded-lg border border-border bg-background p-2 font-semibold">
                  <option>Payment & UTR Reconciliation</option>
                  <option>Delivery & Inward Dock Appointment</option>
                  <option>RFQ Clarification</option>
                  <option>PO Amendment</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground font-medium block mb-1">Description *</label>
                <textarea
                  rows={3}
                  defaultValue="Requesting expedited release of scheduled payment for INV-2026-00841."
                  className="w-full rounded-lg border border-border bg-background p-2 text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setShowTicketModal(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Support Ticket TCK-2026-0042 created!");
                  setShowTicketModal(false);
                }}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRINT STATEMENT */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-300 pb-4">
              <div>
                <div className="text-xl font-extrabold text-slate-900 tracking-tight">MAGNERTIA SYSTEMS ERP</div>
                <div className="text-xs font-semibold text-slate-500">SUPPLIER ACCOUNT & OPEN ORDER STATEMENT</div>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="text-base font-black text-slate-900">{supplier.supplierId}</div>
                <div className="text-slate-500">As on: 26 Aug 2026</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-700">Supplier Credentials</div>
                <div className="mt-1 font-semibold">{supplier.name}</div>
                <div className="text-slate-500">Supplier Code: {supplier.supplierCode} · Tier: {supplier.classification}</div>
                <div className="text-emerald-700 font-bold">Performance: 88.5 / 100</div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="font-bold text-slate-700">Financial Position</div>
                <div className="mt-1 font-semibold text-primary">Pending Payables: ₹ 12.4 Lakhs</div>
                <div className="text-slate-500">Active POs: 6 · Open Quotations: 8</div>
                <div className="text-emerald-700 font-bold">Status: Active & Verified</div>
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
                Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default SupplierPortalPage;
