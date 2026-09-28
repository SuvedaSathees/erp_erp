import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  Calendar,
  Edit2,
  Plus,
  Download,
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
  Share2,
  Building,
  UserCheck,
  Lock,
  Workflow,
  ArrowRight,
  Info,
  Server,
  Zap,
  Flame,
  Check,
  X,
  ExternalLink,
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
  BarChart,
  Bar,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { RiskManagementTabBar } from "@/components/erp/RiskManagementTabBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  enterpriseRiskService,
  PRIMARY_ACTIVE_RISK,
  TOP_RISKS_SUMMARY,
  FULL_ENTERPRISE_RISKS,
  KRI_ITEMS,
  RISK_TREATMENT_ACTIONS,
  PRIMARY_RISK_CONTROLS,
  CATEGORY_DISTRIBUTION,
  RISK_TREND_DATA,
  AI_QUICK_INSIGHTS,
  MAICW_FORM_FIELDS,
  REPORT_DEFINITIONS,
  calculateRiskScore,
  type EnterpriseRiskRecord,
  type RiskCategory,
} from "@/services/enterpriseRiskService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/risk-management/enterprise-risk")({
  head: () => ({
    meta: [
      { title: "Enterprise Risk · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled enterprise risk form, MAICW classification, inherent & residual assessment, 5x5 heat map, and continuous risk intelligence.",
      },
    ],
  }),
  component: EnterpriseRiskPage,
});

export function EnterpriseRiskPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeRisk, setActiveRisk] = useState<EnterpriseRiskRecord>(PRIMARY_ACTIVE_RISK);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRiskModalOpen, setIsNewRiskModalOpen] = useState(false);
  const [selectedRiskForModal, setSelectedRiskForModal] = useState<EnterpriseRiskRecord | null>(null);

  // Filters for Risk Register
  const [registerSearch, setRegisterSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  // Inherent/Residual Interactive Sliders for Assessment Tab
  const [simLikelihood, setSimLikelihood] = useState<number>(activeRisk.inherentLikelihood);
  const [simImpact, setSimImpact] = useState<number>(activeRisk.inherentImpact);
  const [simResLikelihood, setSimResLikelihood] = useState<number>(activeRisk.residualLikelihood);
  const [simResImpact, setSimResImpact] = useState<number>(activeRisk.residualImpact);

  const inherentScore = simLikelihood * simImpact;
  const residualScore = simResLikelihood * simResImpact;
  const inherentCalc = calculateRiskScore(simLikelihood, simImpact);
  const residualCalc = calculateRiskScore(simResLikelihood, simResImpact);

  const filteredRegister = useMemo(() => {
    return FULL_ENTERPRISE_RISKS.filter((r) => {
      const matchesSearch =
        r.id.toLowerCase().includes(registerSearch.toLowerCase()) ||
        r.title.toLowerCase().includes(registerSearch.toLowerCase()) ||
        r.statement.toLowerCase().includes(registerSearch.toLowerCase()) ||
        r.owner.toLowerCase().includes(registerSearch.toLowerCase());
      const matchesCat = categoryFilter === "All" || r.category === categoryFilter;
      const matchesPri = priorityFilter === "All" || r.priority === priorityFilter;
      return matchesSearch && matchesCat && matchesPri;
    });
  }, [registerSearch, categoryFilter, priorityFilter]);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Risk Code,Title,Category,Type,Owner,Inherent Score,Residual Score,Trend,Status"]
        .concat(
          FULL_ENTERPRISE_RISKS.map(
            (r) =>
              `"${r.id}","${r.riskCode}","${r.title}","${r.category}","${r.type}","${r.owner}",${r.inherentScore},${r.residualScore},"${r.trend}","${r.status}"`,
          ),
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Enterprise_Risk_Register_${activeRisk.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getHeatMapColor = (l: number, i: number) => {
    const score = l * i;
    if (score >= 17) return "bg-red-500 text-white";
    if (score >= 10) return "bg-orange-500 text-white";
    if (score >= 5) return "bg-amber-400 text-slate-900";
    return "bg-emerald-500 text-white";
  };

  return (
    <AppShell
      title="Enterprise Risk"
      breadcrumb="Management > Risk Management > Enterprise Risk"
      description="Enterprise risk register, 5×5 matrix scoring, control effectiveness, and board-level risk appetite governance."
      tabs={<RiskManagementTabBar />}
    >
      <div className="space-y-4">
        {/* =========================================================================
            1. TOP HEADER - EXACT MATCH TO SCREENSHOT
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground whitespace-nowrap">
                Enterprise Risk
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
              Identify. Assess. Mitigate. Build a Resilient Tomorrow.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <Button
              size="sm"
              className="h-8 text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 shrink-0"
              onClick={() => setIsNewRiskModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Risk
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 border-border shrink-0"
              onClick={handleExportCSV}
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 shrink-0 hidden sm:inline-flex"
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="h-3.5 w-3.5" />
              Generate Report
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-border gap-1 shrink-0">
                  More Actions
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem className="sm:hidden" onClick={() => setActiveTab("reports")}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Generate Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("assessment")}>
                  Initiate Reassessment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("treatment")}>
                  Escalate to Risk Committee
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  View MAICW Classification
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  Print Master Sheet
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
              ← Back to Strategic Risk Overview
            </Button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: OVERVIEW - 1:1 REPLICATION OF SCREENSHOT
            ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* ROW 1: 6 KPI CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Card 1: Total Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                    ↑ 12%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">42</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Total Risks</div>
                </div>
              </Card>

              {/* Card 2: Critical Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-red-600 flex items-center">
                    ↑ 20%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">6</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Critical Risks</div>
                </div>
              </Card>

              {/* Card 3: High Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <AlertOctagon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                    ↓ 8%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">12</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">High Risks</div>
                </div>
              </Card>

              {/* Card 4: Medium Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 flex items-center">
                    → 0%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">18</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Medium Risks</div>
                </div>
              </Card>

              {/* Card 5: Low Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                    ↓ 25%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">6</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Low Risks</div>
                </div>
              </Card>

              {/* Card 6: Overdue Actions */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold text-red-600 flex items-center">
                    ↑ 50%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">9</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Overdue Actions</div>
                </div>
              </Card>
            </div>

            {/* ROW 2: RISK DETAILS, RISK STATEMENT, RISK HEAT MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: Risk Details (5 cols on xl, full width on lg) */}
              <Card className="lg:col-span-12 xl:col-span-5 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk Details</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs gap-1 px-2 border-border"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground">Risk Title *</label>
                    <div className="font-semibold text-foreground truncate mt-0.5" title={activeRisk.title}>
                      {activeRisk.title}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">Risk Category *</label>
                      <select
                        aria-label="Risk Category"
                        value={activeRisk.category}
                        onChange={(e) => setActiveRisk({ ...activeRisk, category: e.target.value as RiskCategory })}
                        className="w-full mt-0.5 rounded border border-border bg-background px-2 py-1 text-xs font-medium"
                      >
                        <option value="Supply Chain">Supply Chain</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Strategic">Strategic</option>
                        <option value="Operational">Operational</option>
                        <option value="Financial">Financial</option>
                        <option value="Compliance">Compliance</option>
                        <option value="Product">Product</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">Risk Type *</label>
                      <select
                        aria-label="Risk Type"
                        value={activeRisk.type}
                        onChange={(e) => setActiveRisk({ ...activeRisk, type: e.target.value as any })}
                        className="w-full mt-0.5 rounded border border-border bg-background px-2 py-1 text-xs font-medium"
                      >
                        <option value="Threat">Threat</option>
                        <option value="Opportunity">Opportunity</option>
                        <option value="Emerging Risk">Emerging Risk</option>
                        <option value="Strategic Risk">Strategic Risk</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Business Function</label>
                      <div className="font-medium text-foreground mt-0.5">{activeRisk.businessFunction}</div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Business Process</label>
                      <div className="font-medium text-foreground mt-0.5">{activeRisk.businessProcess}</div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Department</label>
                      <div className="font-medium text-foreground mt-0.5">{activeRisk.department}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/40">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Risk Owner</label>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="h-5 w-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[9px]">
                          KR
                        </div>
                        <span className="font-semibold text-foreground text-[11px]">{activeRisk.owner}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Risk Coordinator</label>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-[9px]">
                          PS
                        </div>
                        <span className="font-medium text-foreground text-[11px]">{activeRisk.coordinator}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Priority</label>
                      <div className="mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-200">
                          ↑ High
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Status</label>
                      <div className="mt-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Monitoring
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>Identification Date: <strong className="text-foreground">{activeRisk.identificationDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>Review Date: <strong className="text-foreground">{activeRisk.reviewDate}</strong></span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Middle: Risk Statement (3 cols on xl, 6 cols on lg) */}
              <Card className="lg:col-span-6 xl:col-span-3 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk Statement</h3>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="relative pl-5 pr-2 py-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 text-xs italic text-slate-800 dark:text-slate-200 leading-relaxed">
                    <span className="absolute left-1.5 top-1.5 text-xl text-primary/40 font-serif leading-none">“</span>
                    {activeRisk.statement}
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Business Impact
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeRisk.businessImpacts.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Right: Risk Heat Map (5x5 Matrix) (4 cols on xl, 6 cols on lg) */}
              <Card className="lg:col-span-6 xl:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Risk Heat Map</h3>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Score: 20
                  </Badge>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex gap-1.5">
                    <div className="flex items-center justify-center">
                      <span className="-rotate-90 text-[9px] font-bold tracking-wider text-muted-foreground uppercase whitespace-nowrap">
                        Likelihood
                      </span>
                    </div>

                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((l) => (
                        <div key={l} className="flex items-center gap-1.5">
                          <span className="w-16 text-[9px] font-semibold text-right text-muted-foreground truncate">
                            {l === 5 && "5 Almost Certain"}
                            {l === 4 && "4 Likely"}
                            {l === 3 && "3 Possible"}
                            {l === 2 && "2 Unlikely"}
                            {l === 1 && "1 Rare"}
                          </span>
                          <div className="grid grid-cols-5 gap-1 flex-1">
                            {[1, 2, 3, 4, 5].map((i) => {
                              const isTarget = l === 4 && i === 5;
                              return (
                                <div
                                  key={i}
                                  className={cn(
                                    "h-5 rounded flex items-center justify-center text-[9px] font-bold relative transition-all",
                                    getHeatMapColor(l, i),
                                    isTarget && "ring-2 ring-slate-900 shadow-md",
                                  )}
                                >
                                  {isTarget && (
                                    <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {/* X-axis Impact */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="w-16" />
                        <div className="grid grid-cols-5 gap-1 flex-1 text-center font-mono">
                          <span className="text-[8px] font-semibold text-muted-foreground">1 · Negl</span>
                          <span className="text-[8px] font-semibold text-muted-foreground">2 · Minor</span>
                          <span className="text-[8px] font-semibold text-muted-foreground">3 · Mod</span>
                          <span className="text-[8px] font-semibold text-muted-foreground">4 · Major</span>
                          <span className="text-[8px] font-semibold text-muted-foreground">5 · Crit</span>
                        </div>
                      </div>
                      <div className="text-center text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                        Impact
                      </div>
                    </div>
                  </div>

                  {/* Legend matching screenshot */}
                  <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-border/40 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Low (1–4)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      Moderate (5–9)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      High (10–16)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Critical (17–25)
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* ROW 3: CATEGORY DONUT, RISK TREND, KEY RISK INDICATORS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: Risk Distribution by Category */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk Distribution by Category</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 items-center pt-2">
                  <div className="h-[170px] relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={CATEGORY_DISTRIBUTION}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {CATEGORY_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-extrabold text-foreground leading-none">42</span>
                      <span className="text-[10px] font-semibold text-muted-foreground">Total Risks</span>
                    </div>
                  </div>

                  <div className="space-y-1 max-h-[170px] overflow-y-auto pr-1 text-[11px]">
                    {CATEGORY_DISTRIBUTION.map((c) => (
                      <div key={c.name} className="flex items-center justify-between py-0.5 border-b border-border/20">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                          <span className="font-medium text-foreground text-[10px] truncate max-w-[70px]">
                            {c.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span className="text-muted-foreground">{c.percentage}%</span>
                          <span className="font-bold text-foreground w-3 text-right">{c.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Middle: Risk Trend */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk Trend</h3>
                </div>

                <div className="h-[170px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={RISK_TREND_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis tickLine={false} tick={{ fontSize: 10 }} domain={[0, 45]} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Line
                        type="monotone"
                        dataKey="totalRisks"
                        name="Total Risks"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="highCritical"
                        name="High & Critical"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="medium"
                        name="Medium"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="low"
                        name="Low"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Right: Key Risk Indicators (KRI) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Key Risk Indicators (KRI)</h3>
                  <button
                    onClick={() => setActiveTab("kri")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-1.5 pt-2 text-xs">
                  <div className="grid grid-cols-12 text-[9px] font-bold text-muted-foreground uppercase pb-1 border-b border-border/40">
                    <span className="col-span-6">KRI Name</span>
                    <span className="col-span-2 text-right">Current</span>
                    <span className="col-span-2 text-right">Threshold</span>
                    <span className="col-span-2 text-right">Status</span>
                  </div>

                  {KRI_ITEMS.slice(0, 5).map((kri) => (
                    <div key={kri.id} className="grid grid-cols-12 items-center py-1 border-b border-border/20 text-[11px]">
                      <div className="col-span-6 truncate pr-1" title={kri.name}>
                        <span className="font-medium text-foreground">{kri.name}</span>
                      </div>
                      <span className="col-span-2 text-right font-mono font-bold text-foreground">
                        {kri.currentValue}
                      </span>
                      <span className="col-span-2 text-right font-mono text-muted-foreground">
                        {kri.criticalThreshold}
                      </span>
                      <div className="col-span-2 flex justify-end">
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded-full text-[9px] font-bold flex items-center gap-1",
                            kri.status === "Red"
                              ? "bg-rose-500/10 text-rose-600 border border-rose-200"
                              : "bg-amber-500/10 text-amber-600 border border-amber-200",
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              kri.status === "Red" ? "bg-rose-500" : "bg-amber-500",
                            )}
                          />
                          {kri.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* ROW 4: TOP RISKS, RISK TREATMENT ACTIONS, QUICK INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: Top Risks */}
              <Card className="lg:col-span-5 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Top Risks</h3>
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="pt-1 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-[9px] font-bold text-muted-foreground uppercase">
                        <th className="py-1">ID</th>
                        <th className="py-1">Risk Title</th>
                        <th className="py-1">Category</th>
                        <th className="py-1 text-center">Inherent</th>
                        <th className="py-1 text-center">Residual</th>
                        <th className="py-1 text-center">Trend</th>
                        <th className="py-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_RISKS_SUMMARY.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => setActiveRisk(r)}
                          className={`border-b border-border/20 cursor-pointer transition-colors ${
                            activeRisk.id === r.id ? "bg-primary/5 font-semibold" : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="py-1.5 font-mono text-[11px] text-primary">{r.id}</td>
                          <td className="py-1.5 text-[11px] max-w-[120px] truncate" title={r.title}>
                            {r.title}
                          </td>
                          <td className="py-1.5 text-[11px] text-muted-foreground">{r.category}</td>
                          <td className="py-1.5 text-center">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded text-[10px] font-bold font-mono",
                                r.inherentScore >= 17
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-orange-500/10 text-orange-600",
                              )}
                            >
                              {r.inherentScore}
                            </span>
                          </td>
                          <td className="py-1.5 text-center">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded text-[10px] font-bold font-mono",
                                r.residualScore >= 12
                                  ? "bg-orange-500/10 text-orange-600"
                                  : r.residualScore >= 8
                                    ? "bg-amber-500/10 text-amber-700"
                                    : "bg-emerald-500/10 text-emerald-600",
                              )}
                            >
                              {r.residualScore}
                            </span>
                          </td>
                          <td className="py-1.5 text-center font-bold text-[11px]">
                            {r.trend === "Increasing" ? (
                              <span className="text-red-500">↑</span>
                            ) : r.trend === "Decreasing" ? (
                              <span className="text-emerald-500">↓</span>
                            ) : (
                              <span className="text-amber-500">→</span>
                            )}
                          </td>
                          <td className="py-1.5 text-right">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[9px] font-bold",
                                r.status === "Monitoring"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-rose-500/10 text-rose-600",
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

              {/* Middle: Risk Treatment Actions */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Risk Treatment Actions</h3>
                  <button
                    onClick={() => setActiveTab("treatment")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="pt-1 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-[9px] font-bold text-muted-foreground uppercase">
                        <th className="py-1">Action</th>
                        <th className="py-1">Owner</th>
                        <th className="py-1">Due Date</th>
                        <th className="py-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RISK_TREATMENT_ACTIONS.map((a) => (
                        <tr key={a.id} className="border-b border-border/20 hover:bg-muted/30">
                          <td className="py-1.5 text-[11px] font-medium text-foreground max-w-[130px] truncate" title={a.action}>
                            {a.action}
                          </td>
                          <td className="py-1.5 text-[10px] text-muted-foreground">{a.owner}</td>
                          <td className="py-1.5 font-mono text-[10px] text-muted-foreground">{a.dueDate}</td>
                          <td className="py-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[9px] font-bold",
                                a.status === "In Progress"
                                  ? "bg-blue-500/15 text-blue-600 border border-blue-200"
                                  : a.status === "Open"
                                    ? "bg-rose-500/15 text-rose-600 border border-rose-200"
                                    : "bg-slate-500/15 text-slate-600 border border-slate-200",
                              )}
                            >
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Right: Quick Insights (AI Powered) */}
              <Card className="lg:col-span-3 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Quick Insights</h3>
                  <Badge className="bg-purple-600 text-white text-[9px] gap-1 px-1.5 py-0.2">
                    <Sparkles className="h-2.5 w-2.5" />
                    AI Powered
                  </Badge>
                </div>

                <div className="pt-2 space-y-2">
                  {AI_QUICK_INSIGHTS.map((item) => {
                    const badgeColors = [
                      "bg-teal-500 text-white",
                      "bg-amber-500 text-white",
                      "bg-red-500 text-white",
                      "bg-purple-500 text-white",
                      "bg-rose-500 text-white",
                      "bg-emerald-500 text-white",
                    ];
                    return (
                      <div key={item.id} className="flex items-start gap-2 text-xs">
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5",
                            badgeColors[(item.id - 1) % badgeColors.length],
                          )}
                        >
                          {item.id}
                        </span>
                        <span className="text-[11px] text-foreground leading-snug font-medium">
                          {item.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: RISK REGISTER - COMPLETE MASTER OF 42 RISKS
            ========================================================================= */}
        {activeTab === "register" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Enterprise Risk Register (42 Risks)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Controlled master portfolio with inherent and residual risk scores across all 12 categories.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search risks, owners, codes..."
                        value={registerSearch}
                        onChange={(e) => setRegisterSearch(e.target.value)}
                        className="h-8 pl-8 text-xs w-[200px]"
                      />
                    </div>
                    <select
                      aria-label="Filter by Category"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="h-8 rounded border border-border bg-background px-2 text-xs font-medium"
                    >
                      <option value="All">All Categories</option>
                      <option value="Supply Chain">Supply Chain</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Strategic">Strategic</option>
                      <option value="Operational">Operational</option>
                      <option value="Financial">Financial</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Product">Product</option>
                      <option value="Quality">Quality</option>
                      <option value="People">People</option>
                      <option value="Reputation">Reputation</option>
                      <option value="Business Continuity">Business Continuity</option>
                    </select>
                    <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleExportCSV}>
                      <Download className="h-3.5 w-3.5" />
                      Export Register
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Risk ID</th>
                      <th className="p-3">Risk Code</th>
                      <th className="p-3">Risk Title & Statement</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3 text-center">Inherent</th>
                      <th className="p-3 text-center">Residual</th>
                      <th className="p-3 text-center">Trend</th>
                      <th className="p-3 text-center">Appetite</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegister.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => {
                          setActiveRisk(r);
                          setSelectedRiskForModal(r);
                        }}
                        className="border-b border-border/20 hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <td className="p-3 font-mono font-bold text-primary">{r.id}</td>
                        <td className="p-3 font-mono text-muted-foreground">{r.riskCode}</td>
                        <td className="p-3 max-w-[280px]">
                          <div className="font-bold text-foreground">{r.title}</div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1">{r.statement}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-muted font-medium text-[11px]">
                            {r.category}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{r.department}</td>
                        <td className="p-3 font-medium text-foreground">{r.owner}</td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded font-mono font-bold text-[11px]",
                              r.inherentScore >= 17
                                ? "bg-red-500/10 text-red-600"
                                : r.inherentScore >= 10
                                  ? "bg-orange-500/10 text-orange-600"
                                  : "bg-amber-500/10 text-amber-700",
                            )}
                          >
                            {r.inherentScore}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded font-mono font-bold text-[11px]",
                              r.residualScore >= 12
                                ? "bg-orange-500/10 text-orange-600"
                                : r.residualScore >= 8
                                  ? "bg-amber-500/10 text-amber-700"
                                  : "bg-emerald-500/10 text-emerald-600",
                            )}
                          >
                            {r.residualScore}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold">
                          {r.trend === "Increasing" ? (
                            <span className="text-red-500">↑</span>
                          ) : r.trend === "Decreasing" ? (
                            <span className="text-emerald-500">↓</span>
                          ) : (
                            <span className="text-amber-500">→</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                              r.appetiteStatus === "Outside Appetite"
                                ? "bg-red-500/10 text-red-600"
                                : r.appetiteStatus === "Near Tolerance"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-emerald-500/10 text-emerald-600",
                            )}
                          >
                            {r.appetiteStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold",
                              r.status === "Monitoring"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-rose-500/10 text-rose-600",
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
            TAB 3: RISK ASSESSMENT - INHERENT & RESIDUAL SCORING (SECTIONS 9-17)
            ========================================================================= */}
        {activeTab === "assessment" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: Inherent Risk Interactive Calculator */}
              <Card className="border-border/80 shadow-2xs">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-foreground">
                      Inherent Risk Assessment (Pre-Controls)
                    </CardTitle>
                    <Badge className={inherentCalc.color}>
                      Score {inherentScore} · {inherentCalc.level}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Formula: Inherent Risk Score = Likelihood (1–5) × Impact (1–5).
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Inherent Likelihood: {simLikelihood}</span>
                      <span className="text-muted-foreground">
                        {simLikelihood === 5
                          ? "Almost Certain"
                          : simLikelihood === 4
                            ? "Likely"
                            : simLikelihood === 3
                              ? "Possible"
                              : simLikelihood === 2
                                ? "Unlikely"
                                : "Rare"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={simLikelihood}
                      onChange={(e) => setSimLikelihood(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Inherent Impact: {simImpact}</span>
                      <span className="text-muted-foreground">
                        {simImpact === 5
                          ? "Severe"
                          : simImpact === 4
                            ? "Major"
                            : simImpact === 3
                              ? "Moderate"
                              : simImpact === 2
                                ? "Minor"
                                : "Insignificant"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={simImpact}
                      onChange={(e) => setSimImpact(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg space-y-1.5 border border-border/40">
                    <div className="text-[11px] font-bold text-foreground">9-Point Impact Breakdown:</div>
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>Financial: <strong>5 / 5</strong></div>
                      <div>Customer: <strong>4 / 5</strong></div>
                      <div>Operational: <strong>5 / 5</strong></div>
                      <div>Product: <strong>4 / 5</strong></div>
                      <div>Quality: <strong>4 / 5</strong></div>
                      <div>Compliance: <strong>3 / 5</strong></div>
                      <div>Reputation: <strong>4 / 5</strong></div>
                      <div>Safety: <strong>3 / 5</strong></div>
                      <div>Strategic: <strong>5 / 5</strong></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Residual Risk Post-Controls Calculator */}
              <Card className="border-border/80 shadow-2xs">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-foreground">
                      Residual Risk Assessment (Post-Controls)
                    </CardTitle>
                    <Badge className={residualCalc.color}>
                      Score {residualScore} · {residualCalc.level}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Flow: Inherent Risk (20) → Controls (3 Implemented) → Residual Risk (12).
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Residual Likelihood: {simResLikelihood}</span>
                      <span className="text-muted-foreground">
                        {simResLikelihood === 3 ? "Possible (Mitigated from 4)" : `Level ${simResLikelihood}`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={simResLikelihood}
                      onChange={(e) => setSimResLikelihood(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Residual Impact: {simResImpact}</span>
                      <span className="text-muted-foreground">
                        {simResImpact === 4 ? "Major (Mitigated from 5)" : `Level ${simResImpact}`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={simResImpact}
                      onChange={(e) => setSimResImpact(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-muted/40 rounded-lg space-y-1.5 border border-border/40">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span>Risk Appetite Governance:</span>
                      <span className="text-amber-600">Near Tolerance</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Max Acceptable Risk: <strong>9 (Moderate)</strong> · Target: <strong>6</strong> · Escalation Threshold: <strong>≥ 12</strong>.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls Library & Effectiveness Evaluation (Section 15 & 16) */}
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Existing Controls & Operating Effectiveness
                </CardTitle>
                <CardDescription className="text-xs">
                  Evaluation of preventive, detective, and automated controls linked to {activeRisk.title}.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Control ID</th>
                      <th className="p-3">Control Name & Category</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Frequency & Method</th>
                      <th className="p-3">Design Eff.</th>
                      <th className="p-3">Operating Eff.</th>
                      <th className="p-3">Last Tested</th>
                      <th className="p-3">Related SOP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIMARY_RISK_CONTROLS.map((ctrl) => (
                      <tr key={ctrl.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{ctrl.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-foreground">{ctrl.name}</div>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-muted font-medium">
                            {ctrl.category} Control
                          </span>
                        </td>
                        <td className="p-3">{ctrl.owner}</td>
                        <td className="p-3 text-muted-foreground">
                          {ctrl.frequency} · {ctrl.method}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                            {ctrl.designEffectiveness}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                            {ctrl.operatingEffectiveness}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-muted-foreground">{ctrl.lastTested}</td>
                        <td className="p-3 font-mono text-[10px] text-muted-foreground">{ctrl.relatedSOP}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 4: RISK TREATMENT - ACTIONS, APPETITE & TRANSFER (SECTIONS 18-20, 26, 27)
            ========================================================================= */}
        {activeTab === "treatment" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="p-4 border-border/80 shadow-2xs bg-card">
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Strategy</div>
                <div className="text-lg font-extrabold text-foreground">Reduce & Diversify</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active treatment strategy: Implement dual-sourcing and increase on-hand buffer safety stock.
                </p>
              </Card>

              <Card className="p-4 border-border/80 shadow-2xs bg-card">
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Budget Allocated</div>
                <div className="text-lg font-extrabold text-foreground">₹14,700,000</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Approved capital expenditure across 5 mitigation workstreams for FY26-Q3.
                </p>
              </Card>

              <Card className="p-4 border-border/80 shadow-2xs bg-card">
                <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Escalation Status</div>
                <div className="text-lg font-extrabold text-amber-600">Risk Committee Review</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Residual score 12 triggers Level-3 executive escalation per governance matrix.
                </p>
              </Card>
            </div>

            {/* Action Plan Master Table (Section 20) */}
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Risk Action Plan & Implementation Lifecycle
                  </CardTitle>
                  <Button size="sm" className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground">
                    <Plus className="h-3 w-3" />
                    New Action Plan
                  </Button>
                </div>
                <CardDescription className="text-xs">
                  Lifecycle: Identified → Assigned → In Progress → Evidence Submitted → Verified → Closed.
                </CardDescription>
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
                    {RISK_TREATMENT_ACTIONS.map((act) => (
                      <tr key={act.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{act.id}</td>
                        <td className="p-3 font-medium text-foreground">{act.action}</td>
                        <td className="p-3 text-muted-foreground">{act.category}</td>
                        <td className="p-3 font-semibold text-foreground">{act.owner}</td>
                        <td className="p-3 font-mono text-muted-foreground">{act.dueDate}</td>
                        <td className="p-3 font-mono font-bold text-foreground">{act.budget}</td>
                        <td className="p-3 text-muted-foreground text-[11px] max-w-[200px] truncate" title={act.evidence}>
                          {act.evidence}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              act.status === "In Progress"
                                ? "bg-blue-500/10 text-blue-600"
                                : "bg-rose-500/10 text-rose-600",
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

            {/* Risk Transfer & Acceptance Authorities (Sections 26 & 27) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4 border-border/80 shadow-2xs space-y-2">
                <h4 className="text-sm font-bold text-foreground">Risk Transfer Coverage</h4>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <div>Transfer Method: <strong className="text-foreground">Supply Chain Business Interruption Insurance</strong></div>
                  <div>Counterparty: <strong className="text-foreground">New India Assurance / Marsh McLennan</strong></div>
                  <div>Coverage Limit: <strong className="text-foreground">₹25.0 Cr</strong> · Policy No: <strong className="font-mono text-foreground">POL-BI-2026-992</strong></div>
                  <div>Residual Exposure post-insurance: <strong className="text-foreground">₹8.6 Cr</strong></div>
                </div>
              </Card>

              <Card className="p-4 border-border/80 shadow-2xs space-y-2">
                <h4 className="text-sm font-bold text-foreground">Risk Acceptance Governance</h4>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <div>Acceptance Authority: <strong className="text-foreground">Executive Risk Committee / CXO</strong></div>
                  <div>Rationale: <strong className="text-foreground">Buffer stock bridging operational requirement until Japanese fab qualification completes.</strong></div>
                  <div>Expiry Date: <strong className="font-mono text-foreground">31-Dec-2026</strong> · Review Cadence: <strong className="text-foreground">Monthly</strong></div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: KRI MONITORING - TELEMETRY & EARLY WARNING INDICATORS (SECTIONS 21-23)
            ========================================================================= */}
        {activeTab === "kri" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Key Risk Indicator (KRI) Telemetry Matrix
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-mono">
                    7 Active Monitored KRIs
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Early warning metrics with green, amber, red threshold rules and automated triggers.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">KRI ID</th>
                      <th className="p-3">Indicator Name & Metric</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Linked Risk</th>
                      <th className="p-3 text-right">Current Value</th>
                      <th className="p-3 text-right">Target</th>
                      <th className="p-3 text-right">Warning</th>
                      <th className="p-3 text-right">Critical</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KRI_ITEMS.map((k) => (
                      <tr key={k.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{k.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-foreground">{k.name}</div>
                          <div className="text-[11px] text-muted-foreground">{k.metric}</div>
                        </td>
                        <td className="p-3 text-muted-foreground">{k.category}</td>
                        <td className="p-3 font-mono text-[11px] text-muted-foreground">{k.linkedRiskId}</td>
                        <td className="p-3 text-right font-mono font-bold text-foreground">{k.currentValue}</td>
                        <td className="p-3 text-right font-mono text-muted-foreground">{k.target}</td>
                        <td className="p-3 text-right font-mono text-amber-600">{k.warningThreshold}</td>
                        <td className="p-3 text-right font-mono text-rose-600">{k.criticalThreshold}</td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold",
                              k.status === "Red"
                                ? "bg-rose-500/10 text-rose-600"
                                : k.status === "Amber"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-emerald-500/10 text-emerald-600",
                            )}
                          >
                            {k.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Early Warning Indicators (EWI) Workflow Card */}
            <Card className="p-4 border-border/80 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Early Warning Indicator Workflow:
              </h4>
              <div className="flex items-center justify-between text-xs font-semibold gap-2 overflow-x-auto py-2">
                <span className="p-2 rounded bg-muted">1. Indicator Telemetry</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-amber-500/10 text-amber-700">2. Threshold Breach</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-rose-500/10 text-rose-700">3. Automated Alert</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-primary/10 text-primary">4. Risk Review</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-purple-500/10 text-purple-700">5. CXO Escalation</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-emerald-500/10 text-emerald-700">6. Treatment Action</span>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 6: RISK ANALYTICS - INTERDEPENDENCY, SCENARIO & STRESS (SECTIONS 38-40, 44-45)
            ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            {/* Risk Interdependency Cascade (Section 38) */}
            <Card className="p-4 border-border/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-primary" />
                  Enterprise Risk Interdependency Cascade
                </h4>
                <Badge variant="outline" className="text-[10px]">Causal Chain</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Enterprise risks do not operate in isolation. Supply chain disruptions cascade across production, delivery, revenue, and brand reputation.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-200">
                  <div className="font-bold text-red-600">Supplier Failure</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Primary Root Cause</div>
                </div>
                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-200">
                  <div className="font-bold text-orange-600">Component Shortage</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Procurement Stockout</div>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-200">
                  <div className="font-bold text-amber-600">Production Delay</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Line 2 Body Bottleneck</div>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-200">
                  <div className="font-bold text-blue-600">Customer Delivery Lag</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">SLA Penalty Trigger</div>
                </div>
                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-200">
                  <div className="font-bold text-purple-600">Revenue Deferral</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Q4 Cash Flow Stress</div>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-200">
                  <div className="font-bold text-rose-600">Reputation Impact</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Fleet Tender Hesitation</div>
                </div>
              </div>
            </Card>

            {/* Scenario Analysis & Stress Testing (Sections 39 & 40) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4 border-border/80 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-foreground">Scenario Analysis Outcomes</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded border border-border/40 flex justify-between items-center">
                    <div>
                      <strong className="text-emerald-600">Best Case:</strong> Buffer stock deployed in 14 days, secondary supplier onboards on schedule.
                    </div>
                    <span className="font-mono font-bold text-muted-foreground">₹2.4 Cr</span>
                  </div>
                  <div className="p-2.5 rounded border border-border/40 flex justify-between items-center">
                    <div>
                      <strong className="text-blue-600">Expected Case:</strong> 3-week lead time stretch absorbed with partial overtime shifts.
                    </div>
                    <span className="font-mono font-bold text-muted-foreground">₹6.8 Cr</span>
                  </div>
                  <div className="p-2.5 rounded border border-border/40 flex justify-between items-center">
                    <div>
                      <strong className="text-amber-600">Adverse Case:</strong> 45-day fabrication halt, 600 vehicle deliveries deferred to Q1.
                    </div>
                    <span className="font-mono font-bold text-muted-foreground">₹14.2 Cr</span>
                  </div>
                  <div className="p-2.5 rounded border border-border/40 flex justify-between items-center">
                    <div>
                      <strong className="text-red-600">Severe / Extreme Case:</strong> Total export embargo, redesign of microcontroller required.
                    </div>
                    <span className="font-mono font-bold text-muted-foreground">₹38.5 Cr</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-border/80 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-foreground">Stress Testing Variables</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                    <span>Revenue Reduction (-15% Fleet Orders)</span>
                    <span className="font-mono font-bold text-rose-600">Impact: ₹28.2 Cr</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                    <span>Supplier Lead Time Increase (+60 Days)</span>
                    <span className="font-mono font-bold text-rose-600">Impact: ₹18.5 Cr</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                    <span>Currency Depreciation (USD/INR +8%)</span>
                    <span className="font-mono font-bold text-amber-600">Impact: ₹9.4 Cr</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-muted/30">
                    <span>Critical Plant Grid Outage (72 Hours)</span>
                    <span className="font-mono font-bold text-amber-600">Impact: ₹4.8 Cr</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: COMPLIANCE & AUDIT INTEGRATION (SECTIONS 30, 31, 37)
            ========================================================================= */}
        {activeTab === "compliance" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4 border-border/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <h4 className="text-sm font-bold text-foreground">Incident Integration Flow</h4>
                  <Badge variant="outline" className="text-[10px]">CAPA Linked</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Incident → Root Cause Analysis → Risk Identification → Assessment → CAPA Action → Control Enhancement.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded border border-border/40 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-foreground">INC-2026-088: Power Inverter MOSFET Fault</div>
                      <div className="text-[11px] text-muted-foreground">Triggered CAPA-2026-041 on Tier-1 Assembly</div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600">Resolved</Badge>
                  </div>
                  <div className="p-2.5 rounded border border-border/40 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-foreground">INC-2026-102: Telematics Token Expiry Spike</div>
                      <div className="text-[11px] text-muted-foreground">Linked to Cyber Risk ER-002</div>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-600">Under Review</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-border/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <h4 className="text-sm font-bold text-foreground">Audit Integration & Trail</h4>
                  <Badge variant="outline" className="text-[10px]">ISO 9001 / IATF 16949</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Audit Findings → Risk Master Log → Treatment Action → Independent Verification.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded border border-border/40 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-foreground">AUD-2026-Q2: Supplier Single-Source Vulnerability</div>
                      <div className="text-[11px] text-muted-foreground">Internal Quality Audit finding logged as ER-2026-001</div>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-600">Active Audit</Badge>
                  </div>
                  <div className="p-2.5 rounded border border-border/40 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-foreground">AUD-2026-CY: ISO 27001 Cloud Gateway Audit</div>
                      <div className="text-[11px] text-muted-foreground">External EY Security Certification Review</div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600">Compliant</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: BUSINESS CONTINUITY (SECTIONS 28 & 29)
            ========================================================================= */}
        {activeTab === "continuity" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs space-y-3">
              <h4 className="text-sm font-bold text-foreground">
                Business Continuity Plan & Disaster Recovery Parameters
              </h4>
              <p className="text-xs text-muted-foreground">
                Critical business process linkages for {activeRisk.title}.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Target RTO</div>
                  <div className="text-lg font-bold text-foreground">72 Hours</div>
                  <div className="text-[11px] text-muted-foreground">Maximum Tolerable Downtime before assembly stop</div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Target RPO</div>
                  <div className="text-lg font-bold text-foreground">Zero Data Loss</div>
                  <div className="text-[11px] text-muted-foreground">Continuous ERP & MES telemetric replication</div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Alternate Facility</div>
                  <div className="text-lg font-bold text-foreground">Chennai Plant 2</div>
                  <div className="text-[11px] text-muted-foreground">Secondary body shop and pack integration line</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/40 text-xs space-y-1">
                <div className="font-bold text-primary">Emergency Response Team & Contacts:</div>
                <div className="text-muted-foreground">
                  Crisis Lead: <strong>Deepak S. (Plant Director)</strong> · Supply Escalation: <strong>Karthik R. (VP SCM)</strong> · 24/7 Hotline: <strong>+91 (020) 6745-9000</strong>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 9: REPORTS - QUICK ACCESS TO 25 CONTROLLED RISK REPORTS (SECTION 50)
            ========================================================================= */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Enterprise Risk Controlled Reports Suite (25 Reports)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Standardized compliance documents for CXO, Audit Committee, and Board of Directors.
                  </CardDescription>
                </div>
                <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => window.print()}>
                  <Download className="h-3.5 w-3.5" />
                  Print Full Dossier
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {REPORT_DEFINITIONS.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-lg border border-border/60 hover:border-primary/50 transition-all bg-card flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-primary">{rep.id}</span>
                          <Badge variant="outline" className="text-[10px]">{rep.category}</Badge>
                        </div>
                        <div className="text-xs font-bold text-foreground mt-1">{rep.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                          {rep.description}
                        </div>
                      </div>
                      <div className="pt-2 mt-2 border-t border-border/30 flex justify-end">
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
            TAB 10: SETTINGS - MAICW CLASSIFICATION & GOVERNANCE RULES (SECTION 1 & 53)
            ========================================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Enterprise Risk Form — MAICW Classification Master
                </CardTitle>
                <CardDescription className="text-xs">
                  Field taxonomy and control rules: Mandatory (M), Automated (A), Input (I), Controlled (C), Workflow (W).
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
                    {MAICW_FORM_FIELDS.map((f) => (
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

            {/* Governance & Escalation Chain (Section 25 & 48) */}
            <Card className="p-4 border-border/80 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Risk Escalation Chain of Authority:
              </h4>
              <div className="flex items-center justify-between text-xs font-semibold gap-2 overflow-x-auto py-2">
                <span className="p-2 rounded bg-muted">Risk Owner (Karthik R.)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-muted">Function Head (Operations)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-amber-500/10 text-amber-700">Risk Committee</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-purple-500/10 text-purple-700">CXO (COO / CFO)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-rose-500/10 text-rose-700">CEO / Board of Directors</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: EDIT RISK DETAILS
          ========================================================================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Edit Risk: {activeRisk.id}</DialogTitle>
            <DialogDescription className="text-xs">
              Update controlled master information for this enterprise risk record.
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
                <label className="text-[11px] font-semibold text-muted-foreground">Owner</label>
                <Input
                  value={activeRisk.owner}
                  onChange={(e) => setActiveRisk({ ...activeRisk, owner: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Risk Statement</label>
              <textarea
                value={activeRisk.statement}
                onChange={(e) => setActiveRisk({ ...activeRisk, statement: e.target.value })}
                className="w-full mt-1 rounded border border-border p-2 text-xs h-20 bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground font-semibold"
              onClick={() => setIsEditModalOpen(false)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL: ADD NEW RISK
          ========================================================================= */}
      <Dialog open={isNewRiskModalOpen} onOpenChange={setIsNewRiskModalOpen}>
        <DialogContent className="max-w-lg text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Add New Enterprise Risk</DialogTitle>
            <DialogDescription className="text-xs">
              Create a new controlled risk record with MAICW fields.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Risk Title *</label>
              <Input placeholder="Enter risk statement title..." className="h-8 text-xs mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Category *</label>
                <select
                  aria-label="New Risk Category"
                  className="w-full mt-1 rounded border border-border bg-background px-2 py-1.5 text-xs font-medium"
                >
                  <option>Strategic</option>
                  <option>Financial</option>
                  <option>Operational</option>
                  <option>Technology</option>
                  <option>Cybersecurity</option>
                  <option>Product</option>
                  <option>Quality</option>
                  <option>Supply Chain</option>
                  <option>Compliance</option>
                  <option>People</option>
                  <option>Reputation</option>
                  <option>Business Continuity</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Owner *</label>
                <Input placeholder="Accountable risk owner" className="h-8 text-xs mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Likelihood (1-5)</label>
                <Input type="number" min={1} max={5} defaultValue={3} className="h-8 text-xs mt-1" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Impact (1-5)</label>
                <Input type="number" min={1} max={5} defaultValue={4} className="h-8 text-xs mt-1" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Statement (Because of...)</label>
              <textarea
                placeholder="Because of [Cause], [Event] may occur, resulting in [Consequence]..."
                className="w-full mt-1 rounded border border-border p-2 text-xs h-16 bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsNewRiskModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground font-semibold"
              onClick={() => setIsNewRiskModalOpen(false)}
            >
              Log Enterprise Risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default EnterpriseRiskPage;
