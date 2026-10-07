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
  Recycle,
  Shield,
  CheckCheck,
  FileBadge,
  LogOut,
  ScanLine,
  Trash2,
  Hammer,
  BadgePercent,
  TrendingDown,
  FileDown,
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

export const Route = createFileRoute("/management/supply-chain-management/reverse-logistics")({
  head: () => ({
    meta: [
      { title: "Reverse Logistics Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "Manage end-to-end return authorizations, pickup logistics, warehouse receiving, inspection grading, disposition, and financial settlements.",
      },
    ],
  }),
  component: ReverseLogisticsPage,
});

// --- SAMPLE DATA ---
const RETURN_ITEMS_LIST = [
  {
    code: "CTRL-PNL-001",
    name: "Control Panel",
    returnQty: 100,
    receivedQty: 100,
    acceptedQty: 90,
    condition: "B",
    status: "Under Inspection",
    reason: "Damaged Product",
    batch: "BAT-2026-0391",
    serial: "SN-CP-99014",
    uom: "Nos",
  },
  {
    code: "PWR-MOD-010",
    name: "Defective Power Converter Sub-Rack 60kW",
    returnQty: 120,
    receivedQty: 110,
    acceptedQty: 95,
    condition: "C",
    status: "Under Inspection",
    reason: "Warranty Claim",
    batch: "BAT-2026-0418",
    serial: "SN-PM-88123",
    uom: "Nos",
  },
  {
    code: "CBL-6MM-RD",
    name: "Field-Returned Fast DC Charging Cable 7m",
    returnQty: 1000,
    receivedQty: 980,
    acceptedQty: 960,
    condition: "A",
    status: "Inspected",
    reason: "Excess Material",
    batch: "BAT-2026-0205",
    serial: "SN-CBL-4019",
    uom: "Mtr",
  },
  {
    code: "SWITCH-32A",
    name: "MCB Switch 32A",
    returnQty: 200,
    receivedQty: 200,
    acceptedQty: 200,
    condition: "A",
    status: "Inspected",
    reason: "Wrong Quantity",
    batch: "BAT-2026-0512",
    serial: "SN-SW-77310",
    uom: "Nos",
  },
  {
    code: "FAN-COOL-220",
    name: "Cooling Fan",
    returnQty: 60,
    receivedQty: 60,
    acceptedQty: 45,
    condition: "B",
    status: "Under Inspection",
    reason: "Defective Product",
    batch: "BAT-2026-0199",
    serial: "SN-FN-30211",
    uom: "Nos",
  },
];

const REASON_BREAKDOWN_DATA = [
  { name: "Damaged Product", value: 20, pct: "42%", color: "#ef4444" },
  { name: "Warranty Claim", value: 12, pct: "25%", color: "#f97316" },
  { name: "Defective Product", value: 8, pct: "17%", color: "#eab308" },
  { name: "Wrong Product", value: 5, pct: "10%", color: "#3b82f6" },
  { name: "Others", value: 3, pct: "6%", color: "#8b5cf6" },
];

const DISPOSITION_DATA = [
  { name: "Restock", count: 40, pct: "42%", color: "#10b981", value: "₹ 9,80,000" },
  { name: "Repair", count: 24, pct: "25%", color: "#3b82f6", value: "₹ 4,35,000" },
  { name: "Refurbish", count: 16, pct: "17%", color: "#8b5cf6", value: "₹ 2,15,000" },
  { name: "Recycle", count: 10, pct: "10%", color: "#f59e0b", value: "₹ 1,25,000" },
  { name: "Dispose", count: 6, pct: "6%", color: "#64748b", value: "₹ 90,200" },
];

const RECENT_RETURN_ACTIVITY = [
  {
    time: "26 Apr 2026 04:20 PM",
    activity: "Return Received",
    ref: "RR-2026-004821",
    user: "Warehouse Team",
    remarks: "Material received at Chennai Service Center",
    status: "Completed",
  },
  {
    time: "26 Apr 2026 04:10 PM",
    activity: "In Transit",
    ref: "TRP-2026-004821",
    user: "Suresh Babu",
    remarks: "En route to Chennai Service Center",
    status: "Completed",
  },
  {
    time: "26 Apr 2026 10:30 AM",
    activity: "Pickup Completed",
    ref: "PUP-2026-004821",
    user: "Tariq Ahmed",
    remarks: "Material collected from customer site",
    status: "Completed",
  },
  {
    time: "26 Apr 2026 09:00 AM",
    activity: "Pickup Assigned",
    ref: "PUP-2026-004821",
    user: "Deepak Chawla",
    remarks: "Vehicle & driver assigned for pickup",
    status: "Completed",
  },
  {
    time: "25 Apr 2026 02:15 PM",
    activity: "Return Authorized",
    ref: "RMA-2026-004821",
    user: "Deepak Chawla",
    remarks: "Return authorized and RMA generated",
    status: "Completed",
  },
];

const RETURN_DOCUMENTS_LIST = [
  { id: "RMA-2026-004821.pdf", name: "Return Authorization (RMA)", status: "Uploaded" },
  { id: "PUP-ACK-004821.pdf", name: "Pickup Acknowledgement", status: "Uploaded" },
  { id: "DC-RET-004821.pdf", name: "Delivery Challan (Return)", status: "Uploaded" },
  { id: "IR-004821.pdf", name: "Inspection Report", status: "Uploaded" },
  { id: "CN-2026-007512.pdf", name: "Credit Note", status: "Generated" },
];

function ReverseLogisticsPage() {
  // Header State
  const [returnNumber] = useState("RMA-2026-004821");
  const [returnDate, setReturnDate] = useState("2026-04-26");
  const [returnType, setReturnType] = useState("Warranty Return");
  const [priority, setPriority] = useState("High");
  const [businessUnit, setBusinessUnit] = useState("Magnertia Manufacturing");
  const [returnSource, setReturnSource] = useState("Industrial Solutions Pvt Ltd");
  const [returnDestination, setReturnDestination] = useState("Chennai Service Center");
  const [manager, setManager] = useState("Deepak Chawla");
  const [status, setStatus] = useState("Under Inspection");

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAuthorizeModal, setShowAuthorizeModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showReceivingModal, setShowReceivingModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  return (
    <AppShell
      title="Reverse Logistics"
      breadcrumb="Management"
      description="Manage return requests, RMA authorizations, reverse pickup, receiving, inspection grading, and recovery."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="reverse-logistics"
    >
      <div className="space-y-6">
        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active RMA:</span>
            <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5 border-primary/20">
              {returnNumber}
            </Badge>
            <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200 text-xs">
              <RotateCcw className="h-3 w-3 mr-1 inline" />
              {status}
            </Badge>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1 animate-pulse" />
              Chennai Service Center Active
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => toast.info("Return draft reset")}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => toast.success("Draft saved to reverse logistics registry")}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Save Draft
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              onClick={() => toast.success("Reverse logistics report authorized & disposition released")}
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
              <DropdownMenuContent align="end" className="w-56 text-xs">
                <DropdownMenuLabel>Workflow Operations</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowAuthorizeModal(true)}>
                  <ShieldCheck className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                  Authorize RMA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPickupModal(true)}>
                  <Truck className="h-3.5 w-3.5 mr-2 text-blue-600" />
                  Schedule Pickup
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowReceivingModal(true)}>
                  <Warehouse className="h-3.5 w-3.5 mr-2 text-purple-600" />
                  Record Warehouse Receipt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowInspectionModal(true)}>
                  <CheckSquare className="h-3.5 w-3.5 mr-2 text-amber-600" />
                  Inspection & Grading
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDispositionModal(true)}>
                  <Split className="h-3.5 w-3.5 mr-2 text-indigo-600" />
                  Disposition Engine
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5 mr-2" />
                  Print RMA Summary
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Audit export generated")}>
                  <FileDown className="h-3.5 w-3.5 mr-2" />
                  Export Traceability Package
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
          {/* TOP 2-COLUMN SECTION: (1. REVERSE LOGISTICS HEADER) & (2. RETURN STATUS WORKFLOW) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. REVERSE LOGISTICS HEADER (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold">
                    1
                  </span>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Reverse Logistics Header
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => toast.info("Reverse Logistics Header edit mode active")}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Return Number</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value={returnNumber} readOnly className="h-8 text-xs font-mono font-medium bg-muted/30" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Return Date</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Return Type</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={returnType}
                    onChange={(e) => setReturnType(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none"
                  >
                    <option value="Customer Return">Customer Return</option>
                    <option value="Sales Return">Sales Return</option>
                    <option value="Project Material Return">Project Material Return</option>
                    <option value="Warranty Return">Warranty Return</option>
                    <option value="Repair Return">Repair Return</option>
                    <option value="Replacement Return">Replacement Return</option>
                    <option value="Damaged Goods Return">Damaged Goods Return</option>
                    <option value="Excess Material Return">Excess Material Return</option>
                    <option value="Rental Asset Return">Rental Asset Return</option>
                    <option value="Reusable Packaging Return">Reusable Packaging Return</option>
                    <option value="Asset Recovery">Asset Recovery</option>
                    <option value="Recall Return">Recall Return</option>
                    <option value="Recycling Return">Recycling Return</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Priority</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background font-semibold text-rose-600 dark:text-rose-400 focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Urgent">Urgent / Critical</option>
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
                    <Label className="text-muted-foreground font-medium text-[11px]">Return Source</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={returnSource}
                    onChange={(e) => setReturnSource(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none"
                  >
                    <option value="Industrial Solutions Pvt Ltd">Industrial Solutions Pvt Ltd</option>
                    <option value="Apex Power Grid Ltd">Apex Power Grid Ltd</option>
                    <option value="Tata Projects Site A">Tata Projects Site A</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Return Destination</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={returnDestination}
                    onChange={(e) => setReturnDestination(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none"
                  >
                    <option value="Chennai Service Center">Chennai Service Center</option>
                    <option value="Bengaluru Logistics Hub">Bengaluru Logistics Hub</option>
                    <option value="Main Warehouse - Chennai">Main Warehouse - Chennai</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Reverse Logistics Manager</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <Input value={manager} onChange={(e) => setManager(e.target.value)} className="h-8 text-xs" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Return Logistics ID</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value="RLID-0004821" readOnly className="h-8 text-xs bg-muted/30 font-mono" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Return Status</Label>
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-1 rounded font-mono">W</span>
                  </div>
                  <Badge className="h-8 w-full justify-center text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                    {status}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Created By</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value="Deepak Chawla" readOnly className="h-8 text-xs bg-muted/30" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Last Updated</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value="26 Apr 2026 03:15 PM" readOnly className="h-8 text-xs bg-muted/30 font-mono" />
                </div>
              </div>
            </div>

            {/* 2. RETURN STATUS WORKFLOW (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold">
                      2
                    </span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Return Status Workflow
                    </h2>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                    13-Stage Loop
                  </Badge>
                </div>

                {/* Status Stepper Progression */}
                <div
                  className="w-full overflow-x-auto no-scrollbar scrollbar-none py-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div className="flex items-center min-w-[540px] text-[9px] text-muted-foreground">
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">✓</div>
                      <span className="mt-1 font-medium">Draft</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">✓</div>
                      <span className="mt-1 font-medium">Requested</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">✓</div>
                      <span className="mt-1 font-medium">Verified</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">✓</div>
                      <span className="mt-1 font-medium">Authorized</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">✓</div>
                      <span className="mt-1 font-medium">Pickup</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">✓</div>
                      <span className="mt-1 font-medium">Collected</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">✓</div>
                      <span className="mt-1 font-medium">In Transit</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">✓</div>
                      <span className="mt-1 font-medium">Received</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-blue-600 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm ring-2 ring-blue-300">
                        <Eye className="h-3 w-3" />
                      </div>
                      <span className="mt-1 font-bold text-blue-600">Inspection</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-muted-foreground/30 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-[10px]">○</div>
                      <span className="mt-1">Disposition</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-muted-foreground/30 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-[10px]">○</div>
                      <span className="mt-1">Settlement</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-muted-foreground/30 mx-0.5" />
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-[10px]">○</div>
                      <span className="mt-1">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Status KPI Summary Grid */}
                <div className="grid grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-border/80 items-center">
                  <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50">
                    <span className="text-[10px] text-muted-foreground font-medium block">Current Status</span>
                    <strong className="text-xs font-bold text-amber-700 dark:text-amber-400 block">Under Inspection</strong>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">Since 26 Apr 10:20 AM</span>
                  </div>

                  <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50">
                    <span className="text-[10px] text-muted-foreground font-medium block">Next Step</span>
                    <strong className="text-xs font-bold text-blue-700 dark:text-blue-300 block">Disposition Decision</strong>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">Awaiting inspection result</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-border/80">
                    <span className="text-[10px] text-muted-foreground font-medium block">Expected Closure</span>
                    <strong className="text-xs font-bold text-foreground block font-mono">02 May 2026</strong>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">06:00 PM</span>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-12 h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { value: 68, fill: "#10b981" },
                              { value: 32, fill: "#e2e8f0" },
                            ]}
                            innerRadius={16}
                            outerRadius={22}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#e2e8f0" className="dark:fill-slate-800" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[11px] font-extrabold text-foreground">68%</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground mt-0.5">Recovery Loop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WORKSPACE OVERVIEW */}
          <div className="space-y-6">
              {/* ROW 1: (3. RETURN SUMMARY) + (4. RETURN ITEM SUMMARY) + (5. DISPOSITION SUMMARY) + (6. RECOVERY VALUE) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* 3. RETURN SUMMARY (3 Cols) */}
                <div className="md:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                          3
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Return Summary
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center mb-3">
                      <div className="p-2 rounded-lg bg-muted/40 border border-border/60">
                        <span className="text-[10px] text-muted-foreground block">Total Items</span>
                        <strong className="text-base font-extrabold text-foreground">48</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/50">
                        <span className="text-[10px] text-muted-foreground block">Return Quantity</span>
                        <strong className="text-base font-extrabold text-blue-600 dark:text-blue-400">120 Units</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-border/60">
                        <span className="text-[10px] text-muted-foreground block">Received Quantity</span>
                        <strong className="text-base font-extrabold text-foreground">118 Units</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/50">
                        <span className="text-[10px] text-muted-foreground block">Accepted Quantity</span>
                        <strong className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">96 Units</strong>
                      </div>
                    </div>

                    {/* Return Reason Breakdown Donut Chart */}
                    <div className="mt-2 pt-2 border-t border-border/60">
                      <span className="text-[10px] font-semibold text-muted-foreground block mb-1">
                        Return Reason Breakdown
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="relative w-24 h-24 shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={REASON_BREAKDOWN_DATA}
                                innerRadius={28}
                                outerRadius={42}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {REASON_BREAKDOWN_DATA.map((entry, idx) => (
                                  <Cell key={`cell-${idx}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[11px] font-bold text-foreground">48</span>
                            <span className="text-[8px] text-muted-foreground">Items</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-[10px] flex-1">
                          {REASON_BREAKDOWN_DATA.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                {item.name}
                              </span>
                              <span className="font-semibold text-foreground shrink-0">{item.value} ({item.pct})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. RETURN ITEM SUMMARY (4 Cols) */}
                <div className="md:col-span-4 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                        4
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Return Item Summary
                      </h3>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5" onClick={() => toast.info("Displaying all 5 return items")}>
                      View All (5)
                    </Button>
                  </div>

                  <div
                    className="overflow-x-auto no-scrollbar scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <table className="w-full text-[11px] text-left">
                      <thead>
                        <tr className="border-b border-border/70 text-muted-foreground font-medium">
                          <th className="pb-1.5 font-medium">Item Code</th>
                          <th className="pb-1.5 font-medium">Item Name</th>
                          <th className="pb-1.5 font-medium text-right">Return Qty</th>
                          <th className="pb-1.5 font-medium text-right">Received Qty</th>
                          <th className="pb-1.5 font-medium text-right">Accepted Qty</th>
                          <th className="pb-1.5 font-medium text-center">Condition</th>
                          <th className="pb-1.5 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {RETURN_ITEMS_LIST.map((item) => (
                          <tr key={item.code} className="hover:bg-muted/30 transition-colors">
                            <td className="py-1.5 font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                              {item.code}
                            </td>
                            <td className="py-1.5 truncate max-w-[90px]">{item.name}</td>
                            <td className="py-1.5 text-right font-mono font-medium">{item.returnQty}</td>
                            <td className="py-1.5 text-right font-mono font-medium">{item.receivedQty}</td>
                            <td className="py-1.5 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                              {item.acceptedQty}
                            </td>
                            <td className="py-1.5 text-center">
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                item.condition === "A" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                                item.condition === "B" && "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                                item.condition === "C" && "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                              )}>
                                {item.condition}
                              </span>
                            </td>
                            <td className="py-1.5 text-right">
                              <span className={cn(
                                "px-1.5 py-0.5 rounded-full text-[9px] font-medium",
                                item.status === "Inspected"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              )}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="font-bold text-foreground bg-muted/20">
                          <td className="py-1.5">Total</td>
                          <td className="py-1.5">-</td>
                          <td className="py-1.5 text-right font-mono">1,480</td>
                          <td className="py-1.5 text-right font-mono">1,450</td>
                          <td className="py-1.5 text-right font-mono text-emerald-600">1,388</td>
                          <td className="py-1.5 text-center">-</td>
                          <td className="py-1.5 text-right">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. DISPOSITION SUMMARY (2.5 Cols -> 3 cols) */}
                <div className="md:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                          5
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Disposition Summary
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative w-28 h-28 my-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={DISPOSITION_DATA}
                              innerRadius={34}
                              outerRadius={50}
                              paddingAngle={3}
                              dataKey="count"
                            >
                              {DISPOSITION_DATA.map((entry, idx) => (
                                <Cell key={`disp-${idx}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-sm font-extrabold text-foreground">96</span>
                          <span className="text-[9px] text-muted-foreground">Accepted</span>
                        </div>
                      </div>

                      <div className="w-full space-y-1 mt-2 text-[10px]">
                        {DISPOSITION_DATA.map((item) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                              {item.name}
                            </span>
                            <span className="font-semibold text-foreground">
                              {item.count} ({item.pct})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. RECOVERY VALUE (2 Cols) */}
                <div className="md:col-span-2 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                          6
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Recovery Value
                        </h3>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/50 mb-3 text-center">
                      <span className="text-[10px] text-muted-foreground block font-medium">Total Recovery Value</span>
                      <strong className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono block">
                        ₹ 18,45,200
                      </strong>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        By Disposition Type
                      </span>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Restock Value</span>
                        <strong className="font-mono text-foreground font-semibold">₹ 9,80,000</strong>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Repair Value</span>
                        <strong className="font-mono text-foreground font-semibold">₹ 4,35,000</strong>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Refurbish Value</span>
                        <strong className="font-mono text-foreground font-semibold">₹ 2,15,000</strong>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Recycle Value</span>
                        <strong className="font-mono text-foreground font-semibold">₹ 1,25,000</strong>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>Scrap Value</span>
                        <strong className="font-mono text-foreground font-semibold">₹ 90,200</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2: (7. PICKUP & TRANSPORT STATUS) + (8. INSPECTION SUMMARY) + (9. FINANCIAL SETTLEMENT) + (10. QUICK ACTIONS) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* 7. PICKUP & TRANSPORT STATUS (3 Cols) */}
                <div className="md:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                        7
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Pickup & Transport Status
                      </h3>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                      <Truck className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Pickup Plan ID</span>
                      <span className="font-mono font-semibold text-foreground text-[11px]">PUP-2026-004821</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Pickup Date</span>
                      <span className="font-mono font-medium text-foreground text-[11px]">24 Apr 2026</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Pickup Status</span>
                      <Badge className="h-4 text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Completed
                      </Badge>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Transporter</span>
                      <span className="font-medium text-foreground text-[11px]">Magnertia Logistics</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Driver</span>
                      <span className="font-medium text-foreground text-[11px]">Suresh Babu</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Vehicle Number</span>
                      <span className="font-mono font-semibold text-blue-600 text-[11px]">TN-04-AX-8819</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">In Transit</span>
                      <span className="font-mono text-[10px] text-muted-foreground">26 Apr 2026 09:10 AM</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Estimated Arrival</span>
                      <span className="font-mono text-[10px] text-muted-foreground">26 Apr 2026 05:00 PM</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-muted-foreground text-[11px]">Actual Arrival</span>
                      <span className="font-mono text-[10px] text-emerald-600 font-semibold">26 Apr 2026 04:20 PM</span>
                    </div>
                  </div>
                </div>

                {/* 8. INSPECTION SUMMARY (3 Cols) */}
                <div className="md:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                        8
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Inspection Summary
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center mb-3">
                    <div className="p-1.5 rounded bg-muted/40 border border-border/50">
                      <span className="text-[9px] text-muted-foreground block">Total Inspected</span>
                      <strong className="text-xs font-extrabold text-foreground">118</strong>
                    </div>
                    <div className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200">
                      <span className="text-[9px] text-muted-foreground block">Accepted</span>
                      <strong className="text-xs font-extrabold text-emerald-600">96 (81%)</strong>
                    </div>
                    <div className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/20 border border-rose-200">
                      <span className="text-[9px] text-muted-foreground block">Rejected</span>
                      <strong className="text-xs font-extrabold text-rose-600">22 (19%)</strong>
                    </div>
                    <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                      <span className="text-[9px] text-muted-foreground block">Avg Grade</span>
                      <strong className="text-xs font-extrabold text-blue-600">2.1</strong>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-muted-foreground block mb-1.5">
                    Condition Grade Distribution
                  </span>

                  <div className="space-y-1.5 text-[10px]">
                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-muted-foreground">A - New / Resalable</span>
                        <span className="font-semibold text-foreground">40 (42%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "42%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-muted-foreground">B - Minor Repair</span>
                        <span className="font-semibold text-foreground">24 (25%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "25%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-muted-foreground">C - Refurbishment</span>
                        <span className="font-semibold text-foreground">16 (17%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "17%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-muted-foreground">D - Parts Recovery</span>
                        <span className="font-semibold text-foreground">10 (10%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "10%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-muted-foreground">E - Scrap / Dispose</span>
                        <span className="font-semibold text-foreground">6 (6%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "6%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 9. FINANCIAL SETTLEMENT (3 Cols) */}
                <div className="md:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                        9
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Financial Settlement
                      </h3>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      ₹
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Settlement Type</span>
                      <span className="font-semibold text-foreground text-[11px]">Credit Note</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Credit Note Number</span>
                      <span className="font-mono font-bold text-blue-600 text-[11px]">CN-2026-007512</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Settlement Date</span>
                      <span className="font-mono text-foreground text-[11px]">01 May 2026</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Total Credit Amount</span>
                      <span className="font-mono font-semibold text-foreground text-[11px]">₹ 16,30,000</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Repair Charges</span>
                      <span className="font-mono text-rose-600 text-[11px]">₹ 45,200</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground text-[11px]">Other Deductions</span>
                      <span className="font-mono text-rose-600 text-[11px]">₹ 1,12,200</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="font-bold text-[11px]">Net Settlement Amount</span>
                      <strong className="font-mono font-extrabold text-emerald-600 text-xs">₹ 15,63,200</strong>
                    </div>
                    <div className="flex justify-between py-0.5 items-center">
                      <span className="text-muted-foreground text-[11px]">Settlement Status</span>
                      <Badge className="h-4 text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Completed
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* 10. QUICK ACTIONS (3 Cols) */}
                <div className="md:col-span-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                        10
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Quick Actions
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 text-[10px] p-1 text-center hover:border-primary hover:text-primary transition-all"
                      onClick={() => setShowRequestModal(true)}
                    >
                      <Plus className="h-4 w-4 text-blue-600" />
                      <span>New Return Request</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 text-[10px] p-1 text-center hover:border-primary hover:text-primary transition-all"
                      onClick={() => setShowAuthorizeModal(true)}
                    >
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span>Authorize Return</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 text-[10px] p-1 text-center hover:border-primary hover:text-primary transition-all"
                      onClick={() => setShowPickupModal(true)}
                    >
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span>Plan Pickup</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 text-[10px] p-1 text-center hover:border-primary hover:text-primary transition-all"
                      onClick={() => setShowReceivingModal(true)}
                    >
                      <Warehouse className="h-4 w-4 text-purple-600" />
                      <span>Record Receipt</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 text-[10px] p-1 text-center hover:border-primary hover:text-primary transition-all"
                      onClick={() => setShowInspectionModal(true)}
                    >
                      <CheckSquare className="h-4 w-4 text-amber-600" />
                      <span>Start Inspection</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 text-[10px] p-1 text-center hover:border-primary hover:text-primary transition-all"
                      onClick={() => setShowDispositionModal(true)}
                    >
                      <Split className="h-4 w-4 text-indigo-600" />
                      <span>Disposition</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 text-[10px] p-1 text-center hover:border-primary hover:text-primary transition-all"
                      onClick={() => setShowRepairModal(true)}
                    >
                      <Wrench className="h-4 w-4 text-rose-600" />
                      <span>Create Repair Order</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 text-[10px] p-1 text-center hover:border-primary hover:text-primary transition-all"
                      onClick={() => setShowCreditModal(true)}
                    >
                      <Receipt className="h-4 w-4 text-teal-600" />
                      <span>Create Credit Note</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-16 flex flex-col items-center justify-center gap-1 text-[10px] p-1 text-center hover:border-primary hover:text-primary transition-all"
                      onClick={() => setShowAnalyticsModal(true)}
                    >
                      <TrendingUp className="h-4 w-4 text-cyan-600" />
                      <span>View Analytics</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* ROW 3: (11. RECENT RETURN ACTIVITY) & (12. DOCUMENTS) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* 11. RECENT RETURN ACTIVITY (7 Cols) */}
                <div className="md:col-span-7 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                        11
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Recent Return Activity
                      </h3>
                    </div>
                  </div>

                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground font-medium text-[11px]">
                          <th className="pb-1.5 font-medium">Date & Time</th>
                          <th className="pb-1.5 font-medium">Activity</th>
                          <th className="pb-1.5 font-medium">Reference</th>
                          <th className="pb-1.5 font-medium">User</th>
                          <th className="pb-1.5 font-medium">Remarks</th>
                          <th className="pb-1.5 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-[11px]">
                        {RECENT_RETURN_ACTIVITY.map((log, i) => (
                          <tr key={i} className="hover:bg-muted/20">
                            <td className="py-2 text-muted-foreground font-mono">{log.time}</td>
                            <td className="py-2 font-medium text-foreground">{log.activity}</td>
                            <td className="py-2 font-mono text-blue-600">{log.ref}</td>
                            <td className="py-2 text-muted-foreground">{log.user}</td>
                            <td className="py-2 text-muted-foreground truncate max-w-[160px]">{log.remarks}</td>
                            <td className="py-2 text-right">
                              <Badge className="h-4 text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {log.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 12. DOCUMENTS (5 Cols) */}
                <div className="md:col-span-5 rounded-xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                          12
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Documents
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {RETURN_DOCUMENTS_LIST.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <div>
                              <strong className="text-xs font-medium block text-foreground">{doc.name}</strong>
                              <span className="text-[10px] text-muted-foreground font-mono">{doc.id}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded font-semibold",
                              doc.status === "Uploaded"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            )}>
                              {doc.status}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground"
                              onClick={() => toast.success(`Downloading ${doc.id}`)}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-right">
                    <Button
                      variant="link"
                      className="text-xs text-blue-600 h-auto p-0 font-medium"
                      onClick={() => toast.info("Viewing all return documents")}
                    >
                      View All Documents →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
      </div>

      {/* MODALS */}
      {/* 1. New Return Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Return Request</DialogTitle>
            <DialogDescription>Initiate a customer or site return order.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label>Customer / Site Name</Label>
              <Input placeholder="Enter customer name" defaultValue="Industrial Solutions Pvt Ltd" className="h-8" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Return Type</Label>
                <select className="w-full h-8 px-2 border rounded text-xs bg-background">
                  <option>Warranty Return</option>
                  <option>Customer Return</option>
                  <option>Excess Material</option>
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select className="w-full h-8 px-2 border rounded text-xs bg-background">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Return Reason</Label>
              <Input placeholder="Enter primary return reason" defaultValue="Damaged Product in transit" className="h-8" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowRequestModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("Return Request created!"); setShowRequestModal(false); }}>
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Authorize Return Modal */}
      <Dialog open={showAuthorizeModal} onOpenChange={setShowAuthorizeModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Authorize Return (RMA)</DialogTitle>
            <DialogDescription>Validate eligibility and approve RMA generation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <div className="p-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              ✓ Order SO-2026-00918 verified. Active warranty verified until Feb 2028.
            </div>
            <div>
              <Label>RMA Number</Label>
              <Input value="RMA-2026-004821" readOnly className="h-8 font-mono bg-muted/20" />
            </div>
            <div>
              <Label>Return Conditions</Label>
              <Input defaultValue="Return in anti-static protective wrapping" className="h-8" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowAuthorizeModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("RMA Authorized & Released to Carrier!"); setShowAuthorizeModal(false); }}>
              Authorize RMA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Plan Pickup Modal */}
      <Dialog open={showPickupModal} onOpenChange={setShowPickupModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Plan Reverse Pickup</DialogTitle>
            <DialogDescription>Assign vehicle and field team for material collection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label>Pickup Location</Label>
              <Input defaultValue="Plot 42, Electronic City, Bengaluru" className="h-8" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Pickup Date</Label>
                <Input type="date" defaultValue="2026-04-26" className="h-8" />
              </div>
              <div>
                <Label>Assigned Vehicle</Label>
                <Input defaultValue="TN-04-AX-8819" className="h-8 font-mono" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowPickupModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("Pickup scheduled successfully!"); setShowPickupModal(false); }}>
              Schedule Pickup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Record Receipt Modal */}
      <Dialog open={showReceivingModal} onOpenChange={setShowReceivingModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Record Warehouse Receipt</DialogTitle>
            <DialogDescription>Log gate intake, unloading bay, and package counts.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label>Receipt Number</Label>
              <Input value="RR-2026-004821" readOnly className="h-8 font-mono bg-muted/20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Received Quantity</Label>
                <Input defaultValue="118" className="h-8 font-mono" />
              </div>
              <div>
                <Label>Outer Condition</Label>
                <select className="w-full h-8 px-2 border rounded text-xs bg-background">
                  <option>Intact / Good</option>
                  <option>Minor Crushing</option>
                  <option>Severe Damage</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowReceivingModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("Receipt recorded into warehouse registry!"); setShowReceivingModal(false); }}>
              Save Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Start Inspection Modal */}
      <Dialog open={showInspectionModal} onOpenChange={setShowInspectionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Inspection & Condition Grading</DialogTitle>
            <DialogDescription>Record QA test findings and assign return grade.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label>Condition Grade</Label>
              <select className="w-full h-8 px-2 border rounded text-xs bg-background font-bold">
                <option>Grade A - New / Resalable (100% Spec)</option>
                <option>Grade B - Minor Repair Required</option>
                <option>Grade C - Major Refurbishment</option>
                <option>Grade D - Parts Salvage Only</option>
                <option>Grade E - Certified Scrap / Dispose</option>
              </select>
            </div>
            <div>
              <Label>Technical Inspector Notes</Label>
              <Input defaultValue="Passed insulation resistance; sub-board PWM needs replacement" className="h-8" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowInspectionModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("Inspection grade recorded!"); setShowInspectionModal(false); }}>
              Save Grading
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Disposition Modal */}
      <Dialog open={showDispositionModal} onOpenChange={setShowDispositionModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Execute Disposition Routing</DialogTitle>
            <DialogDescription>Route return items to warehouse, workshop, or recycler.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label>Target Action</Label>
              <select className="w-full h-8 px-2 border rounded text-xs bg-background font-bold text-blue-600">
                <option>Restock to Available Inventory (Grade A)</option>
                <option>Route to Service Center Workshop (Grade B/C)</option>
                <option>Send to Component Salvage (Grade D)</option>
                <option>Route to Certified Safe Recycler (Grade E)</option>
              </select>
            </div>
            <div>
              <Label>Destination Location</Label>
              <Input defaultValue="Chennai Service Center Workshop Bay 2" className="h-8" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowDispositionModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("Disposition routing order dispatched!"); setShowDispositionModal(false); }}>
              Confirm Disposition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. Create Repair Order Modal */}
      <Dialog open={showRepairModal} onOpenChange={setShowRepairModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create Repair Work Order</DialogTitle>
            <DialogDescription>Commission refurbishment for Grade B/C return items.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label>Work Order Reference</Label>
              <Input value="RO-2026-001928" readOnly className="h-8 font-mono bg-muted/20" />
            </div>
            <div>
              <Label>Assigned Technician</Label>
              <Input defaultValue="Suresh Babu (Senior Electrical Tech)" className="h-8" />
            </div>
            <div>
              <Label>Estimated Repair Cost</Label>
              <Input defaultValue="₹ 45,200" className="h-8 font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowRepairModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("Repair Work Order generated!"); setShowRepairModal(false); }}>
              Create Work Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Create Credit Note Modal */}
      <Dialog open={showCreditModal} onOpenChange={setShowCreditModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Issue Credit Note</DialogTitle>
            <DialogDescription>Authorize customer financial settlement and ERP ledger credit.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label>Credit Note Number</Label>
              <Input value="CN-2026-007512" readOnly className="h-8 font-mono bg-muted/20" />
            </div>
            <div>
              <Label>Net Approved Credit</Label>
              <Input defaultValue="₹ 15,63,200" readOnly className="h-8 font-mono font-bold text-emerald-600 bg-muted/20" />
            </div>
            <div>
              <Label>Customer Ledger Account</Label>
              <Input value="Industrial Solutions Pvt Ltd (CUST-IND-901)" readOnly className="h-8 bg-muted/20" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowCreditModal(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { toast.success("Credit Note CN-2026-007512 posted to Accounts Receivable!"); setShowCreditModal(false); }}>
              Post Credit Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 9. Analytics Modal */}
      <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reverse Logistics KPI Control Tower</DialogTitle>
            <DialogDescription>Operational efficiency and recovery metrics.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-xs py-2">
            <div className="flex justify-between p-2 rounded bg-muted/20"><span>Total Return Value Recovered:</span><strong className="font-mono text-emerald-600">₹ 18,45,200</strong></div>
            <div className="flex justify-between p-2 rounded bg-muted/20"><span>Net Recovery Rate:</span><strong className="font-mono text-blue-600">92.4%</strong></div>
            <div className="flex justify-between p-2 rounded bg-muted/20"><span>Restocking Velocity:</span><strong className="font-mono">42% within 48h</strong></div>
            <div className="flex justify-between p-2 rounded bg-muted/20"><span>Customer Dispute Rate:</span><strong className="font-mono text-emerald-600">0.2%</strong></div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowAnalyticsModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

