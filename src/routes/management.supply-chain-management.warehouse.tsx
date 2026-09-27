import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
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
  Flame,
  Snowflake,
  Shield,
  Navigation,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  RadialBarChart,
  RadialBar,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { SupplyChainManagementTabBar } from "@/components/erp/SupplyChainManagementTabBar";
import { CardHeader } from "@/components/erp/CardHeader";
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

export const Route = createFileRoute("/management/supply-chain-management/warehouse")({
  head: () => ({
    meta: [
      { title: "Warehouse Management Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise warehouse infrastructure, location & bin setup, capacity management, putaway, picking, packing, dispatch, and AI warehouse analytics.",
      },
    ],
  }),
  component: WarehousePage,
});

/* ===========================================================================
   Data Constants & Mock State for Warehouse Management
   =========================================================================== */

interface ZoneData {
  id: string;
  code: string;
  name: string;
  type: string;
  capacity: number; // in sq ft
  capacityUsed: number;
  utilization: number;
  itemsCount: number;
  status: "Active" | "Maintenance" | "Restricted";
}

const WAREHOUSE_ZONES: ZoneData[] = [
  {
    id: "ZN-01",
    code: "Z-FG",
    name: "Finished Goods Storage",
    type: "Finished Goods Storage",
    capacity: 16500,
    capacityUsed: 12850,
    utilization: 78,
    itemsCount: 412,
    status: "Active",
  },
  {
    id: "ZN-02",
    code: "Z-RM",
    name: "Raw Material Zone",
    type: "Raw Material Storage",
    capacity: 16000,
    capacityUsed: 10200,
    utilization: 64,
    itemsCount: 268,
    status: "Active",
  },
  {
    id: "ZN-03",
    code: "Z-FM",
    name: "Fast Moving Pick Zone",
    type: "Fast Moving Zone",
    capacity: 8300,
    capacityUsed: 4850,
    utilization: 58,
    itemsCount: 156,
    status: "Active",
  },
  {
    id: "ZN-04",
    code: "Z-QI",
    name: "Quality Inspection Staging",
    type: "Quality Inspection Zone",
    capacity: 5000,
    capacityUsed: 2100,
    utilization: 42,
    itemsCount: 102,
    status: "Active",
  },
  {
    id: "ZN-05",
    code: "Z-SP",
    name: "Spare Parts Storage",
    type: "Spare Parts Warehouse",
    capacity: 5000,
    capacityUsed: 1500,
    utilization: 30,
    itemsCount: 98,
    status: "Active",
  },
  {
    id: "ZN-06",
    code: "Z-RC",
    name: "Inbound Receiving Dock Area",
    type: "Receiving Zone",
    capacity: 4000,
    capacityUsed: 2200,
    utilization: 55,
    itemsCount: 64,
    status: "Active",
  },
  {
    id: "ZN-07",
    code: "Z-DP",
    name: "Outbound Dispatch Staging",
    type: "Dispatch Zone",
    capacity: 4500,
    capacityUsed: 3100,
    utilization: 69,
    itemsCount: 88,
    status: "Active",
  },
  {
    id: "ZN-08",
    code: "Z-HV",
    name: "High-Value Secured Cage",
    type: "High-Value Storage",
    capacity: 2500,
    capacityUsed: 1950,
    utilization: 78,
    itemsCount: 34,
    status: "Active",
  },
];

interface BinLocationData {
  id: string;
  code: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;
  type: string;
  capacity: number;
  occupied: number;
  status: "Available" | "Occupied" | "Reserved" | "Blocked";
}

const STORAGE_LOCATIONS: BinLocationData[] = [
  { id: "LOC-001", code: "Z-FG-A01-R01-S01-B01", zone: "Finished Goods", aisle: "A01", rack: "R01", shelf: "L1", bin: "B01", type: "Pallet Storage", capacity: 1000, occupied: 850, status: "Occupied" },
  { id: "LOC-002", code: "Z-FG-A01-R01-S02-B02", zone: "Finished Goods", aisle: "A01", rack: "R01", shelf: "L2", bin: "B02", type: "Pallet Storage", capacity: 1000, occupied: 720, status: "Occupied" },
  { id: "LOC-003", code: "Z-FG-A02-R03-S01-B01", zone: "Finished Goods", aisle: "A02", rack: "R03", shelf: "L1", bin: "B01", type: "Pallet Storage", capacity: 1000, occupied: 0, status: "Available" },
  { id: "LOC-004", code: "Z-RM-A04-R02-S03-B04", zone: "Raw Material", aisle: "A04", rack: "R02", shelf: "L3", bin: "B04", type: "Bulk Storage", capacity: 2500, occupied: 2100, status: "Occupied" },
  { id: "LOC-005", code: "Z-FM-A01-R01-S01-B01", zone: "Fast Moving", aisle: "A01", rack: "R01", shelf: "L1", bin: "B01", type: "Picking Location", capacity: 500, occupied: 450, status: "Occupied" },
  { id: "LOC-006", code: "Z-QI-A01-R01-S01-B01", zone: "Quality Staging", aisle: "A01", rack: "R01", shelf: "L1", bin: "B01", type: "Inspection Location", capacity: 600, occupied: 320, status: "Occupied" },
  { id: "LOC-007", code: "Z-DP-A01-R01-S01-B01", zone: "Dispatch Zone", aisle: "A01", rack: "R01", shelf: "L1", bin: "B01", type: "Dispatch Staging", capacity: 1500, occupied: 940, status: "Occupied" },
  { id: "LOC-008", code: "Z-HV-A01-R01-S01-B01", zone: "High-Value Cage", aisle: "A01", rack: "R01", shelf: "L1", bin: "B01", type: "Bin Storage", capacity: 400, occupied: 280, status: "Reserved" },
];

interface InboundRecord {
  id: string;
  type: string;
  supplier: string;
  poNumber: string;
  asn: string;
  expectedDate: string;
  receivedQty: string;
  status: "Received" | "In Progress" | "Pending" | "Cancelled";
  dock: string;
}

const RECENT_INBOUND_LIST: InboundRecord[] = [
  { id: "INB-2026-0098", type: "Purchase Receipt", supplier: "PowerTech Ltd.", poNumber: "PO-2026-0521", asn: "ASN-0521", expectedDate: "24 May 2026", receivedQty: "450 Units", status: "Received", dock: "Dock 01" },
  { id: "INB-2026-0097", type: "Purchase Receipt", supplier: "Voltix Components", poNumber: "PO-2026-0519", asn: "ASN-0519", expectedDate: "23 May 2026", receivedQty: "300 Units", status: "In Progress", dock: "Dock 02" },
  { id: "INB-2026-0096", type: "Purchase Receipt", supplier: "Electra Supplies", poNumber: "PO-2026-0517", asn: "ASN-0517", expectedDate: "22 May 2026", receivedQty: "600 Units", status: "Pending", dock: "Dock 03" },
  { id: "INB-2026-0095", type: "Transfer Receipt", supplier: "MaxVtronics Pune", poNumber: "PO-2026-0516", asn: "ASN-0516", expectedDate: "21 May 2026", receivedQty: "500 Units", status: "Received", dock: "Dock 01" },
  { id: "INB-2026-0094", type: "Purchase Receipt", supplier: "BrightEnergy Pvt Ltd.", poNumber: "PO-2026-0515", asn: "ASN-0515", expectedDate: "20 May 2026", receivedQty: "350 Units", status: "Cancelled", dock: "Dock 04" },
];

interface OutboundRecord {
  id: string;
  orderNumber: string;
  customer: string;
  dispatchDate: string;
  status: "Dispatched" | "In Transit" | "Delivered" | "Pending";
  quantity: string;
  vehicle: string;
}

const RECENT_OUTBOUND_LIST: OutboundRecord[] = [
  { id: "DSP-2026-0145", orderNumber: "SO-2026-0842", customer: "GreenCharge Solutions", dispatchDate: "24 May 2026", status: "Dispatched", quantity: "420 Units", vehicle: "DL-01-GA-3419" },
  { id: "DSP-2026-0144", orderNumber: "SO-2026-0841", customer: "EcoVolt Energy", dispatchDate: "24 May 2026", status: "In Transit", quantity: "380 Units", vehicle: "GJ-06-AX-8911" },
  { id: "DSP-2026-0143", orderNumber: "SO-2026-0840", customer: "Urban Mobility Ltd.", dispatchDate: "23 May 2026", status: "Delivered", quantity: "650 Units", vehicle: "AP-39-TK-5520" },
  { id: "DSP-2026-0142", orderNumber: "SO-2026-0839", customer: "PowerGrid Systems", dispatchDate: "23 May 2026", status: "Dispatched", quantity: "510 Units", vehicle: "HR-55-AN-1204" },
  { id: "DSP-2026-0141", orderNumber: "SO-2026-0838", customer: "FastCharge Retail", dispatchDate: "22 May 2026", status: "Pending", quantity: "460 Units", vehicle: "KA-05-AB-3392" },
];

interface PutawayTask {
  id: string;
  grn: string;
  item: string;
  quantity: number;
  sourceLoc: string;
  suggestedLoc: string;
  actualLoc: string;
  strategy: string;
  assignedTo: string;
  status: "Pending" | "In Progress" | "Completed";
}

const PUTAWAY_TASKS: PutawayTask[] = [
  { id: "PUT-2026-0012", grn: "GRN-2026-0442", item: "EVCH-60KW (Dual Gun Charger)", quantity: 120, sourceLoc: "Receiving Bay 01", suggestedLoc: "Z-FG-A01-R01-S01-B01", actualLoc: "Z-FG-A01-R01-S01-B01", strategy: "AI Optimized", assignedTo: "Vikram Jadhav", status: "Completed" },
  { id: "PUT-2026-0013", grn: "GRN-2026-0443", item: "PM-60KW (Power Module 60kW)", quantity: 80, sourceLoc: "Inspection Bay 02", suggestedLoc: "Z-RM-A04-R02-S03-B04", actualLoc: "-", strategy: "Zone-Based", assignedTo: "Suresh Patil", status: "In Progress" },
  { id: "PUT-2026-0014", grn: "GRN-2026-0444", item: "INV-30KW (AC Inverter 30kW)", quantity: 50, sourceLoc: "Receiving Bay 02", suggestedLoc: "Z-RM-A02-R01-S02-B01", actualLoc: "-", strategy: "FIFO", assignedTo: "Unassigned", status: "Pending" },
  { id: "PUT-2026-0015", grn: "GRN-2026-0445", item: "CBL-7M (Heavy CCS2 Cable 7m)", quantity: 200, sourceLoc: "Receiving Bay 03", suggestedLoc: "Z-FM-A01-R01-S01-B01", actualLoc: "-", strategy: "Fast Moving Priority", assignedTo: "Unassigned", status: "Pending" },
];

interface PickListRecord {
  id: string;
  orderRef: string;
  item: string;
  pickLocation: string;
  requiredQty: number;
  pickedQty: number;
  picker: string;
  strategy: string;
  status: "Draft" | "Assigned" | "Picking" | "Picked" | "Packing" | "Dispatched";
}

const PICK_LIST_RECORDS: PickListRecord[] = [
  { id: "PCK-2026-0081", orderRef: "SO-2026-0842", item: "EVCH-60KW Charger", pickLocation: "Z-FG-A01-R01-S01-B01", requiredQty: 25, pickedQty: 25, picker: "Rohan Deshmukh", strategy: "Wave Picking", status: "Picked" },
  { id: "PCK-2026-0082", orderRef: "SO-2026-0841", item: "CBL-7M CCS Cable", pickLocation: "Z-FM-A01-R01-S01-B01", requiredQty: 50, pickedQty: 35, picker: "Ajay Kulkarni", strategy: "Zone Picking", status: "Picking" },
  { id: "PCK-2026-0083", orderRef: "SO-2026-0840", item: "PM-60KW Power Module", pickLocation: "Z-RM-A04-R02-S03-B04", requiredQty: 15, pickedQty: 0, picker: "Prasad More", strategy: "FIFO", status: "Assigned" },
  { id: "PCK-2026-0084", orderRef: "SO-2026-0839", item: "INV-30KW Inverter", pickLocation: "Z-RM-A02-R01-S02-B01", requiredQty: 10, pickedQty: 0, picker: "Unassigned", strategy: "Batch Picking", status: "Draft" },
];

interface DockRecord {
  id: string;
  dockNumber: string;
  type: "Inbound Dock" | "Outbound Dock" | "Multi-Purpose Dock" | "Heavy Cargo Dock" | "Express Dock";
  currentVehicle: string;
  status: "Available" | "Occupied" | "Reserved" | "Under Maintenance";
  bookingTime: string;
}

const DOCK_RECORDS: DockRecord[] = [
  { id: "DK-01", dockNumber: "Dock 01", type: "Inbound Dock", currentVehicle: "DL-01-GA-3419 (Signa 4825)", status: "Occupied", bookingTime: "10:30 AM - 12:30 PM" },
  { id: "DK-02", dockNumber: "Dock 02", type: "Inbound Dock", currentVehicle: "GJ-06-AX-8911 (AL 4220)", status: "Occupied", bookingTime: "11:00 AM - 01:00 PM" },
  { id: "DK-03", dockNumber: "Dock 03", type: "Multi-Purpose Dock", currentVehicle: "None", status: "Available", bookingTime: "Free" },
  { id: "DK-04", dockNumber: "Dock 04", type: "Outbound Dock", currentVehicle: "AP-39-TK-5520 (Pro 6028)", status: "Occupied", bookingTime: "01:30 PM - 03:00 PM" },
  { id: "DK-05", dockNumber: "Dock 05", type: "Outbound Dock", currentVehicle: "HR-55-AN-1204 (BharatBenz)", status: "Reserved", bookingTime: "03:30 PM - 05:00 PM" },
  { id: "DK-06", dockNumber: "Dock 06", type: "Heavy Cargo Dock", currentVehicle: "None", status: "Under Maintenance", bookingTime: "Maintenance till 4 PM" },
];

/* ===========================================================================
   Component Definition
   =========================================================================== */

export function WarehousePage() {


  // Selected Warehouse State
  const [warehouseId, setWarehouseId] = useState("WH-2026-0001");
  const [warehouseCode, setWarehouseCode] = useState("WH-MAIN-001");
  const [warehouseName, setWarehouseName] = useState("Main Warehouse");
  const [warehouseType, setWarehouseType] = useState("Central Warehouse");
  const [businessUnit, setBusinessUnit] = useState("Electro Mobility");
  const [manager, setManager] = useState("Rajesh Varma");
  const [operationalStatus, setOperationalStatus] = useState("Operational");
  const [status, setStatus] = useState("Active");
  const [location, setLocation] = useState("Chennai, Tamil Nadu, India");
  const [contactNumber, setContactNumber] = useState("+91 98765 43210");
  const [email, setEmail] = useState("warehouse@electromobility.com");
  const [operatingHours, setOperatingHours] = useState("08:00 AM - 08:00 PM");
  const [createdDate] = useState("01 Apr 2026");
  const [createdBy] = useState("System");
  const [lastUpdated] = useState("24 May 2026 10:30 AM");
  const [updatedBy] = useState("Rajesh Varma");

  // Capacity metrics
  const totalArea = 50000;
  const storageArea = 42000;
  const usableArea = 42000;
  const usedCapacity = 32500;
  const availableCapacity = 17500;
  const utilizationPercent = 65;
  const totalPallets = 5000;
  const usedPallets = 3680;
  const availablePallets = 1320;

  // Modals state
  const [showNewWarehouseModal, setShowNewWarehouseModal] = useState(false);
  const [showInboundModal, setShowInboundModal] = useState(false);
  const [showPutawayModal, setShowPutawayModal] = useState(false);
  const [showPickModal, setShowPickModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showStockCountModal, setShowStockCountModal] = useState(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  const capacityChartData = [
    { name: "Used Capacity", value: 32500, color: "#3b82f6" },
    { name: "Available Capacity", value: 17500, color: "#10b981" },
  ];

  return (
    <AppShell
      title="Warehouse"
      breadcrumb="Management"
      description="Manage warehouse infrastructure, locations, storage capacity, and inbound/outbound operations efficiently."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="warehouse"
    >
      <div className="space-y-6">
        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active Warehouse:</span>
            <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5 border-primary/20">
              {warehouseId}
            </Badge>
            <Badge className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 text-xs">
              {operationalStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowNewWarehouseModal(true)}
              className="h-8 gap-1.5 bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Warehouse</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Warehouse edit mode enabled.")}
              className="h-8 gap-1.5 font-medium text-xs"
            >
              <Edit className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Edit</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("Warehouse operational telemetry & KPIs active.")}
              className="h-8 gap-1.5 font-medium text-xs"
            >
              <Gauge className="h-3.5 w-3.5 text-blue-600" />
              <span>View Analytics</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                  <span>More</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs">Warehouse Operations</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowInboundModal(true)} className="gap-2 text-xs cursor-pointer">
                  <ArrowDownToLine className="h-3.5 w-3.5 text-emerald-600" /> Inbound Receipt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPutawayModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Package className="h-3.5 w-3.5 text-blue-600" /> Create Putaway Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPickModal(true)} className="gap-2 text-xs cursor-pointer">
                  <ClipboardList className="h-3.5 w-3.5 text-purple-600" /> Generate Pick List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowTransferModal(true)} className="gap-2 text-xs cursor-pointer">
                  <ArrowLeftRight className="h-3.5 w-3.5 text-amber-600" /> Inter-Warehouse Transfer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowStockCountModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Scale className="h-3.5 w-3.5 text-red-600" /> Physical Stock Count
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()} className="gap-2 text-xs cursor-pointer">
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print Warehouse Card
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Warehouse Layout & Heatmap exported to PDF")} className="gap-2 text-xs cursor-pointer">
                  <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export Capacity Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* ===================================================================
            SECTION 1: TOP DUAL CARDS
            Left: Warehouse Information | Right: Warehouse Capacity
            =================================================================== */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* LEFT CARD: Warehouse Information */}
          <div className="card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground tracking-tight">Warehouse Information</h3>
                  <button
                    type="button"
                    title="Warehouse infrastructure identification details"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono font-bold text-primary bg-primary/5 border-primary/20">
                    {warehouseId}
                  </Badge>
                </div>
              </div>

              {/* Form Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Warehouse ID</span>
                  <div className="mt-1 font-mono font-medium text-foreground py-1">{warehouseId}</div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Warehouse Code *</span>
                  <div className="mt-1 font-mono font-bold text-primary py-1">{warehouseCode}</div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Warehouse Name *</span>
                  <div className="mt-1 font-semibold text-foreground py-1 truncate">{warehouseName}</div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Warehouse Type *</span>
                  <select
                    value={warehouseType}
                    onChange={(e) => setWarehouseType(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground"
                  >
                    <option>Central Warehouse</option>
                    <option>Main Warehouse</option>
                    <option>Regional Warehouse</option>
                    <option>Distribution Center</option>
                    <option>Manufacturing Warehouse</option>
                    <option>Raw Material Warehouse</option>
                    <option>Finished Goods Warehouse</option>
                    <option>Spare Parts Warehouse</option>
                    <option>Cold Storage</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Business Unit *</span>
                  <select
                    value={businessUnit}
                    onChange={(e) => setBusinessUnit(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground"
                  >
                    <option>Electro Mobility</option>
                    <option>Power Electronics</option>
                    <option>Industrial Systems</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Warehouse Manager *</span>
                  <select
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground"
                  >
                    <option>Rajesh Varma</option>
                    <option>Ashok Mehta</option>
                    <option>Anita Desai</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Operational Status</span>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {operationalStatus}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Status</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-emerald-700 font-semibold"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Restricted</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground block font-medium">Location *</span>
                  <div className="mt-1 flex items-center gap-1.5 text-foreground font-medium py-1">
                    <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Contact Number</span>
                  <div className="mt-1 flex items-center gap-1 text-foreground py-1 font-mono">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{contactNumber}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Operating Hours</span>
                  <div className="mt-1 flex items-center gap-1 text-foreground py-1 font-mono text-[11px]">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{operatingHours}</span>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <span className="text-[11px] text-muted-foreground block font-medium">Email</span>
                  <div className="mt-0.5 flex items-center gap-1 text-foreground font-mono text-xs">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="mt-4 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-muted-foreground">
              <div>
                <span className="block font-medium">Created Date</span>
                <span className="text-foreground font-mono">{createdDate}</span>
              </div>
              <div>
                <span className="block font-medium">Created By</span>
                <span className="text-foreground">{createdBy}</span>
              </div>
              <div>
                <span className="block font-medium">Last Updated</span>
                <span className="text-foreground font-mono">{lastUpdated}</span>
              </div>
              <div>
                <span className="block font-medium">Updated By</span>
                <span className="text-foreground">{updatedBy}</span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Warehouse Capacity */}
          <div className="card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-base text-foreground tracking-tight">Warehouse Capacity</h3>
                <button
                  type="button"
                  onClick={() => toast.info("Capacity metrics refreshed from IoT load sensors.")}
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  <span>View Details</span>
                  <RefreshCw className="h-3 w-3" />
                </button>
              </div>

              {/* 3x3 Metric Grid matching mockup */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {/* 1. Total Area */}
                <div className="p-3 rounded-lg border bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Total Area</span>
                    <div className="text-base font-bold font-mono text-foreground mt-0.5">50,000</div>
                    <span className="text-[10px] text-muted-foreground">Sq. Ft.</span>
                  </div>
                </div>

                {/* 2. Storage Area */}
                <div className="p-3 rounded-lg border bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Storage Area</span>
                    <div className="text-base font-bold font-mono text-foreground mt-0.5">42,000</div>
                    <span className="text-[10px] text-muted-foreground">Sq. Ft.</span>
                  </div>
                </div>

                {/* 3. Usable Area */}
                <div className="p-3 rounded-lg border bg-purple-50/40 dark:bg-purple-950/20 border-purple-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    <Boxes className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Usable Area</span>
                    <div className="text-base font-bold font-mono text-foreground mt-0.5">42,000</div>
                    <span className="text-[10px] text-muted-foreground">Sq. Ft.</span>
                  </div>
                </div>

                {/* 4. Capacity Utilization */}
                <div className="p-3 rounded-lg border bg-sky-50/40 dark:bg-sky-950/20 border-sky-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                    <Gauge className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Capacity Utilization</span>
                    <div className="text-base font-bold font-mono text-sky-600 mt-0.5">65%</div>
                    <span className="text-[10px] text-muted-foreground">Optimal Band</span>
                  </div>
                </div>

                {/* 5. Used Capacity */}
                <div className="p-3 rounded-lg border bg-amber-50/40 dark:bg-amber-950/20 border-amber-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Used Capacity</span>
                    <div className="text-base font-bold font-mono text-foreground mt-0.5">32,500</div>
                    <span className="text-[10px] text-muted-foreground">Sq. Ft.</span>
                  </div>
                </div>

                {/* 6. Available Capacity */}
                <div className="p-3 rounded-lg border bg-teal-50/40 dark:bg-teal-950/20 border-teal-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                    <Archive className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Available Capacity</span>
                    <div className="text-base font-bold font-mono text-teal-600 mt-0.5">17,500</div>
                    <span className="text-[10px] text-muted-foreground">Sq. Ft.</span>
                  </div>
                </div>

                {/* 7. Total Pallet Capacity */}
                <div className="p-3 rounded-lg border bg-rose-50/40 dark:bg-rose-950/20 border-rose-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Total Pallet Capacity</span>
                    <div className="text-base font-bold font-mono text-foreground mt-0.5">5,000</div>
                    <span className="text-[10px] text-muted-foreground">Pallets</span>
                  </div>
                </div>

                {/* 8. Used Pallets */}
                <div className="p-3 rounded-lg border bg-orange-50/40 dark:bg-orange-950/20 border-orange-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300">
                    <Boxes className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Used Pallets</span>
                    <div className="text-base font-bold font-mono text-foreground mt-0.5">3,680</div>
                    <span className="text-[10px] text-muted-foreground">Pallets</span>
                  </div>
                </div>

                {/* 9. Available Pallets */}
                <div className="p-3 rounded-lg border bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-100 flex items-start gap-2.5">
                  <div className="p-2 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Available Pallets</span>
                    <div className="text-base font-bold font-mono text-indigo-600 mt-0.5">1,320</div>
                    <span className="text-[10px] text-muted-foreground">Pallets</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Active Storage Zones: <strong className="text-foreground">12</strong></span>
              <span>Total Active Locations: <strong className="text-foreground">248 Bins</strong></span>
              <span className="text-primary font-semibold inline-flex items-center gap-1">
                Zone Layout Verified <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 2: WAREHOUSE MASTER WORKSPACE
            =================================================================== */}
        <div className="space-y-6">
            {/* Top 3 Columns: Warehouse Overview (8 KPIs) | Capacity Utilization (Donut) | Operational Status */}
            <div className="grid gap-5 lg:grid-cols-12">
              {/* Col 1: Warehouse Overview 8 Metrics (5 Cols) */}
              <div className="lg:col-span-5 card-soft p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-3">Warehouse Overview</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Total SKUs */}
                    <div className="p-2.5 rounded-lg border bg-muted/20">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium">
                        <Boxes className="h-3 w-3 text-amber-600" />
                        <span>Total SKUs</span>
                      </div>
                      <div className="text-base font-bold font-mono text-foreground mt-1">1,248</div>
                      <span className="text-[10px] text-muted-foreground">Items</span>
                    </div>

                    {/* Available Stock */}
                    <div className="p-2.5 rounded-lg border bg-emerald-500/10 border-emerald-200">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Available Stock</span>
                      </div>
                      <div className="text-base font-bold font-mono text-emerald-600 mt-1">28,450</div>
                      <span className="text-[10px] text-emerald-700">Units</span>
                    </div>

                    {/* Reserved Stock */}
                    <div className="p-2.5 rounded-lg border bg-purple-500/10 border-purple-200">
                      <div className="flex items-center gap-1.5 text-purple-800 dark:text-purple-300 text-[10px] font-medium">
                        <Tag className="h-3 w-3 text-purple-600" />
                        <span>Reserved Stock</span>
                      </div>
                      <div className="text-base font-bold font-mono text-purple-600 mt-1">2,150</div>
                      <span className="text-[10px] text-purple-700">Units</span>
                    </div>

                    {/* Inventory Value */}
                    <div className="p-2.5 rounded-lg border bg-blue-500/10 border-blue-200">
                      <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 text-[10px] font-medium">
                        <Coins className="h-3 w-3 text-blue-600" />
                        <span>Inventory Value</span>
                      </div>
                      <div className="text-base font-bold font-mono text-blue-600 mt-1">₹ 24.58 Cr</div>
                      <span className="text-[10px] text-blue-700">Valuation</span>
                    </div>

                    {/* Inbound Today */}
                    <div className="p-2.5 rounded-lg border bg-muted/20">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium">
                        <ArrowDownToLine className="h-3 w-3 text-purple-500" />
                        <span>Inbound Today</span>
                      </div>
                      <div className="text-base font-bold font-mono text-foreground mt-1">1,850</div>
                      <span className="text-[10px] text-muted-foreground">Units</span>
                    </div>

                    {/* Outbound Today */}
                    <div className="p-2.5 rounded-lg border bg-muted/20">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium">
                        <ArrowUpFromLine className="h-3 w-3 text-emerald-500" />
                        <span>Outbound Today</span>
                      </div>
                      <div className="text-base font-bold font-mono text-foreground mt-1">2,420</div>
                      <span className="text-[10px] text-muted-foreground">Units</span>
                    </div>

                    {/* Quality Hold */}
                    <div className="p-2.5 rounded-lg border bg-amber-500/10 border-amber-200">
                      <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-[10px] font-medium">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        <span>Quality Hold</span>
                      </div>
                      <div className="text-base font-bold font-mono text-amber-600 mt-1">320</div>
                      <span className="text-[10px] text-amber-700">Units</span>
                    </div>

                    {/* Damaged Stock */}
                    <div className="p-2.5 rounded-lg border bg-rose-500/10 border-rose-200">
                      <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 text-[10px] font-medium">
                        <ShieldAlert className="h-3 w-3 text-rose-600" />
                        <span>Damaged Stock</span>
                      </div>
                      <div className="text-base font-bold font-mono text-rose-600 mt-1">45</div>
                      <span className="text-[10px] text-rose-700">Units</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 2: Capacity Utilization Donut (4 Cols) */}
              <div className="lg:col-span-4 card-soft p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">Capacity Utilization</h4>
                  <div className="flex items-center gap-4 py-2">
                    <div className="relative h-32 w-32 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={capacityChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={36}
                            outerRadius={56}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {capacityChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-lg font-bold font-mono text-foreground leading-none">65%</span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">Utilized</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-muted-foreground text-[11px]">Used Capacity</span>
                        </div>
                        <span className="font-mono font-semibold text-foreground text-[11px]">32,500 Sq. Ft. (65%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-muted-foreground text-[11px]">Available Capacity</span>
                        </div>
                        <span className="font-mono font-semibold text-foreground text-[11px]">17,500 Sq. Ft. (35%)</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-muted-foreground text-[11px]">Total Capacity</span>
                        </div>
                        <span className="font-mono font-bold text-foreground text-[11px]">50,000 Sq. Ft.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-end">
                  <span className="text-xs text-primary font-semibold inline-flex items-center gap-1">
                    Total Capacity: 84.5% Utilized
                  </span>
                </div>
              </div>

              {/* Col 3: Operational Status List (3 Cols) */}
              <div className="lg:col-span-3 card-soft p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Operational Status</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-muted-foreground">Open Tasks</span>
                      </div>
                      <Badge variant="secondary" className="font-mono font-bold text-xs">48</Badge>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-muted-foreground">Pending Putaway</span>
                      </div>
                      <Badge variant="outline" className="font-mono font-bold text-xs text-amber-600 border-amber-200">12</Badge>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-3.5 w-3.5 text-purple-500" />
                        <span className="text-muted-foreground">Pending Picking</span>
                      </div>
                      <Badge variant="outline" className="font-mono font-bold text-xs text-purple-600 border-purple-200">18</Badge>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <ArrowUpFromLine className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-muted-foreground">Ready for Dispatch</span>
                      </div>
                      <Badge variant="outline" className="font-mono font-bold text-xs text-emerald-600 border-emerald-200">16</Badge>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5 text-sky-500" />
                        <span className="text-muted-foreground">Vehicles at Dock</span>
                      </div>
                      <Badge variant="secondary" className="font-mono font-bold text-xs">6</Badge>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                        <span className="text-muted-foreground">Delayed Dispatches</span>
                      </div>
                      <Badge className="font-mono font-bold text-xs bg-rose-500/15 text-rose-700 border-rose-200">3</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-end">
                  <span className="text-xs text-primary font-semibold inline-flex items-center gap-1">
                    All Operational Tasks Monitored
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom 3 Tables Grid: Inbound Shipments | Stock by Zone (Top 5) | Recent Outbound Dispatches */}
            <div className="grid gap-5 lg:grid-cols-3">
              {/* Table 1: Recent Inbound Shipments */}
              <div className="card-soft p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm text-foreground">Recent Inbound Shipments</h4>
                    <span className="text-xs text-primary font-semibold inline-flex items-center gap-0.5">
                      Live Inbound Stream
                    </span>
                  </div>

                  <div
                    className="overflow-x-auto no-scrollbar scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <table className="w-full text-[11px] text-left">
                      <thead className="text-[10px] text-muted-foreground uppercase border-b bg-muted/20">
                        <tr>
                          <th className="py-2 px-2">Inbound ID</th>
                          <th className="py-2 px-2">Supplier</th>
                          <th className="py-2 px-2">PO & ASN</th>
                          <th className="py-2 px-2">Qty</th>
                          <th className="py-2 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {RECENT_INBOUND_LIST.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/30">
                            <td className="py-2 px-2 font-mono font-medium text-primary">{row.id}</td>
                            <td className="py-2 px-2 font-medium text-foreground truncate max-w-[100px]">{row.supplier}</td>
                            <td className="py-2 px-2 text-muted-foreground font-mono text-[10px]">{row.poNumber}</td>
                            <td className="py-2 px-2 font-mono">{row.receivedQty}</td>
                            <td className="py-2 px-2 text-right">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-semibold",
                                  row.status === "Received" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                  row.status === "In Progress" && "bg-blue-50 text-blue-700 border-blue-200",
                                  row.status === "Pending" && "bg-amber-50 text-amber-700 border-amber-200",
                                  row.status === "Cancelled" && "bg-muted text-muted-foreground"
                                )}
                              >
                                {row.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Table 2: Stock by Zone (Top 5) */}
              <div className="card-soft p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm text-foreground">Stock by Zone (Top 5)</h4>
                    <span className="text-xs text-primary font-semibold inline-flex items-center gap-0.5">
                      5 Core Zones Active
                    </span>
                  </div>

                  <div
                    className="overflow-x-auto no-scrollbar scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <table className="w-full text-[11px] text-left">
                      <thead className="text-[10px] text-muted-foreground uppercase border-b bg-muted/20">
                        <tr>
                          <th className="py-2 px-2">Zone</th>
                          <th className="py-2 px-2 text-center">Items</th>
                          <th className="py-2 px-2">Capacity Used</th>
                          <th className="py-2 px-2 text-right">Utilization</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {WAREHOUSE_ZONES.slice(0, 5).map((zone) => (
                          <tr key={zone.id} className="hover:bg-muted/30">
                            <td className="py-2 px-2 font-semibold text-foreground">{zone.name}</td>
                            <td className="py-2 px-2 text-center font-mono">{zone.itemsCount}</td>
                            <td className="py-2 px-2 font-mono text-muted-foreground">
                              {zone.capacityUsed.toLocaleString()} Sq. Ft.
                            </td>
                            <td className="py-2 px-2 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                   <div
                                    className={cn(
                                      "h-full rounded-full",
                                      zone.utilization > 75 ? "bg-amber-500" : "bg-blue-500"
                                    )}
                                    style={{ width: `${zone.utilization}%` }}
                                  />
                                </div>
                                <span className="font-mono font-bold text-[10px]">{zone.utilization}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Table 3: Recent Outbound Dispatches */}
              <div className="card-soft p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm text-foreground">Recent Outbound Dispatches</h4>
                    <span className="text-xs text-primary font-semibold inline-flex items-center gap-0.5">
                      Live Dispatch Stream
                    </span>
                  </div>

                  <div
                    className="overflow-x-auto no-scrollbar scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <table className="w-full text-[11px] text-left">
                      <thead className="text-[10px] text-muted-foreground uppercase border-b bg-muted/20">
                        <tr>
                          <th className="py-2 px-2">Dispatch ID</th>
                          <th className="py-2 px-2">Customer</th>
                          <th className="py-2 px-2">Date</th>
                          <th className="py-2 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {RECENT_OUTBOUND_LIST.map((row) => (
                          <tr key={row.id} className="hover:bg-muted/30">
                            <td className="py-2 px-2 font-mono font-medium text-primary">{row.id}</td>
                            <td className="py-2 px-2 font-medium text-foreground truncate max-w-[120px]">{row.customer}</td>
                            <td className="py-2 px-2 font-mono text-[10px] text-muted-foreground">{row.dispatchDate}</td>
                            <td className="py-2 px-2 text-right">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-semibold",
                                  row.status === "Delivered" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                  row.status === "In Transit" && "bg-sky-50 text-sky-700 border-sky-200",
                                  row.status === "Dispatched" && "bg-blue-50 text-blue-700 border-blue-200",
                                  row.status === "Pending" && "bg-amber-50 text-amber-700 border-amber-200"
                                )}
                              >
                                {row.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

      </div>
    </div>

      {/* ===================================================================
          MODALS
          =================================================================== */}

      {/* 1. New Warehouse Modal */}
      <Dialog open={showNewWarehouseModal} onOpenChange={setShowNewWarehouseModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Register New Warehouse Infrastructure</DialogTitle>
            <DialogDescription>Define a new physical warehouse, distribution center, or depot.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Warehouse Code *</Label>
                <Input placeholder="e.g. WH-NORTH-002" className="mt-1 font-mono text-xs" />
              </div>
              <div>
                <Label className="text-xs">Warehouse Name *</Label>
                <Input placeholder="e.g. North Hub" className="mt-1 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Warehouse Type</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>Regional Warehouse</option>
                  <option>Distribution Center</option>
                  <option>Central Warehouse</option>
                  <option>Cold Storage</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Total Area (Sq. Ft.)</Label>
                <Input type="number" defaultValue="35000" className="mt-1 text-xs font-mono" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Location / City</Label>
              <Input placeholder="e.g. Gurugram, Haryana, India" className="mt-1 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowNewWarehouseModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowNewWarehouseModal(false);
                toast.success("New Warehouse successfully created and registered.");
              }}
            >
              Save Warehouse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Inbound Receipt Modal */}
      <Dialog open={showInboundModal} onOpenChange={setShowInboundModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Log Inbound Vehicle & Material Receipt</DialogTitle>
            <DialogDescription>Record vehicle arrival, PO reference, and assign unloading dock.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Purchase Order / Transfer Order *</Label>
              <Input placeholder="e.g. PO-2026-0522" className="mt-1 font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Supplier / Source</Label>
                <Input placeholder="Supplier Name" className="mt-1 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Vehicle Number</Label>
                <Input placeholder="e.g. MH-12-AB-1234" className="mt-1 font-mono text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Assign Dock</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>Dock 01 (Inbound)</option>
                  <option>Dock 02 (Inbound)</option>
                  <option>Dock 03 (Multi-Purpose)</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Expected Qty</Label>
                <Input type="number" defaultValue="500" className="mt-1 font-mono text-xs" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowInboundModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowInboundModal(false);
                toast.success("Inbound vehicle logged. Dock 01 allocated for unloading.");
              }}
            >
              Confirm Gate Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Putaway Task Modal */}
      <Dialog open={showPutawayModal} onOpenChange={setShowPutawayModal}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Create Directed Putaway Task</DialogTitle>
            <DialogDescription>Assign material from receiving dock to optimal warehouse bin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">GRN Reference</Label>
              <Input defaultValue="GRN-2026-0446" className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <Label className="text-xs">Putaway Strategy</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>AI Optimized (Smart Slotting)</option>
                <option>Fast Moving Priority</option>
                <option>Capacity-Based</option>
                <option>Zone-Based</option>
                <option>FIFO</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Assign Handler / Forklift Operator</Label>
              <Input defaultValue="Vikram Jadhav" className="mt-1 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPutawayModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowPutawayModal(false);
                toast.success("Putaway task generated and dispatched to handheld terminal.");
              }}
            >
              Generate Putaway Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Pick Wave Modal */}
      <Dialog open={showPickModal} onOpenChange={setShowPickModal}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Generate Pick List / Wave</DialogTitle>
            <DialogDescription>Create batch picking wave for pending dispatch orders.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Sales Order Reference</Label>
              <Input defaultValue="SO-2026-0845" className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <Label className="text-xs">Picking Strategy</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>Wave Picking</option>
                <option>Zone Picking</option>
                <option>Batch Picking</option>
                <option>Cluster Picking</option>
                <option>FIFO</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Assign Picker</Label>
              <Input defaultValue="Ajay Kulkarni" className="mt-1 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPickModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowPickModal(false);
                toast.success("Pick list generated and assigned to picker.");
              }}
            >
              Release Pick Wave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Transfer Modal */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Initiate Inter-Warehouse Transfer</DialogTitle>
            <DialogDescription>Transfer inventory stock to regional distribution center.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Source Warehouse</Label>
                <Input defaultValue="Main Warehouse (Pune)" disabled className="mt-1 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Destination Warehouse</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>West Regional DC (Mumbai)</option>
                  <option>South Regional DC (Bengaluru)</option>
                  <option>North Regional DC (Delhi)</option>
                </select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Item Code / Name</Label>
              <Input defaultValue="EVCH-60KW - 60kW DC Fast Charger" className="mt-1 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Transfer Quantity</Label>
                <Input type="number" defaultValue="50" className="mt-1 font-mono text-xs" />
              </div>
              <div>
                <Label className="text-xs">Transporter</Label>
                <Input defaultValue="SafeXpress Logistics" className="mt-1 text-xs" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowTransferModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowTransferModal(false);
                toast.success("Inter-Warehouse Transfer TRF-2026-0045 created.");
              }}
            >
              Submit Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Stock Count Audit Modal */}
      <Dialog open={showStockCountModal} onOpenChange={setShowStockCountModal}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Initiate Physical Cycle Count</DialogTitle>
            <DialogDescription>Freeze bin locations and generate physical count sheets.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Target Zone</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>Z-FG (Finished Goods Storage)</option>
                <option>Z-RM (Raw Material Storage)</option>
                <option>Z-FM (Fast Moving Pick Zone)</option>
                <option>All Zones (Wall-to-Wall)</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Lead Count Auditor</Label>
              <Input defaultValue="Siddharth Roy (WMS Floor Auditor)" className="mt-1 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowStockCountModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowStockCountModal(false);
                toast.success("Cycle count sheet generated. Bin locations frozen.");
              }}
            >
              Start Cycle Count
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default WarehousePage;
