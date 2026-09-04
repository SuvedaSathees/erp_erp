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
  CheckCircle2,
  AlertTriangle,
  Calendar,
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
  Sparkles,
  Hourglass,
  Layers,
  ArrowRight,
  TrendingUp,
  UserCheck,
  RotateCcw,
  Check,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/asset-management/tool-management")({
  head: () => ({
    meta: [
      { title: "Tool Management · Magnertia ERP" },
      {
        name: "description",
        content: "Complete lifecycle management of enterprise tools: registration, issue, return, calibration, and maintenance.",
      },
    ],
  }),
  component: ToolManagementFormPage,
});

interface ToolItem {
  id: string;
  code: string;
  name: string;
  category: string;
  location: string;
  status: "Available" | "Issued" | "In Maintenance" | "Calibration Due" | "Expired Calibration";
  issuedTo: string;
  calibrationDue: string;
  isCalibOverdue?: boolean;
  value: string;
  valueNum: number;
  manufacturer: string;
  model: string;
  serialNo: string;
  assetId: string;
  custodian: string;
  issueDate?: string;
  returnDate?: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
}

const BASE_TOOL_TEMPLATES = [
  { code: "TCT-125", name: "End Mill 12mm 4-Flute", category: "Cutting Tools", location: "Tool Room - 01", val: 1250, mfr: "Sandvik Coromant", model: "CoroMill Plura", crit: "Medium" as const },
  { code: "MT-089", name: "Digital Caliper 300mm", category: "Measuring Tools", location: "Inspection - 02", val: 4850, mfr: "Mitutoyo", model: "CD-12 CSX", crit: "High" as const },
  { code: "HT-210", name: "Combination Spanner Set (24-Pc)", category: "Hand Tools", location: "Maintenance Crib", val: 3200, mfr: "Stanley", model: "Maxi-Drive", crit: "Low" as const },
  { code: "PT-044", name: "Pneumatic Impact Wrench 1/2\"", category: "Power Tools", location: "Assembly Bay 01", val: 8900, mfr: "Ingersoll Rand", model: "2135QXPA", crit: "High" as const },
  { code: "MT-012", name: "Micrometer 0-25mm (0.001mm)", category: "Measuring Tools", location: "Metrology Lab", val: 5600, mfr: "Mitutoyo", model: "Digimatic 293", crit: "High" as const },
  { code: "FX-088", name: "Hydraulic Clamping Fixture V-4", category: "Fixtures", location: "Machining Bay 03", val: 24500, mfr: "Roemheld", model: "Hydro-Clamp 40", crit: "Critical" as const },
  { code: "TCT-210", name: "HSS Drill Bit Set 1-13mm", category: "Cutting Tools", location: "Tool Room - 02", val: 1850, mfr: "Addison", model: "HSS-G Jobber", crit: "Low" as const },
  { code: "HT-145", name: "Hex Key Metric Set 9-Pc", category: "Hand Tools", location: "Assembly - 02", val: 750, mfr: "Taparia", model: "Metric 9-Pc", crit: "Low" as const },
  { code: "MT-055", name: "Bore Gauge Set 50-150mm", category: "Measuring Tools", location: "Inspection - 01", val: 7200, mfr: "Baker", model: "BG-150", crit: "High" as const },
  { code: "PT-092", name: "Cordless Brushless Drill 18V", category: "Power Tools", location: "Maintenance Crib", val: 11500, mfr: "Bosch Professional", model: "GSB 18V-50", crit: "Medium" as const },
  { code: "FX-102", name: "CNC Milling Vice 6 Inch", category: "Fixtures", location: "Plant 01 - Machine Shop", val: 16800, mfr: "Kurt", model: "DX6 CrossOver", crit: "High" as const },
  { code: "MT-104", name: "Digital Height Gauge 600mm", category: "Measuring Tools", location: "Metrology Lab", val: 28500, mfr: "Mitutoyo", model: "LH-600E", crit: "Critical" as const },
];

const INITIAL_TOOLS: ToolItem[] = Array.from({ length: 120 }, (_, i) => {
  const tpl = BASE_TOOL_TEMPLATES[i % BASE_TOOL_TEMPLATES.length];
  const numStr = String(i + 1).padStart(6, "0");
  const codeNum = String(100 + i);
  const id = `TL-${tpl.category === "Cutting Tools" ? "CT" : tpl.category === "Measuring Tools" ? "MT" : tpl.category === "Hand Tools" ? "HT" : tpl.category === "Power Tools" ? "PT" : "FX"}-${numStr}`;
  const status: "Available" | "Issued" | "In Maintenance" | "Calibration Due" =
    i % 15 === 0 ? "Calibration Due" :
    i % 11 === 0 ? "In Maintenance" :
    i % 3 === 0 ? "Issued" : "Available";

  const isCalibOverdue = status === "Calibration Due" || (i % 22 === 0);

  return {
    id,
    code: `${tpl.code.split("-")[0]}-${codeNum}`,
    name: i < BASE_TOOL_TEMPLATES.length ? tpl.name : `${tpl.name} #${Math.floor(i / BASE_TOOL_TEMPLATES.length) + 1}`,
    category: tpl.category as any,
    location: tpl.location,
    status,
    issuedTo: status === "Issued" ? `Technician ${(i % 12) + 1}` : "-",
    calibrationDue: `${((i * 4) % 28) + 1} Oct 2026`,
    isCalibOverdue,
    value: tpl.val.toLocaleString(),
    valueNum: tpl.val,
    manufacturer: tpl.mfr,
    model: tpl.model,
    serialNo: `SN-${tpl.code.split("-")[0]}-${numStr}`,
    assetId: `FA-TLS-${numStr}`,
    custodian: "Tool Crib Incharge",
    criticality: tpl.crit,
    issueDate: status === "Issued" ? "10 Sep 2026" : undefined,
  };
});

export function ToolManagementFormPage() {
  const [tools, setTools] = useState<ToolItem[]>(INITIAL_TOOLS);
  const [activeTool, setActiveTool] = useState<ToolItem>(INITIAL_TOOLS[1]); // Default to Digital Caliper
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["Tool Code", "Tool Name", "Category", "Location", "Status", "Issued To", "Calibration Due", "Value (INR)", "Manufacturer", "Criticality"];
    const rows = tools.map(t => [
      t.code,
      `"${t.name}"`,
      `"${t.category}"`,
      `"${t.location}"`,
      t.status,
      `"${t.issuedTo}"`,
      t.calibrationDue,
      t.value,
      `"${t.manufacturer}"`,
      t.criticality
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tool_Master_Register_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tool Master Register exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Tool Room inventory & issue registers synchronized!");
    }, 600);
  };

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isCalibOpen, setIsCalibOpen] = useState(false);

  // Filter tools
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchSearch =
        tool.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.issuedTo.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All") return matchSearch;
      if (selectedFilter === "Available") return matchSearch && tool.status === "Available";
      if (selectedFilter === "Issued") return matchSearch && tool.status === "Issued";
      if (selectedFilter === "In Maintenance") return matchSearch && tool.status === "In Maintenance";
      if (selectedFilter === "Calibration Due") return matchSearch && (tool.status === "Calibration Due" || tool.isCalibOverdue);
      if (selectedFilter === "Expired Calibration") return matchSearch && tool.isCalibOverdue;
      return matchSearch;
    });
  }, [tools, searchQuery, selectedFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Paginated Tools
  const totalPages = Math.max(1, Math.ceil(filteredTools.length / pageSize));
  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTools.slice(start, start + pageSize);
  }, [filteredTools, currentPage, pageSize]);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTools(
      tools.map((t) => (t.id === activeTool.id ? { ...t, status: "Issued" as const, issuedTo: "Ramesh Kumar" } : t))
    );
    setIsIssueOpen(false);
    toast.success(`Tool ${activeTool.name} issued to Ramesh Kumar successfully!`);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTools(
      tools.map((t) => (t.id === activeTool.id ? { ...t, status: "Available" as const, issuedTo: "-" } : t))
    );
    setIsReturnOpen(false);
    toast.success(`Tool ${activeTool.name} inspected and returned to stock!`);
  };

  return (
    <AppShell
      title="Tool Management"
      breadcrumb="Management > Asset Management > Tool Management"
      description="Manage complete lifecycle of tools including registration, issue, return, calibration, maintenance and tracking."
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
                Tool Management
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; Complete lifecycle from registration to calibration, issue, return and maintenance
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
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported Tool Master (.xlsx)"); }}>
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
                  <DropdownMenuItem onClick={() => toast.info("Opening Tool Availability & Issue Log...")}>
                    Tool Availability Log
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Calibration Compliance Report...")}>
                    Calibration Compliance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Tool Loss & Write-off Report...")}>
                    Loss & Write-off Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + Create Tool Primary Button */}
              <Button
                onClick={() => setIsCreateOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Tool</span>
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
                  <DropdownMenuItem onClick={() => setIsIssueOpen(true)}>
                    Issue Tool Workflow
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsReturnOpen(true)}>
                    Return Tool Inspection
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsCalibOpen(true)}>
                    Calibration Certification
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print Tool QR Barcodes
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
          {/* Card 1: Total Tools */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Total Tools</span>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">2,458</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All Tools</span>
            </div>
          </div>

          {/* Card 2: Available Tools */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Available Tools</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">1,856</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                75.58% of Total
              </span>
            </div>
          </div>

          {/* Card 3: Issued Tools */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Issued Tools</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">482</span>
              <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                19.62% of Total
              </span>
            </div>
          </div>

          {/* Card 4: In Maintenance */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">In Maintenance</span>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <RotateCcw className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-purple-600">68</span>
              <span className="block text-[10px] text-purple-700 dark:text-purple-400 font-medium">
                2.77% of Total
              </span>
            </div>
          </div>

          {/* Card 5: Calibration Due */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Calibration Due</span>
              <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-rose-600">52</span>
              <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                2.12% of Total
              </span>
            </div>
          </div>

          {/* Card 6: Expired Calibration */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Expired Calibration</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Hourglass className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">23</span>
              <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                0.94% of Total
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           3. MIDDLE SECTION (4 CARDS: Compact, Small & Balanced)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Tool Category Distribution (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tool Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="154.7" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="204.4" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="250.6" />
                    <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="279.5" />
                    <circle cx="50" cy="50" r="38" stroke="#64748b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="297.7" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">2,458</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Tools</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  {[
                    { name: "Cutting Tools", count: "865", color: "bg-blue-600" },
                    { name: "Measuring", count: "512", color: "bg-emerald-500" },
                    { name: "Hand Tools", count: "476", color: "bg-amber-500" },
                    { name: "Power Tools", count: "298", color: "bg-purple-500" },
                    { name: "Special Tools", count: "187", color: "bg-cyan-500" },
                    { name: "Other Tools", count: "120", color: "bg-slate-500" },
                  ].map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
                        <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", item.color)} />
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[10px] ml-1">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Crib Stock: <strong className="text-emerald-600 font-mono">74.2%</strong></span>
                <span>Calibrated: <strong className="text-primary font-mono">512 Gauges</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Tool Status Overview (Compact Bar Chart) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tool Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="h-24 flex items-end justify-between gap-1 px-1 pt-1 pb-1 border-b border-border/30">
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-emerald-600">1,856</span>
                  <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: "60px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Avail</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-amber-600">482</span>
                  <div className="w-full bg-amber-500 rounded-t-sm" style={{ height: "20px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Issued</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-purple-600">68</span>
                  <div className="w-full bg-purple-500 rounded-t-sm" style={{ height: "8px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Maint</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-rose-600">52</span>
                  <div className="w-full bg-rose-500 rounded-t-sm" style={{ height: "7px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Calib</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-0.5">
                  <span className="text-[8.5px] font-bold font-mono text-slate-600">23</span>
                  <div className="w-full bg-slate-600 rounded-t-sm" style={{ height: "4px" }} />
                  <span className="text-[8px] text-muted-foreground font-medium mt-0.5 truncate">Expired</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                <div className="p-1 rounded bg-muted/20 flex justify-between">
                  <span className="text-muted-foreground">In Circulation</span>
                  <span className="font-mono font-bold text-amber-600">19.6%</span>
                </div>
                <div className="p-1 rounded bg-muted/20 flex justify-between">
                  <span className="text-muted-foreground">Calibration Health</span>
                  <span className="font-mono font-bold text-emerald-600">96.9%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Calibration Summary (Compact Donut) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Calibration Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="7.3" />
                    <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="2.2" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-emerald-600">96.9%</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Valid</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Valid
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">2,383</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Due Soon
                    </span>
                    <span className="font-mono font-semibold text-amber-600">52</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Expired
                    </span>
                    <span className="font-mono font-semibold text-rose-600">23</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Compliance: <strong className="font-mono text-emerald-600">ISO 9001</strong></span>
                <span>Next Audit: <strong className="font-mono">15 Oct 2026</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Quick Summary (Compact) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1 text-[11px]">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground">Total Tool Value</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 1.24 Cr</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground">Average Tool Value</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 5,051</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground">Issued This Month</span>
                <span className="font-mono font-bold text-blue-600">482</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground">Returned This Month</span>
                <span className="font-mono font-bold text-emerald-600">465</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-muted-foreground">Maintenance Cost</span>
                <span className="font-mono font-bold text-amber-600">₹ 6.25 L</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-t border-border/30 pt-1">
                <span className="text-muted-foreground">Tool Loss / Write-off</span>
                <span className="font-mono font-bold text-rose-600">₹ 38,520</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. TOOL REGISTER TABLE (Full Width Master Box - Zero Side Scrolling)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Tool Register
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredTools.length} tools
                  </Badge>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search tool code, name, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs w-48 sm:w-64 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFilter("All");
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
                    onClick={() => toast.info("Displaying all 10 tool register columns")}
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
                {["All", "Available", "Issued", "In Maintenance", "Calibration Due", "Expired Calibration"].map((filter) => (
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
                    <th className="p-3 pl-4">Tool ID</th>
                    <th className="p-3">Tool Code</th>
                    <th className="p-3">Tool Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Location</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3">Issued To</th>
                    <th className="p-3 font-mono">Calibration Due</th>
                    <th className="p-3 font-mono text-right">Value (₹)</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedTools.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-muted-foreground">
                        No tools match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedTools.map((tool) => (
                      <tr
                        key={tool.id}
                        onClick={() => setActiveTool(tool)}
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          activeTool.id === tool.id ? "bg-primary/5 dark:bg-primary/10" : ""
                        )}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px]">
                          {tool.id}
                        </td>
                        <td className="p-3 font-mono text-muted-foreground">
                          {tool.code}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{tool.name}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              SN: {tool.serialNo} &bull; Model: {tool.model}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {tool.category}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {tool.location}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              tool.status === "Available"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : tool.status === "Issued"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : tool.status === "Calibration Due"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            )}
                          >
                            {tool.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">
                          {tool.issuedTo}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {tool.calibrationDue}
                        </td>
                        <td className="p-3 font-mono font-semibold text-right text-slate-900 dark:text-white">
                          ₹ {tool.value.toLocaleString()}
                        </td>
                        <td className="p-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTool(tool);
                                setIsIssueOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="Issue Tool"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTool(tool);
                                setIsReturnOpen(true);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Return Tool"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
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
              totalEntries={filteredTools.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              entityName="tools"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. SELECTED TOOL MASTER DETAILS (Full Width Box)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2.5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Tool Details: <span className="font-mono text-primary">{activeTool.id}</span> - {activeTool.name}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                {activeTool.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">
                {activeTool.criticality} Criticality
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <button
                type="button"
                onClick={() => setIsIssueOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Issue or Transfer Tool"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Issue</span>
              </button>
              <button
                type="button"
                onClick={() => toast.info(`Scanned Tool Barcode: ${activeTool.id}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="QR Barcode"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>QR Tag</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Print Tool Card"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCalibOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                title="Calibration Certificate"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Full Calibration &rarr;</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Col 1: Visual & Tool Identification */}
              <div className="space-y-3">
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl border flex items-center justify-center p-2 relative overflow-hidden">
                  <svg className="h-24 w-auto text-slate-700 dark:text-slate-300 drop-shadow-md" viewBox="0 0 160 80" fill="none">
                    <rect x="20" y="32" width="120" height="12" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                    <path d="M20 20 L30 20 L30 65 L20 44 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
                    <rect x="55" y="24" width="35" height="28" rx="3" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
                    <rect x="60" y="28" width="25" height="12" rx="1.5" fill="#0284c7" />
                    <text x="72" y="37" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      124.50
                    </text>
                    <path d="M55 45 L65 45 L65 65 L55 52 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
                  </svg>
                  <div className="absolute bottom-1.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[9.5px] px-2 py-0.5 rounded font-mono">
                    {activeTool.id}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-muted/20 rounded-lg border border-border/40 text-[11px]">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Manufacturer</span>
                    <span className="font-semibold">{activeTool.manufacturer}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Model</span>
                    <span className="font-semibold font-mono">{activeTool.model}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Serial Number</span>
                    <span className="font-mono">{activeTool.serialNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Asset ID</span>
                    <span className="font-mono text-primary font-bold">{activeTool.assetId}</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Storage, Custody & Specs */}
              <div className="space-y-3">
                <div className="space-y-2.5 p-3 bg-muted/20 rounded-lg border border-border/40 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Storage Location:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeTool.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Assigned Custodian:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeTool.custodian}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeTool.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Replacement Value:</span>
                    <span className="font-mono font-bold text-emerald-600">₹ {activeTool.value.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-200/40 space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Status:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeTool.status} ({activeTool.issuedTo})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Issue Date:</span>
                    <span className="font-mono">{activeTool.issueDate || "18 Sep 2026"}</span>
                  </div>
                </div>
              </div>

              {/* Col 3: Calibration & Quick Actions */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Calibration Status:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Due Soon ({activeTool.calibrationDue})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Calibration Standard:</span>
                    <span className="font-mono">ISO 17025 Compliant</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsIssueOpen(true)}
                    className="w-full text-xs bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer"
                  >
                    Issue Tool
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReturnOpen(true)}
                    className="w-full text-xs cursor-pointer"
                  >
                    Return Tool
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCalibOpen(true)}
                  className="w-full text-xs text-primary font-bold cursor-pointer"
                >
                  View Calibration & Usage Logs &rarr;
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====================================================================
           5. BOTTOM 5 CARDS (Utilization Trend, Top Issued To, Maintenance Cost, Calibration, AI Insights)
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          {/* Card 1: Utilization Trend */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Utilization Trend (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="h-32 w-full pt-2">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 100">
                  <line x1="10" y1="20" x2="230" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <line x1="10" y1="50" x2="230" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <line x1="10" y1="80" x2="230" y2="80" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                  <polyline
                    points="20,74 60,68 100,62 140,54 180,44 220,34"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {[
                    { x: 20, y: 74, val: "68%" },
                    { x: 60, y: 68, val: "72%" },
                    { x: 100, y: 62, val: "74%" },
                    { x: 140, y: 54, val: "77%" },
                    { x: 180, y: 44, val: "83%" },
                    { x: 220, y: 34, val: "86%" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                      <text x={pt.x} y={pt.y - 7} fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="currentColor">
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

          {/* Card 2: Top Issued To (This Month) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Top Issued To (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-1.5 text-[10.5px]">
                {[
                  { name: "Ramesh Kumar", count: 84, max: 100, color: "bg-blue-600" },
                  { name: "S. Mohan", count: 76, max: 100, color: "bg-teal-500" },
                  { name: "Karthik Raj", count: 65, max: 100, color: "bg-indigo-600" },
                  { name: "Vijay Prakash", count: 54, max: 100, color: "bg-purple-600" },
                  { name: "Anand Kumar", count: 42, max: 100, color: "bg-amber-500" },
                  { name: "Others", count: 161, max: 200, color: "bg-slate-500" },
                ].map((item) => (
                  <div key={item.name} className="space-y-0.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{item.name}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className={item.color} style={{ width: `${(item.count / item.max) * 100}%`, height: "100%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Maintenance Cost This Month */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Maintenance Cost This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white block">
                  ₹ 6.25 L
                </span>
                <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground mt-0.5">
                  <span>vs Last Month ₹ 5.80 L</span>
                  <span className="font-bold text-emerald-600 flex items-center">
                    <TrendingUp className="h-3 w-3 inline" /> 7.76%
                  </span>
                </div>
              </div>

              {/* Mini Area Curve */}
              <div className="h-20 w-full pt-1">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 200 60">
                  <defs>
                    <linearGradient id="maintGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon points="10,50 50,45 90,40 130,32 170,25 190,15 190,55 10,55" fill="url(#maintGrad)" />
                  <polyline points="10,50 50,45 90,40 130,32 170,25 190,15" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Calibration Due (Next 30 Days) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Calibration Due (Next 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* 0-7 Days: 15.38% */}
                  <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  {/* 8-15 Days: 30.77% */}
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="202" />
                  {/* 16-30 Days: 53.85% */}
                  <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="128" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">52</span>
                  <span className="text-[8px] text-muted-foreground uppercase font-semibold">Tools</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-rose-500" /> 0 - 7 Days</span>
                  <span className="font-mono font-bold text-rose-600">8 (15.38%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /> 8 - 15 Days</span>
                  <span className="font-mono font-bold text-amber-600">16 (30.77%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-cyan-500" /> 16 - 30 Days</span>
                  <span className="font-mono font-bold text-cyan-600">28 (53.85%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: AI Insights */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                AI Insights
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Viewing all AI Tool Governance Insights")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[9.5px]">
              <div className="flex items-start gap-1">
                <span className="text-rose-600">🔴</span>
                <span>5 critical tools have overdue maintenance.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">🟠</span>
                <span>7 tools have low utilization (&lt; 40%).</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-blue-500">ℹ️</span>
                <span>3 tools are frequently issued to multiple users.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-emerald-500">🟢</span>
                <span>Overall equipment utilization is improved by 8% vs last month.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-teal-600">ℹ️</span>
                <span>Calibration compliance is at 96% this month.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           6. FOOTER
           ==================================================================== */}
        <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <span>&copy; 2026 Magnertia ERP. All rights reserved.</span>
          <div className="flex items-center gap-4 text-[10px]">
            <span>Shortcuts:</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">D</kbd> Dashboard</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">T</kbd> Tool Register</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">M</kbd> Maintenance</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">I</kbd> Inspection</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">C</kbd> Calibration</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">R</kbd> Reports</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted border font-mono">H</kbd> Help</span>
          </div>
        </div>

        {/* ====================================================================
           MODAL 1: CREATE TOOL FORM
           ==================================================================== */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>Create Tool</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  DRAFT
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Register cutting, measuring, hand, power, or special tooling into the Tool Master.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCreateOpen(false);
                toast.success("New tool registered into Tool Master successfully!");
              }}
              className="space-y-3 text-xs pt-1"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Tool Name *</Label>
                  <Input defaultValue="Digital Caliper 300mm" required className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Tool Category *</Label>
                  <Select defaultValue="Measuring Tools">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Cutting Tools">Cutting Tools</SelectItem>
                      <SelectItem value="Measuring Tools">Measuring Tools</SelectItem>
                      <SelectItem value="Hand Tools">Hand Tools</SelectItem>
                      <SelectItem value="Power Tools">Power Tools</SelectItem>
                      <SelectItem value="Special Tools">Special Tools</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Tool Code</Label>
                  <Input defaultValue="MT-089" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Asset Tag</Label>
                  <Input defaultValue="TL-MT-000089" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Serial Number</Label>
                  <Input defaultValue="CD12-CSX-00129" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Manufacturer</Label>
                  <Input defaultValue="Mitutoyo" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Model</Label>
                  <Input defaultValue="CD-12 CSX Series" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Size / Range</Label>
                  <Input defaultValue="0-300 mm" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Tool Room Location</Label>
                  <Input defaultValue="Tool Room - 01" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Rack / Bin</Label>
                  <Input defaultValue="R-04 / B-12" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Purchase Cost (₹)</Label>
                  <Input defaultValue="4850" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Activate Tool
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: ISSUE TOOL WORKFLOW
           ==================================================================== */}
        <Dialog open={isIssueOpen} onOpenChange={setIsIssueOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Issue Tool &mdash; {activeTool.name}</DialogTitle>
              <DialogDescription className="text-xs">
                Record tool checkout, custodian assignment, and expected return date.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleIssueSubmit} className="space-y-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-muted/20 border space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tool ID / Code:</span>
                  <span className="font-mono font-bold">{activeTool.id} ({activeTool.code})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Condition:</span>
                  <span className="font-semibold text-emerald-600">Good (Calibration Valid)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Issued To (Employee) *</Label>
                  <Input defaultValue="Ramesh Kumar" required className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Employee ID</Label>
                  <Input defaultValue="EMP-00421" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Project / WO</Label>
                  <Input defaultValue="PRJ-2026-0195" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Purpose</Label>
                  <Input defaultValue="Incoming Inspection" className="h-8 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Issue Date</Label>
                  <Input type="date" defaultValue="2026-09-18" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Expected Return</Label>
                  <Input type="date" defaultValue="2026-09-20" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsIssueOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-[#0B3B7B] text-white">
                  Confirm Issue
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: RETURN TOOL WORKFLOW
           ==================================================================== */}
        <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Return Tool &mdash; {activeTool.name}</DialogTitle>
              <DialogDescription className="text-xs">
                Inspect physical condition and check back into Tool Room stock.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-muted/20 border space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued To:</span>
                  <span className="font-bold">{activeTool.issuedTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span className="font-mono">18 Sep 2026</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Condition on Return</Label>
                  <Select defaultValue="Good">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Good">Good (Ready for Reissue)</SelectItem>
                      <SelectItem value="Fair">Fair (Needs Cleaning)</SelectItem>
                      <SelectItem value="Damaged">Damaged (Send to Maint.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Inspection Result</Label>
                  <Select defaultValue="Passed">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Passed">Passed Inspection</SelectItem>
                      <SelectItem value="Hold">Hold for Calibration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px]">Remarks</Label>
                <Input defaultValue="Returned in good working condition with complete case" className="h-8 text-xs" />
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsReturnOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Check-in Return
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 4: CALIBRATION CERTIFICATE
           ==================================================================== */}
        <Dialog open={isCalibOpen} onOpenChange={setIsCalibOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Calibration Certificate &mdash; {activeTool.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                NABL accredited calibration certificate and tolerance audit.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-2.5 rounded bg-muted/20 border space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard</span>
                  <span className="font-semibold">ISO 13385-1 (Vernier/Digital)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificate No.</span>
                  <span className="font-mono font-bold">NABL-CAL-2026-0421</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Observed Deviation</span>
                  <span className="font-mono text-emerald-600 font-bold">&plusmn; 0.012 mm (&lt; &plusmn; 0.03 mm PASS)</span>
                </div>
              </div>

              <div className="p-2 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 text-xs flex items-center gap-1.5 font-semibold">
                <Calendar className="h-3.5 w-3.5 text-amber-600" />
                Next Calibration is due on {activeTool.calibrationDue}
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setIsCalibOpen(false)}>Done</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default ToolManagementFormPage;
