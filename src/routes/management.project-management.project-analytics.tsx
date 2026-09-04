import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  Plus,
  ChevronDown,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Calendar as CalendarIcon,
  Sparkles,
  Layers,
  ArrowUpDown,
  SlidersHorizontal,
  Clock,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Share2,
  FileText,
  DollarSign,
  Edit2,
  Eye,
  MoreVertical,
  Minus,
  Maximize2,
  X,
  ShieldCheck,
  ShieldAlert,
  Percent,
  Check,
  Building2,
  Users,
  Activity,
  Sliders,
  HelpCircle,
  ArrowRight,
  Info,
  Printer,
  ExternalLink,
  Target,
  Send,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/management/project-management/project-analytics")({
  head: () => ({
    meta: [
      { title: "Project Analytics Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content: "Consolidated analytical view of project performance, financials, resources, risks and more.",
      },
    ],
  }),
  component: ProjectAnalyticsFormPage,
});

export function ProjectAnalyticsFormPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeKpi, setActiveKpi] = useState<string | null>(null);

  // Filters
  const [filterProject, setFilterProject] = useState("Smart EV Charging Infrastructure");
  const [filterCustomer, setFilterCustomer] = useState("ABC Energy Solutions Pvt Ltd");
  const [filterManager, setFilterManager] = useState("Arun Kumar");
  const [filterType, setFilterType] = useState("Comprehensive");
  const [filterBaseline, setFilterBaseline] = useState("BL-2026-001");

  // Modals
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isAiAnalyticsOpen, setIsAiAnalyticsOpen] = useState(false);
  const [isExecutiveReportOpen, setIsExecutiveReportOpen] = useState(false);
  const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);
  const [isEvmReportOpen, setIsEvmReportOpen] = useState(false);

  // What-If parameters
  const [simLaborShift, setSimLaborShift] = useState(2);
  const [simOvertimeRate, setSimOvertimeRate] = useState(15);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setActiveKpi(null);
      toast.success("Analytical metrics, earned value models, and KPI trends refreshed.");
    }, 450);
  };

  const handleExportCsv = () => {
    const csvContent = `KPI,Planned,Actual,Variance,Unit,Status
Schedule Performance (SPI),1.00,0.94,-0.06,Index,Behind Schedule
Cost Performance (CPI),1.00,0.91,-0.09,Index,Over Budget
Overall Progress,68%,65%,-3%,Percentage,Attention
Quality Performance,95%,96%,+1%,Percentage,On Track
Resource Utilization,85%,87%,+2%,Percentage,Optimized
Risk Health,85%,78%,-7%,Percentage,Monitor
Issue Health,90%,74%,-16%,Percentage,Critical
Billing Collection,90%,83%,-7%,Percentage,Pending Follow-up

EVM METRICS:
BAC (Budget at Completion),₹ 174.40 Lakhs
PV (Planned Value),₹ 118.00 Lakhs
EV (Earned Value),₹ 113.00 Lakhs
AC (Actual Cost),₹ 82.40 Lakhs
EAC (Estimate at Completion),₹ 181.20 Lakhs
ETC (Estimate to Complete),₹ 98.80 Lakhs`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Project_Analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Project Analytics (.CSV) exported.");
  };

  const handleExportDossier = () => {
    const text = `=====================================================
EXECUTIVE PROJECT PERFORMANCE & ANALYTICS DOSSIER
Project: Smart EV Charging Infrastructure (PRJ-2026-0195)
Customer: ABC Energy Solutions Pvt Ltd
Project Manager: Arun Kumar
Baseline: BL-2026-001 | Analysis Type: Comprehensive
Generated: ${new Date().toLocaleString()}
=====================================================

1. EXECUTIVE HEALTH SCORECARD:
• Overall Health Score: 82 / 100 (HEALTHY)
• Physical Progress:    65% (Planned: 68%, Delta: -3%)
• Schedule Variance:    +5 Days (Forecast: 05-Dec-2026)
• Cost Variance:        +₹ 6.80 Lakhs (Budget: ₹ 174.40 L)
• Gross Margin:         27.5% (Planned: 30.2%)
• Revenue (Billed):     ₹ 142.50 Lakhs (57.0% of Contract)

2. EARNED VALUE MANAGEMENT (EVM):
• Budget at Completion (BAC): ₹ 174.40 Lakhs
• Planned Value (PV):         ₹ 118.00 Lakhs
• Earned Value (EV):          ₹ 113.00 Lakhs
• Actual Cost (AC):           ₹ 82.40 Lakhs
• Schedule Performance (SPI): 0.94 (Behind)
• Cost Performance (CPI):     0.91 (Over Budget)
• Estimate at Completion:     ₹ 181.20 Lakhs
• Estimate to Complete:       ₹ 98.80 Lakhs

3. RISK & ISSUE EXPOSURE:
• Total Expected Risk EMV:    ₹ 8.60 Lakhs
  - Critical Risks (5):       ₹ 3.20 Lakhs
  - High Risks (14):          ₹ 3.40 Lakhs
  - Medium Risks (24):        ₹ 1.60 Lakhs
  - Low Risks (21):           ₹ 0.40 Lakhs
• Total Active Issues:        47 (Open: 23, Investigating: 11, Action: 8, Resolved: 5)

4. AI EXECUTIVE RECOMMENDATIONS:
• Adding 2 field installation teams will recover 8 days of schedule delay by Nov 27.
• ₹ 23.50 Lakhs of certified completed work is ready for immediate invoicing.
=====================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Executive_Analytics_Dossier.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Executive Analytics Dossier (.TXT) downloaded.");
  };

  return (
    <AppShell
      title="Project Analytics Form"
      breadcrumb="Management > Project Management > Project Analytics"
      description="Consolidated analytical view of project performance, financials, resources, risks and more."
      tabs={<ProjectManagementTabBar />}
    >
      <div className="w-full space-y-4">
          {/* ====================================================================
             1. ACTION HEADER CARD (Exact Workforce Planning Form heading style)
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-5 py-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Title & Status Badges */}
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Project Analytics Form
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Approved
                </span>
                <span className="hidden md:inline-block font-mono text-xs text-muted-foreground">
                  PRJ-2026-0195
                </span>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompareOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  Compare Projects
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Analytics executive report emailed to directors.");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Email
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                      Export
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 text-xs">
                    <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer">
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export CSV Dataset
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-blue-600" /> Executive Analytics (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsExecutiveReportOpen(true)} className="cursor-pointer">
                      <Target className="mr-2 h-4 w-4 text-emerald-600" /> Executive Health Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Analytics baseline saved successfully!");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* ====================================================================
             2. CONTEXT FILTER BAR (Single Row - 6 Controls)
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3 sm:p-4 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Project <span className="text-rose-500">*</span>
                </span>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="h-8 w-full text-xs font-semibold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>Smart EV Charging Infrastructure</option>
                  <option>Solar Energy Plant Phase 2</option>
                  <option>Industrial Automation Hub</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Project Code
                </span>
                <div className="h-8 px-2.5 flex items-center font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 rounded-md border border-input mt-0.5">
                  PRJ-2026-0195
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Customer
                </span>
                <select
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>ABC Energy Solutions Pvt Ltd</option>
                  <option>State Power Distribution Corp</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Project Manager
                </span>
                <select
                  value={filterManager}
                  onChange={(e) => setFilterManager(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>Arun Kumar</option>
                  <option>Vikram Malhotra</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Analysis Type
                </span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>Comprehensive</option>
                  <option>Executive</option>
                  <option>Financial</option>
                  <option>Operational</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Baseline Version
                </span>
                <select
                  value={filterBaseline}
                  onChange={(e) => setFilterBaseline(e.target.value)}
                  className="h-8 w-full font-mono font-bold text-xs rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>BL-2026-001</option>
                  <option>BL-2026-002</option>
                </select>
              </div>
            </div>
          </div>

          {/* ====================================================================
             3. SIX METRIC CARDS ROW (Interactive Click-to-Inspect)
             ==================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Overall Progress */}
            <div
              onClick={() => {
                setActiveKpi(activeKpi === "progress" ? null : "progress");
                toast.info("Inspecting Physical Progress Analytics");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer transition-all hover:border-blue-500/60 hover:shadow-xs",
                activeKpi === "progress" && "ring-2 ring-blue-500",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">Overall Progress</span>
                <div className="h-7 w-7 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">65%</span>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-muted-foreground">
                  <span>vs Plan 68%</span>
                  <span className="text-rose-600 flex items-center"><TrendingDown className="h-3 w-3 inline" /> -3%</span>
                </div>
              </div>
              <div className="h-8 w-full mt-1.5">
                <svg className="h-full w-full" viewBox="0 0 100 30">
                  <path d="M0,24 Q20,20 40,16 T80,10 T100,5 L100,30 L0,30 Z" fill="rgba(16, 185, 129, 0.15)" />
                  <path d="M0,24 Q20,20 40,16 T80,10 T100,5" fill="none" stroke="#10b981" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* 2. Schedule Variance */}
            <div
              onClick={() => {
                setActiveKpi(activeKpi === "schedule" ? null : "schedule");
                toast.info("Inspecting Schedule Variance & Critical Path");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer transition-all hover:border-orange-500/60 hover:shadow-xs",
                activeKpi === "schedule" && "ring-2 ring-orange-500",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">Schedule Variance</span>
                <div className="h-7 w-7 rounded-md bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold font-mono text-orange-600">+5 Days</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">vs Plan 30-Nov-2026</span>
              </div>
              <div className="h-8 w-full mt-1.5">
                <svg className="h-full w-full" viewBox="0 0 100 30">
                  <path d="M0,20 Q30,22 60,14 T100,8 L100,30 L0,30 Z" fill="rgba(249, 115, 22, 0.15)" />
                  <path d="M0,20 Q30,22 60,14 T100,8" fill="none" stroke="#f97316" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* 3. Cost Variance */}
            <div
              onClick={() => {
                setActiveKpi(activeKpi === "cost" ? null : "cost");
                toast.info("Inspecting Cost Variance & Overrun Breakdown");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer transition-all hover:border-amber-500/60 hover:shadow-xs",
                activeKpi === "cost" && "ring-2 ring-amber-500",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">Cost Variance</span>
                <div className="h-7 w-7 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold font-mono text-amber-600">+₹ 6.8 L</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">vs Budget ₹ 174.4 L</span>
              </div>
              <div className="h-8 w-full mt-1.5">
                <svg className="h-full w-full" viewBox="0 0 100 30">
                  <path d="M0,25 Q30,18 60,15 T100,10 L100,30 L0,30 Z" fill="rgba(245, 158, 11, 0.15)" />
                  <path d="M0,25 Q30,18 60,15 T100,10" fill="none" stroke="#f59e0b" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* 4. Revenue (Billed) */}
            <div
              onClick={() => {
                setActiveKpi(activeKpi === "revenue" ? null : "revenue");
                toast.info("Inspecting Billed Revenue Progress");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-xs",
                activeKpi === "revenue" && "ring-2 ring-emerald-500",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">Revenue (Billed)</span>
                <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold font-mono text-emerald-600">₹ 142.5 L</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">57% of Contract</span>
              </div>
              <div className="h-8 w-full mt-1.5">
                <svg className="h-full w-full" viewBox="0 0 100 30">
                  <path d="M0,22 Q30,15 60,12 T100,5 L100,30 L0,30 Z" fill="rgba(16, 185, 129, 0.15)" />
                  <path d="M0,22 Q30,15 60,12 T100,5" fill="none" stroke="#10b981" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* 5. Gross Margin */}
            <div
              onClick={() => {
                setActiveKpi(activeKpi === "margin" ? null : "margin");
                toast.info("Inspecting Margin Performance");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-xs",
                activeKpi === "margin" && "ring-2 ring-emerald-500",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">Gross Margin</span>
                <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Percent className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold font-mono text-emerald-600">27.5%</span>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-muted-foreground">
                  <span>vs Plan 30.2%</span>
                  <span className="text-rose-600 flex items-center"><TrendingDown className="h-3 w-3 inline" /> -2.7%</span>
                </div>
              </div>
              <div className="h-8 w-full mt-1.5">
                <svg className="h-full w-full" viewBox="0 0 100 30">
                  <path d="M0,18 Q30,16 60,12 T100,6 L100,30 L0,30 Z" fill="rgba(16, 185, 129, 0.15)" />
                  <path d="M0,18 Q30,16 60,12 T100,6" fill="none" stroke="#10b981" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* 6. Project Health Score Gauge */}
            <div
              onClick={() => setIsExecutiveReportOpen(true)}
              className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-xs"
              title="Open Project Health Assessment"
            >
              <span className="text-[11px] text-muted-foreground font-medium block">Project Health Score</span>
              <div className="relative mt-1 flex items-center justify-center">
                <svg className="h-20 w-36" viewBox="0 0 100 55">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#healthGrad)" strokeWidth="9" strokeLinecap="round" strokeDasharray="125.66" strokeDashoffset="22" />
                  <defs>
                    <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="80%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-1 flex flex-col items-center">
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">82 <span className="text-[10px] text-muted-foreground">/ 100</span></span>
                  <span className="text-[9px] font-bold text-emerald-600 tracking-wider">HEALTHY</span>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. MIDDLE SECTION (3 CARDS)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Card 1 (4 cols): Performance Overview */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  Performance Overview
                  <button
                    onClick={() => toast.info("Performance scores computed based on PMI Earned Value standards.")}
                    className="p-0.5 hover:text-primary cursor-pointer"
                  >
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b bg-muted/20 text-[9.5px] text-muted-foreground font-semibold">
                      <th className="p-2 pl-3">KPI</th>
                      <th className="p-2 text-right">Planned</th>
                      <th className="p-2 text-right">Actual</th>
                      <th className="p-2 text-right">Variance</th>
                      <th className="p-2 pr-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-[11px]">
                    {[
                      { kpi: "Schedule Performance (SPI)", plan: "1.00", act: "0.94", v: "-0.06", isNeg: true },
                      { kpi: "Cost Performance (CPI)", plan: "1.00", act: "0.91", v: "-0.09", isNeg: true },
                      { kpi: "Progress", plan: "68%", act: "65%", v: "-3%", isNeg: true },
                      { kpi: "Quality Performance", plan: "95%", act: "96%", v: "+1%", isNeg: false },
                      { kpi: "Resource Utilization", plan: "85%", act: "87%", v: "+2%", isNeg: false },
                      { kpi: "Risk Health", plan: "85%", act: "78%", v: "-7%", isNeg: true },
                      { kpi: "Issue Health", plan: "90%", act: "74%", v: "-16%", isNeg: true },
                      { kpi: "Billing Collection", plan: "90%", act: "83%", v: "-7%", isNeg: true },
                    ].map((row) => (
                      <tr
                        key={row.kpi}
                        onClick={() => toast.info(`${row.kpi}: Planned ${row.plan}, Actual ${row.act} (Variance ${row.v})`)}
                        className="hover:bg-muted/20 cursor-pointer transition-colors"
                        title="Click to view KPI details"
                      >
                        <td className="p-2 pl-3 font-medium text-slate-800 dark:text-slate-200">{row.kpi}</td>
                        <td className="p-2 font-mono text-right text-muted-foreground">{row.plan}</td>
                        <td className="p-2 font-mono text-right font-semibold">{row.act}</td>
                        <td className={cn("p-2 font-mono text-right font-bold", row.isNeg ? "text-rose-600" : "text-emerald-600")}>
                          {row.v}
                        </td>
                        <td className="p-2 pr-3 text-center">
                          {row.isNeg ? (
                            <div className="h-2 w-2 rounded-full bg-rose-500 mx-auto" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-emerald-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Card 2 (5 cols): Earned Value Analysis */}
            <Card className="lg:col-span-5 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Earned Value Analysis
                </CardTitle>
                <button
                  type="button"
                  onClick={() => setIsEvmReportOpen(true)}
                  className="text-[9.5px] text-primary font-bold hover:underline cursor-pointer"
                >
                  Full Report →
                </button>
              </CardHeader>
              <CardContent className="p-3">
                <div className="flex items-center gap-3 text-[9.5px] font-semibold mb-2">
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> PV (Planned Value)</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-600" /> EV (Earned Value)</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> AC (Actual Cost)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {/* Left Chart (2 cols) */}
                  <div className="md:col-span-2 h-48 w-full">
                    <svg className="h-full w-full" viewBox="0 0 240 140">
                      <line x1="25" y1="15" x2="235" y2="15" stroke="#e2e8f0" strokeDasharray="2 2" />
                      <line x1="25" y1="45" x2="235" y2="45" stroke="#e2e8f0" strokeDasharray="2 2" />
                      <line x1="25" y1="75" x2="235" y2="75" stroke="#e2e8f0" strokeDasharray="2 2" />
                      <line x1="25" y1="105" x2="235" y2="105" stroke="#e2e8f0" strokeDasharray="2 2" />

                      <text x="5" y="18" fontSize="6.5" fill="#94a3b8">200</text>
                      <text x="5" y="48" fontSize="6.5" fill="#94a3b8">160</text>
                      <text x="5" y="78" fontSize="6.5" fill="#94a3b8">120</text>
                      <text x="10" y="108" fontSize="6.5" fill="#94a3b8">80</text>

                      {/* PV curve (Green) */}
                      <polyline fill="none" stroke="#10b981" strokeWidth="1.5" points="35,110 75,95 115,80 155,60 195,45 225,50" />
                      {/* EV curve (Blue) */}
                      <polyline fill="none" stroke="#2563eb" strokeWidth="1.5" points="35,118 75,102 115,90 155,75 195,58 225,65" />
                      {/* AC curve (Amber) */}
                      <polyline fill="none" stroke="#f59e0b" strokeWidth="1.5" points="35,124 75,115 115,102 155,90 195,78 225,82" />

                      <circle cx="225" cy="50" r="2" fill="#10b981" />
                      <circle cx="225" cy="65" r="2" fill="#2563eb" />
                      <circle cx="225" cy="82" r="2" fill="#f59e0b" />

                      <text x="28" y="128" fontSize="7" fill="#64748b">Apr 26</text>
                      <text x="65" y="128" fontSize="7" fill="#64748b">May 26</text>
                      <text x="105" y="128" fontSize="7" fill="#64748b">Jun 26</text>
                      <text x="145" y="128" fontSize="7" fill="#64748b">Jul 26</text>
                      <text x="185" y="128" fontSize="7" fill="#64748b">Aug 26</text>
                      <text x="215" y="128" fontSize="7" fill="#64748b">Sep 26</text>
                    </svg>
                  </div>

                  {/* Right Metrics (1 col) */}
                  <div className="space-y-1 text-[10px] border-l border-border/40 pl-2">
                    <div>
                      <span className="text-muted-foreground block text-[9px]">BAC (Budget at Completion)</span>
                      <span className="font-mono font-bold">₹ 174.4 L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">PV (Planned Value)</span>
                      <span className="font-mono font-bold text-emerald-600">₹ 118.0 L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">EV (Earned Value)</span>
                      <span className="font-mono font-bold text-blue-600">₹ 113.0 L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">AC (Actual Cost)</span>
                      <span className="font-mono font-bold text-amber-600">₹ 82.4 L</span>
                    </div>
                    <div className="pt-1 border-t grid grid-cols-2 gap-1">
                      <div>
                        <span className="text-muted-foreground block text-[8.5px]">CPI</span>
                        <span className="font-mono font-bold text-rose-600">0.91</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[8.5px]">SPI</span>
                        <span className="font-mono font-bold text-rose-600">0.94</span>
                      </div>
                    </div>
                    <div className="pt-1 border-t">
                      <span className="text-muted-foreground block text-[9px]">EAC (Estimate at Completion)</span>
                      <span className="font-mono font-bold">₹ 181.2 L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">ETC (Estimate to Complete)</span>
                      <span className="font-mono font-bold">₹ 98.8 L</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 (3 cols): Cost Overview (₹ Lakh) */}
            <Card className="lg:col-span-3 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Cost Overview (₹ Lakh)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="92" />
                    <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="160" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="196" />
                    <circle cx="50" cy="50" r="38" stroke="#64748b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="221" />
                    <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="235" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-bold font-mono text-slate-900 dark:text-white">₹ 174.4 L</span>
                    <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">Budget</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {[
                    { label: "Labour", pct: "38.6%", amt: "₹ 67.3 L", color: "bg-blue-500" },
                    { label: "Material", pct: "28.4%", amt: "₹ 49.5 L", color: "bg-emerald-500" },
                    { label: "Subcontract", pct: "14.9%", amt: "₹ 26.0 L", color: "bg-cyan-500" },
                    { label: "Equipment", pct: "10.8%", amt: "₹ 18.8 L", color: "bg-purple-500" },
                    { label: "Other Costs", pct: "6.1%", amt: "₹ 10.6 L", color: "bg-slate-500" },
                    { label: "Contingency", pct: "1.2%", amt: "₹ 2.1 L", color: "bg-orange-500" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      onClick={() => toast.info(`${row.label} cost: ${row.amt} (${row.pct} of budget)`)}
                      className="flex justify-between items-center p-0.5 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      title="Inspect cost category"
                    >
                      <span className="flex items-center gap-1.5"><div className={cn("h-2 w-2 rounded-full", row.color)} /> {row.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">{row.pct}</span>
                        <span className="font-mono font-semibold">{row.amt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             5. MIDDLE-LOWER SECTION (3 CARDS)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Card 1 (4 cols): Project Trend (Last 6 Months) */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Project Trend (Last 6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-center gap-3 text-[10px] font-semibold">
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Progress (%)</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-600" /> Billed (%)</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-purple-600" /> Collection (%)</span>
                </div>

                <div className="h-40 w-full">
                  <svg className="h-full w-full" viewBox="0 0 260 130">
                    <line x1="25" y1="15" x2="250" y2="15" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="40" x2="250" y2="40" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="65" x2="250" y2="65" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="90" x2="250" y2="90" stroke="#e2e8f0" strokeDasharray="2 2" />

                    <text x="5" y="18" fontSize="6.5" fill="#94a3b8">100</text>
                    <text x="10" y="43" fontSize="6.5" fill="#94a3b8">60</text>
                    <text x="10" y="68" fontSize="6.5" fill="#94a3b8">40</text>
                    <text x="10" y="93" fontSize="6.5" fill="#94a3b8">20</text>

                    {/* Progress curve (Green) */}
                    <polyline fill="none" stroke="#10b981" strokeWidth="1.5" points="35,92 75,82 115,72 155,60 195,48 235,38" />
                    {/* Billed curve (Blue) */}
                    <polyline fill="none" stroke="#2563eb" strokeWidth="1.5" points="35,98 75,88 115,82 155,68 195,56 235,46" />
                    {/* Collection curve (Purple) */}
                    <polyline fill="none" stroke="#9333ea" strokeWidth="1.5" points="35,102 75,94 115,86 155,75 195,64 235,55" />

                    <circle cx="235" cy="38" r="2" fill="#10b981" />
                    <circle cx="235" cy="46" r="2" fill="#2563eb" />
                    <circle cx="235" cy="55" r="2" fill="#9333ea" />

                    <text x="238" y="38" fontSize="7" fill="#10b981" fontWeight="bold">65%</text>
                    <text x="238" y="46" fontSize="7" fill="#2563eb" fontWeight="bold">57%</text>
                    <text x="238" y="56" fontSize="7" fill="#9333ea" fontWeight="bold">47%</text>

                    <text x="28" y="120" fontSize="7" fill="#64748b">Apr 26</text>
                    <text x="68" y="120" fontSize="7" fill="#64748b">May 26</text>
                    <text x="108" y="120" fontSize="7" fill="#64748b">Jun 26</text>
                    <text x="148" y="120" fontSize="7" fill="#64748b">Jul 26</text>
                    <text x="188" y="120" fontSize="7" fill="#64748b">Aug 26</text>
                    <text x="228" y="120" fontSize="7" fill="#64748b">Sep 26</text>
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 (5 cols): Risks & Issues Summary */}
            <Card className="lg:col-span-5 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Risks & Issues Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left: Risk Exposure */}
                  <div className="space-y-2">
                    <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 block text-center">
                      Risk Exposure (₹ Lakh)
                    </span>
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                        <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="90" />
                        <circle cx="50" cy="50" r="38" stroke="#eab308" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="180" />
                        <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="220" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold font-mono text-slate-900 dark:text-white">₹ 8.6 L</span>
                        <span className="text-[7px] text-muted-foreground uppercase font-semibold">Total Exposure</span>
                      </div>
                    </div>
                    <div className="space-y-0.5 text-[9.5px]">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Critical</span>
                        <span className="font-mono">5 (₹ 3.2 L)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> High</span>
                        <span className="font-mono">14 (₹ 3.4 L)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Medium</span>
                        <span className="font-mono">24 (₹ 1.6 L)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Low</span>
                        <span className="font-mono">21 (₹ 0.4 L)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Issues by Status */}
                  <div className="space-y-2 border-l border-border/40 pl-3">
                    <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-300 block text-center">
                      Issues by Status
                    </span>
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                        <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="116" />
                        <circle cx="50" cy="50" r="38" stroke="#eab308" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="172" />
                        <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="213" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">47</span>
                        <span className="text-[7px] text-muted-foreground uppercase font-semibold">Total Issues</span>
                      </div>
                    </div>
                    <div className="space-y-0.5 text-[9.5px]">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Open</span>
                        <span className="font-mono">23 (48.9%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Investigating</span>
                        <span className="font-mono">11 (23.4%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> Action</span>
                        <span className="font-mono">8 (17.0%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Resolved</span>
                        <span className="font-mono">5 (10.6%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 (3 cols): Top Overdue Invoices */}
            <Card className="lg:col-span-3 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Top Overdue Invoices
                </CardTitle>
                <button
                  type="button"
                  onClick={() => setIsOverdueModalOpen(true)}
                  className="text-[9.5px] text-primary font-bold hover:underline cursor-pointer"
                >
                  View All
                </button>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b bg-muted/20 text-[9px] text-muted-foreground font-semibold">
                      <th className="p-1.5 pl-3">Invoice No.</th>
                      <th className="p-1.5">Due Date</th>
                      <th className="p-1.5 text-right">Amount (₹)</th>
                      <th className="p-1.5 pr-3 text-center">Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-[10.5px]">
                    {[
                      { no: "INV-2026-0003", due: "15 Sep 2026", amt: "8.10 L", days: "15", isOverdue: true },
                      { no: "INV-2026-0004", due: "30 Sep 2026", amt: "5.20 L", days: "0", isOverdue: false },
                      { no: "INV-2026-0006", due: "05 Sep 2026", amt: "3.20 L", days: "25", isOverdue: true },
                      { no: "INV-2026-0008", due: "12 Sep 2026", amt: "2.10 L", days: "18", isOverdue: true },
                      { no: "INV-2026-0009", due: "22 Sep 2026", amt: "1.80 L", days: "8", isOverdue: true },
                    ].map((row) => (
                      <tr
                        key={row.no}
                        onClick={() => toast.info(`Invoice ${row.no}: ₹ ${row.amt} due ${row.due}`)}
                        className="hover:bg-muted/20 cursor-pointer transition-colors"
                      >
                        <td className="p-1.5 pl-3 font-mono font-medium text-slate-900 dark:text-white">{row.no}</td>
                        <td className="p-1.5 font-mono text-muted-foreground text-[10px]">{row.due}</td>
                        <td className="p-1.5 font-mono font-semibold text-right">{row.amt}</td>
                        <td className="p-1.5 pr-3 text-center font-mono font-bold">
                          <span className={row.isOverdue ? "text-rose-600" : "text-slate-500"}>{row.days}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-muted/30 text-[10px] font-bold">
                      <td colSpan={2} className="p-1.5 pl-3 text-slate-800 dark:text-slate-200">Total Overdue</td>
                      <td className="p-1.5 font-mono text-right text-rose-600">₹ 15.20 L</td>
                      <td className="p-1.5 pr-3 text-center text-muted-foreground">4 Invoices</td>
                    </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             6. BOTTOM SECTION (Financial Summary & AI Insights)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Card 1 (Left 8 cols): Financial Summary */}
            <Card className="lg:col-span-8 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Executive Financial Summary & Cash Flow
                </CardTitle>
                <span className="text-[10px] font-mono text-muted-foreground">Values in ₹ Lakhs</span>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                  <div
                    onClick={() => toast.info("Total Contract Value: ₹ 250.0 Lakhs")}
                    className="p-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] text-muted-foreground block">Contract Value</span>
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white">₹ 250.0 L</span>
                  </div>
                  <div
                    onClick={() => toast.info("Billed Revenue to Date: ₹ 142.5 Lakhs (57% of contract)")}
                    className="p-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] text-muted-foreground block">Billed Value</span>
                    <span className="text-base font-bold font-mono text-emerald-600">₹ 142.5 L</span>
                    <span className="text-[9px] text-muted-foreground block">57%</span>
                  </div>
                  <div
                    onClick={() => toast.info("Unbilled Completed Work: ₹ 23.5 Lakhs")}
                    className="p-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] text-muted-foreground block">Unbilled Work</span>
                    <span className="text-base font-bold font-mono text-amber-600">₹ 23.5 L</span>
                    <span className="text-[9px] text-muted-foreground block">13%</span>
                  </div>
                  <div
                    onClick={() => toast.info("Cash Received: ₹ 118.0 Lakhs (83% of billed)")}
                    className="p-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] text-muted-foreground block">Received</span>
                    <span className="text-base font-bold font-mono text-purple-600">₹ 118.0 L</span>
                    <span className="text-[9px] text-muted-foreground block">83% of Billed</span>
                  </div>
                  <div
                    onClick={() => toast.info("Outstanding Receivables: ₹ 24.5 Lakhs")}
                    className="p-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] text-muted-foreground block">Outstanding</span>
                    <span className="text-base font-bold font-mono text-rose-600">₹ 24.5 L</span>
                    <span className="text-[9px] text-muted-foreground block">17% of Billed</span>
                  </div>
                  <div
                    onClick={() => toast.info("Contract Retention Held: ₹ 7.1 Lakhs (2.84% of contract)")}
                    className="p-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <span className="text-[10px] text-muted-foreground block">Retention</span>
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white">₹ 7.1 L</span>
                    <span className="text-[9px] text-muted-foreground block">2.84% of Contract</span>
                  </div>
                </div>
                  {/* Cash Conversion & Billing Progress Bar */}
                  <div className="pt-2 border-t border-border/40 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground font-medium">Contract Realization & Cash Collection</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">Billed: 57.0% | Cash Received: 47.2%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: "47.2%" }} title="Cash Received: ₹ 118.0 L (47.2%)" />
                      <div className="h-full bg-blue-500" style={{ width: "9.8%" }} title="Outstanding: ₹ 24.5 L (9.8%)" />
                      <div className="h-full bg-amber-400" style={{ width: "9.4%" }} title="Unbilled Work: ₹ 23.5 L (9.4%)" />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground pt-0.5">
                      <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Received (47.2%)</span>
                      <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-500" /> Billed Receivables (9.8%)</span>
                      <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-400" /> Unbilled Work (9.4%)</span>
                      <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" /> Remaining Scope (33.6%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 (Right 4 cols): AI Insights */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  AI Executive Insights
                </CardTitle>
                <button
                  type="button"
                  onClick={() => setIsAiAnalyticsOpen(true)}
                  className="text-[9.5px] text-primary font-bold hover:underline cursor-pointer"
                >
                  View All
                </button>
              </CardHeader>
              <CardContent className="p-3 space-y-2 text-[10.5px]">
                <div
                  onClick={() => setIsWhatIfOpen(true)}
                  className="flex items-start gap-1.5 p-1 rounded hover:bg-rose-50/50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                  title="Simulate schedule recovery"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 leading-tight">
                    Installation progress is 10% below plan and impacting overall schedule.
                  </p>
                </div>
                <div
                  onClick={() => toast.info("Opening unbilled milestone certification list")}
                  className="flex items-start gap-1.5 p-1 rounded hover:bg-amber-50/50 dark:hover:bg-amber-950/20 cursor-pointer transition-colors"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 leading-tight">
                    ₹ 23.5 L of completed work appears unbilled. Review milestone certification.
                  </p>
                </div>
                <div
                  onClick={() => toast.info("Opening cost variance breakdown")}
                  className="flex items-start gap-1.5 p-1 rounded hover:bg-amber-50/50 dark:hover:bg-amber-950/20 cursor-pointer transition-colors"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 leading-tight">
                    Forecast cost is ₹ 6.8 L above approved budget. Monitor production cost.
                  </p>
                </div>
                <div
                  onClick={() => toast.info("Quality health is 96% with zero active non-conformances")}
                  className="flex items-start gap-1.5 p-1 rounded hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 leading-tight">
                    Quality performance is excellent at 96%. Keep up the good work.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             7. FOOTER STATUS & SHORTCUTS BAR
             ==================================================================== */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-muted-foreground border-t border-border/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Connection
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" /> System Online
              </span>
              <span>© 2026 Magnertia ERP. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span>Quick Views:</span>
              <button
                onClick={() => {
                  setActiveKpi(null);
                  toast.info("Active view: Project Analytics Dashboard");
                }}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                D Dashboard
              </button>
              <button
                onClick={() => setIsEvmReportOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                P EVM Analysis
              </button>
              <button
                onClick={() => setIsWhatIfOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                S Simulator
              </button>
              <button
                onClick={() => setIsCompareOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                C Compare
              </button>
              <button
                onClick={() => setIsAiAnalyticsOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                A AI Insights
              </button>
            </div>
          </div>

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Compare Projects Benchmarking Modal */}
        <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <BarChart3 className="h-4 w-4" />
                Project Benchmarking & Multi-Project Analytics
              </DialogTitle>
              <DialogDescription className="text-xs">
                Compare current project KPIs with historical enterprise benchmarks.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-muted/20 font-semibold text-[10px]">
                    <th className="p-2">KPI</th>
                    <th className="p-2 font-bold text-primary">Current (PRJ-0195)</th>
                    <th className="p-2">Solar Energy (PRJ-0192)</th>
                    <th className="p-2">Industrial Hub (PRJ-0188)</th>
                    <th className="p-2 text-emerald-600">Best in Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                  <tr>
                    <td className="p-2 font-sans font-medium">Schedule Performance</td>
                    <td className="p-2 font-bold text-primary">94%</td>
                    <td className="p-2 text-muted-foreground">97%</td>
                    <td className="p-2 text-muted-foreground">89%</td>
                    <td className="p-2 text-emerald-600 font-bold">97%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Cost Performance</td>
                    <td className="p-2 font-bold text-primary">91%</td>
                    <td className="p-2 text-muted-foreground">95%</td>
                    <td className="p-2 text-muted-foreground">87%</td>
                    <td className="p-2 text-emerald-600 font-bold">95%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Quality Health</td>
                    <td className="p-2 font-bold text-primary">96%</td>
                    <td className="p-2 text-muted-foreground">93%</td>
                    <td className="p-2 text-muted-foreground">97%</td>
                    <td className="p-2 text-emerald-600 font-bold">97%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Resource Utilization</td>
                    <td className="p-2 font-bold text-primary">87%</td>
                    <td className="p-2 text-muted-foreground">91%</td>
                    <td className="p-2 text-muted-foreground">84%</td>
                    <td className="p-2 text-emerald-600 font-bold">91%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-sans font-medium">Gross Margin</td>
                    <td className="p-2 font-bold text-primary">27.5%</td>
                    <td className="p-2 text-muted-foreground">31.2%</td>
                    <td className="p-2 text-muted-foreground">24.8%</td>
                    <td className="p-2 text-emerald-600 font-bold">31.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsCompareOpen(false)}>Close Benchmarking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 2. What-If Schedule Simulator Modal */}
        <Dialog open={isWhatIfOpen} onOpenChange={setIsWhatIfOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                <Sliders className="h-4 w-4" />
                What-If Project Simulation Engine
              </DialogTitle>
              <DialogDescription className="text-xs">
                Simulate impact of adding extra installation teams and overtime shifts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Additional Production / Installation Teams:</span>
                  <span className="font-mono font-bold text-primary">+{simLaborShift} Teams</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={simLaborShift}
                  onChange={(e) => setSimLaborShift(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Overtime Authorization Rate:</span>
                  <span className="font-mono font-bold text-primary">{simOvertimeRate}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={simOvertimeRate}
                  onChange={(e) => setSimOvertimeRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Simulated Outcome:</span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div>
                    <span className="text-muted-foreground block text-[9px]">Resource Cost:</span>
                    <span className="font-bold text-rose-600">+₹ {(simLaborShift * 2.1 + (simOvertimeRate * 0.1)).toFixed(1)} L</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px]">Schedule Recovery:</span>
                    <span className="font-bold text-emerald-600">-{simLaborShift * 4 + Math.round(simOvertimeRate / 10)} Days</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px]">Forecast Finish:</span>
                    <span className="font-bold text-slate-900 dark:text-white">26-Nov-2026</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px]">Simulated Margin:</span>
                    <span className="font-bold text-primary">25.6%</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsWhatIfOpen(false)}>Cancel</Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsWhatIfOpen(false);
                  toast.success("Simulation parameters applied to active forecast model.");
                }}
                className="bg-primary text-white font-semibold"
              >
                Apply Scenario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3. AI Deep Analytics & Correlation Engine Modal */}
        <Dialog open={isAiAnalyticsOpen} onOpenChange={setIsAiAnalyticsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                AI Project Intelligence & Correlation Engine
              </DialogTitle>
              <DialogDescription className="text-xs">
                Deep neural pattern matching across cost, schedule, quality, and supplier milestones.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200">
                <span className="font-bold text-rose-700 block mb-1">🔴 Critical Root Cause Detected:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">
                  Installation delay (-10%) is primarily driven by late shipment of WBS 3.0 controller parts. Adding 2 site technicians will eliminate the schedule variance by Nov 27.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200">
                <span className="font-bold text-amber-700 block mb-1">🟠 Revenue Unbilled Gap:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">
                  ₹ 23.50 L of completed work is unbilled. Submitting billing draft PB-2026-0004 will increase project cash conversion and improve collection performance from 83% to 92%.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200">
                <span className="font-bold text-emerald-700 block mb-1">🟢 Quality Stability:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">
                  Overall incoming QA acceptance rate is at 96%, exceeding baseline KPI target by 1.0%. Zero critical non-conformances reported this month.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAiAnalyticsOpen(false)}>Close Insights</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Executive Performance Report Modal */}
        <Dialog open={isExecutiveReportOpen} onOpenChange={setIsExecutiveReportOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Executive Project Performance Brief
              </DialogTitle>
              <DialogDescription className="text-xs">
                Formal project summary for Board of Directors & Steering Committee.
              </DialogDescription>
            </DialogHeader>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b pb-1 font-sans font-bold">
                <span>Smart EV Charging Infrastructure</span>
                <span className="text-emerald-600">82 / 100 HEALTHY</span>
              </div>
              <div className="flex justify-between">
                <span>Contract Revenue:</span>
                <span>₹ 250.00 L</span>
              </div>
              <div className="flex justify-between">
                <span>Forecast Gross Margin:</span>
                <span>₹ 68.80 L (27.5%)</span>
              </div>
              <div className="flex justify-between">
                <span>Schedule Completion:</span>
                <span>05-Dec-2026 (+5 Days)</span>
              </div>
              <div className="flex justify-between">
                <span>Quality Score:</span>
                <span className="text-emerald-600 font-bold">96%</span>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsExecutiveReportOpen(false)}>Close</Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsExecutiveReportOpen(false);
                  handleExportDossier();
                }}
                className="bg-primary text-white font-semibold"
              >
                Download Brief
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. Overdue Invoices Modal */}
        <Dialog open={isOverdueModalOpen} onOpenChange={setIsOverdueModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                <AlertTriangle className="h-4 w-4" />
                Overdue Customer Invoices Register
              </DialogTitle>
              <DialogDescription className="text-xs">
                Invoices exceeding 30-day payment terms requiring management escalation.
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y border rounded-lg p-2 text-xs">
              {[
                { no: "INV-2026-0003", due: "15 Sep 2026", amt: "8.10 L", days: "15 Days" },
                { no: "INV-2026-0006", due: "05 Sep 2026", amt: "3.20 L", days: "25 Days" },
                { no: "INV-2026-0008", due: "12 Sep 2026", amt: "2.10 L", days: "18 Days" },
              ].map((item) => (
                <div key={item.no} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary mr-2">{item.no}</span>
                    <span className="text-[10px] text-muted-foreground">{item.due}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-600 block">₹ {item.amt}</span>
                    <span className="text-[9.5px] text-muted-foreground">{item.days} overdue</span>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsOverdueModalOpen(false)}>Close</Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsOverdueModalOpen(false);
                  toast.success("Dunning notice sent to customer accounts payable.");
                }}
                className="bg-rose-600 text-white font-semibold"
              >
                Send Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. Earned Value Analysis Modal */}
        <Dialog open={isEvmReportOpen} onOpenChange={setIsEvmReportOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Target className="h-4 w-4" />
                Earned Value Management (EVM) Full Report
              </DialogTitle>
              <DialogDescription className="text-xs">
                Comprehensive cost and schedule variance analysis based on ANSI/PMI standards.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border font-mono">
                <div>
                  <span className="text-[9.5px] text-muted-foreground font-sans block">Cost Performance Index (CPI):</span>
                  <span className="text-base font-bold text-rose-600">0.91 <span className="text-[10px] font-normal">(Over Budget)</span></span>
                </div>
                <div>
                  <span className="text-[9.5px] text-muted-foreground font-sans block">Schedule Performance Index (SPI):</span>
                  <span className="text-base font-bold text-rose-600">0.94 <span className="text-[10px] font-normal">(Behind Schedule)</span></span>
                </div>
              </div>
              <div className="space-y-1 text-[11px] font-mono">
                <div className="flex justify-between py-1 border-b">
                  <span className="font-sans text-muted-foreground">Budget at Completion (BAC):</span>
                  <span className="font-bold">₹ 174.40 Lakhs</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="font-sans text-muted-foreground">Planned Value (PV):</span>
                  <span className="font-bold text-emerald-600">₹ 118.00 Lakhs</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="font-sans text-muted-foreground">Earned Value (EV):</span>
                  <span className="font-bold text-blue-600">₹ 113.00 Lakhs</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="font-sans text-muted-foreground">Actual Cost (AC):</span>
                  <span className="font-bold text-amber-600">₹ 82.40 Lakhs</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="font-sans text-muted-foreground">Estimate at Completion (EAC):</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹ 181.20 Lakhs</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-sans text-muted-foreground">Estimate to Complete (ETC):</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹ 98.80 Lakhs</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsEvmReportOpen(false)}>Close EVM Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default ProjectAnalyticsFormPage;
