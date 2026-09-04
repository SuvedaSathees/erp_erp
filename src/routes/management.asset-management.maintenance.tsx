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
  Wrench,
  Calendar,
  AlertTriangle,
  PlayCircle,
  AlertOctagon,
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
  Sparkles,
  CheckCircle2,
  Check,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/asset-management/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance Form · Magnertia ERP" },
      {
        name: "description",
        content: "Lifecycle maintenance management for equipment, tools, and plant machinery from work order to closure and downtime analysis.",
      },
    ],
  }),
  component: MaintenanceFormPage,
});

interface WorkOrderItem {
  id: string;
  asset: string;
  assetTag?: string;
  type: "Corrective" | "Preventive" | "Breakdown" | "Predictive";
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "In Progress" | "Scheduled" | "Awaiting Parts" | "Open" | "Completed" | "On Hold";
  assignedTo: string;
  technician?: string;
  plannedStart: string;
  startDate?: string;
  scheduledDate?: string;
  dueDate: string;
  targetDate?: string;
  downtime: string;
  estHours?: string;
  cost: string;
  estCost?: string;
  costNum: number;
}

const BASE_WO_TEMPLATES = [
  { asset: "CNC VMC-850", type: "Corrective" as const, prio: "High" as const, eng: "Eng. Arun Verma", cost: 18100, dt: "4.5 h" },
  { asset: "Air Compressor 75kW", type: "Preventive" as const, prio: "Medium" as const, eng: "Eng. S. Mohan", cost: 3600, dt: "2.0 h" },
  { asset: "Forklift 3 Ton", type: "Preventive" as const, prio: "High" as const, eng: "Eng. K. Ramesh", cost: 2850, dt: "1.5 h" },
  { asset: "Diesel Generator 125kVA", type: "Breakdown" as const, prio: "Critical" as const, eng: "Eng. N. Prakash", cost: 21400, dt: "6.0 h" },
  { asset: "Chiller Unit 50TR", type: "Preventive" as const, prio: "Medium" as const, eng: "Eng. R. Kumar", cost: 4200, dt: "3.0 h" },
  { asset: "Hydraulic Press 200T", type: "Corrective" as const, prio: "High" as const, eng: "Eng. P. Nithin", cost: 14500, dt: "5.0 h" },
  { asset: "Robotic Welding Machine", type: "Corrective" as const, prio: "Medium" as const, eng: "Eng. S. Mohan", cost: 6800, dt: "2.5 h" },
  { asset: "Assembly Conveyor Line", type: "Preventive" as const, prio: "Low" as const, eng: "Eng. Arun Verma", cost: 2200, dt: "2.0 h" },
  { asset: "Laser Cutting Machine 6kW", type: "Breakdown" as const, prio: "Critical" as const, eng: "Eng. K. Suresh", cost: 28900, dt: "8.0 h" },
  { asset: "Substation Transformer 11kV", type: "Preventive" as const, prio: "High" as const, eng: "Eng. M. David", cost: 8400, dt: "4.0 h" },
];

const INITIAL_WORK_ORDERS: WorkOrderItem[] = Array.from({ length: 42 }, (_, i) => {
  const tpl = BASE_WO_TEMPLATES[i % BASE_WO_TEMPLATES.length];
  const numStr = String(418 + i).padStart(5, "0");
  const day = ((i * 2) % 28) + 1;
  const status: "Open" | "In Progress" | "Awaiting Parts" | "On Hold" | "Completed" | "Scheduled" =
    i % 5 === 0 ? "Open" :
    i % 5 === 1 ? "In Progress" :
    i % 5 === 2 ? "Awaiting Parts" :
    i % 5 === 3 ? "Scheduled" : "Completed";

  const plannedStart = `${String(day).padStart(2, "0")} Sep 2026 09:30`;
  const dueDate = `${String(Math.min(28, day + 2)).padStart(2, "0")} Sep 2026`;

  return {
    id: `MO-2026-${numStr}`,
    asset: i < BASE_WO_TEMPLATES.length ? tpl.asset : `${tpl.asset} #${Math.floor(i / BASE_WO_TEMPLATES.length) + 1}`,
    assetTag: `TAG-${tpl.asset.slice(0, 3).toUpperCase()}-${numStr.slice(-3)}`,
    type: tpl.type,
    priority: tpl.prio,
    status,
    assignedTo: tpl.eng,
    technician: tpl.eng,
    plannedStart,
    startDate: plannedStart,
    scheduledDate: plannedStart,
    dueDate,
    targetDate: dueDate,
    downtime: status === "Open" ? "-" : tpl.dt,
    estHours: tpl.dt.replace(" h", ""),
    cost: status === "Open" ? "-" : tpl.cost.toLocaleString(),
    estCost: tpl.cost.toLocaleString(),
    costNum: status === "Open" ? 0 : tpl.cost,
  };
});

interface MaintenanceRequestItem {
  id: string;
  asset: string;
  department: string;
  priority: "High" | "Medium" | "Low";
  date: string;
}

const INITIAL_REQUESTS: MaintenanceRequestItem[] = [
  { id: "REQ-2026-0123", asset: "CNC VMC-850", department: "Production Bay 1", priority: "High", date: "01 Sep 2026" },
  { id: "REQ-2026-0124", asset: "Hydraulic Press", department: "Press Shop A", priority: "Medium", date: "01 Sep 2026" },
  { id: "REQ-2026-0125", asset: "Air Compressor", department: "Utility Block", priority: "Medium", date: "31 Aug 2026" },
  { id: "REQ-2026-0126", asset: "Generator 125kVA", department: "Power Substation", priority: "High", date: "31 Aug 2026" },
  { id: "REQ-2026-0127", asset: "Chiller Unit", department: "HVAC Facilities", priority: "Low", date: "30 Aug 2026" },
];

export function MaintenanceFormPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrderItem[]>(INITIAL_WORK_ORDERS);
  const [activeWO, setActiveWO] = useState<WorkOrderItem>(INITIAL_WORK_ORDERS[0]);
  const [selectedFilter, setSelectedFilter] = useState("All 42");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["WO ID", "Asset", "Type", "Priority", "Status", "Assigned To", "Start Date", "Target Date", "Est Cost"];
    const rows = workOrders.map(wo => [
      wo.id,
      `"${wo.asset}"`,
      wo.type,
      wo.priority,
      wo.status,
      `"${wo.assignedTo}"`,
      wo.plannedStart,
      wo.dueDate,
      `"${wo.cost}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Work_Orders_Register_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Work Orders Register exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Maintenance telemetry and active work order queue synchronized!");
    }, 600);
  };

  // Modals
  const [isNewReqOpen, setIsNewReqOpen] = useState(false);
  const [isWODetailsOpen, setIsWODetailsOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  // Filter items
  const filteredWOs = useMemo(() => {
    return workOrders.filter((wo) => {
      const matchSearch =
        wo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All 42") return matchSearch;
      if (selectedFilter === "Open 42") return matchSearch && wo.status === "Open";
      if (selectedFilter === "In Progress 24") return matchSearch && wo.status === "In Progress";
      if (selectedFilter === "Awaiting Parts 11") return matchSearch && wo.status === "Awaiting Parts";
      if (selectedFilter === "On Hold 7") return matchSearch && wo.status === "On Hold";
      if (selectedFilter === "Completed 7") return matchSearch && wo.status === "Completed";
      return matchSearch;
    });
  }, [workOrders, searchQuery, selectedFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Paginated Work Orders
  const totalPages = Math.max(1, Math.ceil(filteredWOs.length / pageSize));
  const paginatedWOs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWOs.slice(start, start + pageSize);
  }, [filteredWOs, currentPage, pageSize]);

  return (
    <AppShell
      title="Maintenance Form"
      breadcrumb="Management > Asset Management > Maintenance"
      description="Manage maintenance activities from request to closure including labour, spares, downtime and costs."
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
                Maintenance Form
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; Manage maintenance activities from request to closure including labour, spares, downtime and costs
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
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported Work Orders (.xlsx)"); }}>
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
                  <DropdownMenuItem onClick={() => toast.info("Opening PM Compliance Report...")}>
                    PM Compliance Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening MTBF & MTTR Reliability Analytics...")}>
                    MTBF / MTTR Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Spare Parts Consumption Report...")}>
                    Spare Parts Consumption
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + New Request Primary Button */}
              <Button
                onClick={() => setIsNewReqOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Request</span>
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
                  <DropdownMenuItem onClick={() => setIsCompleteOpen(true)}>
                    Complete Work Order
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Emergency Breakdown Protocol triggered")}>
                    Log Emergency Breakdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Spare Parts Requisition form opened")}>
                    Issue Spare Parts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print Work Order Slips
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
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">1,248</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All Maintainable Assets</span>
            </div>
          </div>

          {/* Card 2: Due Today */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Due Today</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">18</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                1.44% of Total
              </span>
            </div>
          </div>

          {/* Card 3: Overdue */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Overdue</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">32</span>
              <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                2.56% of Total
              </span>
            </div>
          </div>

          {/* Card 4: In Progress */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">In Progress</span>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <PlayCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-purple-600">24</span>
              <span className="block text-[10px] text-purple-700 dark:text-purple-400 font-medium">
                1.92% of Total
              </span>
            </div>
          </div>

          {/* Card 5: Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Breakdown</span>
              <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertOctagon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-rose-600">7</span>
              <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                Critical Attention
              </span>
            </div>
          </div>

          {/* Card 6: PM Compliance */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">PM Compliance</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">91%</span>
              <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                This Month
              </span>
            </div>
          </div>
        </div>
        {/* ====================================================================
           3. MIDDLE SECTION (4 CARDS: Compact, Small & Balanced)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Maintenance by Type (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Maintenance by Type
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="108.4" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="181.9" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="200.3" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">1,248</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> PM (Prev)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">682</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Corrective</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">384</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Breakdown</span>
                    <span className="font-mono font-semibold text-amber-600">96</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Predictive</span>
                    <span className="font-mono font-semibold text-purple-600">86</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Preventive Ratio: <strong className="text-emerald-600 font-mono">54.6%</strong></span>
                <span>Breakdowns: <strong className="text-amber-600 font-mono">7.7%</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Work Order Status (Compact Bar Chart) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Work Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="h-24 flex items-end justify-between gap-1 px-1 pt-1 pb-1 border-b border-border/30">
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-emerald-600">865</span>
                  <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: "60px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Done</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-blue-600">42</span>
                  <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: "14px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Open</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-amber-600">24</span>
                  <div className="w-full bg-amber-500 rounded-t-sm" style={{ height: "10px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Prog</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-purple-600">11</span>
                  <div className="w-full bg-purple-500 rounded-t-sm" style={{ height: "7px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Parts</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-rose-600">7</span>
                  <div className="w-full bg-rose-500 rounded-t-sm" style={{ height: "5px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Hold</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <div className="p-1 rounded bg-muted/20 flex justify-between">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-mono font-bold text-emerald-600">91.1%</span>
                </div>
                <div className="p-1 rounded bg-muted/20 flex justify-between">
                  <span className="text-muted-foreground">Active Load</span>
                  <span className="font-mono font-bold text-blue-600">84 WOs</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Maintenance Cost Overview (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Maintenance Cost
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="140.8" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="205.8" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="225.6" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">₹ 38.5L</span>
                    <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">Total Cost</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Spares</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 15.8L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Labour</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">₹ 14.2L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> External</span>
                    <span className="font-mono font-semibold text-amber-600">₹ 5.3L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Others</span>
                    <span className="font-mono font-semibold text-muted-foreground">₹ 3.2L</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Budget Spent: <strong className="font-mono text-emerald-600">76.4%</strong></span>
                <span>YTD Variance: <strong className="font-mono text-primary">-4.2%</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Breakdown Dispatch & MTTR (Compact) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Breakdown Dispatch & MTTR
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/40">
                  <span className="text-muted-foreground font-medium">P1 Critical Incidents</span>
                  <span className="font-mono font-bold text-rose-600">3 Active</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40">
                  <span className="text-muted-foreground font-medium">Mean Time to Repair</span>
                  <span className="font-mono font-bold text-amber-600">3.8 hrs</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-blue-50/40 dark:bg-blue-950/10 border border-blue-200/30">
                  <span className="text-muted-foreground font-medium">Technicians Dispatched</span>
                  <span className="font-mono font-bold text-blue-600">8 / 12</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/40">
                  <span className="text-muted-foreground font-medium">Critical Spares Ready</span>
                  <span className="font-mono font-bold text-emerald-600">94.5%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.info("Opening Breakdown Incident Dispatch Console")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer block pt-1 text-center w-full"
              >
                Dispatch Console &rarr;
              </button>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. MAINTENANCE WORK ORDERS TABLE (Full Width Master Box - Zero Side Scrolling)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Maintenance Work Orders
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredWOs.length} work orders
                  </Badge>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search work order, asset, tech..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs w-48 sm:w-64 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFilter("All 42");
                      setSearchQuery("");
                      toast.info("Reset filter");
                    }}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Displaying all 11 work order columns")}
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
                {["All 42", "Open 42", "In Progress 24", "Awaiting Parts 11", "On Hold 7", "Completed 7"].map((filter) => (
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
                    <th className="p-3 pl-4">Work Order ID</th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-center">Priority</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3">Assigned Technician</th>
                    <th className="p-3 font-mono">Scheduled Date</th>
                    <th className="p-3 font-mono">Target Finish</th>
                    <th className="p-3 font-mono text-center">Hours</th>
                    <th className="p-3 font-mono text-right">Cost (₹)</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedWOs.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-muted-foreground">
                        No work orders match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedWOs.map((wo) => (
                      <tr
                        key={wo.id}
                        onClick={() => setActiveWO(wo)}
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          activeWO.id === wo.id ? "bg-primary/5 dark:bg-primary/10" : ""
                        )}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px]">
                          {wo.id}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{wo.asset}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              Tag: {wo.assetTag}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {wo.type}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              wo.priority === "Critical"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : wo.priority === "High"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : wo.priority === "Medium"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            )}
                          >
                            {wo.priority}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              wo.status === "Scheduled"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : wo.status === "In Progress"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : wo.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            )}
                          >
                            {wo.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">
                          {wo.technician}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {wo.scheduledDate}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {wo.targetDate}
                        </td>
                        <td className="p-3 font-mono text-center text-slate-700 dark:text-slate-300">
                          {wo.estHours}h
                        </td>
                        <td className="p-3 font-mono font-semibold text-right text-slate-900 dark:text-white">
                          ₹ {wo.cost.toLocaleString()}
                        </td>
                        <td className="p-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveWO(wo);
                                setIsWODetailsOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="Work Order Details"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveWO(wo);
                                setIsCompleteOpen(true);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Complete Work Order"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
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
              totalEntries={filteredWOs.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              entityName="work orders"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. MAINTENANCE OPERATIONS & ALERTS (Full Width 2-Column Grid)
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* Card 1: Maintenance Requests */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Incoming Maintenance Requests
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono font-bold">
                  {INITIAL_REQUESTS.length} pending
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Viewing all maintenance requests")}
                className="text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              {INITIAL_REQUESTS.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-2 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/30 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary text-[11px]">{req.id}</span>
                      <span className="text-[11px] text-muted-foreground">&bull; {req.department}</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs block">{req.asset}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9.5px] px-2 py-0.5",
                        req.priority === "High"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : req.priority === "Medium"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      )}
                    >
                      {req.priority}
                    </Badge>
                    <span className="block font-mono text-[10px] text-muted-foreground">{req.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 2: Maintenance Alerts & Critical Actions */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Maintenance Alerts & Critical Indicators
                </CardTitle>
                <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">
                  Critical
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Viewing all maintenance alerts")}
                className="text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                Action Center &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 text-rose-800 dark:text-rose-300">
                <span className="text-base leading-none">🔴</span>
                <div>
                  <span className="font-bold block">32 Maintenance Activities Overdue</span>
                  <span className="text-[11px] text-rose-700/80 dark:text-rose-400">Immediate supervisor authorization required to reschedule.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 text-rose-800 dark:text-rose-300">
                <span className="text-base leading-none">🔴</span>
                <div>
                  <span className="font-bold block">7 Critical Assets Under Breakdown</span>
                  <span className="text-[11px] text-rose-700/80 dark:text-rose-400">Emergency response teams dispatched to Bay 02 & Bay 03.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 text-amber-800 dark:text-amber-300">
                <span className="text-base leading-none">🟠</span>
                <div>
                  <span className="font-bold block">11 Work Orders Awaiting Spare Parts</span>
                  <span className="text-[11px] text-amber-700/80 dark:text-amber-400">Expedited POs created with vendor logistics team.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 text-blue-800 dark:text-blue-300">
                <span className="text-base leading-none">ℹ️</span>
                <div>
                  <span className="font-bold block">14 Assets Show Increased Failure Frequency</span>
                  <span className="text-[11px] text-blue-700/80 dark:text-blue-400">Predictive vibration analysis recommended before month end.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           6. BOTTOM 5 CARDS (Downtime Trend, Failure Mode, MTBF/MTTR, Cost, AI Insights)
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Downtime Trend (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="h-32 w-full pt-2">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 100">
                  <line x1="10" y1="20" x2="230" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <line x1="10" y1="50" x2="230" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <line x1="10" y1="80" x2="230" y2="80" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <polyline
                    points="20,25 60,38 100,28 140,46 180,58 220,65"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {[
                    { x: 20, y: 25, val: "420" },
                    { x: 60, y: 38, val: "380" },
                    { x: 100, y: 28, val: "410" },
                    { x: 140, y: 46, val: "360" },
                    { x: 180, y: 58, val: "330" },
                    { x: 220, y: 65, val: "310" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="3" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                      <text x={pt.x} y={pt.y - 6} fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="currentColor">
                        {pt.val}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-muted-foreground px-1 border-t border-border/40 pt-1">
                <span>Apr 26</span>
                <span>May 26</span>
                <span>Jun 26</span>
                <span>Jul 26</span>
                <span>Aug 26</span>
                <span>Sep 26</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Failure Mode Analysis */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Failure Mode Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[10px]">
              {[
                { name: "Bearing Failure", pct: 28, color: "bg-blue-600" },
                { name: "Electrical Fault", pct: 22, color: "bg-teal-500" },
                { name: "Wear & Tear", pct: 18, color: "bg-emerald-500" },
                { name: "Misalignment", pct: 12, color: "bg-cyan-500" },
                { name: "Overheating", pct: 10, color: "bg-purple-500" },
                { name: "Others", pct: 10, color: "bg-slate-500" },
              ].map((item) => (
                <div key={item.name} className="space-y-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{item.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={item.color} style={{ width: `${item.pct * 2.8}%`, height: "100%" }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 3: MTBF & MTTR Trend */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                MTBF & MTTR Trend
              </CardTitle>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> MTBF</span>
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> MTTR</span>
              </div>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
              <div className="h-36 flex items-end justify-between gap-1.5 px-1 pt-2 pb-1 border-b border-border/40">
                {[
                  { month: "Apr", mtbf: "540", mttr: "4.8", barH: 70 },
                  { month: "May", mtbf: "560", mttr: "4.6", barH: 74 },
                  { month: "Jun", mtbf: "590", mttr: "4.5", barH: 80 },
                  { month: "Jul", mtbf: "610", mttr: "4.4", barH: 85 },
                  { month: "Aug", mtbf: "630", mttr: "4.3", barH: 90 },
                  { month: "Sep", mtbf: "620", mttr: "4.2", barH: 88 },
                ].map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] font-mono font-bold text-blue-600">{item.mtbf}</span>
                    <div className="w-full bg-blue-500/80 rounded-t-xs" style={{ height: `${item.barH}px` }} />
                    <span className="text-[8px] font-mono font-bold text-emerald-600">{item.mttr}h</span>
                    <span className="text-[8px] text-muted-foreground">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-[9.5px] pt-1">
                <span className="text-muted-foreground">MTBF: 620 h</span>
                <span className="text-emerald-600 font-bold">MTTR: 4.2 h</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Cost by Type (This Month) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Cost by Type (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* Spare Parts: 41.0% */}
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  {/* Labour: 36.9% */}
                  <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="140.8" />
                  {/* External: 13.8% */}
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="205.8" />
                  {/* Others: 8.3% */}
                  <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="225.6" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">₹ 38.50 L</span>
                  <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">Total</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Spare Parts</span>
                  <span className="font-mono font-bold">41.0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Labour Cost</span>
                  <span className="font-mono font-bold">36.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> External Service</span>
                  <span className="font-mono font-bold">13.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Others</span>
                  <span className="font-mono font-bold">8.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: AI Maintenance Insights */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                AI Maintenance Insights
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Viewing all AI Maintenance alerts")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[9.5px]">
              <div className="flex items-start gap-1">
                <span className="text-rose-600">⚠️</span>
                <span>CNC-01 shows high probability of bearing failure.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">ℹ️</span>
                <span>Generator-02 has recurring electrical faults.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-blue-500">ℹ️</span>
                <span>Predictive model suggests Compressor-01 service in 3 days.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-purple-500">ℹ️</span>
                <span>Spare part stock for Bearing 6205 is running low.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-emerald-500">🟢</span>
                <span>Overall reliability improved by 6% vs last month.</span>
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
           MODAL 1: NEW MAINTENANCE REQUEST
           ==================================================================== */}
        <Dialog open={isNewReqOpen} onOpenChange={setIsNewReqOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>New Maintenance Request</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  REQUESTED
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Submit a maintenance work order request for defective or scheduled plant machinery.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewReqOpen(false);
                toast.success("Maintenance request submitted successfully and routed to Chief Engineer!");
              }}
              className="space-y-3 text-xs pt-1"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset / Equipment *</Label>
                  <Input defaultValue="CNC Vertical Machining Center" required className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Equipment ID</Label>
                  <Input defaultValue="EQ-CNC-00241" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Maintenance Type</Label>
                  <Select defaultValue="Corrective">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Corrective">Corrective</SelectItem>
                      <SelectItem value="Breakdown">Breakdown</SelectItem>
                      <SelectItem value="Predictive">Predictive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Category</Label>
                  <Select defaultValue="Mechanical">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                      <SelectItem value="Pneumatic">Pneumatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Priority</Label>
                  <Select defaultValue="High">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px]">Problem Description</Label>
                <Input defaultValue="Abnormal vibration observed during spindle operation at 8,000 RPM" className="h-8 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Reported By</Label>
                  <Input defaultValue="Production Supervisor" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Location</Label>
                  <Input defaultValue="Plant 01 → Machine Shop" className="h-8 text-xs" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsNewReqOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Submit Request
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: WORK ORDER DETAIL VIEW
           ==================================================================== */}
        <Dialog open={isWODetailsOpen} onOpenChange={setIsWODetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Work Order Details &mdash; {activeWO.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {activeWO.asset} &bull; Assigned to {activeWO.assignedTo}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-3 bg-muted/20 rounded-lg border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset:</span>
                  <span className="font-bold">{activeWO.asset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type / Priority:</span>
                  <span>{activeWO.type} &bull; <Badge variant="outline" className="text-[9px]">{activeWO.priority}</Badge></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planned Start:</span>
                  <span className="font-mono">{activeWO.plannedStart}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="font-mono">{activeWO.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recorded Downtime:</span>
                  <span className="font-mono font-bold text-amber-600">{activeWO.downtime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Maintenance Cost:</span>
                  <span className="font-mono font-bold text-primary">₹ {activeWO.cost}</span>
                </div>
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setIsWODetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: COMPLETE WORK ORDER
           ==================================================================== */}
        <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Complete Work Order &mdash; {activeWO.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Log root cause, corrective actions, and parts consumed for sign-off.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCompleteOpen(false);
                toast.success(`Work Order ${activeWO.id} completed and signed off!`);
              }}
              className="space-y-3 text-xs pt-1"
            >
              <div className="space-y-1">
                <Label className="text-[11px]">Root Cause</Label>
                <Input defaultValue="Spindle bearing wear due to extended operating cycles" className="h-8 text-xs" />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px]">Corrective Action</Label>
                <Input defaultValue="Bearing replaced and spindle laser alignment performed" className="h-8 text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Parts Cost (₹)</Label>
                  <Input defaultValue="13700" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Labour Cost (₹)</Label>
                  <Input defaultValue="2700" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Actual Downtime</Label>
                  <Input defaultValue="4.5 h" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Functional Test</Label>
                  <Select defaultValue="Passed">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Passed">Passed (Release Asset)</SelectItem>
                      <SelectItem value="Retest">Retest Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsCompleteOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Close Work Order
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default MaintenanceFormPage;
