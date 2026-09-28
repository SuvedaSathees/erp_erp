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

export const Route = createFileRoute("/management/supply-chain-management/logistics")({
  head: () => ({
    meta: [
      { title: "Logistics & Distribution · Magnertia ERP" },
      {
        name: "description",
        content:
          "Unified management of warehouse dispatch releases, transportation routing, carrier allocation, distribution order consolidation, GPS tracking, and digital proof of delivery (POD).",
      },
    ],
  }),
  component: LogisticsPage,
});

/* ===========================================================================
   Data Constants & Mock State for Logistics
   =========================================================================== */

interface ShipmentItem {
  code: string;
  name: string;
  qty: number;
  uom: string;
  weight: number;
  volume: number;
  status: "Delivered" | "Loaded" | "Picked" | "Pending";
}

const SHIPMENT_ITEMS: ShipmentItem[] = [
  { code: "MAT-1001", name: "Steel Sheet 2mm", qty: 2000, uom: "Kg", weight: 2000.0, volume: 6.4, status: "Delivered" },
  { code: "MAT-1002", name: "Copper Cable 6mm", qty: 1500, uom: "M", weight: 450.0, volume: 1.2, status: "Delivered" },
  { code: "MAT-1003", name: "Power Module 60KW", qty: 20, uom: "Nos", weight: 700.0, volume: 3.5, status: "Loaded" },
  { code: "MAT-1004", name: "Enclosure Box", qty: 25, uom: "Nos", weight: 600.0, volume: 2.75, status: "Loaded" },
  { code: "MAT-1005", name: "Cooling Fan", qty: 30, uom: "Nos", weight: 300.0, volume: 1.25, status: "Loaded" },
  { code: "MAT-1006", name: "Control Panel", qty: 10, uom: "Nos", weight: 800.0, volume: 3.5, status: "Loaded" },
];

export function LogisticsPage() {
  // Shipment Details State
  const [shipmentNumber, setShipmentNumber] = useState("SHP-2026-001248");
  const [logisticsType, setLogisticsType] = useState("Outbound Logistics");
  const [shipmentMode, setShipmentMode] = useState("Road");
  const [priority, setPriority] = useState("High");
  const [shipmentDate, setShipmentDate] = useState("26 Apr 2026");
  const [dispatchDate, setDispatchDate] = useState("26 Apr 2026 10:00 AM");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("29 Apr 2026 07:30 PM");
  const [actualDeliveryDate, setActualDeliveryDate] = useState("");
  const [sourceWarehouse, setSourceWarehouse] = useState("Main Warehouse - Chennai");
  const [destination, setDestination] = useState("ABC Industries - Bengaluru");
  const [customerProject, setCustomerProject] = useState("ABC Industries");
  const [referenceOrder, setReferenceOrder] = useState("SO-2026-004587");
  const [shipmentStatus, setShipmentStatus] = useState("In Transit");

  const totalPackages = 12;
  const totalWeight = "4,850.00 Kg";
  const totalVolume = "18.60 CBM";

  // Transporter & Vehicle details
  const [transporter, setTransporter] = useState("VRL Express Logistics Ltd.");
  const [vehicleNumber, setVehicleNumber] = useState("NL-01-AF-7720");
  const [vehicleType, setVehicleType] = useState("Ashok Leyland 2820 (Multi-Axle)");
  const [driverName, setDriverName] = useState("Santosh Shinde");
  const [driverMobile, setDriverMobile] = useState("+91 97654 32189");
  const [routeInfo, setRouteInfo] = useState("Chennai - Bengaluru (NH-44)");
  const [distanceKm, setDistanceKm] = useState(385);
  const [distanceCoveredKm, setDistanceCoveredKm] = useState(242);
  const [remainingDistanceKm, setRemainingDistanceKm] = useState(143);
  const [avgSpeed, setAvgSpeed] = useState(58);
  const [etaTime, setEtaTime] = useState("29 Apr 2026 07:30 PM");
  const [tollCost, setTollCost] = useState("₹ 1,200.00");

  // Freight Details
  const baseFreight = 18000;
  const fuelSurcharge = 2700;
  const tollCharges = 1200;
  const otherCharges = 600;
  const totalFreight = 22500;
  const freightTerms = "To Pay";
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const freightAgreement = "AG-2026-0015";
  const transporterInvoice = "INV-78562";
  const createdBy = "Sunil Deshmukh";

  // Modals
  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);
  const [showPlanRouteModal, setShowPlanRouteModal] = useState(false);
  const [showAssignVehicleModal, setShowAssignVehicleModal] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);
  const [showFullTrackingModal, setShowFullTrackingModal] = useState(false);
  const [showFreightModal, setShowFreightModal] = useState(false);

  return (
    <AppShell
      title="Logistics & Distribution"
      breadcrumb="Management"
      description="Unified management of warehouse dispatch releases, transportation routing, carrier allocation, distribution order consolidation, GPS tracking, and proof of delivery (POD)."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="logistics"
    >
      <div className="space-y-6">
        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active Shipment:</span>
            <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5 border-primary/20">
              {shipmentNumber}
            </Badge>
            <Badge className="bg-blue-500/15 text-blue-800 dark:text-blue-300 font-semibold border border-blue-200 text-xs">
              {shipmentStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("Shipment editing cancelled")}
              className="h-8 font-medium text-xs"
            >
              Cancel
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Draft saved successfully.")}
              className="h-8 gap-1.5 font-medium text-xs"
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Save Draft</span>
            </Button>

            <Button
              size="sm"
              onClick={() => toast.success("Shipment submitted and dispatched to transporter.")}
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  <span>More Actions</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs">Logistics Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowNewShipmentModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Plus className="h-3.5 w-3.5 text-blue-600" /> New Shipment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPlanRouteModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Navigation className="h-3.5 w-3.5 text-purple-600" /> Plan & Optimize Route
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAssignVehicleModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Truck className="h-3.5 w-3.5 text-emerald-600" /> Allocate Vehicle & Driver
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPodModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Signature className="h-3.5 w-3.5 text-amber-600" /> Upload Digital POD
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowFreightModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Coins className="h-3.5 w-3.5 text-sky-600" /> Settle Freight Invoice
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()} className="gap-2 text-xs cursor-pointer">
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print e-Way Bill & Gate Pass
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Dispatch report exported to CSV")} className="gap-2 text-xs cursor-pointer">
                  <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export Shipment Manifest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* ===================================================================
            SECTION 1: TOP DUAL CARDS
            Left (8 Cols): 1. Shipment Details | Right (4 Cols): 3. Shipment Status
            =================================================================== */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* LEFT CARD (8 COLS): 1. Shipment Details */}
          <div className="lg:col-span-8 card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground tracking-tight">1. Shipment Details</h3>
                  <button
                    type="button"
                    title="Shipment movement identification and location details"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Badge variant="outline" className="text-xs font-mono font-bold text-primary bg-primary/5 border-primary/20">
                  {shipmentNumber}
                </Badge>
              </div>

              {/* Form Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Shipment Number</span>
                  <div className="mt-1 font-mono font-bold text-foreground py-1 border rounded-md px-2 bg-muted/20">
                    {shipmentNumber}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Logistics Type</span>
                  <select
                    value={logisticsType}
                    onChange={(e) => setLogisticsType(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground h-7"
                  >
                    <option>Outbound Logistics</option>
                    <option>Inbound Logistics</option>
                    <option>Inter-Warehouse Transfer</option>
                    <option>Customer Delivery</option>
                    <option>Reverse Logistics</option>
                    <option>Express Delivery</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Shipment Mode</span>
                  <select
                    value={shipmentMode}
                    onChange={(e) => setShipmentMode(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground h-7"
                  >
                    <option>Road</option>
                    <option>Rail</option>
                    <option>Air</option>
                    <option>Sea</option>
                    <option>Multi-Modal</option>
                    <option>Courier</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Priority</span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border-amber-200 h-7"
                  >
                    <option>High</option>
                    <option>Critical</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Shipment Date *</span>
                  <div className="mt-1 flex items-center gap-1.5 border rounded-md px-2 py-1 bg-background text-foreground h-7 font-mono text-[11px]">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{shipmentDate}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Dispatch Date *</span>
                  <div className="mt-1 flex items-center gap-1.5 border rounded-md px-2 py-1 bg-background text-foreground h-7 font-mono text-[11px]">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{dispatchDate}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Expected Delivery Date *</span>
                  <div className="mt-1 flex items-center gap-1.5 border rounded-md px-2 py-1 bg-background text-foreground h-7 font-mono text-[11px]">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{expectedDeliveryDate}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Actual Delivery Date</span>
                  <div className="mt-1 flex items-center gap-1.5 border rounded-md px-2 py-1 bg-background text-muted-foreground h-7 font-mono text-[11px]">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Select date</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Source Warehouse *</span>
                  <select
                    value={sourceWarehouse}
                    onChange={(e) => setSourceWarehouse(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground h-7"
                  >
                    <option>Main Warehouse - Chennai</option>
                    <option>Pune Central Warehouse</option>
                    <option>West Regional DC - Mumbai</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Destination *</span>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground h-7"
                  >
                    <option>ABC Industries - Bengaluru</option>
                    <option>PowerGrid Substation - Hyderabad</option>
                    <option>GreenCharge Depot - Kochi</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Customer / Project *</span>
                  <select
                    value={customerProject}
                    onChange={(e) => setCustomerProject(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground h-7"
                  >
                    <option>ABC Industries</option>
                    <option>GreenCharge Solutions</option>
                    <option>EcoVolt Energy</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Reference Order</span>
                  <div className="mt-1 font-mono font-medium text-foreground py-1 px-2 border rounded-md bg-muted/20 h-7 flex items-center">
                    {referenceOrder}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Metrics Ribbon */}
            <div className="mt-4 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block font-medium">Total Packages</span>
                <span className="text-base font-bold font-mono text-foreground">{totalPackages}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-medium">Total Weight</span>
                <span className="text-base font-bold font-mono text-foreground">{totalWeight}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-medium">Total Volume</span>
                <span className="text-base font-bold font-mono text-foreground">{totalVolume}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block font-medium">Shipment Status</span>
                <Badge className="bg-sky-500/15 text-sky-800 dark:text-sky-300 font-semibold border-sky-200 mt-0.5">
                  {shipmentStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* RIGHT CARD (4 COLS): 3. Shipment Status Workflow */}
          <div className="lg:col-span-4 card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-base text-foreground tracking-tight">3. Shipment Status</h3>
                <span className="text-xs text-muted-foreground font-mono">Real-Time Stepper</span>
              </div>

              {/* 8-Stage Status Stepper matching mockup */}
              <div className="mt-4 flex items-center justify-between relative px-1">
                <div className="absolute left-2 right-2 top-3 h-0.5 bg-muted -z-0" />
                {[
                  { label: "Draft", status: "completed" },
                  { label: "Planned", status: "completed" },
                  { label: "Transport Assigned", status: "completed" },
                  { label: "Loaded", status: "completed" },
                  { label: "Dispatched", status: "completed" },
                  { label: "In Transit", status: "active" },
                  { label: "Delivered", status: "pending" },
                  { label: "Closed", status: "pending" },
                ].map((st, i) => (
                  <div key={i} className="flex flex-col items-center z-10">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border",
                        st.status === "completed" && "bg-emerald-600 border-emerald-600 text-white",
                        st.status === "active" && "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950",
                        st.status === "pending" && "bg-background border-muted text-muted-foreground"
                      )}
                    >
                      {st.status === "completed" ? "✓" : i + 1}
                    </div>
                    <span className="text-[8px] text-muted-foreground mt-1 truncate max-w-[36px] text-center hidden sm:block">
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Box Details */}
              <div className="mt-6 p-3 rounded-lg border bg-muted/20 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Current Status:</span>
                  <Badge className="bg-sky-500/15 text-sky-800 dark:text-sky-300 font-semibold border-sky-200">
                    {shipmentStatus}
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  Since 26 Apr 2026 02:00 PM
                </div>

                <div className="pt-2 border-t flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Current Location</span>
                    <span className="font-semibold text-foreground text-xs">Hosur Road, Bengaluru</span>
                    <span className="text-[10px] text-muted-foreground block">Karnataka, India · Updated 10 mins ago</span>
                  </div>
                </div>

                <div className="pt-2 border-t flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">ETA</span>
                    <span className="font-semibold text-foreground text-xs">{etaTime}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block font-medium">Remaining</span>
                    <span className="font-mono font-bold text-primary text-xs">{remainingDistanceKm} Km remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 2: LOGISTICS WORKSPACE
            =================================================================== */}
        <div className="space-y-6">
            {/* Top Row: 4. Shipment Items (Left) | 6. Live Tracking (Middle) | 5. Transport & Vehicle (Right) */}
            <div className="grid gap-5 lg:grid-cols-12">
              {/* Box 4: Shipment Items (4 Cols) */}
              <div className="lg:col-span-4 card-soft p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm text-foreground">4. Shipment Items</h4>
                    <span className="text-xs text-muted-foreground font-mono">6 SKUs</span>
                  </div>

                  <div
                    className="overflow-x-auto no-scrollbar scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <table className="w-full text-[11px] text-left">
                      <thead className="text-[10px] text-muted-foreground uppercase border-b bg-muted/20">
                        <tr>
                          <th className="py-2 px-2">Item Code</th>
                          <th className="py-2 px-2">Item Name</th>
                          <th className="py-2 px-2 text-right">Qty</th>
                          <th className="py-2 px-2 text-center">UOM</th>
                          <th className="py-2 px-2 text-right">Weight (Kg)</th>
                          <th className="py-2 px-2 text-right">Volume (CBM)</th>
                          <th className="py-2 px-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {SHIPMENT_ITEMS.map((item) => (
                          <tr key={item.code} className="hover:bg-muted/30">
                            <td className="py-1.5 px-2 font-mono font-medium text-primary">{item.code}</td>
                            <td className="py-1.5 px-2 font-medium text-foreground truncate max-w-[100px]">{item.name}</td>
                            <td className="py-1.5 px-2 text-right font-mono font-bold">{item.qty.toLocaleString()}</td>
                            <td className="py-1.5 px-2 text-center font-mono text-muted-foreground">{item.uom}</td>
                            <td className="py-1.5 px-2 text-right font-mono">{item.weight.toFixed(2)}</td>
                            <td className="py-1.5 px-2 text-right font-mono">{item.volume.toFixed(2)}</td>
                            <td className="py-1.5 px-2 text-right">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[9px] font-semibold",
                                  item.status === "Delivered" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                  item.status === "Loaded" && "bg-blue-50 text-blue-700 border-blue-200"
                                )}
                              >
                                {item.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t font-semibold bg-muted/10 text-foreground">
                        <tr>
                          <td className="py-2 px-2" colSpan={2}>Total</td>
                          <td className="py-2 px-2 text-right font-mono">3,585</td>
                          <td />
                          <td className="py-2 px-2 text-right font-mono">4,850.00</td>
                          <td className="py-2 px-2 text-right font-mono">18.60</td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Box 6: Live Tracking with Map (5 Cols) */}
              <div className="lg:col-span-5 card-soft p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-foreground">6. Live Tracking</h4>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Telematics stats */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Vehicle Number</span>
                        <span className="font-mono font-bold text-foreground text-xs">{vehicleNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Driver</span>
                        <span className="font-medium text-foreground text-xs">{driverName}</span>
                        <span className="text-[10px] text-muted-foreground block font-mono">{driverMobile}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Distance Covered</span>
                        <span className="font-mono font-bold text-foreground text-xs">{distanceCoveredKm} Km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Remaining Distance</span>
                        <span className="font-mono font-bold text-primary text-xs">{remainingDistanceKm} Km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Avg. Speed</span>
                        <span className="font-mono font-bold text-foreground text-xs">{avgSpeed} Kmph</span>
                      </div>
                    </div>

                    {/* Interactive Simulated Map Container */}
                    <div className="rounded-lg border bg-blue-50/20 dark:bg-blue-950/20 relative overflow-hidden flex flex-col items-center justify-center p-3 text-center border-dashed">
                      {/* SVG Transit Visual */}
                      <svg className="w-full h-32" viewBox="0 0 200 120">
                        {/* Route Curve */}
                        <path
                          d="M 30 90 Q 90 60 170 30"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray="4 2"
                        />
                        {/* Completed portion */}
                        <path
                          d="M 30 90 Q 75 75 120 50"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="4"
                        />
                        {/* Origin Point */}
                        <circle cx="30" cy="90" r="5" fill="#10b981" />
                        <text x="30" y="105" fontSize="8" textAnchor="middle" fill="#475569">Chennai</text>
                        {/* Current Vehicle Point */}
                        <circle cx="120" cy="50" r="6" fill="#2563eb" />
                        <circle cx="120" cy="50" r="10" fill="#3b82f6" opacity="0.3" className="animate-ping" />
                        {/* Destination Point */}
                        <circle cx="170" cy="30" r="5" fill="#ef4444" />
                        <text x="170" y="22" fontSize="8" textAnchor="middle" fill="#475569">Bengaluru</text>
                      </svg>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        GPS Active (Refresh: 30s)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Last Updated: 26 Apr 2026 04:15 PM</span>
                  <button
                    type="button"
                    onClick={() => setShowFullTrackingModal(true)}
                    className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    View Full Tracking <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Box 5: Transport & Vehicle (3 Cols) */}
              <div className="lg:col-span-3 card-soft p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-3">5. Transport & Vehicle</h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground block font-medium">Transporter</span>
                        <span className="flex items-center text-[10px] text-amber-500 font-bold">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-0.5" /> 4.6
                        </span>
                      </div>
                      <span className="font-semibold text-foreground text-xs">{transporter}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Vehicle Number</span>
                        <span className="font-mono font-bold text-foreground text-xs">{vehicleNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Vehicle Type</span>
                        <span className="text-foreground text-xs">{vehicleType}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Driver Name</span>
                        <span className="text-foreground text-xs">{driverName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-medium">Driver Mobile</span>
                        <span className="font-mono text-muted-foreground text-[11px]">{driverMobile}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t space-y-1.5">
                      <span className="text-[11px] font-semibold text-foreground block">Route Information</span>
                      <div className="text-[11px] text-muted-foreground font-mono">{routeInfo}</div>
                      <div className="grid grid-cols-3 gap-1 text-[10px]">
                        <div><span className="text-muted-foreground block">Est. Dist:</span><strong>385 Km</strong></div>
                        <div><span className="text-muted-foreground block">Est. Time:</span><strong>7h 30m</strong></div>
                        <div><span className="text-muted-foreground block">Toll Cost:</span><strong>₹ 1,200</strong></div>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">Route Type: <strong className="text-primary">Fastest Route</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mid Row: 7. Freight Summary */}
            <div className="card-soft p-5">
              <h4 className="font-semibold text-sm text-foreground mb-3">7. Freight Summary</h4>

              <div className="grid gap-3 sm:grid-cols-5 text-xs">
                <div className="p-3 rounded-lg border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block font-medium">Base Freight</span>
                  <div className="text-base font-bold font-mono text-foreground mt-0.5">₹ 18,000.00</div>
                </div>

                <div className="p-3 rounded-lg border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block font-medium">Fuel Surcharge</span>
                  <div className="text-base font-bold font-mono text-foreground mt-0.5">₹ 2,700.00</div>
                </div>

                <div className="p-3 rounded-lg border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block font-medium">Toll Charges</span>
                  <div className="text-base font-bold font-mono text-foreground mt-0.5">₹ 1,200.00</div>
                </div>

                <div className="p-3 rounded-lg border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block font-medium">Other Charges</span>
                  <div className="text-base font-bold font-mono text-foreground mt-0.5">₹ 600.00</div>
                </div>

                <div className="p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
                  <span className="text-[10px] text-blue-800 dark:text-blue-300 block font-semibold">Total Freight</span>
                  <div className="text-base font-bold font-mono text-blue-600 mt-0.5">₹ 22,500.00</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-muted-foreground">
                <div>
                  <span className="text-[10px] block font-medium">Freight Terms</span>
                  <strong className="text-foreground">{freightTerms}</strong>
                </div>
                <div>
                  <span className="text-[10px] block font-medium">Payment Status</span>
                  <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">{paymentStatus}</Badge>
                </div>
                <div>
                  <span className="text-[10px] block font-medium">Freight Agreement</span>
                  <strong className="font-mono text-foreground">{freightAgreement}</strong>
                </div>
                <div>
                  <span className="text-[10px] block font-medium">Transporter Inv No.</span>
                  <strong className="font-mono text-foreground">{transporterInvoice}</strong>
                </div>
                <div>
                  <span className="text-[10px] block font-medium">Created By</span>
                  <strong className="text-foreground">{createdBy}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Row: 8. Logistics Analytics (8 Metrics in ribbon) */}
            <div className="card-soft p-5">
              <h4 className="font-semibold text-sm text-foreground mb-3">8. Logistics Analytics</h4>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
                {/* 1. Total Shipments */}
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-[10px] text-muted-foreground block font-medium">Total Shipments</span>
                  <div className="text-base font-bold font-mono text-foreground mt-1">128</div>
                  <span className="text-[10px] text-emerald-600 font-medium">↑ 18% vs last month</span>
                </div>

                {/* 2. On-Time Delivery */}
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-[10px] text-muted-foreground block font-medium">On-Time Delivery</span>
                  <div className="text-base font-bold font-mono text-foreground mt-1">78%</div>
                  <span className="text-[10px] text-muted-foreground">Target: 85%</span>
                </div>

                {/* 3. In Transit */}
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-[10px] text-muted-foreground block font-medium">In Transit</span>
                  <div className="text-base font-bold font-mono text-blue-600 mt-1">74</div>
                  <span className="text-[10px] text-muted-foreground">Shipments</span>
                </div>

                {/* 4. Delivered Today */}
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-[10px] text-muted-foreground block font-medium">Delivered Today</span>
                  <div className="text-base font-bold font-mono text-emerald-600 mt-1">46</div>
                  <span className="text-[10px] text-muted-foreground">Shipments</span>
                </div>

                {/* 5. Avg. Delivery Time */}
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-[10px] text-muted-foreground block font-medium">Avg. Delivery Time</span>
                  <div className="text-base font-bold font-mono text-foreground mt-1">2.8 Days</div>
                  <span className="text-[10px] text-muted-foreground">Target: 2.5 Days</span>
                </div>

                {/* 6. Freight Cost */}
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-[10px] text-muted-foreground block font-medium">Freight Cost</span>
                  <div className="text-base font-bold font-mono text-foreground mt-1">₹ 18.6 Lakh</div>
                  <span className="text-[10px] text-emerald-600 font-medium">↓ 6% vs last month</span>
                </div>

                {/* 7. POD Pending */}
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-[10px] text-muted-foreground block font-medium">POD Pending</span>
                  <div className="text-base font-bold font-mono text-rose-600 mt-1">5</div>
                  <span className="text-[10px] text-muted-foreground">Shipments</span>
                </div>

                {/* 8. Vehicles in Use */}
                <div className="p-3 rounded-lg border bg-card">
                  <span className="text-[10px] text-muted-foreground block font-medium">Vehicles in Use</span>
                  <div className="text-base font-bold font-mono text-foreground mt-1">23 / 35</div>
                  <span className="text-[10px] text-muted-foreground">Fleet Capacity</span>
                </div>
              </div>
            </div>




        </div>
      </div>

      {/* ===================================================================
          MODALS
          =================================================================== */}

      {/* 1. New Shipment Modal */}
      <Dialog open={showNewShipmentModal} onOpenChange={setShowNewShipmentModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create New Logistics Shipment</DialogTitle>
            <DialogDescription>Consolidate pick lists or sales orders into a new dispatch shipment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Sales Order / Transfer Order Reference</Label>
              <Input defaultValue="SO-2026-004588" className="mt-1 font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Source Warehouse</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>Main Warehouse - Chennai</option>
                  <option>Pune Central Warehouse</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Destination Location</Label>
                <Input defaultValue="Bengaluru Tech Park Hub" className="mt-1 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Transport Mode</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>Road (Dedicated Truck)</option>
                  <option>Express Courier</option>
                  <option>Rail Freight</option>
                  <option>Air Cargo</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>High</option>
                  <option>Critical</option>
                  <option>Standard</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowNewShipmentModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowNewShipmentModal(false);
                toast.success("Shipment SHP-2026-001249 registered.");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Shipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Plan Route Modal */}
      <Dialog open={showPlanRouteModal} onOpenChange={setShowPlanRouteModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>AI Route Optimization & Toll Estimator</DialogTitle>
            <DialogDescription>Determine optimal path based on vehicle weight and commercial highway tolls.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Route Optimization Target</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>Fastest Route (Via NH-44 Expressway)</option>
                <option>Lowest Toll Cost (Via NH-48)</option>
                <option>Shortest Distance (Via Chittoor)</option>
              </select>
            </div>
            <div className="p-3 rounded-lg border bg-muted/20 space-y-1 text-xs">
              <div className="flex justify-between"><span>Distance:</span><strong className="font-mono">385 Km</strong></div>
              <div className="flex justify-between"><span>Estimated Travel Time:</span><strong className="font-mono">7h 30m</strong></div>
              <div className="flex justify-between"><span>Toll Plazas:</span><strong className="font-mono">4 Tolls (₹ 1,200)</strong></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPlanRouteModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowPlanRouteModal(false);
                toast.success("Fastest Route locked into Driver navigation.");
              }}
            >
              Apply Route
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Assign Vehicle Modal */}
      <Dialog open={showAssignVehicleModal} onOpenChange={setShowAssignVehicleModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Allocate Transporter & Commercial Vehicle</DialogTitle>
            <DialogDescription>Assign carrier contract, verified vehicle, and authorized driver.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Select Carrier / Transporter</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>Shree Logistics Pvt. Ltd. (Rating 4.6)</option>
                <option>VRL Logistics Ltd. (Rating 4.4)</option>
                <option>SafeXpress Cargo (Rating 4.8)</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Vehicle Plate Number</Label>
              <Input defaultValue="NL-01-AF-7720 (20 Ton)" className="mt-1 font-mono text-xs" />
            </div>
            <div>
              <Label className="text-xs">Assigned Driver</Label>
              <Input defaultValue="Santosh Shinde (+91 98450 11209)" className="mt-1 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAssignVehicleModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowAssignVehicleModal(false);
                toast.success("Vehicle & Driver allocated successfully.");
              }}
            >
              Confirm Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Upload POD Modal */}
      <Dialog open={showPodModal} onOpenChange={setShowPodModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Upload Electronic Proof of Delivery (POD)</DialogTitle>
            <DialogDescription>Record consignee recipient details, signed challan, and delivery condition.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Recipient Representative Name *</Label>
              <Input placeholder="e.g. Suresh Nair (Site Store Manager)" className="mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Delivered / Accepted Quantity</Label>
              <Input defaultValue="3,585 Units (100% Accepted)" className="mt-1 text-xs" />
            </div>
            <div className="p-3 border-2 border-dashed rounded-lg text-center bg-muted/10 cursor-pointer hover:bg-muted/20">
              <Camera className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
              <span className="text-xs font-medium block">Upload Stamped POD Document or Photo</span>
              <span className="text-[10px] text-muted-foreground">PDF, PNG, JPG up to 10MB</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPodModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowPodModal(false);
                toast.success("e-POD verified and saved. Shipment status marked Delivered.");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Verify POD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Full Tracking Modal */}
      <Dialog open={showFullTrackingModal} onOpenChange={setShowFullTrackingModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Full Telematics & GPS Telemetry</DialogTitle>
            <DialogDescription>Live satellite telematics stream from vehicle NL-01-AF-7720.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div className="p-3 rounded-lg border bg-blue-50/30 text-xs space-y-1">
              <div className="flex justify-between"><span>Current Coordinates:</span><strong className="font-mono">12.7409° N, 77.8253° E</strong></div>
              <div className="flex justify-between"><span>Engine Telemetry:</span><strong className="font-mono text-emerald-600">Normal (82°C)</strong></div>
              <div className="flex justify-between"><span>Cargo Bay Temperature:</span><strong className="font-mono">24.2°C (Dry ambient)</strong></div>
              <div className="flex justify-between"><span>Odometer:</span><strong className="font-mono">48,291 Km</strong></div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowFullTrackingModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Freight Modal */}
      <Dialog open={showFreightModal} onOpenChange={setShowFreightModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Freight Invoice Approval & Settlement</DialogTitle>
            <DialogDescription>Validate contracted rates and release carrier payment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div className="p-3 rounded-lg border bg-muted/20 space-y-1 font-mono text-xs">
              <div className="flex justify-between"><span>Base Freight:</span><span>₹ 18,000.00</span></div>
              <div className="flex justify-between"><span>Fuel + Toll Surcharges:</span><span>₹ 3,900.00</span></div>
              <div className="flex justify-between"><span>Handling:</span><span>₹ 600.00</span></div>
              <div className="flex justify-between border-t pt-1 font-bold"><span>Total Approved:</span><span className="text-blue-600">₹ 22,500.00</span></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowFreightModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowFreightModal(false);
                setPaymentStatus("Paid");
                toast.success("Freight payment of ₹ 22,500 approved for disbursement.");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Approve Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default LogisticsPage;
