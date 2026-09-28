import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Boxes,
  TrendingUp,
  Percent,
  Radio,
  Repeat,
  ShoppingCart,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  FileCheck,
  UserCheck,
  Plus,
  Download,
  Upload,
  ArrowRight,
  Info,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  Building2,
  MapPin,
  Users,
  Target,
  FileText,
  ShieldCheck,
  Play,
  RotateCcw,
  Zap,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Printer,
  Copy,
  Truck,
  Warehouse,
  Factory,
  ArrowLeftRight,
  Package,
  ShieldAlert,
  Sliders,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Tag,
  Barcode,
  QrCode,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Coins,
  History,
  ClipboardList,
  Scale,
  Gauge,
  Phone,
  Mail,
  Edit,
  Eye,
  Forklift,
  CheckSquare,
  Navigation,
  Compass,
  Star,
  Send,
  Camera,
  Signature,
  FileUp,
  Split,
  Map,
  Fuel,
  Share2,
  User,
  CreditCard,
  Receipt,
  FileSignature,
  Network,
  Store,
  Undo2,
  CheckSquare2,
  Maximize2,
  Wrench,
  BatteryCharging,
  Car,
  AlertOctagon,
  FileSpreadsheet,
  Box,
  Layers2,
  QrCode as QrIcon,
  Recycle,
  Shield,
  CheckCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SupplyChainManagementTabBar } from "@/components/erp/SupplyChainManagementTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/supply-chain-management/packaging-management")({
  head: () => ({
    meta: [
      { title: "Packaging Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "End-to-end packaging operations, material allocation, packaging design, barcode labeling, quality inspection, and palletization.",
      },
    ],
  }),
  component: PackagingPage,
});

// --- SAMPLE DATA ---
const PACKAGING_MATERIALS_LIST = [
  {
    name: "Corrugated Box (Large)",
    type: "Corrugated",
    required: 250,
    issued: 250,
    used: 186,
    uom: "Nos",
    status: "In Use",
  },
  {
    name: "Bubble Wrap",
    type: "Protective",
    required: 500,
    issued: 480,
    used: 356,
    uom: "Mtr",
    status: "In Use",
  },
  {
    name: "Foam Sheet",
    type: "Protective",
    required: 250,
    issued: 240,
    used: 178,
    uom: "Nos",
    status: "In Use",
  },
  {
    name: "Stretch Film",
    type: "Wrapping",
    required: 50,
    issued: 50,
    used: 36,
    uom: "Rolls",
    status: "In Use",
  },
  {
    name: "PP Strapping",
    type: "Strapping",
    required: 20,
    issued: 18,
    used: 12,
    uom: "Rolls",
    status: "In Use",
  },
  {
    name: "Adhesive Tape",
    type: "Sealing",
    required: 100,
    issued: 90,
    used: 64,
    uom: "Rolls",
    status: "In Use",
  },
];

const RECENT_TRANSACTIONS = [
  {
    id: "PKG-2026-004821",
    type: "Export Packaging",
    product: "Industrial Control Panel",
    qty: 250,
    date: "26 Apr 2026",
    status: "Packing In Progress",
  },
  {
    id: "PKG-2026-004820",
    type: "Secondary Packaging",
    product: "HV Liquid-Cooled Charging Cable (7.5m)",
    qty: 1500,
    date: "25 Apr 2026",
    status: "Completed",
  },
  {
    id: "PKG-2026-004819",
    type: "Retail Packaging",
    product: "Modular Silicon-Carbide Power Stack 120kW",
    qty: 120,
    date: "24 Apr 2026",
    status: "Completed",
  },
  {
    id: "PKG-2026-004818",
    type: "Protective Packaging",
    product: "Sensor Unit",
    qty: 300,
    date: "24 Apr 2026",
    status: "Quality Inspection",
  },
];

const PACKAGING_COST_TREND = [
  { day: "1 Apr", cost: 58000 },
  { day: "6 Apr", cost: 64000 },
  { day: "11 Apr", cost: 60000 },
  { day: "16 Apr", cost: 68000 },
  { day: "21 Apr", cost: 62000 },
  { day: "26 Apr", cost: 66000 },
];

const QUALITY_INSPECTION_CHECKLIST = [
  { item: "Packaging Material Quality (Bursting Strength)", status: "Pass" },
  { item: "Package Dimensions & Cushioning Fit", status: "Pass" },
  { item: "Gross & Net Weight Accuracy", status: "Pass" },
  { item: "Sealing & Moisture Barrier Integrity", status: "Pass" },
  { item: "Label Accuracy & Destination Matching", status: "Pass" },
  { item: "Barcode & QR Code Readability", status: "Pass" },
  { item: "Fragile / Handling Caution Marking", status: "Pass" },
  { item: "Tamper-Evident Security Seal", status: "Pass" },
];

function PackagingPage() {
  // Header State
  const [pkgNumber] = useState("PKG-2026-004821");
  const [pkgId] = useState("PKGID-0004821");
  const [pkgType, setPkgType] = useState("Export Packaging");
  const [pkgDate, setPkgDate] = useState("2026-04-26");
  const [priority, setPriority] = useState("High");
  const [businessUnit, setBusinessUnit] = useState("Magnertia Manufacturing");
  const [sourceWarehouse, setSourceWarehouse] = useState("Main Warehouse - Chennai");
  const [pkgLocation, setPkgLocation] = useState("Packaging Line - 2");
  const [pkgSupervisor, setPkgSupervisor] = useState("Kavita Reddy");
  const [status, setStatus] = useState("Packing In Progress");

  // Modal States
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showStartPackingModal, setShowStartPackingModal] = useState(false);
  const [showPrintLabelModal, setShowPrintLabelModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [showPalletizeModal, setShowPalletizeModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showNewPkgModal, setShowNewPkgModal] = useState(false);

  // Form inputs for modals
  const [palletPackages, setPalletPackages] = useState("106");
  const [palletType, setPalletType] = useState("Wooden Pallet (Euro 1200x800)");

  const materialTotals = useMemo(() => {
    return PACKAGING_MATERIALS_LIST.reduce(
      (acc, curr) => ({
        required: acc.required + curr.required,
        issued: acc.issued + curr.issued,
        used: acc.used + curr.used,
      }),
      { required: 0, issued: 0, used: 0 }
    );
  }, []);

  return (
    <AppShell
      title="Packaging Management"
      breadcrumb="Management"
      description="Manage packaging requirements, material selection, packing operations, labeling, and palletization."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="packaging-management"
    >
      <div className="space-y-6">
        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active Order:</span>
            <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5 border-primary/20">
              {pkgNumber}
            </Badge>
            <Badge className="bg-blue-500/15 text-blue-800 dark:text-blue-300 font-semibold border border-blue-200 text-xs">
              <Box className="h-3 w-3 mr-1 inline" />
              {status}
            </Badge>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              Line 2 Active
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => toast.info("Draft reset")}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => toast.success("Draft saved to packaging backlog")}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Save Draft
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              onClick={() => toast.success("Packaging order submitted for quality sign-off")}
            >
              <Send className="h-3.5 w-3.5 mr-1" />
              Submit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
                  More Actions
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 text-xs">
                <DropdownMenuLabel>Packaging Operations</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowPrintLabelModal(true)}>
                  <Printer className="h-3.5 w-3.5 mr-2" />
                  Print All Shipping Labels
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPalletizeModal(true)}>
                  <Layers className="h-3.5 w-3.5 mr-2" />
                  Generate Pallet Manifest
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowQualityModal(true)}>
                  <ShieldCheck className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                  QA Audit & Stamp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Running AI Eco-Packaging Optimization...")}>
                  <Sparkles className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                  AI Packaging Design
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
          {/* TOP 2 CARDS: 1. Packaging Header & 2. Packaging Status Stepper */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. PACKAGING HEADER (7 Cols) */}
            <div className="lg:col-span-7 bg-card rounded-xl border border-border shadow-xs p-5 relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                    1
                  </span>
                  <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                    Packaging Header
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                    MAICW Enabled
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toast.info("Packaging Header edit mode active")}
                  >
                    <Edit className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Packaging Number</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value={pkgNumber} readOnly className="h-8 text-xs font-mono font-medium bg-muted/30" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Packaging Type</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={pkgType}
                    onChange={(e) => setPkgType(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none"
                  >
                    <option value="Export Packaging">Export Packaging</option>
                    <option value="Primary Packaging">Primary Packaging</option>
                    <option value="Secondary Packaging">Secondary Packaging</option>
                    <option value="Tertiary Packaging">Tertiary Packaging</option>
                    <option value="Protective Packaging">Protective Packaging</option>
                    <option value="Retail Packaging">Retail Packaging</option>
                    <option value="Industrial Packaging">Industrial Packaging</option>
                    <option value="Returnable Packaging">Returnable Packaging</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Packaging Date</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <Input type="date" value={pkgDate} onChange={(e) => setPkgDate(e.target.value)} className="h-8 text-xs" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Priority</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background font-medium text-amber-600 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical (Fragile Export)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Business Unit</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={businessUnit}
                    onChange={(e) => setBusinessUnit(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none"
                  >
                    <option value="Magnertia Manufacturing">Magnertia Manufacturing</option>
                    <option value="Magnertia Energy Systems">Magnertia Energy Systems</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Source Warehouse</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={sourceWarehouse}
                    onChange={(e) => setSourceWarehouse(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none"
                  >
                    <option value="Main Warehouse - Chennai">Main Warehouse - Chennai</option>
                    <option value="Bengaluru Logistics Hub">Bengaluru Logistics Hub</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Packaging Location</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={pkgLocation}
                    onChange={(e) => setPkgLocation(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none"
                  >
                    <option value="Packaging Line - 2">Packaging Line - 2</option>
                    <option value="Automated Line - 1">Automated Line - 1</option>
                    <option value="Heavy Crate Bay 3">Heavy Crate Bay 3</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Supervisor</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <Input value={pkgSupervisor} onChange={(e) => setPkgSupervisor(e.target.value)} className="h-8 text-xs" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Packaging ID</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value={pkgId} readOnly className="h-8 text-xs font-mono font-medium bg-muted/30" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Status</Label>
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-1 rounded font-mono">W</span>
                  </div>
                  <Badge className="h-8 w-full justify-center text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {status}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Created By</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value="Kavita Reddy" readOnly className="h-8 text-xs bg-muted/30" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Last Updated</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value="26 Apr 2026 02:35 PM" readOnly className="h-8 text-xs bg-muted/30 font-mono" />
                </div>
              </div>
            </div>

            {/* 2. PACKAGING STATUS (5 Cols) */}
            <div className="lg:col-span-5 bg-card rounded-xl border border-border shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                      2
                    </span>
                    <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                      Packaging Status
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">Lifecycle: 6/12</span>
                </div>

                {/* Workflow Stepper Bar */}
                <div className="relative py-2">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="mt-1 font-medium">Draft</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="mt-1 font-medium">Requested</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="mt-1 font-medium">Planned</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </div>
                      <span className="mt-1 font-medium">Allocated</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm ring-2 ring-blue-300 dark:ring-blue-800">
                        <Box className="h-3 w-3" />
                      </div>
                      <span className="mt-1 font-bold text-blue-600 dark:text-blue-400">Packing</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-muted-foreground/30 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-[10px]">
                        ○
                      </div>
                      <span className="mt-1">Quality</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-muted-foreground/30 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-[10px]">
                        ○
                      </div>
                      <span className="mt-1">Palletized</span>
                    </div>
                  </div>
                </div>

                {/* Status KPI summary grid with Circular Progress */}
                <div className="grid grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-border/80 items-center">
                  <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50">
                    <span className="text-[10px] text-muted-foreground font-medium block">Current Status</span>
                    <strong className="text-xs font-bold text-blue-700 dark:text-blue-300 block">Packing In Progress</strong>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">Since 26 Apr 11:20 AM</span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/50">
                    <span className="text-[10px] text-muted-foreground font-medium block">Next Step</span>
                    <strong className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">Quality Inspection</strong>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">Inspect packed items</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-border/80">
                    <span className="text-[10px] text-muted-foreground font-medium block">Quantity</span>
                    <div className="text-xs font-bold text-foreground">
                      <span className="text-emerald-600 font-mono">186</span> / <span className="font-mono">250</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">64 Remaining</span>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          className="text-muted/30"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="18"
                          stroke="#3b82f6"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 18}
                          strokeDashoffset={2 * Math.PI * 18 * (1 - 0.744)}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[11px] font-extrabold font-mono text-foreground">74%</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground mt-0.5">Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PACKAGING MANAGEMENT WORKSPACE */}
          <div className="space-y-6">
              {/* ROW 1: (3. Product Details) + (4. Material Summary) + (5. Capacity) + (6. Live Packaging Line) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {/* 3. PRODUCT / MATERIAL DETAILS */}
                <div className="col-span-1 bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/80">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold ring-1 ring-blue-500/20">
                          3
                        </span>
                        <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                          Product Details
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[9px]">Electrical</Badge>
                    </div>

                    {/* Product Specs Box */}
                    <div className="relative mb-2.5 rounded-lg border border-border/80 bg-muted/20 p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Package className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono font-bold text-xs text-foreground block truncate">CTRL-PNL-001</span>
                            <span className="text-[10px] text-muted-foreground truncate block">Industrial Control Panel</span>
                          </div>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white shrink-0">Fragile</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Item Code</span>
                        <strong className="font-mono text-primary font-bold">CTRL-PNL-001</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Item Name</span>
                        <span className="text-foreground font-medium truncate max-w-[150px]">Industrial Control Panel</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Category</span>
                        <span>Electrical Equipment</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Batch Number</span>
                        <span className="font-mono">BATCH-0426-A</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Quantity</span>
                        <strong className="font-mono">250 Units</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Gross Weight</span>
                        <span className="font-mono">12,500 Kg</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Net Weight</span>
                        <span className="font-mono">11,250 Kg</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Volume</span>
                        <span className="font-mono">18.75 CBM</span>
                      </div>
                      <div className="flex justify-between py-0.5 items-center">
                        <span className="text-muted-foreground">Safety Flags</span>
                        <div className="flex gap-1">
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">Fragile</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">Non-Haz</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. PACKAGING MATERIAL SUMMARY */}
                <div className="col-span-1 bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/80">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold ring-1 ring-blue-500/20">
                          4
                        </span>
                        <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                          Material Summary
                        </h3>
                      </div>
                      <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1.5 text-primary" onClick={() => setShowIssueModal(true)}>
                        + Issue
                      </Button>
                    </div>

                    <div
                      className="overflow-x-auto no-scrollbar scrollbar-none"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      <table className="w-full text-[11px] text-left">
                        <thead className="text-[10px] text-muted-foreground uppercase border-b border-border">
                          <tr>
                            <th className="py-1 px-1">Material</th>
                            <th className="py-1 px-1 text-right">Req</th>
                            <th className="py-1 px-1 text-right">Used</th>
                            <th className="py-1 px-1 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {PACKAGING_MATERIALS_LIST.map((m) => (
                            <tr key={m.name} className="hover:bg-muted/30">
                              <td className="py-1 px-1 font-medium truncate max-w-[95px]">{m.name}</td>
                              <td className="py-1 px-1 text-right font-mono text-muted-foreground">{m.required}</td>
                              <td className="py-1 px-1 text-right font-mono font-semibold text-emerald-600">{m.used}</td>
                              <td className="py-1 px-1 text-center">
                                <span className="px-1 py-0.2 rounded text-[9px] bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                  {m.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-t font-bold text-[10px]">
                          <tr>
                            <td className="py-1 px-1">Total</td>
                            <td className="py-1 px-1 text-right font-mono">1,170</td>
                            <td className="py-1 px-1 text-right font-mono text-emerald-600">832</td>
                            <td className="py-1 px-1 text-center text-muted-foreground font-normal">--</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 5. CAPACITY & UTILIZATION */}
                <div className="col-span-1 bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/80">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold ring-1 ring-blue-500/20">
                          5
                        </span>
                        <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                          Capacity & Utilization
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[9px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20">Optimal</Badge>
                    </div>

                    {/* Vector SVG Donut Gauge */}
                    <div className="flex items-center justify-center py-2">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 96 96">
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-muted/30"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            stroke="#10b981"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 38}
                            strokeDashoffset={2 * Math.PI * 38 * (1 - 0.736)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-sm font-extrabold font-mono text-foreground">73.6%</span>
                          <span className="text-[8px] text-muted-foreground font-semibold uppercase">Utilized</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 mt-1 text-[11px]">
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Maximum Capacity</span>
                        <strong className="font-mono">25,000 Kg</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Current Load</span>
                        <strong className="font-mono text-emerald-600">18,400 Kg</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Available Capacity</span>
                        <strong className="font-mono text-blue-600">6,600 Kg</strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Overload Status</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Normal</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-muted-foreground">Capacity Status</span>
                        <span className="text-[10px] text-blue-600 font-semibold">Available</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. LIVE PACKAGING LINE */}
                <div className="col-span-1 bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/80">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold ring-1 ring-blue-500/20">
                          6
                        </span>
                        <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                          Live Packaging Line
                        </h3>
                      </div>
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                        Live
                      </span>
                    </div>

                    {/* Conveyor Assembly Status Box */}
                    <div className="relative mb-2.5 rounded-lg border border-border/80 bg-muted/20 p-2.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-8 w-8 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <Layers className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-xs text-foreground block truncate">Line 2 (Semi-Auto)</span>
                            <span className="text-[10px] text-muted-foreground truncate block">Strapping & Boxing</span>
                          </div>
                        </div>
                        <Badge className="bg-emerald-600 text-white text-[9px] shrink-0">Active · 42 ppm</Badge>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Operator</span>
                        <span className="font-medium text-foreground truncate max-w-[130px]">Ramesh & Team</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Activity</span>
                        <span className="font-semibold text-primary">Box Assembly</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Output Today</span>
                        <strong className="font-mono text-emerald-600">186 / 250 Units</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Efficiency</span>
                        <strong className="font-mono text-foreground">85%</strong>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Shift Times</span>
                        <span className="font-mono text-muted-foreground">08:00 - 16:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2: (7. Packing Progress) + (8. Quality Inspection) + (9. Palletization Summary) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 7. PACKING PROGRESS */}
                <div className="md:col-span-2 lg:col-span-1 bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold ring-1 ring-blue-500/20">
                          7
                        </span>
                        <div>
                          <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                            Packing Progress
                          </h3>
                          <span className="text-[10px] text-muted-foreground">Conveyor Line 2 Active</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5 font-medium"
                        onClick={() => setShowStartPackingModal(true)}
                      >
                        <Play className="h-3 w-3 text-blue-600" /> Update Step
                      </Button>
                    </div>

                    {/* Progress Stepper Bar with clean connecting line */}
                    <div className="py-2 px-1">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">✓</div>
                          <span className="mt-1 text-[10px] whitespace-nowrap font-medium text-emerald-600">Verified</span>
                        </div>
                        <div className="h-0.5 flex-1 bg-emerald-500 mx-1" />
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">✓</div>
                          <span className="mt-1 text-[10px] whitespace-nowrap font-medium text-emerald-600">Material</span>
                        </div>
                        <div className="h-0.5 flex-1 bg-emerald-500 mx-1" />
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] ring-4 ring-blue-500/20 shadow-xs">●</div>
                          <span className="mt-1 text-[10px] whitespace-nowrap font-bold text-blue-600 dark:text-blue-400">Packing</span>
                        </div>
                        <div className="h-0.5 flex-1 bg-muted-foreground/30 mx-1" />
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-[10px]">○</div>
                          <span className="mt-1 text-[10px] whitespace-nowrap">Sealing</span>
                        </div>
                        <div className="h-0.5 flex-1 bg-muted-foreground/30 mx-1" />
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-[10px]">○</div>
                          <span className="mt-1 text-[10px] whitespace-nowrap">Labeling</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 p-2.5 rounded-lg border border-border/60 bg-muted/20">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-[11px] text-muted-foreground font-medium">Batch Output Progress</span>
                        <span className="font-mono text-xs font-bold text-primary">186 / 250 Units (74.4%)</span>
                      </div>
                      <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: "74.4%" }} />
                      </div>
                    </div>

                    {/* Operational metrics grid (3x2) */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/70 text-center">
                      <div className="p-2 rounded-lg bg-background border border-border/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Start Time</span>
                        <strong className="text-xs font-mono text-foreground">10:15 AM</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <span className="text-[10px] text-muted-foreground block font-medium">Packed</span>
                        <strong className="text-xs font-mono text-emerald-600 font-bold">186 Units</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <span className="text-[10px] text-muted-foreground block font-medium">Remaining</span>
                        <strong className="text-xs font-mono text-amber-600 font-bold">64 Units</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Expected</span>
                        <strong className="text-xs font-mono text-foreground">03:45 PM</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Line Crew</span>
                        <strong className="text-xs font-mono text-foreground">6 Techs</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Defects</span>
                        <strong className="text-xs font-mono text-emerald-600 font-bold">0 Clean</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. QUALITY INSPECTION SUMMARY */}
                <div className="md:col-span-1 lg:col-span-1 bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold ring-1 ring-emerald-500/20">
                          8
                        </span>
                        <div>
                          <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                            Quality Inspection
                          </h3>
                          <span className="text-[10px] text-muted-foreground">ISO-9001 QA Audit</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-primary gap-1 font-medium hover:bg-primary/10"
                        onClick={() => setShowQualityModal(true)}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Inspect
                      </Button>
                    </div>

                    {/* Top Gauge + Clearance Status */}
                    <div className="flex items-center gap-3.5 p-3 rounded-lg border border-border/60 bg-muted/20">
                      {/* SVG Circular Ring Gauge - 100% reliable, vector sharp */}
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 64 64">
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            stroke="currentColor"
                            strokeWidth="5"
                            fill="transparent"
                            className="text-muted/30"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            stroke="#10b981"
                            strokeWidth="5"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 26}
                            strokeDashoffset={2 * Math.PI * 26 * (1 - 0.984)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xs font-extrabold font-mono text-foreground leading-none">98.4%</span>
                          <span className="text-[7px] text-muted-foreground font-semibold uppercase mt-0.5">Pass</span>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Passed Clearance
                        </div>
                        <div className="text-xs text-foreground font-medium">
                          184 of 186 Units Inspected
                        </div>
                        <span className="text-[10px] text-muted-foreground block">
                          Inspection Batch #QC-0426
                        </span>
                      </div>
                    </div>

                    {/* Segmented Color Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
                        <span>Quality Ratio</span>
                        <span className="font-mono font-medium text-emerald-600">181 / 184 Clean</span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden flex bg-muted/60">
                        <div style={{ width: "98.4%" }} className="bg-emerald-500 h-full" title="Passed: 181" />
                        <div style={{ width: "1.6%" }} className="bg-red-500 h-full" title="Failed: 3" />
                      </div>
                    </div>

                    {/* QA Metrics Grid (2x2) */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/70 text-xs">
                      <div className="p-2 rounded-lg bg-background border border-border/50 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-[11px] text-muted-foreground">Passed</span>
                        </div>
                        <strong className="font-mono text-xs text-emerald-600 font-bold">181</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border/50 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                          <span className="text-[11px] text-muted-foreground">Failed</span>
                        </div>
                        <strong className="font-mono text-xs text-red-500 font-bold">3</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border/50 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-[11px] text-muted-foreground">Rework</span>
                        </div>
                        <strong className="font-mono text-xs text-amber-500 font-bold">2</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border/50 flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                          <span className="text-[11px] text-muted-foreground">Pending</span>
                        </div>
                        <strong className="font-mono text-xs text-foreground font-bold">2</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 9. PALLETIZATION SUMMARY */}
                <div className="md:col-span-1 lg:col-span-1 bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold ring-1 ring-amber-500/20">
                          9
                        </span>
                        <div>
                          <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                            Palletization
                          </h3>
                          <span className="text-[10px] text-muted-foreground">Load & Stacking Spec</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-medium">
                        12 Pallets Ready
                      </Badge>
                    </div>

                    {/* Pallet Specification Card */}
                    <div className="flex items-center gap-3 mb-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Boxes className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <strong className="block text-foreground text-xs font-semibold truncate">Wooden Pallet (Heavy Duty)</strong>
                        <span className="text-muted-foreground text-[11px] block truncate">Euro Standard 1200 × 800 mm</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono shrink-0 bg-background/80">
                        EUR-1
                      </Badge>
                    </div>

                    {/* Utilization Bar */}
                    <div className="mb-3 p-2.5 rounded-lg border border-border/60 bg-muted/20">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-[11px] text-muted-foreground font-medium">Stack Utilization</span>
                        <strong className="font-mono text-xs font-bold text-emerald-600">82% (Optimal)</strong>
                      </div>
                      <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" style={{ width: "82%" }} />
                      </div>
                    </div>

                    {/* Pallet Metrics Grid (2x2) */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/70 text-xs">
                      <div className="p-2 rounded-lg bg-background border border-border/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Total Packages</span>
                        <strong className="font-mono text-xs font-semibold text-foreground">106 Units</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Pallets Used</span>
                        <strong className="font-mono text-xs font-semibold text-foreground">12 Pallets</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Total Weight</span>
                        <strong className="font-mono text-xs font-semibold text-foreground">11,250 Kg</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Avg Pallet Load</span>
                        <strong className="font-mono text-xs font-semibold text-foreground">937.5 Kg</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 3: (10. Recent Transactions) & (11. Cost Summary This Month) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* 10. RECENT PACKAGING TRANSACTIONS */}
                <div className="col-span-1 bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold ring-1 ring-blue-500/20">
                          10
                        </span>
                        <div>
                          <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                            Recent Packaging Transactions
                          </h3>
                          <span className="text-[10px] text-muted-foreground">Order & Batch History</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        4 Logged
                      </Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                          <tr>
                            <th className="py-2.5 px-3">Packaging No.</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">Product</th>
                            <th className="py-2.5 px-3 text-right">Qty</th>
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {RECENT_TRANSACTIONS.map((t) => (
                            <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-2.5 px-3 font-mono text-primary font-semibold">{t.id}</td>
                              <td className="py-2.5 px-3">{t.type}</td>
                              <td className="py-2.5 px-3 font-medium text-foreground">{t.product}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-medium">{t.qty}</td>
                              <td className="py-2.5 px-3 text-muted-foreground">{t.date}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block",
                                    t.status === "Packing In Progress" && "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
                                    t.status === "Completed" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                                    t.status === "Quality Inspection" && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  )}
                                >
                                  {t.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-border/50 flex justify-end">
                    <button
                      onClick={() => toast.info("Viewing all packaging orders and batches")}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1 group"
                    >
                      View All Orders <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* 11. PACKAGING COST SUMMARY (THIS MONTH) */}
                <div className="col-span-1 bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold ring-1 ring-blue-500/20">
                          11
                        </span>
                        <div>
                          <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                            Packaging Cost Summary
                          </h3>
                          <span className="text-[10px] text-muted-foreground">Current Month Variance</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-primary gap-1 font-medium hover:bg-primary/10"
                        onClick={() => setShowCostModal(true)}
                      >
                        <Plus className="h-3 w-3" /> Add Cost
                      </Button>
                    </div>

                    {/* 4 Cost Tiles */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                      <div className="p-2.5 rounded-lg border border-border/70 bg-background/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Material Cost</span>
                        <div className="text-sm font-bold text-foreground font-mono">₹ 4,80,000</div>
                        <span className="text-[9px] text-emerald-600 font-medium">↓ 5% budget</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-border/70 bg-background/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Labor Cost</span>
                        <div className="text-sm font-bold text-foreground font-mono">₹ 1,45,000</div>
                        <span className="text-[9px] text-amber-600 font-medium">↑ 3% overtime</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-border/70 bg-background/50">
                        <span className="text-[10px] text-muted-foreground block font-medium">Other Ops</span>
                        <div className="text-sm font-bold text-foreground font-mono">₹ 1,87,500</div>
                        <span className="text-[9px] text-emerald-600 font-medium">↓ 2% savings</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-blue-500/20 bg-blue-500/5">
                        <span className="text-[10px] text-muted-foreground block font-medium">Total Incurred</span>
                        <div className="text-sm font-bold text-primary font-mono">₹ 8,12,500</div>
                        <span className="text-[9px] text-emerald-600 font-medium">↓ 4% net save</span>
                      </div>
                    </div>

                    {/* Trend Line Chart + Unit Cost */}
                    <div className="flex items-center justify-between gap-4 pt-1">
                      <div className="p-3 rounded-lg border border-border/70 bg-muted/20 text-center shrink-0">
                        <span className="text-[10px] text-muted-foreground block font-medium">Cost / Unit</span>
                        <strong className="text-base font-bold font-mono text-emerald-600">₹ 32.50</strong>
                        <span className="text-[9px] text-muted-foreground block mt-0.5">Target: ₹ 35</span>
                      </div>
                      <div className="h-24 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={PACKAGING_COST_TREND} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                            <YAxis tick={{ fontSize: 9 }} />
                            <Tooltip formatter={(val: any) => `₹ ${val.toLocaleString()}`} />
                            <Line
                              type="monotone"
                              dataKey="cost"
                              stroke="#3b82f6"
                              strokeWidth={2.5}
                              dot={{ r: 3, fill: "#3b82f6" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 4: 12. Quick Actions (8 Tile Grid) */}
              <div className="bg-card rounded-xl border border-border/80 shadow-xs hover:border-primary/30 transition-all p-5">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold ring-1 ring-blue-500/20">
                      12
                    </span>
                    <div>
                      <h3 className="font-semibold text-xs tracking-wider text-foreground uppercase">
                        Quick Actions
                      </h3>
                      <span className="text-[10px] text-muted-foreground">Packaging Line Operations & Dispatch Triggers</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">8 Operational Tools</Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                  {/* 1. Plan Packaging */}
                  <button
                    onClick={() => setShowPlanModal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 bg-background/50 hover:border-blue-500 hover:bg-blue-500/5 hover:shadow-xs transition-all text-center group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Plan Packaging</span>
                  </button>

                  {/* 2. Issue Material */}
                  <button
                    onClick={() => setShowIssueModal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 bg-background/50 hover:border-emerald-500 hover:bg-emerald-500/5 hover:shadow-xs transition-all text-center group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Layers className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Issue Material</span>
                  </button>

                  {/* 3. Start Packing */}
                  <button
                    onClick={() => setShowStartPackingModal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 bg-background/50 hover:border-indigo-500 hover:bg-indigo-500/5 hover:shadow-xs transition-all text-center group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Play className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Start Packing</span>
                  </button>

                  {/* 4. Print Labels */}
                  <button
                    onClick={() => setShowPrintLabelModal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 bg-background/50 hover:border-purple-500 hover:bg-purple-500/5 hover:shadow-xs transition-all text-center group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Printer className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Print Labels</span>
                  </button>

                  {/* 5. Quality Check */}
                  <button
                    onClick={() => setShowQualityModal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 bg-background/50 hover:border-teal-500 hover:bg-teal-500/5 hover:shadow-xs transition-all text-center group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-4 w-4 text-teal-600" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Quality Check</span>
                  </button>

                  {/* 6. Palletize */}
                  <button
                    onClick={() => setShowPalletizeModal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 bg-background/50 hover:border-amber-500 hover:bg-amber-500/5 hover:shadow-xs transition-all text-center group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Boxes className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Palletize</span>
                  </button>

                  {/* 7. View Costs */}
                  <button
                    onClick={() => setShowCostModal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 bg-background/50 hover:border-rose-500 hover:bg-rose-500/5 hover:shadow-xs transition-all text-center group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Receipt className="h-4 w-4 text-rose-600" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">View Costs</span>
                  </button>

                  {/* 8. Analytics */}
                  <button
                    onClick={() => setShowAnalyticsModal(true)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 bg-background/50 hover:border-cyan-500 hover:bg-cyan-500/5 hover:shadow-xs transition-all text-center group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground">Analytics</span>
                  </button>
                </div>
              </div>
            </div>

        </div>

      {/* --- QUICK ACTION DIALOG MODALS --- */}

      {/* 1. Plan Packaging Modal */}
      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Configure Packaging Plan</DialogTitle>
            <DialogDescription>Assign packaging lines, shift duration, and target outputs.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Packaging Line</Label>
              <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                <option>Packaging Line - 2 (Manual + Semi-Auto)</option>
                <option>Automated High-Speed Line 1</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Target Output Quantity</Label>
              <Input defaultValue="250" className="h-8 text-xs font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPlanModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-blue-600 text-white" onClick={() => { setShowPlanModal(false); toast.success("Packaging plan updated"); }}>
              Save Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Issue Material Modal */}
      <Dialog open={showIssueModal} onOpenChange={setShowIssueModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Issue Packaging Materials from Stores</DialogTitle>
            <DialogDescription>Transfer cartons, bubble wrap, or pallets to packaging bay.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Material</Label>
              <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                <option>Corrugated Box (Large) - 50 Nos</option>
                <option>Bubble Wrap (50 Mtr Roll)</option>
                <option>Wooden Pallet (Euro Standard) - 4 Nos</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Issue Quantity</Label>
              <Input defaultValue="50" className="h-8 text-xs font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowIssueModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-emerald-600 text-white" onClick={() => { setShowIssueModal(false); toast.success("Materials issued to Line 2"); }}>
              Confirm Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Start Packing Modal */}
      <Dialog open={showStartPackingModal} onOpenChange={setShowStartPackingModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Record Packing Output</DialogTitle>
            <DialogDescription>Log newly completed units ready for QA.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Units Completed in Batch</Label>
              <Input defaultValue="25" className="h-8 text-xs font-mono" />
            </div>
            <div>
              <Label className="text-xs">Operator In-charge</Label>
              <Input defaultValue="Naveen Swamy" className="h-8 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowStartPackingModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-indigo-600 text-white" onClick={() => { setShowStartPackingModal(false); toast.success("25 units logged to packed inventory"); }}>
              Save Output
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Print Labels Modal */}
      <Dialog open={showPrintLabelModal} onOpenChange={setShowPrintLabelModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Print Barcode & Shipping Labels</DialogTitle>
            <DialogDescription>Generate thermal labels for packages and pallets.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Label Template</Label>
              <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                <option>Export Standard (100x150mm) Code 128</option>
                <option>Domestic Shipping Label with QR Code</option>
                <option>Fragile / Handling Warning Label</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Number of Labels</Label>
              <Input defaultValue="50" className="h-8 text-xs font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPrintLabelModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-purple-600 text-white" onClick={() => { setShowPrintLabelModal(false); toast.success("50 Labels sent to Zebra Thermal Printer"); }}>
              Send to Printer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Quality Inspection Modal */}
      <Dialog open={showQualityModal} onOpenChange={setShowQualityModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Packaging Quality Inspection</DialogTitle>
            <DialogDescription>Verify bursting strength, cushioning, and dimensions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs max-h-60 overflow-y-auto pr-1">
            {QUALITY_INSPECTION_CHECKLIST.map((q) => (
              <div key={q.item} className="flex items-center justify-between p-1.5 rounded hover:bg-muted/30">
                <span className="text-foreground">{q.item}</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">
                  Passed
                </Badge>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowQualityModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-teal-600 text-white" onClick={() => { setShowQualityModal(false); toast.success("Quality inspection approved & stamped"); }}>
              Approve QA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Palletize Modal */}
      <Dialog open={showPalletizeModal} onOpenChange={setShowPalletizeModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Pallet Stacking & Wrapping</DialogTitle>
            <DialogDescription>Stack packages into secure shipping pallets.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Pallet Type</Label>
              <select
                value={palletType}
                onChange={(e) => setPalletType(e.target.value)}
                className="w-full h-8 px-2 rounded border text-xs bg-background"
              >
                <option>Wooden Pallet (Euro 1200x800)</option>
                <option>Heavy Duty Industrial Crate</option>
                <option>Plastic Export Pallet</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Packages on Pallet</Label>
              <Input
                type="number"
                value={palletPackages}
                onChange={(e) => setPalletPackages(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPalletizeModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-amber-600 text-white" onClick={() => { setShowPalletizeModal(false); toast.success("Pallet PAL-2026-0091 created"); }}>
              Complete Pallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. View Costs Modal */}
      <Dialog open={showCostModal} onOpenChange={setShowCostModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Log Packaging Expense</DialogTitle>
            <DialogDescription>Record actual material, labor or machine costs.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Cost Component</Label>
              <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                <option>Packaging Material</option>
                <option>Labor & Overtime</option>
                <option>Machine & Power</option>
                <option>Label Printing</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Amount (₹)</Label>
              <Input defaultValue="8500" className="h-8 text-xs font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCostModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-rose-600 text-white" onClick={() => { setShowCostModal(false); toast.success("Cost entry added to job ledger"); }}>
              Save Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Analytics Modal */}
      <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Packaging Productivity Analytics</DialogTitle>
            <DialogDescription>Efficiency and sustainability indices.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-xs py-2">
            <div className="p-3 rounded border bg-blue-50/20 space-y-1">
              <div className="flex justify-between"><span>Output Rate:</span><strong className="font-mono text-emerald-600">32 Units/Hour</strong></div>
              <div className="flex justify-between"><span>First-Time Pass:</span><strong className="font-mono text-blue-600">98.4%</strong></div>
              <div className="flex justify-between"><span>Cost Variance:</span><strong className="font-mono text-emerald-600">-₹ 37,500 (Savings)</strong></div>
              <div className="flex justify-between"><span>Eco-Recyclability:</span><strong className="font-mono text-teal-600">94.0%</strong></div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowAnalyticsModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default PackagingPage;
