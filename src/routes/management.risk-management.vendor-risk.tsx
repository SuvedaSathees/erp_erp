import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
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
  Truck,
  ShieldCheck,
  ShieldAlert,
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
import { toast } from "sonner";
import {
  vendorRiskService,
  PRIMARY_VENDOR_RISK,
  TOP_VENDOR_RISKS,
  FULL_VENDOR_RISKS,
  VENDOR_KRIS,
  VENDOR_TREATMENT_ACTIONS,
  VENDOR_RISK_TREND,
  VENDOR_CATEGORY_DISTRIBUTION,
  VENDOR_AI_INSIGHTS,
  VENDOR_DUE_DILIGENCE_DATA,
  VENDOR_CONTROLS_MASTER,
  VENDOR_MAICW_FIELDS,
  VENDOR_REPORT_DEFINITIONS,
  type VendorRiskRecord,
} from "@/services/vendorRiskService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/risk-management/vendor-risk")({
  head: () => ({
    meta: [
      { title: "Vendor Risk · Magnertia ERP" },
      {
        name: "description",
        content:
          "Controlled ERP master and transaction for identifying, classifying, treating, and monitoring third-party supplier, contractor, and vendor risks.",
      },
    ],
  }),
  component: VendorRiskPage,
});

export function VendorRiskPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [matrixView, setMatrixView] = useState<"Inherent" | "Residual">("Inherent");
  const [activeRisk, setActiveRisk] = useState<VendorRiskRecord>(PRIMARY_VENDOR_RISK);
  const [allRisks, setAllRisks] = useState<VendorRiskRecord[]>(FULL_VENDOR_RISKS);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRiskModalOpen, setIsNewRiskModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredRisks = useMemo(() => {
    return allRisks.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.procurementCategory.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === "All" || r.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [allRisks, searchQuery, categoryFilter]);

  const handleExportCSV = () => {
    const headers = [
      "Risk ID",
      "Risk Code",
      "Title",
      "Vendor ID",
      "Vendor Name",
      "Category",
      "Tier",
      "Owner",
      "Status",
      "Priority",
      "Inherent Score",
      "Residual Score",
      "Production Impact",
      "Cost Impact",
    ];
    const rows = filteredRisks.map((r) => [
      r.id,
      r.riskCode,
      `"${r.title.replace(/"/g, '""')}"`,
      r.vendorId,
      `"${r.vendorName}"`,
      r.category,
      r.vendorTier,
      r.riskOwner,
      r.status,
      r.priority,
      r.inherentScore,
      r.residualScore,
      r.impacts.productionImpact,
      r.impacts.costImpact,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vendor_Risk_Register_${activeRisk.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveRisk = (updated: VendorRiskRecord) => {
    setActiveRisk(updated);
    setAllRisks((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setIsEditModalOpen(false);
  };

  return (
    <AppShell
      title="Vendor Risk"
      breadcrumb="Management > Risk Management > Vendor Risk"
      description="Third-party vendor health, supply chain tier dependencies, concentration risks, and SLA compliance."
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
                Vendor Risk
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
              Stronger Partners. Lower Risk. Sustainable Supply Chain.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-primary text-primary-foreground text-xs font-semibold shadow-xs"
              onClick={() => setIsNewRiskModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              New Risk
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
                <DropdownMenuItem onClick={handleExportCSV}>
                  <Download className="h-3.5 w-3.5 mr-2" /> Export Register (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("duediligence")}>
                  <ShieldCheck className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Due Diligence Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("controls")}>
                  <Target className="h-3.5 w-3.5 mr-2 text-blue-600" /> Audit Vendor Controls
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const escalated: VendorRiskRecord = {
                      ...activeRisk,
                      priority: "Critical",
                      status: "Under Review",
                    };
                    setActiveRisk(escalated);
                    setAllRisks((prev) =>
                      prev.map((r) => (r.id === escalated.id ? escalated : r)),
                    );
                    toast({
                      title: "Vendor Risk Escalated",
                      description: `${escalated.riskCode} escalated to Head of Procurement & Risk Committee.`,
                    });
                  }}
                >
                  <AlertOctagon className="h-3.5 w-3.5 mr-2 text-red-600" /> Escalate to Risk Committee
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono bg-muted/60 px-2.5 py-1 rounded-md border border-border/40 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Fri, 18 Sep 2026
            </div>
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
              ← Back to Vendor Risk Overview
            </Button>
          </div>
        )}

        {/* =========================================================================
            EXECUTIVE DASHBOARD (SCREENSHOT 1:1 REPLICATION)
            ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* ROW 1: 7 EXECUTIVE METRIC CARDS (EXACT SCREENSHOT LAYOUT) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {/* Card 1: Total Vendor Risks */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">
                      ↑ 15%
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
                  <div className="text-xl font-extrabold text-foreground">48</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Total Vendor Risks
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
                  <div className="text-xl font-extrabold text-foreground">9</div>
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
                      ↑ 17%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-orange-300 rounded-t h-1.5" />
                      <span className="w-1 bg-orange-400 rounded-t h-2" />
                      <span className="w-1 bg-orange-500 rounded-t h-2.5" />
                      <span className="w-1 bg-orange-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">14</div>
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
                      ↓ 11%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-amber-400 rounded-t h-3" />
                      <span className="w-1 bg-amber-400 rounded-t h-2.5" />
                      <span className="w-1 bg-amber-400 rounded-t h-2" />
                      <span className="w-1 bg-amber-500 rounded-t h-1.5" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">16</div>
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
                  <div className="text-xl font-extrabold text-foreground">9</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Low Risks
                  </div>
                </div>
              </Card>

              {/* Card 6: Single Source */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-red-600 block">
                      ↑ 20%
                    </span>
                    <div className="flex items-end gap-0.5 mt-0.5 justify-end h-3">
                      <span className="w-1 bg-purple-300 rounded-t h-1.5" />
                      <span className="w-1 bg-purple-400 rounded-t h-2" />
                      <span className="w-1 bg-purple-500 rounded-t h-2.5" />
                      <span className="w-1 bg-purple-600 rounded-t h-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-extrabold text-foreground">6</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Single Source
                  </div>
                </div>
              </Card>

              {/* Card 7: Total Exposure */}
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
                  <div className="text-xl font-extrabold text-foreground">₹ 12.5 Cr</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Total Exposure
                  </div>
                </div>
              </Card>
            </div>

            {/* ROW 2: VENDOR RISK DETAILS, RISK STATEMENT, RISK HEAT MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (5 cols on xl, full width on lg): Vendor Risk Details */}
              <Card className="lg:col-span-12 xl:col-span-5 p-4 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Vendor Risk Details</h3>
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
                        Vendor <span className="text-red-500">*</span>
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 flex items-center justify-between truncate">
                        <span className="truncate">{activeRisk.vendorName} ({activeRisk.vendorId})</span>
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
                        Vendor Type
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.vendorType}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Vendor Tier
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.vendorTier}
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
                  </div>

                  <div className="grid grid-cols-3 gap-2">
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
                        Procurement Category
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.procurementCategory}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Related Contract
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.contractId ?? "CON-2025-014"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        PO / Agreement
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.poNumber ?? "PO-450032"}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Project (Optional)
                      </label>
                      <div className="font-medium text-foreground mt-0.5 p-1.5 bg-muted/40 rounded border border-border/40 truncate">
                        {activeRisk.project ?? "PRJ-001 - W-EVSE"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1 border-t border-border/40">
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
                        Vendor Manager
                      </label>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                          {activeRisk.vendorManagerAvatar ?? "RK"}
                        </span>
                        <span className="font-semibold text-foreground truncate">
                          {activeRisk.vendorManager}
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

                  <div className="grid grid-cols-4 gap-2 pt-1 border-t border-border/40">
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
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Contract Expiry
                      </label>
                      <div className="font-medium text-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {activeRisk.contractExpiry ?? "31-Mar-2028"}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Confidentiality
                      </label>
                      <div className="font-medium text-foreground mt-0.5">
                        {activeRisk.confidentiality}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Center Column (3 cols on xl, 6 cols on lg): Risk Statement & Business Impact */}
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

                {/* Business Impact 2x2 Grid */}
                <Card className="p-3.5 border-border/80 shadow-2xs bg-card">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border/40">
                    Business Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {/* Production Impact */}
                    <div className="p-2.5 rounded-lg border border-red-200 bg-red-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-red-500 text-white flex items-center justify-center shrink-0">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">
                          Production
                        </div>
                        <div className="text-xs font-extrabold text-red-600">
                          {activeRisk.impacts.productionImpact}
                        </div>
                      </div>
                    </div>

                    {/* Schedule Impact */}
                    <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4" />
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
                    <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        ₹
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">Cost</div>
                        <div className="text-xs font-extrabold text-red-600">
                          {activeRisk.impacts.costImpact}
                        </div>
                      </div>
                    </div>

                    {/* Customer Impact */}
                    <div className="p-2.5 rounded-lg border border-orange-200 bg-orange-500/5 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md bg-orange-500 text-white flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold">
                          Customer
                        </div>
                        <div className="text-xs font-extrabold text-amber-600">
                          {activeRisk.impacts.customerImpact}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Bottom Summary Tags from screenshot */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 mt-2 border-t border-border/40 text-center">
                    <div className="p-1 rounded bg-muted/40">
                      <span className="text-[9px] text-muted-foreground font-bold block">
                        Affected Product
                      </span>
                      <span className="text-[10px] font-semibold text-foreground truncate block">
                        {activeRisk.affectedProduct ?? "30 kW Charging Station"}
                      </span>
                    </div>
                    <div className="p-1 rounded bg-muted/40">
                      <span className="text-[9px] text-muted-foreground font-bold block">
                        Affected Process
                      </span>
                      <span className="text-[10px] font-semibold text-foreground truncate block">
                        {activeRisk.affectedProcess ?? "Component Procurement"}
                      </span>
                    </div>
                    <div className="p-1 rounded bg-muted/40">
                      <span className="text-[9px] text-muted-foreground font-bold block">
                        Affected Milestone
                      </span>
                      <span className="text-[10px] font-semibold text-foreground truncate block">
                        {activeRisk.affectedMilestone ?? "Prototype Build (M-02)"}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column (4 cols on xl, 6 cols on lg): Risk Heat Map */}
              <Card className="lg:col-span-6 xl:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Risk Heat Map</h3>
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
                                // (5, 5) -> black/red circle marker with dot
                                // (4, 4) -> blue/white circle marker
                                // (2, 2) -> green/white circle marker
                                const isBubble55 = lik === 5 && imp === 5;
                                const isBubble44 = lik === 4 && imp === 4;
                                const isBubble22 = lik === 2 && imp === 2;

                                return (
                                  <div
                                    key={imp}
                                    title={`Likelihood ${lik} × Impact ${imp} = ${score}`}
                                    className={cn(
                                      "h-6 rounded flex items-center justify-center text-[10px] font-bold text-white transition-transform hover:scale-105 cursor-pointer relative",
                                      bg,
                                    )}
                                  >
                                    {isBubble55 && (
                                      <div className="h-4 w-4 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow-xs">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                      </div>
                                    )}
                                    {isBubble44 && (
                                      <div className="h-4 w-4 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-xs">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                      </div>
                                    )}
                                    {isBubble22 && (
                                      <div className="h-4 w-4 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center shadow-xs">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                      </div>
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
                    <LineChart data={VENDOR_RISK_TREND}>
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
                          data={VENDOR_CATEGORY_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="count"
                        >
                          {VENDOR_CATEGORY_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-base font-black text-foreground">48</span>
                      <span className="text-[9px] font-bold text-muted-foreground">Total Risks</span>
                    </div>
                  </div>

                  <div className="col-span-7 space-y-1 text-[10px] pl-1 max-h-48 overflow-y-auto no-scrollbar">
                    {VENDOR_CATEGORY_DISTRIBUTION.map((cat) => (
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
                      {VENDOR_KRIS.map((kri) => (
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
                                  : "bg-amber-500/10 text-amber-700",
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  kri.status === "Red" ? "bg-red-500" : "bg-amber-500",
                                )}
                              />
                              {kri.status}
                            </span>
                          </td>
                          <td className="p-1.5 text-center font-bold">
                            <span
                              className={cn(
                                kri.trend === "up" && "text-red-500",
                                kri.trend === "down" && "text-red-500",
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

            {/* ROW 4: TOP VENDOR RISKS, RISK TREATMENT ACTIONS, AI VENDOR RISK INSIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (4 cols): Top Vendor Risks */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <h3 className="text-sm font-bold text-foreground">Top Vendor Risks</h3>
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
                        <th className="p-1.5">Vendor</th>
                        <th className="p-1.5">Category</th>
                        <th className="p-1.5 text-center">Inh</th>
                        <th className="p-1.5 text-center">Res</th>
                        <th className="p-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-[11px]">
                      {TOP_VENDOR_RISKS.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/30">
                          <td className="p-1.5 font-mono font-bold text-primary">{r.id}</td>
                          <td className="p-1.5 font-semibold text-foreground truncate max-w-[100px]">
                            {r.title}
                          </td>
                          <td className="p-1.5 text-muted-foreground truncate max-w-[80px]">
                            {r.vendor}
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
                                "px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap",
                                r.status === "Monitoring"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : r.status === "Escalated"
                                    ? "bg-rose-500/10 text-rose-600"
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
                      {VENDOR_TREATMENT_ACTIONS.map((act) => (
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

              {/* Right Column (4 cols): AI Vendor Risk Insights */}
              <Card className="lg:col-span-4 p-3.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-foreground">
                      AI Vendor Risk Insights
                    </h3>
                  </div>
                  <Badge className="bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5">
                    AI Powered
                  </Badge>
                </div>

                {/* 6 AI Bullet Points matching screenshot */}
                <div className="space-y-1.5 py-1 text-xs">
                  {VENDOR_AI_INSIGHTS.map((item) => (
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

                {/* Quick actions at bottom */}
                <div className="grid grid-cols-4 gap-1 pt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 flex flex-col items-center justify-center gap-0.5 leading-none"
                    onClick={() => setIsNewRiskModalOpen(true)}
                  >
                    <Plus className="h-3 w-3 text-primary" />
                    <span>Add Risk</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 flex flex-col items-center justify-center gap-0.5 leading-none"
                    onClick={() => setActiveTab("duediligence")}
                  >
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    <span>Due Diligence</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] px-1 flex flex-col items-center justify-center gap-0.5 leading-none"
                    onClick={() => setActiveTab("performance")}
                  >
                    <Activity className="h-3 w-3 text-primary" />
                    <span>Audit</span>
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
                    Vendor Risk Register (48 Active Risks)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Supply chain, delivery, quality, financial, and cybersecurity exposures mapped to third-party suppliers.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-48">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search risks or vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                  <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setIsNewRiskModalOpen(true)}>
                    <Plus className="h-3.5 w-3.5" /> New Risk
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Risk ID</th>
                      <th className="p-3">Risk Title</th>
                      <th className="p-3">Vendor</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Tier</th>
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
                        <td className="p-3 text-muted-foreground font-medium">{r.vendorName}</td>
                        <td className="p-3">{r.category}</td>
                        <td className="p-3 text-muted-foreground">{r.vendorTier}</td>
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
                                : r.status === "Escalated"
                                  ? "bg-rose-500/10 text-rose-600"
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
            TAB 3: DUE DILIGENCE (SECTION 6)
            ========================================================================= */}
        {activeTab === "duediligence" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Vendor Due Diligence & Dependency Assessment (Sections 5 & 6)
                </CardTitle>
                <CardDescription className="text-xs">
                  Financial health, quality certifications, cyber risk posture, single-source dependency, and switching cost analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Vendor</th>
                      <th className="p-3 text-center">Financial Score</th>
                      <th className="p-3 text-center">Quality Score</th>
                      <th className="p-3 text-center">Cyber Score</th>
                      <th className="p-3 text-center">ESG Score</th>
                      <th className="p-3 text-center">Single Source?</th>
                      <th className="p-3 text-center">Switching Time</th>
                      <th className="p-3 text-right">Switching Cost</th>
                      <th className="p-3 text-right">Due Diligence Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VENDOR_DUE_DILIGENCE_DATA.map((dd) => (
                      <tr key={dd.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-semibold text-foreground">
                          {dd.vendorName} ({dd.vendorId})
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-foreground">
                          {dd.financialScore}/100
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-foreground">
                          {dd.qualityScore}/100
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-foreground">
                          {dd.cybersecurityScore}/100
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-foreground">
                          {dd.esgScore}/100
                        </td>
                        <td className="p-3 text-center">
                          {dd.singleSource ? (
                            <Badge className="bg-red-500 text-white text-[9px]">Yes (Single Source)</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px]">No</Badge>
                          )}
                        </td>
                        <td className="p-3 text-center font-mono text-muted-foreground">
                          {dd.switchingTimeMonths} Months
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-foreground">
                          ₹ {dd.switchingCostLakhs} L
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              dd.status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : dd.status === "High Risk"
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-amber-500/10 text-amber-700",
                            )}
                          >
                            {dd.status}
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
            TAB 4: RISK ASSESSMENT (SECTIONS 10-14)
            ========================================================================= */}
        {activeTab === "assessment" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-border/80 shadow-2xs">
                <CardHeader className="p-0 pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-bold text-foreground">
                    Inherent Vendor Risk Assessment (Section 13)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Vendor risk exposure prior to supplier audits, dual-sourcing, and safety buffer stock.
                  </CardDescription>
                </CardHeader>
                <div className="space-y-3 pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Likelihood (1–5):</span>
                    <span className="font-bold text-foreground">{activeRisk.likelihood} / 5 (Almost Certain)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Impact (1–5):</span>
                    <span className="font-bold text-foreground">{activeRisk.impact} / 5 (Severe)</span>
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
                    Residual Vendor Risk Assessment (Section 17)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Remaining exposure after active dual-sourcing qualification and 90-day buffer stock.
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
            TAB 5: CONTROLS (SECTIONS 15 & 16)
            ========================================================================= */}
        {activeTab === "controls" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Existing Vendor Risk Controls (Section 15 & 16)
                </CardTitle>
                <CardDescription className="text-xs">
                  Vendor qualification, incoming inspection, dual-sourcing mandates, and third-party cybersecurity audits.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">Control ID</th>
                      <th className="p-3">Control Name</th>
                      <th className="p-3">Objective</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3 text-center">Design</th>
                      <th className="p-3 text-center">Operating</th>
                      <th className="p-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VENDOR_CONTROLS_MASTER.map((ctl) => (
                      <tr key={ctl.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{ctl.id}</td>
                        <td className="p-3 font-semibold text-foreground">{ctl.controlName}</td>
                        <td className="p-3 text-muted-foreground">{ctl.objective}</td>
                        <td className="p-3 font-medium text-foreground">{ctl.owner}</td>
                        <td className="p-3 text-muted-foreground">{ctl.frequency}</td>
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
            TAB 6: TREATMENT & ACTIONS (SECTIONS 18 & 19)
            ========================================================================= */}
        {activeTab === "treatment" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Vendor Risk Treatment Action Plan (Section 19)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Mitigation initiatives: Dual sourcing, safety stock buffers, supplier audits, and contract renegotiation.
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
                    {VENDOR_TREATMENT_ACTIONS.map((act) => (
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
            TAB 7: KRI MONITORING (SECTION 20 & 21)
            ========================================================================= */}
        {activeTab === "kri" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Vendor Key Risk Indicators & Early Warning Alerts
                </CardTitle>
                <CardDescription className="text-xs">
                  Continuous tracking of On-Time Delivery (OTD), supplier PPM, financial solvency, and single-source exposure.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/40">
                    <tr>
                      <th className="p-3">KRI ID</th>
                      <th className="p-3">Indicator Name</th>
                      <th className="p-3">Current Value</th>
                      <th className="p-3">Threshold Limit</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VENDOR_KRIS.map((kri) => (
                      <tr key={kri.id} className="border-b border-border/20 hover:bg-muted/30">
                        <td className="p-3 font-mono font-bold text-primary">{kri.id}</td>
                        <td className="p-3 font-semibold text-foreground">{kri.name}</td>
                        <td className="p-3 font-mono font-bold text-foreground">{kri.current}</td>
                        <td className="p-3 font-mono text-muted-foreground">{kri.threshold}</td>
                        <td className="p-3 font-medium text-foreground">{kri.owner}</td>
                        <td className="p-3 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              kri.status === "Red"
                                ? "bg-red-500/10 text-red-600 border border-red-200"
                                : "bg-amber-500/10 text-amber-700 border border-amber-200",
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
            TAB 8: VENDOR PERFORMANCE (SECTION 20)
            ========================================================================= */}
        {activeTab === "performance" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Supplier Scorecard & Performance Rating (Section 20)
                </CardTitle>
                <CardDescription className="text-xs">
                  Quality, delivery, responsiveness, cost competitiveness, and CAPA resolution performance.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-border/60 bg-card">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">
                      Supplier OTIF Rate
                    </span>
                    <div className="text-lg font-bold text-red-600 mt-1">72.0%</div>
                    <div className="text-[10px] text-muted-foreground">Target: &gt; 85% (Breached)</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/60 bg-card">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">
                      Incoming Defect PPM
                    </span>
                    <div className="text-lg font-bold text-red-600 mt-1">450 PPM</div>
                    <div className="text-[10px] text-muted-foreground">Target: &lt; 300 PPM (Elevated)</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/60 bg-card">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">
                      CAPA Resolution SLA
                    </span>
                    <div className="text-lg font-bold text-emerald-600 mt-1">92.5%</div>
                    <div className="text-[10px] text-muted-foreground">Target: &gt; 90% (Compliant)</div>
                  </div>
                  <div className="p-3 rounded-lg border border-border/60 bg-card">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">
                      Composite Rating
                    </span>
                    <div className="text-lg font-bold text-amber-600 mt-1">Grade B</div>
                    <div className="text-[10px] text-muted-foreground">Conditional Performance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 9: REPORTS (SECTION 42)
            ========================================================================= */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    Vendor Risk Controlled Reports Suite (Section 42)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Controlled vendor registers, supplier PPM scorecards, single-source dependency audits, and cybersecurity reviews.
                  </CardDescription>
                </div>
                <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => window.print()}>
                  <Download className="h-3.5 w-3.5" /> Print Dossier
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {VENDOR_REPORT_DEFINITIONS.map((r) => (
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
            TAB 10: SETTINGS & MAICW CLASSIFICATION (SECTION 1, 33, 45)
            ========================================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <Card className="border-border/80 shadow-2xs">
              <CardHeader className="p-4 border-b border-border/40">
                <CardTitle className="text-sm font-bold text-foreground">
                  Vendor Risk Form — MAICW Classification Master (Section 1)
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
                    {VENDOR_MAICW_FIELDS.map((f) => (
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
                Vendor Risk Escalation Chain (Section 33):
              </h4>
              <div className="flex items-center justify-between text-xs font-semibold gap-2 overflow-x-auto py-2">
                <span className="p-2 rounded bg-muted">Vendor Manager (Rajesh Kumar)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-muted">Procurement Head (Arun Kumar)</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-amber-500/10 text-amber-700">Supply Chain / Risk Management</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-purple-500/10 text-purple-700">COO / CXO</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="p-2 rounded bg-rose-500/10 text-rose-700">CEO / Board</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: EDIT VENDOR RISK
          ========================================================================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Edit Vendor Risk: {activeRisk.id}</DialogTitle>
            <DialogDescription className="text-xs">
              Update controlled master information for this vendor risk record.
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
          MODAL: NEW VENDOR RISK
          ========================================================================= */}
      <Dialog open={isNewRiskModalOpen} onOpenChange={setIsNewRiskModalOpen}>
        <DialogContent className="max-w-md text-xs">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Register New Vendor Risk</DialogTitle>
            <DialogDescription className="text-xs">
              Catalog a newly identified third-party supplier, delivery, quality, or cybersecurity risk.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">Risk Title *</label>
              <Input id="new-vnd-title" placeholder="e.g. Lead time escalation on magnetic cores" className="h-8 text-xs mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Vendor Name</label>
                <Input id="new-vnd-vendor" defaultValue="ABC Components Pvt Ltd" className="h-8 text-xs mt-1" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">Category</label>
                <Input id="new-vnd-category" defaultValue="Supply & Delivery" className="h-8 text-xs mt-1" />
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
                const titleInput = (document.getElementById("new-vnd-title") as HTMLInputElement)?.value;
                const vendorInput = (document.getElementById("new-vnd-vendor") as HTMLInputElement)?.value;
                if (!titleInput) return;
                const newRecord: VendorRiskRecord = {
                  ...PRIMARY_VENDOR_RISK,
                  id: `VR-2026-0${allRisks.length + 1}`,
                  riskCode: `RK-VND-GEN-0${allRisks.length + 1}`,
                  title: titleInput,
                  vendorName: vendorInput || "New Vendor",
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
    </AppShell>
  );
}

export default VendorRiskPage;
