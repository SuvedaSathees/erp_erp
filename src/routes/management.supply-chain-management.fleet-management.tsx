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

export const Route = createFileRoute("/management/supply-chain-management/fleet-management")({
  head: () => ({
    meta: [
      { title: "Fleet Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "End-to-end fleet lifecycle management, allocation, maintenance, fuel control, driver tracking, and telematics analytics.",
      },
    ],
  }),
  component: FleetPage,
});

// --- SAMPLE DATA ---
const FUEL_COST_TREND_DATA = [
  { day: "1 Apr", cost: 35000 },
  { day: "6 Apr", cost: 42000 },
  { day: "11 Apr", cost: 38000 },
  { day: "16 Apr", cost: 48000 },
  { day: "21 Apr", cost: 44000 },
  { day: "26 Apr", cost: 52000 },
];

const RECENT_TRIPS_DATA = [
  {
    id: "TRP-2026-00482",
    source: "Chennai DC",
    destination: "Bengaluru WH",
    distance: "385",
    date: "26 Apr 2026",
    status: "In Transit",
  },
  {
    id: "TRP-2026-00475",
    source: "Bengaluru WH",
    destination: "Chennai DC",
    distance: "385",
    date: "22 Apr 2026",
    status: "Completed",
  },
  {
    id: "TRP-2026-00462",
    source: "Chennai DC",
    destination: "Hosur Plant",
    distance: "75",
    date: "18 Apr 2026",
    status: "Completed",
  },
  {
    id: "TRP-2026-00455",
    source: "Hosur Plant",
    destination: "Mysuru Site",
    distance: "128",
    date: "15 Apr 2026",
    status: "Completed",
  },
  {
    id: "TRP-2026-00448",
    source: "Chennai DC",
    destination: "Coimbatore DC",
    distance: "512",
    date: "12 Apr 2026",
    status: "Completed",
  },
];

const COMPLIANCE_DOCS = [
  { doc: "Registration Certificate", validTill: "14 Jan 2029", status: "Valid" },
  { doc: "Insurance", validTill: "14 Jan 2025", status: "Valid" },
  { doc: "Fitness Certificate", validTill: "28 Feb 2025", status: "Expiring Soon" },
  { doc: "Road Tax", validTill: "31 Dec 2025", status: "Valid" },
  { doc: "Pollution Certificate", validTill: "15 Sep 2024", status: "Expiring Soon" },
];

const INSPECTION_ITEMS = [
  { item: "Engine & Transmission", status: "Pass" },
  { item: "Brakes & Air Pressure", status: "Pass" },
  { item: "Tyres Tread & Pressure", status: "Pass" },
  { item: "Battery Voltage & Terminals", status: "Pass" },
  { item: "Headlights & Signals", status: "Pass" },
  { item: "GPS Device Connectivity", status: "Pass" },
  { item: "Fuel System & Tank Leakage", status: "Pass" },
  { item: "Safety Equipment & Fire Extinguisher", status: "Pass" },
  { item: "Body & Cabin Condition", status: "Pass" },
  { item: "Driver Documents & Permits", status: "Valid" },
];

function FleetPage() {
  // Header State
  const [fleetId] = useState("FLT-2026-00128");
  const [vehicleId] = useState("VEH-2026-00458");
  const [vehicleNumber, setVehicleNumber] = useState("KA-04-E-4521");
  const [fleetCategory, setFleetCategory] = useState("Heavy Commercial Vehicle");
  const [ownershipType, setOwnershipType] = useState("Company Owned");
  const [businessUnit, setBusinessUnit] = useState("Magnertia Manufacturing");
  const [fleetManager, setFleetManager] = useState("Gurpreet Singh");
  const [vehicleStatus, setVehicleStatus] = useState("On Trip");
  const [gpsStatus] = useState("● Online");
  const [priority, setPriority] = useState("High");
  const [regDate, setRegDate] = useState("2024-01-15");
  const [insuranceDate, setInsuranceDate] = useState("2025-01-14");

  // Modals State
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [showPlanTripModal, setShowPlanTripModal] = useState(false);
  const [showTrackLiveModal, setShowTrackLiveModal] = useState(false);
  const [showFuelEntryModal, setShowFuelEntryModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  // Form states for dialogs
  const [fuelQuantity, setFuelQuantity] = useState("120");
  const [fuelRate, setFuelRate] = useState("92.50");
  const [odometerReading, setOdometerReading] = useState("84640");

  const fuelCost = useMemo(() => {
    const qty = parseFloat(fuelQuantity) || 0;
    const rate = parseFloat(fuelRate) || 0;
    return (qty * rate).toFixed(2);
  }, [fuelQuantity, fuelRate]);

  return (
    <AppShell
      title="Fleet Management"
      breadcrumb="Management"
      description="Manage the complete lifecycle of company-owned, leased, and contracted vehicles, maintenance, and GPS tracking."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="fleet-management"
    >
      <div className="space-y-6">
        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active Vehicle:</span>
            <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5 border-primary/20">
              {vehicleNumber}
            </Badge>
            <Badge className="bg-blue-500/15 text-blue-800 dark:text-blue-300 font-semibold border border-blue-200 text-xs">
              <Truck className="h-3 w-3 mr-1 inline" />
              {vehicleStatus}
            </Badge>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
              GPS Online
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => toast.info("Changes reset")}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => toast.success("Draft saved to fleet registry")}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Save Draft
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              onClick={() => toast.success("Fleet Record Verified and Active")}
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
                <DropdownMenuLabel>Fleet Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowAddVehicleModal(true)}>
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Register New Vehicle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5 mr-2" />
                  Print Vehicle Card
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowInspectionModal(true)}>
                  <CheckSquare className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                  Record Inspection
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Running AI fleet diagnostics...")}>
                  <Sparkles className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                  AI Predictive Health
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
          {/* TOP 2 CARDS: 1. Fleet Header & 2. Fleet Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. FLEET HEADER (7 Cols) */}
            <div className="lg:col-span-7 bg-card rounded-xl border border-border shadow-xs p-5 relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                    1
                  </span>
                  <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                    Fleet Header
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
                    onClick={() => toast.info("Fleet Header edit mode active")}
                  >
                    <Edit className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Fleet ID</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value={fleetId} readOnly className="h-8 text-xs font-mono font-medium bg-muted/30" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Vehicle ID</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Input value={vehicleId} readOnly className="h-8 text-xs font-mono font-medium bg-muted/30" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Vehicle Number</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <Input
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Fleet Category</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={fleetCategory}
                    onChange={(e) => setFleetCategory(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none"
                  >
                    <option value="Heavy Commercial Vehicle">Heavy Commercial Vehicle</option>
                    <option value="Medium Commercial Vehicle">Medium Commercial Vehicle</option>
                    <option value="Light Commercial Vehicle">Light Commercial Vehicle</option>
                    <option value="Multi-Axle Truck">Multi-Axle Truck</option>
                    <option value="Refrigerated Truck">Refrigerated Truck</option>
                    <option value="Electric Vehicle">Electric Vehicle</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Ownership Type</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <select
                    value={ownershipType}
                    onChange={(e) => setOwnershipType(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background focus:outline-none"
                  >
                    <option value="Company Owned">Company Owned</option>
                    <option value="Leased">Leased</option>
                    <option value="Rented">Rented</option>
                    <option value="Contracted">Contracted</option>
                    <option value="Employee Owned">Employee Owned</option>
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
                    <Label className="text-muted-foreground font-medium text-[11px]">Fleet Manager</Label>
                    <span className="text-[9px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1 rounded font-mono">M</span>
                  </div>
                  <Input value={fleetManager} onChange={(e) => setFleetManager(e.target.value)} className="h-8 text-xs" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Vehicle Status</Label>
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-1 rounded font-mono">W</span>
                  </div>
                  <Badge className="h-8 w-full justify-center text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {vehicleStatus}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">GPS Status</Label>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 rounded font-mono">A</span>
                  </div>
                  <Badge variant="outline" className="h-8 w-full justify-center text-xs font-semibold text-emerald-600 border-emerald-300 dark:border-emerald-800">
                    {gpsStatus}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Priority</Label>
                    <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1 rounded font-mono">C</span>
                  </div>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background font-medium text-amber-600 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Registration Date</Label>
                    <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1 rounded font-mono">C</span>
                  </div>
                  <Input type="date" value={regDate} onChange={(e) => setRegDate(e.target.value)} className="h-8 text-xs" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-muted-foreground font-medium text-[11px]">Insurance Valid Till</Label>
                    <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1 rounded font-mono">C</span>
                  </div>
                  <Input type="date" value={insuranceDate} onChange={(e) => setInsuranceDate(e.target.value)} className="h-8 text-xs" />
                </div>
              </div>
            </div>

            {/* 2. FLEET STATUS OVERVIEW (5 Cols - 6 Cards) */}
            <div className="lg:col-span-5 bg-card rounded-xl border border-border shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                      2
                    </span>
                    <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                      Fleet Status Overview
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">FY 2026-27</span>
                </div>

                {/* 6 KPI Cards Grid */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  {/* Total Fleet */}
                  <div className="p-3 rounded-lg border border-border/80 bg-background/50 hover:border-primary/40 transition-colors">
                    <div className="flex justify-center mb-1 text-blue-600">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Total Fleet</span>
                    <div className="text-lg font-bold text-foreground mt-0.5">128</div>
                    <span className="text-[9px] text-muted-foreground block">All Vehicles</span>
                  </div>

                  {/* Active */}
                  <div className="p-3 rounded-lg border border-border/80 bg-background/50 hover:border-emerald-500/40 transition-colors">
                    <div className="flex justify-center mb-1 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Active</span>
                    <div className="text-lg font-bold text-foreground mt-0.5">96</div>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium block">75.00%</span>
                  </div>

                  {/* On Trip */}
                  <div className="p-3 rounded-lg border border-border/80 bg-background/50 hover:border-blue-500/40 transition-colors">
                    <div className="flex justify-center mb-1 text-blue-600">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium block">On Trip</span>
                    <div className="text-lg font-bold text-foreground mt-0.5">58</div>
                    <span className="text-[9px] text-blue-600 dark:text-blue-400 font-medium block">45.31%</span>
                  </div>

                  {/* Under Maint. */}
                  <div className="p-3 rounded-lg border border-border/80 bg-background/50 hover:border-amber-500/40 transition-colors">
                    <div className="flex justify-center mb-1 text-amber-500">
                      <Wrench className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Under Maint.</span>
                    <div className="text-lg font-bold text-foreground mt-0.5">12</div>
                    <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium block">9.38%</span>
                  </div>

                  {/* Idle */}
                  <div className="p-3 rounded-lg border border-border/80 bg-background/50 hover:border-purple-500/40 transition-colors">
                    <div className="flex justify-center mb-1 text-purple-500">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Idle</span>
                    <div className="text-lg font-bold text-foreground mt-0.5">18</div>
                    <span className="text-[9px] text-purple-600 dark:text-purple-400 font-medium block">14.06%</span>
                  </div>

                  {/* Unavailable */}
                  <div className="p-3 rounded-lg border border-border/80 bg-background/50 hover:border-red-500/40 transition-colors">
                    <div className="flex justify-center mb-1 text-red-500">
                      <X className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium block">Unavailable</span>
                    <div className="text-lg font-bold text-foreground mt-0.5">8</div>
                    <span className="text-[9px] text-red-600 dark:text-red-400 font-medium block">6.25%</span>
                  </div>
                </div>
              </div>

              {/* Status workflow mini banner */}
              <div className="mt-3 pt-2 border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Workflow: Registered → Active → Assigned → On Trip → Returned</span>
                <span className="font-semibold text-emerald-600">Compliance 98.2%</span>
              </div>
            </div>
          </div>

          {/* FLEET MANAGEMENT WORKSPACE */}
          <div className="space-y-6">
              {/* ROW 1: (3. Vehicle Summary) + (4. Capacity & Utilization) + (5. Live GPS Tracking) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* 3. VEHICLE SUMMARY (4 Cols) */}
                <div className="md:col-span-4 bg-card rounded-xl border border-border shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                          3
                        </span>
                        <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                          Vehicle Summary
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[10px]">Tata Prima</Badge>
                    </div>

                    {/* Vehicle Telematics Status Container */}
                    <div className="relative mb-3 rounded-lg border border-border/80 bg-gradient-to-br from-blue-50/60 via-background to-muted/40 p-3.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Truck className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-mono font-bold text-xs text-foreground block">KA-04-E-4521</span>
                            <span className="text-[10px] text-muted-foreground">Tata Prima 5530.S (40 Ton)</span>
                          </div>
                        </div>
                        <Badge className="bg-blue-600 text-white text-[10px] font-semibold gap-1">
                          <Activity className="h-3 w-3" /> On Trip
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2.5 mt-2.5 border-t text-[11px] font-mono">
                        <div><span className="text-[9px] text-muted-foreground block font-sans">Speed</span><strong className="text-foreground">58 km/h</strong></div>
                        <div><span className="text-[9px] text-muted-foreground block font-sans">Odometer</span><strong className="text-foreground">48,290 km</strong></div>
                        <div><span className="text-[9px] text-muted-foreground block font-sans">Fuel Level</span><strong className="text-emerald-600">76% (380L)</strong></div>
                      </div>
                    </div>

                    {/* Spec Key-Value table */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Make / Model</span>
                        <strong className="text-foreground">Tata Prima 5530.S</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Vehicle Type</span>
                        <span className="text-foreground">Heavy Commercial Vehicle</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Fuel Type</span>
                        <span className="text-foreground font-medium">Diesel</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Manufacturing Year</span>
                        <span className="text-foreground font-mono">2023</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Engine Number</span>
                        <span className="text-foreground font-mono">ENG987654321</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Chassis Number</span>
                        <span className="text-foreground font-mono">CHS123456789</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Current Odometer</span>
                        <strong className="text-foreground font-mono">84,520 KM</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Load Capacity</span>
                        <strong className="text-primary font-mono">25,000 KG</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Seating Capacity</span>
                        <span className="text-foreground">2</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/40">
                        <span className="text-muted-foreground">Purchase Date</span>
                        <span className="text-foreground">15 Jan 2024</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Purchase Cost</span>
                        <strong className="text-foreground font-mono">₹ 32,50,000</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. CAPACITY & UTILIZATION (4 Cols) */}
                <div className="md:col-span-4 bg-card rounded-xl border border-border shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                          4
                        </span>
                        <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                          Capacity & Utilization
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                        Optimal
                      </Badge>
                    </div>

                    {/* Donut Gauge */}
                    <div className="flex items-center justify-center py-2">
                      <div className="relative w-36 h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Current Load", value: 18400, fill: "#10b981" },
                                { name: "Available Capacity", value: 6600, fill: "#e2e8f0" },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={46}
                              outerRadius={62}
                              startAngle={90}
                              endAngle={-270}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#cbd5e1" className="dark:fill-slate-700" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xl font-extrabold text-foreground">73.6%</span>
                          <span className="text-[10px] text-muted-foreground">Utilization</span>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Specs */}
                    <div className="space-y-2 mt-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="text-muted-foreground">Maximum Capacity</span>
                        <strong className="font-mono text-foreground">25,000 KG</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="text-muted-foreground">Current Load</span>
                        <strong className="font-mono text-emerald-600">18,400 KG</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="text-muted-foreground">Available Capacity</span>
                        <strong className="font-mono text-blue-600">6,600 KG</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/50">
                        <span className="text-muted-foreground">Capacity Utilization</span>
                        <strong className="font-mono text-foreground font-bold">73.6%</strong>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-border/50">
                        <span className="text-muted-foreground">Overload Status</span>
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
                          Normal
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">Capacity Status</span>
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-300">
                          Available
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. LIVE GPS TRACKING (4 Cols) */}
                <div className="md:col-span-4 bg-card rounded-xl border border-border shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                          5
                        </span>
                        <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                          Live GPS Tracking
                        </h3>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                        Live
                      </span>
                    </div>

                    {/* Interactive GPS SVG Canvas */}
                    <div className="bg-slate-900 rounded-lg p-2.5 relative h-36 flex flex-col justify-between overflow-hidden shadow-inner border border-slate-800 mb-3">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 140">
                        <line x1="0" y1="35" x2="280" y2="35" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                        <line x1="0" y1="70" x2="280" y2="70" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                        <line x1="0" y1="105" x2="280" y2="105" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                        <line x1="70" y1="0" x2="70" y2="140" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                        <line x1="140" y1="0" x2="140" y2="140" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                        <line x1="210" y1="0" x2="210" y2="140" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

                        {/* Route from Chennai to Bangalore */}
                        <path
                          d="M 255 110 Q 190 95 140 70 T 50 35"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />

                        {/* Origin & Destination */}
                        <circle cx="255" cy="110" r="4" fill="#10b981" />
                        <text x="225" y="125" fill="#e2e8f0" fontSize="8" fontWeight="bold">Chennai</text>

                        <circle cx="50" cy="35" r="4" fill="#ef4444" />
                        <text x="25" y="28" fill="#e2e8f0" fontSize="8" fontWeight="bold">Bengaluru</text>

                        {/* Moving Vehicle */}
                        <circle cx="140" cy="70" r="8" fill="#3b82f6" opacity="0.4">
                          <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="140" cy="70" r="4.5" fill="#3b82f6" />
                      </svg>
                      <div className="flex justify-between items-center text-[10px] text-slate-300 z-10">
                        <span className="font-semibold text-blue-400">NH-44 Corridor</span>
                        <span className="font-mono text-emerald-400">Speed: 58 KM/H</span>
                      </div>
                    </div>

                    {/* Telematics stats */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-0.5 border-b border-border/50">
                        <span className="text-muted-foreground">Current Location</span>
                        <span className="font-medium text-foreground">Hosur Road, Tamil Nadu</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/50">
                        <span className="text-muted-foreground">Current Speed</span>
                        <strong className="font-mono text-emerald-600">58 KM/H</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/50">
                        <span className="text-muted-foreground">Distance Covered Today</span>
                        <strong className="font-mono">248 KM</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/50">
                        <span className="text-muted-foreground">Remaining Distance</span>
                        <strong className="font-mono text-amber-600">137 KM</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-border/50">
                        <span className="text-muted-foreground">Estimated Arrival</span>
                        <span className="font-bold text-foreground bg-primary/10 px-1.5 py-0.5 rounded text-[11px]">
                          Today 07:30 PM
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-border/50">
                        <span className="text-muted-foreground">Engine Status</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          ● Running
                        </span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="text-muted-foreground font-mono">Today 01:25 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2: (6. Driver Details) + (7. Trip Details) + (8. Maintenance Overview) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* 6. DRIVER DETAILS (4 Cols) */}
                <div className="md:col-span-4 bg-card rounded-xl border border-border shadow-xs p-5">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                        6
                      </span>
                      <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                        Driver Details
                      </h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">
                      On Duty
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950/60 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-base font-mono shrink-0 shadow-xs">
                      MS
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Manpreet Singh</h4>
                      <span className="text-[11px] text-muted-foreground font-mono">ID: DRV-00078 · Heavy Vehicle (HMV)</span>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Phone className="h-3 w-3 text-primary" /> +91 98112 33490
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">License Number</span>
                      <strong className="font-mono text-foreground">KA0120120012345</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">License Category</span>
                      <span className="font-medium text-foreground">HC (Heavy Commercial)</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">License Valid Till</span>
                      <strong className="text-foreground">15 Feb 2027</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="text-foreground">8 Years (Safe Driver Rating 4.9★)</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-muted-foreground">Driver Status</span>
                      <span className="font-semibold text-emerald-600">On Duty</span>
                    </div>
                  </div>
                </div>

                {/* 7. TRIP DETAILS (4 Cols) */}
                <div className="md:col-span-4 bg-card rounded-xl border border-border shadow-xs p-5">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                        7
                      </span>
                      <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                        Trip Details
                      </h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700">
                      In Transit
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Trip Number</span>
                      <strong className="font-mono text-primary font-bold">TRP-2026-00482</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Trip Type</span>
                      <span className="font-medium text-foreground">Outward Trip</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Source</span>
                      <span className="text-foreground">Chennai DC</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Destination</span>
                      <span className="text-foreground font-medium">Bengaluru Warehouse</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Planned Departure</span>
                      <span className="font-mono text-foreground">26 Apr 2026 10:00 AM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Actual Departure</span>
                      <span className="font-mono text-foreground">26 Apr 2026 10:15 AM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Planned Arrival</span>
                      <span className="font-mono text-foreground">26 Apr 2026 07:30 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">Trip Status</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        In Transit
                      </span>
                    </div>
                  </div>
                </div>

                {/* 8. MAINTENANCE OVERVIEW (4 Cols) */}
                <div className="md:col-span-4 bg-card rounded-xl border border-border shadow-xs p-5">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                        8
                      </span>
                      <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                        Maintenance Overview
                      </h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
                      Up To Date
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border/50 mb-3">
                    <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 flex items-center justify-center">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Health Status</span>
                      <strong className="text-xs font-bold text-foreground">Preventive Schedule Active</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Last Maintenance</span>
                      <span className="font-mono text-foreground">10 Apr 2026</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Next Maintenance Date</span>
                      <strong className="font-mono text-primary">10 May 2026</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Next Service Odometer</span>
                      <strong className="font-mono text-foreground">90,000 KM</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Maintenance Status</span>
                      <span className="font-semibold text-emerald-600">Up To Date</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-border/40">
                      <span className="text-muted-foreground">Maintenance Cost (YTD)</span>
                      <strong className="font-mono text-foreground">₹ 28,450</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-muted-foreground">Open Maintenance</span>
                      <span className="font-bold text-amber-600 font-mono">1 (Tyre Rotation)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 3: (9. Recent Trips) & (10. Fuel Summary This Month) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* 9. RECENT TRIPS (6 Cols) */}
                <div className="md:col-span-6 bg-card rounded-xl border border-border shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                          9
                        </span>
                        <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                          Recent Trips
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        5 Logged
                      </Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                          <tr>
                            <th className="py-2 px-2.5">Trip Number</th>
                            <th className="py-2 px-2.5">Source</th>
                            <th className="py-2 px-2.5">Destination</th>
                            <th className="py-2 px-2.5 text-right">Distance (KM)</th>
                            <th className="py-2 px-2.5">Trip Date</th>
                            <th className="py-2 px-2.5 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {RECENT_TRIPS_DATA.map((t) => (
                            <tr key={t.id} className="hover:bg-muted/30">
                              <td className="py-2 px-2.5 font-mono text-primary font-medium">{t.id}</td>
                              <td className="py-2 px-2.5 text-foreground">{t.source}</td>
                              <td className="py-2 px-2.5 text-foreground">{t.destination}</td>
                              <td className="py-2 px-2.5 text-right font-mono font-medium">{t.distance}</td>
                              <td className="py-2 px-2.5 text-muted-foreground">{t.date}</td>
                              <td className="py-2 px-2.5 text-center">
                                <span
                                  className={cn(
                                    "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                                    t.status === "In Transit"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
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

                  <div className="mt-3 pt-2 border-t border-border/50 flex justify-end">
                    <button
                      onClick={() => setActiveTab("trips")}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      View All Trips <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* 10. FUEL SUMMARY (THIS MONTH) (6 Cols) */}
                <div className="md:col-span-6 bg-card rounded-xl border border-border shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                          10
                        </span>
                        <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                          Fuel Summary (This Month)
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-primary"
                        onClick={() => setShowFuelEntryModal(true)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Fuel
                      </Button>
                    </div>

                    {/* 4 Fuel KPI Tiles */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                      <div className="p-2.5 rounded-lg border border-border/80 bg-background/50">
                        <span className="text-[10px] text-muted-foreground block">Total Fuel (Ltr)</span>
                        <div className="text-base font-bold text-foreground font-mono">2,450.00</div>
                        <span className="text-[9px] text-emerald-600 font-medium">↑ 8%</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-border/80 bg-background/50">
                        <span className="text-[10px] text-muted-foreground block">Total Fuel Cost</span>
                        <div className="text-base font-bold text-foreground font-mono">₹ 2,18,450</div>
                        <span className="text-[9px] text-emerald-600 font-medium">↑ 3%</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-border/80 bg-background/50">
                        <span className="text-[10px] text-muted-foreground block">Avg. Efficiency</span>
                        <div className="text-base font-bold text-emerald-600 font-mono">4.8 KM/L</div>
                        <span className="text-[9px] text-emerald-600 font-medium">↑ 5%</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-border/80 bg-background/50">
                        <span className="text-[10px] text-muted-foreground block">Cost per KM</span>
                        <div className="text-base font-bold text-foreground font-mono">₹ 28.45</div>
                        <span className="text-[9px] text-emerald-600 font-medium">↓ 2%</span>
                      </div>
                    </div>

                    {/* Fuel Cost Trend Line Chart */}
                    <div className="h-28 w-full">
                      <span className="text-[10px] text-muted-foreground font-medium block mb-1">
                        Fuel Cost Trend (₹)
                      </span>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={FUEL_COST_TREND_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                          <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip formatter={(val: any) => `₹ ${val.toLocaleString()}`} />
                          <Line
                            type="monotone"
                            dataKey="cost"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "#3b82f6" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 4: (11. Document & Compliance) & (12. Quick Actions) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* 11. DOCUMENT & COMPLIANCE (6 Cols) */}
                <div className="md:col-span-6 bg-card rounded-xl border border-border shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                          11
                        </span>
                        <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                          Document & Compliance
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        2 Expiring Soon
                      </Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                          <tr>
                            <th className="py-2 px-3">Document</th>
                            <th className="py-2 px-3">Valid Till</th>
                            <th className="py-2 px-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {COMPLIANCE_DOCS.map((d) => (
                            <tr key={d.doc} className="hover:bg-muted/30">
                              <td className="py-2 px-3 font-medium text-foreground">{d.doc}</td>
                              <td className="py-2 px-3 font-mono text-muted-foreground">{d.validTill}</td>
                              <td className="py-2 px-3 text-center">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-semibold",
                                    d.status === "Valid"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  )}
                                >
                                  {d.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border/50 flex justify-end">
                    <button
                      onClick={() => setShowDocumentsModal(true)}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      View All Documents <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* 12. QUICK ACTIONS (6 Cols - 9 Tile Grid) */}
                <div className="md:col-span-6 bg-card rounded-xl border border-border shadow-xs p-5">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-bold">
                        12
                      </span>
                      <h3 className="font-semibold text-sm tracking-wide text-foreground uppercase">
                        Quick Actions
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground">Fleet Operations</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {/* 1. Allocate Vehicle */}
                    <button
                      onClick={() => setShowAllocateModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all text-center group"
                    >
                      <Truck className="h-5 w-5 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-foreground">Allocate Vehicle</span>
                    </button>

                    {/* 2. Assign Driver */}
                    <button
                      onClick={() => setShowAssignDriverModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all text-center group"
                    >
                      <Users className="h-5 w-5 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-foreground">Assign Driver</span>
                    </button>

                    {/* 3. Plan Trip */}
                    <button
                      onClick={() => setShowPlanTripModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-purple-500 hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-all text-center group"
                    >
                      <Navigation className="h-5 w-5 text-purple-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-foreground">Plan Trip</span>
                    </button>

                    {/* 4. Track Live */}
                    <button
                      onClick={() => setShowTrackLiveModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all text-center group"
                    >
                      <Radio className="h-5 w-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-foreground">Track Live</span>
                    </button>

                    {/* 5. Fuel Entry */}
                    <button
                      onClick={() => setShowFuelEntryModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all text-center group"
                    >
                      <Fuel className="h-5 w-5 text-amber-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-foreground">Fuel Entry</span>
                    </button>

                    {/* 6. Maintenance */}
                    <button
                      onClick={() => setShowMaintenanceModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 transition-all text-center group"
                    >
                      <Wrench className="h-5 w-5 text-orange-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-foreground">Maintenance</span>
                    </button>

                    {/* 7. Inspection */}
                    <button
                      onClick={() => setShowInspectionModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-teal-500 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition-all text-center group"
                    >
                      <CheckSquare className="h-5 w-5 text-teal-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-foreground">Inspection</span>
                    </button>

                    {/* 8. Documents */}
                    <button
                      onClick={() => setShowDocumentsModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-rose-500 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-all text-center group"
                    >
                      <FileText className="h-5 w-5 text-rose-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-foreground">Documents</span>
                    </button>

                    {/* 9. Reports */}
                    <button
                      onClick={() => setShowReportsModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-cyan-500 hover:bg-cyan-50/30 dark:hover:bg-cyan-950/20 transition-all text-center group"
                    >
                      <FileSpreadsheet className="h-5 w-5 text-cyan-600 mb-1.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-foreground">Reports</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

        </div>

      {/* --- QUICK ACTION DIALOG MODALS --- */}

      {/* 1. Allocate Vehicle Modal */}
      <Dialog open={showAllocateModal} onOpenChange={setShowAllocateModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Allocate Vehicle to Transport Request</DialogTitle>
            <DialogDescription>Match load capacity and dispatch criteria.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Vehicle Number</Label>
              <Input value={vehicleNumber} readOnly className="h-8 text-xs bg-muted/40 font-mono" />
            </div>
            <div>
              <Label className="text-xs">Select Transport Request</Label>
              <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                <option>TRQ-2026-001245 (Chennai → Bengaluru)</option>
                <option>TRQ-2026-001246 (Hosur → Mysuru)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAllocateModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-blue-600 text-white" onClick={() => { setShowAllocateModal(false); toast.success("Vehicle allocated to trip"); }}>
              Confirm Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Assign Driver Modal */}
      <Dialog open={showAssignDriverModal} onOpenChange={setShowAssignDriverModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Assign Driver to Vehicle</DialogTitle>
            <DialogDescription>Verify license category and duty hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Select Certified Driver</Label>
              <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                <option>Manpreet Singh (DL-KA0120120012345 - Heavy Commerical)</option>
                <option>Suresh Patel (DL-TN0920150045612 - Heavy)</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Assignment Type</Label>
              <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                <option>Permanent</option>
                <option>Trip-Based</option>
                <option>Shift-Based</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAssignDriverModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-indigo-600 text-white" onClick={() => { setShowAssignDriverModal(false); toast.success("Driver assigned successfully"); }}>
              Assign Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Plan Trip Modal */}
      <Dialog open={showPlanTripModal} onOpenChange={setShowPlanTripModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create Fleet Trip Plan</DialogTitle>
            <DialogDescription>Configure route, destination, and schedule.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Origin</Label>
                <Input defaultValue="Chennai DC" className="h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Destination</Label>
                <Input defaultValue="Bengaluru Warehouse" className="h-8 text-xs" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Estimated Distance</Label>
              <Input defaultValue="385 KM" readOnly className="h-8 text-xs font-mono bg-muted/30" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPlanTripModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-purple-600 text-white" onClick={() => { setShowPlanTripModal(false); toast.success("Trip created & ready for dispatch"); }}>
              Generate Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Track Live Modal */}
      <Dialog open={showTrackLiveModal} onOpenChange={setShowTrackLiveModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Live Telematics Stream</DialogTitle>
            <DialogDescription>Vehicle {vehicleNumber} real-time sensor feed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-xs py-2">
            <div className="p-3 rounded border bg-blue-50/20 space-y-1.5">
              <div className="flex justify-between"><span>Current Coordinates:</span><strong className="font-mono">12.7409° N, 77.8253° E</strong></div>
              <div className="flex justify-between"><span>Speed:</span><strong className="font-mono text-emerald-600">58 KM/H</strong></div>
              <div className="flex justify-between"><span>Location:</span><strong className="font-mono">Hosur Road, Tamil Nadu</strong></div>
              <div className="flex justify-between"><span>Distance Covered:</span><strong className="font-mono">248 KM</strong></div>
              <div className="flex justify-between"><span>Remaining:</span><strong className="font-mono text-primary">137 KM</strong></div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowTrackLiveModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Fuel Entry Modal */}
      <Dialog open={showFuelEntryModal} onOpenChange={setShowFuelEntryModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Record Fuel Fill Entry</DialogTitle>
            <DialogDescription>Log fuel dispensed, odometer reading, and invoice.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Fuel Quantity (Ltr)</Label>
                <Input
                  type="number"
                  value={fuelQuantity}
                  onChange={(e) => setFuelQuantity(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div>
                <Label className="text-xs">Fuel Rate (₹/Ltr)</Label>
                <Input
                  type="number"
                  value={fuelRate}
                  onChange={(e) => setFuelRate(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Odometer (KM)</Label>
                <Input
                  type="number"
                  value={odometerReading}
                  onChange={(e) => setOdometerReading(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div>
                <Label className="text-xs">Total Cost (₹)</Label>
                <Input value={fuelCost} readOnly className="h-8 text-xs font-mono bg-muted/40 font-bold" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowFuelEntryModal(false)}>Cancel</Button>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => {
                setShowFuelEntryModal(false);
                toast.success("Fuel entry saved & mileage recalculated");
              }}
            >
              Save Fuel Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Maintenance Modal */}
      <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Schedule Vehicle Maintenance</DialogTitle>
            <DialogDescription>Log preventive service or corrective work order.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Maintenance Type</Label>
              <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                <option>Preventive Maintenance (90K KM)</option>
                <option>Tyre Rotation & Alignment</option>
                <option>Brake Pad Inspection</option>
                <option>Oil & Filter Change</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Estimated Cost (₹)</Label>
              <Input defaultValue="12500" className="h-8 text-xs font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowMaintenanceModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-orange-600 text-white" onClick={() => { setShowMaintenanceModal(false); toast.success("Maintenance Work Order WO-2026-088 created"); }}>
              Create Work Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. Inspection Modal */}
      <Dialog open={showInspectionModal} onOpenChange={setShowInspectionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Pre-Trip Vehicle Inspection Checklist</DialogTitle>
            <DialogDescription>Verify mechanical, electrical, and document readiness.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs max-h-60 overflow-y-auto pr-1">
            {INSPECTION_ITEMS.map((item) => (
              <div key={item.item} className="flex items-center justify-between p-1.5 rounded hover:bg-muted/30">
                <span className="text-foreground">{item.item}</span>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowInspectionModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-teal-600 text-white" onClick={() => { setShowInspectionModal(false); toast.success("Inspection passed & vehicle cleared for dispatch"); }}>
              Sign & Pass Inspection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Documents Modal */}
      <Dialog open={showDocumentsModal} onOpenChange={setShowDocumentsModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Upload Vehicle Document</DialogTitle>
            <DialogDescription>Upload insurance, fitness, permit or pollution certificate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Document Type</Label>
              <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                <option>Pollution Certificate (PUC)</option>
                <option>Fitness Certificate</option>
                <option>National Highway Permit</option>
                <option>Comprehensive Insurance</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Expiry Date</Label>
              <Input type="date" defaultValue="2025-09-15" className="h-8 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowDocumentsModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-rose-600 text-white" onClick={() => { setShowDocumentsModal(false); toast.success("Document uploaded & validity updated"); }}>
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 9. Reports Modal */}
      <Dialog open={showReportsModal} onOpenChange={setShowReportsModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Generate Fleet Reports</DialogTitle>
            <DialogDescription>Export vehicle performance, fuel or utilization report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <div className="p-2.5 rounded border hover:bg-muted/30 cursor-pointer flex justify-between" onClick={() => toast.success("Exporting Vehicle Utilization Report")}>
              <span>Vehicle Utilization & Downtime Report</span>
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div className="p-2.5 rounded border hover:bg-muted/30 cursor-pointer flex justify-between" onClick={() => toast.success("Exporting Fuel Efficiency Report")}>
              <span>Fuel Efficiency & Mileage Anomaly Log</span>
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div className="p-2.5 rounded border hover:bg-muted/30 cursor-pointer flex justify-between" onClick={() => toast.success("Exporting Maintenance Cost Register")}>
              <span>Maintenance & Repair Ledger (YTD)</span>
              <Download className="h-4 w-4 text-primary" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowReportsModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 10. Register Vehicle Modal */}
      <Dialog open={showAddVehicleModal} onOpenChange={setShowAddVehicleModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register New Fleet Vehicle</DialogTitle>
            <DialogDescription>Add a new company-owned or contracted vehicle to fleet.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Registration Number</Label>
                <Input placeholder="e.g. TN-01-CD-5678" className="h-8 text-xs font-mono" />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <select className="w-full h-8 px-2 rounded border text-xs bg-background">
                  <option>Heavy Commercial Vehicle</option>
                  <option>Medium Commercial Vehicle</option>
                  <option>Light Commercial Vehicle</option>
                  <option>Electric Truck</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAddVehicleModal(false)}>Cancel</Button>
            <Button size="sm" className="bg-blue-600 text-white" onClick={() => { setShowAddVehicleModal(false); toast.success("Vehicle registered into fleet database"); }}>
              Register Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default FleetPage;
