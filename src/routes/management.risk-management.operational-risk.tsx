import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getOperationalRiskRecordFn, listOperationalRiskRecordsFn } from "@/lib/operationalRiskFns.server";
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
  Wrench,
  Upload,
  Cpu,
  Truck,
  RotateCcw,
  Scale,
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
  operationalRiskService,
  PRIMARY_OP_RISK,
  TOP_OP_RISKS,
  FULL_OPERATIONAL_RISKS,
  OP_KRIS,
  OP_TREATMENT_ACTIONS,
  OP_INCIDENTS,
  OP_CATEGORY_DISTRIBUTION,
  OP_RISK_TREND,
  OP_AI_INSIGHTS,
  PRIMARY_OP_CONTROLS,
  OP_MAICW_FIELDS,
  type OpRiskRecord,
  type OpRiskCategory,
} from "@/services/operationalRiskService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/risk-management/operational-risk")({
  head: () => ({
    meta: [
      { title: "Operational Risk · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled Operational Risk Form, MAICW classification, process mapping, equipment risk, incident integration, and continuous improvement.",
      },
    ],
  }),
  component: OperationalRiskPage,
});

function OperationalRiskPage() {
  // --- Prisma-backed queries with inline fallback ---
  const { data: dbRecord } = useQuery({
    queryKey: ["operational-risk", "record"],
    queryFn: () => getOperationalRiskRecordFn({ data: {} }),
  });
  const { data: dbList } = useQuery({
    queryKey: ["operational-risk", "list"],
    queryFn: () => listOperationalRiskRecordsFn({ data: {} }),
  });

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeRisk, setActiveRisk] = useState<OpRiskRecord>(PRIMARY_OP_RISK);

  useEffect(() => {
    if (dbRecord?.data) setActiveRisk(dbRecord.data);
  }, [dbRecord]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRiskModalOpen, setIsNewRiskModalOpen] = useState(false);
  const [isLogIncidentModalOpen, setIsLogIncidentModalOpen] = useState(false);
  const [selectedRiskForModal, setSelectedRiskForModal] = useState<OpRiskRecord | null>(null);

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

  const allRisks = dbList?.data ?? FULL_OPERATIONAL_RISKS;

  const filteredRegister = useMemo(() => {
    return allRisks.filter((r) => {
      const matchesSearch =
        r.id.toLowerCase().includes(registerSearch.toLowerCase()) ||
        r.title.toLowerCase().includes(registerSearch.toLowerCase()) ||
        r.statement.toLowerCase().includes(registerSearch.toLowerCase()) ||
        r.owner.toLowerCase().includes(registerSearch.toLowerCase());
      const matchesCat = categoryFilter === "All" || r.category === categoryFilter;
      const matchesPri = priorityFilter === "All" || r.priority === priorityFilter;
      return matchesSearch && matchesCat && matchesPri;
    });
  }, [allRisks, registerSearch, categoryFilter, priorityFilter]);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Risk Code,Title,Category,Type,Owner,Inherent Score,Residual Score,Trend,Status"]
        .concat(
          allRisks.map(
            (r) =>
              `"${r.id}","${r.riskCode}","${r.title}","${r.category}","${r.type}","${r.owner}",${r.inherentScore},${r.residualScore},"${r.trend}","${r.status}"`,
          ),
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Operational_Risk_Register_${activeRisk.id}.csv`);
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
      title="Operational Risk"
      breadcrumb="Management > Risk Management > Operational Risk"
      description="Operational failure modes, shop-floor vulnerabilities, near misses, and preventive control measures."
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
                Operational Risk
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
              Safer Operations. Stronger Tomorrow.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <Button
              size="sm"
              className="h-8 text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 shrink-0"
              onClick={() => setIsNewRiskModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              New Risk
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 border-border shrink-0"
              onClick={handleExportCSV}
            >
              <Upload className="h-3.5 w-3.5 text-muted-foreground" />
              Import
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
                  Run Operational Assessment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsLogIncidentModalOpen(true)}>
                  Log Incident / Near Miss
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
              ← Back to Operational Risk Overview
            </Button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: OVERVIEW - 1:1 REPLICATION OF SCREENSHOT
            ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* ROW 1: 6 KPI CARDS WITH SPARKLINE BARS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Card 1: Total Operational Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↑ 12%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-blue-400 rounded-t h-1.5" />
                      <span className="w-1 bg-blue-400 rounded-t h-2" />
                      <span className="w-1 bg-blue-500 rounded-t h-2.5" />
                      <span className="w-1 bg-blue-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">36</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Total Operational Risks</div>
                </div>
              </Card>

              {/* Card 2: Critical Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-red-600 block">
                      ↑ 33%
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
                  <div className="text-xl font-extrabold text-foreground">8</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Critical Risks</div>
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
                      ↓ 8%
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
                  <div className="text-xl font-extrabold text-foreground">10</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Medium Risks</div>
                </div>
              </Card>

              {/* Card 5: Low Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↓ 25%
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
                  <div className="text-xl font-extrabold text-foreground">6</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Low Risks</div>
                </div>
              </Card>

              {/* Card 6: Open Actions */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-red-600 block">
                      ↑ 40%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-purple-400 rounded-t h-1" />
                      <span className="w-1 bg-purple-400 rounded-t h-2" />
                      <span className="w-1 bg-purple-500 rounded-t h-2.5" />
                      <span className="w-1 bg-purple-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">14</div>
                  <div className="text-[11px] font-semibold text-muted-foreground">Open Actions</div>
                </div>
              </Card>
            </div>

            {/* ROW 2: RISK DETAILS, RISK STATEMENT, RISK HEAT MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: Risk Details (5 cols on xl, full width on lg) */}
              <Card className="lg:col-span-12 xl:col-span-5 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
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

                <div className="space-y-2.5 pt-2 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">Risk Title *</label>
                    <Input
                      readOnly
                      value={activeRisk.title}
                      className="h-7 text-xs font-semibold mt-0.5 bg-muted/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Risk Category *</label>
                      <select
                        aria-label="Risk Category"
                        value={activeRisk.category}
                        onChange={(e) => setActiveRisk({ ...activeRisk, category: e.target.value as OpRiskCategory })}
                        className="w-full mt-0.5 rounded border border-border bg-background px-2 py-1 text-xs font-medium"
                      >
                        <option value="Supply Chain">Supply Chain</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Process">Process</option>
                        <option value="Technology">Technology</option>
                        <option value="Quality">Quality</option>
                        <option value="People">People</option>
                        <option value="Facility">Facility</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Risk Type *</label>
                      <select
                        aria-label="Risk Type"
                        value={activeRisk.type}
                        onChange={(e) => setActiveRisk({ ...activeRisk, type: e.target.value as any })}
                        className="w-full mt-0.5 rounded border border-border bg-background px-2 py-1 text-xs font-medium"
                      >
                        <option value="Existing">Existing</option>
                        <option value="Emerging">Emerging</option>
                        <option value="Incident">Incident</option>
                        <option value="Residual">Residual</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Business Function</label>
                      <select
                        aria-label="Business Function"
                        defaultValue="Operations"
                        className="w-full mt-0.5 rounded border border-border bg-background px-1.5 py-1 text-[11px]"
                      >
                        <option>Operations</option>
                        <option>Manufacturing</option>
                        <option>Quality</option>
                        <option>Supply Chain</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Department</label>
                      <select
                        aria-label="Department"
                        defaultValue="Production"
                        className="w-full mt-0.5 rounded border border-border bg-background px-1.5 py-1 text-[11px]"
                      >
                        <option>Production</option>
                        <option>Assembly</option>
                        <option>Maintenance</option>
                        <option>Testing</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Business Process</label>
                      <select
                        aria-label="Business Process"
                        defaultValue="Procurement"
                        className="w-full mt-0.5 rounded border border-border bg-background px-1.5 py-1 text-[11px]"
                      >
                        <option>Procurement</option>
                        <option>Assembly</option>
                        <option>Welding</option>
                        <option>Testing</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Sub-Process</label>
                      <select
                        aria-label="Sub-Process"
                        defaultValue="Supplier Management"
                        className="w-full mt-0.5 rounded border border-border bg-background px-1.5 py-1 text-[11px]"
                      >
                        <option>Supplier Management</option>
                        <option>Material Kitting</option>
                        <option>In-Line Inspection</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Work Center</label>
                      <Input
                        readOnly
                        value={activeRisk.workCenter ?? "Main Plant - Coimbatore"}
                        className="h-7 text-[11px] mt-0.5 bg-muted/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Affected Asset</label>
                      <Input
                        readOnly
                        value={activeRisk.affectedAsset ?? "Power Electronics Components"}
                        className="h-7 text-[11px] mt-0.5 bg-muted/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/40">
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Risk Owner</label>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[9px]">
                          RS
                        </div>
                        <span className="font-semibold text-foreground text-[11px]">{activeRisk.owner}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground">Risk Coordinator</label>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="h-5 w-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[9px]">
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

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40 text-[11px]">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span>Id Date: <strong className="text-foreground">{activeRisk.identificationDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span>Review: <strong className="text-foreground">{activeRisk.reviewDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Lock className="h-3 w-3 text-primary" />
                      <span>Confidentiality: <strong className="text-foreground">{activeRisk.confidentiality}</strong></span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Middle: Risk Statement & 2x3 Impact Grid (3 cols on xl, 6 cols on lg) */}
              <Card className="lg:col-span-6 xl:col-span-3 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk Statement</h3>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="relative pl-5 pr-2 py-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 text-xs italic text-slate-800 dark:text-slate-200 leading-relaxed">
                    <span className="absolute left-1.5 top-1.5 text-xl text-primary/40 font-serif leading-none">“</span>
                    {activeRisk.statement}
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Business Impact
                    </h4>
                    {/* 2x3 Grid matching Screenshot */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {activeRisk.businessImpacts.map((imp) => (
                        <div
                          key={imp.area}
                          className="p-1.5 rounded border border-border/60 bg-muted/20 text-center space-y-0.5"
                        >
                          <div className="text-[10px] font-bold text-foreground truncate">{imp.area}</div>
                          <Badge
                            className={cn(
                              "text-[9px] px-1 py-0 font-bold",
                              imp.level === "High"
                                ? "bg-red-500/15 text-red-600 border border-red-200"
                                : "bg-amber-500/15 text-amber-700 border border-amber-200",
                            )}
                          >
                            {imp.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Right: Risk Heat Map (5x5 Matrix) with Inherent Dropdown (4 cols on xl, 6 cols on lg) */}
              <Card className="lg:col-span-6 xl:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Risk Heat Map</h3>
                  <select
                    aria-label="Heat Map Mode"
                    className="text-[10px] font-semibold border border-border rounded px-1.5 py-0.5 bg-background"
                  >
                    <option>Inherent Risk</option>
                    <option>Residual Risk</option>
                  </select>
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
                          <span className="w-3 text-[9px] font-bold text-right text-muted-foreground">
                            {l}
                          </span>
                          <div className="grid grid-cols-5 gap-1 flex-1">
                            {[1, 2, 3, 4, 5].map((i) => {
                              const isTarget = l === 5 && i === 5;
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
                        <span className="w-3" />
                        <div className="grid grid-cols-5 gap-1 flex-1 text-center">
                          <span className="text-[9px] font-bold text-muted-foreground">1</span>
                          <span className="text-[9px] font-bold text-muted-foreground">2</span>
                          <span className="text-[9px] font-bold text-muted-foreground">3</span>
                          <span className="text-[9px] font-bold text-muted-foreground">4</span>
                          <span className="text-[9px] font-bold text-muted-foreground">5</span>
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

            {/* ROW 3: RISK TREND (INHERENT VS RESIDUAL), TOP OPERATIONAL RISKS, KRI */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: Risk Trend */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Risk Trend</h3>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1 font-semibold text-red-600">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Inherent Risk
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-blue-600">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Residual Risk
                    </span>
                  </div>
                </div>

                <div className="h-[170px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={OP_RISK_TREND} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 9 }} />
                      <YAxis tickLine={false} tick={{ fontSize: 9 }} domain={[0, 25]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="inherentRisk"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#EF4444" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="residualRisk"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#3B82F6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Middle: Top Operational Risks */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Top Operational Risks</h3>
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
                      {TOP_OP_RISKS.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => setActiveRisk(r)}
                          className={`border-b border-border/20 cursor-pointer transition-colors ${
                            activeRisk.id === r.id ? "bg-primary/5 font-semibold" : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="py-1.5 font-mono text-[10px] text-primary">{r.id}</td>
                          <td className="py-1.5 text-[10px] max-w-[110px] truncate" title={r.title}>
                            {r.title}
                          </td>
                          <td className="py-1.5 text-[10px] text-muted-foreground">{r.category}</td>
                          <td className="py-1.5 text-center">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded text-[9px] font-bold font-mono",
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
                                "px-1.5 py-0.2 rounded text-[9px] font-bold font-mono",
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
                          <td className="py-1.5 text-center font-bold text-[10px]">
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
                                "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
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

                  {OP_KRIS.slice(0, 5).map((kri) => (
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

            {/* ROW 4: RISK TREATMENT PLAN, RISK BY CATEGORY, RECENT INCIDENTS / NEAR MISSES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: Risk Treatment Plan */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Risk Treatment Plan</h3>
                  <button
                    onClick={() => setActiveTab("actions")}
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
                      {OP_TREATMENT_ACTIONS.map((a) => (
                        <tr key={a.id} className="border-b border-border/20 hover:bg-muted/30">
                          <td className="py-1.5 text-[10px] font-medium text-foreground max-w-[120px] truncate" title={a.action}>
                            {a.action}
                          </td>
                          <td className="py-1.5 text-[10px] text-muted-foreground">{a.owner}</td>
                          <td className="py-1.5 font-mono text-[10px] text-muted-foreground">{a.dueDate}</td>
                          <td className="py-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded text-[9px] font-bold",
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

              {/* Middle: Risk by Category */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk by Category</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 items-center pt-2">
                  <div className="h-[170px] relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={OP_CATEGORY_DISTRIBUTION}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {OP_CATEGORY_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-extrabold text-foreground leading-none">36</span>
                      <span className="text-[10px] font-semibold text-muted-foreground">Total Risks</span>
                    </div>
                  </div>

                  <div className="space-y-1 max-h-[170px] overflow-y-auto pr-1 text-[11px]">
                    {OP_CATEGORY_DISTRIBUTION.map((c) => (
                      <div key={c.name} className="flex items-center justify-between py-0.5 border-b border-border/20">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                          <span className="font-medium text-foreground text-[10px] truncate max-w-[70px]">
                            {c.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span className="text-muted-foreground">{c.percentage}%</span>
                          <span className="font-bold text-foreground w-3 text-right">({c.count})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Right: Recent Incidents / Near Misses */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Recent Incidents / Near Misses</h3>
                  <button
                    onClick={() => setActiveTab("incidents")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="pt-1 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-[9px] font-bold text-muted-foreground uppercase">
                        <th className="py-1">Date</th>
                        <th className="py-1">Type</th>
                        <th className="py-1">Description</th>
                        <th className="py-1">Impact</th>
                        <th className="py-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OP_INCIDENTS.map((inc) => (
                        <tr key={inc.id} className="border-b border-border/20 hover:bg-muted/30">
                          <td className="py-1.5 font-mono text-[10px] text-muted-foreground">{inc.date}</td>
                          <td className="py-1.5 text-[10px] font-semibold text-foreground">{inc.type}</td>
                          <td className="py-1.5 text-[10px] text-foreground max-w-[120px] truncate" title={inc.description}>
                            {inc.description}
                          </td>
                          <td className="py-1.5 text-[10px] text-muted-foreground">{inc.impact}</td>
                          <td className="py-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                                inc.status === "Closed"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : inc.status === "Investigation"
                                    ? "bg-blue-500/10 text-blue-600"
                                    : "bg-teal-500/10 text-teal-600",
                              )}
                            >
                              {inc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* ROW 5: AI RISK INSIGHTS & QUICK ACTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left: AI Risk Insights */}
              <Card className="lg:col-span-8 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">AI Risk Insights</h3>
                  <Badge className="bg-purple-600 text-white text-[9px] gap-1 px-1.5 py-0.2">
                    <Sparkles className="h-2.5 w-2.5" />
                    AI Powered
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
                  {OP_AI_INSIGHTS.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-border/60 bg-muted/15 flex items-start gap-2.5"
                    >
                      <div className={cn("h-7 w-7 rounded-full flex items-center justify-center shrink-0", item.color)}>
                        {item.icon === "Shield" ? (
                          <ShieldCheck className="h-4 w-4" />
                        ) : item.icon === "Activity" ? (
                          <Activity className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-[11px] text-foreground leading-snug font-medium">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Right: Quick Actions */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Quick Actions</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => setIsNewRiskModalOpen(true)}
                    className="p-2 rounded border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                  >
                    <Plus className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-semibold">Add Operational Risk</span>
                  </button>

                  <button
                    onClick={() => setIsLogIncidentModalOpen(true)}
                    className="p-2 rounded border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] font-semibold">Log Incident</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("actions")}
                    className="p-2 rounded border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                  >
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-semibold">Create Action</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("assessment")}
                    className="p-2 rounded border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                  >
                    <Scale className="h-4 w-4 text-blue-500" />
                    <span className="text-[10px] font-semibold">Run Risk Assessment</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("reports")}
                    className="p-2 rounded border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                  >
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span className="text-[10px] font-semibold">View Reports</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="p-2 rounded border border-border/60 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center text-center gap-1"
                  >
                    <Sparkles className="h-4 w-4 text-rose-500" />
                    <span className="text-[10px] font-semibold">Open AI Insights</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: RISK REGISTER - COMPLETE 36 OPERATIONAL RISKS
            ========================================================================= */}
        {activeTab === "register" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Operational Risk Register (36 Risks)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Controlled master portfolio of shop floor, process, equipment, and facility risks.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search operational risks..."
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
                      <option value="Equipment">Equipment</option>
                      <option value="Process">Process</option>
                      <option value="Technology">Technology</option>
                      <option value="Quality">Quality</option>
                      <option value="People">People</option>
                      <option value="Facility">Facility</option>
                      <option value="External">External</option>
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
                      <th className="p-3">Work Center</th>
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
                        <td className="p-3 text-muted-foreground">{r.workCenter ?? "Plant 1"}</td>
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
            TAB 3: RISK ASSESSMENT - INHERENT & RESIDUAL SCORING (SECTIONS 10-14, 17)
            ========================================================================= */}
        {activeTab === "assessment" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: Inherent Assessment */}
              <Card className="border-border/80 shadow-2xs">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-foreground">
                      Inherent Operational Risk (Pre-Controls)
                    </CardTitle>
                    <Badge className={inherentScore >= 17 ? "bg-red-500 text-white" : "bg-orange-500 text-white"}>
                      Score {inherentScore} · {inherentScore >= 17 ? "Critical" : "High"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Inherent Risk Score = Likelihood (1–5) × Impact (1–5) before existing shop floor controls.
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
                          ? "Severe Disruption"
                          : simImpact === 4
                            ? "Major Disruption"
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
                    <div className="text-[11px] font-bold text-foreground">Operational Disruption Areas (1-5):</div>
                    <div className="grid grid-cols-4 gap-2 text-[10px]">
                      <div>Production: <strong>5 / 5</strong></div>
                      <div>Delivery: <strong>5 / 5</strong></div>
                      <div>Quality: <strong>4 / 5</strong></div>
                      <div>Safety: <strong>3 / 5</strong></div>
                      <div>Customer: <strong>5 / 5</strong></div>
                      <div>Cost: <strong>4 / 5</strong></div>
                      <div>Technology: <strong>3 / 5</strong></div>
                      <div>Compliance: <strong>3 / 5</strong></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Residual Assessment */}
              <Card className="border-border/80 shadow-2xs">
                <CardHeader className="p-4 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-foreground">
                      Residual Operational Risk (Post-Controls)
                    </CardTitle>
                    <Badge className={residualScore >= 12 ? "bg-orange-500 text-white" : "bg-amber-500 text-white"}>
                      Score {residualScore} · {residualScore >= 12 ? "High" : "Moderate"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Flow: Inherent Risk (20) → Existing SOPs/Controls → Residual Risk (12).
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Residual Likelihood: {simResLikelihood}</span>
                      <span className="text-muted-foreground">Level {simResLikelihood}</span>
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
                      <span className="text-muted-foreground">Level {simResImpact}</span>
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
                      <span>Operational Appetite Status:</span>
                      <span className="text-amber-600">Near Tolerance</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Maximum Acceptable Level: <strong>8 (Moderate)</strong> · Target: <strong>4 (Low)</strong>.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: CONTROLS - EXISTING OPERATIONAL CONTROLS (SECTIONS 15 & 16)
            ========================================================================= */}
        {activeTab === "controls" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Existing Operational Controls & Effectiveness Audit
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Preventive, detective, automated, and manual controls connected to SOPs and work instructions.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  3 Controls Active
                </Badge>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Control ID</th>
                      <th className="p-3">Control Name & Type</th>
                      <th className="p-3">Control Objective</th>
                      <th className="p-3">Owner & Frequency</th>
                      <th className="p-3">Design Eff.</th>
                      <th className="p-3">Operating Eff.</th>
                      <th className="p-3">Related SOP</th>
                      <th className="p-3">Last Tested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIMARY_OP_CONTROLS.map((ctrl) => (
                      <tr key={ctrl.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{ctrl.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-foreground">{ctrl.name}</div>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-muted font-medium">
                            {ctrl.type} Control
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground max-w-[200px]">{ctrl.objective}</td>
                        <td className="p-3">
                          <div className="font-medium text-foreground">{ctrl.owner}</div>
                          <div className="text-[10px] text-muted-foreground">{ctrl.frequency}</div>
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
                        <td className="p-3 font-mono text-[10px] text-primary">{ctrl.relatedSOP}</td>
                        <td className="p-3 font-mono text-muted-foreground">{ctrl.lastTested}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 5: KRI MONITORING - OPERATIONAL KEY RISK INDICATORS (SECTIONS 20 & 21)
            ========================================================================= */}
        {activeTab === "kri" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Operational Key Risk Indicators (KRI) & Early Warning Signals
                </CardTitle>
                <CardDescription className="text-xs">
                  Telemetry monitoring machine downtime, defect rates, supply lead times, and SLA delivery.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">KRI ID</th>
                      <th className="p-3">Indicator Name & Metric</th>
                      <th className="p-3">Linked Risk</th>
                      <th className="p-3 text-right">Current Value</th>
                      <th className="p-3 text-right">Target</th>
                      <th className="p-3 text-right">Warning</th>
                      <th className="p-3 text-right">Critical</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OP_KRIS.map((k) => (
                      <tr key={k.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{k.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-foreground">{k.name}</div>
                          <div className="text-[11px] text-muted-foreground">{k.metric}</div>
                        </td>
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
                                : "bg-amber-500/10 text-amber-600",
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
          </div>
        )}

        {/* =========================================================================
            TAB 6: INCIDENTS & NEAR MISSES (SECTIONS 22 & 23)
            ========================================================================= */}
        {activeTab === "incidents" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Operational Incident & Near-Miss Log
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Linkage: Incident → Root Cause Analysis → Risk Identification → CAPA Action.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground"
                  onClick={() => setIsLogIncidentModalOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Log Incident / Near Miss
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Event Type</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Process Location</th>
                      <th className="p-3">Impact</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OP_INCIDENTS.map((inc) => (
                      <tr key={inc.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{inc.id}</td>
                        <td className="p-3 font-mono text-muted-foreground">{inc.date}</td>
                        <td className="p-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              inc.type === "Incident"
                                ? "bg-red-500/10 text-red-600 border border-red-200"
                                : "bg-amber-500/10 text-amber-700 border border-amber-200",
                            )}
                          >
                            {inc.type}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-foreground">{inc.description}</td>
                        <td className="p-3 text-muted-foreground">{inc.process}</td>
                        <td className="p-3">
                          <span
                            className={cn(
                              "px-1.5 py-0.2 rounded text-[10px] font-bold",
                              inc.impact === "High" ? "text-red-600" : "text-amber-600",
                            )}
                          >
                            {inc.impact}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold",
                              inc.status === "Closed"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : inc.status === "Investigation"
                                  ? "bg-blue-500/10 text-blue-600"
                                  : "bg-teal-500/10 text-teal-600",
                            )}
                          >
                            {inc.status}
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
            TAB 7: ACTION PLAN (SECTIONS 18 & 19)
            ========================================================================= */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Operational Risk Treatment Action Plan
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Lifecycle: Identified → Assigned → In Progress → Evidence Submitted → Verified → Closed.
                  </CardDescription>
                </div>
                <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground">
                  <Plus className="h-3.5 w-3.5" />
                  New Action Item
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
                    {OP_TREATMENT_ACTIONS.map((a) => (
                      <tr key={a.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{a.id}</td>
                        <td className="p-3 font-medium text-foreground">{a.action}</td>
                        <td className="p-3 font-semibold text-foreground">{a.owner}</td>
                        <td className="p-3 font-mono text-muted-foreground">{a.dueDate}</td>
                        <td className="p-3 font-mono font-bold text-foreground">{a.budget}</td>
                        <td className="p-3 text-muted-foreground text-[11px] max-w-[200px] truncate" title={a.evidence}>
                          {a.evidence}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              a.status === "In Progress"
                                ? "bg-blue-500/10 text-blue-600"
                                : a.status === "Open"
                                  ? "bg-rose-500/10 text-rose-600"
                                  : "bg-slate-500/10 text-slate-600",
                            )}
                          >
                            {a.status}
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
            TAB 8: RISK ANALYTICS - PROCESS MAPPING & SCENARIO ANALYSIS (SECTIONS 24-36)
            ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Workflow className="h-4 w-4 text-primary" />
                Process Hierarchy & Dependency Mapping (Section 5)
              </h4>
              <p className="text-xs text-muted-foreground">
                Business Function → Business Process → Sub-Process → Activity → Task.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 rounded bg-muted/40 border">
                  <div className="text-[10px] text-muted-foreground">Function</div>
                  <div className="font-bold text-foreground mt-0.5">Operations</div>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border">
                  <div className="text-[10px] text-muted-foreground">Process</div>
                  <div className="font-bold text-foreground mt-0.5">Procurement</div>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border">
                  <div className="text-[10px] text-muted-foreground">Sub-Process</div>
                  <div className="font-bold text-foreground mt-0.5">Supplier Management</div>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border">
                  <div className="text-[10px] text-muted-foreground">Activity</div>
                  <div className="font-bold text-foreground mt-0.5">Single-Source SCM</div>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border">
                  <div className="text-[10px] text-muted-foreground">Criticality</div>
                  <div className="font-bold text-red-600 mt-0.5">Critical (SOP-402)</div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4 border-border/80 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-foreground">Operational Scenario Analysis (Section 35)</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-muted/30 border flex justify-between">
                    <div><strong>Equipment Breakdown:</strong> Chroma 8000 tester cooling failure.</div>
                    <span className="font-mono text-red-600 font-bold">18h Downtime</span>
                  </div>
                  <div className="p-2 rounded bg-muted/30 border flex justify-between">
                    <div><strong>Critical Supplier Stoppage:</strong> Power IC fab supply halt.</div>
                    <span className="font-mono text-red-600 font-bold">45d Delay</span>
                  </div>
                  <div className="p-2 rounded bg-muted/30 border flex justify-between">
                    <div><strong>Plant Power Blackout:</strong> Main substation 110kV trip.</div>
                    <span className="font-mono text-amber-600 font-bold">6h Delay</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-border/80 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-foreground">Operational Stress Testing (Section 36)</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded bg-muted/30">
                    <span>Assembly Line Downtime (+48h)</span>
                    <span className="font-mono font-bold text-red-600">Output: -90 Vehicles</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/30">
                    <span>Supplier Lead Time Stretch (+30d)</span>
                    <span className="font-mono font-bold text-red-600">Working Capital: ₹4.8 Cr</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/30">
                    <span>Shop Floor Scrap Surge (+400 PPM)</span>
                    <span className="font-mono font-bold text-amber-600">Rework Cost: ₹1.2 Cr</span>
                  </div>
                </div>
              </Card>
            </div>
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
                    Operational Risk Controlled Reports Suite (Section 47)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Comprehensive compliance documents for shop floor, equipment, process, and plant operations.
                  </CardDescription>
                </div>
                <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => window.print()}>
                  <Download className="h-3.5 w-3.5" />
                  Print Full Dossier
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: "OR-REP-01", name: "Operational Risk Register", desc: "Complete operational risk portfolio with inherent/residual scores" },
                    { id: "OR-REP-02", name: "Process Risk Report", desc: "Risk distribution mapped by business process and work center" },
                    { id: "OR-REP-03", name: "Equipment & Machine Risk", desc: "MTBF, MTTR, preventive maintenance compliance, and downtime" },
                    { id: "OR-REP-04", name: "Incident & Near-Miss Log", desc: "Summary of shop floor incidents, CAPA root causes, and closures" },
                    { id: "OR-REP-05", name: "Operational KRI Report", desc: "Machine downtime, defect rate PPM, and delivery SLA indicators" },
                    { id: "OR-REP-06", name: "Control Effectiveness Audit", desc: "Design and operating effectiveness audit of shop floor controls" },
                  ].map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-lg border border-border/60 hover:border-primary/50 transition-all bg-card flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-mono text-[10px] font-bold text-primary">{r.id}</span>
                        <div className="text-xs font-bold text-foreground mt-1">{r.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{r.desc}</div>
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
            TAB 10: SETTINGS - MAICW CLASSIFICATION & GOVERNANCE RULES (SECTION 1, 38, 50)
            ========================================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Operational Risk Form — MAICW Classification Master
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
                    {OP_MAICW_FIELDS.map((f) => (
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
                Operational Escalation Chain (Section 38):
              </h4>
              <div className="flex items-center justify-between text-xs font-semibold gap-2 overflow-x-auto py-2">
                <span className="p-2 rounded bg-muted">Risk Owner (Ramesh S.)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-muted">Department Head (Production)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-amber-500/10 text-amber-700">Operations Head</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-purple-500/10 text-purple-700">Risk Management</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-rose-500/10 text-rose-700">COO / CXO</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-rose-500/10 text-rose-700">CEO / Board</span>
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
            <DialogTitle className="text-sm font-bold">Edit Operational Risk: {activeRisk.id}</DialogTitle>
            <DialogDescription className="text-xs">
              Update controlled master information for this operational risk record.
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
          MODAL: ADD NEW OPERATIONAL RISK
          ========================================================================= */}
      <Dialog open={isNewRiskModalOpen} onOpenChange={setIsNewRiskModalOpen}>
        <DialogContent className="max-w-lg text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Log New Operational Risk</DialogTitle>
            <DialogDescription className="text-xs">
              Create a new operational risk record with MAICW fields.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Risk Title *</label>
              <Input placeholder="Enter operational risk statement..." className="h-8 text-xs mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Category *</label>
                <select
                  aria-label="New Op Risk Category"
                  className="w-full mt-1 rounded border border-border bg-background px-2 py-1.5 text-xs font-medium"
                >
                  <option>Process</option>
                  <option>People</option>
                  <option>Equipment</option>
                  <option>Technology</option>
                  <option>Material</option>
                  <option>Supply Chain</option>
                  <option>Facility</option>
                  <option>Quality</option>
                  <option>External</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Work Center *</label>
                <Input placeholder="Main Plant - Coimbatore" className="h-8 text-xs mt-1" />
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
              <label className="text-[11px] font-semibold text-muted-foreground">Risk Statement</label>
              <textarea
                placeholder="Because of [Operational Cause], [Risk Event] may occur, resulting in [Disruption]..."
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
              Save Operational Risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL: LOG INCIDENT / NEAR MISS
          ========================================================================= */}
      <Dialog open={isLogIncidentModalOpen} onOpenChange={setIsLogIncidentModalOpen}>
        <DialogContent className="max-w-lg text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Log Operational Incident or Near Miss</DialogTitle>
            <DialogDescription className="text-xs">
              Capture shop floor events to trigger root cause analysis and control improvements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Event Type</label>
                <select
                  aria-label="Incident Type"
                  className="w-full mt-1 rounded border border-border bg-background px-2 py-1.5 text-xs font-medium"
                >
                  <option>Incident</option>
                  <option>Near Miss</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Process Location</label>
                <Input placeholder="e.g. Testing Bay 2" className="h-8 text-xs mt-1" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Event Description</label>
              <textarea
                placeholder="Detail what occurred or was nearly avoided..."
                className="w-full mt-1 rounded border border-border p-2 text-xs h-16 bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsLogIncidentModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground font-semibold"
              onClick={() => setIsLogIncidentModalOpen(false)}
            >
              Submit Event Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

