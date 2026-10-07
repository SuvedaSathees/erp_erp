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
  BarChart3,
  Cpu,
  Zap,
  AlertTriangle,
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
  QrCode,
  Lock,
  Maximize2,
  Sparkles,
  Activity,
  ArrowRight,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
// HMR verified: all Lucide icons defined

export const Route = createFileRoute("/management/asset-management/predictive-maintenance")({
  head: () => ({
    meta: [
      { title: "Predictive Maintenance Form · Magnertia ERP" },
      {
        name: "description",
        content: "AI-powered predictions combining sensor data, operating data and history to predict failures and recommend actions.",
      },
    ],
  }),
  component: PredictiveMaintenanceFormPage,
});

interface PredictionItem {
  id: string;
  asset: string;
  assetName?: string;
  assetId?: string;
  location?: string;
  model?: string;
  failureMode: string;
  failureProb: string;
  probNum: number;
  risk?: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  rul: string;
  rulHours?: string;
  rulUnit: "Hours" | "Days" | "Cycles";
  predictionDate: string;
  recommendedDate?: string;
  status: "Alert" | "Monitoring" | "Action" | "Closed";
  confidence: string;
  action: "Inspect" | "Schedule PM" | "Monitor";
  recommendedAction?: string;
  anomalyScore?: string;
}

const BASE_PRED_TEMPLATES = [
  { asset: "CNC VMC-850", mode: "Spindle Bearing Failure", prob: 72, risk: "High" as const, rul: "126", unit: "Hours", act: "Inspect" as const, conf: "92%" },
  { asset: "Compressor 75kW", mode: "Screw Bearing Degradation", prob: 68, risk: "High" as const, rul: "94", unit: "Hours", act: "Schedule PM" as const, conf: "89%" },
  { asset: "Generator 125kVA", mode: "Coolant Loop Degradation", prob: 51, risk: "Medium" as const, rul: "18", unit: "Days", act: "Monitor" as const, conf: "86%" },
  { asset: "EV Charger 60kW", mode: "Cooling Fan Abnormal Vibration", prob: 43, risk: "Medium" as const, rul: "21", unit: "Days", act: "Inspect" as const, conf: "91%" },
  { asset: "Hydraulic Press 200T", mode: "Main Seal High Pressure Leak", prob: 35, risk: "Low" as const, rul: "26", unit: "Days", act: "Monitor" as const, conf: "88%" },
  { asset: "Chiller Unit 50TR", mode: "Circulation Pump Cavitation", prob: 28, risk: "Low" as const, rul: "32", unit: "Days", act: "Monitor" as const, conf: "87%" },
  { asset: "Air Handler AHU-02", mode: "Drive Motor Thermal Overload", prob: 24, risk: "Low" as const, rul: "45", unit: "Days", act: "Monitor" as const, conf: "84%" },
  { asset: "Conveyor System Line 1", mode: "Belt Splice Stress Fracture", prob: 19, risk: "Low" as const, rul: "52", unit: "Days", act: "Monitor" as const, conf: "83%" },
  { asset: "Laser Cutting Machine 6kW", mode: "Optic Mirror Thermal Drift", prob: 76, risk: "Critical" as const, rul: "48", unit: "Hours", act: "Inspect" as const, conf: "95%" },
  { asset: "Robotic MIG Cell", mode: "Harmonic Drive Backlash", prob: 59, risk: "Medium" as const, rul: "14", unit: "Days", act: "Schedule PM" as const, conf: "90%" },
];

const INITIAL_PREDICTIONS: PredictionItem[] = Array.from({ length: 64 }, (_, i) => {
  const tpl = BASE_PRED_TEMPLATES[i % BASE_PRED_TEMPLATES.length];
  const numStr = String(481 + i).padStart(5, "0");
  const day = ((i * 3) % 28) + 1;
  const status: "Alert" | "Monitoring" | "Action" | "Closed" =
    i % 6 === 0 ? "Alert" :
    i % 7 === 0 ? "Action" :
    i % 9 === 0 ? "Closed" : "Monitoring";

  const assetName = i < BASE_PRED_TEMPLATES.length ? tpl.asset : `${tpl.asset} Unit #${Math.floor(i / BASE_PRED_TEMPLATES.length) + 1}`;

  return {
    id: `PDM-2026-${numStr}`,
    asset: assetName,
    assetName,
    assetId: `FA-EQP-${numStr}`,
    location: "Plant 01 - Machine Shop",
    model: `MOD-${tpl.asset.slice(0, 3).toUpperCase()}`,
    failureMode: tpl.mode,
    failureProb: `${tpl.prob}%`,
    probNum: tpl.prob,
    risk: tpl.risk,
    riskLevel: tpl.risk as any,
    rul: tpl.rul,
    rulHours: `${tpl.rul} ${tpl.unit}`,
    rulUnit: tpl.unit,
    predictionDate: `${String(day).padStart(2, "0")} Sep 2026 10:15`,
    recommendedDate: `${String(Math.min(28, day + 3)).padStart(2, "0")} Sep 2026`,
    status,
    confidence: tpl.conf,
    action: tpl.act,
    recommendedAction: tpl.act,
    anomalyScore: `${(0.7 + (tpl.prob / 350)).toFixed(2)}`,
  };
});

const HIGH_RISK_LIST = [
  { asset: "CNC VMC-850", id: "EQ-CNC-00241", mode: "Spindle Bearing", prob: "72%", rul: "126 Hrs", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { asset: "Compressor 75kW", id: "EQ-CMP-00073", mode: "Bearing Failure", prob: "68%", rul: "94 Hrs", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { asset: "Generator 125kVA", id: "EQ-GEN-00125", mode: "Cooling System", prob: "51%", rul: "18 Days", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { asset: "EV Charger 60kW", id: "EQ-EVC-00012", mode: "Fan Degradation", prob: "43%", rul: "21 Days", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { asset: "Hydraulic Press 200T", id: "EQ-PRS-00021", mode: "Hydraulic Leak", prob: "35%", rul: "26 Days", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
];

export function PredictiveMaintenanceFormPage() {
  const [predictions, setPredictions] = useState<PredictionItem[]>(INITIAL_PREDICTIONS);
  const [activeItem, setActiveItem] = useState<PredictionItem>(INITIAL_PREDICTIONS[0]);
  const [selectedFilter, setSelectedFilter] = useState("All (64)");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01 Sep 2026 - 30 Sep 2026");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportCsv = () => {
    const headers = ["ID", "Asset Name", "Location", "Failure Risk", "RUL", "Failure Mode", "Confidence", "Action", "Status"];
    const rows = predictions.map(p => [
      p.id,
      `"${p.assetName || p.asset}"`,
      `"${p.location || "Plant 01"}"`,
      p.riskLevel,
      `"${p.rul} ${p.rulUnit}"`,
      `"${p.failureMode}"`,
      p.confidence,
      `"${p.action}"`,
      p.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Predictive_Telemetry_Predictions_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Predictive Maintenance Telemetry exported as CSV successfully!");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("IoT vibration, temperature & telemetry models synchronized!");
    }, 600);
  };

  // Modals
  const [isNewProfileOpen, setIsNewProfileOpen] = useState(false);
  const [isLiveMonitorOpen, setIsLiveMonitorOpen] = useState(false);
  const [isWOOpen, setIsWOOpen] = useState(false);

  // Filter items
  const filteredPredictions = useMemo(() => {
    return predictions.filter((p) => {
      const matchSearch =
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.failureMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.action.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All (64)") return matchSearch;
      if (selectedFilter === "Critical (3)") return matchSearch && p.riskLevel === "Critical";
      if (selectedFilter === "High (11)") return matchSearch && p.riskLevel === "High";
      if (selectedFilter === "Medium (18)") return matchSearch && p.riskLevel === "Medium";
      if (selectedFilter === "Low (32)") return matchSearch && p.riskLevel === "Low";
      if (selectedFilter === "Alert (14)") return matchSearch && p.status === "Alert";
      if (selectedFilter === "Action (6)") return matchSearch && p.status === "Action";
      if (selectedFilter === "Closed (2)") return matchSearch && p.status === "Closed";
      return matchSearch;
    });
  }, [predictions, searchQuery, selectedFilter]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  // Paginated Predictions
  const totalPages = Math.max(1, Math.ceil(filteredPredictions.length / pageSize));
  const paginatedPredictions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPredictions.slice(start, start + pageSize);
  }, [filteredPredictions, currentPage, pageSize]);

  return (
    <AppShell
      title="Predictive Maintenance Form"
      breadcrumb="Management > Asset Management > Predictive Maintenance"
      description="AI-powered predictions combining sensor data, operating data and history to predict failures and recommend actions."
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
                Predictive Maintenance Form
              </h1>
              <span className="text-xs text-muted-foreground truncate hidden 2xl:inline">
                &bull; AI-powered predictions combining sensor data, operating telemetry and failure modes
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
                  <DropdownMenuItem onClick={() => { handleExportCsv(); toast.success("Exported AI Predictions (.xlsx)"); }}>
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
                  <DropdownMenuItem onClick={() => toast.info("Opening RUL Forecast Report...")}>
                    RUL Forecast Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Prediction Accuracy Audit...")}>
                    Prediction Accuracy Audit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Opening Sensor Drift & Health Analytics...")}>
                    Sensor Health & Drift
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* + New Prediction Primary Button */}
              <Button
                onClick={() => setIsNewProfileOpen(true)}
                size="sm"
                className="h-8 px-3 bg-[#0B3B7B] hover:bg-[#082B5B] text-white text-xs gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Prediction</span>
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
                  <DropdownMenuItem onClick={() => setIsLiveMonitorOpen(true)}>
                    Live Condition Monitor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsWOOpen(true)}>
                    Generate Predictive WO
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Triggered AI Neural Model Retrain Pipeline")}>
                    Trigger Model Retrain
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { window.print(); }}>
                    Print Telemetry Digest
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
                <BarChart3 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">1,248</span>
              <span className="block text-[10px] text-muted-foreground font-medium">All Assets</span>
            </div>
          </div>

          {/* Card 2: Monitored Assets */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Monitored Assets</span>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Cpu className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-600">386</span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                30.9% of Total
              </span>
            </div>
          </div>

          {/* Card 3: Total Predictions */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Total Predictions</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-amber-600">64</span>
              <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                This Month
              </span>
            </div>
          </div>

          {/* Card 4: High Risk Assets */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">High Risk Assets</span>
              <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-rose-600">14</span>
              <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                3.6% of Monitored
              </span>
            </div>
          </div>

          {/* Card 5: Critical Risk Assets */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">Critical Risk Assets</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <AlertOctagon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-primary">3</span>
              <span className="block text-[10px] text-primary dark:text-blue-400 font-medium">
                0.8% of Monitored
              </span>
            </div>
          </div>

          {/* Card 6: AI Confidence */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">AI Confidence</span>
              <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold font-mono text-teal-600">92%</span>
              <span className="block text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                Model Confidence
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           3. MIDDLE SECTION (4 CARDS: Compact, Small & Balanced)
           ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Asset Health Overview (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Asset Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="196.7" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="230.1" />
                    <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="236.8" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">386</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Assets</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Healthy</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">318</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Watch</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">54</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> High Risk</span>
                    <span className="font-mono font-semibold text-amber-600">11</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Critical</span>
                    <span className="font-mono font-semibold text-rose-600">3</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Healthy Fleet: <strong className="text-emerald-600 font-mono">82.4%</strong></span>
                <span>At Risk: <strong className="text-rose-600 font-mono">3.6%</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Predictions Trend (Compact Line Chart) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Predictions Trend
              </CardTitle>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Total</span>
                <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> High Risk</span>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              <div className="h-28 w-full pt-1">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 100">
                  <line x1="15" y1="20" x2="225" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="50" x2="225" y2="50" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="15" y1="80" x2="225" y2="80" stroke="currentColor" strokeOpacity="0.08" />

                  <polyline points="25,62 65,58 105,52 145,44 185,42 220,36" fill="none" stroke="#10b981" strokeWidth="2" />
                  {[
                    { x: 25, y: 62 }, { x: 65, y: 58 }, { x: 105, y: 52 }, { x: 145, y: 44 }, { x: 185, y: 42 }, { x: 220, y: 36 },
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="2" fill="#10b981" />
                  ))}

                  <polyline points="25,85 65,82 105,80 145,74 185,70 220,66" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                  {[
                    { x: 25, y: 85 }, { x: 65, y: 82 }, { x: 105, y: 80 }, { x: 145, y: 74 }, { x: 185, y: 70 }, { x: 220, y: 66 },
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r="2" fill="#ef4444" />
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

          {/* Card 3: Failure Risk Distribution (Compact Side-by-Side) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#38bdf8" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="119.3" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="186.4" />
                    <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="10" fill="transparent" strokeDasharray="238.76" strokeDashoffset="227.5" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">64</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Critical</span>
                    <span className="font-mono font-bold text-rose-600">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> High</span>
                    <span className="font-mono font-semibold text-amber-600">11</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Medium</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Low</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">32</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[9.5px] pt-1.5 border-t border-border/40 text-muted-foreground">
                <span>Model Confidence: <strong className="text-emerald-600 font-mono">92.4%</strong></span>
                <span>High + Crit: <strong className="text-rose-600 font-mono">14 Assets</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Upcoming High Risk Predictions (Compact) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                High Risk Watchlist
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening high-risk asset backlog")}
                className="text-[9.5px] text-primary font-bold hover:underline cursor-pointer"
              >
                Backlog &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3 space-y-1 text-[10px]">
              {HIGH_RISK_LIST.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-border/20 last:border-0">
                  <div className="truncate pr-1">
                    <span className="font-semibold text-slate-900 dark:text-white block truncate">{item.asset}</span>
                    <span className="font-mono text-[9px] text-muted-foreground block">{item.id}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="outline" className={cn("text-[8.5px] px-1 py-0 font-mono font-bold", item.color)}>
                      {item.prob}
                    </Badge>
                    <span className="block font-mono text-[8.5px] text-muted-foreground">RUL: {item.rul}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ====================================================================
           4. PREDICTION REGISTER TABLE (Full Width Master Box - Zero Side Scrolling)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2 border-b border-border/40">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Prediction Register
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredPredictions.length} predictions
                  </Badge>
                </CardTitle>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search asset, mode, ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs w-48 sm:w-64 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFilter("All (64)");
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
                    onClick={() => toast.info("Displaying all 12 prediction columns")}
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
                {["All (64)", "Critical (3)", "High (11)", "Medium (18)", "Low (32)", "Alert (14)", "Action (6)", "Closed (2)"].map((filter) => (
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
                    <th className="p-3 pl-4">Prediction ID</th>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">Failure Mode</th>
                    <th className="p-3 font-mono text-center">Failure Prob</th>
                    <th className="p-3 text-center">Risk Level</th>
                    <th className="p-3 font-mono">Est. RUL</th>
                    <th className="p-3 font-mono text-center">Anomaly Score</th>
                    <th className="p-3 font-mono text-center">Confidence</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 pr-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedPredictions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-muted-foreground">
                        No predictions match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedPredictions.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setActiveItem(p)}
                        className={cn(
                          "hover:bg-muted/30 cursor-pointer transition-colors",
                          activeItem.id === p.id ? "bg-primary/5 dark:bg-primary/10" : ""
                        )}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px]">
                          {p.id}
                        </td>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          <div>
                            <span>{p.asset}</span>
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                              Model: {p.model}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {p.failureMode}
                        </td>
                        <td className="p-3 font-mono font-bold text-center">
                          <span
                            className={
                              parseFloat(p.failureProb) >= 60
                                ? "text-rose-600"
                                : parseFloat(p.failureProb) >= 40
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }
                          >
                            {p.failureProb}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              p.riskLevel === "Critical"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : p.riskLevel === "High"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : p.riskLevel === "Medium"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            )}
                          >
                            {p.riskLevel}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {p.rul} {p.rulUnit}
                        </td>
                        <td className="p-3 font-mono text-center text-slate-700 dark:text-slate-300">
                          {p.anomalyScore}
                        </td>
                        <td className="p-3 font-mono text-center text-teal-600 font-semibold">
                          {p.confidence}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block border",
                              p.status === "Alert"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : p.status === "Action Required"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            )}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveItem(p);
                                setIsLiveMonitorOpen(true);
                              }}
                              className="p-1 rounded hover:text-primary hover:bg-muted cursor-pointer transition-colors"
                              title="Sensor Telemetry"
                            >
                              <Activity className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveItem(p);
                                setIsWOOpen(true);
                              }}
                              className="p-1 rounded hover:text-emerald-600 hover:bg-muted cursor-pointer transition-colors"
                              title="Create WO"
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
              totalEntries={filteredPredictions.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              entityName="predictions"
            />
          </CardContent>
        </Card>

        {/* ====================================================================
           5. SELECTED AI PREDICTION DETAILS (Full Width Box)
           ==================================================================== */}
        <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 w-full">
          <CardHeader className="p-4 pb-2.5 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                AI Prediction Details: <span className="font-mono text-primary">{activeItem.id}</span> - {activeItem.asset}
              </CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-bold",
                  activeItem.riskLevel === "Critical"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : activeItem.riskLevel === "High"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                )}
              >
                {activeItem.riskLevel} Risk
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-800 border-slate-200 font-mono">
                {activeItem.failureMode} Failure
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <button
                type="button"
                onClick={() => setIsNewProfileOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Edit Prediction Profile"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Configure</span>
              </button>
              <button
                type="button"
                onClick={() => toast.info(`IoT Tag: ${activeItem.id}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Tag"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>IoT Tag</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLiveMonitorOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                title="Sensor Telemetry"
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Live Telemetry &rarr;</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Col 1: Machinery Graphic Illustration & Asset Identification */}
              <div className="space-y-3">
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl border flex items-center justify-center p-2 relative overflow-hidden">
                  <AssetVisual category={activeItem.asset || activeItem.model} assetId={activeItem.assetId || activeItem.id} className="h-24 w-auto drop-shadow-md" />
                  <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[9.5px] px-2 py-0.5 rounded font-mono">
                    {activeItem.asset}
                  </div>
                </div>

                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ML Model:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeItem.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prediction Date:</span>
                    <span className="font-mono">{activeItem.predictionDate}</span>
                  </div>
                </div>
              </div>

              {/* Col 2: Telemetry Scores & Health Index */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Failure Probability:</span>
                    <span className="font-mono font-bold text-rose-600 text-sm">{activeItem.failureProb}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Remaining Life:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{activeItem.rul} {activeItem.rulUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Anomaly Score:</span>
                    <span className="font-mono font-bold text-amber-600">{activeItem.anomalyScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model Confidence:</span>
                    <span className="font-mono font-bold text-teal-600">{activeItem.confidence}</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50/40 dark:bg-rose-950/20 rounded-lg border border-rose-200/40 space-y-1.5 text-[11px]">
                  <span className="text-muted-foreground block font-medium">Recommended Action:</span>
                  <span className="font-semibold text-rose-700 dark:text-rose-400 block leading-tight">
                    {activeItem.recommendedAction}
                  </span>
                </div>
              </div>

              {/* Col 3: Maintenance Window & Execution */}
              <div className="space-y-3">
                <div className="p-3 bg-muted/20 rounded-lg border border-border/40 space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Target Maintenance:</span>
                    <span className="font-mono font-bold text-amber-600">{activeItem.recommendedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Risk Status:</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[9.5px]">
                      {activeItem.status}
                    </Badge>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => setIsWOOpen(true)}
                  className="w-full text-xs bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer"
                >
                  Generate Work Order &rarr;
                </Button>

                {/* Mini AI Insights */}
                <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/20 space-y-1 text-[10px]">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1 text-primary">
                      <Sparkles className="h-3 w-3" /> Predictive Insights
                    </span>
                  </div>
                  <p className="text-muted-foreground">Vibration anomalies exceed baseline threshold by 38%.</p>
                  <p className="text-emerald-600 font-medium">Early bearing intervention avoids ₹45,000 breakdown cost.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====================================================================
           5. BOTTOM 4 CARDS (Sensor Health, RUL vs Assets, Anomaly Trend, Predictions by Model)
           ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Sensor Health Overview */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Sensor Health Overview
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening sensor health inventory")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[10.5px]">
              {[
                { name: "Vibration", status: "Watch", color: "bg-amber-50 text-amber-700 border-amber-200", count: "38 / 386" },
                { name: "Temperature", status: "Watch", color: "bg-amber-50 text-amber-700 border-amber-200", count: "24 / 386" },
                { name: "Current", status: "Healthy", color: "bg-emerald-50 text-emerald-700 border-emerald-200", count: "12 / 386" },
                { name: "Pressure", status: "Healthy", color: "bg-emerald-50 text-emerald-700 border-emerald-200", count: "8 / 386" },
                { name: "Load", status: "Healthy", color: "bg-emerald-50 text-emerald-700 border-emerald-200", count: "15 / 386" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between p-1 rounded hover:bg-muted/30">
                  <span className="text-slate-700 dark:text-slate-300">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 font-bold", s.color)}>
                      {s.status}
                    </Badge>
                    <span className="font-mono text-[9.5px] text-muted-foreground">{s.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 2: RUL vs Assets */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                RUL vs Assets
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening RUL distribution analysis")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5 text-[10px]">
              {[
                { range: "0 - 7 Days", count: 3, w: 25, color: "bg-emerald-800" },
                { range: "8 - 30 Days", count: 11, w: 55, color: "bg-emerald-600" },
                { range: "31 - 90 Days", count: 18, w: 85, color: "bg-teal-500" },
                { range: "91 - 180 Days", count: 12, w: 60, color: "bg-cyan-500" },
                { range: "> 180 Days", count: 6, w: 35, color: "bg-sky-400" },
              ].map((item) => (
                <div key={item.range} className="space-y-0.5">
                  <div className="flex justify-between items-center text-[9.5px]">
                    <span className="text-slate-700 dark:text-slate-300">{item.range}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={item.color} style={{ width: `${item.w}%`, height: "100%" }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Card 3: Anomaly Trend (Last 6 Months) */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Anomaly Trend (Last 6 Months)
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening anomaly trend line")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="h-32 w-full pt-2">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 240 100">
                  <path
                    d="M 20,70 L 60,65 L 100,58 L 140,50 L 180,42 L 220,32 L 220,95 L 20,95 Z"
                    fill="rgba(139, 92, 246, 0.15)"
                  />
                  <polyline
                    points="20,70 60,65 100,58 140,50 180,42 220,32"
                    fill="none"
                    stroke="#0A3C75"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {[
                    { x: 20, y: 70, val: "38%" },
                    { x: 60, y: 65, val: "41%" },
                    { x: 100, y: 58, val: "46%" },
                    { x: 140, y: 50, val: "52%" },
                    { x: 180, y: 42, val: "58%" },
                    { x: 220, y: 32, val: "66%" },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="2.5" fill="#ffffff" stroke="#0A3C75" strokeWidth="2" />
                      <text x={pt.x} y={pt.y - 6} fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="#0A3C75">
                        {pt.val}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="flex justify-between text-[8.5px] font-mono text-muted-foreground px-1 border-t border-border/40 pt-1">
                <span>Apr 26</span>
                <span>May 26</span>
                <span>Jun 26</span>
                <span>Jul 26</span>
                <span>Aug 26</span>
                <span>Sep 26</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Predictions by Model */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Predictions by Model
              </CardTitle>
              <button
                type="button"
                onClick={() => toast.info("Opening AI models library")}
                className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#2563eb" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="134.1" />
                  <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="201.2" />
                  <circle cx="50" cy="50" r="38" stroke="#0A3C75" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="223.7" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">64</span>
                  <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">Models</span>
                </div>
              </div>

              <div className="space-y-1 text-[9.5px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Spindle Failure v4.2</span>
                  <span className="font-mono font-semibold">28 (43.8%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Bearing Health v3.8</span>
                  <span className="font-mono font-semibold">18 (28.1%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Motor Health v2.5</span>
                  <span className="font-mono font-semibold">10 (15.6%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Hydraulic Model v1.9</span>
                  <span className="font-mono font-semibold">6 (9.4%)</span>
                </div>
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
           MODAL 1: NEW PREDICTIVE MAINTENANCE PROFILE
           ==================================================================== */}
        <Dialog open={isNewProfileOpen} onOpenChange={setIsNewProfileOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>New Predictive Maintenance Profile</span>
                <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700">
                  DRAFT
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure IoT sensor monitoring profiles, thresholds, and AI prediction models.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewProfileOpen(false);
                toast.success("Predictive monitoring profile activated for equipment!");
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Prediction Model</Label>
                  <Select defaultValue="Spindle Failure Model v4.2">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      <SelectItem value="Spindle Failure Model v4.2">Spindle Failure Model v4.2</SelectItem>
                      <SelectItem value="Bearing Health v3.8">Bearing Health v3.8</SelectItem>
                      <SelectItem value="Motor Health v2.5">Motor Health v2.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Prediction Horizon</Label>
                  <Input defaultValue="30 Days" className="h-8 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Vibration Warning (mm/s)</Label>
                  <Input defaultValue="4.5" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Vibration Critical (mm/s)</Label>
                  <Input defaultValue="7.0" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Temperature Warning (°C)</Label>
                  <Input defaultValue="75" className="h-8 text-xs font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Temperature Critical (°C)</Label>
                  <Input defaultValue="90" className="h-8 text-xs font-mono" />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsNewProfileOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-[#0B3B7B] hover:bg-[#082B5B] text-white">
                  Activate Monitoring
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 2: LIVE CONDITION MONITOR
           ==================================================================== */}
        <Dialog open={isLiveMonitorOpen} onOpenChange={setIsLiveMonitorOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Live Condition Monitoring &mdash; {activeItem.asset}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Real-time sensor telemetry &bull; {activeItem.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-3 bg-muted/20 rounded-lg border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Vibration:</span>
                  <span className="font-mono font-bold text-rose-600">5.8 mm/s (▲ Rising)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span className="font-mono font-bold text-amber-600">71 °C (▲ Rising)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Motor Current:</span>
                  <span className="font-mono font-bold text-emerald-600">42 A (Normal)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Operating Spindle Speed:</span>
                  <span className="font-mono">8,200 RPM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Anomaly Score:</span>
                  <span className="font-mono font-bold text-amber-600">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Failure Probability:</span>
                  <span className="font-mono font-bold text-rose-600">72%</span>
                </div>
              </div>

              <DialogFooter>
                <Button size="sm" onClick={() => setIsLiveMonitorOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* ====================================================================
           MODAL 3: PREDICTIVE WORK ORDER
           ==================================================================== */}
        <Dialog open={isWOOpen} onOpenChange={setIsWOOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Predictive Work Order &mdash; {activeItem.asset}
              </DialogTitle>
              <DialogDescription className="text-xs">
                AI Recommendation to Work Order &bull; PDM-WO-2026-00142
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-xs pt-1">
              <div className="p-3 bg-muted/20 rounded-lg border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Failure Mode:</span>
                  <span className="font-bold">{activeItem.failureMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Predicted RUL:</span>
                  <span className="font-mono font-bold text-rose-600">{activeItem.rul} {activeItem.rulUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recommended Action:</span>
                  <span className="font-medium">Inspect spindle bearing and replace</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Required Spares:</span>
                  <span className="font-mono">Bearing Kit (SP-BRG-0042)</span>
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
                    toast.success(`Predictive Work Order generated and routed to maintenance team!`);
                  }}
                  className="bg-[#0B3B7B] text-white"
                >
                  Confirm & Release WO
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default PredictiveMaintenanceFormPage;
