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
import { exportPageReport } from "@/lib/recordExport";
import { openPageViewer } from "@/lib/pageActions";

export const Route = createFileRoute("/management/supply-chain-management/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory Management Form · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise inventory management, multi-warehouse stock visibility, reservations, movements, transfers, valuation, and physical audits.",
      },
    ],
  }),
  component: InventoryPage,
});

/* ===========================================================================
   Data Constants & Mock State for Inventory
   =========================================================================== */

const WAREHOUSE_STOCK_ROWS = [
  {
    warehouse: "Main Warehouse (Pune Plant)",
    available: 1250,
    reserved: 150,
    onHand: 1400,
    inTransit: 180,
    value: "₹ 1,22,92,000",
    valueNum: 12292000,
    status: "Healthy",
  },
  {
    warehouse: "West Regional DC (Mumbai)",
    available: 620,
    reserved: 90,
    onHand: 710,
    inTransit: 120,
    value: "₹ 61,96,000",
    valueNum: 6196000,
    status: "Healthy",
  },
  {
    warehouse: "South Regional DC (Bengaluru)",
    available: 430,
    reserved: 60,
    onHand: 490,
    inTransit: 80,
    value: "₹ 42,98,000",
    valueNum: 4298000,
    status: "Low Stock",
  },
  {
    warehouse: "North Regional DC (Delhi Hub)",
    available: 150,
    reserved: 30,
    onHand: 180,
    inTransit: 40,
    value: "₹ 15,78,000",
    valueNum: 1578000,
    status: "Critical",
  },
];

const INVENTORY_HEALTH_DATA = [
  { name: "Healthy Stock", value: 70, count: 19915, color: "#10b981", desc: "Optimal stock levels" },
  { name: "Low Stock", value: 20, count: 5690, color: "#f59e0b", desc: "Below reorder level" },
  { name: "Critical Stock", value: 10, count: 2845, color: "#ef4444", desc: "Below safety stock" },
];

const ITEM_CATEGORY_DISTRIBUTION = [
  { category: "Finished Goods", count: 1240, value: "₹ 14.8 Cr" },
  { category: "Raw Materials", count: 2150, value: "₹ 6.2 Cr" },
  { category: "Semi-Finished", count: 540, value: "₹ 2.1 Cr" },
  { category: "Spare Parts", count: 350, value: "₹ 1.48 Cr" },
];

const INITIAL_MOVEMENTS = [
  {
    id: "MOV-2026-0891",
    type: "Stock In",
    typeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    date: "24 Sep 2026, 10:30 AM",
    item: "EV Charging Station 60KW",
    warehouse: "Main Warehouse",
    location: "Aisle 4, Rack B",
    destination: "--",
    quantity: 120,
    uom: "Nos",
    refType: "PO Receipt",
    refNo: "GRN-2026-0412",
    status: "Completed",
    remarks: "Received from Plant Line 1 assembly batch",
  },
  {
    id: "MOV-2026-0890",
    type: "Transfer Out",
    typeColor: "bg-purple-500/10 text-purple-700 border-purple-200",
    date: "24 Sep 2026, 09:15 AM",
    item: "EV Charging Station 60KW",
    warehouse: "Main Warehouse",
    location: "Dock 2",
    destination: "South Regional DC",
    quantity: -40,
    uom: "Nos",
    refType: "Stock Transfer",
    refNo: "TRF-2026-0182",
    status: "In Transit",
    remarks: "Replenishment for Bengaluru fast charging corridor",
  },
  {
    id: "MOV-2026-0889",
    type: "Stock Out",
    typeColor: "bg-blue-500/10 text-blue-700 border-blue-200",
    date: "23 Sep 2026, 04:45 PM",
    item: "EV Charging Station 60KW",
    warehouse: "Main Warehouse",
    location: "Aisle 4, Rack B",
    destination: "Fleet Dispatch",
    quantity: -25,
    uom: "Nos",
    refType: "Sales Order",
    refNo: "SO-2026-0941",
    status: "Dispatched",
    remarks: "Delivery to Tata Power commercial fleet hub",
  },
  {
    id: "MOV-2026-0888",
    type: "Adjustment",
    typeColor: "bg-amber-500/10 text-amber-700 border-amber-200",
    date: "23 Sep 2026, 02:10 PM",
    item: "EV Charging Station 60KW",
    warehouse: "West Regional DC",
    location: "Bin 14",
    destination: "--",
    quantity: 5,
    uom: "Nos",
    refType: "Audit Variance",
    refNo: "CNT-2026-0041",
    status: "Approved",
    remarks: "Physical stock audit reconciliation adjustment",
  },
  {
    id: "MOV-2026-0887",
    type: "Quality Hold",
    typeColor: "bg-rose-500/10 text-rose-700 border-rose-200",
    date: "22 Sep 2026, 11:00 AM",
    item: "EV Charging Station 60KW",
    warehouse: "Main Warehouse",
    location: "Quarantine Area",
    destination: "IQC Testing",
    quantity: -10,
    uom: "Nos",
    refType: "NCR Hold",
    refNo: "NCR-2026-0082",
    status: "Pending Inspection",
    remarks: "Insulation resistance re-test mandatory",
  },
];

const BATCH_DATA = [
  { batchNo: "BAT-2026-0312", serialRange: "SN-60K-04100 to 04220", mfgDate: "10 Mar 2026", expiryDate: "10 Mar 2028", supplierBatch: "SUP-DLT-89", warehouse: "Main Warehouse", bin: "Aisle 4, Rack B", qty: 120, quality: "Passed", status: "Active" },
  { batchNo: "BAT-2026-0288", serialRange: "SN-60K-03950 to 04099", mfgDate: "20 Feb 2026", expiryDate: "20 Feb 2028", supplierBatch: "SUP-DLT-84", warehouse: "Main Warehouse", bin: "Aisle 4, Rack B", qty: 150, quality: "Passed", status: "Active" },
  { batchNo: "BAT-2026-0195", serialRange: "SN-60K-02800 to 02949", mfgDate: "15 Jan 2026", expiryDate: "15 Jan 2028", supplierBatch: "SUP-DLT-71", warehouse: "West Regional DC", bin: "Aisle 2, Bin 10", qty: 90, quality: "Passed", status: "Reserved" },
  { batchNo: "BAT-2025-1140", serialRange: "SN-60K-01100 to 01179", mfgDate: "12 Nov 2025", expiryDate: "12 Nov 2027", supplierBatch: "SUP-DLT-62", warehouse: "South Regional DC", bin: "Aisle 1, Bin 4", qty: 40, quality: "Passed", status: "Active" },
  { batchNo: "BAT-2025-0912", serialRange: "SN-60K-00810 to 00819", mfgDate: "18 Sep 2025", expiryDate: "18 Sep 2027", supplierBatch: "SUP-DLT-51", warehouse: "Main Warehouse", bin: "Quarantine Bay", qty: 10, quality: "Under Review", status: "Quality Hold" },
];

const RESERVATION_DATA = [
  { id: "RES-2026-0412", item: "EV Charging Station 60KW", warehouse: "Main Warehouse", available: 1250, reserved: 150, type: "Sales Order", refNo: "SO-2026-0941", requiredDate: "28 Sep 2026", status: "Allocated" },
  { id: "RES-2026-0411", item: "EV Charging Station 60KW", warehouse: "West Regional DC", available: 620, reserved: 90, type: "Project Tender", refNo: "PRJ-2026-0128", requiredDate: "05 Oct 2026", status: "Allocated" },
  { id: "RES-2026-0410", item: "EV Charging Station 60KW", warehouse: "South Regional DC", available: 430, reserved: 60, type: "Highway CPO", refNo: "SO-2026-0918", requiredDate: "02 Oct 2026", status: "Allocated" },
  { id: "RES-2026-0409", item: "EV Charging Station 60KW", warehouse: "North Regional DC", available: 150, reserved: 30, type: "Govt Fleet", refNo: "SO-2026-0882", requiredDate: "12 Oct 2026", status: "Allocated" },
];

const REPLENISHMENT_DATA = [
  { item: "EV Charging Station 60KW", currentStock: 2450, reorderLevel: 1000, safetyStock: 500, maxStock: 4000, reorderQty: 800, leadTime: "12 Days", preferredSource: "Plant Production", status: "Healthy" },
  { item: "Portable AC Charger 7.4kW", currentStock: 420, reorderLevel: 800, safetyStock: 300, maxStock: 2000, reorderQty: 600, leadTime: "8 Days", preferredSource: "Assembly Line 2", status: "Replenish Required" },
  { item: "Vehicle Inlet Harness Sub-Assembly", currentStock: 680, reorderLevel: 1200, safetyStock: 500, maxStock: 3000, reorderQty: 1000, leadTime: "10 Days", preferredSource: "Electrical Harness Div", status: "Replenish Required" },
  { item: "Heavy Duty Contactor Sub-Assembly", currentStock: 310, reorderLevel: 600, safetyStock: 250, maxStock: 1500, reorderQty: 500, leadTime: "15 Days", preferredSource: "Switchgear Plant", status: "Critical Shortage" },
];

const PHYSICAL_COUNT_DATA = [
  { id: "AUD-2026-018", date: "15 Sep 2026", warehouse: "Main Warehouse (Pune)", item: "EV Charging Station 60KW", systemQty: 1395, physicalQty: 1400, variance: 5, valueImpact: "+₹ 4,39,000", countedBy: "Hemant Joshi", verifiedBy: "Meera Nambiar", status: "Reconciled" },
  { id: "AUD-2026-017", date: "10 Sep 2026", warehouse: "West Regional DC", item: "EV Charging Station 60KW", systemQty: 712, physicalQty: 710, variance: -2, valueImpact: "-₹ 1,75,600", countedBy: "Tanvi Hegde", verifiedBy: "Meera Nambiar", status: "Reconciled" },
  { id: "AUD-2026-016", date: "01 Sep 2026", warehouse: "South Regional DC", item: "EV Charging Station 60KW", systemQty: 490, physicalQty: 490, variance: 0, valueImpact: "₹ 0", countedBy: "Anil Murthy", verifiedBy: "Meera Nambiar", status: "Matched" },
];

/* ===========================================================================
   Component Definition: Inventory Form
   =========================================================================== */
function InventoryPage() {


  // Inventory Header state
  const [inventoryId, setInventoryId] = useState("INV-2026-000184");
  const [itemCode, setItemCode] = useState("EVCH-60KW");
  const [itemName, setItemName] = useState("EV Charging Station 60KW");
  const [sku, setSku] = useState("SKU-EVCH-60-IND");
  const [itemCategory, setItemCategory] = useState("Finished Goods");
  const [itemGroup, setItemGroup] = useState("DC Fast Chargers");
  const [itemType, setItemType] = useState("Finished Goods");
  const [brand, setBrand] = useState("Magnertia Electro");
  const [selectedWarehouse, setSelectedWarehouse] = useState("Main Warehouse");
  const [binLocation, setBinLocation] = useState("Aisle 4, Rack B, Bin 12");
  const [uom, setUom] = useState("Nos");
  const [hsnCode, setHsnCode] = useState("85044090");
  const [valuationMethod, setValuationMethod] = useState("FIFO");
  const [inventoryStatus, setInventoryStatus] = useState("Healthy");
  const [lastUpdated, setLastUpdated] = useState("Today, 11:45 AM");

  // Stock Snapshot state
  const [availableStock, setAvailableStock] = useState(2450);
  const [reservedStock, setReservedStock] = useState(350);
  const [onHandStock, setOnHandStock] = useState(2800);
  const [onOrderStock, setOnOrderStock] = useState(1250);
  const [inTransitStock, setInTransitStock] = useState(420);
  const [qualityHoldStock, setQualityHoldStock] = useState(80);
  const [reorderLevel, setReorderLevel] = useState(1000);
  const [safetyStock, setSafetyStock] = useState(500);

  // Operations Modals
  const [showStockInModal, setShowStockInModal] = useState(false);
  const [showStockOutModal, setShowStockOutModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showCountModal, setShowCountModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  // Stock In Form state
  const [inQty, setInQty] = useState("50");
  const [inSupplier, setInSupplier] = useState("Plant Line 1 Assembly");
  const [inBatch, setInBatch] = useState("BAT-2026-0315");
  const [inPo, setInPo] = useState("PO-2026-1042");

  // Stock Out Form state
  const [outQty, setOutQty] = useState("20");
  const [outCustomer, setOutCustomer] = useState("Tata Power CPO Hub");
  const [outRef, setOutRef] = useState("SO-2026-0945");

  // Stock Transfer Form state
  const [trfFrom, setTrfFrom] = useState("Main Warehouse");
  const [trfTo, setTrfTo] = useState("North Regional DC");
  const [trfQty, setTrfQty] = useState("30");

  // Move-in action handler
  const handleStockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(inQty) || 0;
    setOnHandStock((prev) => prev + qty);
    setAvailableStock((prev) => prev + qty);
    setShowStockInModal(false);
    toast.success(`Successfully received +${qty} Nos into ${selectedWarehouse}`, {
      description: `Batch ${inBatch} registered with Quality Pass.`,
    });
  };

  // Move-out action handler
  const handleStockOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(outQty) || 0;
    if (qty > availableStock) {
      toast.error("Insufficient available stock for issue!");
      return;
    }
    setOnHandStock((prev) => prev - qty);
    setAvailableStock((prev) => prev - qty);
    setShowStockOutModal(false);
    toast.success(`Issued ${qty} Nos for dispatch to ${outCustomer}`, {
      description: `Ref: ${outRef}. Picking list generated.`,
    });
  };

  // Transfer action handler
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(trfQty) || 0;
    setInTransitStock((prev) => prev + qty);
    setAvailableStock((prev) => prev - qty);
    setShowTransferModal(false);
    toast.success(`Inter-warehouse transfer initiated: ${qty} Nos from ${trfFrom} to ${trfTo}`, {
      description: "Transfer order created with status: In Transit.",
    });
  };

  return (
    <AppShell
      title="Inventory"
      breadcrumb="Management"
      description="Manage item-wise stock across warehouses and locations, including stock availability, reservations, movements, and physical verification."
      tabs={<SupplyChainManagementTabBar />}
      scoreBannerKey="inventory"
    >
      <div className="space-y-6">
        {/* Action Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Active Item:</span>
            <Badge variant="outline" className="font-mono text-xs font-bold text-primary bg-primary/5 border-primary/20">
              {inventoryId}
            </Badge>
            <Badge className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 text-xs">
              {inventoryStatus}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowStockInModal(true)}
              className="h-8 gap-1.5 bg-emerald-600 text-white font-semibold shadow-sm hover:bg-emerald-700 text-xs"
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              <span>Stock In</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setShowStockOutModal(true)}
              className="h-8 gap-1.5 bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 text-xs"
            >
              <ArrowUpFromLine className="h-3.5 w-3.5" />
              <span>Stock Out</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTransferModal(true)}
              className="h-8 gap-1.5 font-semibold text-xs"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-purple-600" />
              <span>Transfer</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  <span>More</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs">Inventory Operations</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowAdjustmentModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Sliders className="h-3.5 w-3.5 text-muted-foreground" /> Stock Adjustment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCountModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Scale className="h-3.5 w-3.5 text-muted-foreground" /> Physical Count Audit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowNewItemModal(true)} className="gap-2 text-xs cursor-pointer">
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" /> New Item Master
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()} className="gap-2 text-xs cursor-pointer">
                  <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print Stock Card
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void exportPageReport("Stock Sheet", "csv")} className="gap-2 text-xs cursor-pointer">
                  <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export Stock Ledger
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* ===================================================================
            SECTION 1: Dual Top Cards (Inventory Header/Item Details + Stock Snapshot)
            =================================================================== */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* LEFT CARD: Inventory Header & Item Details */}
          <div className="card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground tracking-tight">Item Master & Location</h3>
                  <Badge variant="outline" className="text-xs font-mono font-bold text-primary bg-primary/5 border-primary/20">
                    {inventoryId}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200">
                    {inventoryStatus}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">Updated {lastUpdated}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Item Code *</span>
                  <div className="mt-1 font-mono font-bold text-primary py-1">{itemCode}</div>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground block font-medium">Item Name *</span>
                  <div className="mt-1 font-semibold text-foreground py-1 truncate">{itemName}</div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">SKU</span>
                  <div className="mt-1 font-mono text-muted-foreground py-1">{sku}</div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Item Category</span>
                  <Badge variant="secondary" className="mt-1 text-[11px] font-medium">
                    {itemCategory}
                  </Badge>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Item Group</span>
                  <div className="mt-1 font-medium text-foreground py-1">{itemGroup}</div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Storage Warehouse *</span>
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <option value="Main Warehouse">Main Warehouse (Pune)</option>
                    <option value="West Regional DC">West Regional DC (Mumbai)</option>
                    <option value="South Regional DC">South Regional DC (Bengaluru)</option>
                    <option value="North Regional DC">North Regional DC (Delhi)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground block font-medium">Location / Bin</span>
                  <div className="mt-1 font-mono text-xs font-medium text-foreground py-1 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{binLocation}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">UOM</span>
                  <div className="mt-1 font-mono font-bold text-foreground py-1">{uom}</div>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Valuation Method</span>
                  <Badge variant="outline" className="mt-1 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
                    {valuationMethod}
                  </Badge>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">HSN Code</span>
                  <div className="mt-1 font-mono text-xs text-muted-foreground py-1">{hsnCode}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Batch & Serial Tracked: Active (NABL Certified)</span>
              <button
                type="button"
                onClick={() => toast.info("Serial Registry: 2,800 units active with barcode/QR tracking.")}
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                View Serial Registry <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* RIGHT CARD: Stock Snapshot (8 Metrics in 2x4 Grid + Formula Banner) */}
          <div className="card-soft p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-semibold text-base text-foreground tracking-tight">Stock Snapshot</h3>
                <span className="text-xs text-muted-foreground font-medium">Real-Time Balances</span>
              </div>

              {/* 8 Metric Cards in 2x4 Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Available Stock */}
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-semibold block">Available Stock</span>
                  <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
                    {availableStock.toLocaleString()} <span className="text-[10px] font-normal">{uom}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">Ready for Issue</span>
                </div>

                {/* Reserved Stock */}
                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-200">
                  <span className="text-[10px] text-purple-800 dark:text-purple-300 uppercase font-semibold block">Reserved Stock</span>
                  <div className="text-lg font-bold font-mono text-purple-600 mt-0.5">
                    {reservedStock.toLocaleString()} <span className="text-[10px] font-normal">{uom}</span>
                  </div>
                  <span className="text-[10px] text-purple-700 font-medium block mt-0.5">Allocated to Orders</span>
                </div>

                {/* On-Hand Stock */}
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-200">
                  <span className="text-[10px] text-blue-800 dark:text-blue-300 uppercase font-semibold block">On-Hand Stock</span>
                  <div className="text-lg font-bold font-mono text-blue-600 mt-0.5">
                    {onHandStock.toLocaleString()} <span className="text-[10px] font-normal">{uom}</span>
                  </div>
                  <span className="text-[10px] text-blue-700 font-medium block mt-0.5">Physical in Warehouse</span>
                </div>

                {/* On-Order Stock */}
                <div className="p-2.5 rounded-lg bg-muted/30 border">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">On-Order Stock</span>
                  <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                    {onOrderStock.toLocaleString()} <span className="text-[10px] font-normal">{uom}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">Confirmed Purchase</span>
                </div>

                {/* In Transit */}
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-200">
                  <span className="text-[10px] text-cyan-800 dark:text-cyan-300 uppercase font-semibold block">In Transit</span>
                  <div className="text-lg font-bold font-mono text-cyan-600 mt-0.5">
                    {inTransitStock.toLocaleString()} <span className="text-[10px] font-normal">{uom}</span>
                  </div>
                  <span className="text-[10px] text-cyan-700 font-medium block mt-0.5">Between Depots</span>
                </div>

                {/* Quality Hold */}
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-200">
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 uppercase font-semibold block">Quality Hold</span>
                  <div className="text-lg font-bold font-mono text-amber-600 mt-0.5">
                    {qualityHoldStock.toLocaleString()} <span className="text-[10px] font-normal">{uom}</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-medium block mt-0.5">Pending IQC Test</span>
                </div>

                {/* Reorder Level */}
                <div className="p-2.5 rounded-lg bg-muted/30 border">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Reorder Level</span>
                  <div className="text-lg font-bold font-mono text-foreground mt-0.5">
                    {reorderLevel.toLocaleString()} <span className="text-[10px] font-normal">{uom}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">Threshold Trigger</span>
                </div>

                {/* Safety Stock */}
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-200">
                  <span className="text-[10px] text-rose-800 dark:text-rose-300 uppercase font-semibold block">Safety Stock</span>
                  <div className="text-lg font-bold font-mono text-rose-600 mt-0.5">
                    {safetyStock.toLocaleString()} <span className="text-[10px] font-normal">{uom}</span>
                  </div>
                  <span className="text-[10px] text-rose-700 font-medium block mt-0.5">Minimum Buffer</span>
                </div>
              </div>

              {/* Formula Banner */}
              <div className="mt-3 p-2.5 rounded-lg bg-muted/15 border text-[10px] text-muted-foreground font-mono leading-relaxed">
                <span className="font-bold text-foreground font-sans">Stock Formula: </span>
                <span>Opening (2,100) + Rec (+1,200) + Trf In (+180) + Ret (+40) − Issued (-650) − Trf Out (-90) ± Adj (+20) = </span>
                <span className="text-blue-600 font-bold">On-Hand 2,800 Nos</span>
                <span className="text-foreground"> | </span>
                <span>Available = 2,800 − Reserved (350) − Quality Hold (80) = </span>
                <span className="text-emerald-600 font-bold">2,450 Nos</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t text-[11px] text-muted-foreground flex justify-between items-center">
              <span>Valuation: ₹ 2,45,87,000 (Average Unit Cost: ₹ 87,800)</span>
              <button
                type="button"
                onClick={() => toast.info("FIFO Valuation: 2,800 units at weighted avg unit cost ₹ 87,800.")}
                className="text-primary font-semibold hover:underline"
              >
                Cost Ledger →
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 2: 4 Executive KPI Cards (from Inventory Dashboard)
            =================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-blue-600 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-muted-foreground">Total Stock (All Warehouses)</span>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">28,450</div>
              <span className="text-[11px] text-muted-foreground block mt-0.5">Nos across 56 SKUs</span>
            </div>
          </div>

          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-emerald-600 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-muted-foreground">Available for Fulfillment</span>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-emerald-600">24,680</div>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">86.7% Readiness</span>
            </div>
          </div>

          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-purple-600 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-muted-foreground">Reserved Stock</span>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-purple-600">2,150</div>
              <span className="text-[11px] text-muted-foreground block mt-0.5">Allocated to Active Orders</span>
            </div>
          </div>

          <div className="card-soft p-3.5 flex flex-col justify-between border-l-4 border-l-amber-600 hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-muted-foreground">Total Inventory Value</span>
            <div className="mt-2">
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground">₹ 24.58 Cr</div>
              <span className="text-[11px] text-muted-foreground block mt-0.5">Turnover: 6.45x · Margin: 28.6%</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SECTION 3: INVENTORY MASTER WORKSPACE
            =================================================================== */}
        <div className="space-y-6">
            {/* Multi-Warehouse Table + Inventory Health Donut */}
            <div className="grid gap-5 lg:grid-cols-12">
              {/* Warehouse Table - 7 cols */}
              <div className="card-soft p-5 lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">Stock Details by Warehouse</h4>
                      <span className="text-[11px] text-muted-foreground">Multi-echelon storage allocation for EVCH-60KW</span>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono font-bold bg-primary/5 text-primary">
                      Total: 2,780 Nos
                    </Badge>
                  </div>

                  <div
                    className="mt-3 overflow-x-auto no-scrollbar scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-muted-foreground font-semibold">
                          <th className="pb-2">Warehouse</th>
                          <th className="pb-2 text-right">Available</th>
                          <th className="pb-2 text-right">Reserved</th>
                          <th className="pb-2 text-right">On-Hand</th>
                          <th className="pb-2 text-right">In Transit</th>
                          <th className="pb-2 text-right">Stock Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {WAREHOUSE_STOCK_ROWS.map((row, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 font-medium text-foreground flex items-center gap-1.5">
                              <Warehouse className="h-3 w-3 text-muted-foreground" />
                              <span>{row.warehouse}</span>
                            </td>
                            <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">{row.available.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-mono text-purple-600">{row.reserved.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-mono font-bold text-foreground">{row.onHand.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-mono text-cyan-600">{row.inTransit.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-mono font-medium text-foreground">{row.value}</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 font-bold bg-muted/20">
                          <td className="py-2.5 font-bold text-foreground">Total</td>
                          <td className="py-2.5 text-right font-mono text-emerald-600">2,450</td>
                          <td className="py-2.5 text-right font-mono text-purple-600">330</td>
                          <td className="py-2.5 text-right font-mono text-primary font-bold">2,780</td>
                          <td className="py-2.5 text-right font-mono text-cyan-600">420</td>
                          <td className="py-2.5 text-right font-mono font-bold text-foreground">₹ 2,45,87,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(true)}
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Transfer Stock Between Warehouses <ArrowRight className="h-3 w-3" />
                  </button>
                  <span className="text-[11px] text-muted-foreground">4 Active Facilities</span>
                </div>
              </div>

              {/* Inventory Health & Category Breakdown - 5 cols */}
              <div className="card-soft p-5 lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-semibold text-sm text-foreground">Inventory Health Distribution</h4>
                    <span className="text-[11px] text-muted-foreground font-medium">Optimal Band Ratio</span>
                  </div>

                  <div className="relative mt-2 h-[150px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={INVENTORY_HEALTH_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {INVENTORY_HEALTH_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-base font-bold tracking-tight text-foreground font-mono">70%</span>
                      <span className="text-[9px] text-muted-foreground font-medium">Healthy</span>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1.5 text-xs">
                    {INVENTORY_HEALTH_DATA.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 rounded-md border bg-muted/15">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-semibold text-foreground">{item.name}</span>
                          <span className="text-[10px] text-muted-foreground">({item.desc})</span>
                        </div>
                        <span className="font-mono font-bold text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-[11px] text-muted-foreground flex justify-between items-center">
                  <span>Reorder compliance: 94.2%</span>
                  <button
                    type="button"
                    onClick={() => toast.info("Inventory turnover ratio: 6.8x. Carrying cost: 18.4%.")}
                    className="text-primary font-semibold hover:underline"
                  >
                    View Anomaly Insights →
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Alerts Banner & Recent Movements */}
            <div className="grid gap-5 lg:grid-cols-12">
              {/* Inventory Alerts - 4 cols */}
              <div className="card-soft p-5 lg:col-span-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-foreground border-b pb-3">Automated Inventory Alerts</h4>
                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg border bg-amber-50/40 border-amber-200 flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-foreground">24 Items Below Reorder Level</span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Automated purchase replenishment proposals generated.</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border bg-rose-50/40 border-rose-200 flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-foreground">8 Items Below Safety Stock</span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Critical stockout risk on AC Inverters and cables.</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border bg-blue-50/40 border-blue-200 flex items-start gap-2.5">
                      <Clock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-foreground">12 Batches Expiring in &lt; 90 Days</span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Prioritize dispatch under FEFO / FIFO picking rules.</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border bg-muted/20 flex items-start gap-2.5">
                      <Coins className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-foreground">₹18.4 Lakh Slow Moving Inventory</span>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Zero movement for &gt; 120 days across 3 legacy SKUs.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-xs">
                  <button
                    type="button"
                    onClick={() => toast.info("Replenishment rules active: Auto-trigger PR when on-hand <= Reorder point.")}
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Manage Replenishment Rules <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Recent Movements Summary Table - 8 cols */}
              <div className="card-soft p-5 lg:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">Recent Stock Movements</h4>
                      <span className="text-[11px] text-muted-foreground">Real-time receipts, issues, transfers, and adjustments</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => openPageViewer("Stock Movements Ledger", e.currentTarget)}
                      className="h-7 text-xs"
                    >
                      View All Movements
                    </Button>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-muted-foreground font-semibold">
                          <th className="pb-2">Movement ID</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Date / Time</th>
                          <th className="pb-2">Warehouse</th>
                          <th className="pb-2 text-right">Qty</th>
                          <th className="pb-2">Ref Document</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {INITIAL_MOVEMENTS.map((mov) => {
                          const isPositive = mov.quantity > 0;
                          return (
                            <tr key={mov.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-2.5 font-mono font-medium text-primary">{mov.id}</td>
                              <td className="py-2.5">
                                <Badge variant="outline" className={cn("text-[10px] font-semibold", mov.typeColor)}>
                                  {mov.type}
                                </Badge>
                              </td>
                              <td className="py-2.5 text-muted-foreground">{mov.date}</td>
                              <td className="py-2.5 font-medium text-foreground">{mov.warehouse}</td>
                              <td
                                className={cn(
                                  "py-2.5 text-right font-mono font-bold",
                                  isPositive ? "text-emerald-600" : "text-rose-600"
                                )}
                              >
                                {isPositive ? `+${mov.quantity}` : mov.quantity} {mov.uom}
                              </td>
                              <td className="py-2.5 font-mono text-muted-foreground">{mov.refNo}</td>
                              <td className="py-2.5 text-right">
                                <Badge variant="secondary" className="text-[9px] font-medium">
                                  {mov.status}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-xs flex justify-between items-center text-muted-foreground">
                  <span>Showing latest 5 transactions</span>
                  <span className="font-medium text-foreground">Ledger Sync: Real-Time</span>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* ===================================================================
          MODALS & DIALOGS
          =================================================================== */}

      {/* 1. Stock In Modal */}
      <Dialog open={showStockInModal} onOpenChange={setShowStockInModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Goods Receipt (Stock In)</DialogTitle>
            <DialogDescription>Receive items into warehouse with batch and quality tracking.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockInSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Item Code</Label>
                <Input value={itemCode} disabled className="mt-1 font-mono text-xs bg-muted/30" />
              </div>
              <div>
                <Label className="text-xs">Warehouse</Label>
                <Input value={selectedWarehouse} disabled className="mt-1 text-xs bg-muted/30" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Quantity Received *</Label>
                <Input
                  type="number"
                  value={inQty}
                  onChange={(e) => setInQty(e.target.value)}
                  className="mt-1 font-mono text-xs font-bold"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Batch Number *</Label>
                <Input
                  value={inBatch}
                  onChange={(e) => setInBatch(e.target.value)}
                  className="mt-1 font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Supplier / Assembly Source</Label>
              <Input
                value={inSupplier}
                onChange={(e) => setInSupplier(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs">Purchase Order / Work Order Reference</Label>
              <Input
                value={inPo}
                onChange={(e) => setInPo(e.target.value)}
                className="mt-1 font-mono text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowStockInModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Confirm Goods Receipt
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Stock Out Modal */}
      <Dialog open={showStockOutModal} onOpenChange={setShowStockOutModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Issue Stock (Stock Out)</DialogTitle>
            <DialogDescription>Dispatch items for sales orders, production lines, or projects.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockOutSubmit} className="space-y-3.5 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-200 flex justify-between items-center">
              <span className="font-semibold text-emerald-800">Available Stock for Issue:</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">{availableStock} Nos</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Issue Quantity *</Label>
                <Input
                  type="number"
                  value={outQty}
                  onChange={(e) => setOutQty(e.target.value)}
                  max={availableStock}
                  className="mt-1 font-mono text-xs font-bold"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Reference Document</Label>
                <Input
                  value={outRef}
                  onChange={(e) => setOutRef(e.target.value)}
                  className="mt-1 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Destination / Customer / Project</Label>
              <Input
                value={outCustomer}
                onChange={(e) => setOutCustomer(e.target.value)}
                className="mt-1 text-xs"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowStockOutModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Authorize Issue & Dispatch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Inter-Warehouse Transfer Modal */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Inter-Warehouse Stock Transfer</DialogTitle>
            <DialogDescription>Transfer inventory units between regional distribution centers.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTransferSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Source Warehouse *</Label>
                <select
                  value={trfFrom}
                  onChange={(e) => setTrfFrom(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs"
                >
                  <option value="Main Warehouse">Main Warehouse (Pune)</option>
                  <option value="West Regional DC">West Regional DC (Mumbai)</option>
                  <option value="South Regional DC">South Regional DC (Bengaluru)</option>
                  <option value="North Regional DC">North Regional DC (Delhi)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Destination Warehouse *</Label>
                <select
                  value={trfTo}
                  onChange={(e) => setTrfTo(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs"
                >
                  <option value="North Regional DC">North Regional DC (Delhi)</option>
                  <option value="South Regional DC">South Regional DC (Bengaluru)</option>
                  <option value="West Regional DC">West Regional DC (Mumbai)</option>
                  <option value="Main Warehouse">Main Warehouse (Pune)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Transfer Quantity *</Label>
                <Input
                  type="number"
                  value={trfQty}
                  onChange={(e) => setTrfQty(e.target.value)}
                  className="mt-1 font-mono text-xs font-bold"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Vehicle / Transporter</Label>
                <Input defaultValue="VRL Logistics (MH-12-RN-4812)" className="mt-1 text-xs" />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowTransferModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Create Transfer Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. Stock Adjustment Modal */}
      <Dialog open={showAdjustmentModal} onOpenChange={setShowAdjustmentModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Create Stock Adjustment</DialogTitle>
            <DialogDescription>Reconcile physical inventory differences or scrap damaged stock.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Item</Label>
              <Input value={`${itemCode} - ${itemName}`} disabled className="mt-1 text-xs bg-muted/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">System Quantity</Label>
                <Input value="2,800" disabled className="mt-1 font-mono text-xs bg-muted/30" />
              </div>
              <div>
                <Label className="text-xs">Actual Physical Count</Label>
                <Input defaultValue="2,805" className="mt-1 font-mono text-xs font-bold" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Adjustment Reason</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>Physical Count Difference</option>
                <option>Damaged Stock</option>
                <option>Lost Stock</option>
                <option>Quality Rejection</option>
                <option>Data Correction</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAdjustmentModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowAdjustmentModal(false);
                toast.success("Adjustment submitted for Plant Controller approval.");
              }}
            >
              Submit Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Physical Count Audit Modal */}
      <Dialog open={showCountModal} onOpenChange={setShowCountModal}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Initiate Physical Stock Count</DialogTitle>
            <DialogDescription>Freeze stock transactions and generate audit count sheets.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div>
              <Label className="text-xs">Warehouse</Label>
              <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                <option>Main Warehouse (Pune)</option>
                <option>West Regional DC (Mumbai)</option>
                <option>South Regional DC (Bengaluru)</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Auditor / Counter</Label>
              <Input defaultValue="Hemant Joshi (Internal Audit)" className="mt-1 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCountModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowCountModal(false);
                toast.success("Physical count cycle initiated. Stock movement freeze active.");
              }}
            >
              Start Count Sheet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. New Item Master Modal */}
      <Dialog open={showNewItemModal} onOpenChange={setShowNewItemModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Create New Inventory Item Master</DialogTitle>
            <DialogDescription>Register a new product or raw material into inventory master.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Item Code *</Label>
                <Input placeholder="e.g. EVCH-120KW" className="mt-1 font-mono text-xs" />
              </div>
              <div>
                <Label className="text-xs">UOM *</Label>
                <Input defaultValue="Nos" className="mt-1 font-mono text-xs" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Item Name *</Label>
              <Input placeholder="e.g. Ultra Fast 120kW DC Charger" className="mt-1 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>Finished Goods</option>
                  <option>Raw Material</option>
                  <option>Spare Parts</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Valuation Method</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background p-2 text-xs">
                  <option>FIFO</option>
                  <option>Weighted Average</option>
                  <option>Standard Cost</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowNewItemModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowNewItemModal(false);
                toast.success("New Item Master created and registered.");
              }}
            >
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

