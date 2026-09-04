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
  CheckCircle2,
  AlertTriangle,
  Clock,
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
  TrendingUp,
  XCircle,
  FileCheck,
  Scale,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/management/asset-management/calibration")({
  head: () => ({
    meta: [
      { title: "Calibration Form · Magnertia ERP" },
      {
        name: "description",
        content: "Calibration lifecycle management of measuring and testing instruments to ensure accuracy, tolerance, and ISO compliance.",
      },
    ],
  }),
  component: CalibrationFormPage,
});

interface CalibrationItem {
  id: string;
  instrumentName: string;
  type: string;
  serialNo: string;
  calDate: string;
  calibDate?: string;
  nextDueDate: string;
  dueDate?: string;
  result: "Passed" | "Failed" | "Due Soon" | "Conditional";
  status: "Valid" | "Restricted" | "Due Soon" | "Scheduled";
  technician: string;
  manufacturer: string;
  model: string;
  assetTag: string;
  toolRoom: string;
  custodian: string;
  certNo: string;
  certificateNo?: string;
  agency?: string;
  refStandard: string;
  maxError: string;
  acceptanceLimit: string;
}

const BASE_CALIB_TEMPLATES = [
  { name: "Digital Caliper 300mm", type: "Dimensional", mfr: "Mitutoyo", model: "CD-12 CSX", std: "Gauge Block Set GB-001", limit: "±0.030 mm", room: "Inspection - 02" },
  { name: "Power Analyzer 3-Phase", type: "Electrical", mfr: "Yokogawa", model: "WT-500", std: "Fluke 5522A Calibrator", limit: "±0.020 %", room: "Lab - Electrical" },
  { name: "Pressure Gauge 0-10 Bar", type: "Pressure", mfr: "WIKA", model: "232.50", std: "Deadweight Tester DWT-100", limit: "±0.10 Bar", room: "Utility Area - Plant 01" },
  { name: "Digital Micrometer 0-25mm", type: "Dimensional", mfr: "Mitutoyo", model: "293-240-30", std: "Gauge Block Set GB-001", limit: "±0.002 mm", room: "QA Metrology Lab" },
  { name: "Infrared Thermometer -50..1000C", type: "Temperature", mfr: "Fluke", model: "568", std: "Blackbody Calibration Source", limit: "±1.0 °C", room: "Furnace Bay" },
  { name: "Torque Wrench 20-100 Nm", type: "Mechanical", mfr: "Norbar", model: "Pro 100", std: "Torque Calibration Bench", limit: "±2.0 Nm", room: "Assembly Line 01" },
  { name: "Analytical Precision Balance 220g", type: "Mass", mfr: "Mettler Toledo", model: "ME204", std: "E2 Class Standard Weights", limit: "±0.0005 g", room: "Chemistry Lab" },
  { name: "Digital Height Gauge 600mm", type: "Dimensional", mfr: "Mitutoyo", model: "LH-600E", std: "Granite Master Square & Blocks", limit: "±0.005 mm", room: "QA Metrology Lab" },
  { name: "Sound Level Meter Class 1", type: "Acoustic", mfr: "Bruel & Kjaer", model: "Type 2250", std: "Acoustic Calibrator 4231", limit: "±0.5 dB", room: "EHS Office" },
  { name: "Hydraulic Deadweight Tester", type: "Pressure", mfr: "Budenberg", model: "BGH-700", std: "Primary Deadweight Column", limit: "±0.015 %", room: "Metrology Lab" },
];

const INITIAL_CALIBRATIONS: CalibrationItem[] = Array.from({ length: 86 }, (_, i) => {
  const tpl = BASE_CALIB_TEMPLATES[i % BASE_CALIB_TEMPLATES.length];
  const numStr = String(i + 1).padStart(5, "0");
  const calNum = 884 + i;
  const status: "Valid" | "Due Soon" | "Restricted" =
    i % 9 === 0 ? "Due Soon" :
    i % 14 === 0 ? "Restricted" : "Valid";

  const result: "Passed" | "Failed" | "Conditional" =
    status === "Restricted" ? "Failed" :
    status === "Due Soon" ? "Conditional" : "Passed";

  const day = ((i * 3) % 28) + 1;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const calDate = `${String(day).padStart(2, "0")} ${months[i % 12]} 2026`;
  const nextDueDate = `${String(day).padStart(2, "0")} ${months[(i + 6) % 12]} 2027`;
  const certNo = `CAL-CERT-2026-${String(calNum).padStart(5, "0")}`;

  return {
    id: `CAL-2026-${String(calNum).padStart(5, "0")}`,
    instrumentName: i < BASE_CALIB_TEMPLATES.length ? tpl.name : `${tpl.name} #${Math.floor(i / BASE_CALIB_TEMPLATES.length) + 1}`,
    type: tpl.type as any,
    serialNo: `SN-${tpl.mfr.substring(0, 3).toUpperCase()}-${numStr}`,
    calDate,
    calibDate: calDate,
    nextDueDate,
    dueDate: nextDueDate,
    result,
    status,
    technician: `Eng. ${["Arun Verma", "S. Mohan", "R. Kumar", "K. Suresh"][i % 4]}`,
    manufacturer: tpl.mfr,
    model: tpl.model,
    assetTag: `EQ-CAL-${numStr}`,
    toolRoom: tpl.room,
    custodian: "Quality Manager",
    certNo,
    certificateNo: certNo,
    agency: "NABL Accredited Metrology Lab",
    refStandard: tpl.std,
    maxError: status === "Restricted" ? "+0.080 mm" : "+0.010 mm",
    acceptanceLimit: tpl.limit,
  };
});

export function CalibrationFormPage() {
  const [calibrations, setCalibrations] = useState<CalibrationItem[]>(INITIAL_CALIBRATIONS);
  const [activeCalib, setActiveCalib] = useState<CalibrationItem>(INITIAL_CALIBRATIONS[0]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["Calibration ID", "Instrument Name", "Type", "Serial No", "Calibration Date", "Due Date", "Status", "Agency", "Certificate No", "Result"];
    const rows = calibrations.map(c => [
      c.id,
      `"${c.instrumentName}"`,
      `"${c.type}"`,
      `"${c.serialNo}"`,
      c.calibDate || c.calDate,
      c.dueDate || c.nextDueDate,
      c.status,
      `"${c.agency || "NABL Accredited Metrology Lab"}"`,
      `"${c.certificateNo || c.certNo}"`,
      c.result
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Calibration_Register_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Calibration Register exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("ISO/IEC 17025 metrology calibration register synchronized!");
    }, 600);
  };

  // Modals
  const [isNewCalibOpen, setIsNewCalibOpen] = useState(false);
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);

  // Filter items
  const filteredCalibrations = useMemo(() => {
    return calibrations.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instrumentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.technician.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All") return matchSearch;
      if (selectedFilter === "Valid") return matchSearch && item.status === "Valid";
      if (selectedFilter === "Due Soon") return matchSearch && item.status === "Due Soon";
      if (selectedFilter === "Overdue") return matchSearch && item.result === "Due Soon";
      if (selectedFilter === "Failed") return matchSearch && item.result === "Failed";
      if (selectedFilter === "Scheduled") return matchSearch;
      if (selectedFilter === "In Progress") return matchSearch;
      return matchSearch;
    });
  }, [calibrations, searchQuery, selectedFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Paginated Calibrations
  const totalPages = Math.max(1, Math.ceil(filteredCalibrations.length / pageSize));
  const paginatedCalibrations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCalibrations.slice(start, start + pageSize);
  }, [filteredCalibrations, currentPage, pageSize]);

  return (
    <AppShell
      title="Calibration Form"
      breadcrumb="Management > Asset Management > Calibration"
      description="Manage calibration of measuring and testing instruments to ensure accuracy and compliance."
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
                Calibration Form
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; Manage calibration of measuring and testing instruments to ensure accuracy and compliance
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
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported Calibration Register (.xlsx)"); }}>
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
                  <DropdownMenuItem onClick={() => toast.info("Opening Calibration Compliance Audit...")}>
                    Calibration Compliance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Overdue Instrument Report...")}>
                    Overdue Instrument List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Reference Standards Traceability...")}>
                    Reference Standards Traceability
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + New Calibration Primary Button */}
              <Button
                onClick={() => setIsNewCalibOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Calibration</span>
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
                  <DropdownMenuItem onClick={() => setIsMeasurementsOpen(true)}>
                    Enter Measurements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsCertOpen(true)}>
                    View Certificate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Out-of-Tolerance Quarantine Log opened")}>
                    Quarantine Instruments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print Calibration Stickers
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
          {/* Card 1: Total Instruments */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Total Instruments</span>
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Scale className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">684</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All Instruments</span>
            </div>
          </div>

          {/* Card 2: Calibrated (Valid) */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Calibrated (Valid)</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">612</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                89.47% of Total
              </span>
            </div>
          </div>

          {/* Card 3: Due Soon */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Due Soon</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">48</span>
              <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                7.02% of Total
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
              <span className="text-2xl font-bold font-mono text-rose-600">19</span>
              <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                2.78% of Total
              </span>
            </div>
          </div>

          {/* Card 5: Failed */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Failed</span>
              <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <XCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-purple-600">5</span>
              <span className="block text-[10px] text-purple-700 dark:text-purple-400 font-medium">
                0.73% of Total
              </span>
            </div>
          </div>

          {/* Card 6: Compliance */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Compliance</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">96%</span>
              <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                Overall Compliance
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           3. MIDDLE SECTION (3 CARDS: Compact, Small & Balanced)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Card 1: Calibration Status (Compact Side-by-Side) */}
          <Card className="md:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Calibration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="25.1" />
                    <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="8.3" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="1.7" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-emerald-600">89.5%</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Valid</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Certified
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">612</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Due 30 Days
                    </span>
                    <span className="font-mono font-semibold text-amber-600">48</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Overdue
                    </span>
                    <span className="font-mono font-semibold text-rose-600">19</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Out of Spec
                    </span>
                    <span className="font-mono font-semibold text-purple-600">5</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>ISO 17025: <strong className="text-emerald-600 font-mono">96.5% Traceable</strong></span>
                <span>Standards: <strong className="text-primary font-mono">NIST Active</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Calibration Trend (Last 6 Months) (5 cols, Compact) */}
          <Card className="md:col-span-5 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Calibration Trend (6 Months)
              </CardTitle>
              <div className="flex items-center gap-2.5 text-[9.5px]">
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Calibrated</span>
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Due</span>
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Overdue</span>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              <div className="h-28 w-full pt-1">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 280 100">
                  <line x1="15" y1="20" x2="265" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="50" x2="265" y2="50" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="80" x2="265" y2="80" stroke="currentColor" strokeOpacity="0.08" />

                  {/* Calibrated Line (Green) */}
                  <polyline points="25,38 70,32 115,26 160,22 205,18 250,15" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                  {[
                    { x: 25, y: 38, val: "540" },
                    { x: 70, y: 32, val: "556" },
                    { x: 115, y: 26, val: "578" },
                    { x: 160, y: 22, val: "596" },
                    { x: 205, y: 18, val: "604" },
                    { x: 250, y: 15, val: "612" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="2.5" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
                      <text x={pt.x} y={pt.y - 5} fontSize="7" fontWeight="bold" textAnchor="middle" fill="#059669">{pt.val}</text>
                    </g>
                  ))}

                  {/* Due Soon Line (Amber) */}
                  <polyline points="25,68 70,66 115,64 160,62 205,58 250,56" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                  {[
                    { x: 25, y: 68, val: "32" },
                    { x: 70, y: 66, val: "35" },
                    { x: 115, y: 64, val: "38" },
                    { x: 160, y: 62, val: "40" },
                    { x: 205, y: 58, val: "46" },
                    { x: 250, y: 56, val: "48" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="2" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
                      <text x={pt.x} y={pt.y - 4} fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="#d97706">{pt.val}</text>
                    </g>
                  ))}

                  {/* Overdue Line (Red) */}
                  <polyline points="25,86 70,85 115,84 160,82 205,81 250,79" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                  {[
                    { x: 25, y: 86, val: "12" },
                    { x: 70, y: 85, val: "13" },
                    { x: 115, y: 84, val: "14" },
                    { x: 160, y: 82, val: "16" },
                    { x: 205, y: 81, val: "17" },
                    { x: 250, y: 79, val: "19" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="2" fill="#ffffff" stroke="#ef4444" strokeWidth="1" />
                      <text x={pt.x} y={pt.y + 8} fontSize="6.5" fontWeight="bold" textAnchor="middle" fill="#dc2626">{pt.val}</text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-[8.5px] font-mono text-muted-foreground px-2 border-t border-border/30 pt-1">
                <span>Apr 26</span>
                <span>May 26</span>
                <span>Jun 26</span>
                <span>Jul 26</span>
                <span>Aug 26</span>
                <span>Sep 26</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Upcoming Calibrations (3 cols, Compact) */}
          <Card className="md:col-span-3 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upcoming Calibrations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/40">
                  <span className="text-muted-foreground">Due Today</span>
                  <span className="font-mono font-bold text-rose-600">3</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40">
                  <span className="text-muted-foreground">Due This Week</span>
                  <span className="font-mono font-bold text-amber-600">12</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/30">
                  <span className="text-muted-foreground">Due This Month</span>
                  <span className="font-mono font-bold text-amber-700">48</span>
                </div>
                <div className="flex justify-between items-center px-2 py-0.5 rounded bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/40">
                  <span className="text-muted-foreground">Due Next Month</span>
                  <span className="font-mono font-bold text-blue-600">71</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.info("Opening master calibration schedule calendar")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer block pt-1 text-center w-full"
              >
                View Full Schedule &rarr;
              </button>
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. CALIBRATION REGISTER TABLE (Full Width Master Box - Zero Side Scrolling)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Calibration Register
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredCalibrations.length} calibrations
                  </Badge>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search instrument, tag, serial..."
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
                    onClick={() => toast.info("Displaying all 10 calibration columns")}
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
                {["All", "Valid", "Due Soon", "Overdue", "Failed", "Scheduled", "In Progress"].map((filter) => (
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
                    <th className="p-3 pl-4">Calibration ID</th>
                    <th className="p-3">Instrument Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 font-mono">Asset Tag / QR</th>
                    <th className="p-3 font-mono">Last Calib Date</th>
                    <th className="p-3 font-mono">Next Due Date</th>
                    <th className="p-3 text-center">Result</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3">Technician</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedCalibrations.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-muted-foreground">
                        No calibration records match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedCalibrations.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setActiveCalib(item)}
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          activeCalib.id === item.id ? "bg-primary/5 dark:bg-primary/10" : ""
                        )}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px]">
                          {item.id}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{item.instrumentName}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              SN: {item.serialNo} &bull; Model: {item.model}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {item.type}
                        </td>
                        <td className="p-3 font-mono text-muted-foreground text-[10.5px]">
                          {item.assetTag}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {item.calDate}
                        </td>
                        <td className="p-3 font-mono text-[10.5px]">
                          {item.nextDueDate}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              item.result === "Passed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.result === "Conditional"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            )}
                          >
                            {item.result}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              item.status === "Valid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.status === "Due Soon"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : item.status === "Scheduled"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 dark:text-slate-200">
                          {item.technician}
                        </td>
                        <td className="p-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCalib(item);
                                setIsCertOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="View Certificate"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCalib(item);
                                setIsMeasurementsOpen(true);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Measurement Points"
                            >
                              <FileCheck className="h-3.5 w-3.5" />
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
              totalEntries={filteredCalibrations.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              entityName="calibrations"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. SELECTED CALIBRATION DETAILS (Full Width Box)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2.5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Calibration Details: <span className="font-mono text-primary">{activeCalib.id}</span> - {activeCalib.instrumentName}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                {activeCalib.result}
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                {activeCalib.status}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <button
                type="button"
                onClick={() => setIsMeasurementsOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Edit Measurements"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Measurements</span>
              </button>
              <button
                type="button"
                onClick={() => toast.info(`Calibration QR Tag: ${activeCalib.id}`)}
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
                title="Print Calibration Certificate"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCertOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                title="Full Certificate"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Full Certificate &rarr;</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Col 1: Visual Display & Identification */}
              <div className="space-y-3">
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl border flex items-center justify-center p-2 relative overflow-hidden">
                  <svg className="h-20 w-auto text-slate-700 dark:text-slate-300 drop-shadow-md" viewBox="0 0 160 70" fill="none">
                    <rect x="20" y="28" width="120" height="12" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                    <path d="M20 18 L30 18 L30 55 L20 40 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
                    <rect x="60" y="22" width="35" height="24" rx="2.5" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
                    <rect x="65" y="26" width="25" height="10" rx="1.5" fill="#0284c7" />
                    <text x="77" y="34" fontSize="7" fill="white" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      124.50
                    </text>
                    <path d="M60 40 L70 40 L70 58 L60 48 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
                  </svg>
                  <div className="absolute bottom-1.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[9.5px] px-2 py-0.5 rounded font-mono">
                    {activeCalib.assetTag}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-muted/20 rounded-lg border border-border/40 text-[11px]">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Manufacturer</span>
                    <span className="font-semibold">{activeCalib.manufacturer}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Model</span>
                    <span className="font-semibold font-mono">{activeCalib.model}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Serial Number</span>
                    <span className="font-mono">{activeCalib.serialNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Instrument Type</span>
                    <span className="font-medium">{activeCalib.type} Measuring</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Specifications, Tool Room & Custodian */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Tool Room:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeCalib.toolRoom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Designated Custodian:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeCalib.custodian}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certified Technician:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activeCalib.technician}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate Number:</span>
                    <span className="font-mono text-primary font-bold">{activeCalib.certNo}</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded-lg border border-blue-200/40 space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Reference Standard:</span>
                    <span className="font-medium">{activeCalib.refStandard}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Compliance Standard:</span>
                    <span className="font-mono">ISO/IEC 17025:2017</span>
                  </div>
                </div>
              </div>

              {/* Col 3: Calibration Results, Error Limit & Actions */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Calibration Date:</span>
                    <span className="font-mono font-semibold">{activeCalib.calDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next Due Date:</span>
                    <span className="font-mono font-bold text-primary">{activeCalib.nextDueDate} (6 Months)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Max Observed Error:</span>
                    <span className="font-mono font-bold text-emerald-600">{activeCalib.maxError}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Acceptance Limit:</span>
                    <span className="font-mono text-muted-foreground">{activeCalib.acceptanceLimit}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCertOpen(true)}
                  className="w-full text-xs text-primary font-bold cursor-pointer"
                >
                  View Full Calibration Certificate & History &rarr;
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====================================================================
           5. BOTTOM 5 CARDS (Compliance, Dept Bars, Cost, Ref Standards, AI Insights)
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          {/* Card 1: Calibration Compliance (Ultra-Clean Executive Speedometer) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between overflow-hidden">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Calibration Compliance
              </CardTitle>
              <Badge variant="outline" className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                ISO 17025
              </Badge>
            </CardHeader>
            <CardContent className="p-3 flex-1 flex flex-col justify-between items-center text-center space-y-2">
              <div className="relative w-44 h-24 mt-1 flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 180 98">
                  <defs>
                    <linearGradient id="calibGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="60%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Outer subtle decorative tick ring */}
                  <path
                    d="M 18 85 A 72 72 0 0 1 162 85"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.08"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                  />

                  {/* Background Track with rounded ends */}
                  <path
                    d="M 26 85 A 64 64 0 0 1 154 85"
                    fill="none"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Active Compliance Arc (96% = dashoffset 8.04 on total length 201.06) */}
                  <path
                    d="M 26 85 A 64 64 0 0 1 154 85"
                    fill="none"
                    stroke="url(#calibGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="201.06"
                    strokeDashoffset="8.04"
                    filter="url(#glowGreen)"
                    className="transition-all duration-1000 ease-out"
                  />

                  {/* Target Threshold Pip at 95% */}
                  <line x1="148" y1="76" x2="158" y2="74" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

                  {/* Leading Edge Accent Indicator Pip at 96% */}
                  <circle cx="153.5" cy="77" r="3.5" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
                </svg>

                {/* Centered Value Readout with proper breathing room */}
                <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      96.0
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">%</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 -mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Compliant
                  </span>
                </div>
              </div>

              {/* Scale Labels */}
              <div className="flex justify-between w-full text-[8.5px] font-mono text-muted-foreground px-3 -mt-1.5">
                <span>0%</span>
                <span className="text-emerald-600 font-semibold text-[8px]">Target: &ge;95%</span>
                <span>100%</span>
              </div>

              {/* Status Breakdown with Mini-Bars */}
              <div className="w-full space-y-1 text-[10px] pt-1.5 border-t border-border/40">
                <div className="flex justify-between items-center px-1.5 py-0.5 rounded bg-emerald-50/60 dark:bg-emerald-950/20">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Compliant
                  </span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">612 (89.5%)</span>
                </div>
                <div className="flex justify-between items-center px-1.5 py-0.5 rounded bg-amber-50/60 dark:bg-amber-950/20">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Due Soon
                  </span>
                  <span className="font-mono font-semibold text-amber-700 dark:text-amber-300">48 (7.0%)</span>
                </div>
                <div className="flex justify-between items-center px-1.5 py-0.5 rounded bg-rose-50/60 dark:bg-rose-950/20">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Overdue
                  </span>
                  <span className="font-mono font-semibold text-rose-700 dark:text-rose-300">19 (2.8%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Calibration by Department */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Calibration by Department
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[10.5px]">
              {[
                { name: "Quality", count: "186 (99%)", max: 250, pct: 74, color: "bg-blue-600" },
                { name: "Production", count: "214 (98%)", max: 250, pct: 85, color: "bg-teal-500" },
                { name: "Maintenance", count: "82 (94%)", max: 250, pct: 33, color: "bg-emerald-500" },
                { name: "Electrical", count: "96 (97%)", max: 250, pct: 38, color: "bg-indigo-600" },
                { name: "R&D", count: "32 (100%)", max: 250, pct: 13, color: "bg-purple-600" },
                { name: "Other", count: "74 (97%)", max: 250, pct: 30, color: "bg-slate-500" },
              ].map((d) => (
                <div key={d.name} className="space-y-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-700 dark:text-slate-300">{d.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{d.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={d.color} style={{ width: `${d.pct}%`, height: "100%" }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 3: Calibration Cost (This Month) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Calibration Cost (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white block">
                  ₹ 1.26 L
                </span>
                <div className="flex items-center gap-1 text-[10.5px] text-muted-foreground mt-0.5">
                  <span>₹ 1.15 L</span>
                  <span className="font-bold text-emerald-600 flex items-center">
                    <TrendingUp className="h-3 w-3 inline" /> 9.57%
                  </span>
                </div>
              </div>

              {/* Mini Area Curve */}
              <div className="h-20 w-full pt-1">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 200 60">
                  <defs>
                    <linearGradient id="calibGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon points="10,48 50,44 90,38 130,42 170,36 190,20 190,55 10,55" fill="url(#calibGrad)" />
                  <polyline points="10,48 50,44 90,38 130,42 170,36 190,20" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                <span>Apr 26</span>
                <span>May 26</span>
                <span>Jun 26</span>
                <span>Jul 26</span>
                <span>Aug 26</span>
                <span>Sep 26</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Reference Standards (Donut) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Reference Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  {/* Valid: 94.19% */}
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  {/* Due Soon: 4.65% */}
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="14" />
                  {/* Expired: 1.16% */}
                  <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="3" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">86</span>
                  <span className="text-[8px] text-muted-foreground uppercase font-semibold">Standards</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Valid</span>
                  <span className="font-mono font-bold text-emerald-600">81 (94.19%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /> Due Soon</span>
                  <span className="font-mono font-bold text-amber-600">4 (4.65%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-rose-500" /> Expired</span>
                  <span className="font-mono font-bold text-rose-600">1 (1.16%)</span>
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
                onClick={() => toast.info("Viewing all AI Calibration Intelligence alerts")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[9.5px]">
              <div className="flex items-start gap-1">
                <span className="text-rose-600">🔴</span>
                <span>19 instruments are overdue for calibration.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-rose-600">🔴</span>
                <span>5 instruments failed latest calibration.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-amber-500">🟠</span>
                <span>48 instruments are due within the current period.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-blue-500">ℹ️</span>
                <span>One instrument shows a gradual increase in error.</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-emerald-500">🟢</span>
                <span>Overall calibration compliance is at 96%.</span>
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
           MODAL 1: NEW CALIBRATION FORM
           ==================================================================== */}
        <Dialog open={isNewCalibOpen} onOpenChange={setIsNewCalibOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>New Calibration</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  SCHEDULED
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Schedule and document ISO/IEC 17025 compliant calibration session.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewCalibOpen(false);
                toast.success("New calibration record logged and scheduled successfully!");
              }}
              className="space-y-3 text-xs pt-1"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Instrument / Tool *</Label>
                  <Input defaultValue="Digital Caliper 300mm" required className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Instrument Type</Label>
                  <Select defaultValue="Dimensional">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Dimensional">Dimensional</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Pressure">Pressure</SelectItem>
                      <SelectItem value="Torque">Torque</SelectItem>
                      <SelectItem value="Temperature">Temperature</SelectItem>
                      <SelectItem value="Mass">Mass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Calibration ID</Label>
                  <Input defaultValue="CAL-2026-00892" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Instrument ID</Label>
                  <Input defaultValue="TL-MT-000089" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Serial Number</Label>
                  <Input defaultValue="CD12-CSX-00129" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Calibration Type</Label>
                  <Select defaultValue="Periodic">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Periodic">Periodic</SelectItem>
                      <SelectItem value="Initial">Initial</SelectItem>
                      <SelectItem value="After Repair">After Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Approved Method</Label>
                  <Input defaultValue="CAL-DIM-004" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Frequency</Label>
                  <Input defaultValue="6 Months" className="h-8 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Reference Standard</Label>
                  <Input defaultValue="Gauge Block Set GB-001" className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Standard Certificate</Label>
                  <Input defaultValue="REF-CAL-2026-091" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsNewCalibOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Start Calibration
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: MEASUREMENTS POINT MATRIX
           ==================================================================== */}
        <Dialog open={isMeasurementsOpen} onOpenChange={setIsMeasurementsOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Calibration Measurements &mdash; {activeCalib.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {activeCalib.instrumentName} &bull; Tolerance limit: {activeCalib.acceptanceLimit}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <table className="w-full text-xs text-left border">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground font-semibold border-b">
                    <th className="p-2">Point</th>
                    <th className="p-2">Standard</th>
                    <th className="p-2">Instrument</th>
                    <th className="p-2">Error</th>
                    <th className="p-2 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono text-[11px]">
                  {[
                    { pt: "0 mm", std: "0.000 mm", inst: "0.000 mm", err: "0.000 mm" },
                    { pt: "50 mm", std: "50.000 mm", inst: "50.010 mm", err: "+0.010 mm" },
                    { pt: "100 mm", std: "100.000 mm", inst: "100.020 mm", err: "+0.020 mm" },
                    { pt: "150 mm", std: "150.000 mm", inst: "150.020 mm", err: "+0.020 mm" },
                    { pt: "200 mm", std: "200.000 mm", inst: "200.030 mm", err: "+0.030 mm" },
                    { pt: "250 mm", std: "250.000 mm", inst: "250.020 mm", err: "+0.020 mm" },
                    { pt: "300 mm", std: "300.000 mm", inst: "300.020 mm", err: "+0.020 mm" },
                  ].map((row) => (
                    <tr key={row.pt}>
                      <td className="p-2 font-semibold font-sans">{row.pt}</td>
                      <td className="p-2">{row.std}</td>
                      <td className="p-2">{row.inst}</td>
                      <td className="p-2 text-emerald-600 font-bold">{row.err}</td>
                      <td className="p-2 text-center">
                        <Badge className="bg-emerald-600 text-white text-[9px] h-4">PASS</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-2 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs flex items-center justify-between font-semibold">
                <span>Maximum Observed Error: +0.030 mm</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Passed Acceptance Limit</span>
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setIsMeasurementsOpen(false)}>Done</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: CALIBRATION CERTIFICATE
           ==================================================================== */}
        <Dialog open={isCertOpen} onOpenChange={setIsCertOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>Calibration Certificate</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-emerald-50 text-emerald-700">
                  ISO/IEC 17025
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Official calibration test certificate and traceability record.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1 p-3 bg-muted/20 border rounded-lg">
              <div className="flex justify-between border-b pb-2">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Certificate No.</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{activeCalib.certNo}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Date of Issue</span>
                  <span className="font-mono">{activeCalib.calDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Instrument</span>
                  <span className="font-semibold">{activeCalib.instrumentName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Serial Number</span>
                  <span className="font-mono">{activeCalib.serialNo}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Reference Standard</span>
                  <span>{activeCalib.refStandard}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Next Due Date</span>
                  <span className="font-mono font-bold text-primary">{activeCalib.nextDueDate}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-emerald-50 text-emerald-800 text-center font-bold text-xs border border-emerald-200">
                ✓ RESULT: PASSED &bull; MAX ERROR: {activeCalib.maxError}
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5 mr-1" /> Print
                </Button>
                <Button size="sm" onClick={() => setIsCertOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default CalibrationFormPage;
