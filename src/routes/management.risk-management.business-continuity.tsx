// Magnertia ERP - Business Continuity Module
// Management -> Risk Management -> Business Continuity
// Business Continuity Form - MAICW Classification & Resilience Assurance Engine

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Check,
  Search,
  Plus,
  ChevronDown,
  Pencil,
  Shield,
  Calendar,
  Building,
  Users,
  Coins,
  Wrench,
  Download,
  Upload,
  ArrowRight,
  Eye,
  Trash2,
  ExternalLink,
  Save,
  Send,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  FileCheck,
  Server,
  Truck,
  Flame,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";

import { AppShell } from "@/components/erp/AppShell";
import { RiskManagementTabBar } from "@/components/erp/RiskManagementTabBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  businessContinuityService,
  PRIMARY_BCP_RECORD,
  BusinessContinuityRecord,
  BCPCriticalResource,
  BCPRecoveryObjective,
  BCPActionItem,
  BCPTestRecord,
  BCPContactItem,
} from "@/services/businessContinuityService";

export const Route = createFileRoute(
  "/management/risk-management/business-continuity",
)({
  component: BusinessContinuityPage,
  head: () => ({
    meta: [
      { title: "Business Continuity · Risk Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Business Continuity Form — MAICW Classification, BIA, Recovery Objectives (RTO/RPO), Crisis Activation, Testing Drills, and Alternate Site Resilience.",
      },
    ],
  }),
});

export function BusinessContinuityPage() {
  const { toast } = useToast();

  // Active BCP record (defaults to PRIMARY_BCP_RECORD matching screenshot)
  const [activePlan, setActivePlan] = useState<BusinessContinuityRecord>(
    businessContinuityService.getPrimaryBCP(),
  );

  const [activeTab, setActiveTab] = useState<string>("general");

  // Registers & Lists
  const [allPlans, setAllPlans] = useState<BusinessContinuityRecord[]>(
    businessContinuityService.getFullPlans(),
  );
  const [criticalResources, setCriticalResources] = useState<BCPCriticalResource[]>(
    businessContinuityService.getCriticalResources(),
  );
  const [recoveryObjectives, setRecoveryObjectives] = useState<BCPRecoveryObjective[]>(
    businessContinuityService.getRecoveryObjectives(),
  );
  const [actionItems, setActionItems] = useState<BCPActionItem[]>(
    businessContinuityService.getActionItems(),
  );
  const [testHistory, setTestHistory] = useState<BCPTestRecord[]>(
    businessContinuityService.getTestHistory(),
  );
  const emergencyContacts = businessContinuityService.getEmergencyContacts();
  const maicwFields = businessContinuityService.getMAICWFields();
  const reportsList = businessContinuityService.getReports();

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewResourceModalOpen, setIsNewResourceModalOpen] = useState(false);
  const [isStartTestModalOpen, setIsStartTestModalOpen] = useState(false);
  const [isLinkIncidentModalOpen, setIsLinkIncidentModalOpen] = useState(false);
  const [isAssessRiskModalOpen, setIsAssessRiskModalOpen] = useState(false);
  const [selectedIncidentToLink, setSelectedIncidentToLink] = useState("INC-2026-001");

  // Form State
  const [formData, setFormData] = useState<BusinessContinuityRecord>({
    ...PRIMARY_BCP_RECORD,
  });

  const [newResource, setNewResource] = useState<BCPCriticalResource>({
    id: `RES-0${criticalResources.length + 1}`,
    resource: "",
    type: "Equipment",
    criticality: "Critical",
    availability: "Yes",
    alternate: "",
    recoveryTimeHours: 4,
  });

  // Business Impact Summary Chart Data
  const impactChartData = [
    { area: "People", score: activePlan.impactScores.people, fill: "#ef4444" },
    { area: "Revenue", score: activePlan.impactScores.revenue, fill: "#f97316" },
    { area: "Customer", score: activePlan.impactScores.customer, fill: "#eab308" },
    { area: "Compliance", score: activePlan.impactScores.compliance, fill: "#3b82f6" },
    { area: "Reputation", score: activePlan.impactScores.reputation, fill: "#10b981" },
  ];

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "BCP Code",
      "Plan Name",
      "Type",
      "Function",
      "Department",
      "Location",
      "Owner",
      "Priority",
      "Status",
      "Effective Date",
      "Review Date",
    ];
    const rows = allPlans.map((p) => [
      p.id,
      p.bcpCode,
      `"${p.planName.replace(/"/g, '""')}"`,
      p.planType,
      p.businessFunction,
      p.department,
      `"${p.location}"`,
      p.planOwner,
      p.priority,
      p.status,
      p.effectiveDate,
      p.reviewDate,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BCP_Register_${activePlan.bcpCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Completed",
      description: `Downloaded ${allPlans.length} business continuity plans.`,
    });
  };

  const handleSavePlan = (updated: BusinessContinuityRecord) => {
    setActivePlan(updated);
    setAllPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsEditModalOpen(false);
    toast({
      title: "Plan Saved",
      description: `Updated ${updated.bcpCode} — ${updated.planName}.`,
    });
  };

  const handleAddResource = () => {
    if (!newResource.resource || !newResource.alternate) {
      toast({
        title: "Validation Error",
        description: "Please enter resource name and alternate arrangement.",
        variant: "destructive",
      });
      return;
    }
    setCriticalResources([...criticalResources, newResource]);
    setIsNewResourceModalOpen(false);
    toast({
      title: "Resource Added",
      description: `Linked ${newResource.resource} to active continuity plan.`,
    });
  };

  const handleDeleteResource = (id: string) => {
    setCriticalResources(criticalResources.filter((r) => r.id !== id));
    toast({
      title: "Resource Removed",
      description: "Critical resource entry removed from plan inventory.",
    });
  };

  return (
    <AppShell
      title="Business Continuity"
      breadcrumb="Management > Risk Management > Business Continuity"
      description="Business impact analysis (BIA), recovery objectives (RTO/RPO), crisis activation protocols, and continuity plans."
      tabs={<RiskManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* =========================================================================
            1. HEADER BANNER - EXACT MATCH TO SCREENSHOT
            ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-card p-4 rounded-xl border border-border/80 shadow-2xs">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground whitespace-nowrap">
                Business Continuity
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-300 font-bold px-2 py-0.5 text-xs shrink-0">
                Active
              </Badge>
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 shrink-0">
                {activePlan.id}
              </span>
              <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded shrink-0">
                v{activePlan.version}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium truncate">
              Plan for Resilience. Secure Tomorrow.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-nowrap shrink-0">
            <div className="relative w-36 sm:w-48">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search plans, systems..."
                className="pl-8 h-8 text-xs bg-muted/20"
              />
            </div>
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shrink-0"
              onClick={() => handleSavePlan(activePlan)}
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium shrink-0"
              onClick={() => {
                toast({
                  title: "Plan Submitted",
                  description: "Continuity plan sent for BCM Board executive approval.",
                });
              }}
            >
              <Send className="h-3.5 w-3.5" />
              Submit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium shrink-0"
                >
                  More Actions
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuItem onClick={() => setActiveTab("recovery")}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Generate Plan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <Download className="h-3.5 w-3.5 mr-2" /> Export Register (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Print Continuity Plan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const cloned: BusinessContinuityRecord = {
                      ...activePlan,
                      id: `BCP-2026-0${allPlans.length + 1}`,
                      bcpCode: `BC-PLN-0${allPlans.length + 1}`,
                      planName: `${activePlan.planName} (Copy)`,
                      version: "1.0",
                      status: "Draft",
                    };
                    setAllPlans([cloned, ...allPlans]);
                    setActivePlan(cloned);
                    toast({
                      title: "Plan Cloned",
                      description: `Created derivative copy ${cloned.bcpCode} in Draft status.`,
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-2" /> Duplicate Plan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("history")}>
                  <Clock className="h-3.5 w-3.5 mr-2" /> View Audit Trail
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* When drilled down into a specific subview, provide an easy back button */}
        {activeTab !== "general" && (
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
              onClick={() => setActiveTab("general")}
            >
              ← Back to Business Continuity Overview
            </Button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: GENERAL (MAIN BCP MASTER SCREENSHOT 1:1)
            ========================================================================= */}
        {activeTab === "general" && (
          <div className="space-y-4">
            {/* ROW 1: 6 EXECUTIVE SUMMARY KPI CARDS (EXACT SCREENSHOT LAYOUT) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Card 1: 12 BCP Plans */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">12</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    BCP Plans
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↑ 20%
                  </span>
                </div>
              </Card>

              {/* Card 2: 3 Critical Processes */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">3</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Critical Processes
                  </div>
                </div>
              </Card>

              {/* Card 3: 2 Plans Due for Review */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">2</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Plans Due for Review
                  </div>
                  <span className="text-[10px] font-bold text-red-600">
                    ↑ 100%
                  </span>
                </div>
              </Card>

              {/* Card 4: 8 Tests Completed */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">8</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Tests Completed
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↑ 33%
                  </span>
                </div>
              </Card>

              {/* Card 5: 5 Open Actions */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">5</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Open Actions
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↓ 29%
                  </span>
                </div>
              </Card>

              {/* Card 6: 98% Recovery Readiness */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">98%</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Recovery Readiness
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↑ 12%
                  </span>
                </div>
              </Card>
            </div>

            {/* ROW 2: TOP CORE GRID (1. BCP INFORMATION | 2. CONTINUITY OBJECTIVE & 3. SCENARIO | PLAN STATUS & ACTIONS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* CARD 1: 1. BUSINESS CONTINUITY PLAN INFORMATION (COL-SPAN-5 ON XL, FULL ON LG) */}
              <Card className="lg:col-span-12 xl:col-span-5 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    1. Business Continuity Plan Information
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => {
                      setFormData({ ...activePlan });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Row 1: BCP ID, BCP Code, Plan Name */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">BCP ID</span>
                      <Input
                        value={activePlan.id}
                        disabled
                        className="h-7 text-xs bg-muted/40 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">BCP Code *</span>
                      <Input
                        value={activePlan.bcpCode}
                        disabled
                        className="h-7 text-xs bg-muted/20 font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Plan Name *</span>
                      <Input
                        value={activePlan.planName}
                        disabled
                        className="h-7 text-xs bg-muted/20 font-semibold truncate"
                      />
                    </div>
                  </div>

                  {/* Row 2: Plan Type, Business Function, Department */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Plan Type *</span>
                      <Select defaultValue="Site">
                        <SelectTrigger className="h-7 text-xs bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Site">Site</SelectItem>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                          <SelectItem value="Department">Department</SelectItem>
                          <SelectItem value="IT / DR">IT / DR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Business Function *</span>
                      <Select defaultValue="Operations">
                        <SelectTrigger className="h-7 text-xs bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Department *</span>
                      <Select defaultValue="Operations">
                        <SelectTrigger className="h-7 text-xs bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Facilities">Facilities</SelectItem>
                          <SelectItem value="Quality">Quality</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 3: Business Process, Business Unit, Location */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Business Process *</span>
                      <Select defaultValue="Charging Station Operations">
                        <SelectTrigger className="h-7 text-xs bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Charging Station Operations">
                            Charging Station Operations
                          </SelectItem>
                          <SelectItem value="Production Line 3">
                            Production Line 3
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Business Unit *</span>
                      <Select defaultValue="EV Business">
                        <SelectTrigger className="h-7 text-xs bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EV Business">EV Business</SelectItem>
                          <SelectItem value="Power Solutions">Power Solutions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Location *</span>
                      <Select defaultValue="Chennai Plant">
                        <SelectTrigger className="h-7 text-xs bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chennai Plant">Chennai Plant</SelectItem>
                          <SelectItem value="Bangalore Plant">Bangalore Plant</SelectItem>
                          <SelectItem value="Hosur Central">Hosur Central</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 4: Plan Owner, BCP Coordinator, Risk Owner */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Plan Owner *</span>
                      <div className="flex items-center gap-1.5 mt-0.5 border border-border/60 rounded px-2 py-1 bg-muted/20">
                        <span className="h-4 w-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                          {activePlan.planOwnerAvatar || "RS"}
                        </span>
                        <span className="font-semibold text-foreground truncate text-[11px]">
                          {activePlan.planOwner}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">BCP Coordinator *</span>
                      <div className="flex items-center gap-1.5 mt-0.5 border border-border/60 rounded px-2 py-1 bg-muted/20">
                        <span className="h-4 w-4 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                          {activePlan.bcpCoordinatorAvatar || "PS"}
                        </span>
                        <span className="font-semibold text-foreground truncate text-[11px]">
                          {activePlan.bcpCoordinator}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Risk Owner</span>
                      <div className="flex items-center gap-1.5 mt-0.5 border border-border/60 rounded px-2 py-1 bg-muted/20">
                        <span className="h-4 w-4 rounded-full bg-slate-700 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                          {activePlan.riskOwnerAvatar || "VK"}
                        </span>
                        <span className="font-semibold text-foreground truncate text-[11px]">
                          {activePlan.riskOwner}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Dates */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-border/40 text-[10px]">
                    <div>
                      <span className="text-muted-foreground block">Effective Date *</span>
                      <span className="font-mono font-medium text-foreground block mt-0.5">
                        {activePlan.effectiveDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Review Date *</span>
                      <span className="font-mono font-medium text-foreground block mt-0.5">
                        {activePlan.reviewDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Last Test Date</span>
                      <span className="font-mono font-medium text-foreground block mt-0.5">
                        {activePlan.lastTestDate || "15-Mar-2025"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Next Test Date</span>
                      <span className="font-mono font-medium text-foreground block mt-0.5">
                        {activePlan.nextTestDate || "15-Mar-2026"}
                      </span>
                    </div>
                  </div>

                  {/* Row 6: Status, Priority, Version, Confidentiality */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-border/40">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Status *</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1 text-[11px] mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {activePlan.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Priority *</span>
                      <span className="font-bold text-red-600 text-[11px] block mt-0.5">
                        ↓ {activePlan.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Version</span>
                      <span className="font-mono text-muted-foreground text-[11px] block mt-0.5">
                        {activePlan.version}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Confidentiality</span>
                      <span className="font-semibold text-blue-600 text-[11px] block mt-0.5">
                        🔒 {activePlan.confidentiality}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* CARD 2 & 3: CONTINUITY OBJECTIVE & DISRUPTION SCENARIO (COL-SPAN-4 ON XL, 7 ON LG) */}
              <div className="lg:col-span-7 xl:col-span-4 space-y-4">
                {/* 2. Continuity Objective */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-2.5">
                    2. Continuity Objective
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {activePlan.continuityObjective}
                  </p>
                </Card>

                {/* 3. Disruption Scenario */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card space-y-2.5">
                  <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-2">
                    3. Disruption Scenario
                  </h2>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Primary Scenario *</span>
                      <Select defaultValue="Power Failure">
                        <SelectTrigger className="h-7 text-xs bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Power Failure">Power Failure</SelectItem>
                          <SelectItem value="Cyber Attack">Cyber Attack</SelectItem>
                          <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
                          <SelectItem value="Supplier Failure">Supplier Failure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Secondary Scenario</span>
                      <Select defaultValue="Cyber Attack">
                        <SelectTrigger className="h-7 text-xs bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cyber Attack">Cyber Attack</SelectItem>
                          <SelectItem value="Equipment Failure">Equipment Failure</SelectItem>
                          <SelectItem value="Internet Outage">Internet Outage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Description</span>
                    <Textarea
                      rows={2}
                      value={activePlan.scenarioDescription}
                      disabled
                      className="text-xs bg-muted/20 mt-1 resize-none"
                    />
                  </div>
                </Card>
              </div>

              {/* CARD: PLAN STATUS STEPPER & ACTIONS (COL-SPAN-3 ON XL, 5 ON LG) */}
              <div className="lg:col-span-5 xl:col-span-3 space-y-4">
                {/* Plan Status Stepper */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-3">
                    Plan Status
                  </h2>

                  {/* Stepper Diagram matching screenshot */}
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground px-1">
                    <span className="text-muted-foreground">Draft</span>
                    <span className="text-muted-foreground">Review</span>
                    <span className="text-muted-foreground">Approved</span>
                    <span className="font-bold text-emerald-600">Active</span>
                    <span className="text-muted-foreground">Testing</span>
                    <span className="text-muted-foreground">Archived</span>
                  </div>

                  <div className="relative flex items-center justify-between my-2 px-2">
                    <div className="absolute left-2 right-2 h-0.5 bg-border top-2 -z-0" />
                    <span className="h-4 w-4 rounded-full bg-muted-foreground/30 z-10" />
                    <span className="h-4 w-4 rounded-full bg-muted-foreground/30 z-10" />
                    <span className="h-4 w-4 rounded-full bg-muted-foreground/30 z-10" />
                    <span className="h-5 w-5 rounded-full bg-emerald-600 border-2 border-background z-10 flex items-center justify-center text-white text-[9px] font-black shadow-sm">
                      ✓
                    </span>
                    <span className="h-4 w-4 rounded-full bg-muted-foreground/30 z-10" />
                    <span className="h-4 w-4 rounded-full bg-muted-foreground/30 z-10" />
                  </div>

                  {/* Active Alert Box */}
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-[11px] leading-tight">
                        <strong className="text-foreground block">Plan is Active</strong>
                        <span className="text-muted-foreground text-[10px]">
                          Last updated on 15-Mar-2025 by Ramesh S
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </Card>

                {/* Key Dates & Quick Actions */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Key Dates */}
                    <div>
                      <h3 className="font-bold text-foreground text-[11px] mb-2">Key Dates</h3>
                      <div className="space-y-1.5 text-[10px] text-muted-foreground font-mono">
                        <div>Effective Date: <strong className="text-foreground">{activePlan.effectiveDate}</strong></div>
                        <div>Review Date: <strong className="text-foreground">{activePlan.reviewDate}</strong></div>
                        <div>Last Test: <strong className="text-foreground">{activePlan.lastTestDate}</strong></div>
                        <div>Next Test: <strong className="text-foreground">{activePlan.nextTestDate}</strong></div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="font-bold text-foreground text-[11px] mb-2">Quick Actions</h3>
                      <div className="space-y-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] w-full justify-start gap-1 font-semibold"
                          onClick={() => setIsStartTestModalOpen(true)}
                        >
                          <Play className="h-2.5 w-2.5 text-blue-600" />
                          Start BCP Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] w-full justify-start gap-1 font-semibold"
                          onClick={() => {
                            setFormData({ ...activePlan });
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Pencil className="h-2.5 w-2.5 text-orange-600" />
                          Update Plan
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] w-full justify-start gap-1 font-semibold"
                          onClick={() => setIsLinkIncidentModalOpen(true)}
                        >
                          <Flame className="h-2.5 w-2.5 text-red-600" />
                          Link Incident
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] w-full justify-start gap-1 font-semibold"
                          onClick={() => setIsAssessRiskModalOpen(true)}
                        >
                          <AlertTriangle className="h-2.5 w-2.5 text-amber-600" />
                          Assess Risk
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* ROW 3: MIDDLE ROW (4. CRITICAL RESOURCES | 5. RECOVERY OBJECTIVES | 6. BUSINESS IMPACT SUMMARY) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* CARD 4: 4. CRITICAL RESOURCES (COL-SPAN-5) */}
              <Card className="lg:col-span-5 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                  <h2 className="text-sm font-bold text-foreground">
                    4. Critical Resources
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-[10px] gap-1 font-semibold"
                    onClick={() => setIsNewResourceModalOpen(true)}
                  >
                    <Plus className="h-3 w-3" />
                    Add Resource
                  </Button>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground text-left text-[11px]">
                        <th className="py-1.5 font-semibold">Resource</th>
                        <th className="py-1.5 font-semibold">Type</th>
                        <th className="py-1.5 font-semibold">Criticality</th>
                        <th className="py-1.5 font-semibold">Availability</th>
                        <th className="py-1.5 font-semibold">Alternate</th>
                        <th className="py-1.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {criticalResources.map((res) => (
                        <tr key={res.id} className="hover:bg-muted/20">
                          <td className="py-1.5 font-semibold text-foreground">
                            {res.resource}
                          </td>
                          <td className="py-1.5 text-muted-foreground text-[11px]">
                            {res.type}
                          </td>
                          <td className="py-1.5">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                res.criticality === "Critical"
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-orange-500/10 text-orange-600",
                              )}
                            >
                              {res.criticality}
                            </span>
                          </td>
                          <td className="py-1.5">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                res.availability === "Yes"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-amber-500/10 text-amber-600",
                              )}
                            >
                              {res.availability}
                            </span>
                          </td>
                          <td className="py-1.5 text-muted-foreground font-medium text-[11px]">
                            {res.alternate}
                          </td>
                          <td className="py-1.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  toast({
                                    title: "Edit Resource",
                                    description: `Editing ${res.resource}...`,
                                  });
                                }}
                              >
                                <Pencil className="h-3 w-3 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteResource(res.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* CARD 5: 5. RECOVERY OBJECTIVES (COL-SPAN-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <div className="border-b border-border/60 pb-2 mb-2">
                  <h2 className="text-sm font-bold text-foreground">
                    5. Recovery Objectives
                  </h2>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40 text-muted-foreground text-left text-[11px]">
                        <th className="py-1.5 font-semibold">Process</th>
                        <th className="py-1.5 font-semibold">RTO</th>
                        <th className="py-1.5 font-semibold">RPO</th>
                        <th className="py-1.5 font-semibold text-right">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {recoveryObjectives.map((obj) => (
                        <tr key={obj.id} className="hover:bg-muted/20">
                          <td className="py-1.5 font-semibold text-foreground">
                            {obj.process}
                          </td>
                          <td className="py-1.5 font-mono text-muted-foreground">
                            {obj.rto}
                          </td>
                          <td className="py-1.5 font-mono text-muted-foreground">
                            {obj.rpo}
                          </td>
                          <td className="py-1.5 text-right">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-bold",
                                obj.priority === "Critical"
                                  ? "bg-red-500/10 text-red-600"
                                  : "bg-orange-500/10 text-orange-600",
                              )}
                            >
                              {obj.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* CARD 6: 6. BUSINESS IMPACT SUMMARY (COL-SPAN-3) */}
              <Card className="lg:col-span-3 p-4 border-border/80 shadow-2xs bg-card">
                <div className="border-b border-border/60 pb-2 mb-2">
                  <h2 className="text-sm font-bold text-foreground">
                    6. Business Impact Summary
                  </h2>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactChartData}>
                      <XAxis
                        dataKey="area"
                        stroke="#888888"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 5]}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#06101E",
                          border: "1px solid #1e293b",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {impactChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* ROW 4: BOTTOM ROW (7. CONTINUITY STRATEGY | 8. TESTING & EXERCISE | 9. RELATED RECORDS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* CARD 7: 7. CONTINUITY STRATEGY (COL-SPAN-5) */}
              <Card className="lg:col-span-5 p-4 border-border/80 shadow-2xs bg-card space-y-2">
                <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-2">
                  7. Continuity Strategy
                </h2>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Strategy Type *</span>
                    <Select defaultValue="Alternate Site">
                      <SelectTrigger className="h-7 text-xs bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alternate Site">Alternate Site</SelectItem>
                        <SelectItem value="Alternate Line">Alternate Line</SelectItem>
                        <SelectItem value="DR Failover">DR Failover</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Alternate Location</span>
                    <Select defaultValue="Bangalore DC">
                      <SelectTrigger className="h-7 text-xs bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bangalore DC">Bangalore DC</SelectItem>
                        <SelectItem value="Hosur Yard">Hosur Yard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Recovery Method</span>
                    <Input
                      value={activePlan.recoveryMethod}
                      disabled
                      className="h-7 text-xs bg-muted/20 font-medium truncate"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Strategy Details</span>
                  <Textarea
                    rows={2}
                    value={activePlan.strategyDetails}
                    disabled
                    className="text-xs bg-muted/20 mt-1 resize-none"
                  />
                </div>
              </Card>

              {/* CARD 8: 8. TESTING & EXERCISE (COL-SPAN-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card space-y-2">
                <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-2">
                  8. Testing & Exercise
                </h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Last Test Result</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="font-bold text-emerald-600">Pass</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Next Test Type</span>
                    <Select defaultValue="Full Simulation">
                      <SelectTrigger className="h-7 text-xs bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Simulation">Full Simulation</SelectItem>
                        <SelectItem value="Tabletop">Tabletop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Next Test Date</span>
                    <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground font-mono text-[11px]">
                      <Calendar className="h-3 w-3" />
                      <span>{activePlan.nextTestDate}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Test Scope</span>
                    <Select defaultValue="Site + IT + Customer Service">
                      <SelectTrigger className="h-7 text-[10px] bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Site + IT + Customer Service">
                          Site + IT + Customer Service
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="pt-2 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs font-semibold w-full"
                    onClick={() => setActiveTab("testing")}
                  >
                    View Test History
                  </Button>
                </div>
              </Card>

              {/* CARD 9: 9. RELATED RECORDS (COL-SPAN-3) */}
              <Card className="lg:col-span-3 p-4 border-border/80 shadow-2xs bg-card">
                <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-2">
                  9. Related Records
                </h2>
                <div className="space-y-1 text-xs">
                  <div
                    className="flex items-center justify-between p-1.5 rounded hover:bg-muted/20 cursor-pointer"
                    onClick={() => setActiveTab("related")}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                      <span className="font-medium text-foreground">Linked Risks</span>
                    </div>
                    <span className="font-bold text-muted-foreground text-[11px]">
                      {activePlan.linkedRisksCount} &gt;
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between p-1.5 rounded hover:bg-muted/20 cursor-pointer"
                    onClick={() => setActiveTab("related")}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      <span className="font-medium text-foreground">Linked Incidents</span>
                    </div>
                    <span className="font-bold text-muted-foreground text-[11px]">
                      {activePlan.linkedIncidentsCount} &gt;
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between p-1.5 rounded hover:bg-muted/20 cursor-pointer"
                    onClick={() => setActiveTab("related")}
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="font-medium text-foreground">Vendor Records</span>
                    </div>
                    <span className="font-bold text-muted-foreground text-[11px]">
                      {activePlan.vendorRecordsCount} &gt;
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between p-1.5 rounded hover:bg-muted/20 cursor-pointer"
                    onClick={() => setActiveTab("related")}
                  >
                    <div className="flex items-center gap-2">
                      <Server className="h-3.5 w-3.5 text-blue-500" />
                      <span className="font-medium text-foreground">IT/DR Records</span>
                    </div>
                    <span className="font-bold text-muted-foreground text-[11px]">
                      {activePlan.itDrRecordsCount} &gt;
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between p-1.5 rounded hover:bg-muted/20 cursor-pointer"
                    onClick={() => setActiveTab("actions")}
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-3.5 w-3.5 text-purple-500" />
                      <span className="font-medium text-foreground">Action Items</span>
                    </div>
                    <span className="font-bold text-muted-foreground text-[11px]">
                      {activePlan.actionItemsCount} &gt;
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: BUSINESS IMPACT ANALYSIS (BIA)
            ========================================================================= */}
        {activeTab === "impact" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Business Impact Analysis (BIA & Disruption Curves)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Section 5 & 6: Impact scores (1-5) across corporate functions and maximum tolerable downtime thresholds.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                  <h3 className="text-sm font-bold text-foreground">
                    Recovery Objectives (RTO / RPO Matrix)
                  </h3>
                  <div className="space-y-2 text-xs">
                    {recoveryObjectives.map((obj) => (
                      <div
                        key={obj.id}
                        className="p-2.5 rounded bg-background border border-border/60 flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-foreground block">{obj.process}</strong>
                          <span className="text-muted-foreground text-[11px]">
                            MTD: {obj.mtd} • Target Availability: 99.9%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-primary block">
                            RTO: {obj.rto}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            RPO: {obj.rpo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-muted/10 space-y-3">
                  <h3 className="text-sm font-bold text-foreground">
                    MAICW Field Taxonomy Governance (Section 1)
                  </h3>
                  <div className="overflow-x-auto rounded border border-border/60">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/40">
                        <tr className="border-b border-border/60 text-muted-foreground text-left text-[11px]">
                          <th className="py-1 px-2 font-semibold">Field</th>
                          <th className="py-1 px-2 font-semibold">Type</th>
                          <th className="py-1 px-2 font-semibold text-center">MAICW</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {maicwFields.slice(0, 7).map((f) => (
                          <tr key={f.field}>
                            <td className="py-1 px-2 font-medium text-foreground">{f.field}</td>
                            <td className="py-1 px-2 text-muted-foreground">{f.type}</td>
                            <td className="py-1 px-2 text-center">
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary/10 text-primary">
                                {f.maicw}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 6: CRISIS MANAGEMENT & EMERGENCY CONTACTS
            ========================================================================= */}
        {activeTab === "crisis" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Crisis Management & 24x7 Emergency Contact Register (Section 26 & 28)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Crisis levels (C1 to C4), command hierarchy, and real-time hotline coordination.
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-semibold">Crisis Role</th>
                      <th className="py-2.5 px-3 font-semibold">Primary Contact</th>
                      <th className="py-2.5 px-3 font-semibold">Backup Contact</th>
                      <th className="py-2.5 px-3 font-semibold">Contact Method</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {emergencyContacts.map((c) => (
                      <tr key={c.role} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-bold text-foreground">{c.role}</td>
                        <td className="py-2.5 px-3 text-primary font-semibold">{c.primaryContact}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{c.backupContact}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">{c.contactMethod}</td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                            {c.availability}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 7: TESTING & EXERCISES
            ========================================================================= */}
        {activeTab === "testing" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    BCP Test, Simulation & Drill History (Section 33 & 34)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Full simulations, tabletop exercises, failover testing logs, and corrective actions.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => setIsStartTestModalOpen(true)}
                >
                  <Play className="h-3.5 w-3.5" />
                  Schedule Simulation Drill
                </Button>
              </div>

              <div className="space-y-3">
                {testHistory.map((t) => (
                  <Card key={t.id} className="p-3.5 border-border/60 bg-muted/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {t.id}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {t.testType}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-sm text-foreground mt-1.5">
                          {t.testName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Scenario: <span className="text-foreground font-medium">{t.scenario}</span>
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 font-bold">
                        Result: {t.result}
                      </Badge>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-border/40 text-xs">
                      <p className="text-foreground">
                        <strong>Findings: </strong>
                        <span className="text-muted-foreground">{t.findings}</span>
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                        <span>Participants: {t.participants}</span>
                        <span className="font-mono">Next Test Due: {t.nextTestDate}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 8: ACTIONS
            ========================================================================= */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="border-b border-border/60 pb-3 mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Business Continuity Action Plan (Section 35)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Open resilience enhancements, alternate vendor validations, and cross-training tasks.
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                      <th className="py-2.5 px-3 font-semibold">Action ID</th>
                      <th className="py-2.5 px-3 font-semibold">Action Description</th>
                      <th className="py-2.5 px-3 font-semibold">Owner</th>
                      <th className="py-2.5 px-3 font-semibold">Due Date</th>
                      <th className="py-2.5 px-3 font-semibold">Priority</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {actionItems.map((act) => (
                      <tr key={act.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-mono font-bold text-primary">{act.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{act.action}</td>
                        <td className="py-2.5 px-3 text-foreground">{act.owner}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{act.dueDate}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-bold",
                              act.priority === "Critical"
                                ? "bg-red-500/10 text-red-600"
                                : "bg-orange-500/10 text-orange-600",
                            )}
                          >
                            {act.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-bold",
                              act.status === "Open"
                                ? "bg-red-500/10 text-red-600"
                                : "bg-blue-500/10 text-blue-600",
                            )}
                          >
                            {act.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground text-[11px] max-w-xs truncate">
                          {act.evidence}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 9: RELATED RECORDS (SECTION 47 ERP INTEGRATION)
            ========================================================================= */}
        {activeTab === "related" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Section 47: ERP Integration & Traceability Ledger
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Connected enterprise risks, active technical incidents, DR runbooks, and vendor SLAs.
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary font-bold text-xs">
                  5 Linked Cross-Module Records
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    module: "Enterprise Risk",
                    recordId: "ER-2026-001",
                    title: "Regional Grid Stability & High-Tension Substation Vulnerability",
                    severity: "High",
                    status: "Active Treatment",
                    icon: AlertTriangle,
                    color: "text-amber-500",
                  },
                  {
                    module: "Incident Management",
                    recordId: "INC-2026-001",
                    title: "HT Substation Line 3 Transformer Flashover at Chennai Plant",
                    severity: "Critical",
                    status: "Investigating",
                    icon: Flame,
                    color: "text-red-500",
                  },
                  {
                    module: "Disaster Recovery",
                    recordId: "DRP-2026-001",
                    title: "ERP & Charging Cloud Gateway Failover to Bangalore DC",
                    severity: "Critical",
                    status: "Ready / Standby",
                    icon: Server,
                    color: "text-blue-500",
                  },
                  {
                    module: "Vendor Risk",
                    recordId: "VR-2026-003",
                    title: "Emergency Diesel Fuel 4-Hour Delivery SLA Contract",
                    severity: "High",
                    status: "Compliant",
                    icon: Truck,
                    color: "text-purple-500",
                  },
                ].map((item) => (
                  <div
                    key={item.recordId}
                    className="p-3.5 rounded-xl border border-border/60 bg-muted/10 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <item.icon className={cn("h-4 w-4", item.color)} />
                          <span className="text-[11px] font-bold text-muted-foreground uppercase">
                            {item.module}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-bold",
                            item.severity === "Critical"
                              ? "border-red-300 text-red-600 bg-red-500/5"
                              : "border-amber-300 text-amber-600 bg-amber-500/5",
                          )}
                        >
                          {item.severity}
                        </Badge>
                      </div>
                      <div className="font-mono text-xs font-bold text-primary">
                        {item.recordId}
                      </div>
                      <p className="text-xs font-semibold text-foreground line-clamp-2">
                        {item.title}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                      <span className="text-muted-foreground text-[11px]">
                        Status: <strong className="text-foreground">{item.status}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] text-blue-600 hover:text-blue-700 px-2"
                          onClick={() => {
                            toast({
                              title: `Inspecting ${item.recordId}`,
                              description: `Navigating to ${item.module} record dossier...`,
                            });
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] text-muted-foreground hover:text-red-600 px-1.5"
                          onClick={() => {
                            toast({
                              title: "Record Unlinked",
                              description: `Disconnected ${item.recordId} from BCP plan.`,
                            });
                          }}
                        >
                          Unlink
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 10: ATTACHMENTS
            ========================================================================= */}
        {activeTab === "attachments" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Controlled Business Continuity Documentation & Blueprints
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Official recovery procedures, site schematics, and vendor commitments.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => {
                    toast({
                      title: "Upload Document",
                      description: "Document file selector initialized for controlled BCP repository.",
                    });
                  }}
                >
                  <Upload className="h-3 w-3" />
                  Upload Artifact
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: "Chennai_Plant_BCP_Operating_Procedure_v1.0.pdf", size: "3.2 MB", date: "15-Jan-2026", type: "Controlled SOP" },
                  { name: "Chennai_Plant_Single_Line_Diagram_Electrical.dwg", size: "5.1 MB", date: "10-Jan-2026", type: "Schematic Blueprint" },
                  { name: "Bangalore_DC_Cloud_Gateway_Failover_SOP.docx", size: "1.4 MB", date: "05-Jan-2026", type: "Technical SOP" },
                  { name: "Emergency_Diesel_Generator_Fuel_Agreement.pdf", size: "820 KB", date: "12-Dec-2025", type: "Vendor Contract" },
                ].map((att) => (
                  <div
                    key={att.name}
                    className="p-3 rounded border border-border/60 bg-muted/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block">
                          {att.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {att.type} • {att.size} • Uploaded {att.date}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-blue-600 hover:text-blue-700"
                      onClick={() => {
                        toast({
                          title: "Downloading File",
                          description: `Downloading ${att.name}`,
                        });
                      }}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 11: HISTORY
            ========================================================================= */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    BCP Lifecycle History & Audit Log
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Immutable log of version revisions, review board approvals, drill executions, and gap closures.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { date: "15-Mar-2025 16:00", user: "Ramesh S (Operations Head)", act: "Annual DR & Cloud Simulation Drill passed successfully against 4-hour RTO", ver: "v1.0" },
                  { date: "10-Jan-2026 10:30", user: "Priya Sharma (BCP Coordinator)", act: "Annual BCP Review completed; updated contractor mobilization SLA to 2 hours", ver: "v1.0" },
                  { date: "01-Jan-2026 09:00", user: "Arun Kumar (BCM Manager)", act: "Plan activated for 2026 operational year with board sign-off", ver: "v1.0" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded border border-border/60 bg-muted/10 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-foreground block">
                        {item.act}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Executed by {item.user} • {item.date}
                      </span>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.ver}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* =========================================================================
          DIALOG: EDIT BCP PLAN
          ========================================================================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Edit Business Continuity Plan — {activePlan.bcpCode}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-2 text-xs">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Plan Name *</Label>
              <Input
                value={formData.planName}
                onChange={(e) =>
                  setFormData({ ...formData, planName: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Business Function *</Label>
              <Input
                value={formData.businessFunction}
                onChange={(e) =>
                  setFormData({ ...formData, businessFunction: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-bold">Continuity Objective</Label>
              <Textarea
                rows={2}
                value={formData.continuityObjective}
                onChange={(e) =>
                  setFormData({ ...formData, continuityObjective: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Plan Owner</Label>
              <Input
                value={formData.planOwner}
                onChange={(e) =>
                  setFormData({ ...formData, planOwner: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">BCP Coordinator</Label>
              <Input
                value={formData.bcpCoordinator}
                onChange={(e) =>
                  setFormData({ ...formData, bcpCoordinator: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Primary Disruption Scenario</Label>
              <Input
                value={formData.primaryDisruptionScenario}
                onChange={(e) =>
                  setFormData({ ...formData, primaryDisruptionScenario: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Recovery Method</Label>
              <Input
                value={formData.recoveryMethod}
                onChange={(e) =>
                  setFormData({ ...formData, recoveryMethod: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 text-white font-semibold"
              onClick={() => handleSavePlan(formData)}
            >
              Save Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG: ADD CRITICAL RESOURCE
          ========================================================================= */}
      <Dialog open={isNewResourceModalOpen} onOpenChange={setIsNewResourceModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Add Critical Recovery Resource
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-bold">Resource Name *</Label>
              <Input
                placeholder="e.g. Inverter Testing Jig 3"
                value={newResource.resource}
                onChange={(e) =>
                  setNewResource({ ...newResource, resource: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold">Type</Label>
                <Select
                  value={newResource.type}
                  onValueChange={(val: any) =>
                    setNewResource({ ...newResource, type: val })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="IT System">IT System</SelectItem>
                    <SelectItem value="People">People</SelectItem>
                    <SelectItem value="Material">Material</SelectItem>
                    <SelectItem value="Utility">Utility</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold">Criticality</Label>
                <Select
                  value={newResource.criticality}
                  onValueChange={(val: any) =>
                    setNewResource({ ...newResource, criticality: val })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold">Alternate Arrangement *</Label>
              <Input
                placeholder="e.g. Hosur Plant Line B"
                value={newResource.alternate}
                onChange={(e) =>
                  setNewResource({ ...newResource, alternate: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewResourceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground font-semibold"
              onClick={handleAddResource}
            >
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG: START BCP TEST / SIMULATION
          ========================================================================= */}
      <Dialog open={isStartTestModalOpen} onOpenChange={setIsStartTestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Play className="h-4 w-4 text-blue-600" />
              Launch BCP Simulation Test
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-2.5 rounded bg-muted/30 border border-border/60">
              <span className="font-bold text-foreground block">
                Scenario: Extended Power Failure at Chennai Plant
              </span>
              <p className="text-muted-foreground mt-0.5">
                Simulate 4-hour primary grid drop and automated transfer to Bangalore DC and standby generators.
              </p>
            </div>
            <div>
              <Label className="text-xs font-bold">Drill Scope</Label>
              <Select defaultValue="Full Simulation">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Simulation">Full Simulation</SelectItem>
                  <SelectItem value="Tabletop Exercise">Tabletop Exercise</SelectItem>
                  <SelectItem value="DR Failover">DR Failover Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStartTestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => {
                setIsStartTestModalOpen(false);
                toast({
                  title: "Simulation Started",
                  description: "BCP Drill initiated. Timer started against 4-hour RTO objective.",
                });
              }}
            >
              Initiate Drill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG: LINK TECHNICAL INCIDENT
          ========================================================================= */}
      <Dialog open={isLinkIncidentModalOpen} onOpenChange={setIsLinkIncidentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Flame className="h-4 w-4 text-red-600" />
              Link Technical Incident to BCP Plan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Select an ongoing operational or technical incident from Incident Management to attach to this Business Continuity Plan.
            </p>
            <div>
              <Label className="text-xs font-bold">Select Active Incident *</Label>
              <Select
                value={selectedIncidentToLink}
                onValueChange={setSelectedIncidentToLink}
              >
                <SelectTrigger className="h-8 text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INC-2026-001">
                    INC-2026-001: HT Substation Line 3 Failure (Critical)
                  </SelectItem>
                  <SelectItem value="INC-2026-002">
                    INC-2026-002: Cloud Telematics Gateway Latency (High)
                  </SelectItem>
                  <SelectItem value="INC-2026-003">
                    INC-2026-003: SCM Lithium Cell Supply Delay (Medium)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-2.5 rounded bg-muted/20 border border-border/60 text-[11px] text-muted-foreground">
              Linking will establish real-time containment tracking between Incident Command and BCP activation status.
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLinkIncidentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              onClick={() => {
                setIsLinkIncidentModalOpen(false);
                setActivePlan({
                  ...activePlan,
                  linkedIncidentsCount: activePlan.linkedIncidentsCount + 1,
                });
                toast({
                  title: "Incident Linked Successfully",
                  description: `Connected ${selectedIncidentToLink} to ${activePlan.bcpCode}.`,
                });
              }}
            >
              Attach Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          DIALOG: BCP RISK ASSESSMENT
          ========================================================================= */}
      <Dialog open={isAssessRiskModalOpen} onOpenChange={setIsAssessRiskModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Assess Continuity Risk Exposure
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <p className="text-muted-foreground">
              Calculate continuity risk score (Likelihood × Impact) for current primary disruption scenario.
            </p>
            <div className="p-2.5 rounded bg-muted/30 border border-border/60 space-y-1">
              <span className="font-bold text-foreground block">
                Scenario: {activePlan.primaryDisruptionScenario}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Location: {activePlan.location} | Process: {activePlan.businessProcess}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold">Likelihood (1–5)</Label>
                <Select defaultValue="4">
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Rare</SelectItem>
                    <SelectItem value="2">2 - Unlikely</SelectItem>
                    <SelectItem value="3">3 - Possible</SelectItem>
                    <SelectItem value="4">4 - Likely</SelectItem>
                    <SelectItem value="5">5 - Frequent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold">Impact (1–5)</Label>
                <Select defaultValue="4">
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Insignificant</SelectItem>
                    <SelectItem value="2">2 - Minor</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="4">4 - Major</SelectItem>
                    <SelectItem value="5">5 - Catastrophic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-2 rounded bg-amber-500/10 border border-amber-300 text-center font-bold text-amber-700">
              Calculated Score: 16 (High Risk) — Mitigation Priority 1
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAssessRiskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              onClick={() => {
                setIsAssessRiskModalOpen(false);
                toast({
                  title: "Assessment Saved",
                  description: "Updated BCP Continuity Risk Rating to Level 16 (High).",
                });
              }}
            >
              Record Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default BusinessContinuityPage;

