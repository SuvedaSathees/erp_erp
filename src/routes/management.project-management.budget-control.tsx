import { useState, useMemo } from "react";
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
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon,
  Sparkles,
  Layers,
  ArrowUpDown,
  SlidersHorizontal,
  Wallet,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Info,
  Share2,
  FileSpreadsheet,
  Calculator,
  Lock,
  Unlock,
  Trash2,
  Edit2,
  Printer,
  ExternalLink,
  X,
  Check,
  Send,
  Save,
  History,
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

export interface WbsBudgetChildItem {
  code: string;
  desc: string;
  budget: number;
  committed: number;
  actual: number;
  forecast: number;
  variance: number;
  variancePct: number;
  utilization: number;
  status: "Monitor" | "Over Budget" | "High Usage" | "On Track";
}

export interface WbsBudgetRegisterItem {
  code: string;
  desc: string;
  budget: number;
  committed: number;
  actual: number;
  forecast: number;
  variance: number;
  variancePct: number;
  utilization: number;
  status: "Monitor" | "Over Budget" | "High Usage" | "On Track";
  children?: WbsBudgetChildItem[];
}

export const INITIAL_WBS_BUDGETS: WbsBudgetRegisterItem[] = [
  {
    code: "1.0",
    desc: "Project Management",
    budget: 12.0,
    committed: 8.0,
    actual: 3.0,
    forecast: 11.0,
    variance: 1.0,
    variancePct: 8.33,
    utilization: 25.0,
    status: "Monitor",
    children: [
      {
        code: "1.1",
        desc: "PMO & Project Controls",
        budget: 7.0,
        committed: 5.0,
        actual: 2.0,
        forecast: 6.5,
        variance: 0.5,
        variancePct: 7.14,
        utilization: 28.57,
        status: "Monitor",
      },
      {
        code: "1.2",
        desc: "Steering Committee & Audits",
        budget: 5.0,
        committed: 3.0,
        actual: 1.0,
        forecast: 4.5,
        variance: 0.5,
        variancePct: 10.0,
        utilization: 20.0,
        status: "On Track",
      },
    ],
  },
  {
    code: "2.0",
    desc: "Engineering",
    budget: 18.0,
    committed: 14.0,
    actual: 9.0,
    forecast: 20.8,
    variance: -2.8,
    variancePct: -15.56,
    utilization: 50.0,
    status: "Over Budget",
    children: [
      {
        code: "2.1",
        desc: "Electrical Architecture & Schematics",
        budget: 6.5,
        committed: 5.8,
        actual: 3.8,
        forecast: 7.6,
        variance: -1.1,
        variancePct: -16.92,
        utilization: 58.46,
        status: "Over Budget",
      },
      {
        code: "2.2",
        desc: "Mechanical CAD & CFD Enclosure",
        budget: 6.5,
        committed: 5.2,
        actual: 3.4,
        forecast: 7.4,
        variance: -0.9,
        variancePct: -13.85,
        utilization: 52.31,
        status: "Over Budget",
      },
      {
        code: "2.3",
        desc: "Firmware & CAN Telemetry",
        budget: 5.0,
        committed: 3.0,
        actual: 1.8,
        forecast: 5.8,
        variance: -0.8,
        variancePct: -16.0,
        utilization: 36.0,
        status: "Over Budget",
      },
    ],
  },
  {
    code: "3.0",
    desc: "Procurement",
    budget: 85.0,
    committed: 70.0,
    actual: 42.0,
    forecast: 86.0,
    variance: -1.0,
    variancePct: -1.18,
    utilization: 49.41,
    status: "Over Budget",
    children: [
      {
        code: "3.1",
        desc: "SiC Power Converter Assemblies",
        budget: 55.0,
        committed: 48.0,
        actual: 30.0,
        forecast: 55.8,
        variance: -0.8,
        variancePct: -1.45,
        utilization: 54.55,
        status: "Over Budget",
      },
      {
        code: "3.2",
        desc: "High Voltage Cables & Contactors",
        budget: 30.0,
        committed: 22.0,
        actual: 12.0,
        forecast: 30.2,
        variance: -0.2,
        variancePct: -0.67,
        utilization: 40.0,
        status: "Monitor",
      },
    ],
  },
  {
    code: "4.0",
    desc: "Production",
    budget: 32.0,
    committed: 24.0,
    actual: 18.0,
    forecast: 33.0,
    variance: -1.0,
    variancePct: -3.13,
    utilization: 56.25,
    status: "High Usage",
    children: [
      {
        code: "4.1",
        desc: "Sheet Metal & CNC Milling",
        budget: 18.0,
        committed: 14.5,
        actual: 11.2,
        forecast: 18.8,
        variance: -0.8,
        variancePct: -4.44,
        utilization: 62.22,
        status: "High Usage",
      },
      {
        code: "4.2",
        desc: "PCB Surface Mount & Loom Harnessing",
        budget: 14.0,
        committed: 9.5,
        actual: 6.8,
        forecast: 14.2,
        variance: -0.2,
        variancePct: -1.43,
        utilization: 48.57,
        status: "Monitor",
      },
    ],
  },
  {
    code: "5.0",
    desc: "Installation",
    budget: 18.0,
    committed: 8.0,
    actual: 6.0,
    forecast: 17.0,
    variance: 1.0,
    variancePct: 5.56,
    utilization: 33.33,
    status: "Monitor",
    children: [
      {
        code: "5.1",
        desc: "Civil Foundation & Rigging",
        budget: 10.0,
        committed: 5.0,
        actual: 4.0,
        forecast: 9.5,
        variance: 0.5,
        variancePct: 5.0,
        utilization: 40.0,
        status: "Monitor",
      },
      {
        code: "5.2",
        desc: "Grid Interconnection & Substation",
        budget: 8.0,
        committed: 3.0,
        actual: 2.0,
        forecast: 7.5,
        variance: 0.5,
        variancePct: 6.25,
        utilization: 25.0,
        status: "On Track",
      },
    ],
  },
  {
    code: "6.0",
    desc: "Commissioning",
    budget: 8.0,
    committed: 4.5,
    actual: 2.4,
    forecast: 8.0,
    variance: 0.0,
    variancePct: 0.0,
    utilization: 30.0,
    status: "On Track",
    children: [
      {
        code: "6.1",
        desc: "Dielectric Safety & Telemetry Sync",
        budget: 4.0,
        committed: 2.5,
        actual: 1.4,
        forecast: 4.0,
        variance: 0.0,
        variancePct: 0.0,
        utilization: 35.0,
        status: "On Track",
      },
      {
        code: "6.2",
        desc: "OCPP Central Cloud Validation",
        budget: 4.0,
        committed: 2.0,
        actual: 1.0,
        forecast: 4.0,
        variance: 0.0,
        variancePct: 0.0,
        utilization: 25.0,
        status: "On Track",
      },
    ],
  },
  {
    code: "7.0",
    desc: "Project Closure",
    budget: 2.0,
    committed: 0.0,
    actual: 0.0,
    forecast: 2.0,
    variance: 0.0,
    variancePct: 0.0,
    utilization: 0.0,
    status: "On Track",
    children: [
      {
        code: "7.1",
        desc: "As-Built Dossier & Warranty Handover",
        budget: 2.0,
        committed: 0.0,
        actual: 0.0,
        forecast: 2.0,
        variance: 0.0,
        variancePct: 0.0,
        utilization: 0.0,
        status: "On Track",
      },
    ],
  },
];

export const Route = createFileRoute("/management/project-management/budget-control")({
  head: () => ({
    meta: [
      { title: "Budget Control Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content: "Manage project budgets, monitor costs, track commitments and analyze variances in real time.",
      },
    ],
  }),
  component: BudgetControlFormPage,
});

export function BudgetControlFormPage() {
  const [wbsBudgets, setWbsBudgets] = useState<WbsBudgetRegisterItem[]>(INITIAL_WBS_BUDGETS);
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set(["2.0"]));
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);
  const [currencyUnit, setCurrencyUnit] = useState<"Lakhs" | "Crores">("Lakhs");
  const [sortField, setSortField] = useState<"code" | "budget" | "variance">("code");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Header Filters
  const [filterProject, setFilterProject] = useState("Smart EV Charging Infrastructure");
  const [filterWbs, setFilterWbs] = useState("All WBS");
  const [filterVersion, setFilterVersion] = useState("V1.0 - Original");
  const [filterType, setFilterType] = useState("Original");
  const [filterFY, setFilterFY] = useState("2026-27");
  const [filterStatus, setFilterStatus] = useState("Approved");
  const [filterCurrency, setFilterCurrency] = useState("INR - ₹");
  const [filterOwner, setFilterOwner] = useState("Arun Kumar");
  const [filterController, setFilterController] = useState("Ramesh Babu");

  // Modals
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);
  const [isAddLineOpen, setIsAddLineOpen] = useState(false);
  const [isEditLineOpen, setIsEditLineOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WbsBudgetRegisterItem | null>(null);
  const [isChangeRequestOpen, setIsChangeRequestOpen] = useState(false);
  const [isEvaOpen, setIsEvaOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCommitmentsOpen, setIsCommitmentsOpen] = useState(false);
  const [isContingencyOpen, setIsContingencyOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isVarianceReportOpen, setIsVarianceReportOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  // New Budget Form State
  const [newDirectCost, setNewDirectCost] = useState(142.0);
  const [newIndirectCost, setNewIndirectCost] = useState(18.0);
  const [newContingency, setNewContingency] = useState(15.0);

  // Add Line Form State
  const [newLineCode, setNewLineCode] = useState("2.4");
  const [newLineDesc, setNewLineDesc] = useState("Thermal Interface Validation");
  const [newLineBudget, setNewLineBudget] = useState(3.5);
  const [newLineCommitted, setNewLineCommitted] = useState(1.2);
  const [newLineActual, setNewLineActual] = useState(0.8);
  const [newLineForecast, setNewLineForecast] = useState(3.4);

  // New Change Request Form State
  const [bcrWbs, setBcrWbs] = useState("2.0 Engineering");
  const [bcrAmount, setBcrAmount] = useState(2.8);
  const [bcrReason, setBcrReason] = useState(
    "Additional engineering effort caused by customer design scope changes.",
  );

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setFilterWbs("All WBS");
    setFilterVersion("V1.0 - Original");
    setFilterType("Original");
    setFilterStatus("Approved");
    setSearchQuery("");
    setActiveKpiFilter(null);
    toast.info("Budget filters reset to default.");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setWbsBudgets(INITIAL_WBS_BUDGETS);
      handleClearFilters();
      toast.success("Budget baseline, PO commitments and actuals refreshed from SAP/ERP.");
    }, 450);
  };

  const handleCreateBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(newDirectCost) + Number(newIndirectCost) + Number(newContingency);
    toast.success(`Project Budget baseline created: ₹ ${total.toFixed(2)} L (Draft V1.1)`);
    setIsCreateBudgetOpen(false);
  };

  const handleAddLineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const b = Number(newLineBudget);
    const f = Number(newLineForecast);
    const diff = b - f;
    const diffPct = b > 0 ? (diff / b) * 100 : 0;
    const act = Number(newLineActual);
    const ut = b > 0 ? (act / b) * 100 : 0;

    const newItem: WbsBudgetRegisterItem = {
      code: newLineCode,
      desc: newLineDesc,
      budget: b,
      committed: Number(newLineCommitted),
      actual: act,
      forecast: f,
      variance: parseFloat(diff.toFixed(2)),
      variancePct: parseFloat(diffPct.toFixed(2)),
      utilization: parseFloat(ut.toFixed(2)),
      status: diff < 0 ? "Over Budget" : ut > 70 ? "High Usage" : "On Track",
    };

    setWbsBudgets((prev) => [...prev, newItem]);
    setIsAddLineOpen(false);
    toast.success(`Added WBS Budget line: ${newLineCode} ${newLineDesc} (₹ ${b.toFixed(2)} L)`);
  };

  const handleSaveEditLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const diff = editingItem.budget - editingItem.forecast;
    const diffPct = editingItem.budget > 0 ? (diff / editingItem.budget) * 100 : 0;
    const ut = editingItem.budget > 0 ? (editingItem.actual / editingItem.budget) * 100 : 0;

    const updated: WbsBudgetRegisterItem = {
      ...editingItem,
      variance: parseFloat(diff.toFixed(2)),
      variancePct: parseFloat(diffPct.toFixed(2)),
      utilization: parseFloat(ut.toFixed(2)),
      status: diff < 0 ? "Over Budget" : ut > 70 ? "High Usage" : "On Track",
    };

    setWbsBudgets((prev) => prev.map((item) => (item.code === updated.code ? updated : item)));
    setIsEditLineOpen(false);
    toast.success(`Updated WBS Budget line for ${updated.code}`);
  };

  const handleDeleteLine = (code: string) => {
    setWbsBudgets((prev) => prev.filter((item) => item.code !== code));
    toast.success(`Removed WBS line item ${code}`);
  };

  const handleApproveBcr = () => {
    // Reallocate 2.80 L to 2.0 Engineering in state
    setWbsBudgets((prev) =>
      prev.map((item) => {
        if (item.code === "2.0") {
          const newBudget = item.budget + 2.8;
          const diff = newBudget - item.forecast;
          return {
            ...item,
            budget: newBudget,
            variance: parseFloat(diff.toFixed(2)),
            variancePct: parseFloat(((diff / newBudget) * 100).toFixed(2)),
            status: "Monitor",
          };
        }
        return item;
      }),
    );
    setIsChangeRequestOpen(false);
    toast.success("Budget Change Request BCR-004 Approved!", {
      description:
        "Allocated ₹2.80 L from Contingency (₹15 L → ₹12.2 L) to Engineering (2.0). Schedule impact: +2 days.",
    });
  };

  const handleReallocateInstallToEng = () => {
    setWbsBudgets((prev) =>
      prev.map((item) => {
        if (item.code === "5.0") {
          return { ...item, budget: item.budget - 1.0, forecast: item.forecast - 1.0 };
        }
        if (item.code === "2.0") {
          return { ...item, budget: item.budget + 1.0, variance: item.variance + 1.0 };
        }
        return item;
      }),
    );
    toast.success("Reallocated ₹ 1.00 L from 5.0 Installation to 2.0 Engineering.");
  };

  const handleExportCsv = () => {
    const header = "WBS Code,WBS Description,Budget (Lakhs),Committed (Lakhs),Actual (Lakhs),Forecast (Lakhs),Variance (Lakhs),Variance %,Utilization %,Status\n";
    const rows = wbsBudgets
      .map(
        (b) =>
          `"${b.code}","${b.desc}",${b.budget.toFixed(2)},${b.committed.toFixed(2)},${b.actual.toFixed(2)},${b.forecast.toFixed(2)},${b.variance.toFixed(2)},${b.variancePct.toFixed(2)},${b.utilization.toFixed(2)},"${b.status}"`,
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Budget_Register.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("WBS Budget Register exported to CSV.");
  };

  const handleExportDossier = () => {
    const text = `=====================================================
PROJECT BUDGET CONTROL & FINANCIAL DOSSIER
Project: Smart EV Charging Infrastructure (PRJ-2026-0195)
Baseline ID: BL-2026-001 | Version: V1.0 Original (Locked)
Generated: ${new Date().toLocaleString()}
=====================================================

EXECUTIVE FINANCIAL SUMMARY:
• Approved Budget:    ₹ 175.00 Lakhs (100% of Baseline)
• Committed Cost:     ₹ 128.50 Lakhs (73.43% of Budget)
• Actual Cost:        ₹  82.40 Lakhs (47.09% of Budget)
• Forecast at Compl.: ₹ 181.20 Lakhs (103.54% of Budget)
• Variance (Overrun): -₹   6.20 Lakhs (-3.54% Over Budget)
• Contingency Left:   ₹   8.50 Lakhs (56.67% remaining)

EARNED VALUE ANALYSIS (EVA):
• Planned Value (PV):  ₹ 96.00 L
• Earned Value (EV):   ₹ 91.00 L
• Actual Cost (AC):    ₹ 82.40 L
• CPI (Cost Perf.):    1.10 (Under Budget)
• SPI (Sched Perf.):   0.95 (Slight Schedule Delay)

WBS BUDGET REGISTER:
-----------------------------------------------------
${wbsBudgets
  .map(
    (b) =>
      `[${b.code}] ${b.desc}
  Budget: ₹${b.budget.toFixed(2)}L | Committed: ₹${b.committed.toFixed(2)}L | Actual: ₹${b.actual.toFixed(2)}L
  Forecast: ₹${b.forecast.toFixed(2)}L | Variance: ${b.variance > 0 ? "+" : ""}₹${b.variance.toFixed(2)}L (${b.variancePct.toFixed(2)}%)
  Utilization: ${b.utilization.toFixed(2)}% | Status: [${b.status}]`,
  )
  .join("\n\n")}
=====================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Budget_Dossier.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Budget Dossier (.TXT) downloaded.");
  };

  // Filtered & Sorted Budgets
  const filteredBudgets = useMemo(() => {
    return wbsBudgets
      .filter((b) => {
        const matchesSearch =
          !searchQuery ||
          b.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.code.includes(searchQuery);

        const matchesWbs = filterWbs === "All WBS" || b.code === filterWbs.split(" ")[0];

        const matchesKpi =
          !activeKpiFilter
            ? true
            : activeKpiFilter === "committed"
            ? (b.committed / b.budget) >= 0.6
            : activeKpiFilter === "actual"
            ? b.actual > 0
            : activeKpiFilter === "forecast"
            ? b.forecast >= b.budget
            : activeKpiFilter === "variance"
            ? b.variance < 0
            : true;

        return matchesSearch && matchesWbs && matchesKpi;
      })
      .sort((a, b) => {
        if (sortField === "budget") {
          return sortOrder === "asc" ? a.budget - b.budget : b.budget - a.budget;
        }
        if (sortField === "variance") {
          return sortOrder === "asc" ? a.variance - b.variance : b.variance - a.variance;
        }
        return sortOrder === "asc" ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
      });
  }, [wbsBudgets, searchQuery, filterWbs, activeKpiFilter, sortField, sortOrder]);

  return (
    <AppShell
      title="Budget Control Form"
      breadcrumb="Management > Project Management > Budget Control"
      description="Manage project budgets, monitor costs, track commitments and analyze variances in real time."
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
                  Budget Control Form
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
                  onClick={() => setIsAddLineOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Budget Line
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
                    toast.success("Budget control report emailed to stakeholders.");
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
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export CSV Register
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-blue-600" /> Export Budget Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsEvaOpen(true)} className="cursor-pointer">
                      <Calculator className="mr-2 h-4 w-4 text-purple-600" /> Earned Value Analysis (EVA)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Budget baseline saved successfully!");
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
             2. TOP HEADER FORM CARD (2 Rows with Clear Filters & Governance)
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left / Main Inputs (8 cols) */}
              <div className="lg:col-span-8 space-y-3">
                {/* Row 1: Project, Project Code, WBS, Baseline Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
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
                      WBS
                    </span>
                    <select
                      value={filterWbs}
                      onChange={(e) => setFilterWbs(e.target.value)}
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                    >
                      <option>All WBS</option>
                      <option>1.0 Project Management</option>
                      <option>2.0 Engineering</option>
                      <option>3.0 Procurement</option>
                      <option>4.0 Production</option>
                      <option>5.0 Installation</option>
                      <option>6.0 Commissioning</option>
                      <option>7.0 Project Closure</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Baseline Date
                    </span>
                    <div className="h-8 px-2 flex items-center justify-between font-medium text-xs bg-slate-50 dark:bg-slate-800 rounded-md border border-input mt-0.5">
                      <span>01 Sep 2026</span>
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Row 2: Budget Version, Budget Type, Financial Year, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Budget Version <span className="text-rose-500">*</span>
                    </span>
                    <select
                      value={filterVersion}
                      onChange={(e) => setFilterVersion(e.target.value)}
                      className="h-8 w-full text-xs font-semibold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                    >
                      <option>V1.0 - Original</option>
                      <option>V1.1 - Revised</option>
                      <option>V2.0 - Working Forecast</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Budget Type
                    </span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                    >
                      <option>Original</option>
                      <option>Revised</option>
                      <option>Forecast</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Financial Year
                    </span>
                    <select
                      value={filterFY}
                      onChange={(e) => setFilterFY(e.target.value)}
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                    >
                      <option>2026-27</option>
                      <option>2025-26</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Status
                    </span>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="h-8 w-full text-xs font-semibold text-emerald-700 dark:text-emerald-300 rounded-md border border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 px-2 mt-0.5"
                    >
                      <option>Approved</option>
                      <option>Draft</option>
                      <option>Locked</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Currency, Budget Owner, Cost Controller, Clear Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Currency
                    </span>
                    <select
                      value={filterCurrency}
                      onChange={(e) => setFilterCurrency(e.target.value)}
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                    >
                      <option>INR - ₹</option>
                      <option>USD - $</option>
                      <option>EUR - €</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Budget Owner
                    </span>
                    <select
                      value={filterOwner}
                      onChange={(e) => setFilterOwner(e.target.value)}
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                    >
                      <option>Arun Kumar</option>
                      <option>Suresh Kumar</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                      Cost Controller
                    </span>
                    <select
                      value={filterController}
                      onChange={(e) => setFilterController(e.target.value)}
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                    >
                      <option>Ramesh Babu</option>
                      <option>Finance Operations</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="h-8 w-full text-xs font-medium gap-1.5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <Filter className="h-3.5 w-3.5 text-slate-500" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Box: Baseline Control & Governance */}
              <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-border/60 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Baseline ID</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                      BL-2026-001
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Baseline Status</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                      {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3 text-amber-500" />}
                      {isLocked ? "Approved & Locked" : "Draft Revision"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                      Contingency Reserve <Info className="h-3 w-3 text-muted-foreground/60" />
                    </span>
                    <button
                      onClick={() => setIsContingencyOpen(true)}
                      className="font-mono font-bold text-primary text-xs hover:underline cursor-pointer block text-left"
                    >
                      ₹ 12.50 L (7.1%)
                    </button>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Change Control</span>
                    <button
                      onClick={() => setIsChangeRequestOpen(true)}
                      className="font-semibold text-slate-700 dark:text-slate-300 text-xs hover:underline cursor-pointer block text-left"
                    >
                      0 Pending BCRs
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs mt-2">
                  <span className="text-muted-foreground font-medium">Approval Authority</span>
                  <span className="font-semibold text-foreground text-xs">
                    Project Steering Committee
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================
             3. SIX METRIC KPI CARDS ROW (Interactive Click-to-Filter)
             ==================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Approved Budget */}
            <div
              onClick={() => {
                setActiveKpiFilter(null);
                handleClearFilters();
                toast.info("Showing all WBS budget allocations.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs",
                activeKpiFilter === null && "ring-2 ring-primary/60",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Approved Budget
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  ₹ 175.00 L
                </span>
                <span className="text-[10px] text-primary font-semibold block mt-1">
                  100% of Baseline
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Wallet className="h-5 w-5" />
              </div>
            </div>

            {/* 2. Committed Cost */}
            <div
              onClick={() => {
                setActiveKpiFilter("committed");
                toast.info("Filtered for high-commitment WBS elements (>60% committed).");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-xs",
                activeKpiFilter === "committed" && "ring-2 ring-emerald-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Committed Cost
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  ₹ 128.50 L
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  73.43% of Budget
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            {/* 3. Actual Cost */}
            <div
              onClick={() => {
                setActiveKpiFilter("actual");
                toast.info("Filtered for WBS elements with active incurred expenditures.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-amber-500/60 hover:shadow-xs",
                activeKpiFilter === "actual" && "ring-2 ring-amber-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Actual Cost
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  ₹ 82.40 L
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
                  47.09% of Budget
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>

            {/* 4. Forecast Cost */}
            <div
              onClick={() => {
                setActiveKpiFilter("forecast");
                toast.info("Filtered for WBS elements where forecast cost reaches or exceeds budget.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-purple-500/60 hover:shadow-xs",
                activeKpiFilter === "forecast" && "ring-2 ring-purple-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Forecast Cost
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  ₹ 181.20 L
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block mt-1">
                  103.54% of Budget
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            {/* 5. Variance */}
            <div
              onClick={() => {
                setActiveKpiFilter("variance");
                toast.info("Filtered for Over Budget WBS elements (negative variance).");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-rose-500/60 hover:shadow-xs",
                activeKpiFilter === "variance" && "ring-2 ring-rose-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Variance
                </span>
                <span className="text-xl font-bold font-mono text-rose-600 mt-0.5 block">
                  +₹ 6.20 L
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  3.54% Over Budget
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>

            {/* 6. Contingency Left */}
            <div
              onClick={() => setIsContingencyOpen(true)}
              className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-cyan-500/60 hover:shadow-xs"
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Contingency Left
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  ₹ 8.50 L
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold block mt-1">
                  56.67% of Contingency
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. MIDDLE 4-CARD SECTION (ROW 1 OF ANALYTICS)
             ==================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {/* Card 1: Budget vs Cost Overview */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Budget vs Cost Overview
                </CardTitle>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrencyUnit(currencyUnit === "Lakhs" ? "Crores" : "Lakhs")}
                    className="text-[10px] font-mono font-semibold border rounded px-1.5 py-0.5 hover:bg-muted cursor-pointer"
                  >
                    {currencyUnit === "Lakhs" ? "Unit: ₹ Lakhs" : "Unit: ₹ Crores"}
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="h-44 w-full">
                  <svg className="h-full w-full" viewBox="0 0 280 150">
                    {/* Grid line at 175L baseline */}
                    <line x1="30" y1="31" x2="270" y2="31" stroke="#ef4444" strokeDasharray="3 3" strokeWidth="1" />
                    <text x="200" y="27" fontSize="7" fill="#ef4444" fontWeight="bold">Budget Limit 175L</text>

                    {/* Y-axis marks */}
                    <text x="5" y="16" fontSize="7.5" fill="#94a3b8">200</text>
                    <text x="5" y="46" fontSize="7.5" fill="#94a3b8">160</text>
                    <text x="5" y="76" fontSize="7.5" fill="#94a3b8">120</text>
                    <text x="10" y="106" fontSize="7.5" fill="#94a3b8">80</text>
                    <text x="10" y="136" fontSize="7.5" fill="#94a3b8">40</text>

                    {/* Column 1: Budget (175L) */}
                    <rect x="50" y="31" width="28" height="109" fill="#2563eb" rx="2" className="cursor-pointer hover:opacity-80 transition-opacity" />
                    <text x="44" y="25" fontSize="7.5" fill="#2563eb" fontWeight="bold">175.00L</text>
                    <text x="52" y="148" fontSize="7.5" fill="#64748b">Budget</text>

                    {/* Column 2: Committed (128.5L) */}
                    <rect
                      x="105"
                      y="65"
                      width="28"
                      height="75"
                      fill="#10b981"
                      rx="2"
                      onClick={() => setIsCommitmentsOpen(true)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                    <text x="100" y="59" fontSize="7.5" fill="#10b981" fontWeight="bold">128.50L</text>
                    <text x="102" y="148" fontSize="7.5" fill="#64748b">Committed</text>

                    {/* Column 3: Actual (82.4L) */}
                    <rect
                      x="160"
                      y="94"
                      width="28"
                      height="46"
                      fill="#f59e0b"
                      rx="2"
                      onClick={() => {
                        setActiveKpiFilter("actual");
                        toast.info("Filtered table for actual incurred costs.");
                      }}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                    <text x="157" y="88" fontSize="7.5" fill="#f59e0b" fontWeight="bold">82.40L</text>
                    <text x="166" y="148" fontSize="7.5" fill="#64748b">Actual</text>

                    {/* Column 4: Forecast (181.2L) */}
                    <rect
                      x="215"
                      y="27"
                      width="28"
                      height="113"
                      fill="#8b5cf6"
                      rx="2"
                      onClick={() => setIsChangeRequestOpen(true)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                    <text x="210" y="21" fontSize="7.5" fill="#8b5cf6" fontWeight="bold">181.20L</text>
                    <text x="218" y="148" fontSize="7.5" fill="#64748b">Forecast</text>
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Budget Utilization */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Budget Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="relative mx-auto flex h-28 w-44 items-center justify-center">
                  <svg className="h-full w-full" viewBox="0 0 100 60">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#ef4444" strokeWidth="10" strokeDasharray="125.66" strokeDashoffset="0" />
                    <path d="M 10 50 A 40 40 0 0 1 70 20" fill="none" stroke="#10b981" strokeWidth="10" />
                    <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#0d9488" strokeWidth="10" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center">
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white">47.09%</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Actual vs Budget</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[10.5px]">
                  <div
                    onClick={() => {
                      setActiveKpiFilter("actual");
                      toast.info("Filtered table for Actual Cost");
                    }}
                    className="flex justify-between items-center p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-teal-600" /> Actual Cost (₹ 82.40 L)</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">47.09%</span>
                  </div>
                  <div
                    onClick={() => setIsCommitmentsOpen(true)}
                    className="flex justify-between items-center p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Committed Cost (₹ 128.50 L)</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">73.43%</span>
                  </div>
                  <div
                    onClick={() => setIsChangeRequestOpen(true)}
                    className="flex justify-between items-center p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-purple-500" /> Forecast Cost (₹ 181.20 L)</span>
                    <span className="font-mono font-bold text-purple-600">103.54%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Cost Summary */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-[10px] text-muted-foreground font-semibold">
                      <th className="pb-1.5">Description</th>
                      <th className="pb-1.5">Amount (₹)</th>
                      <th className="pb-1.5 pr-1 text-right">% of Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-[11px]">
                    <tr
                      onClick={() => toast.info("Direct Cost consists of Materials, Direct Labour, Subcontracts & Tooling.")}
                      className="hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="py-2 text-slate-800 dark:text-slate-200 font-medium">Direct Cost</td>
                      <td className="py-2 font-mono font-semibold">₹ 142.00 L</td>
                      <td className="py-2 pr-1 text-right font-mono">81.14%</td>
                    </tr>
                    <tr
                      onClick={() => toast.info("Indirect Cost includes PMO, Compliance QA, and Project Overheads.")}
                      className="hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="py-2 text-slate-800 dark:text-slate-200 font-medium">Indirect Cost</td>
                      <td className="py-2 font-mono font-semibold">₹ 18.00 L</td>
                      <td className="py-2 pr-1 text-right font-mono">10.29%</td>
                    </tr>
                    <tr
                      onClick={() => setIsContingencyOpen(true)}
                      className="hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="py-2 text-slate-800 dark:text-slate-200 font-medium">Contingency</td>
                      <td className="py-2 font-mono font-semibold text-primary">₹ 15.00 L</td>
                      <td className="py-2 pr-1 text-right font-mono">8.57%</td>
                    </tr>
                    <tr className="border-t-2 font-bold bg-muted/20">
                      <td className="py-2 pl-1">Total Budget</td>
                      <td className="py-2 font-mono text-primary">₹ 175.00 L</td>
                      <td className="py-2 pr-1 text-right font-mono">100%</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Card 4: Cost Trend (Last 6 Months) */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Cost Trend (Last 6 Months)
                </CardTitle>
                <select
                  value={currencyUnit}
                  onChange={(e) => setCurrencyUnit(e.target.value as any)}
                  className="h-6 text-[10px] border rounded px-1 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="Lakhs">Amount (₹ Lakhs)</option>
                  <option value="Crores">Amount (₹ Crores)</option>
                </select>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-center gap-4 text-[10px] font-semibold">
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> Actual</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Committed</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-purple-500" /> Forecast</span>
                </div>

                <div className="h-36 w-full">
                  <svg className="h-full w-full" viewBox="0 0 280 130">
                    <line x1="25" y1="20" x2="270" y2="20" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="50" x2="270" y2="50" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="80" x2="270" y2="80" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="110" x2="270" y2="110" stroke="#e2e8f0" strokeDasharray="2 2" />

                    <text x="5" y="24" fontSize="7" fill="#94a3b8">200</text>
                    <text x="5" y="54" fontSize="7" fill="#94a3b8">150</text>
                    <text x="5" y="84" fontSize="7" fill="#94a3b8">80</text>
                    <text x="10" y="114" fontSize="7" fill="#94a3b8">0</text>

                    {/* Forecast line (Purple) */}
                    <polyline fill="none" stroke="#8b5cf6" strokeWidth="1.5" points="35,58 75,54 115,49 155,42 195,35 245,30" />
                    {/* Committed line (Green) */}
                    <polyline fill="none" stroke="#10b981" strokeWidth="1.5" points="35,80 75,72 115,64 155,56 195,54 245,48" />
                    {/* Actual line (Orange) */}
                    <polyline fill="none" stroke="#f59e0b" strokeWidth="1.5" points="35,96 75,91 115,86 155,80 195,75 245,71" />

                    <circle cx="245" cy="30" r="2.5" fill="#8b5cf6" />
                    <circle cx="245" cy="48" r="2.5" fill="#10b981" />
                    <circle cx="245" cy="71" r="2.5" fill="#f59e0b" />

                    <text x="248" y="28" fontSize="7" fill="#8b5cf6" fontWeight="bold">181</text>
                    <text x="248" y="47" fontSize="7" fill="#10b981" fontWeight="bold">128</text>
                    <text x="248" y="70" fontSize="7" fill="#f59e0b" fontWeight="bold">82</text>

                    <text x="28" y="125" fontSize="7.5" fill="#64748b">Apr 26</text>
                    <text x="68" y="125" fontSize="7.5" fill="#64748b">May 26</text>
                    <text x="108" y="125" fontSize="7.5" fill="#64748b">Jun 26</text>
                    <text x="148" y="125" fontSize="7.5" fill="#64748b">Jul 26</text>
                    <text x="188" y="125" fontSize="7.5" fill="#64748b">Aug 26</text>
                    <text x="238" y="125" fontSize="7.5" fill="#64748b">Sep 26</text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             5. MASTER WBS BUDGET REGISTER TABLE (12 Columns, Full Width)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  WBS Budget Register
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredBudgets.length} WBS Heads
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search WBS element..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs w-48 sm:w-56 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-8 text-xs gap-1 cursor-pointer"
                    title="Clear filters"
                  >
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (sortField === "code") {
                        setSortField("budget");
                        setSortOrder("desc");
                        toast.info("Sorted by Budget (Highest first)");
                      } else if (sortField === "budget") {
                        setSortField("variance");
                        setSortOrder("asc");
                        toast.info("Sorted by Variance (Over Budget first)");
                      } else {
                        setSortField("code");
                        setSortOrder("asc");
                        toast.info("Sorted by WBS Code");
                      }
                    }}
                    className="h-8 text-xs gap-1 cursor-pointer"
                    title="Sort WBS items"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                    Sort: {sortField}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsAddLineOpen(true)}
                    className="h-8 text-xs gap-1 cursor-pointer bg-[#0B3B7B] hover:bg-[#082B5B] text-white"
                    title="Add line item"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Line
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/40 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      <th className="p-2.5 pl-4 w-28">WBS Code</th>
                      <th className="p-2.5 w-60">WBS Description</th>
                      <th className="p-2.5 font-mono w-28">Budget (₹)</th>
                      <th className="p-2.5 font-mono w-28">Committed (₹)</th>
                      <th className="p-2.5 font-mono w-28">Actual (₹)</th>
                      <th className="p-2.5 font-mono w-28">Forecast (₹)</th>
                      <th className="p-2.5 font-mono w-28">Variance (₹)</th>
                      <th className="p-2.5 font-mono w-24">Variance %</th>
                      <th className="p-2.5 font-mono w-24">Utilization</th>
                      <th className="p-2.5 w-28">Status</th>
                      <th className="p-2.5 pr-4 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                      {filteredBudgets.map((row) => {
                        const isExpanded = expandedCodes.has(row.code);
                        return (
                          <>
                            <tr key={row.code} className="hover:bg-muted/20 transition-colors">
                              <td className="p-2.5 pl-3 font-mono font-bold text-primary text-[11px] whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(row.code)}
                                  className="inline-flex items-center gap-1 hover:text-primary cursor-pointer font-bold"
                                  title="Expand/Collapse child activities"
                                >
                                  {row.children && row.children.length > 0 ? (
                                    <ChevronDown
                                      className={cn(
                                        "h-3.5 w-3.5 transition-transform",
                                        !isExpanded && "-rotate-90",
                                      )}
                                    />
                                  ) : (
                                    <span className="w-3.5" />
                                  )}
                                  {row.code}
                                </button>
                              </td>
                              <td className="p-2.5 font-semibold text-slate-900 dark:text-white">
                                {row.desc}
                              </td>
                              <td className="p-2.5 font-mono font-bold">₹ {row.budget.toFixed(2)} L</td>
                              <td className="p-2.5 font-mono">₹ {row.committed.toFixed(2)} L</td>
                              <td className="p-2.5 font-mono font-semibold">₹ {row.actual.toFixed(2)} L</td>
                              <td className="p-2.5 font-mono">₹ {row.forecast.toFixed(2)} L</td>
                              <td
                                className={cn(
                                  "p-2.5 font-mono font-bold",
                                  row.variance > 0
                                    ? "text-emerald-600"
                                    : row.variance < 0
                                    ? "text-rose-600"
                                    : "text-slate-500",
                                )}
                              >
                                {row.variance > 0
                                  ? `+₹ ${row.variance.toFixed(2)} L`
                                  : row.variance < 0
                                  ? `-₹ ${Math.abs(row.variance).toFixed(2)} L`
                                  : "₹ 0.00 L"}
                              </td>
                              <td
                                className={cn(
                                  "p-2.5 font-mono font-bold",
                                  row.variancePct > 0
                                    ? "text-emerald-600"
                                    : row.variancePct < 0
                                    ? "text-rose-600"
                                    : "text-slate-500",
                                )}
                              >
                                {row.variancePct > 0
                                  ? `+${row.variancePct.toFixed(2)}%`
                                  : `${row.variancePct.toFixed(2)}%`}
                              </td>
                              <td className="p-2.5 font-mono font-bold">{row.utilization.toFixed(2)}%</td>
                              <td className="p-2.5">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[9px] px-1.5 py-0.2",
                                    row.status === "Over Budget"
                                      ? "bg-rose-50 text-rose-700 border-rose-300"
                                      : row.status === "High Usage" || row.status === "Monitor"
                                      ? "bg-amber-50 text-amber-700 border-amber-300"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-300",
                                  )}
                                >
                                  {row.status}
                                </Badge>
                              </td>
                              <td className="p-2.5 pr-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingItem(row);
                                      setIsEditLineOpen(true);
                                    }}
                                    className="p-1 rounded text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                                    title="Edit WBS Budget"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                  {row.status === "Over Budget" && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setBcrWbs(`${row.code} ${row.desc}`);
                                        setBcrAmount(Math.abs(row.variance));
                                        setIsChangeRequestOpen(true);
                                      }}
                                      className="p-1 rounded text-rose-600 hover:text-rose-700 cursor-pointer transition-colors"
                                      title="Request Budget Change (BCR)"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLine(row.code)}
                                    className="p-1 rounded text-muted-foreground hover:text-rose-600 cursor-pointer transition-colors"
                                    title="Delete WBS Line"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Sub-items if expanded */}
                            {isExpanded &&
                              row.children &&
                              row.children.map((child) => (
                                <tr
                                  key={child.code}
                                  className="bg-slate-50/60 dark:bg-slate-800/30 text-[11px] text-muted-foreground"
                                >
                                  <td className="p-2 pl-7 font-mono font-semibold text-primary">
                                    {child.code}
                                  </td>
                                  <td className="p-2 pl-4 text-slate-700 dark:text-slate-300 font-medium">
                                    ↳ {child.desc}
                                  </td>
                                  <td className="p-2 font-mono">₹ {child.budget.toFixed(2)} L</td>
                                  <td className="p-2 font-mono">₹ {child.committed.toFixed(2)} L</td>
                                  <td className="p-2 font-mono">₹ {child.actual.toFixed(2)} L</td>
                                  <td className="p-2 font-mono">₹ {child.forecast.toFixed(2)} L</td>
                                  <td
                                    className={cn(
                                      "p-2 font-mono font-bold",
                                      child.variance > 0
                                        ? "text-emerald-600"
                                        : child.variance < 0
                                        ? "text-rose-600"
                                        : "text-slate-500",
                                    )}
                                  >
                                    {child.variance > 0
                                      ? `+₹ ${child.variance.toFixed(2)} L`
                                      : child.variance < 0
                                      ? `-₹ ${Math.abs(child.variance).toFixed(2)} L`
                                      : "₹ 0.00 L"}
                                  </td>
                                  <td className="p-2 font-mono">{child.variancePct.toFixed(2)}%</td>
                                  <td className="p-2 font-mono">{child.utilization.toFixed(2)}%</td>
                                  <td className="p-2">
                                    <Badge variant="outline" className="text-[8.5px] py-0">
                                      {child.status}
                                    </Badge>
                                  </td>
                                  <td className="p-2 text-center text-[10px] text-muted-foreground">
                                    Sub-task
                                  </td>
                                </tr>
                              ))}
                          </>
                        );
                      })}

                      {/* Total Summary Row */}
                      <tr className="bg-muted/30 font-bold border-t-2 text-slate-900 dark:text-white">
                        <td className="p-2.5 pl-3" colSpan={2}>
                          Total Project Budget
                        </td>
                        <td className="p-2.5 font-mono text-primary">₹ 175.00 L</td>
                        <td className="p-2.5 font-mono">₹ 128.50 L</td>
                        <td className="p-2.5 font-mono">₹ 82.40 L</td>
                        <td className="p-2.5 font-mono">₹ 181.20 L</td>
                        <td className="p-2.5 font-mono text-rose-600">-₹ 6.20 L</td>
                        <td className="p-2.5 font-mono text-rose-600">-3.54%</td>
                        <td className="p-2.5 font-mono">47.09%</td>
                        <td className="p-2.5">
                          <Badge variant="outline" className="text-[9px] bg-rose-50 text-rose-700 border-rose-300">
                            Over Budget
                          </Badge>
                        </td>
                        <td className="p-2.5 pr-3 text-center">
                          <span className="text-[10px] text-muted-foreground">7 Heads</span>
                        </td>
                      </tr>
                    </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================================
             5B. BUDGET ALERTS & AI INSIGHTS MATRIX (Balanced 6 cols + 6 cols = 12 Columns)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Left Card: Budget Alerts & Variance Triggers (6 cols) */}
            <Card className="lg:col-span-6 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                  Budget Alerts & Variance Triggers
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] bg-rose-50 text-rose-700 border-rose-200 font-mono">
                    5 Active Triggers
                  </Badge>
                  <button
                    type="button"
                    onClick={() => setIsAlertsOpen(true)}
                    className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-3 text-xs flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 space-y-1">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-900 dark:text-white leading-relaxed text-xs">
                        Engineering forecast exceeds approved budget by ₹ 2.80 L (15.56%).
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setBcrWbs("2.0 Engineering");
                        setBcrAmount(2.8);
                        setIsChangeRequestOpen(true);
                      }}
                      className="text-[10px] text-rose-700 dark:text-rose-400 font-bold hover:underline pl-6 block cursor-pointer"
                    >
                      Request Budget Change (BCR) →
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 space-y-1">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-900 dark:text-white leading-relaxed text-xs">
                        Procurement commitments exceed 82% of approved budget cap.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCommitmentsOpen(true)}
                      className="text-[10px] text-rose-700 dark:text-rose-400 font-bold hover:underline pl-6 block cursor-pointer"
                    >
                      View Purchase Commitments →
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 space-y-1">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-900 dark:text-white leading-relaxed text-xs">
                        Production WBS 4.0 has consumed 81.25% of allocated line budget.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("Production");
                        toast.info("Filtered table for Production WBS 4.0");
                      }}
                      className="text-[10px] text-amber-700 dark:text-amber-400 font-bold hover:underline pl-6 block cursor-pointer"
                    >
                      View Production Cost Breakdown →
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 space-y-1">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-900 dark:text-white leading-relaxed text-xs">
                        4 WBS elements are currently operating above 70% budget utilization.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveKpiFilter("committed");
                        toast.info("Filtered table for high commitment WBS elements");
                      }}
                      className="text-[10px] text-amber-700 dark:text-amber-400 font-bold hover:underline pl-6 block cursor-pointer"
                    >
                      View High-Commitment Elements →
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 space-y-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-semibold text-slate-900 dark:text-white leading-relaxed text-xs">
                        Contingency reserve balance is ₹ 8.50 L (56.67% intact).
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsContingencyOpen(true)}
                      className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline pl-6 block cursor-pointer"
                    >
                      Audit Contingency Ledger →
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAlertsOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-2 border-t border-border/40"
                >
                  View Full Budget Audit Dossier →
                </button>
              </CardContent>
            </Card>

            {/* Right Card: AI Budget Insights & Recommendations (6 cols) */}
            <Card className="lg:col-span-6 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  AI Budget Insights & Recommendations
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] bg-purple-50 text-purple-700 border-purple-200 font-mono">
                    4 Suggestions
                  </Badge>
                  <button
                    type="button"
                    onClick={() => setIsInsightsOpen(true)}
                    className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-3 text-xs flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-1">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      AI Forecast indicates a potential project overrun of ₹ 6.20 L (3.54%) if current burn rate continues.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setBcrWbs("2.0 Engineering");
                        setBcrAmount(2.8);
                        setIsChangeRequestOpen(true);
                      }}
                      className="text-[10px] text-primary font-bold hover:underline block cursor-pointer"
                    >
                      Apply AI Cost Containment Recommendation →
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-1">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      Engineering rework has increased design expenditures by 12% compared to approved baseline.
                    </p>
                    <button
                      type="button"
                      onClick={() => toast.info("Impact analysis: 3 engineering change orders contributed ₹2.1 L.")}
                      className="text-[10px] text-primary font-bold hover:underline block cursor-pointer"
                    >
                      View Engineering Change Impact Analysis →
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-1">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      Recommend proactive reallocation of ₹ 1.00 L surplus from Installation buffer to Engineering.
                    </p>
                    <button
                      type="button"
                      onClick={handleReallocateInstallToEng}
                      className="text-[10px] text-emerald-600 font-bold hover:underline block cursor-pointer"
                    >
                      Execute Inter-WBS Reallocation Suggestion →
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-1">
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      Project contingency reserve (₹ 8.50 L remaining) is sufficient to absorb remaining risk exposure.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsContingencyOpen(true)}
                      className="text-[10px] text-primary font-bold hover:underline block cursor-pointer"
                    >
                      Run Monte Carlo Risk Exposure Simulation →
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInsightsOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-2 border-t border-border/40"
                >
                  Explore All AI Financial Insights →
                </button>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             6. BOTTOM 3-CARD SECTION: COST CATEGORY, TOP VARIANCES, BUDGET SUMMARY
             ==================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Budget by Cost Category Donut */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Budget by Cost Category
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="93" />
                    <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="131" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="165" />
                    <circle cx="50" cy="50" r="38" stroke="#eab308" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="190" />
                    <circle cx="50" cy="50" r="38" stroke="#1e3a8a" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="218" />
                  </svg>
                </div>
                <div className="space-y-1 text-[10.5px]">
                  {[
                    { name: "Material", val: "₹ 68.00 L (38.86%)", color: "bg-blue-500", wbs: "3.0" },
                    { name: "Labour", val: "₹ 28.00 L (16.00%)", color: "bg-emerald-500", wbs: "2.0" },
                    { name: "Subcontract", val: "₹ 25.00 L (14.29%)", color: "bg-cyan-500", wbs: "5.0" },
                    { name: "Equipment", val: "₹ 18.00 L (10.29%)", color: "bg-amber-500", wbs: "4.0" },
                    { name: "Other Costs", val: "₹ 21.00 L (12.00%)", color: "bg-yellow-500", wbs: "1.0" },
                    { name: "Contingency", val: "₹ 15.00 L (8.57%)", color: "bg-blue-900", wbs: "All" },
                  ].map((cat) => (
                    <div
                      key={cat.name}
                      onClick={() => {
                        if (cat.name === "Contingency") {
                          setIsContingencyOpen(true);
                        } else {
                          setSearchQuery(cat.wbs);
                          toast.info(`Filtered for ${cat.name} category (WBS ${cat.wbs})`);
                        }
                      }}
                      className="flex justify-between items-center p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      title={`Filter by ${cat.name}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <div className={cn("h-2 w-2 rounded-full", cat.color)} /> {cat.name}
                      </span>
                      <span className="font-mono text-muted-foreground font-semibold">{cat.val}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Top Cost Variances (By WBS) */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Top Cost Variances (By WBS)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-[10px] text-muted-foreground font-semibold">
                      <th className="pb-1">WBS</th>
                      <th className="pb-1">Description</th>
                      <th className="pb-1">Variance (₹)</th>
                      <th className="pb-1">Variance %</th>
                      <th className="pb-1 pr-1">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-[11px]">
                    {[
                      { code: "2.0", desc: "Engineering", var: "-₹ 2.80 L", pct: "-15.56%", badge: "Over Budget", color: "text-rose-600" },
                      { code: "3.0", desc: "Procurement", var: "-₹ 1.00 L", pct: "-1.18%", badge: "Over Budget", color: "text-rose-600" },
                      { code: "4.0", desc: "Production", var: "-₹ 1.00 L", pct: "-3.13%", badge: "High Usage", color: "text-rose-600" },
                      { code: "5.0", desc: "Installation", var: "+₹ 1.00 L", pct: "+5.56%", badge: "Monitor", color: "text-emerald-600" },
                    ].map((v) => (
                      <tr
                        key={v.code}
                        onClick={() => {
                          setSearchQuery(v.code);
                          toast.info(`Filtered table for WBS ${v.code} ${v.desc}`);
                        }}
                        className="hover:bg-muted/30 cursor-pointer"
                        title="Click to highlight WBS"
                      >
                        <td className="py-1.5 font-mono font-bold">{v.code}</td>
                        <td className="py-1.5 font-semibold text-slate-800 dark:text-slate-200">{v.desc}</td>
                        <td className={cn("py-1.5 font-mono font-bold", v.color)}>{v.var}</td>
                        <td className={cn("py-1.5 font-mono font-bold", v.color)}>{v.pct}</td>
                        <td className="py-1.5 pr-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[8.5px]",
                              v.badge === "Over Budget"
                                ? "bg-rose-50 text-rose-700 border-rose-300"
                                : "bg-amber-50 text-amber-700 border-amber-300",
                            )}
                          >
                            {v.badge}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={() => setIsVarianceReportOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-2 border-t border-border/40"
                >
                  View Full Variance Report →
                </button>
              </CardContent>
            </Card>

            {/* Card 3: Budget Summary */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Budget Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-2">
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Baseline Date:</span>
                    <span className="font-mono font-semibold">01 Sep 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Forecast Date:</span>
                    <span className="font-mono font-semibold">01 Sep 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Forecast Date:</span>
                    <span className="font-mono font-semibold">15 Oct 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Approval Status:</span>
                    <Badge className="bg-emerald-600 text-white text-[9px]">Approved</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Change Request:</span>
                    <button
                      onClick={() => setIsChangeRequestOpen(true)}
                      className="font-mono font-semibold text-primary hover:underline cursor-pointer"
                    >
                      BCR-003 (28 Aug 2026)
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Budget Locked:</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {isLocked ? (
                        <>
                          <Lock className="h-3 w-3 text-emerald-600" /> Yes
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3 w-3 text-amber-600" /> No
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVersionHistoryOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-2 border-t border-border/40"
                >
                  View Budget Versions →
                </button>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             7. FOOTER STATUS BAR
             ==================================================================== */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-muted-foreground border-t border-border/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Connection
              </span>
              <span>Data Refresh: 01 Sep 2026 10:24 AM</span>
            </div>
          </div>

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Create Project Budget Modal (DRAFT) */}
        <Dialog open={isCreateBudgetOpen} onOpenChange={setIsCreateBudgetOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create Project Budget Baseline
              </DialogTitle>
              <DialogDescription className="text-xs">
                Set approved baseline cost categories and contingency for PRJ-2026-0195.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBudgetSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Project:</label>
                  <Input value="PRJ-2026-0195" readOnly className="h-8 text-xs font-mono bg-muted" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Financial Year:</label>
                  <select className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2">
                    <option>2026-27</option>
                    <option>2027-28</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-2">
                <span className="font-bold uppercase text-[10px] text-muted-foreground block">
                  Budget Heads (in ₹ Lakhs)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Direct Cost:</label>
                    <Input
                      type="number"
                      value={newDirectCost}
                      onChange={(e) => setNewDirectCost(Number(e.target.value))}
                      className="h-8 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Indirect Cost:</label>
                    <Input
                      type="number"
                      value={newIndirectCost}
                      onChange={(e) => setNewIndirectCost(Number(e.target.value))}
                      className="h-8 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1 font-semibold">Contingency:</label>
                    <Input
                      type="number"
                      value={newContingency}
                      onChange={(e) => setNewContingency(Number(e.target.value))}
                      className="h-8 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t font-bold">
                  <span>Total Approved Budget:</span>
                  <span className="font-mono text-primary text-sm">
                    ₹ {(Number(newDirectCost) + Number(newIndirectCost) + Number(newContingency)).toFixed(2)} L
                  </span>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsCreateBudgetOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Save Baseline Draft
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Add Budget Line Item Modal */}
        <Dialog open={isAddLineOpen} onOpenChange={setIsAddLineOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add WBS Budget Line Item
              </DialogTitle>
              <DialogDescription className="text-xs">
                Create an operational expenditure budget head for a project work package.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddLineSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">WBS Code:</label>
                  <Input
                    value={newLineCode}
                    onChange={(e) => setNewLineCode(e.target.value)}
                    className="h-8 text-xs font-mono font-bold"
                    placeholder="e.g. 2.4"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Description:</label>
                  <Input
                    value={newLineDesc}
                    onChange={(e) => setNewLineDesc(e.target.value)}
                    className="h-8 text-xs"
                    placeholder="WBS Element Description"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Budget (₹ Lakhs):</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newLineBudget}
                    onChange={(e) => setNewLineBudget(Number(e.target.value))}
                    className="h-8 text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Committed (₹ Lakhs):</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newLineCommitted}
                    onChange={(e) => setNewLineCommitted(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Actual Cost (₹ Lakhs):</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newLineActual}
                    onChange={(e) => setNewLineActual(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Forecast Cost (₹ Lakhs):</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newLineForecast}
                    onChange={(e) => setNewLineForecast(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAddLineOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Add WBS Line
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 3. Quick Edit WBS Budget Line Modal */}
        <Dialog open={isEditLineOpen} onOpenChange={setIsEditLineOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                Edit WBS Budget: {editingItem?.code}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Adjust allocated budget, committed purchase orders, and actual expenditure.
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <form onSubmit={handleSaveEditLine} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Description:</label>
                  <Input
                    value={editingItem.desc}
                    onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Budget (₹ Lakhs):</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingItem.budget}
                      onChange={(e) => setEditingItem({ ...editingItem, budget: Number(e.target.value) })}
                      className="h-8 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Committed (₹ Lakhs):</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingItem.committed}
                      onChange={(e) => setEditingItem({ ...editingItem, committed: Number(e.target.value) })}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Actual (₹ Lakhs):</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingItem.actual}
                      onChange={(e) => setEditingItem({ ...editingItem, actual: Number(e.target.value) })}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Forecast (₹ Lakhs):</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingItem.forecast}
                      onChange={(e) => setEditingItem({ ...editingItem, forecast: Number(e.target.value) })}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button size="sm" variant="outline" type="button" onClick={() => setIsEditLineOpen(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* 4. Budget Change Request Modal (BCR-004) */}
        <Dialog open={isChangeRequestOpen} onOpenChange={setIsChangeRequestOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                <AlertCircle className="h-4 w-4" />
                Budget Change Request — BCR-004
              </DialogTitle>
              <DialogDescription className="text-xs">
                Request revision to WBS budget allocation with impact analysis and contingency draw.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">WBS Element:</label>
                  <select
                    value={bcrWbs}
                    onChange={(e) => setBcrWbs(e.target.value)}
                    className="h-8 w-full text-xs font-semibold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="2.0 Engineering">2.0 Engineering (₹18 L)</option>
                    <option value="3.0 Procurement">3.0 Procurement (₹85 L)</option>
                    <option value="4.0 Production">4.0 Production (₹32 L)</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Requested Increase:</label>
                  <Input
                    type="number"
                    value={bcrAmount}
                    onChange={(e) => setBcrAmount(Number(e.target.value))}
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground font-medium block mb-1">Reason for Overrun:</label>
                <textarea
                  value={bcrReason}
                  onChange={(e) => setBcrReason(e.target.value)}
                  className="w-full h-16 p-2 rounded-md border border-input text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-1 text-[11px]">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Impact Analysis:</span>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule Impact:</span>
                  <span className="font-bold text-amber-600">+2 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resource Impact:</span>
                  <span className="font-mono font-semibold">+160 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contingency Drawdown:</span>
                  <span className="font-mono font-bold text-rose-600">₹ 15.0 L → ₹ 12.2 L</span>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsChangeRequestOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApproveBcr} className="bg-primary text-white font-semibold">
                Approve & Release Contingency
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. Earned Value Analysis Modal */}
        <Dialog open={isEvaOpen} onOpenChange={setIsEvaOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Calculator className="h-4 w-4 text-purple-600" />
                Earned Value Analysis (EVA)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Comprehensive project performance indices comparing Planned Value, Earned Value, and Actual Cost.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 border rounded-lg">
                <span className="text-muted-foreground text-[10px] block">BAC (Budget at Completion)</span>
                <span className="font-mono font-bold text-sm">₹ 175.0 L</span>
              </div>
              <div className="p-2.5 border rounded-lg">
                <span className="text-muted-foreground text-[10px] block">PV (Planned Value)</span>
                <span className="font-mono font-bold text-sm">₹ 96.0 L</span>
              </div>
              <div className="p-2.5 border rounded-lg">
                <span className="text-muted-foreground text-[10px] block">EV (Earned Value)</span>
                <span className="font-mono font-bold text-sm text-primary">₹ 91.0 L</span>
              </div>
              <div className="p-2.5 border rounded-lg">
                <span className="text-muted-foreground text-[10px] block">AC (Actual Cost)</span>
                <span className="font-mono font-bold text-sm text-amber-600">₹ 82.4 L</span>
              </div>
              <div className="p-2.5 border rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200">
                <span className="text-muted-foreground text-[10px] block">CPI (Cost Performance Index)</span>
                <span className="font-mono font-bold text-sm text-emerald-600">1.10 (Under Budget)</span>
              </div>
              <div className="p-2.5 border rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border-amber-200">
                <span className="text-muted-foreground text-[10px] block">SPI (Schedule Performance Index)</span>
                <span className="font-mono font-bold text-sm text-amber-600">0.95 (Slight Delay)</span>
              </div>
              <div className="p-2.5 border rounded-lg">
                <span className="text-muted-foreground text-[10px] block">EAC (Estimate at Completion)</span>
                <span className="font-mono font-bold text-sm">₹ 159.1 L</span>
              </div>
              <div className="p-2.5 border rounded-lg">
                <span className="text-muted-foreground text-[10px] block">VAC (Variance at Completion)</span>
                <span className="font-mono font-bold text-sm text-emerald-600">+₹ 15.9 L</span>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsEvaOpen(false)}>Close EVA</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. Import Budget Baseline Modal */}
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                Import Budget Baseline
              </DialogTitle>
              <DialogDescription className="text-xs">
                Upload CSV or Excel file containing WBS cost allocations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-2 hover:bg-muted/20 cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <span className="block font-bold text-slate-800 dark:text-slate-200">
                  Drag & Drop CSV / Excel File
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  Columns: <code>WBS Code, Description, Budget, Committed, Actual, Forecast</code>
                </span>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsImportOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsImportOpen(false);
                  toast.success("Imported 7 baseline budget heads from external SAP export.");
                }}
                className="bg-primary text-white font-semibold"
              >
                Import Sample Baseline
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 7. PO Commitments Ledger Modal */}
        <Dialog open={isCommitmentsOpen} onOpenChange={setIsCommitmentsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                <FileText className="h-4 w-4" />
                Committed PO & Subcontract Ledger (₹ 128.50 L)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Active purchase orders and contracts binding project budget.
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y border rounded-lg p-2 text-xs">
              {[
                { po: "PO-2026-0811", vendor: "ABB Power Conversion", wbs: "3.1", desc: "SiC High-Voltage Power Modules", amount: "₹ 48.00 L", status: "Partially Incurred" },
                { po: "PO-2026-0814", vendor: "Lapp India Cables", wbs: "3.2", desc: "DC Fast Charge Liquid-Cooled Cables", amount: "₹ 22.00 L", status: "Issued" },
                { po: "PO-2026-0820", vendor: "Schneider Enclosures", wbs: "4.1", desc: "Weatherproof IP55 Powder Coated Cabinets", amount: "₹ 14.50 L", status: "In Production" },
                { po: "PO-2026-0825", vendor: "Siemens Switchgear", wbs: "5.2", desc: "11kV Breakers & Isolators", amount: "₹ 8.00 L", status: "Pending Delivery" },
                { po: "PO-2026-0830", vendor: "Tata Elxsi", wbs: "2.3", desc: "Firmware Compliance & OCPP Cloud Stack", amount: "₹ 3.00 L", status: "Milestone 1 Met" },
              ].map((row) => (
                <div key={row.po} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary block">{row.po} — {row.vendor}</span>
                    <span className="text-[11px] text-muted-foreground">{row.desc} (WBS {row.wbs})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold block">{row.amount}</span>
                    <Badge variant="outline" className="text-[8px] bg-slate-100 dark:bg-slate-800">{row.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsCommitmentsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 8. Contingency Management Modal */}
        <Dialog open={isContingencyOpen} onOpenChange={setIsContingencyOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-cyan-600">
                <ShieldCheck className="h-4 w-4" />
                Contingency Reserve Management
              </DialogTitle>
              <DialogDescription className="text-xs">
                Contingency drawdowns, pending risks, and remaining reserve balance.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Allocated</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₹ 15.00 L</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Utilized (BCRs)</span>
                  <span className="font-mono font-bold text-rose-600">₹ 6.50 L</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Available</span>
                  <span className="font-mono font-bold text-emerald-600">₹ 8.50 L</span>
                </div>
              </div>
              <div className="space-y-1.5 border rounded-lg p-2.5">
                <span className="font-bold text-muted-foreground text-[10px] uppercase block">Drawdown Log</span>
                <div className="flex justify-between py-1 border-b">
                  <span>BCR-001 (Civil Ground Stabilization):</span>
                  <span className="font-mono font-bold text-rose-600">₹ 2.50 L</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>BCR-002 (Grid Substation Tariff Modification):</span>
                  <span className="font-mono font-bold text-rose-600">₹ 4.00 L</span>
                </div>
                <div className="flex justify-between py-1 text-primary">
                  <span>Pending BCR-004 (Engineering scope adjustment):</span>
                  <span className="font-mono font-bold">₹ 2.80 L</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsContingencyOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 9. All Alerts Register Modal */}
        <Dialog open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                <AlertTriangle className="h-4 w-4" />
                Active Financial Alerts (5 Items)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Real-time monitor of budget variance exceedance and risk thresholds.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              {[
                { text: "Engineering forecast exceeds budget by ₹ 2.80 L (15.56%).", sev: "Critical", color: "text-rose-600" },
                { text: "Procurement commitments exceed 82% of approved budget.", sev: "Critical", color: "text-rose-600" },
                { text: "Production has consumed 81.25% of allocated budget.", sev: "High", color: "text-amber-600" },
                { text: "4 WBS elements are above 70% budget utilization.", sev: "Medium", color: "text-yellow-600" },
                { text: "Contingency balance is ₹ 8.50 L (56.67% remaining).", sev: "Normal", color: "text-emerald-600" },
              ].map((a, i) => (
                <div key={i} className="p-2 border rounded flex items-center justify-between">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{a.text}</span>
                  <Badge variant="outline" className={cn("text-[9px] font-bold shrink-0 ml-2", a.color)}>
                    {a.sev}
                  </Badge>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAlertsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 10. AI Insights Register Modal */}
        <Dialog open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                <Sparkles className="h-4 w-4" />
                AI Financial Predictions & Monte Carlo Simulation
              </DialogTitle>
              <DialogDescription className="text-xs">
                Financial model runs 10,000 project completion iterations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 rounded-lg space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">P-80 Confidence EAC: ₹ 179.40 L</span>
                <p className="text-[11px] text-muted-foreground">
                  With 80% statistical confidence, total project expenditures will not exceed ₹179.40 L, leaving ₹4.10 L in contingency reserve buffer.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsInsightsOpen(false)}>Acknowledge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 11. Cost Variance Ledger Modal */}
        <Dialog open={isVarianceReportOpen} onOpenChange={setIsVarianceReportOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <TrendingUp className="h-4 w-4" />
                Full Project Cost Variance Ledger
              </DialogTitle>
              <DialogDescription className="text-xs">
                WBS breakdown of favorable (+) and unfavorable (-) variances against approved baseline.
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y border rounded-lg p-2 text-xs">
              {wbsBudgets.map((b) => (
                <div key={b.code} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary mr-1.5">{b.code}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{b.desc}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "font-mono font-bold block",
                        b.variance > 0 ? "text-emerald-600" : b.variance < 0 ? "text-rose-600" : "text-slate-500",
                      )}
                    >
                      {b.variance > 0 ? `+₹ ${b.variance.toFixed(2)} L` : `-₹ ${Math.abs(b.variance).toFixed(2)} L`}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {b.variancePct > 0 ? `+${b.variancePct.toFixed(2)}%` : `${b.variancePct.toFixed(2)}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsVarianceReportOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 12. Version History Modal */}
        <Dialog open={isVersionHistoryOpen} onOpenChange={setIsVersionHistoryOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <History className="h-4 w-4 text-blue-600" />
                Budget Baseline Version History
              </DialogTitle>
              <DialogDescription className="text-xs">
                Audit trail of project financial baselines and formal change authorizations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-primary block">V1.0 - Original Baseline</span>
                  <span className="text-[10px] text-muted-foreground">Approved: 01 Sep 2026 • ₹ 175.00 L</span>
                </div>
                <Badge className="bg-emerald-600 text-white text-[9px]">Active</Badge>
              </div>
              <div className="p-2.5 border rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold block">V0.9 - Review Draft</span>
                  <span className="text-[10px] text-muted-foreground">Prepared: 24 Aug 2026 • ₹ 172.50 L</span>
                </div>
                <Badge variant="outline" className="text-[9px]">Superseded</Badge>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsVersionHistoryOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default BudgetControlFormPage;
