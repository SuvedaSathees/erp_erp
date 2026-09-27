import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardList,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  Calendar,
  Edit2,
  Plus,
  Download,
  Upload,
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
  Target,
  Wrench,
  Cpu,
  Package,
  CheckSquare,
  Network,
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
  projectRiskService,
  PRIMARY_PROJECT_RISK,
  TOP_PROJECT_RISKS,
  FULL_PROJECT_RISKS,
  PROJECT_KRIS,
  PROJECT_TREATMENT_ACTIONS,
  PROJECT_RISK_TREND,
  PROJECT_CATEGORY_DISTRIBUTION,
  PROJECT_AI_INSIGHTS,
  PROJECT_DEPENDENCIES_REGISTER,
  PROJECT_CONTROLS_MASTER,
  PROJECT_SCENARIOS,
  PROJECT_MAICW_FIELDS,
  PROJECT_REPORT_DEFINITIONS,
  type ProjectRiskRecord,
} from "@/services/projectRiskService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/risk-management/project-risk")({
  head: () => ({
    meta: [
      { title: "Project Risk · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled ERP master and transaction for identifying, assessing, and mitigating risks to project scope, schedule, cost, quality, and deliverables.",
      },
    ],
  }),
  component: ProjectRiskPage,
});

export function ProjectRiskPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [matrixView, setMatrixView] = useState<"Inherent" | "Residual">("Inherent");
  const [activeRisk, setActiveRisk] = useState<ProjectRiskRecord>(PRIMARY_PROJECT_RISK);
  const [allRisks, setAllRisks] = useState<ProjectRiskRecord[]>(FULL_PROJECT_RISKS);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRiskModalOpen, setIsNewRiskModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(PROJECT_SCENARIOS[0]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredRisks = useMemo(() => {
    return allRisks.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.workPackage?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === "All" || r.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [allRisks, searchQuery, categoryFilter]);

  const handleExportCSV = () => {
    const headers = [
      "Risk ID",
      "Risk Code",
      "Title",
      "Project ID",
      "Project Name",
      "Category",
      "Phase",
      "Owner",
      "Status",
      "Priority",
      "Inherent Score",
      "Residual Score",
      "Schedule Impact",
      "Cost Impact",
    ];
    const rows = filteredRisks.map((r) => [
      r.id,
      r.riskCode,
      `"${r.title.replace(/"/g, '""')}"`,
      r.projectId,
      `"${r.projectName}"`,
      r.category,
      r.projectPhase,
      r.riskOwner,
      r.status,
      r.priority,
      r.inherentScore,
      r.residualScore,
      r.impacts.scheduleImpact,
      r.impacts.costImpact,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Project_Risk_Register_${activeRisk.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveRisk = (updated: ProjectRiskRecord) => {
    setActiveRisk(updated);
    setAllRisks((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setIsEditModalOpen(false);
  };

  return (
    <AppShell
      title="Project Risk"
      breadcrumb="Management > Risk Management > Project Risk"
      description="Project delivery uncertainties, critical path milestones, budget variance risk, and mitigation roadmaps."
      tabs={<RiskManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* =========================================================================
            1. HEADER BANNER - EXACT MATCH TO SCREENSHOT
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Project Risk
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-300 font-bold px-2 py-0.5 text-xs">
                Active
              </Badge>
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                {activeRisk.id}
              </span>
              <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                v{activeRisk.version}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Manage Project Risks. Deliver Projects Successfully.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-primary text-primary-foreground text-xs font-semibold shadow-xs"
              onClick={() => setIsNewRiskModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Risk
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium">
              <Upload className="h-3.5 w-3.5" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium"
              onClick={handleExportCSV}
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="h-3.5 w-3.5" />
              Generate Report
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  More Actions <MoreVertical className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={() => window.print()}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Print Dossier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsScenarioModalOpen(true)}>
                  <Activity className="h-3.5 w-3.5 mr-2" /> Run Schedule Stress Test
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("dependencies")}>
                  <Network className="h-3.5 w-3.5 mr-2" /> View Dependencies
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
              ← Back to Project Risk Overview
            </Button>
          </div>
        )}

        {/* =========================================================================
            EXECUTIVE DASHBOARD (SCREENSHOT 1:1 REPLICATION)
            ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* ROW 1: 6 EXECUTIVE METRIC CARDS (EXACT SCREENSHOT LAYOUT) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {/* Card 1: Total Project Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↑ 12%
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
                  <div className="text-xl font-extrabold text-foreground">28</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Total Project Risks
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
                      ↑ 50%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-red-300 rounded-t h-1" />
                      <span className="w-1 bg-red-400 rounded-t h-2" />
                      <span className="w-1 bg-red-500 rounded-t h-2.5" />
                      <span className="w-1 bg-red-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">6</div>
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
                      ↓ 18%
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
                  <div className="text-xl font-extrabold text-foreground">9</div>
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
                      → 0%
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
                  <div className="text-xl font-extrabold text-foreground">8</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Medium Risks
                  </div>
                </div>
              </Card>

              {/* Card 5: Low Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↓ 29%
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
                  <div className="text-xl font-extrabold text-foreground">5</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Low Risks
                  </div>
                </div>
              </Card>

              {/* Card 6: Open Actions */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Target className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-red-600 block">
                      ↑ 33%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-purple-300 rounded-t h-1" />
                      <span className="w-1 bg-purple-400 rounded-t h-2" />
                      <span className="w-1 bg-purple-500 rounded-t h-2.5" />
                      <span className="w-1 bg-purple-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">12</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Open Actions
                  </div>
                </div>
              </Card>
            </div>

            {/* ROW 2: RISK DETAILS, RISK STATEMENT, PROJECT RISK HEAT MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-4">
              {/* Left Column (5 cols on xl, 12 on lg): Risk Details */}
              <Card className="lg:col-span-12 xl:col-span-5 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk Details</h3>
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
                        Project <span className="text-red-500">*</span>
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 flex items-center justify-between truncate">
                        <span className="truncate">{activeRisk.projectId} - {activeRisk.projectName}</span>
                        <span className="text-[10px] text-muted-foreground">▾</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Risk Category <span className="text-red-500">*</span>
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 flex items-center justify-between">
                        <span>{activeRisk.category}</span>
                        <span className="text-[10px] text-muted-foreground">▾</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Risk Type <span className="text-red-500">*</span>
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 flex items-center justify-between">
                        <span>{activeRisk.type}</span>
                        <span className="text-[10px] text-muted-foreground">▾</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Business Function
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
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
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Work Package
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.workPackage ?? "WP-03 - Prototype Build"}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Milestone
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.milestone ?? "M-02 - Prototype Testing"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Risk Owner
                      </label>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-5 w-5 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                          {activeRisk.riskOwnerAvatar ?? "PS"}
                        </span>
                        <span className="font-semibold text-foreground truncate">
                          {activeRisk.riskOwner}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Risk Coordinator / Priority
                      </label>
                      <div className="mt-0.5 flex items-center gap-1">
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

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
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

              {/* Center Column (3 cols on xl, 6 on lg): Risk Statement & Project Impact */}
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

                {/* Project Impact 2x2 Grid */}
                <Card className="p-3.5 border-border/80 shadow-2xs bg-card">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border/40">
                    Project Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {/* Schedule Impact */}
                    <div className="p-2.5 rounded-lg border border-red-200 bg-red-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-red-500 text-white flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">
                          Schedule
                        </div>
                        <div className="text-xs font-extrabold text-red-600">
                          {activeRisk.impacts.scheduleImpact}
                        </div>
                      </div>
                    </div>

                    {/* Cost Impact */}
                    <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">Cost</div>
                        <div className="text-xs font-extrabold text-amber-600">
                          {activeRisk.impacts.costImpact}
                        </div>
                      </div>
                    </div>

                    {/* Technical Impact */}
                    <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Cpu className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">
                          Technical
                        </div>
                        <div className="text-xs font-extrabold text-red-600">
                          {activeRisk.impacts.technicalImpact}
                        </div>
                      </div>
                    </div>

                    {/* Quality Impact */}
                    <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CheckSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">Quality</div>
                        <div className="text-xs font-extrabold text-amber-600">
                          {activeRisk.impacts.qualityImpact}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column (4 cols on xl, 6 on lg): Project Risk Heat Map */}
              <Card className="lg:col-span-6 xl:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Project Risk Heat Map</h3>
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

                                // Plotted bubbles according to screenshot:
                                // (5,4) -> crosshair bubble, (5,5) -> crosshair bubble, (4,2), (4,5), (3,4), (2,3), (1,4)
                                const isCrosshair1 = lik === 5 && imp === 4;
                                const isCrosshair2 = lik === 5 && imp === 5;
                                const isDot1 = lik === 4 && imp === 2;
                                const isDot2 = lik === 4 && imp === 5;
                                const isDot3 = lik === 3 && imp === 4;
                                const isDot4 = lik === 2 && imp === 3;
                                const isDot5 = lik === 1 && imp === 4;

                                return (
                                  <div
                                    key={imp}
                                    title={`Likelihood ${lik} × Impact ${imp} = ${score}`}
                                    className={cn(
                                      "h-6 rounded flex items-center justify-center text-[10px] font-bold text-white transition-transform hover:scale-105 cursor-pointer relative",
                                      bg,
                                    )}
                                  >
                                    {(isCrosshair1 || isCrosshair2) && (
                                      <div className="h-4 w-4 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-xs">
                                        <span className="text-[8px] text-white font-black leading-none">
                                          ✕
                                        </span>
                                      </div>
                                    )}
                                    {(isDot1 || isDot2 || isDot3 || isDot4 || isDot5) && (
                                      <div className="h-2.5 w-2.5 rounded-full bg-slate-900 border border-white shadow-xs" />
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

            {/* ROW 3: RISK TREND, RISK BY CATEGORY, KEY RISK INDICATORS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (4 cols): Risk Trend (Inherent vs Residual) */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk Trend</h3>
                  <div className="flex items-center gap-2 text-[10px] font-medium">
                    <span className="flex items-center gap-1 text-red-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Inherent Risk
                    </span>
                    <span className="flex items-center gap-1 text-blue-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Residual Risk
                    </span>
                  </div>
                </div>

                <div className="h-52 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PROJECT_RISK_TREND}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 25]} tick={{ fontSize: 10 }} />
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
                        dataKey="inherent"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Inherent Risk"
                      />
                      <Line
                        type="monotone"
                        dataKey="residual"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Residual Risk"
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
                          data={PROJECT_CATEGORY_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="count"
                        >
                          {PROJECT_CATEGORY_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-base font-black text-foreground">28</span>
                      <span className="text-[9px] font-bold text-muted-foreground">Total Risks</span>
                    </div>
                  </div>

                  <div className="col-span-7 space-y-1 text-[10px] pl-1 max-h-48 overflow-y-auto no-scrollbar">
                    {PROJECT_CATEGORY_DISTRIBUTION.map((cat) => (
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
                      {PROJECT_KRIS.map((kri) => (
                        <tr key={kri.id} className="hover:bg-muted/30">
                          <td className="p-1.5 font-semibold text-foreground truncate max-w-[130px]">
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

            {/* ROW 4: TOP PROJECT RISKS, RISK TREATMENT ACTIONS, AI PROJECT RISK INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (4 cols): Top Project Risks */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Top Project Risks</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] text-primary px-1.5"
                    onClick={() => setActiveTab("register")}
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
                        <th className="p-1.5 text-center">Inherent</th>
                        <th className="p-1.5 text-center">Residual</th>
                        <th className="p-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-[11px]">
                      {TOP_PROJECT_RISKS.map((r) => (
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
                      {PROJECT_TREATMENT_ACTIONS.map((act) => (
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
                                    : "bg-emerald-500/10 text-emerald-600",
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

              {/* Right Column (4 cols): AI Project Risk Insights */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-foreground">
                      AI Project Risk Insights
                    </h3>
                  </div>
                  <Badge className="bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5">
                    AI Powered
                  </Badge>
                </div>

                {/* 5 AI Bullet Points matching screenshot */}
                <div className="space-y-1.5 py-1 text-xs">
                  {PROJECT_AI_INSIGHTS.map((item) => (
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
                    onClick={() => setActiveTab("assessment")}
                  >
                    <Layers className="h-3 w-3 text-primary" />
                    <span>Impact</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 flex flex-col items-center justify-center gap-0.5 leading-none"
                    onClick={() => setActiveTab("treatment")}
                  >
                    <CheckSquare className="h-3 w-3 text-primary" />
                    <span>Mitigation</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 flex flex-col items-center justify-center gap-0.5 leading-none"
                    onClick={handleExportCSV}
                  >
                    <Download className="h-3 w-3 text-primary" />
                    <span>Export</span>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: RISK REGISTER
            ========================================================================= */}
        {activeTab === "register" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Project Risk Register (28 Active Risks)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Comprehensive WBS-mapped risks across Technical, Schedule, Cost, Procurement, and Resources.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-48">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search risks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                  <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setIsNewRiskModalOpen(true)}>
                    <Plus className="h-3.5 w-3.5" /> Add Risk
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Risk ID</th>
                      <th className="p-3">Risk Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Project</th>
                      <th className="p-3">Work Package</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3 text-center">Inherent</th>
                      <th className="p-3 text-center">Residual</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRisks.map((r) => (
                      <tr key={r.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{r.id}</td>
                        <td className="p-3 font-semibold text-foreground">{r.title}</td>
                        <td className="p-3">{r.category}</td>
                        <td className="p-3 text-muted-foreground">{r.projectName}</td>
                        <td className="p-3 text-muted-foreground">{r.workPackage}</td>
                        <td className="p-3 font-medium text-foreground">{r.riskOwner}</td>
                        <td className="p-3 text-center">
                          <span className="font-mono font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded">
                            {r.inherentScore}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                            {r.residualScore}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
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
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 3: RISK ASSESSMENT (SECTIONS 11-15)
            ========================================================================= */}
        {activeTab === "assessment" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-border/80 shadow-2xs">
                <CardHeader className="p-0 pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Inherent Project Risk Assessment (Section 14)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Risk exposure before considering project controls and schedule buffers.
                  </CardDescription>
                </CardHeader>
                <div className="space-y-3 pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Likelihood (1–5):</span>
                    <span className="font-bold text-foreground">{activeRisk.likelihood} / 5 (Almost Certain)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Project Impact (1–5):</span>
                    <span className="font-bold text-foreground">{activeRisk.impact} / 5 (Major)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <span className="font-bold text-foreground">Inherent Risk Score:</span>
                    <Badge className="bg-red-500 text-white font-mono text-sm px-2 py-0.5">
                      {activeRisk.inherentScore} / 25 ({activeRisk.inherentLevel})
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-border/80 shadow-2xs">
                <CardHeader className="p-0 pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Residual Project Risk Assessment (Section 18)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Remaining exposure after preventive controls and mitigation treatment.
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
                    <span className="font-bold text-foreground">Residual Risk Score:</span>
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
            TAB 4: TREATMENT & ACTIONS (SECTIONS 19 & 20)
            ========================================================================= */}
        {activeTab === "treatment" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Project Risk Treatment Action Plan (Section 20)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Mitigation initiatives: Identified → Assigned → In Progress → Evidence Verified → Closed.
                  </CardDescription>
                </div>
                <Button size="sm" className="h-8 text-xs gap-1.5">
                  <Plus className="h-3 w-3" /> New Action
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Action ID</th>
                      <th className="p-3">Action Description</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Budget</th>
                      <th className="p-3">Evidence Submitted</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROJECT_TREATMENT_ACTIONS.map((act) => (
                      <tr key={act.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{act.id}</td>
                        <td className="p-3 font-semibold text-foreground">{act.action}</td>
                        <td className="p-3 text-muted-foreground">{act.owner}</td>
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
                                  : "bg-emerald-500/10 text-emerald-600",
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
            TAB 5: KRI MONITORING (SECTIONS 21 & 22)
            ========================================================================= */}
        {activeTab === "kri" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Project Key Risk Indicators (KRI) & Early Warning Signals (Section 21 & 22)
                </CardTitle>
                <CardDescription className="text-xs">
                  Schedule performance index (SPI), cost performance index (CPI), defect rates, and supplier lead times.
                </CardDescription>
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
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROJECT_KRIS.map((kri) => (
                      <tr key={kri.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{kri.id}</td>
                        <td className="p-3 font-semibold text-foreground">{kri.name}</td>
                        <td className="p-3 text-muted-foreground">{kri.category}</td>
                        <td className="p-3 font-mono font-bold text-foreground">{kri.current}</td>
                        <td className="p-3 font-mono text-muted-foreground">{kri.threshold}</td>
                        <td className="p-3 font-medium text-foreground">{kri.owner}</td>
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
            TAB 6: INCIDENTS & ISSUES
            ========================================================================= */}
        {activeTab === "issues" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Project Incidents & Issue Escalation Log
                </CardTitle>
                <CardDescription className="text-xs">
                  Active blockers and operational bottlenecks directly impacting WBS deliverables.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3.5 rounded-lg border border-red-200 bg-red-500/5 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      ISSUE-PRJ-01: Delay in 1200V SiC Switching Module Prototype Dispatch
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      European foundry notified a 4-week transit delay on sample wafer dicing. High-power bench testing halted.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-red-500 text-white text-[9px]">Critical Blocker</Badge>
                      <span className="text-[10px] text-muted-foreground font-semibold">Owner: Priya Sharma</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-500/5 flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      ISSUE-PRJ-02: Embedded Systems Firmware Build v2.3 CAN Bus Timeout
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Intermittent communication drops between primary DSP and battery BMS emulator during high-surge loads.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-amber-500 text-white text-[9px]">High Priority</Badge>
                      <span className="text-[10px] text-muted-foreground font-semibold">Owner: Siddharth Verma</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 7: DEPENDENCIES (SECTION 6)
            ========================================================================= */}
        {activeTab === "dependencies" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Project Dependency Mapping & Critical Path Blockers (Section 6)
                </CardTitle>
                <CardDescription className="text-xs">
                  Hardware, software, supplier, certification, and inter-team handover dependencies.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Dependency ID</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Required Date</th>
                      <th className="p-3">Impact if Delayed</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROJECT_DEPENDENCIES_REGISTER.map((dep) => (
                      <tr key={dep.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{dep.id}</td>
                        <td className="p-3 font-semibold text-foreground">{dep.type}</td>
                        <td className="p-3 font-medium text-foreground">{dep.description}</td>
                        <td className="p-3 text-muted-foreground">{dep.owner}</td>
                        <td className="p-3 font-mono text-muted-foreground">{dep.requiredDate}</td>
                        <td className="p-3 text-[11px] text-red-600 font-semibold">{dep.impactIfDelayed}</td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              dep.status === "At Risk"
                                ? "bg-red-500/10 text-red-600 border border-red-200"
                                : "bg-emerald-500/10 text-emerald-600 border border-emerald-200",
                            )}
                          >
                            {dep.status}
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
            TAB 8: REPORTS (SECTION 47)
            ========================================================================= */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Project Risk Controlled Reports Suite (Section 47)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Executive registers, schedule critical path audits, cost variance summaries, and homologation logs.
                  </CardDescription>
                </div>
                <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => window.print()}>
                  <Download className="h-3.5 w-3.5" /> Print Dossier
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PROJECT_REPORT_DEFINITIONS.map((r) => (
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
            TAB 9: SETTINGS & MAICW CLASSIFICATION (SECTION 1, 38, 50)
            ========================================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Project Risk Form — MAICW Classification Master (Section 1)
                </CardTitle>
                <CardDescription className="text-xs">
                  Field taxonomy: Mandatory (M), Automated (A), Input (I), Controlled (C), Workflow (W).
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
                    {PROJECT_MAICW_FIELDS.map((f) => (
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
                Project Risk Escalation Hierarchy (Section 38):
              </h4>
              <div className="flex items-center justify-between text-xs font-semibold gap-2 overflow-x-auto py-2">
                <span className="p-2 rounded bg-muted">Risk Owner (Priya Sharma)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-muted">Project Manager (Arun Kumar)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-amber-500/10 text-amber-700">Functional Head (R&D)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-purple-500/10 text-purple-700">PMO / Risk Management</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-rose-500/10 text-rose-700">Steering Committee / Board</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: EDIT PROJECT RISK
          ========================================================================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Edit Project Risk: {activeRisk.id}</DialogTitle>
            <DialogDescription className="text-xs">
              Update controlled master information for this project risk record.
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
          MODAL: NEW PROJECT RISK
          ========================================================================= */}
      <Dialog open={isNewRiskModalOpen} onOpenChange={setIsNewRiskModalOpen}>
        <DialogContent className="max-w-md text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Register New Project Risk</DialogTitle>
            <DialogDescription className="text-xs">
              Catalog a newly identified risk impacting schedule, cost, or technical performance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Risk Title *</label>
              <Input id="new-prj-title" placeholder="e.g. PCB fabrication delay from European foundry" className="h-8 text-xs mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Category</label>
                <Input id="new-prj-category" defaultValue="Technical Risk" className="h-8 text-xs mt-1" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Priority</label>
                <Input id="new-prj-priority" defaultValue="High" className="h-8 text-xs mt-1" />
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
                const titleInput = (document.getElementById("new-prj-title") as HTMLInputElement)?.value;
                if (!titleInput) return;
                const newRecord: ProjectRiskRecord = {
                  ...PRIMARY_PROJECT_RISK,
                  id: `PR-2026-0${allRisks.length + 1}`,
                  riskCode: `RK-PRJ-GEN-0${allRisks.length + 1}`,
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
              Execute Project Schedule & Cost Stress Test
            </DialogTitle>
            <DialogDescription className="text-xs">
              Simulate critical path impact, milestone delays, and EAC under severe development shocks.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Select Simulation Scenario</label>
              <select
                className="w-full text-xs p-2 rounded border border-border bg-card font-medium mt-1"
                onChange={(e) => {
                  const scn = PROJECT_SCENARIOS.find((s) => s.id === e.target.value);
                  if (scn) setSelectedScenario(scn);
                }}
              >
                {PROJECT_SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}: {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2">
              <span className="font-bold text-foreground">Scenario Impact Summary:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold">Schedule Slippage:</span>
                  <p className="font-mono font-bold text-red-600">{selectedScenario.scheduleImpact}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-bold">Cost Impact:</span>
                  <p className="font-mono font-bold text-amber-600">{selectedScenario.costImpact}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold">Recommended Mitigation:</span>
                <p className="text-[11px] text-foreground mt-0.5">{selectedScenario.responsePlan}</p>
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
                setActiveTab("assessment");
              }}
            >
              View Full Impact Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default ProjectRiskPage;
