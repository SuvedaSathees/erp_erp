import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AssetManagementTabBar } from "@/components/erp/AssetManagementTabBar";
import { DataTablePagination } from "@/components/erp/DataTablePagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Package,
  ShieldCheck,
  TrendingDown,
  CheckCircle2,
  Wrench,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Plus,
  FileSpreadsheet,
  FileText,
  Calendar,
  ChevronDown,
  Edit2,
  Trash2,
  Sparkles,
  ArrowRight,
  QrCode,
  Hourglass,
  MoreVertical,
  Check,
  AlertTriangle,
  HelpCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
// HMR verified: all Lucide icons defined

export const Route = createFileRoute("/management/asset-management/fixed-assets")({
  head: () => ({
    meta: [
      { title: "Fixed Assets Form · Magnertia ERP" },
      {
        name: "description",
        content: "Fixed asset lifecycle management: acquisition, capitalization, tracking, depreciation, and disposal.",
      },
    ],
  }),
  component: FixedAssetsFormPage,
});

// Mock Initial Fixed Assets matching screenshot
interface FixedAsset {
  id: string;
  code?: string;
  name: string;
  category: string;
  location: string;
  purchaseDate: string;
  nbv: string;
  nbvNum: number;
  grossValue: string;
  capitalizedCost?: string;
  accumDep: string;
  accumulatedDep?: string;
  netBookValue?: string;
  status: "Active" | "Maintenance" | "Idle" | "Disposed";
  custodian: string;
  serialNo: string;
  model: string;
  usefulLife: string;
  condition: "New" | "Good" | "Fair" | "Poor";
}

const BASE_ASSET_TEMPLATES = [
  { name: "CNC Vertical Machining Center", category: "Plant & Machinery", location: "Plant 01 - Machine Shop", gross: 29.8, dep: 4.2, custodian: "Production Manager", model: "VMC-850", life: 10, status: "Active" },
  { name: "Forklift - 3 Ton Diesel", category: "Material Handling", location: "Warehouse - Main", gross: 12.5, dep: 4.1, custodian: "Warehouse Incharge", model: "FL-3000X", life: 8, status: "Active" },
  { name: "EV Charger - DC Fast 60kW", category: "EV Infrastructure", location: "Charging Hub - 01", gross: 8.2, dep: 1.3, custodian: "Operations Manager", model: "DCF-60", life: 7, status: "Active" },
  { name: "Dell PowerEdge R750xs Server", category: "IT Equipment", location: "Data Center - 01", gross: 6.5, dep: 3.4, custodian: "IT Manager", model: "R750xs", life: 5, status: "Active" },
  { name: "Company Vehicle - Executive SUV", category: "Vehicles", location: "Corporate Office", gross: 18.0, dep: 6.8, custodian: "Admin Manager", model: "SUV-Executive", life: 6, status: "Maintenance" },
  { name: "Main Factory Building Bay A", category: "Buildings", location: "Plant 01", gross: 520.0, dep: 170.0, custodian: "Facilities Head", model: "Industrial Grade A", life: 30, status: "Active" },
  { name: "Rooftop Solar Plant - 250kW", category: "Renewable Energy", location: "Plant 01 - Rooftop", gross: 145.0, dep: 25.0, custodian: "Facilities Head", model: "Grid-Tied 250", life: 25, status: "Active" },
  { name: "Ergonomic Office Workstations (20)", category: "Furniture & Fixtures", location: "Corporate Office", gross: 3.1, dep: 0.8, custodian: "HR Manager", model: "ErgoDesk Pro", life: 7, status: "Active" },
  { name: "Robotic MIG Welding Cell", category: "Plant & Machinery", location: "Plant 02 - Fabrication", gross: 42.0, dep: 8.5, custodian: "Welding Supervisor", model: "ARC-Robo-6X", life: 10, status: "Active" },
  { name: "Automated Guided Vehicle (AGV)", category: "Material Handling", location: "Plant 01 - Assembly", gross: 14.8, dep: 2.9, custodian: "Automation Lead", model: "AGV-Omni-2", life: 8, status: "Active" },
  { name: "Hydraulic Stamping Press 200T", category: "Plant & Machinery", location: "Plant 01 - Press Shop", gross: 58.0, dep: 14.2, custodian: "Press Shop Head", model: "HP-200T", life: 15, status: "Active" },
  { name: "Air Compressor Screw Type 75kW", category: "Plant & Machinery", location: "Plant 01 - Utility Bay", gross: 11.2, dep: 3.8, custodian: "Maintenance Head", model: "Comp-75S", life: 10, status: "Maintenance" },
  { name: "Core Network Distribution Switch", category: "IT Equipment", location: "Server Room B", gross: 4.8, dep: 1.6, custodian: "Network Lead", model: "Cisco-9300", life: 5, status: "Active" },
  { name: "Warehouse Overhead Crane 10 Ton", category: "Material Handling", location: "Bay 04 - Dispatch", gross: 26.5, dep: 7.1, custodian: "Logistics Head", model: "Crane-10T-G", life: 20, status: "Active" },
  { name: "Laser Cutting Machine 6kW Fiber", category: "Plant & Machinery", location: "Plant 02 - Sheet Metal", gross: 74.0, dep: 16.0, custodian: "Plant Superintendent", model: "FiberLaser-6000", life: 10, status: "Active" },
  { name: "Electric Pallet Stacker 1.5T", category: "Material Handling", location: "Finished Goods Crib", gross: 5.4, dep: 1.2, custodian: "Warehouse Supervisor", model: "EPS-1500", life: 7, status: "Idle" },
  { name: "Backup Diesel Generator 500kVA", category: "Plant & Machinery", location: "Power Substation", gross: 32.0, dep: 9.6, custodian: "Electrical Engineer", model: "DG-500-KVA", life: 15, status: "Active" },
  { name: "Coordinate Measuring Machine (CMM)", category: "Plant & Machinery", location: "QA Metrology Lab", gross: 36.5, dep: 6.2, custodian: "Quality Head", model: "CMM-Bridge-8", life: 10, status: "Active" },
  { name: "Electric Utility Van 1 Ton", category: "Vehicles", location: "Dispatch Yard", gross: 13.5, dep: 4.2, custodian: "Fleet Incharge", model: "EV-Van-Cargo", life: 8, status: "Active" },
  { name: "Heavy Duty Tool Storage Cabinets", category: "Furniture & Fixtures", location: "Central Tool Crib", gross: 2.8, dep: 0.9, custodian: "Tool Crib Incharge", model: "Lista-HD-12", life: 12, status: "Active" },
  { name: "Injection Molding Machine 350T", category: "Plant & Machinery", location: "Plant 02 - Plastics", gross: 62.0, dep: 18.4, custodian: "Molding Supervisor", model: "IMM-350-H", life: 12, status: "Active" },
  { name: "Paint Shop Spray Booth System", category: "Plant & Machinery", location: "Plant 01 - Finishing", gross: 48.0, dep: 12.0, custodian: "Finishing Head", model: "Booth-AutoFlow", life: 10, status: "Active" },
  { name: "High-Bay Racking Structure", category: "Buildings", location: "Raw Material Warehouse", gross: 85.0, dep: 19.5, custodian: "Warehouse Head", model: "Drive-In-Pallet", life: 25, status: "Active" },
  { name: "Precision Surface Grinder", category: "Plant & Machinery", location: "Tool & Die Shop", gross: 16.5, dep: 5.2, custodian: "Die Maker Lead", model: "PSG-600", life: 12, status: "Active" },
  { name: "Battery Backup UPS System 120kVA", category: "IT Equipment", location: "Data Center - 01", gross: 9.8, dep: 3.1, custodian: "Infrastructure Lead", model: "OnlineUPS-120", life: 8, status: "Active" },
  { name: "Scissor Lift Work Platform 12m", category: "Material Handling", location: "Maintenance Workshop", gross: 7.2, dep: 2.1, custodian: "Safety Officer", model: "SL-1200", life: 8, status: "Active" },
  { name: "Thermal Imaging Flir Camera", category: "Plant & Machinery", location: "Condition Monitoring Lab", gross: 4.5, dep: 1.1, custodian: "Reliability Engineer", model: "FLIR-E76", life: 6, status: "Active" },
  { name: "Waste Water Effluent Treatment Plant", category: "Buildings", location: "ETP Facility", gross: 110.0, dep: 28.0, custodian: "EHS Manager", model: "ETP-100KLD", life: 20, status: "Active" },
  { name: "Decommissioned Milling Machine", category: "Plant & Machinery", location: "Scrap Yard", gross: 18.0, dep: 17.5, custodian: "Admin Officer", model: "Mill-Legacy", life: 15, status: "Disposed" },
  { name: "Retired Logistics Pickup 2016", category: "Vehicles", location: "Disposal Bay", gross: 7.5, dep: 7.2, custodian: "Fleet Supervisor", model: "Pickup-2016", life: 8, status: "Disposed" },
];

const INITIAL_ASSETS: FixedAsset[] = Array.from({ length: 428 }, (_, i) => {
  const baseTpl = BASE_ASSET_TEMPLATES[i % BASE_ASSET_TEMPLATES.length];
  const numStr = String(i + 1).padStart(5, "0");
  const prefix =
    baseTpl.category === "Plant & Machinery" ? "PLT" :
    baseTpl.category === "Material Handling" ? "MH" :
    baseTpl.category === "EV Infrastructure" ? "EV" :
    baseTpl.category === "IT Equipment" ? "IT" :
    baseTpl.category === "Vehicles" ? "VH" :
    baseTpl.category === "Buildings" ? "BLD" :
    baseTpl.category === "Renewable Energy" ? "SOL" : "FUR";
  const id = `FA-${prefix}-${numStr}`;
  const costScale = 1 + ((i * 17) % 40) / 100;
  const grossValNum = Number((baseTpl.gross * costScale).toFixed(2));
  const depValNum = Number((baseTpl.dep * costScale).toFixed(2));
  const nbvValNum = Number(Math.max(0.1, grossValNum - depValNum).toFixed(2));

  const isCr = grossValNum >= 100;
  const grossValue = isCr ? `₹ ${(grossValNum / 100).toFixed(2)} Cr` : `₹ ${grossValNum.toFixed(2)} L`;
  const accumDep = isCr ? `₹ ${(depValNum / 100).toFixed(2)} Cr` : `₹ ${depValNum.toFixed(2)} L`;
  const nbv = isCr ? `₹ ${(nbvValNum / 100).toFixed(2)} Cr` : `₹ ${nbvValNum.toFixed(2)} L`;

  const day = ((i * 7) % 28) + 1;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[i % 12];
  const year = 2026 - (i % 6);
  const purchaseDate = `${String(day).padStart(2, "0")} ${month} ${year}`;

  const status: "Active" | "Maintenance" | "Idle" | "Disposed" =
    i % 35 === 0 ? "Disposed" :
    i % 25 === 0 ? "Maintenance" :
    i % 30 === 0 ? "Idle" : "Active";

  const condition: "New" | "Good" | "Fair" | "Poor" =
    status === "Disposed" ? "Poor" :
    status === "Maintenance" ? "Fair" :
    i % 5 === 0 ? "New" : "Good";

  return {
    id,
    code: id,
    name: i < BASE_ASSET_TEMPLATES.length ? baseTpl.name : `${baseTpl.name} #${Math.floor(i / BASE_ASSET_TEMPLATES.length) + 1}`,
    category: baseTpl.category as any,
    location: baseTpl.location,
    purchaseDate,
    nbv,
    nbvNum: nbvValNum,
    netBookValue: nbv,
    grossValue,
    capitalizedCost: grossValue,
    accumDep,
    accumulatedDep: accumDep,
    status,
    custodian: baseTpl.custodian,
    serialNo: `${baseTpl.model.split("-")[0]}-${year}-${numStr}`,
    model: baseTpl.model,
    usefulLife: `${baseTpl.life} Years`,
    condition,
  };
});

export function FixedAssetsFormPage() {
  const [assets, setAssets] = useState<FixedAsset[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["Asset Code", "Asset Name", "Category", "Location", "Capitalized Cost", "Accumulated Depreciation", "Net Book Value", "Status"];
    const rows = assets.map(a => [
      a.code || a.id,
      `"${a.name}"`,
      `"${a.category}"`,
      `"${a.location}"`,
      `"${a.capitalizedCost || a.grossValue}"`,
      `"${a.accumulatedDep || a.accumDep}"`,
      `"${a.netBookValue || a.nbv}"`,
      `"${a.status}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Fixed_Assets_Register_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fixed Asset Register exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Fixed Assets register synchronized with General Ledger!");
    }, 600);
  };

  // Modal dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isDisposalOpen, setIsDisposalOpen] = useState(false);
  const [activeAsset, setActiveAsset] = useState<FixedAsset>(INITIAL_ASSETS[0]);

  // Form State for Create Fixed Asset
  const [newAsset, setNewAsset] = useState({
    name: "CNC Vertical Machining Center",
    category: "Plant & Machinery",
    assetClass: "Production Equipment",
    assetType: "Tangible",
    tagNo: "FA-PLT-00241",
    serialNo: "VMC-2026-00871",
    manufacturer: "Haas Automation",
    model: "VMC-850",
    supplier: "Makino Machinery India",
    poNumber: "PO-2026-0148",
    invoiceNumber: "INV-2026-0912",
    purchaseDate: "2026-09-01",
    capDate: "2026-09-15",
    purchaseCost: 2800000,
    freight: 40000,
    installation: 120000,
    otherCost: 20000,
    department: "Production",
    costCenter: "CC-PRD-001",
    location: "Plant 01 -> Machine Shop",
    custodian: "Production Manager",
    project: "PRJ-2026-0195",
    usefulLife: 10,
    depMethod: "Straight Line",
  });

  const totalCapCost =
    Number(newAsset.purchaseCost) +
    Number(newAsset.freight) +
    Number(newAsset.installation) +
    Number(newAsset.otherCost);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch =
        a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.custodian.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === "All" || a.category === selectedCategory;
      const matchStatus = selectedStatus === "All" || a.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [assets, searchQuery, selectedCategory, selectedStatus]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Paginated Assets
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, currentPage, pageSize]);

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FixedAsset = {
      id: newAsset.tagNo || `FA-${Date.now().toString().slice(-5)}`,
      name: newAsset.name,
      category: newAsset.category,
      location: newAsset.location,
      purchaseDate: newAsset.purchaseDate,
      nbv: `₹ ${(totalCapCost / 100000).toFixed(2)} L`,
      nbvNum: totalCapCost / 100000,
      grossValue: `₹ ${(totalCapCost / 100000).toFixed(2)} L`,
      accumDep: "₹ 0.00 L",
      status: "Active",
      custodian: newAsset.custodian,
      serialNo: newAsset.serialNo,
      model: newAsset.model,
      usefulLife: `${newAsset.usefulLife} Years`,
      condition: "New",
    };
    setAssets([created, ...assets]);
    setIsCreateOpen(false);
    toast.success(`Fixed Asset ${created.id} capitalized successfully for ₹ ${(totalCapCost / 100000).toFixed(2)} Lakhs!`);
  };

  const handleDisposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAssets(
      assets.map((a) => (a.id === activeAsset.id ? { ...a, status: "Disposed" as const } : a))
    );
    setIsDisposalOpen(false);
    toast.success(`Asset ${activeAsset.id} disposed with sale proceeds posted to ledger.`);
  };

  return (
    <AppShell
      title="Fixed Assets Form"
      breadcrumb="Management > Asset Management > Fixed Assets"
      description="Manage the complete lifecycle of fixed assets from acquisition to disposal with depreciation, maintenance and reporting."
      tabs={<AssetManagementTabBar />}
    >
      <div className="w-full space-y-4">
        {/* ====================================================================
           1. ACTION HEADER CARD (Matching exact screenshot with date & buttons)
           ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap">
            {/* Title in Single Line */}
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Fixed Assets Form
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; Complete lifecycle from acquisition to disposal with depreciation and reporting
              </span>
            </div>

            {/* Header Right Actions in Single Line */}
            <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
              {/* Date Range Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold rounded-lg border border-border/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer whitespace-nowrap"
                  >
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{dateRange}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs">
                  <DropdownMenuItem onClick={() => { setDateRange("01 Sep 2026 - 30 Sep 2026"); toast.success("Selected Current Month: Sep 2026"); }}>
                    September 2026 (Current Month)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDateRange("01 Aug 2026 - 31 Aug 2026"); toast.success("Selected Previous Month: Aug 2026"); }}>
                    August 2026 (Previous Month)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDateRange("01 Jul 2026 - 30 Sep 2026"); toast.success("Selected Q3 2026"); }}>
                    Q3 2026 (Quarter-to-Date)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setDateRange("01 Apr 2026 - 31 Mar 2027"); toast.success("Selected Fiscal Year 2026-27"); }}>
                    FY 2026-27 (Full Fiscal Year)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Export</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-xs">
                  <DropdownMenuItem onClick={handleExportCsv}>
                    Export to CSV (.csv)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported Fixed Asset Register (.xlsx)"); }}>
                    Export to Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print / Export PDF (.pdf)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reports Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <span>Reports</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 text-xs">
                  <DropdownMenuItem onClick={() => toast.info("Opening Asset Capitalization Report...")}>
                    Capitalization Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Depreciation Schedule Forecast...")}>
                    Depreciation Schedule
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Physical Verification Variance Report...")}>
                    Verification Variance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Asset Disposal & Gain/Loss Report...")}>
                    Disposal & Gain/Loss
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + Create Asset Primary Button */}
              <Button
                onClick={() => setIsCreateOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Asset</span>
              </Button>

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 cursor-pointer">
                    <span>More Actions</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 text-xs">
                  <DropdownMenuItem onClick={() => toast.info("Import Assets: Select CSV / Excel file")}>
                    Import Assets (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsVerifyOpen(true)}>
                    Physical Verification Run
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Depreciation Run for Sep 2026 executed: ₹ 11.80 L posted.")}>
                    Post Monthly Depreciation
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsTransferOpen(true)}>
                    Transfer Asset Location
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print Asset Tags & Barcodes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* ====================================================================
           2. TOP 6 METRIC KPI CARDS (Matching exact layout from screenshot)
           ==================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Assets */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Total Assets</span>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">428</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All Assets</span>
            </div>
          </div>

          {/* Card 2: Gross Asset Value */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Gross Asset Value</span>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">₹ 18.60 Cr</span>
              <span className="block text-[10px] text-muted-foreground font-medium">100% of Total</span>
            </div>
          </div>

          {/* Card 3: Net Book Value */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Net Book Value</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">₹ 13.20 Cr</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                70.97% of Gross Value
              </span>
            </div>
          </div>

          {/* Card 4: Capital Work in Progress (CWIP) */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">CWIP (In Progress)</span>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-blue-600">₹ 1.85 Cr</span>
              <span className="block text-[10px] text-blue-700 dark:text-blue-400 font-medium">
                4 Expansion Projects
              </span>
            </div>
          </div>

          {/* Card 5: Capital Additions (YTD) */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Capital Additions YTD</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">+₹ 2.45 Cr</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                38 Assets Capitalized
              </span>
            </div>
          </div>

          {/* Card 6: Physical Verification Audit */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Physical Audit Status</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">98.6%</span>
              <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                Verified Q2 &bull; 100% Tagged
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           3. MIDDLE SECTION (4 CARDS: Compact, Small & Balanced)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Asset Portfolio by Category (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Portfolio by Category
              </CardTitle>
              <Badge variant="outline" className="text-[9.5px] font-mono font-bold bg-primary/5 text-primary border-primary/20">
                ₹ 18.60 Cr
              </Badge>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 drop-shadow-xs" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="138.7" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="205.5" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="232.5" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">428</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Assets</span>
                  </div>
                </div>

                <div className="flex-1 space-y-0.5 text-[10px]">
                  {[
                    { name: "Plant & Mach.", val: "₹ 7.80 Cr", color: "bg-blue-600" },
                    { name: "Buildings", val: "₹ 5.20 Cr", color: "bg-emerald-500" },
                    { name: "Vehicles", val: "₹ 2.10 Cr", color: "bg-amber-500" },
                    { name: "IT Systems", val: "₹ 1.40 Cr", color: "bg-purple-500" },
                    { name: "Furniture", val: "₹ 0.80 Cr", color: "bg-cyan-500" },
                    { name: "Other Capital", val: "₹ 1.30 Cr", color: "bg-slate-500" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      onClick={() => setSelectedCategory(selectedCategory === item.name ? "All" : item.name)}
                      className="flex justify-between items-center py-0.5 px-1 rounded hover:bg-muted/40 cursor-pointer"
                    >
                      <span className="flex items-center gap-1 truncate text-slate-700 dark:text-slate-300">
                        <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", item.color)} />
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white text-[9.5px] shrink-0">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Tangible: <strong className="text-slate-900 dark:text-white font-mono">92.5%</strong></span>
                <span>Avg Age: <strong className="text-slate-900 dark:text-white font-mono">4.8 Yrs</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Asset Status Overview (Compact Bar Chart) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Status Overview
              </CardTitle>
              <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                93.7% Ready
              </span>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="h-24 flex items-end justify-between gap-2 px-2 pb-1 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg border border-border/40">
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold font-mono text-emerald-600">401</span>
                  <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: "60px" }} />
                  <span className="text-[8.5px] text-slate-700 dark:text-slate-300 font-semibold">Active</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold font-mono text-amber-600">12</span>
                  <div className="w-full bg-amber-500 rounded-t-sm" style={{ height: "16px" }} />
                  <span className="text-[8.5px] text-slate-700 dark:text-slate-300 font-semibold">Maint.</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold font-mono text-blue-600">8</span>
                  <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: "12px" }} />
                  <span className="text-[8.5px] text-slate-700 dark:text-slate-300 font-semibold">Standby</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-bold font-mono text-rose-600">7</span>
                  <div className="w-full bg-rose-500 rounded-t-sm" style={{ height: "10px" }} />
                  <span className="text-[8.5px] text-slate-700 dark:text-slate-300 font-semibold">Disposed</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between items-center px-1.5 py-0.5 rounded bg-emerald-50/60 dark:bg-emerald-950/20">
                  <span className="text-emerald-800 dark:text-emerald-300">Active In-Service</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">401 (93.7%)</span>
                </div>
                <div className="flex justify-between items-center px-1.5 py-0.5 rounded bg-amber-50/60 dark:bg-amber-950/20">
                  <span className="text-amber-800 dark:text-amber-300">Scheduled Maint.</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300">12 (2.8%)</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1 border-t border-border/40 text-muted-foreground">
                <span>Uptime SLA: <strong className="text-emerald-600 font-mono">99.2%</strong></span>
                <span>Audit Ready: <strong className="text-primary font-mono">100%</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Capital Additions & CWIP (Compact SVG Bar) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Capex & Additions
              </CardTitle>
              <span className="text-[9.5px] font-mono font-bold text-emerald-600">+₹ 2.45 Cr</span>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="h-24 w-full bg-slate-50/60 dark:bg-slate-800/40 rounded-lg p-2 border border-border/40">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 80">
                  <line x1="10" y1="15" x2="230" y2="15" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 2" />
                  <line x1="10" y1="40" x2="230" y2="40" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 2" />
                  <line x1="10" y1="65" x2="230" y2="65" stroke="currentColor" strokeOpacity="0.12" />

                  {/* Q1 */}
                  <rect x="25" y="32" width="24" height="33" rx="2" fill="#3b82f6" />
                  <text x="37" y="27" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="currentColor">₹52L</text>

                  {/* Q2 */}
                  <rect x="80" y="15" width="24" height="50" rx="2" fill="#2563eb" />
                  <text x="92" y="11" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="#2563eb">₹84L</text>

                  {/* Q3 */}
                  <rect x="135" y="24" width="24" height="41" rx="2" fill="#3b82f6" />
                  <text x="147" y="20" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="currentColor">₹65L</text>

                  {/* Q4 */}
                  <rect x="190" y="38" width="24" height="27" rx="2" fill="#93c5fd" stroke="#2563eb" strokeDasharray="2 2" />
                  <text x="202" y="34" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="currentColor">₹44L*</text>
                </svg>
              </div>

              <div className="flex justify-between text-[8.5px] font-mono text-muted-foreground px-1">
                <span>Q1 (Act)</span>
                <span>Q2 (Act)</span>
                <span>Q3 (Curr)</span>
                <span>Q4 (Proj)</span>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1 border-t border-border/40 text-muted-foreground">
                <span>CWIP: <strong className="text-primary font-mono">₹ 1.85 Cr</strong></span>
                <span>Budget Util: <strong className="text-emerald-600 font-mono">78.4%</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Valuation & Net Book Summary (Compact) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Asset Valuation
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening Asset Valuation Ledger")}
                className="text-[9.5px] text-primary font-bold hover:underline cursor-pointer"
              >
                Ledger &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3 space-y-1 text-[10.5px]">
              <div className="flex justify-between py-0.5 border-b border-border/20">
                <span className="text-muted-foreground">Gross Book Value</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 18.60 Cr</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/20">
                <span className="text-muted-foreground">Accum. Depreciation</span>
                <span className="font-mono font-bold text-amber-600">₹ 5.40 Cr</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/20">
                <span className="text-muted-foreground">Net Book Value</span>
                <span className="font-mono font-bold text-emerald-600">₹ 13.20 Cr</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-border/20">
                <span className="text-muted-foreground">Monthly Dep. Rate</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">₹ 11.80 L</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-muted-foreground">Additions / Disposals</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">+38 / -4</span>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Health Score: <strong className="text-emerald-600 font-mono">82/100</strong></span>
                <span>Dep. Method: <strong className="text-slate-800 dark:text-slate-200 font-mono">SLM (Co. Act)</strong></span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. RECENT FIXED ASSETS MASTER TABLE (Full 12 Columns with zero blowout)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Recent Fixed Assets
                <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                  {filteredAssets.length} items
                </Badge>
              </CardTitle>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs w-48 sm:w-60 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedStatus("All");
                    toast.info("Cleared filters");
                  }}
                  className="h-8 text-xs gap-1 cursor-pointer"
                  title="Reset filters"
                >
                  <Filter className="h-3.5 w-3.5 text-slate-500" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Syncing Fixed Asset Register...")}
                  className="h-8 text-xs gap-1 cursor-pointer"
                  title="Refresh register"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Columns visible: All 9 asset master attributes.")}
                  className="h-8 text-xs gap-1 cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                  Columns
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30 text-[11px] text-muted-foreground font-semibold">
                    <th className="p-3 pl-4">Asset ID</th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Location</th>
                    <th className="p-3 font-mono">Purchase Date</th>
                    <th className="p-3 font-mono">NBV (₹)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Custodian</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-muted-foreground">
                        No fixed assets match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        onClick={() => {
                          setActiveAsset(asset);
                          setIsDetailsOpen(true);
                        }}
                        className="hover:bg-muted/40 cursor-pointer transition-colors"
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary whitespace-nowrap">
                          {asset.id}
                        </td>
                        <td className="p-3 font-medium text-slate-900 dark:text-white">
                          <div>
                            <span className="font-semibold">{asset.name}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono">
                              SN: {asset.serialNo} &bull; Model: {asset.model}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {asset.category}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {asset.location}
                        </td>
                        <td className="p-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {asset.purchaseDate}
                        </td>
                        <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          <div>
                            <span>{asset.nbv}</span>
                            <span className="block text-[10px] text-muted-foreground">
                              Cost: {asset.grossValue}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold border inline-block",
                              asset.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : asset.status === "Maintenance"
                                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                                : asset.status === "Idle"
                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
                                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                            )}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">
                          {asset.custodian}
                        </td>
                        <td className="p-3 pr-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAsset(asset);
                                setIsDetailsOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="View Asset Details"
                            >
                              <FileText className="h-3.5 w-3.5 text-blue-600" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAsset(asset);
                                setIsScheduleOpen(true);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Depreciation Schedule"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAsset(asset);
                                setIsDisposalOpen(true);
                              }}
                              className="p-1 rounded hover:text-rose-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Dispose / Scrap Asset"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Functional Pagination */}
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalEntries={filteredAssets.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[8, 10, 20, 50, 100]}
              entityName="assets"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. BOTTOM 4 ANALYTICS CARDS (Depreciation, Ageing, Condition, End-of-Life)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Depreciation This Year */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Depreciation This Year
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
              <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* Plant & Machinery: 58.5% */}
                  <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  {/* Buildings: 24.6% */}
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="139.6" />
                  {/* Vehicles: 8.2% */}
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="198.3" />
                  {/* IT Equipment: 5.7% */}
                  <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="217.9" />
                  {/* Others: 3.0% */}
                  <circle cx="50" cy="50" r="38" stroke="#64748b" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="231.5" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">₹ 1.42 Cr</span>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Total</span>
                </div>
              </div>

              <div className="space-y-1 text-[10.5px]">
                {[
                  { name: "Plant & Machinery", val: "58.5% (₹ 0.83 Cr)", color: "bg-blue-600" },
                  { name: "Buildings", val: "24.6% (₹ 0.35 Cr)", color: "bg-emerald-500" },
                  { name: "Vehicles", val: "8.2% (₹ 0.12 Cr)", color: "bg-amber-500" },
                  { name: "IT Equipment", val: "5.7% (₹ 0.08 Cr)", color: "bg-purple-500" },
                  { name: "Others", val: "3.0% (₹ 0.04 Cr)", color: "bg-slate-500" },
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <div className={cn("h-2 w-2 rounded-full", item.color)} /> {item.name}
                    </span>
                    <span className="font-mono text-muted-foreground text-[10px]">{item.val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Asset Ageing */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Asset Ageing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-2 text-[11px] pt-1">
                {[
                  { label: "< 1 Year", count: 62, max: 150, color: "bg-teal-500" },
                  { label: "1 - 3 Years", count: 118, max: 150, color: "bg-blue-600" },
                  { label: "3 - 5 Years", count: 104, max: 150, color: "bg-emerald-500" },
                  { label: "5 - 10 Years", count: 92, max: 150, color: "bg-amber-500" },
                  { label: "> 10 Years", count: 52, max: 150, color: "bg-rose-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-0.5">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className={item.color} style={{ width: `${(item.count / item.max) * 100}%`, height: "100%" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                <span>0</span>
                <span>30</span>
                <span>60</span>
                <span>90</span>
                <span>120</span>
                <span>150</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Condition Overview */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Condition Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
              <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* Good: 64.5% (276) */}
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  {/* Fair: 22.4% (96) */}
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="154.0" />
                  {/* Poor: 9.6% (41) */}
                  <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="207.5" />
                  {/* New: 3.5% (15) */}
                  <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="230.4" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">428</span>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Total</span>
                </div>
              </div>

              <div className="space-y-1 text-[10.5px]">
                {[
                  { name: "Good", val: "276 (64.5%)", color: "bg-emerald-500" },
                  { name: "Fair", val: "96 (22.4%)", color: "bg-amber-500" },
                  { name: "Poor", val: "41 (9.6%)", color: "bg-orange-500" },
                  { name: "New", val: "15 (3.5%)", color: "bg-blue-500" },
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <div className={cn("h-2 w-2 rounded-full", item.color)} /> {item.name}
                    </span>
                    <span className="font-mono text-muted-foreground text-[10px]">{item.val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Assets Near End of Life */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Assets Near End of Life
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mt-2">
                <Hourglass className="h-7 w-7 animate-pulse" />
              </div>

              <div>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white block">
                  6
                </span>
                <span className="text-xs text-muted-foreground font-semibold">Assets Exceeding Useful Life</span>
              </div>

              <div className="w-full p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 text-xs">
                <span className="text-muted-foreground block text-[10px]">Total Impaired / Residual NBV</span>
                <span className="font-bold font-mono text-rose-600 text-sm">₹ 1.85 Cr</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info("Filtered for 6 assets near end of life: CNC-01, Forklift-02, Server-03...");
                  setSearchQuery("Server");
                }}
                className="w-full text-xs text-primary font-bold cursor-pointer"
              >
                View Details &rarr;
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           6. FOOTER WITH SHORTCUTS & COPYRIGHT
           ==================================================================== */}
        <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <span>&copy; 2026 Magnertia ERP. All rights reserved.</span>
          <div className="flex items-center gap-4 text-[10px]">
            <span>Shortcuts:</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">D</kbd> Dashboard</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">A</kbd> Assets</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">E</kbd> Expenses</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">M</kbd> Maintenance</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">R</kbd> Reports</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">H</kbd> Help</span>
          </div>
        </div>

        {/* ====================================================================
           MODAL 1: CREATE FIXED ASSET (With Capitalized Cost Breakdown)
           ==================================================================== */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>Create Fixed Asset</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  DRAFT
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Capitalize tangible or intangible company-owned property into the Fixed Asset Master register.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateAsset} className="space-y-4 text-xs pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset Name *</Label>
                  <Input
                    required
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset Category *</Label>
                  <Select
                    value={newAsset.category}
                    onValueChange={(val) => setNewAsset({ ...newAsset, category: val })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Plant & Machinery">Plant & Machinery</SelectItem>
                      <SelectItem value="Buildings">Buildings</SelectItem>
                      <SelectItem value="Vehicles">Vehicles</SelectItem>
                      <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                      <SelectItem value="Material Handling">Material Handling</SelectItem>
                      <SelectItem value="EV Infrastructure">EV Infrastructure</SelectItem>
                      <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                      <SelectItem value="Furniture & Fixtures">Furniture & Fixtures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset Tag / Code</Label>
                  <Input
                    value={newAsset.tagNo}
                    onChange={(e) => setNewAsset({ ...newAsset, tagNo: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Serial Number</Label>
                  <Input
                    value={newAsset.serialNo}
                    onChange={(e) => setNewAsset({ ...newAsset, serialNo: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Model Number</Label>
                  <Input
                    value={newAsset.model}
                    onChange={(e) => setNewAsset({ ...newAsset, model: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Purchase Details */}
              <div className="p-3 bg-muted/20 rounded-lg space-y-2 border border-border/40">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                  Purchase & Acquisition Trail
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Supplier</Label>
                    <Input
                      value={newAsset.supplier}
                      onChange={(e) => setNewAsset({ ...newAsset, supplier: e.target.value })}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Purchase Order</Label>
                    <Input
                      value={newAsset.poNumber}
                      onChange={(e) => setNewAsset({ ...newAsset, poNumber: e.target.value })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Invoice No.</Label>
                    <Input
                      value={newAsset.invoiceNumber}
                      onChange={(e) => setNewAsset({ ...newAsset, invoiceNumber: e.target.value })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Purchase Date</Label>
                    <Input
                      type="date"
                      value={newAsset.purchaseDate}
                      onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Capitalization Date</Label>
                    <Input
                      type="date"
                      value={newAsset.capDate}
                      onChange={(e) => setNewAsset({ ...newAsset, capDate: e.target.value })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Capitalized Cost Breakdown */}
              <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg space-y-2 border border-blue-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-blue-900 dark:text-blue-200">
                    Capitalized Cost Calculation (Eligible Capex)
                  </span>
                  <span className="font-mono font-extrabold text-blue-700 dark:text-blue-300">
                    Total: ₹ {(totalCapCost / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Purchase Cost (₹)</Label>
                    <Input
                      type="number"
                      value={newAsset.purchaseCost}
                      onChange={(e) => setNewAsset({ ...newAsset, purchaseCost: Number(e.target.value) })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Freight (₹)</Label>
                    <Input
                      type="number"
                      value={newAsset.freight}
                      onChange={(e) => setNewAsset({ ...newAsset, freight: Number(e.target.value) })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Installation (₹)</Label>
                    <Input
                      type="number"
                      value={newAsset.installation}
                      onChange={(e) => setNewAsset({ ...newAsset, installation: Number(e.target.value) })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Other Cap Cost (₹)</Label>
                    <Input
                      type="number"
                      value={newAsset.otherCost}
                      onChange={(e) => setNewAsset({ ...newAsset, otherCost: Number(e.target.value) })}
                      className="h-7 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Custodian */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Department</Label>
                  <Input
                    value={newAsset.department}
                    onChange={(e) => setNewAsset({ ...newAsset, department: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Cost Center</Label>
                  <Input
                    value={newAsset.costCenter}
                    onChange={(e) => setNewAsset({ ...newAsset, costCenter: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Custodian Person</Label>
                  <Input
                    value={newAsset.custodian}
                    onChange={(e) => setNewAsset({ ...newAsset, custodian: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Capitalize Asset
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: ASSET DETAIL VIEW
           ==================================================================== */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <span>{activeAsset.id} &mdash; {activeAsset.name}</span>
                </DialogTitle>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                  {activeAsset.status}
                </Badge>
              </div>
              <DialogDescription className="text-xs">
                Master Asset Information, Financial Position, Location & Custodian Trail.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs pt-1">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 rounded-lg border border-border/40">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Category & Model</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {activeAsset.category} &bull; {activeAsset.model}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Serial Number</span>
                  <span className="font-mono font-bold">{activeAsset.serialNo}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Location</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{activeAsset.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Custodian</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{activeAsset.custodian}</span>
                </div>
              </div>

              {/* Financial Position */}
              <div className="p-3 bg-blue-50/30 dark:bg-blue-950/20 rounded-lg border border-blue-200/40 space-y-2">
                <span className="font-bold text-[11px] text-blue-900 dark:text-blue-200 block">
                  Financial Valuation & Book Position
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                    <span className="text-[10px] text-muted-foreground block">Acquisition Cost</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{activeAsset.grossValue}</span>
                  </div>
                  <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                    <span className="text-[10px] text-muted-foreground block">Accumulated Dep.</span>
                    <span className="font-mono font-bold text-amber-600">{activeAsset.accumDep}</span>
                  </div>
                  <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                    <span className="text-[10px] text-muted-foreground block">Impairment</span>
                    <span className="font-mono font-bold text-slate-500">₹ 0.00 L</span>
                  </div>
                  <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                    <span className="text-[10px] text-muted-foreground block">Net Book Value</span>
                    <span className="font-mono font-bold text-emerald-600">{activeAsset.nbv}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setIsScheduleOpen(true);
                    }}
                    className="text-xs"
                  >
                    Depreciation Schedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setIsTransferOpen(true);
                    }}
                    className="text-xs"
                  >
                    Transfer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setIsVerifyOpen(true);
                    }}
                    className="text-xs"
                  >
                    Verify Tag
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setIsDisposalOpen(true);
                  }}
                  className="text-xs"
                >
                  Disposal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: DEPRECIATION SCHEDULE
           ==================================================================== */}
        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Depreciation Schedule &mdash; {activeAsset.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Monthly straight-line depreciation schedule across useful life (10 Years).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="grid grid-cols-4 gap-2 text-center p-2 bg-muted/20 rounded-lg">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Useful Life</span>
                  <span className="font-bold">10 Years</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Depreciable Amt</span>
                  <span className="font-bold font-mono">₹ 27.80 L</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Annual Dep</span>
                  <span className="font-bold font-mono">₹ 2.78 L</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Monthly Dep</span>
                  <span className="font-bold font-mono text-primary">₹ 23,167</span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/30 text-[10px] font-semibold border-b">
                    <tr>
                      <th className="p-2 pl-3">Period</th>
                      <th className="p-2 font-mono">Opening NBV</th>
                      <th className="p-2 font-mono">Depreciation</th>
                      <th className="p-2 font-mono">Closing NBV</th>
                      <th className="p-2 pr-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                    {[
                      { period: "Sep-2026", open: "₹ 25.83 L", dep: "₹ 0.23 L", close: "₹ 25.60 L", status: "Posted" },
                      { period: "Oct-2026", open: "₹ 25.60 L", dep: "₹ 0.23 L", close: "₹ 25.37 L", status: "Planned" },
                      { period: "Nov-2026", open: "₹ 25.37 L", dep: "₹ 0.23 L", close: "₹ 25.14 L", status: "Planned" },
                      { period: "Dec-2026", open: "₹ 25.14 L", dep: "₹ 0.23 L", close: "₹ 24.91 L", status: "Planned" },
                      { period: "Jan-2027", open: "₹ 24.91 L", dep: "₹ 0.23 L", close: "₹ 24.68 L", status: "Planned" },
                    ].map((row) => (
                      <tr key={row.period} className="hover:bg-muted/10">
                        <td className="p-2 pl-3 font-sans font-medium">{row.period}</td>
                        <td className="p-2">{row.open}</td>
                        <td className="p-2 text-amber-600 font-bold">{row.dep}</td>
                        <td className="p-2 text-emerald-600 font-bold">{row.close}</td>
                        <td className="p-2 pr-3 text-center font-sans">
                          <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold", row.status === "Posted" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800")}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setIsScheduleOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 4: ASSET TRANSFER WORKSPACE
           ==================================================================== */}
        <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Transfer Asset &mdash; {activeAsset.id}</DialogTitle>
              <DialogDescription className="text-xs">
                Request physical movement and custodian reassignment with audit approval.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-muted/20 border space-y-1">
                <span className="text-[10px] text-muted-foreground block">Current Location & Custodian</span>
                <span className="font-semibold text-slate-900 dark:text-white block">{activeAsset.location}</span>
                <span className="text-muted-foreground text-[11px] block">{activeAsset.custodian}</span>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px]">Destination Location</Label>
                <Input defaultValue="Plant 02 - Assembly Bay 04" className="h-8 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px]">New Custodian</Label>
                <Input defaultValue="Plant 02 Production Lead" className="h-8 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px]">Reason for Movement</Label>
                <Input defaultValue="Capacity rebalancing for line expansion" className="h-8 text-xs" />
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsTransferOpen(false)}>Cancel</Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsTransferOpen(false);
                    toast.success(`Transfer initiated for ${activeAsset.id}. Approval sent to Plant Manager.`);
                  }}
                  className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white"
                >
                  Submit Transfer
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 5: PHYSICAL VERIFICATION & QR CODE TAG
           ==================================================================== */}
        <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
          <DialogContent className="max-w-sm text-center">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-center gap-1.5">
                <QrCode className="h-4 w-4 text-primary" />
                Physical Verification Tag
              </DialogTitle>
              <DialogDescription className="text-xs">
                Scan barcode or mobile QR code to perform tag reconciliation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <div className="h-36 w-36 mx-auto p-2 bg-white rounded-xl border shadow-inner flex items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="25" height="25" fill="black" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="black" />

                  <rect x="65" y="10" width="25" height="25" fill="black" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="black" />

                  <rect x="10" y="65" width="25" height="25" fill="black" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="black" />

                  <rect x="45" y="45" width="10" height="10" fill="black" />
                  <rect x="40" y="20" width="10" height="10" fill="black" />
                  <rect x="65" y="55" width="15" height="15" fill="black" />
                </svg>
              </div>

              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                {activeAsset.id} &bull; {activeAsset.name}
              </div>
              <span className="text-[10px] text-muted-foreground block">
                Registered Location: {activeAsset.location}
              </span>

              <div className="p-2 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Tag & Location Verified Matches Master Record
              </div>

              <DialogFooter>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsVerifyOpen(false);
                    toast.success(`Asset ${activeAsset.id} marked physically verified for Q3 2026.`);
                  }}
                >
                  Confirm Physical Audit
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 6: ASSET DISPOSAL WORKFLOW
           ==================================================================== */}
        <Dialog open={isDisposalOpen} onOpenChange={setIsDisposalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-rose-600 flex items-center gap-1.5">
                <Trash2 className="h-4 w-4" />
                Asset Disposal & Accounting Closure
              </DialogTitle>
              <DialogDescription className="text-xs">
                Retire, sell, or scrap asset. Calculates Gain/Loss and derecognizes NBV.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleDisposalSubmit} className="space-y-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-muted/20 border space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset</span>
                  <span className="font-bold">{activeAsset.id} &mdash; {activeAsset.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrying NBV</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{activeAsset.nbv}</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px]">Disposal Method</Label>
                <Select defaultValue="Sale">
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="Sale">Sale to Third Party</SelectItem>
                    <SelectItem value="Scrap">Scrap / Salvage</SelectItem>
                    <SelectItem value="Write-Off">Write-Off (Impaired)</SelectItem>
                    <SelectItem value="Donation">Donation / Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Sale Proceeds (₹)</Label>
                  <Input defaultValue="320000" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Disposal Cost (₹)</Label>
                  <Input defaultValue="20000" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="p-2 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs flex justify-between font-semibold">
                <span>Estimated Gain / (Loss) on Disposal:</span>
                <span className="font-mono font-bold">+₹ 50,000</span>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsDisposalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="destructive" type="submit">
                  Execute Disposal
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default FixedAssetsFormPage;
