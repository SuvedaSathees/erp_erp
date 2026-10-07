import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getFinancialRiskRecordFn, listFinancialRiskRecordsFn } from "@/lib/financialRiskFns.server";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  Calendar,
  Edit2,
  Plus,
  Download,
  Copy,
  FileText,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  Search,
  Filter,
  Eye,
  Sliders,
  DollarSign,
  TrendingDown,
  Building,
  UserCheck,
  Lock,
  Workflow,
  ArrowRight,
  Info,
  Server,
  Zap,
  Check,
  X,
  ExternalLink,
  PieChart as PieIcon,
  BarChart3,
  CreditCard,
  Landmark,
  Scale,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { RiskManagementTabBar } from "@/components/erp/RiskManagementTabBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  financialRiskService,
  PRIMARY_FINANCIAL_RISK,
  TOP_FINANCIAL_RISKS,
  FULL_FINANCIAL_RISKS,
  FINANCIAL_KRIS,
  FINANCIAL_TREATMENT_ACTIONS,
  FINANCIAL_EXPOSURE_TREND,
  FINANCIAL_CATEGORY_DISTRIBUTION,
  FINANCIAL_AI_INSIGHTS,
  FINANCIAL_EXPOSURE_REGISTER,
  FINANCIAL_CONTROLS_MASTER,
  FINANCIAL_STRESS_SCENARIOS,
  FINANCIAL_MAICW_FIELDS,
  FINANCIAL_REPORT_DEFINITIONS,
  type FinancialRiskRecord,
  type FinancialRiskCategory,
} from "@/services/financialRiskService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/risk-management/financial-risk")({
  head: () => ({
    meta: [
      { title: "Financial Risk · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled ERP master and transaction for identifying, quantifying, mitigating, and stress-testing liquidity, credit, market, cost, and funding risks.",
      },
    ],
  }),
  component: FinancialRiskPage,
});

export function FinancialRiskPage() {
  // --- Prisma-backed queries with inline fallback ---
  const { data: dbRecord } = useQuery({
    queryKey: ["financial-risk", "record"],
    queryFn: () => getFinancialRiskRecordFn({ data: {} }),
  });
  const { data: dbList } = useQuery({
    queryKey: ["financial-risk", "list"],
    queryFn: () => listFinancialRiskRecordsFn({ data: {} }),
  });

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [matrixView, setMatrixView] = useState<"Inherent" | "Residual">("Inherent");
  const [activeRisk, setActiveRisk] = useState<FinancialRiskRecord>(PRIMARY_FINANCIAL_RISK);
  const [allRisks, setAllRisks] = useState<FinancialRiskRecord[]>(FULL_FINANCIAL_RISKS);

  useEffect(() => {
    if (dbRecord?.data) setActiveRisk(dbRecord.data);
  }, [dbRecord]);
  useEffect(() => {
    if (dbList?.data) setAllRisks(dbList.data);
  }, [dbList]);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRiskModalOpen, setIsNewRiskModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(FINANCIAL_STRESS_SCENARIOS[0]);

  // Filters for registers
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredRisks = useMemo(() => {
    return allRisks.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.financialProcess.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [allRisks, searchQuery, categoryFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Risk ID",
      "Risk Code",
      "Title",
      "Category",
      "Type",
      "Department",
      "Process",
      "Gross Exposure (Cr)",
      "Potential Loss (Cr)",
      "Owner",
      "Status",
      "Priority",
      "Inherent Score",
      "Residual Score",
    ];
    const rows = filteredRisks.map((r) => [
      r.id,
      r.riskCode,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.type,
      r.department,
      r.financialProcess,
      r.financialExposure,
      r.potentialLoss,
      r.owner,
      r.status,
      r.priority,
      r.inherentScore,
      r.residualScore,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Financial_Risk_Register_${activeRisk.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveRisk = (updated: FinancialRiskRecord) => {
    setActiveRisk(updated);
    setAllRisks((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setIsEditModalOpen(false);
  };

  return (
    <AppShell
      title="Financial Risk"
      breadcrumb="Management > Risk Management > Financial Risk"
      description="Financial exposure tracking, cash runway resilience, forex volatility, and debt covenant monitoring."
      tabs={<RiskManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* =========================================================================
            1. HEADER BANNER - EXACT MATCH TO SCREENSHOT
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground whitespace-nowrap">
                Financial Risk
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-300 font-bold px-2 py-0.5 text-xs">
                Active
              </Badge>
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                {activeRisk.id}
              </span>
              <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                v{activeRisk.version}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Manage Financial Risks. Ensure Stability. Enable Sustainable Growth.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-primary text-primary-foreground text-xs font-semibold shadow-xs shrink-0"
              onClick={() => setIsNewRiskModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              New Risk
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium shrink-0"
              onClick={() => {
                const copy: FinancialRiskRecord = {
                  ...activeRisk,
                  id: `FR-2026-0${allRisks.length + 1}`,
                  title: `${activeRisk.title} (Copy)`,
                  version: "1.0",
                };
                setAllRisks([copy, ...allRisks]);
                setActiveRisk(copy);
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium shrink-0 hidden sm:inline-flex"
              onClick={handleExportCSV}
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs shrink-0">
                  More Actions <MoreVertical className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem className="sm:hidden" onClick={handleExportCSV}>
                  <Download className="h-3.5 w-3.5 mr-2" /> Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Print Dossier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsScenarioModalOpen(true)}>
                  <Activity className="h-3.5 w-3.5 mr-2" /> Run Stress Test
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("reports")}>
                  <PieIcon className="h-3.5 w-3.5 mr-2" /> Generate CFO Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* When drilled down into a specific subview, provide an easy back button */}
        {activeTab !== "overview" && (
          <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border/80 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>Current View:</span>
              <Badge variant="secondary" className="font-bold text-foreground">
                {activeTab.toUpperCase()}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs font-semibold gap-1.5"
              onClick={() => setActiveTab("overview")}
            >
              ← Back to Financial Risk Overview
            </Button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: OVERVIEW - 1:1 REPLICATION OF SCREENSHOT
            ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* ROW 1: 7 EXECUTIVE METRIC CARDS (EXACT SCREENSHOT LAYOUT) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Card 1: Total Financial Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↑ 12%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-rose-300 rounded-t h-1.5" />
                      <span className="w-1 bg-rose-400 rounded-t h-2" />
                      <span className="w-1 bg-rose-500 rounded-t h-2.5" />
                      <span className="w-1 bg-rose-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">52</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Total Financial Risks
                  </div>
                </div>
              </Card>

              {/* Card 2: Critical Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-red-600 block">
                      ↑ 25%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-red-300 rounded-t h-1.5" />
                      <span className="w-1 bg-red-400 rounded-t h-2" />
                      <span className="w-1 bg-red-500 rounded-t h-2.5" />
                      <span className="w-1 bg-red-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">10</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Critical Risks
                  </div>
                </div>
              </Card>

              {/* Card 3: High Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <AlertOctagon className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↓ 6%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-orange-400 rounded-t h-3" />
                      <span className="w-1 bg-orange-400 rounded-t h-2.5" />
                      <span className="w-1 bg-orange-400 rounded-t h-2" />
                      <span className="w-1 bg-orange-500 rounded-t h-1.5" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">18</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    High Risks
                  </div>
                </div>
              </Card>

              {/* Card 4: Medium Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-amber-600 block">
                      → 13%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-amber-400 rounded-t h-2" />
                      <span className="w-1 bg-amber-400 rounded-t h-2" />
                      <span className="w-1 bg-amber-400 rounded-t h-2" />
                      <span className="w-1 bg-amber-400 rounded-t h-2" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">14</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Medium Risks
                  </div>
                </div>
              </Card>

              {/* Card 5: Low Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↓ 20%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-emerald-400 rounded-t h-3" />
                      <span className="w-1 bg-emerald-400 rounded-t h-2" />
                      <span className="w-1 bg-emerald-500 rounded-t h-1.5" />
                      <span className="w-1 bg-emerald-500 rounded-t h-1" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">10</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Low Risks
                  </div>
                </div>
              </Card>

              {/* Card 6: Total Exposure */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↑ 18%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-blue-300 rounded-t h-1.5" />
                      <span className="w-1 bg-blue-400 rounded-t h-2" />
                      <span className="w-1 bg-blue-500 rounded-t h-2.5" />
                      <span className="w-1 bg-blue-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">₹ 48.5 Cr</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Total Exposure
                  </div>
                </div>
              </Card>

              {/* Card 7: Potential Loss */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↓ 8%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-purple-400 rounded-t h-3" />
                      <span className="w-1 bg-purple-400 rounded-t h-2.5" />
                      <span className="w-1 bg-purple-500 rounded-t h-2" />
                      <span className="w-1 bg-purple-600 rounded-t h-1.5" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">₹ 12.3 Cr</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Potential Loss
                  </div>
                </div>
              </Card>
            </div>

            {/* ROW 2: FINANCIAL RISK DETAILS, RISK STATEMENT, RISK HEAT MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (5 cols on xl, full width on lg): Financial Risk Details */}
              <Card className="lg:col-span-12 xl:col-span-5 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Financial Risk Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-primary gap-1 px-2"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </Button>
                </div>

                <div className="space-y-2.5 text-xs py-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Risk Title <span className="text-red-500">*</span>
                    </label>
                    <div className="font-semibold text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40">
                      {activeRisk.title}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Risk Category <span className="text-red-500">*</span>
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 flex items-center justify-between">
                        <span>{activeRisk.category}</span>
                        <span className="text-[10px] text-muted-foreground">▾</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Risk Type <span className="text-red-500">*</span>
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 flex items-center justify-between">
                        <span>{activeRisk.type}</span>
                        <span className="text-[10px] text-muted-foreground">▾</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Business Function
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40">
                        {activeRisk.businessFunction}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Department
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.department}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Financial Process
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.financialProcess}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Business Unit
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.businessUnit}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Cost Center
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40">
                        {activeRisk.costCenter ?? "FIN-001"}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Project
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.project ?? "Charging Stations"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1 border-t border-border/40">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Risk Owner
                      </label>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                          {activeRisk.ownerAvatar ?? "AK"}
                        </span>
                        <span className="font-semibold text-foreground truncate">
                          {activeRisk.owner}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Finance Coordinator
                      </label>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-5 w-5 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                          {activeRisk.coordinatorAvatar ?? "PS"}
                        </span>
                        <span className="font-semibold text-foreground truncate">
                          {activeRisk.coordinator ?? "Priya S."}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Priority
                      </label>
                      <div className="mt-0.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-200">
                          ↑ {activeRisk.priority}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Status
                      </label>
                      <div className="mt-0.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-200">
                          ● {activeRisk.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Currency
                      </label>
                      <div className="font-medium text-foreground mt-0.5">
                        {activeRisk.currency}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Identification Date
                      </label>
                      <div className="font-medium text-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {activeRisk.identificationDate}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Review Date
                      </label>
                      <div className="font-medium text-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {activeRisk.reviewDate}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Center Column (3 cols on xl, 6 cols on lg): Risk Statement & Potential Financial Impact */}
              <div className="lg:col-span-6 xl:col-span-3 space-y-3 flex flex-col justify-between">
                {/* Statement Card */}
                <Card className="p-3.5 border-border/80 shadow-2xs bg-card flex-1">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-border/40">
                    <span className="text-base text-primary font-serif">“</span>
                    <h3 className="text-sm font-bold text-foreground">Risk Statement</h3>
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-2 leading-relaxed">
                    “{activeRisk.statement}”
                  </p>
                </Card>

                {/* Potential Financial Impact 2x2 Grid */}
                <Card className="p-3.5 border-border/80 shadow-2xs bg-card">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border/40">
                    Potential Financial Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {/* Impact 1: Potential Loss */}
                    <div className="p-2.5 rounded-lg border border-red-200 bg-red-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-red-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        ₹
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-foreground">
                          {activeRisk.impacts.potentialLossValue}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-semibold">
                          Potential Loss
                        </div>
                      </div>
                    </div>

                    {/* Impact 2: Revenue Impact */}
                    <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-blue-500 text-white flex items-center justify-center shrink-0">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">
                          Revenue Impact
                        </div>
                        <div className="text-xs font-extrabold text-red-600">
                          {activeRisk.impacts.revenueImpact}
                        </div>
                      </div>
                    </div>

                    {/* Impact 3: Cash Flow Impact */}
                    <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">
                          Cash Flow Impact
                        </div>
                        <div className="text-xs font-extrabold text-red-600">
                          {activeRisk.impacts.cashFlowImpact}
                        </div>
                      </div>
                    </div>

                    {/* Impact 4: Supplier Impact */}
                    <div className="p-2.5 rounded-lg border border-orange-200 bg-orange-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-orange-500 text-white flex items-center justify-center shrink-0">
                        <Building className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">
                          Supplier Impact
                        </div>
                        <div className="text-xs font-extrabold text-amber-600">
                          {activeRisk.impacts.supplierImpact}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column (4 cols on xl, 6 cols on lg): Financial Risk Heat Map */}
              <Card className="lg:col-span-6 xl:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Financial Risk Heat Map</h3>
                  <div className="flex items-center gap-1">
                    <select
                      value={matrixView}
                      onChange={(e) => setMatrixView(e.target.value as any)}
                      className="text-[11px] font-semibold bg-muted border border-border rounded px-1.5 py-0.5"
                    >
                      <option value="Inherent">Inherent Risk</option>
                      <option value="Residual">Residual Risk</option>
                    </select>
                  </div>
                </div>

                {/* 5x5 Matrix Plot */}
                <div className="py-2">
                  <div className="flex items-center">
                    {/* Y-axis label */}
                    <div className="w-5 text-[9px] font-bold text-muted-foreground -rotate-90 text-center tracking-wider">
                      LIKELIHOOD
                    </div>

                    {/* Heat Map Grid */}
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((lik) => {
                        const yLabels: Record<number, string> = {
                          5: "Almost Certain",
                          4: "Likely",
                          3: "Possible",
                          2: "Unlikely",
                          1: "Rare",
                        };
                        return (
                          <div key={lik} className="flex items-center gap-1">
                            <span className="w-16 text-[9px] text-right font-medium text-muted-foreground pr-1 truncate">
                              {lik} {yLabels[lik]}
                            </span>
                            <div className="grid grid-cols-5 gap-1 flex-1">
                              {[1, 2, 3, 4, 5].map((imp) => {
                                const score = lik * imp;
                                let bg = "bg-emerald-500";
                                if (score >= 5 && score <= 9) bg = "bg-amber-400";
                                else if (score >= 10 && score <= 16) bg = "bg-orange-500";
                                else if (score >= 17) bg = "bg-red-500";

                                // Check plotted bubble (Screenshot has '1' at 5,5 / '3' at 4,5 / '2' at 3,4 / '4' at 2,3 / '5' at 1,1)
                                const isBubble1 = lik === 5 && imp === 5;
                                const isBubble3 = lik === 4 && imp === 5;
                                const isBubble2 = lik === 3 && imp === 4;
                                const isBubble4 = lik === 2 && imp === 3;
                                const isBubble5 = lik === 1 && imp === 1;

                                return (
                                  <div
                                    key={imp}
                                    title={`Likelihood ${lik} × Impact ${imp} = ${score}`}
                                    className={cn(
                                      "h-6 rounded flex items-center justify-center text-[10px] font-bold text-white transition-transform hover:scale-105 cursor-pointer relative",
                                      bg,
                                    )}
                                  >
                                    {isBubble1 && (
                                      <span className="h-4 w-4 rounded-full bg-white text-red-600 font-extrabold text-[9px] flex items-center justify-center shadow-xs">
                                        1
                                      </span>
                                    )}
                                    {isBubble3 && (
                                      <span className="h-4 w-4 rounded-full bg-white text-red-600 font-extrabold text-[9px] flex items-center justify-center shadow-xs">
                                        3
                                      </span>
                                    )}
                                    {isBubble2 && (
                                      <span className="h-4 w-4 rounded-full bg-white text-orange-600 font-extrabold text-[9px] flex items-center justify-center shadow-xs">
                                        2
                                      </span>
                                    )}
                                    {isBubble4 && (
                                      <span className="h-4 w-4 rounded-full bg-white text-amber-700 font-extrabold text-[9px] flex items-center justify-center shadow-xs">
                                        4
                                      </span>
                                    )}
                                    {isBubble5 && (
                                      <span className="h-4 w-4 rounded-full bg-white text-emerald-700 font-extrabold text-[9px] flex items-center justify-center shadow-xs">
                                        5
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {/* X-axis labels */}
                      <div className="flex items-center gap-1 pt-1">
                        <span className="w-16"></span>
                        <div className="grid grid-cols-5 gap-1 flex-1 text-center text-[9px] font-semibold text-muted-foreground">
                          <div>1 · Negl</div>
                          <div>2 · Minor</div>
                          <div>3 · Mod</div>
                          <div>4 · Major</div>
                          <div>5 · Crit</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-[9px] font-bold text-muted-foreground tracking-wider mt-1">
                    IMPACT
                  </div>
                </div>

                {/* Heat Map Legend */}
                <div className="flex items-center justify-between text-[9px] font-semibold text-muted-foreground pt-1.5 border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded bg-emerald-500" /> Low (1–4)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded bg-amber-400" /> Moderate (5–9)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded bg-orange-500" /> High (10–16)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded bg-red-500" /> Critical (17–25)
                  </span>
                </div>
              </Card>
            </div>

            {/* ROW 3: EXPOSURE TREND, RISK BY CATEGORY, KEY RISK INDICATORS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (4 cols): Exposure Trend (₹ Cr) */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Exposure Trend (₹ Cr)</h3>
                  <div className="flex items-center gap-2 text-[10px] font-medium">
                    <span className="flex items-center gap-1 text-blue-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Total
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Loss
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Mitigated
                    </span>
                  </div>
                </div>

                <div className="h-52 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={FINANCIAL_EXPOSURE_TREND}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 60]} tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "11px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="totalExposure"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Total Exposure"
                      />
                      <Line
                        type="monotone"
                        dataKey="potentialLoss"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Potential Loss"
                      />
                      <Line
                        type="monotone"
                        dataKey="recoveredMitigated"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Recovered / Mitigated"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Center Column (4 cols): Risk by Category Donut */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk by Category</h3>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    10 Categories
                  </Badge>
                </div>

                <div className="grid grid-cols-12 items-center gap-2 py-1">
                  <div className="col-span-5 h-44 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={FINANCIAL_CATEGORY_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="count"
                        >
                          {FINANCIAL_CATEGORY_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-base font-black text-foreground">52</span>
                      <span className="text-[9px] font-bold text-muted-foreground">Total Risks</span>
                    </div>
                  </div>

                  <div className="col-span-7 space-y-1 text-[10px] pl-1 max-h-48 overflow-y-auto no-scrollbar">
                    {FINANCIAL_CATEGORY_DISTRIBUTION.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-medium text-foreground truncate">{cat.name}</span>
                        </div>
                        <div className="font-mono text-muted-foreground shrink-0">
                          {cat.percentage}% ({cat.count})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Right Column (4 cols): Key Risk Indicators (KRI) */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Key Risk Indicators (KRI)</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] text-primary px-1.5"
                    onClick={() => setActiveTab("kri")}
                  >
                    View All
                  </Button>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/30">
                      <tr>
                        <th className="p-1.5">KRI Name</th>
                        <th className="p-1.5 text-center">Current</th>
                        <th className="p-1.5 text-center">Threshold</th>
                        <th className="p-1.5 text-center">Status</th>
                        <th className="p-1.5 text-center">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-[11px]">
                      {FINANCIAL_KRIS.map((kri) => (
                        <tr key={kri.id} className="hover:bg-muted/30">
                          <td className="p-1.5 font-semibold text-foreground truncate max-w-[120px]">
                            {kri.name}
                          </td>
                          <td className="p-1.5 text-center font-mono font-bold text-foreground">
                            {kri.current}
                          </td>
                          <td className="p-1.5 text-center font-mono text-muted-foreground text-[10px]">
                            {kri.threshold}
                          </td>
                          <td className="p-1.5 text-center">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
                                kri.status === "Red"
                                  ? "bg-red-500/10 text-red-600"
                                  : kri.status === "Amber"
                                    ? "bg-amber-500/10 text-amber-700"
                                    : "bg-emerald-500/10 text-emerald-600",
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  kri.status === "Red"
                                    ? "bg-red-500"
                                    : kri.status === "Amber"
                                      ? "bg-amber-500"
                                      : "bg-emerald-500",
                                )}
                              />
                              {kri.status}
                            </span>
                          </td>
                          <td className="p-1.5 text-center font-bold">
                            <span
                              className={cn(
                                kri.trend === "up" && "text-red-500",
                                kri.trend === "down" && "text-emerald-500",
                                kri.trend === "neutral" && "text-slate-400",
                              )}
                            >
                              {kri.trend === "up" ? "↑" : kri.trend === "down" ? "↓" : "→"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* ROW 4: TOP FINANCIAL RISKS, RISK TREATMENT ACTIONS, AI FINANCIAL RISK INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (4 cols): Top Financial Risks */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Top Financial Risks</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] text-primary px-1.5"
                    onClick={() => setActiveTab("details")}
                  >
                    View All
                  </Button>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/30">
                      <tr>
                        <th className="p-1.5">ID</th>
                        <th className="p-1.5">Risk Title</th>
                        <th className="p-1.5">Category</th>
                        <th className="p-1.5 text-center">Inh</th>
                        <th className="p-1.5 text-center">Res</th>
                        <th className="p-1.5 text-center">Trend</th>
                        <th className="p-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-[11px]">
                      {TOP_FINANCIAL_RISKS.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/30">
                          <td className="p-1.5 font-mono font-bold text-primary">{r.id}</td>
                          <td className="p-1.5 font-semibold text-foreground truncate max-w-[110px]">
                            {r.title}
                          </td>
                          <td className="p-1.5 text-muted-foreground">{r.category}</td>
                          <td className="p-1.5 text-center font-mono font-bold text-red-600 bg-red-500/5">
                            {r.inherent}
                          </td>
                          <td className="p-1.5 text-center font-mono font-bold text-amber-600 bg-amber-500/5">
                            {r.residual}
                          </td>
                          <td className="p-1.5 text-center font-bold">
                            <span
                              className={cn(
                                r.trendColor === "red" && "text-red-500",
                                r.trendColor === "green" && "text-emerald-500",
                                r.trendColor === "slate" && "text-slate-400",
                              )}
                            >
                              {r.trend === "up" ? "↑" : r.trend === "down" ? "↓" : "→"}
                            </span>
                          </td>
                          <td className="p-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[9px] font-bold",
                                r.status === "Monitoring"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-red-500/10 text-red-600",
                              )}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Center Column (4 cols): Risk Treatment Actions */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk Treatment Actions</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] text-primary px-1.5"
                    onClick={() => setActiveTab("treatment")}
                  >
                    View All
                  </Button>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/30">
                      <tr>
                        <th className="p-1.5">Action</th>
                        <th className="p-1.5">Owner</th>
                        <th className="p-1.5">Due Date</th>
                        <th className="p-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-[11px]">
                      {FINANCIAL_TREATMENT_ACTIONS.map((act) => (
                        <tr key={act.id} className="hover:bg-muted/30">
                          <td className="p-1.5 font-semibold text-foreground truncate max-w-[130px]">
                            {act.action}
                          </td>
                          <td className="p-1.5 text-muted-foreground truncate">{act.owner}</td>
                          <td className="p-1.5 font-mono text-[10px] text-muted-foreground">
                            {act.dueDate}
                          </td>
                          <td className="p-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap",
                                act.status === "In Progress"
                                  ? "bg-blue-500/10 text-blue-600"
                                  : act.status === "Open"
                                    ? "bg-red-500/10 text-red-600"
                                    : "bg-slate-500/10 text-slate-600",
                              )}
                            >
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Right Column (4 cols): AI Financial Risk Insights */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-foreground">
                      AI Financial Risk Insights
                    </h3>
                  </div>
                  <Badge className="bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5">
                    AI Powered
                  </Badge>
                </div>

                {/* 6 AI Bullet Points matching screenshot */}
                <div className="space-y-1.5 py-1 text-xs">
                  {FINANCIAL_AI_INSIGHTS.map((item) => (
                    <div key={item.num} className="flex items-start gap-2">
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5",
                          item.color,
                        )}
                      >
                        {item.num}
                      </span>
                      <p className="text-[11px] text-foreground font-medium leading-tight">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 4 Quick Actions at the bottom */}
                <div className="grid grid-cols-4 gap-1 pt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 flex flex-col items-center justify-center gap-0.5 leading-none"
                    onClick={() => setIsScenarioModalOpen(true)}
                  >
                    <Activity className="h-3 w-3 text-primary" />
                    <span>Run Scenario</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 flex flex-col items-center justify-center gap-0.5 leading-none"
                    onClick={() => setActiveTab("scenarios")}
                  >
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <span>Forecast</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 flex flex-col items-center justify-center gap-0.5 leading-none"
                    onClick={() => setActiveTab("exposure")}
                  >
                    <DollarSign className="h-3 w-3 text-primary" />
                    <span>Cash Flow</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 flex flex-col items-center justify-center gap-0.5 leading-none"
                    onClick={handleExportCSV}
                  >
                    <Download className="h-3 w-3 text-primary" />
                    <span>Download</span>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: RISK DETAILS - FULL FORM & MAICW METADATA
            ========================================================================= */}
        {activeTab === "details" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Financial Risk Master Register & Transaction Details
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Controlled ERP master data mapped to General Ledger accounts, Cost Centers, and Financial Processes.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit2 className="h-3 w-3" /> Edit Master Record
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-lg border border-border/50 bg-muted/20">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Risk ID & Controlled Code
                    </span>
                    <div className="font-mono text-sm font-bold text-primary mt-1">
                      {activeRisk.id} / {activeRisk.riskCode}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Auto-generated controlled master
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/50 bg-muted/20">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Accountable Owner & Unit
                    </span>
                    <div className="font-semibold text-foreground text-sm mt-1">
                      {activeRisk.owner}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {activeRisk.department} • {activeRisk.businessUnit}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/50 bg-muted/20">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Gross Exposure & Loss
                    </span>
                    <div className="font-mono text-sm font-bold text-foreground mt-1">
                      ₹ {activeRisk.financialExposure} Cr (Gross)
                    </div>
                    <div className="text-[11px] text-red-600 font-semibold mt-0.5">
                      Estimated Loss: ₹ {activeRisk.potentialLoss} Cr
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/50 bg-muted/20">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Inherent vs Residual Score
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-red-500 text-white font-mono font-bold">
                        Inherent: {activeRisk.inherentScore}
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge className="bg-amber-500 text-white font-mono font-bold">
                        Residual: {activeRisk.residualScore}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Control Effectiveness: {activeRisk.controlEffectiveness}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/60 bg-card space-y-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Core Financial Cause & Impact Chain
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded border border-border/40 bg-muted/10">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                        Root Cause
                      </span>
                      <p className="font-medium text-foreground mt-1">{activeRisk.cause}</p>
                    </div>
                    <div className="p-3 rounded border border-border/40 bg-muted/10">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                        Financial Event
                      </span>
                      <p className="font-medium text-foreground mt-1">{activeRisk.event}</p>
                    </div>
                    <div className="p-3 rounded border border-border/40 bg-muted/10">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                        Business & Supply Impact
                      </span>
                      <p className="font-medium text-foreground mt-1">
                        {activeRisk.businessImpactSummary}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 3: FINANCIAL EXPOSURE (SECTION 5)
            ========================================================================= */}
        {activeTab === "exposure" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Financial Exposure Master Register (Section 5)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Quantified exposure across Receivables, Payables, Debt, FX, Interest, Cash, and Tax liabilities.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleExportCSV}>
                    <Download className="h-3 w-3 mr-1" /> Export Register
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Exposure ID</th>
                      <th className="p-3">Exposure Type</th>
                      <th className="p-3">Related GL Account</th>
                      <th className="p-3">Counterparty</th>
                      <th className="p-3 text-right">Gross (₹ Cr)</th>
                      <th className="p-3 text-right">Current Value (Cr)</th>
                      <th className="p-3 text-right">Potential Loss (Cr)</th>
                      <th className="p-3">Maturity Date</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINANCIAL_EXPOSURE_REGISTER.map((exp) => (
                      <tr key={exp.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{exp.id}</td>
                        <td className="p-3 font-semibold text-foreground">{exp.type}</td>
                        <td className="p-3 font-mono text-muted-foreground">{exp.account}</td>
                        <td className="p-3 font-medium text-foreground">{exp.counterparty}</td>
                        <td className="p-3 text-right font-mono font-bold text-foreground">
                          ₹ {exp.grossExposure}
                        </td>
                        <td className="p-3 text-right font-mono text-muted-foreground">
                          ₹ {exp.currentValue}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-red-600">
                          ₹ {exp.potentialLoss}
                        </td>
                        <td className="p-3 font-mono text-muted-foreground">{exp.maturityDate}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-[10px] font-bold bg-blue-500/10 text-blue-600 border-blue-200">
                            {exp.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 4: RISK ASSESSMENT (SECTIONS 29, 30, 31)
            ========================================================================= */}
        {activeTab === "assessment" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inherent Assessment */}
              <Card className="p-4 border-border/80 shadow-2xs">
                <CardHeader className="p-0 pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Inherent Financial Risk Assessment (Section 29)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Exposure before existing controls and hedging mitigation.
                  </CardDescription>
                </CardHeader>
                <div className="space-y-3 pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Likelihood (1–5):</span>
                    <span className="font-bold text-foreground">{activeRisk.likelihood} / 5 (Likely)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Financial Impact (1–5):</span>
                    <span className="font-bold text-foreground">{activeRisk.impact} / 5 (Severe)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <span className="font-bold text-foreground">Inherent Score (L × I):</span>
                    <Badge className="bg-red-500 text-white font-mono text-sm px-2 py-0.5">
                      {activeRisk.inherentScore} / 25 ({activeRisk.inherentLevel})
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Residual Assessment */}
              <Card className="p-4 border-border/80 shadow-2xs">
                <CardHeader className="p-0 pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Residual Financial Risk Assessment (Section 31)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Exposure remaining after financial controls, insurance, and treatment.
                  </CardDescription>
                </CardHeader>
                <div className="space-y-3 pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Residual Likelihood (1–5):</span>
                    <span className="font-bold text-foreground">{activeRisk.residualLikelihood} / 5 (Possible)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Residual Impact (1–5):</span>
                    <span className="font-bold text-foreground">{activeRisk.residualImpact} / 5 (Major)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <span className="font-bold text-foreground">Residual Score:</span>
                    <Badge className="bg-amber-500 text-white font-mono text-sm px-2 py-0.5">
                      {activeRisk.residualScore} / 25 ({activeRisk.residualLevel})
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: CONTROLS (SECTIONS 27 & 28)
            ========================================================================= */}
        {activeTab === "controls" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Financial Internal Controls & Fraud Prevention (Sections 27 & 28)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Maker-checker authorization, automated three-way matching, bank reconciliation, and credit governance.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Control ID</th>
                      <th className="p-3">Control Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Nature</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3 text-center">Design</th>
                      <th className="p-3 text-center">Operating</th>
                      <th className="p-3 text-right">Audit Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINANCIAL_CONTROLS_MASTER.map((ctl) => (
                      <tr key={ctl.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{ctl.id}</td>
                        <td className="p-3 font-semibold text-foreground">{ctl.controlName}</td>
                        <td className="p-3">{ctl.type}</td>
                        <td className="p-3">{ctl.nature}</td>
                        <td className="p-3 text-muted-foreground">{ctl.frequency}</td>
                        <td className="p-3 font-medium text-foreground">{ctl.owner}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                            {ctl.designEffectiveness}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              ctl.operatingEffectiveness === "Effective"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-700",
                            )}
                          >
                            {ctl.operatingEffectiveness}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              ctl.result === "Pass"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-red-500/10 text-red-600",
                            )}
                          >
                            {ctl.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 6: TREATMENT & ACTIONS (SECTIONS 32 & 33)
            ========================================================================= */}
        {activeTab === "treatment" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Financial Risk Treatment Action Plan (Section 33)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Mitigation workflows: Identified → Assigned → In Progress → Evidence Verified → Closed.
                  </CardDescription>
                </div>
                <Button size="sm" className="h-8 text-xs gap-1">
                  <Plus className="h-3 w-3" /> New Action
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Action ID</th>
                      <th className="p-3">Action Description</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Budget</th>
                      <th className="p-3">Evidence Submitted</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINANCIAL_TREATMENT_ACTIONS.map((act) => (
                      <tr key={act.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{act.id}</td>
                        <td className="p-3 font-medium text-foreground">{act.action}</td>
                        <td className="p-3 text-muted-foreground">{act.category}</td>
                        <td className="p-3 font-semibold text-foreground">{act.owner}</td>
                        <td className="p-3 font-mono text-muted-foreground">{act.dueDate}</td>
                        <td className="p-3 font-mono font-bold text-foreground">{act.budget}</td>
                        <td className="p-3 text-[11px] text-muted-foreground max-w-[200px] truncate" title={act.evidence}>
                          {act.evidence}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              act.status === "In Progress"
                                ? "bg-blue-500/10 text-blue-600"
                                : act.status === "Open"
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-slate-500/10 text-slate-600",
                            )}
                          >
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 7: KRI MONITORING (SECTIONS 34 & 35)
            ========================================================================= */}
        {activeTab === "kri" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Financial Key Risk Indicators & Early Warning Alerts (Sections 34 & 35)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Continuous monitoring of liquidity runway, credit aging, debt coverage, and margin ratios.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">KRI ID</th>
                      <th className="p-3">Indicator Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Current Value</th>
                      <th className="p-3">Threshold Limit</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Data Source</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINANCIAL_KRIS.map((kri) => (
                      <tr key={kri.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{kri.id}</td>
                        <td className="p-3 font-semibold text-foreground">{kri.name}</td>
                        <td className="p-3 text-muted-foreground">{kri.category}</td>
                        <td className="p-3 font-mono font-bold text-foreground">{kri.current}</td>
                        <td className="p-3 font-mono text-muted-foreground">{kri.threshold}</td>
                        <td className="p-3 font-medium text-foreground">{kri.owner}</td>
                        <td className="p-3 text-muted-foreground text-[11px]">{kri.dataSource}</td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              kri.status === "Red"
                                ? "bg-red-500/10 text-red-600 border border-red-200"
                                : kri.status === "Amber"
                                  ? "bg-amber-500/10 text-amber-700 border border-amber-200"
                                  : "bg-emerald-500/10 text-emerald-600 border border-emerald-200",
                            )}
                          >
                            ● {kri.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 8: SCENARIO ANALYSIS & STRESS TESTING (SECTIONS 36 & 37)
            ========================================================================= */}
        {activeTab === "scenarios" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Macroeconomic Stress Testing & Scenario Simulations (Sections 36 & 37)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Multi-variable sensitivity analysis: Revenue shocks, FX depreciation, customer defaults, and rate hikes.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => setIsScenarioModalOpen(true)}
                >
                  <Activity className="h-3.5 w-3.5" /> Run Stress Simulation
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FINANCIAL_STRESS_SCENARIOS.map((scn) => (
                    <div
                      key={scn.id}
                      className="p-4 rounded-xl border border-border/70 bg-card space-y-3 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">{scn.id}</span>
                        <Badge
                          className={cn(
                            "text-[10px] font-bold",
                            scn.covenantStatus === "Safe"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : scn.covenantStatus === "Approaching Limit"
                                ? "bg-amber-500/10 text-amber-700"
                                : "bg-red-500/10 text-red-600",
                          )}
                        >
                          Covenant: {scn.covenantStatus}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">{scn.name}</h4>
                      <p className="text-xs text-muted-foreground italic">“{scn.assumptions}”</p>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/40">
                        <div className="p-2 rounded bg-muted/30">
                          <span className="text-[10px] font-bold text-muted-foreground block">
                            Revenue Impact
                          </span>
                          <span className="font-mono font-bold text-red-600">{scn.revenueImpact}</span>
                        </div>
                        <div className="p-2 rounded bg-muted/30">
                          <span className="text-[10px] font-bold text-muted-foreground block">
                            Net Cash Burn
                          </span>
                          <span className="font-mono font-bold text-red-600">{scn.cashImpact}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-muted/20 border border-border/30 text-xs">
                        <span className="text-[10px] font-bold text-primary block uppercase tracking-wider">
                          Contingency Recovery Plan:
                        </span>
                        <p className="text-[11px] text-foreground mt-0.5">{scn.recoveryPlan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 9: REPORTS (SECTION 47)
            ========================================================================= */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Financial Risk Controlled Reports Suite (Section 47)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Controlled audit registers, cash runway analyses, credit matrices, and CFO dossiers.
                  </CardDescription>
                </div>
                <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => window.print()}>
                  <Download className="h-3.5 w-3.5" /> Print Dossier
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {FINANCIAL_REPORT_DEFINITIONS.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-lg border border-border/60 hover:border-primary/50 transition-all bg-card flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-primary">{r.id}</span>
                          <Badge variant="outline" className="text-[9px]">
                            {r.category}
                          </Badge>
                        </div>
                        <div className="text-xs font-bold text-foreground mt-1.5">{r.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
                          {r.desc}
                        </div>
                      </div>
                      <div className="pt-2 mt-3 border-t border-border/30 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] text-primary gap-1 px-1.5 hover:bg-primary/10"
                          onClick={handleExportCSV}
                        >
                          Generate <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 10: HISTORY & MAICW CLASSIFICATION (SECTIONS 1, 45, 50)
            ========================================================================= */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Financial Risk Form — MAICW Classification Master (Section 1)
                </CardTitle>
                <CardDescription className="text-xs">
                  Controlled ERP field attributes: Mandatory (M), Automated (A), Input (I), Controlled (C), Workflow (W).
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Field Name</th>
                      <th className="p-3">Data Type</th>
                      <th className="p-3 text-center">MAICW</th>
                      <th className="p-3">Classification & ERP Control Rule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINANCIAL_MAICW_FIELDS.map((f) => (
                      <tr key={f.field} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-semibold text-foreground">{f.field}</td>
                        <td className="p-3 font-mono text-muted-foreground">{f.type}</td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-black font-mono",
                              f.maicw === "M"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-200"
                                : f.maicw === "A"
                                  ? "bg-purple-500/10 text-purple-600 border border-purple-200"
                                  : f.maicw === "W"
                                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-200"
                                    : "bg-amber-500/10 text-amber-600 border border-amber-200",
                            )}
                          >
                            {f.maicw}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="p-4 border-border/80 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Financial Risk Approval & Escalation Governance (Section 45):
              </h4>
              <div className="flex items-center justify-between text-xs font-semibold gap-2 overflow-x-auto py-2">
                <span className="p-2 rounded bg-muted">Risk Identified</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-muted">Risk Owner (Finance)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-amber-500/10 text-amber-700">Finance Head / Controller</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-purple-500/10 text-purple-700">CFO / CXO</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-rose-500/10 text-rose-700">Risk Committee / Board</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: EDIT FINANCIAL RISK
          ========================================================================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Edit Financial Risk: {activeRisk.id}</DialogTitle>
            <DialogDescription className="text-xs">
              Update controlled master information for this financial risk record.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Risk Title *</label>
              <Input
                value={activeRisk.title}
                onChange={(e) => setActiveRisk({ ...activeRisk, title: e.target.value })}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Category</label>
                <Input
                  value={activeRisk.category}
                  onChange={(e) => setActiveRisk({ ...activeRisk, category: e.target.value as any })}
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Priority</label>
                <Input
                  value={activeRisk.priority}
                  onChange={(e) => setActiveRisk({ ...activeRisk, priority: e.target.value as any })}
                  className="h-8 text-xs mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Risk Statement</label>
              <Input
                value={activeRisk.statement}
                onChange={(e) => setActiveRisk({ ...activeRisk, statement: e.target.value })}
                className="h-8 text-xs mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Gross Exposure (₹ Cr)</label>
                <Input
                  type="number"
                  value={activeRisk.financialExposure}
                  onChange={(e) => setActiveRisk({ ...activeRisk, financialExposure: parseFloat(e.target.value) || 0 })}
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Potential Loss (₹ Cr)</label>
                <Input
                  type="number"
                  value={activeRisk.potentialLoss}
                  onChange={(e) => setActiveRisk({ ...activeRisk, potentialLoss: parseFloat(e.target.value) || 0 })}
                  className="h-8 text-xs mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => handleSaveRisk(activeRisk)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL: NEW FINANCIAL RISK
          ========================================================================= */}
      <Dialog open={isNewRiskModalOpen} onOpenChange={setIsNewRiskModalOpen}>
        <DialogContent className="max-w-md text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Register New Financial Risk</DialogTitle>
            <DialogDescription className="text-xs">
              Catalog a newly identified financial, liquidity, credit, or market risk.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Risk Title *</label>
              <Input id="new-risk-title" placeholder="e.g. Commodity price spike on aluminum housings" className="h-8 text-xs mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Category</label>
                <Input id="new-risk-category" defaultValue="Market Risk" className="h-8 text-xs mt-1" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Priority</label>
                <Input id="new-risk-priority" defaultValue="High" className="h-8 text-xs mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsNewRiskModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const titleInput = (document.getElementById("new-risk-title") as HTMLInputElement)?.value;
                if (!titleInput) return;
                const newRecord: FinancialRiskRecord = {
                  ...PRIMARY_FINANCIAL_RISK,
                  id: `FR-2026-0${allRisks.length + 1}`,
                  riskCode: `RK-FIN-GEN-0${allRisks.length + 1}`,
                  title: titleInput,
                  status: "Under Assessment",
                  version: "1.0",
                };
                setAllRisks([newRecord, ...allRisks]);
                setActiveRisk(newRecord);
                setIsNewRiskModalOpen(false);
              }}
            >
              Register Risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL: RUN SCENARIO STRESS TEST
          ========================================================================= */}
      <Dialog open={isScenarioModalOpen} onOpenChange={setIsScenarioModalOpen}>
        <DialogContent className="max-w-lg text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Execute Financial Stress Test Simulation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Simulate cash flow, covenant limits, and working capital buffers under extreme operational shocks.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Select Simulation Scenario</label>
              <select
                className="w-full text-xs p-2 rounded border border-border bg-card font-medium mt-1"
                onChange={(e) => {
                  const scn = FINANCIAL_STRESS_SCENARIOS.find((s) => s.id === e.target.value);
                  if (scn) setSelectedScenario(scn);
                }}
              >
                {FINANCIAL_STRESS_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}: {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Scenario Impact Summary:</span>
                <Badge
                  className={cn(
                    "text-[10px]",
                    selectedScenario.covenantStatus === "Safe"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-red-500/10 text-red-600",
                  )}
                >
                  {selectedScenario.covenantStatus}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold">Revenue Shock:</span>
                  <p className="font-mono font-bold text-red-600">{selectedScenario.revenueImpact}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold">Cash Impact:</span>
                  <p className="font-mono font-bold text-red-600">{selectedScenario.cashImpact}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold">Recommended Mitigation:</span>
                <p className="text-[11px] text-foreground mt-0.5">{selectedScenario.recoveryPlan}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsScenarioModalOpen(false)}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsScenarioModalOpen(false);
                setActiveTab("scenarios");
              }}
            >
              View Full Stress Test Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default FinancialRiskPage;
