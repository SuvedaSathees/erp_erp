import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AssetManagementTabBar } from "@/components/erp/AssetManagementTabBar";
import { DataTablePagination } from "@/components/erp/DataTablePagination";
import { AssetVisual } from "@/components/erp/AssetVisual";
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
  Calendar,
  Box,
  MapPin,
  Truck,
  ArrowLeftRight,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Plus,
  ChevronDown,
  Search,
  Filter,
  SlidersHorizontal,
  Edit2,
  QrCode,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/asset-management/asset-tracking")({
  head: () => ({
    meta: [
      { title: "Asset Tracking Dashboard · Magnertia ERP" },
      {
        name: "description",
        content: "Track and monitor the real-time location, movement and status of assets.",
      },
    ],
  }),
  component: AssetTrackingDashboardPage,
});

interface TrackedAsset {
  id: string;
  name: string;
  qrCode: string;
  location: string;
  department: string;
  custodian: string;
  status: "Operational" | "In Transit" | "Under Maintenance" | "Idle";
  lastMovement: string;
  serialNumber: string;
  lastVerified: string;
  nextVerification: string;
}

const BASE_TRACK_TEMPLATES = [
  { name: "CNC VMC-850", location: "Plant 01 • Machine Shop", dept: "Production", cust: "Prod. Manager", status: "Operational" as const },
  { name: "Air Compressor 75kW", location: "Plant 01 • Utility Area", dept: "Utilities", cust: "Utility Manager", status: "Operational" as const },
  { name: "Forklift 3 Ton", location: "Warehouse A", dept: "Logistics", cust: "Store Manager", status: "Operational" as const },
  { name: "Generator 125kVA", location: "Plant 02 • Power House", dept: "Facilities", cust: "Facility Manager", status: "Operational" as const },
  { name: "EV Charger 60kW", location: "Project Site - Alpha", dept: "Projects", cust: "Project Manager", status: "In Transit" as const },
  { name: "Hydraulic Press 200T", location: "Plant 01 • Maintenance", dept: "Maintenance", cust: "Maint. Manager", status: "Under Maintenance" as const },
  { name: "Lathe Machine", location: "Plant 01 • Machine Shop", dept: "Production", cust: "Prod. Supervisor", status: "Idle" as const },
  { name: "Chiller Unit 50TR", location: "Plant 02 • HVAC Room", dept: "Facilities", cust: "Facility Manager", status: "Operational" as const },
  { name: "Laser Cutting 6kW", location: "Plant 02 • Sheet Metal", dept: "Production", cust: "Laser Cell Lead", status: "Operational" as const },
  { name: "Overhead Crane 10T", location: "Heavy Bay 02", dept: "Logistics", cust: "Crane Operator", status: "Operational" as const },
];

const INITIAL_TRACKED_ASSETS: TrackedAsset[] = Array.from({ length: 428 }, (_, i) => {
  const tpl = BASE_TRACK_TEMPLATES[i % BASE_TRACK_TEMPLATES.length];
  const numStr = String(i + 1).padStart(5, "0");
  const day = ((i * 3) % 28) + 1;
  const status: "Operational" | "In Transit" | "Under Maintenance" | "Idle" =
    i % 11 === 0 ? "Under Maintenance" :
    i % 13 === 0 ? "In Transit" :
    i % 17 === 0 ? "Idle" : "Operational";

  return {
    id: `FA-PLT-${numStr}`,
    name: i < BASE_TRACK_TEMPLATES.length ? tpl.name : `${tpl.name} #${Math.floor(i / BASE_TRACK_TEMPLATES.length) + 1}`,
    qrCode: `QR-FA-${numStr}`,
    location: tpl.location,
    department: tpl.dept,
    custodian: tpl.cust,
    status,
    lastMovement: `${String(day).padStart(2, "0")}-Sep-2026 11:${String((i * 7) % 60).padStart(2, "0")}`,
    serialNumber: `SN-${tpl.dept.substring(0, 3).toUpperCase()}-2026-${numStr}`,
    lastVerified: `${String(Math.max(1, day - 3)).padStart(2, "0")}-Sep-2026`,
    nextVerification: `${String(Math.min(28, day + 14)).padStart(2, "0")}-Sep-2026`,
  };
});

export function AssetTrackingDashboardPage() {
  const [assets, setAssets] = useState<TrackedAsset[]>(INITIAL_TRACKED_ASSETS);
  const [activeAsset, setActiveAsset] = useState<TrackedAsset>(INITIAL_TRACKED_ASSETS[0]);
  const [selectedFilter, setSelectedFilter] = useState("All 428");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["Asset ID", "Asset Name", "QR Code", "Location", "Department", "Custodian", "Status", "Last Movement", "Serial Number"];
    const rows = assets.map(a => [
      a.id,
      `"${a.name}"`,
      a.qrCode,
      `"${a.location}"`,
      `"${a.department}"`,
      `"${a.custodian}"`,
      a.status,
      `"${a.lastMovement}"`,
      `"${a.serialNumber}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Asset_Tracking_Register_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Asset Tracking Register exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Asset location beacons and telemetry pings synchronized!");
    }, 600);
  };

  // Modals
  const [isNewTransferOpen, setIsNewTransferOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isExceptionOpen, setIsExceptionOpen] = useState(false);

  // Filter items
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchSearch =
        asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.custodian.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All 428") return matchSearch;
      if (selectedFilter === "On Site 396") return matchSearch && asset.status === "Operational";
      if (selectedFilter === "In Transit 8") return matchSearch && asset.status === "In Transit";
      if (selectedFilter === "Transferred 24") return matchSearch && asset.status === "Operational";
      if (selectedFilter === "Exceptions 6") return matchSearch && asset.status === "Under Maintenance";
      if (selectedFilter === "Idle 38") return matchSearch && asset.status === "Idle";
      return matchSearch;
    });
  }, [assets, searchQuery, selectedFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Paginated Assets
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, currentPage, pageSize]);

  return (
    <AppShell
      title="Asset Tracking Form"
      breadcrumb="Management > Asset Management > Asset Tracking"
      description="Track and monitor the real-time location, movement and status of assets."
      tabs={<AssetManagementTabBar />}
    >
      <div className="w-full space-y-4">
        {/* ====================================================================
           1. ACTION HEADER CARD
           ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-nowrap">
            {/* Title in Single Line */}
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Asset Tracking Form
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; Real-time GPS/beacon locations, custodian handovers and movement audit trails
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
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported Asset Locations (.xlsx)"); }}>
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
                  <DropdownMenuItem onClick={() => toast.info("Opening Asset Movement History Report...")}>
                    Movement History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Location Mismatch Exceptions...")}>
                    Location Exceptions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Custodian Acknowledgement Log...")}>
                    Custodian Log
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + New Transfer Primary Button */}
              <Button
                onClick={() => setIsNewTransferOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Transfer</span>
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
                  <DropdownMenuItem onClick={() => setIsScanOpen(true)}>
                    Scan Asset QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsExceptionOpen(true)}>
                    Investigate Exceptions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Batch Physical Verification started")}>
                    Batch Verification
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print Asset QR Labels
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* ====================================================================
           2. TOP 6 METRIC KPI CARDS
           ==================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Assets */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Total Assets</span>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Box className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">428</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All Assets</span>
            </div>
          </div>

          {/* Card 2: On Site */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">On Site</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">396</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                92.52% of Total
              </span>
            </div>
          </div>

          {/* Card 3: In Transit */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">In Transit</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">8</span>
              <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                1.87% of Total
              </span>
            </div>
          </div>

          {/* Card 4: Transferred (This Month) */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Transferred (This Month)</span>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <ArrowLeftRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-purple-600">24</span>
              <span className="block text-[10px] text-purple-700 dark:text-purple-400 font-medium">
                5.61% of Total
              </span>
            </div>
          </div>

          {/* Card 5: Exceptions */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Exceptions</span>
              <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-rose-600">6</span>
              <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                1.40% of Total
              </span>
            </div>
          </div>

          {/* Card 6: Verification Rate */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Verification Rate</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">96%</span>
              <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                This Month
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           3. MIDDLE SECTION (4 CARDS: Location Donut, Trend, Status Donut, Alerts)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Assets by Location */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Assets by Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* Plant 01: 62.62% */}
                  <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  {/* Plant 02: 21.96% */}
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="149.5" />
                  {/* Warehouse: 7.24% */}
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="201.9" />
                  {/* Project Sites: 5.14% */}
                  <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="219.2" />
                  {/* In Transit: 1.87% */}
                  <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="231.5" />
                  {/* Unknown: 1.17% */}
                  <circle cx="50" cy="50" r="38" stroke="#64748b" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="235.9" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">428</span>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Total Assets</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-blue-600" /> Plant 01
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">268 (62.62%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" /> Plant 02
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">94 (21.96%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-amber-500" /> Warehouse
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">31 (7.24%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-purple-500" /> Project Sites
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">22 (5.14%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-rose-500" /> In Transit
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">8 (1.87%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-slate-500" /> Unknown / Gap
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">5 (1.17%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Movements Trend (Last 6 Months) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Movements Trend (Last 6 Months)
                </CardTitle>
                <div className="flex items-center gap-1.5 text-[8px]">
                  <span className="flex items-center gap-0.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Transfers</span>
                  <span className="flex items-center gap-0.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Relocations</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="h-44 w-full pt-1">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 100">
                  <line x1="15" y1="20" x2="225" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="45" x2="225" y2="45" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="70" x2="225" y2="70" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="95" x2="225" y2="95" stroke="currentColor" strokeOpacity="0.08" />

                  {/* Relocations (Green Line) */}
                  <polyline
                    points="25,55 65,52 105,48 145,44 185,38 220,30"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  {[25, 65, 105, 145, 185, 220].map((x, i) => (
                    <circle key={i} cx={x} cy={[55, 52, 48, 44, 38, 30][i]} r="2" fill="#10b981" />
                  ))}

                  {/* Transfers (Blue Line) */}
                  <polyline
                    points="25,78 65,75 105,73 145,71 185,67 220,62"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                  {[25, 65, 105, 145, 185, 220].map((x, i) => (
                    <circle key={i} cx={x} cy={[78, 75, 73, 71, 67, 62][i]} r="2" fill="#2563eb" />
                  ))}

                  {/* Issues (Orange Line) */}
                  <polyline
                    points="25,88 65,86 105,85 145,84 185,82 220,80"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-muted-foreground px-2 border-t border-border/40 pt-1">
                <span>Apr 26</span>
                <span>May 26</span>
                <span>Jun 26</span>
                <span>Jul 26</span>
                <span>Aug 26</span>
                <span>Sep 26</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Assets by Status */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Assets by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* Operational: 80.84% */}
                  <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  {/* Under Maintenance: 5.14% */}
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="193" />
                  {/* In Transit: 1.87% */}
                  <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="205" />
                  {/* Idle: 8.88% */}
                  <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="210" />
                  {/* Other: 3.27% */}
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="11" fill="transparent" strokeDasharray="238.76" strokeDashoffset="231" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">428</span>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">Total Assets</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[10.5px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-blue-600" /> Operational
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">346 (80.84%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" /> Under Maintenance
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">22 (5.14%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-rose-500" /> In Transit
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">8 (1.87%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-purple-500" /> Idle
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">38 (8.88%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-amber-500" /> Other
                  </span>
                  <span className="font-mono text-muted-foreground font-semibold text-[10px]">14 (3.27%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Tracking Alerts */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tracking Alerts
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening all tracking alerts")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5">
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600" /> Location Mismatch
                  </span>
                  <Badge variant="outline" className="font-mono bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                    5
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Clock className="h-3.5 w-3.5 text-amber-600" /> Awaiting Confirmation
                  </span>
                  <Badge variant="outline" className="font-mono bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                    3
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Truck className="h-3.5 w-3.5 text-amber-600" /> Assets In Transit
                  </span>
                  <Badge variant="outline" className="font-mono bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                    8
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <User className="h-3.5 w-3.5 text-amber-600" /> Custodian Pending
                  </span>
                  <Badge variant="outline" className="font-mono bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                    6
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-1.5 rounded hover:bg-muted/30">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verification Due
                  </span>
                  <Badge variant="outline" className="font-mono bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    18
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. ASSET TRACKING REGISTER TABLE (Full Width Master Box - Zero Side Scrolling)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Asset Tracking Register
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredAssets.length} tracked assets
                  </Badge>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search asset, tag, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs w-48 sm:w-64 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFilter("All 428");
                      setSearchQuery("");
                      toast.info("Reset filters");
                    }}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Displaying all 10 tracking columns")}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                    Columns
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
                {["All 428", "Assigned (394)", "In Transit (8)", "Under Maintenance (12)", "Pending Custodian (6)", "Missing / Unaccounted (2)"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer shrink-0",
                      selectedFilter === filter
                        ? "bg-primary text-white shadow-2xs"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30 text-[10.5px] text-muted-foreground font-semibold">
                    <th className="p-3 pl-4">Asset ID</th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3 font-mono">Tag / QR Code</th>
                    <th className="p-3 font-mono">Serial Number</th>
                    <th className="p-3">Current Location</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Custodian</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 font-mono">Last Movement</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedAssets.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-muted-foreground">
                        No tracked assets match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        onClick={() => setActiveAsset(asset)}
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          activeAsset.id === asset.id ? "bg-primary/5 dark:bg-primary/10" : ""
                        )}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px]">
                          {asset.id}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{asset.name}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              Verified: {asset.lastVerified}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[10.5px] text-primary">
                          {asset.qrCode}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {asset.serialNumber}
                        </td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">
                          {asset.location}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {asset.department}
                        </td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">
                          {asset.custodian}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              asset.status === "Assigned"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : asset.status === "In Transit"
                                ? "bg-sky-50 text-sky-700 border-sky-200"
                                : asset.status === "Under Maintenance"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            )}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {asset.lastMovement}
                        </td>
                        <td className="p-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAsset(asset);
                                setIsScanOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="Audit Tag / History"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAsset(asset);
                                setIsNewTransferOpen(true);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Transfer Asset"
                            >
                              <ArrowLeftRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
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
              pageSizeOptions={[10, 20, 50, 100]}
              entityName="tracked assets"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. SELECTED ASSET TRACKING DETAILS (Full Width Box)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2.5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Tracking Dossier: <span className="font-mono text-primary">{activeAsset.id}</span> - {activeAsset.name}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                {activeAsset.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700 border-blue-200">
                RFID: {activeAsset.qrCode}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <button
                type="button"
                onClick={() => setIsNewTransferOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Initiate Transfer"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                <span>Initiate Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => setIsScanOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Scan QR Tag"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>Scan Tag</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                title="Print Dossier"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Dossier &rarr;</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Col 1: Machinery Graphic Illustration & Asset Identification */}
              <div className="space-y-3">
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl border flex items-center justify-center p-2 relative overflow-hidden">
                  <AssetVisual category={activeAsset.department || activeAsset.name} assetId={activeAsset.id} className="h-24 w-auto drop-shadow-md" />
                  <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[9.5px] px-2 py-0.5 rounded font-mono">
                    {activeAsset.id}
                  </div>
                </div>

                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Serial Number:</span>
                    <span className="font-mono">{activeAsset.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RFID / Barcode:</span>
                    <span className="font-mono font-bold text-primary">{activeAsset.qrCode}</span>
                  </div>
                </div>
              </div>

              {/* Col 2: GPS Telemetry & Custody Details */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Location:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeAsset.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{activeAsset.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Designated Custodian:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeAsset.custodian}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Operational Status:</span>
                    <span className="font-semibold text-emerald-600">{activeAsset.status}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-200/40 space-y-1 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Telemetry Coordinates:</span>
                    <span className="font-mono font-bold text-primary">13.0827° N, 80.2707° E</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    Fixed Asset Beacon signal confirmed 14 mins ago via Gateway #04.
                  </span>
                </div>
              </div>

              {/* Col 3: Movement Timestamps & Actions */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Movement:</span>
                    <span className="font-mono">{activeAsset.lastMovement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Physical Audit:</span>
                    <span className="font-mono text-emerald-600">{activeAsset.lastVerified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Scheduled Audit:</span>
                    <span className="font-mono font-bold text-amber-600">{activeAsset.nextVerification}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsNewTransferOpen(true)}
                    className="w-full text-xs bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer"
                  >
                    Transfer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsScanOpen(true)}
                    className="w-full text-xs cursor-pointer"
                  >
                    Audit Tag
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsScanOpen(true)}
                  className="w-full text-xs text-primary font-bold cursor-pointer"
                >
                  View Complete GPS Geofence & Audit History &rarr;
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====================================================================
           6. BOTTOM 4 CARDS (Recent Movements, Map, By Department, AI Insights)
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Recent Movements */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Recent Movements
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening full movement audit trail")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-2 text-[10px]">
                <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                  <div>
                    <span className="font-mono font-bold text-primary block">FA-PLT-00245</span>
                    <span className="text-muted-foreground">Project Site Alpha &rarr; Plant 02</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[9px] bg-sky-50 text-sky-700">In Transit</Badge>
                    <span className="block text-[8.5px] text-muted-foreground font-mono mt-0.5">01 Sep 10:30 AM</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                  <div>
                    <span className="font-mono font-bold text-primary block">FA-PLT-00241</span>
                    <span className="text-muted-foreground">Warehouse A &rarr; Plant 01</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700">Assigned</Badge>
                    <span className="block text-[8.5px] text-muted-foreground font-mono mt-0.5">01 Sep 08:42 AM</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
                  <div>
                    <span className="font-mono font-bold text-primary block">FA-PLT-00247</span>
                    <span className="text-muted-foreground">Plant 01 • Bay 02 &rarr; Bay 03</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[9px] bg-purple-50 text-purple-700">Relocated</Badge>
                    <span className="block text-[8.5px] text-muted-foreground font-mono mt-0.5">31 Aug 05:12 PM</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary block">FA-PLT-00246</span>
                    <span className="text-muted-foreground">Machine Shop &rarr; Maintenance</span>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700">Maintenance</Badge>
                    <span className="block text-[8.5px] text-muted-foreground font-mono mt-0.5">31 Aug 04:05 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Asset Map Overview */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Asset Map Overview
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Switching to interactive GIS map layout")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View Map &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
              {/* Graphic GIS Floor Layout */}
              <div className="h-36 w-full bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border/40 relative overflow-hidden flex items-center justify-center p-2">
                <svg className="h-full w-full" viewBox="0 0 200 130">
                  {/* Grid Lines */}
                  <line x1="10" y1="30" x2="190" y2="30" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                  <line x1="10" y1="70" x2="190" y2="70" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
                  <line x1="10" y1="100" x2="190" y2="100" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />

                  {/* Connecting Transit Vectors */}
                  <path d="M 40 40 Q 90 20 150 45" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />
                  <path d="M 40 40 Q 60 90 120 100" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />

                  {/* Node 1: Plant 02 */}
                  <g transform="translate(40, 35)">
                    <circle cx="0" cy="0" r="14" fill="#10b981" />
                    <text x="0" y="-1" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#ffffff">Plant 02</text>
                    <text x="0" y="6" fontSize="5" textAnchor="middle" fill="#ffffff">94 Assets</text>
                  </g>

                  {/* Node 2: Plant 01 */}
                  <g transform="translate(150, 45)">
                    <circle cx="0" cy="0" r="16" fill="#2563eb" />
                    <text x="0" y="-1" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#ffffff">Plant 01</text>
                    <text x="0" y="6" fontSize="5" textAnchor="middle" fill="#ffffff">268 Assets</text>
                  </g>

                  {/* Node 3: Warehouse A */}
                  <g transform="translate(50, 95)">
                    <circle cx="0" cy="0" r="13" fill="#f59e0b" />
                    <text x="0" y="-1" fontSize="5.5" fontWeight="bold" textAnchor="middle" fill="#ffffff">Warehouse A</text>
                    <text x="0" y="5.5" fontSize="4.5" textAnchor="middle" fill="#ffffff">31 Assets</text>
                  </g>

                  {/* Node 4: Project Sites */}
                  <g transform="translate(140, 105)">
                    <circle cx="0" cy="0" r="12" fill="#8b5cf6" />
                    <text x="0" y="-1" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#ffffff">Projects</text>
                    <text x="0" y="5" fontSize="4.5" textAnchor="middle" fill="#ffffff">22 Assets</text>
                  </g>
                </svg>

                <div className="absolute bottom-1 right-2 flex gap-1">
                  <span className="text-[8px] bg-white/80 dark:bg-slate-900/80 px-1 rounded border font-mono">
                    Zoom: 100%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Assets by Department */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Assets by Department
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening departmental allocation")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[10px]">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Production</span>
                  <span className="font-mono font-semibold">182 (42.5%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "42.5%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Maintenance</span>
                  <span className="font-mono font-semibold">54 (12.6%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: "12.6%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Projects</span>
                  <span className="font-mono font-semibold">62 (14.5%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "14.5%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Logistics</span>
                  <span className="font-mono font-semibold">46 (10.7%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "10.7%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>IT</span>
                  <span className="font-mono font-semibold">38 (8.9%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: "8.9%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: AI Tracking Insights */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                AI Tracking Insights
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening AI tracking intelligence")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[9.5px]">
              <div className="flex items-start gap-1">
                <span className="text-rose-600">⚠️</span>
                <span>5 assets location mismatch detected.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">ℹ️</span>
                <span>3 assets awaiting location confirmation.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">🟠</span>
                <span>8 assets are in transit beyond planned window.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-blue-500">ℹ️</span>
                <span>6 custodian acknowledgements are pending.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-emerald-500">🟢</span>
                <span>Overall location accuracy is 98.4% this month.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           6. FOOTER
           ==================================================================== */}
        <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <span>&copy; 2026 Magnertia ERP. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>System Online</span>
          </div>
        </div>

        {/* ====================================================================
           MODAL 1: NEW ASSET TRANSFER FORM
           ==================================================================== */}
        <Dialog open={isNewTransferOpen} onOpenChange={setIsNewTransferOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>New Asset Transfer</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  DRAFT
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Initiate inter-plant transfer, relocation, or departmental assignment.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewTransferOpen(false);
                toast.success("Asset transfer initiated and sent for custodian approval!");
              }}
              className="space-y-3 text-xs pt-1"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset ID *</Label>
                  <Input defaultValue={activeAsset.id} required className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset Name</Label>
                  <Input defaultValue={activeAsset.name} className="h-8 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Current Location</Label>
                  <Input defaultValue={activeAsset.location} disabled className="h-8 text-xs bg-muted/40" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Destination Location *</Label>
                  <Select defaultValue="Plant 02 • Machine Shop">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Destination" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Plant 02 • Machine Shop">Plant 02 • Machine Shop</SelectItem>
                      <SelectItem value="Plant 01 • Maintenance">Plant 01 • Maintenance</SelectItem>
                      <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Current Custodian</Label>
                  <Input defaultValue={activeAsset.custodian} disabled className="h-8 text-xs bg-muted/40" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">New Custodian</Label>
                  <Input defaultValue="Plant Manager" className="h-8 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Movement Type</Label>
                  <Select defaultValue="Inter-Plant Transfer">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Inter-Plant Transfer">Inter-Plant Transfer</SelectItem>
                      <SelectItem value="Relocation">Relocation</SelectItem>
                      <SelectItem value="Issue">Issue to Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Transfer Reason</Label>
                  <Input defaultValue="Capacity Rebalancing" className="h-8 text-xs" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsNewTransferOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Submit Transfer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: SCAN ASSET QR CODE
           ==================================================================== */}
        <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Scan & Track Asset &mdash; {activeAsset.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Scan QR tag or barcode to verify location and custodian.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-4 bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center space-y-2">
                <QrCode className="h-16 w-16 text-emerald-400" />
                <span className="font-mono text-xs font-bold">{activeAsset.qrCode}</span>
                <span className="text-[10px] text-slate-400">Target scanned &bull; GPS Coordinates locked</span>
              </div>

              <div className="p-2.5 rounded bg-muted/20 border space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset:</span>
                  <span className="font-semibold">{activeAsset.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{activeAsset.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custodian:</span>
                  <span>{activeAsset.custodian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-bold text-emerald-600">● Operational</span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsScanOpen(false)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsScanOpen(false);
                    toast.success(`Asset ${activeAsset.id} verified at current location!`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirm Location
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: LOCATION MISMATCH EXCEPTION
           ==================================================================== */}
        <Dialog open={isExceptionOpen} onOpenChange={setIsExceptionOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Asset Location Exception
              </DialogTitle>
              <DialogDescription className="text-xs">
                Location discrepancy flagged during physical audit.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 rounded-lg space-y-1 text-[11px]">
                <p className="font-bold text-rose-700 dark:text-rose-400">LOCATION MISMATCH DETECTED</p>
                <div className="flex justify-between text-muted-foreground pt-1">
                  <span>Registered:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Plant 01 &rarr; Machine Shop</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Scanned:</span>
                  <span className="font-semibold text-rose-600">Plant 02 &rarr; Assembly</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px]">Action Required</Label>
                <Select defaultValue="Investigate">
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="Investigate">Create Investigation Ticket</SelectItem>
                    <SelectItem value="Transfer">Initiate Transfer Authorization</SelectItem>
                    <SelectItem value="FalsePositive">Mark as False Positive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsExceptionOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsExceptionOpen(false);
                    toast.success("Investigation opened and assigned to Asset Controller!");
                  }}
                  className="bg-[#0B3B7B] text-white"
                >
                  Confirm Action
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default AssetTrackingDashboardPage;
