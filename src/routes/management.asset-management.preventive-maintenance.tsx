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
  Clock,
  AlertTriangle,
  PlayCircle,
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
  Maximize2,
  Hourglass,
  Layers,
  Sparkles,
  CheckCircle2,
  Check,
  Wrench,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
// HMR verified: all Lucide icons defined

export const Route = createFileRoute("/management/asset-management/preventive-maintenance")({
  head: () => ({
    meta: [
      { title: "Preventive Maintenance Form · Magnertia ERP" },
      {
        name: "description",
        content: "Manage planned and recurring maintenance activities to prevent equipment failures and ensure reliability.",
      },
    ],
  }),
  component: PreventiveMaintenanceFormPage,
});

interface PMPlanItem {
  id: string;
  asset: string;
  equipmentName?: string;
  planName?: string;
  assetTag?: string;
  activity: string;
  interval?: string;
  frequency: string;
  lastDone?: string;
  nextDue?: string;
  nextDueDate: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Due" | "Scheduled" | "Overdue" | "In Progress" | "Completed" | "Suspended";
  team: string;
  compliance: string;
  complianceNum: number;
}

const BASE_PM_TEMPLATES = [
  { asset: "CNC VMC-850", act: "Spindle Service & Lube", freq: "30 Days", prio: "High" as const, team: "Mechanical Team", comp: 96 },
  { asset: "Air Compressor 75kW", act: "Filter Inspection & Drain", freq: "7 Days", prio: "Medium" as const, team: "Utility Team", comp: 94 },
  { asset: "Forklift 3 Ton", act: "Hydraulic & Brake Check", freq: "30 Days", prio: "High" as const, team: "Maintenance Team", comp: 97 },
  { asset: "Diesel Generator 125kVA", act: "Oil & Filter Replacement", freq: "250 Hrs", prio: "Critical" as const, team: "Electrical Team", comp: 98 },
  { asset: "EV Charger 60kW", act: "Power Module & Gun Check", freq: "30 Days", prio: "Medium" as const, team: "Electrical Team", comp: 93 },
  { asset: "Chiller Unit 50TR", act: "Refrigerant & Coil Clean", freq: "30 Days", prio: "Medium" as const, team: "Utility Team", comp: 95 },
  { asset: "Hydraulic Press 200T", act: "Valve Pressure & Seal Check", freq: "15 Days", prio: "High" as const, team: "Mechanical Team", comp: 90 },
  { asset: "Conveyor System Line 1", act: "Belt Tensioning & Rollers", freq: "7 Days", prio: "Medium" as const, team: "Maintenance Team", comp: 92 },
  { asset: "Robotic Welding Station", act: "Torch Alignment & Wire Feed", freq: "14 Days", prio: "High" as const, team: "Robotics Team", comp: 95 },
  { asset: "Laser Cutting Machine 6kW", act: "Optical Lens & Gas Purge", freq: "7 Days", prio: "Critical" as const, team: "Specialized OEM", comp: 99 },
];

const INITIAL_PM_PLANS: PMPlanItem[] = Array.from({ length: 86 }, (_, i) => {
  const tpl = BASE_PM_TEMPLATES[i % BASE_PM_TEMPLATES.length];
  const numStr = String(682 + i).padStart(5, "0");
  const day = ((i * 3) % 28) + 1;
  const status: "Due" | "Scheduled" | "Overdue" | "In Progress" | "Completed" | "Suspended" =
    i % 7 === 0 ? "Due" :
    i % 8 === 0 ? "Overdue" :
    i % 9 === 0 ? "In Progress" :
    i % 10 === 0 ? "Completed" : "Scheduled";

  const assetName = i < BASE_PM_TEMPLATES.length ? tpl.asset : `${tpl.asset} Unit #${Math.floor(i / BASE_PM_TEMPLATES.length) + 1}`;
  const nextDueDate = `${String(day).padStart(2, "0")} Sep 2026`;

  return {
    id: `PM-2026-${numStr}`,
    asset: assetName,
    equipmentName: assetName,
    assetTag: `TAG-${tpl.asset.slice(0, 3).toUpperCase()}-${numStr.slice(-3)}`,
    activity: tpl.act,
    interval: tpl.freq,
    frequency: tpl.freq,
    lastDone: `${String(((day + 10) % 28) + 1).padStart(2, "0")} Aug 2026`,
    nextDue: nextDueDate,
    nextDueDate,
    priority: tpl.prio,
    status,
    team: tpl.team,
    compliance: `${tpl.comp}%`,
    complianceNum: tpl.comp,
  };
});

export function PreventiveMaintenanceFormPage() {
  const [pmPlans, setPmPlans] = useState<PMPlanItem[]>(INITIAL_PM_PLANS);
  const [activePlan, setActivePlan] = useState<PMPlanItem>(INITIAL_PM_PLANS[0]);
  const [selectedFilter, setSelectedFilter] = useState("All 682");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["Plan ID", "Equipment Name", "Interval", "Frequency", "Last Completed", "Next Due", "Status", "Assigned Team", "Compliance Rate"];
    const rows = pmPlans.map(p => [
      p.id,
      `"${p.equipmentName || p.asset}"`,
      `"${p.interval || p.activity}"`,
      p.frequency,
      p.lastDone || "15 Aug 2026",
      p.nextDue || p.nextDueDate,
      p.status,
      `"${p.team}"`,
      p.compliance
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Preventive_Maintenance_Plans_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Preventive Maintenance Plans exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("PM recurring schedules & trigger registers synchronized!");
    }, 600);
  };

  // Modals
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isWOOpen, setIsWOOpen] = useState(false);

  // Filter items
  const filteredPlans = useMemo(() => {
    return pmPlans.filter((plan) => {
      const matchSearch =
        plan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.team.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All 682") return matchSearch;
      if (selectedFilter === "Due Today (18)") return matchSearch && plan.status === "Due";
      if (selectedFilter === "Due This Week (42)") return matchSearch && plan.status === "Scheduled";
      if (selectedFilter === "Overdue (32)") return matchSearch && plan.status === "Overdue";
      if (selectedFilter === "In Progress (24)") return matchSearch && plan.status === "In Progress";
      if (selectedFilter === "Completed (612)") return matchSearch && plan.status === "Completed";
      if (selectedFilter === "Suspended (14)") return matchSearch && plan.status === "Suspended";
      return matchSearch;
    });
  }, [pmPlans, searchQuery, selectedFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Paginated Plans
  const totalPages = Math.max(1, Math.ceil(filteredPlans.length / pageSize));
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, currentPage, pageSize]);

  return (
    <AppShell
      title="Preventive Maintenance Form"
      breadcrumb="Management > Asset Management > Preventive Maintenance"
      description="Manage planned and recurring maintenance activities to prevent equipment failures and ensure reliability."
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
                Preventive Maintenance Form
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; Manage planned and recurring maintenance activities to prevent equipment failures and ensure reliability
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
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported PM Schedules (.xlsx)"); }}>
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
                  <DropdownMenuItem onClick={() => toast.info("Opening PM Compliance Audit...")}>
                    PM Compliance Audit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Overdue PM Report...")}>
                    Overdue PM Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening PM vs Breakdown Analysis...")}>
                    PM vs Breakdown Analysis
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + New PM Plan Primary Button */}
              <Button
                onClick={() => setIsNewPlanOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New PM Plan</span>
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
                  <DropdownMenuItem onClick={() => setIsChecklistOpen(true)}>
                    Execute Checklist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsWOOpen(true)}>
                    Generate PM Work Order
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("AI PM Interval Optimization Engine triggered")}>
                    AI Interval Optimization
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print PM Inspection Checklists
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
          {/* Card 1: PM Plans */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">PM Plans</span>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">682</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All PM Plans</span>
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
                2.64% of Total
              </span>
            </div>
          </div>

          {/* Card 3: Due This Week */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Due This Week</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">42</span>
              <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                6.16% of Total
              </span>
            </div>
          </div>

          {/* Card 4: Overdue */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Overdue</span>
              <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-rose-600">32</span>
              <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                4.69% of Total
              </span>
            </div>
          </div>

          {/* Card 5: In Progress */}
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
                3.52% of Total
              </span>
            </div>
          </div>

          {/* Card 6: Compliance */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Compliance</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">94%</span>
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
          {/* Card 1: PM Status Overview (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                PM Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="91.7" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="121.8" />
                    <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="214.2" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">682</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Done</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">612</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Sched.</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">420</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> In Prog</span>
                    <span className="font-mono font-semibold text-amber-600">86</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Overdue</span>
                    <span className="font-mono font-semibold text-rose-600">32</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Compliance Rate: <strong className="text-emerald-600 font-mono">89.7%</strong></span>
                <span>Overdue: <strong className="text-rose-600 font-mono">4.7%</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: PM Compliance Trend (Compact Line Chart) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                PM Compliance Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              <div className="h-28 w-full pt-1">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 100">
                  <line x1="15" y1="20" x2="225" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="50" x2="225" y2="50" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="80" x2="225" y2="80" stroke="currentColor" strokeOpacity="0.08" />

                  <polyline points="25,48 65,42 105,37 145,32 185,28 220,24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                  {[
                    { x: 25, y: 48, val: "89%" },
                    { x: 65, y: 42, val: "90%" },
                    { x: 105, y: 37, val: "91%" },
                    { x: 145, y: 32, val: "92%" },
                    { x: 185, y: 28, val: "93%" },
                    { x: 220, y: 24, val: "94%" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="2.5" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
                      <text x={pt.x} y={pt.y - 5} fontSize="7" fontWeight="bold" textAnchor="middle" fill="#059669">{pt.val}</text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-[8.5px] font-mono text-muted-foreground px-1 border-t border-border/30 pt-1">
                <span>Apr 26</span>
                <span>May 26</span>
                <span>Jun 26</span>
                <span>Jul 26</span>
                <span>Aug 26</span>
                <span>Sep 26</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: PM Trigger Strategy & Intervals (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                PM Trigger Strategy & Intervals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="91.7" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="153.3" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="173.6" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">682</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Plans</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Time (Calendar)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">420</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Run-Hours Meter</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">176</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Stroke Cycles</span>
                    <span className="font-mono font-semibold text-amber-600">58</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Statutory Audit</span>
                    <span className="font-mono font-semibold text-purple-600">28</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Calendar PM: <strong className="text-blue-600 font-mono">61.6%</strong></span>
                <span>Meter/Cycle PM: <strong className="text-emerald-600 font-mono">34.3%</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Upcoming PM (Compact) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upcoming PM
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening master preventive schedule")}
                className="text-[9.5px] text-primary font-bold hover:underline cursor-pointer"
              >
                Schedule &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/40">
                  <span className="text-muted-foreground">Due Today</span>
                  <span className="font-mono font-bold text-rose-600">18</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40">
                  <span className="text-muted-foreground">Due This Week</span>
                  <span className="font-mono font-bold text-amber-600">42</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/30">
                  <span className="text-muted-foreground">Due This Month</span>
                  <span className="font-mono font-bold text-amber-700">126</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40">
                  <span className="text-muted-foreground">Due Next Month</span>
                  <span className="font-mono font-bold text-blue-600">148</span>
                </div>
              </div>

              <span className="text-[9px] text-muted-foreground block text-center pt-0.5">
                Triggered by calendar & run hours
              </span>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. PREVENTIVE MAINTENANCE SCHEDULE TABLE (Full Width Master Box - Zero Side Scrolling)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Preventive Maintenance Schedule
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredPlans.length} plans
                  </Badge>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search plan, asset, team..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs w-48 sm:w-64 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFilter("All 682");
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
                    onClick={() => toast.info("Displaying all 10 schedule columns")}
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
                {["All 682", "Due Today (18)", "Due This Week (42)", "Overdue (32)", "In Progress (24)", "Completed (612)", "Suspended (14)"].map((filter) => (
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
                    <th className="p-3 pl-4">Plan ID</th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">Activity</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3 font-mono">Last Performed</th>
                    <th className="p-3 font-mono">Next Due Date</th>
                    <th className="p-3">Assigned Team</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 font-mono text-center">Compliance</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedPlans.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-muted-foreground">
                        No PM plans match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedPlans.map((plan) => (
                      <tr
                        key={plan.id}
                        onClick={() => setActivePlan(plan)}
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          activePlan.id === plan.id ? "bg-primary/5 dark:bg-primary/10" : ""
                        )}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px]">
                          {plan.id}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{plan.asset}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              Tag: {plan.assetTag}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {plan.activity}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          Every {plan.frequency}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {plan.lastDone}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          <span className={plan.status === "Overdue" ? "text-rose-600 font-bold" : ""}>
                            {plan.nextDueDate}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">
                          {plan.team}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              plan.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : plan.status === "Due Soon"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : plan.status === "Overdue"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            )}
                          >
                            {plan.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-center text-emerald-600">
                          {plan.compliance}
                        </td>
                        <td className="p-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePlan(plan);
                                setIsChecklistOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="PM Checklist"
                            >
                              <ClipboardList className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePlan(plan);
                                setIsWOOpen(true);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Generate Work Order"
                            >
                              <Wrench className="h-3.5 w-3.5" />
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
              totalEntries={filteredPlans.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              entityName="plans"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. SELECTED PM PLAN DETAILS (Full Width Box)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2.5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                PM Plan Details: <span className="font-mono text-primary">{activePlan.id}</span> - {activePlan.asset}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                {activePlan.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                Every {activePlan.frequency}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <button
                type="button"
                onClick={() => setIsNewPlanOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Edit Plan"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => toast.info(`PM QR Tag: ${activePlan.id}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="QR Tag"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>QR Tag</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Print PM Plan"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Plan</span>
              </button>
              <button
                type="button"
                onClick={() => setIsChecklistOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                title="Full View"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Full Checklist &rarr;</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Col 1: Graphic Illustration & Asset Identification */}
              <div className="space-y-3">
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl border flex items-center justify-center p-2 relative overflow-hidden">
                  <AssetVisual category={activePlan.equipmentName || activePlan.asset} assetId={activePlan.assetTag || activePlan.id} className="h-24 w-auto drop-shadow-md" />
                  <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[9.5px] px-2 py-0.5 rounded font-mono">
                    {activePlan.asset}
                  </div>
                </div>

                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asset Tag:</span>
                    <span className="font-mono font-bold text-primary">{activePlan.assetTag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maintenance Type:</span>
                    <span className="font-semibold">Preventive Maintenance</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Activity, Frequency & Compliance */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Routine Activity:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activePlan.activity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cycle Frequency:</span>
                    <span className="font-medium">Every {activePlan.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Executed:</span>
                    <span className="font-mono">{activePlan.lastDone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Team:</span>
                    <span className="font-medium">{activePlan.team}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-200/40 space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Compliance Score:</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">{activePlan.compliance}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: activePlan.compliance }} />
                  </div>
                </div>
              </div>

              {/* Col 3: Next Due Schedule & Actions */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next Due Date:</span>
                    <span className="font-mono font-bold text-amber-600 text-sm">{activePlan.nextDueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule Tolerance:</span>
                    <span className="font-mono">&plusmn; 3 Days</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsChecklistOpen(true)}
                    className="w-full text-xs bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer"
                  >
                    Checklist
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsWOOpen(true)}
                    className="w-full text-xs cursor-pointer"
                  >
                    Create WO
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChecklistOpen(true)}
                  className="w-full text-xs text-primary font-bold cursor-pointer"
                >
                  View Full Checklist & Specifications &rarr;
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====================================================================
           6. BOTTOM 4 CARDS (Compliance by Category, PM vs Breakdown, Cost, AI Insights)
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Compliance by Category */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Compliance by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-[10.5px]">
              {[
                { name: "Critical Assets", pct: 97, color: "bg-emerald-500" },
                { name: "Production Assets", pct: 94, color: "bg-teal-500" },
                { name: "Utilities", pct: 91, color: "bg-amber-500" },
                { name: "Facilities", pct: 93, color: "bg-blue-600" },
                { name: "Overall", pct: 94, color: "bg-purple-600" },
              ].map((item) => (
                <div key={item.name} className="space-y-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={item.color} style={{ width: `${item.pct}%`, height: "100%" }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 2: PM vs Breakdown Trend */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                PM vs Breakdown Trend
              </CardTitle>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> PM Completed</span>
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Breakdowns</span>
              </div>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between">
              <div className="h-36 flex items-end justify-between gap-2 px-1 pt-2 pb-1 border-b border-border/40">
                {[
                  { month: "Apr 26", pm: "500", bd: "25", h: 60 },
                  { month: "May 26", pm: "550", bd: "20", h: 68 },
                  { month: "Jun 26", pm: "600", bd: "18", h: 75 },
                  { month: "Jul 26", pm: "700", bd: "15", h: 88 },
                  { month: "Aug 26", pm: "650", bd: "14", h: 82 },
                  { month: "Sep 26", pm: "720", bd: "12", h: 90 },
                ].map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[8px] font-mono font-bold text-emerald-600">{item.pm}</span>
                    <div className="w-full bg-emerald-500/80 rounded-t-xs" style={{ height: `${item.h}px` }} />
                    <span className="text-[8px] font-mono font-bold text-rose-600">{item.bd}</span>
                    <span className="text-[7.5px] text-muted-foreground">{item.month.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-[9px] pt-1">
                <span className="text-emerald-600 font-bold">Planned PM Increased &uarr;</span>
                <span className="text-rose-600 font-bold">Breakdowns Dropped &darr;</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: PM Cost Overview (This Month) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                PM Cost Overview (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="140.8" />
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="205.8" />
                  <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="225.6" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">₹ 38.50 L</span>
                  <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">Total Cost</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Labour Cost</span>
                  <span className="font-mono font-semibold">₹ 14.20 L (36.9%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Spare Parts</span>
                  <span className="font-mono font-semibold">₹ 15.80 L (41.0%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> External Service</span>
                  <span className="font-mono font-semibold">₹ 5.30 L (13.8%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Others</span>
                  <span className="font-mono font-semibold">₹ 3.20 L (8.3%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: AI PM Insights */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                AI PM Insights
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Viewing all AI Preventive Maintenance alerts")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[9.5px]">
              <div className="flex items-start gap-1">
                <span className="text-rose-600">⚠️</span>
                <span>14 assets show increasing failure frequency.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-blue-500">ℹ️</span>
                <span>CNC-01 is predicted to need maintenance in 5 days.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">ℹ️</span>
                <span>Spare part stock for Bearing 6205 is low.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-purple-500">ℹ️</span>
                <span>PM compliance can be improved by 6%.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-emerald-500">🟢</span>
                <span>Overall reliability improved by 7% vs last month.</span>
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
           MODAL 1: NEW PM PLAN
           ==================================================================== */}
        <Dialog open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>New Preventive Maintenance Plan</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  DRAFT
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure routine preventive maintenance tasks, checklist, and automated scheduling rules.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewPlanOpen(false);
                toast.success("PM Plan created and activated in schedule!");
              }}
              className="space-y-3 text-xs pt-1"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset / Equipment *</Label>
                  <Input defaultValue="CNC VMC-850" required className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">PM Plan ID</Label>
                  <Input defaultValue="PM-2026-00690" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Activity Name</Label>
                  <Input defaultValue="Spindle Preventive Service" className="h-8 text-xs" />
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
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Trigger Type</Label>
                  <Select defaultValue="Time Based">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Trigger" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Time Based">Time Based (Days)</SelectItem>
                      <SelectItem value="Usage Based">Usage Based (Hours)</SelectItem>
                      <SelectItem value="Cycle Based">Cycle Based</SelectItem>
                      <SelectItem value="Condition Based">Condition / AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Frequency Value</Label>
                  <Input defaultValue="30" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Unit</Label>
                  <Input defaultValue="Days" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Assigned Team</Label>
                  <Input defaultValue="Mechanical Team" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Checklist Template</Label>
                  <Input defaultValue="CNC-30D-PM" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsNewPlanOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Activate Plan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: PM CHECKLIST
           ==================================================================== */}
        <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                PM Checklist &mdash; {activePlan.asset}
              </DialogTitle>
              <DialogDescription className="text-xs">
                30-Day PM Inspection &bull; {activePlan.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 text-xs pt-1">
              {[
                "Inspect lubrication system & pressure",
                "Check spindle bearing condition & noise",
                "Inspect drive belts & tension",
                "Check coolant level & concentration",
                "Clean air and filtration elements",
                "Check electrical wiring & connections",
                "Inspect emergency stop & safety interlocks",
                "Check for abnormal vibration levels",
                "Verify operating spindle temperature",
                "Perform full axis functional test run",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-1.5 rounded hover:bg-muted/30 border">
                  <span className="text-[11px] text-slate-800 dark:text-slate-200">
                    <span className="font-mono font-bold mr-1.5">#{idx + 1}</span> {item}
                  </span>
                  <Badge className="bg-emerald-600 text-white text-[9px] h-4">✓ PASS</Badge>
                </div>
              ))}

              <div className="p-2 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs flex items-center justify-between font-semibold mt-2">
                <span>Completed Checks: 10 / 10</span>
                <span>Checklist Result: ✓ PASS</span>
              </div>

              <DialogFooter className="pt-2">
                <Button size="sm" onClick={() => setIsChecklistOpen(false)} className="bg-[#0B3B7B] text-white">
                  Done
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: PM WORK ORDER
           ==================================================================== */}
        <Dialog open={isWOOpen} onOpenChange={setIsWOOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Generate PM Work Order &mdash; {activePlan.asset}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Auto-generate work order from PM plan schedule.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-muted/20 border space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PM Plan:</span>
                  <span className="font-mono font-bold">{activePlan.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activity:</span>
                  <span className="font-semibold">{activePlan.activity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Team:</span>
                  <span>{activePlan.team}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planned Downtime:</span>
                  <span className="font-mono font-bold text-amber-600">5.0 Hours</span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsWOOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsWOOpen(false);
                    toast.success(`Work Order PM-WO-${activePlan.id} generated and released!`);
                  }}
                  className="bg-[#0B3B7B] text-white"
                >
                  Generate Work Order
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default PreventiveMaintenanceFormPage;
