// Magnertia ERP - Disaster Recovery Module
// Management -> Risk Management -> Disaster Recovery
// Disaster Recovery Form - MAICW Classification & IT Resilience Engine

import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getDisasterRecoveryRecordFn } from "@/lib/disasterRecoveryFns.server";
import {
  Server,
  AlertTriangle,
  Clock,
  CheckCircle,
  ListTodo,
  Shield,
  Zap,
  Search,
  Save,
  Send,
  FileCode2,
  ChevronDown,
  Pencil,
  Plus,
  Play,
  RotateCcw,
  Link2,
  FileText,
  ExternalLink,
  Calendar,
  Lock,
  Database,
  Cloud,
  Layers,
  Activity,
  HardDrive,
  Cpu,
  Globe,
  Radio,
  FileCheck,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  Download,
  Upload,
  Eye,
  Trash2,
  Check,
  Terminal,
} from "lucide-react";
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
  disasterRecoveryService,
  PRIMARY_DRP_RECORD,
  DisasterRecoveryRecord,
  CriticalITService,
  DRRecoveryObjectiveItem,
  BackupReplicationItem,
  DRTestExerciseItem,
  DRRunbookStep,
  DRActionItem,
  DREmergencyContact,
} from "@/services/disasterRecoveryService";

export const Route = createFileRoute(
  "/management/risk-management/disaster-recovery",
)({
  component: DisasterRecoveryPage,
  head: () => ({
    meta: [
      { title: "Disaster Recovery · Risk Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Disaster Recovery Form — MAICW Classification, Critical IT Services, RTO/RPO, Backup & Replication, 18-Step Runbook, and Failover Orchestration.",
      },
    ],
  }),
});

export function DisasterRecoveryPage() {
  const { toast } = useToast();

  const { data: dbRecord } = useQuery({
    queryKey: ["disaster-recovery", "record"],
    queryFn: () => getDisasterRecoveryRecordFn({ data: {} }),
  });

  // Active Plan State
  const [activePlan, setActivePlan] = useState<DisasterRecoveryRecord>(
    disasterRecoveryService.getPrimaryDRP(),
  );
  useEffect(() => { if (dbRecord?.data) setActivePlan(dbRecord.data); }, [dbRecord]);

  const [activeTab, setActiveTab] = useState<string>("general");

  // Registers & Lists
  const [allPlans, setAllPlans] = useState<DisasterRecoveryRecord[]>(
    disasterRecoveryService.getFullPlans(),
  );
  const [criticalServices, setCriticalServices] = useState<CriticalITService[]>(
    disasterRecoveryService.getCriticalServices(),
  );
  const [recoveryObjectives, setRecoveryObjectives] = useState<
    DRRecoveryObjectiveItem[]
  >(disasterRecoveryService.getRecoveryObjectives());
  const [backupStatusList, setBackupStatusList] = useState<
    BackupReplicationItem[]
  >(disasterRecoveryService.getBackupReplicationStatus());
  const [testExercises, setTestExercises] = useState<DRTestExerciseItem[]>(
    disasterRecoveryService.getTestExercises(),
  );
  const [actionItems, setActionItems] = useState<DRActionItem[]>(
    disasterRecoveryService.getActionItems(),
  );
  const runbookSteps = disasterRecoveryService.getRunbookSteps();
  const emergencyContacts = disasterRecoveryService.getEmergencyContacts();
  const maicwFields = disasterRecoveryService.getMAICWFields();
  const reportsList = disasterRecoveryService.getReports();

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [isRunTestModalOpen, setIsRunTestModalOpen] = useState(false);
  const [isRunbookModalOpen, setIsRunbookModalOpen] = useState(false);
  const [isLinkIncidentModalOpen, setIsLinkIncidentModalOpen] = useState(false);
  const [selectedIncidentToLink, setSelectedIncidentToLink] = useState("INC-2026-001");

  // Form State
  const [formData, setFormData] = useState<DisasterRecoveryRecord>({
    ...PRIMARY_DRP_RECORD,
  });

  const [newService, setNewService] = useState<CriticalITService>({
    id: `SRV-0${criticalServices.length + 1}`,
    itService: "",
    application: "",
    criticality: "Critical",
    rto: "4 hours",
    rpo: "30 mins",
    status: "Active",
    owner: "IT Systems Team",
  });

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "DR Code",
      "Plan Name",
      "Type",
      "Function",
      "Department",
      "IT Service",
      "Application",
      "Primary Site",
      "DR Site",
      "Owner",
      "Priority",
      "Status",
    ];
    const rows = allPlans.map((p) => [
      p.id,
      p.drCode,
      `"${p.planName.replace(/"/g, '""')}"`,
      p.drType,
      p.businessFunction,
      p.department,
      `"${p.itService}"`,
      `"${p.application}"`,
      `"${p.primarySite}"`,
      `"${p.drSite}"`,
      p.drOwner,
      p.priority,
      p.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DRP_Register_${activePlan.drCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Completed",
      description: `Downloaded ${allPlans.length} disaster recovery plans.`,
    });
  };

  const handleSavePlan = (updated: DisasterRecoveryRecord) => {
    setActivePlan(updated);
    setAllPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsEditModalOpen(false);
    toast({
      title: "Plan Saved",
      description: `Updated ${updated.drCode} — ${updated.planName}.`,
    });
  };

  const handleAddService = () => {
    if (!newService.itService || !newService.application) {
      toast({
        title: "Validation Error",
        description: "Please specify both IT Service and Application name.",
        variant: "destructive",
      });
      return;
    }
    setCriticalServices([...criticalServices, newService]);
    setIsNewServiceModalOpen(false);
    toast({
      title: "Service Added",
      description: `Linked ${newService.itService} to critical recovery register.`,
    });
  };

  return (
    <AppShell
      title="Disaster Recovery"
      breadcrumb="Management > Risk Management > Disaster Recovery"
      description="IT infrastructure failover, DR drills, critical service recovery protocols, and offsite data resilience."
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
                Disaster Recovery
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
              Plan Today. Recover Tomorrow.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-nowrap shrink-0">
            <div className="relative w-36 sm:w-48">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search systems, plans..."
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
                  description: "DR Plan submitted to DR Review Board for executive sign-off.",
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
                <DropdownMenuItem onClick={() => setIsRunbookModalOpen(true)}>
                  <FileCode2 className="h-3.5 w-3.5 mr-2" /> Generate Runbook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <Download className="h-3.5 w-3.5 mr-2" /> Export Register (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.print()}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Print Disaster Recovery Plan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const cloned: DisasterRecoveryRecord = {
                      ...activePlan,
                      id: `DRP-2026-0${allPlans.length + 1}`,
                      drCode: `DR-ERP-0${allPlans.length + 1}`,
                      planName: `${activePlan.planName} (Copy)`,
                      version: "1.0",
                      status: "Draft",
                    };
                    setAllPlans([cloned, ...allPlans]);
                    setActivePlan(cloned);
                    toast({
                      title: "Plan Duplicated",
                      description: `Created clone ${cloned.drCode} in Draft status.`,
                    });
                  }}
                >
                  <Plus className="h-3.5 w-3.5 mr-2" /> Duplicate DR Plan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("audit")}>
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
              ← Back to Disaster Recovery Overview
            </Button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: GENERAL (SCREENSHOT MATCH 1:1)
            ========================================================================= */}
        {activeTab === "general" && (
          <div className="space-y-4">
            {/* ROW 1: 6 EXECUTIVE SUMMARY KPI CARDS (EXACT SCREENSHOT LAYOUT) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Card 1: 8 Critical Systems */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">8</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Critical Systems
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↑ 14%
                  </span>
                </div>
              </Card>

              {/* Card 2: 2 High Risk Items */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">2</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    High Risk Items
                  </div>
                  <span className="text-[10px] font-bold text-red-600">
                    ↑ 100%
                  </span>
                </div>
              </Card>

              {/* Card 3: 3 Tests Due */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">3</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Tests Due
                  </div>
                  <span className="text-[10px] font-bold text-red-600">
                    ↑ 50%
                  </span>
                </div>
              </Card>

              {/* Card 4: 6 Tests Completed */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">6</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    Tests Completed
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↑ 200%
                  </span>
                </div>
              </Card>

              {/* Card 5: 5 Open Actions */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <ListTodo className="h-5 w-5" />
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

              {/* Card 6: 96% DR Readiness */}
              <Card className="p-3 border-border/80 shadow-2xs bg-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-foreground">96%</div>
                  <div className="text-[11px] font-semibold text-muted-foreground leading-tight">
                    DR Readiness
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">
                    ↑ 8%
                  </span>
                </div>
              </Card>
            </div>

            {/* ROW 2: TOP CORE GRID (1. DR PLAN INFO | 2. RECOVERY OBJECTIVE & 3. SCENARIO | PLAN STATUS & ACTIONS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* CARD 1: 1. DISASTER RECOVERY PLAN INFORMATION (COL-SPAN-5 ON XL, FULL ON LG) */}
              <Card className="lg:col-span-12 xl:col-span-5 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    1. Disaster Recovery Plan Information
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
                  {/* Row 1: DR Plan ID, DR Code, DR Plan Name */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        DR Plan ID
                      </span>
                      <Input
                        value={activePlan.id}
                        disabled
                        className="h-7 text-xs bg-muted/40 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        DR Code *
                      </span>
                      <Input
                        value={activePlan.drCode}
                        disabled
                        className="h-7 text-xs font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        DR Plan Name *
                      </span>
                      <Input
                        value={activePlan.planName}
                        readOnly
                        className="h-7 text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Row 2: DR Type, Business Function, Department */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        DR Type *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs">
                        {activePlan.drType}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Business Function *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs">
                        {activePlan.businessFunction}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Department *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs">
                        {activePlan.department}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: IT Service, Application, System Owner */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        IT Service *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs truncate">
                        {activePlan.itService}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Application *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs truncate">
                        {activePlan.application}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        System Owner *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center gap-1.5 bg-muted/20 text-foreground font-medium text-xs">
                        <span className="h-4 w-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">
                          {activePlan.systemOwnerAvatar || "RS"}
                        </span>
                        <span className="truncate">{activePlan.systemOwner}</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: DR Owner, Recovery Coordinator, Primary Site */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        DR Owner *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center gap-1.5 bg-muted/20 text-foreground font-medium text-xs">
                        <span className="h-4 w-4 rounded-full bg-purple-600 text-white text-[9px] flex items-center justify-center font-bold">
                          {activePlan.drOwnerAvatar || "PK"}
                        </span>
                        <span className="truncate">{activePlan.drOwner}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Recovery Coordinator *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center gap-1.5 bg-muted/20 text-foreground font-medium text-xs">
                        <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center font-bold">
                          {activePlan.recoveryCoordinatorAvatar || "VK"}
                        </span>
                        <span className="truncate">
                          {activePlan.recoveryCoordinator}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Primary Site *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs truncate">
                        {activePlan.primarySite}
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Effective Date, Review Date, Last Test Date, Next Test Date */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Effective Date *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center justify-between bg-muted/20 text-foreground font-medium text-xs">
                        <span>{activePlan.effectiveDate}</span>
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Review Date *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center justify-between bg-muted/20 text-foreground font-medium text-xs">
                        <span>{activePlan.reviewDate}</span>
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Last Test Date
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center justify-between bg-muted/20 text-foreground font-medium text-xs">
                        <span>{activePlan.lastTestDate || "—"}</span>
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Next Test Date
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center justify-between bg-muted/20 text-foreground font-medium text-xs">
                        <span>{activePlan.nextTestDate || "—"}</span>
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Row 6: Status, Priority, Version, Confidentiality */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Status *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 font-semibold text-xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {activePlan.status}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Priority *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center gap-1.5 bg-red-500/10 text-red-600 font-bold text-xs">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        {activePlan.priority}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Version
                      </span>
                      <Input
                        value={activePlan.version}
                        disabled
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Confidentiality
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center gap-1 bg-muted/20 text-foreground font-medium text-xs">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                        <span>{activePlan.confidentiality}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* CARD 2 & 3: 2. RECOVERY OBJECTIVE & 3. DISASTER SCENARIO (COL-SPAN-4 ON XL, 7 ON LG) */}
              <div className="lg:col-span-7 xl:col-span-4 space-y-4">
                {/* 2. Recovery Objective */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                    <h2 className="text-sm font-bold text-foreground">
                      2. Recovery Objective
                    </h2>
                  </div>
                  <div className="p-2.5 rounded-md bg-muted/30 border border-border/60 text-xs text-foreground font-medium leading-relaxed">
                    {activePlan.recoveryObjective}
                  </div>
                </Card>

                {/* 3. Disaster Scenario */}
                <Card className="p-4 border-border/80 shadow-2xs bg-card">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                    <h2 className="text-sm font-bold text-foreground">
                      3. Disaster Scenario
                    </h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Primary Scenario *
                        </span>
                        <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs">
                          {activePlan.primaryDisasterScenario}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Secondary Scenario
                        </span>
                        <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs">
                          {activePlan.secondaryDisasterScenario || "Cyber Attack"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Description
                      </span>
                      <Textarea
                        value={activePlan.disasterScenarioDescription}
                        readOnly
                        className="text-xs h-14 bg-muted/10 resize-none font-medium text-muted-foreground leading-snug"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* RIGHT SIDE: PLAN STATUS, KEY DATES, QUICK ACTIONS (COL-SPAN-3 ON XL, 5 ON LG) */}
              <div className="lg:col-span-5 xl:col-span-3 space-y-3">
                {/* Plan Status */}
                <Card className="p-3 border-border/80 shadow-2xs bg-card">
                  <span className="text-xs font-bold text-foreground block mb-2">
                    Plan Status
                  </span>
                  {/* Stepper matching screenshot */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground relative px-1 mb-3">
                    <div className="absolute top-1.5 left-2 right-2 h-0.5 bg-muted-foreground/30 -z-0" />
                    {["Draft", "Review", "Approved", "Active", "Testing", "Archived"].map(
                      (step) => {
                        const isCurrent = step === "Active";
                        const isPast = ["Draft", "Review", "Approved"].includes(step);
                        return (
                          <div
                            key={step}
                            className="flex flex-col items-center gap-1 z-10"
                          >
                            <div
                              className={cn(
                                "h-3.5 w-3.5 rounded-full border-2 bg-background flex items-center justify-center",
                                isCurrent
                                  ? "bg-emerald-600 border-emerald-600 ring-2 ring-emerald-300"
                                  : isPast
                                    ? "bg-muted-foreground/40 border-muted-foreground/40"
                                    : "border-muted-foreground/40",
                              )}
                            >
                              {isCurrent && (
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "text-[9px]",
                                isCurrent
                                  ? "font-bold text-emerald-600"
                                  : "text-muted-foreground",
                              )}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>

                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <div>
                        <span>Plan is Active</span>
                        <div className="text-[10px] font-normal text-muted-foreground">
                          Last updated on 15-Mar-2025 by Ramesh S
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-emerald-600 cursor-pointer hover:opacity-75" />
                  </div>
                </Card>

                {/* Key Dates & Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Key Dates */}
                  <Card className="p-2.5 border-border/80 shadow-2xs bg-card">
                    <span className="text-[11px] font-bold text-foreground block mb-1.5">
                      Key Dates
                    </span>
                    <div className="space-y-1.5 text-[10px]">
                      <div>
                        <span className="text-muted-foreground block text-[9px]">
                          Effective Date
                        </span>
                        <span className="font-semibold text-foreground">
                          {activePlan.effectiveDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px]">
                          Review Date
                        </span>
                        <span className="font-semibold text-foreground">
                          {activePlan.reviewDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px]">
                          Last Test Date
                        </span>
                        <span className="font-semibold text-foreground">
                          {activePlan.lastTestDate || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px]">
                          Next Test Date
                        </span>
                        <span className="font-semibold text-foreground">
                          {activePlan.nextTestDate || "—"}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="p-2.5 border-border/80 shadow-2xs bg-card flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-foreground block mb-1">
                      Quick Actions
                    </span>
                    <div className="space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-6 text-[10px] justify-start gap-1 px-1.5"
                        onClick={() => setIsRunTestModalOpen(true)}
                      >
                        <Play className="h-2.5 w-2.5 text-blue-600" />
                        Run DR Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-6 text-[10px] justify-start gap-1 px-1.5"
                        onClick={() => {
                          setFormData({ ...activePlan });
                          setIsEditModalOpen(true);
                        }}
                      >
                        <RotateCcw className="h-2.5 w-2.5 text-emerald-600" />
                        Update Plan
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-6 text-[10px] justify-start gap-1 px-1.5"
                        onClick={() => setIsLinkIncidentModalOpen(true)}
                      >
                        <Link2 className="h-2.5 w-2.5 text-purple-600" />
                        Link to Incident
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-6 text-[10px] justify-start gap-1 px-1.5"
                        onClick={() => setIsRunbookModalOpen(true)}
                      >
                        <FileText className="h-2.5 w-2.5 text-amber-600" />
                        View Runbook
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* ROW 3: CARDS 4, 5, 6 (CRITICAL IT SERVICES | RECOVERY STRATEGY | RTO / RPO) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* CARD 4: 4. CRITICAL IT SERVICES (COL-SPAN-5) */}
              <Card className="lg:col-span-5 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    4. Critical IT Services
                  </h2>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 font-semibold text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => setIsNewServiceModalOpen(true)}
                  >
                    <Plus className="h-3 w-3" />
                    Add Service
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground text-[11px]">
                        <th className="pb-1.5 font-bold">IT Service</th>
                        <th className="pb-1.5 font-bold">Application</th>
                        <th className="pb-1.5 font-bold">Criticality</th>
                        <th className="pb-1.5 font-bold">RTO</th>
                        <th className="pb-1.5 font-bold">RPO</th>
                        <th className="pb-1.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {criticalServices.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/20">
                          <td className="py-2 font-semibold text-foreground">
                            {row.itService}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {row.application}
                          </td>
                          <td className="py-2">
                            <Badge
                              className={cn(
                                "text-[10px] font-bold px-1.5 py-0",
                                row.criticality === "Critical"
                                  ? "bg-red-500/10 text-red-600 border-red-200"
                                  : "bg-orange-500/10 text-orange-600 border-orange-200",
                              )}
                            >
                              {row.criticality}
                            </Badge>
                          </td>
                          <td className="py-2 font-mono text-[11px]">
                            {row.rto}
                          </td>
                          <td className="py-2 font-mono text-[11px]">
                            {row.rpo}
                          </td>
                          <td className="py-2">
                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* CARD 5: 5. RECOVERY STRATEGY (COL-SPAN-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    5. Recovery Strategy
                  </h2>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Strategy Type *
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs">
                        {activePlan.strategyType}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Recovery Method
                      </span>
                      <div className="h-7 px-2 border rounded-md flex items-center bg-muted/20 text-foreground font-medium text-xs">
                        {activePlan.recoveryMethod}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      DR Site
                    </span>
                    <Input
                      value={activePlan.drSite}
                      readOnly
                      className="h-7 text-xs bg-muted/20 font-medium"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">
                      Strategy Details
                    </span>
                    <Textarea
                      value={activePlan.strategyDetails}
                      readOnly
                      className="text-xs h-20 bg-muted/10 resize-none font-medium text-muted-foreground leading-snug"
                    />
                  </div>
                </div>
              </Card>

              {/* CARD 6: 6. RTO / RPO (COL-SPAN-3) */}
              <Card className="lg:col-span-3 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    6. RTO / RPO
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground text-[11px]">
                        <th className="pb-1.5 font-bold">System</th>
                        <th className="pb-1.5 font-bold">RTO</th>
                        <th className="pb-1.5 font-bold">RPO</th>
                        <th className="pb-1.5 font-bold">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {recoveryObjectives.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/20">
                          <td className="py-2 font-semibold text-foreground">
                            {row.system}
                          </td>
                          <td className="py-2 font-mono text-[11px]">
                            {row.rto}
                          </td>
                          <td className="py-2 font-mono text-[11px]">
                            {row.rpo}
                          </td>
                          <td className="py-2">
                            <Badge
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-0",
                                row.priority === "Critical"
                                  ? "bg-red-500/10 text-red-600 border-red-200"
                                  : "bg-orange-500/10 text-orange-600 border-orange-200",
                              )}
                            >
                              {row.priority}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* ROW 4: CARDS 7, 8, 9 (BACKUP & REPLICATION | TESTING & EXERCISES | RELATED RECORDS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* CARD 7: 7. BACKUP & REPLICATION STATUS (COL-SPAN-5) */}
              <Card className="lg:col-span-5 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    7. Backup & Replication Status
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground text-[11px]">
                        <th className="pb-1.5 font-bold">System</th>
                        <th className="pb-1.5 font-bold">Backup Status</th>
                        <th className="pb-1.5 font-bold">Last Backup</th>
                        <th className="pb-1.5 font-bold">Replication Lag</th>
                        <th className="pb-1.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {backupStatusList.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/20">
                          <td className="py-2 font-semibold text-foreground">
                            {row.system}
                          </td>
                          <td className="py-2">
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold text-[10px] px-1.5 py-0">
                              {row.backupStatus}
                            </Badge>
                          </td>
                          <td className="py-2 font-mono text-[11px] text-muted-foreground">
                            {row.lastBackup}
                          </td>
                          <td className="py-2 font-mono text-[11px] text-muted-foreground">
                            {row.replicationLag}
                          </td>
                          <td className="py-2">
                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* CARD 8: 8. TESTING & EXERCISES (COL-SPAN-4) */}
              <Card className="lg:col-span-4 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    8. Testing & Exercises
                  </h2>
                </div>

                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground text-[11px]">
                        <th className="pb-1.5 font-bold">Test Type</th>
                        <th className="pb-1.5 font-bold">Date</th>
                        <th className="pb-1.5 font-bold">Result</th>
                        <th className="pb-1.5 font-bold">RTO Achieved</th>
                        <th className="pb-1.5 font-bold">RPO Achieved</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {testExercises.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/20">
                          <td className="py-2 font-semibold text-foreground">
                            {row.testType}
                          </td>
                          <td className="py-2 font-mono text-[11px] text-muted-foreground">
                            {row.date}
                          </td>
                          <td className="py-2">
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold text-[10px] px-1.5 py-0">
                              {row.result}
                            </Badge>
                          </td>
                          <td className="py-2 font-mono text-[11px]">
                            {row.rtoAchieved}
                          </td>
                          <td className="py-2 font-mono text-[11px]">
                            {row.rpoAchieved}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-center pt-1 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs font-semibold"
                    onClick={() => setActiveTab("testing")}
                  >
                    View Test History
                  </Button>
                </div>
              </Card>

              {/* CARD 9: 9. RELATED RECORDS (COL-SPAN-3) */}
              <Card className="lg:col-span-3 p-4 border-border/80 shadow-2xs bg-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
                  <h2 className="text-sm font-bold text-foreground">
                    9. Related Records
                  </h2>
                </div>

                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => {
                      toast({
                        title: "Cross-Module Drilldown",
                        description: "Viewing 2 linked technical incidents.",
                      });
                    }}
                    className="p-2 rounded bg-muted/20 hover:bg-muted/40 cursor-pointer flex items-center justify-between border border-border/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertOctagon className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-foreground">
                        Linked Incidents
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                      <span>{activePlan.linkedIncidentsCount}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      toast({
                        title: "Cross-Module Drilldown",
                        description: "Viewing 1 linked Business Continuity Plan.",
                      });
                    }}
                    className="p-2 rounded bg-muted/20 hover:bg-muted/40 cursor-pointer flex items-center justify-between border border-border/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-foreground">
                        Business Continuity Plans
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                      <span>{activePlan.bcpPlansCount}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      toast({
                        title: "Cross-Module Drilldown",
                        description: "Viewing 4 enterprise technology risk records.",
                      });
                    }}
                    className="p-2 rounded bg-muted/20 hover:bg-muted/40 cursor-pointer flex items-center justify-between border border-border/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ShieldAlert className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-foreground">
                        Risk Records
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                      <span>{activePlan.riskRecordsCount}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      toast({
                        title: "Cross-Module Drilldown",
                        description: "Viewing 2 critical technology vendor records.",
                      });
                    }}
                    className="p-2 rounded bg-muted/20 hover:bg-muted/40 cursor-pointer flex items-center justify-between border border-border/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4 text-indigo-500" />
                      <span className="font-medium text-foreground">
                        Vendor Records
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                      <span>{activePlan.vendorRecordsCount}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      toast({
                        title: "Cross-Module Drilldown",
                        description: "Viewing 3 linked change management requests.",
                      });
                    }}
                    className="p-2 rounded bg-muted/20 hover:bg-muted/40 cursor-pointer flex items-center justify-between border border-border/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <RotateCcw className="h-4 w-4 text-teal-500" />
                      <span className="font-medium text-foreground">
                        Change Requests
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                      <span>{activePlan.changeRequestsCount}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab("actions")}
                    className="p-2 rounded bg-muted/20 hover:bg-muted/40 cursor-pointer flex items-center justify-between border border-border/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ListTodo className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-foreground">
                        Action Items
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                      <span>{activePlan.actionItemsCount}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: SYSTEMS & SCOPE
            ========================================================================= */}
        {activeTab === "scope" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Section 3 & 4: Disaster Recovery Technology Scope & Systems
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Defined perimeter of covered enterprise ERP modules, databases, cloud microservices, and EV charging platforms.
                  </p>
                </div>
                <Badge className="bg-blue-500/10 text-blue-600 font-bold text-xs">
                  8 Systems Covered
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    Enterprise Platforms
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Magnertia ERP (Core)</li>
                    <li>• CRM & Billing Platform</li>
                    <li>• HRMS & Payroll</li>
                    <li>• MES & Manufacturing Execution</li>
                    <li>• Quality Management (QMS)</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-2">
                    <Radio className="h-4 w-4 text-emerald-600" />
                    EV Charging Operations
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Charging Management System</li>
                    <li>• OCPP 1.6 / 2.0.1 Gateway</li>
                    <li>• Station Payment Webhooks</li>
                    <li>• Fleet Telematics & IoT Core</li>
                    <li>• Mobile Consumer App API</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-2">
                    <Cloud className="h-4 w-4 text-indigo-600" />
                    Cloud Infrastructure
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• AWS Mumbai (Primary DC)</li>
                    <li>• Bangalore Cloud Region (DR)</li>
                    <li>• Multi-AZ Aurora PostgreSql</li>
                    <li>• Kubernetes Worker Clusters</li>
                    <li>• Route53 Global Latency DNS</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    Identity & Security
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Okta Single Sign-On (SSO)</li>
                    <li>• Active Directory Federation</li>
                    <li>• HashiCorp Vault Secrets</li>
                    <li>• Cloudflare WAF & DDoS Shield</li>
                    <li>• Immutable Air-Gapped S3 Vault</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 3: BIA & RISK
            ========================================================================= */}
        {activeTab === "bia" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Section 5 & 10: Business Impact Analysis & 5x5 DR Risk Matrix
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Disaster impact scoring (1–5) and likelihood matrix evaluating infrastructure disruptions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 5x5 Risk Matrix */}
                <div className="p-4 rounded-xl border border-border/60 bg-card">
                  <span className="text-xs font-bold text-foreground block mb-3">
                    5x5 DR Risk Matrix (Likelihood × Impact)
                  </span>
                  <div className="grid grid-cols-6 gap-1 text-[11px] text-center font-mono">
                    <div className="font-bold text-muted-foreground">L / I</div>
                    <div className="font-bold text-muted-foreground">1</div>
                    <div className="font-bold text-muted-foreground">2</div>
                    <div className="font-bold text-muted-foreground">3</div>
                    <div className="font-bold text-muted-foreground">4</div>
                    <div className="font-bold text-muted-foreground">5</div>

                    {[5, 4, 3, 2, 1].map((l) => (
                      <div key={`row-${l}`} className="contents">
                        <div className="font-bold text-muted-foreground py-1">
                          {l}
                        </div>
                        {[1, 2, 3, 4, 5].map((i) => {
                          const score = l * i;
                          const isSelected =
                            (l === 4 && i === 5) || (l === 3 && i === 4);
                          return (
                            <div
                              key={`cell-${l}-${i}`}
                              className={cn(
                                "py-1.5 rounded font-bold border transition-all cursor-pointer flex items-center justify-center",
                                score >= 15
                                  ? "bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20"
                                  : score >= 8
                                    ? "bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20"
                                    : "bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20",
                                isSelected && "ring-2 ring-blue-600 scale-95 shadow-xs font-black",
                              )}
                              onClick={() => {
                                toast({
                                  title: `Risk Cell: L${l} × I${i} = ${score}`,
                                  description:
                                    score >= 15
                                      ? "Critical DR Risk: Immediate automated failover architecture required."
                                      : "Controlled Risk: Standard replication and RTO monitoring adequate.",
                                });
                              }}
                            >
                              {score}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* BIA Scoring Breakdown */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-foreground block">
                    Disaster Disruption Impact Assessment
                  </span>
                  {[
                    { area: "Revenue Impact", score: 5, desc: "₹1.2 Cr / hr during total ERP & charging outage" },
                    { area: "Customer Service Impact", score: 4, desc: "High customer friction on failed charging app auth" },
                    { area: "Operational Interruption", score: 4, desc: "Production lines halted due to MES subledger lock" },
                    { area: "Data Integrity & Compliance", score: 5, desc: "Strict GST & ISO 27001 data consistency requirements" },
                    { area: "Brand Reputation", score: 3, desc: "Public scrutiny mitigated if restored within 4h RTO" },
                  ].map((bia) => (
                    <div
                      key={bia.area}
                      className="p-2.5 rounded border border-border/60 bg-muted/20 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs text-foreground block">
                          {bia.area}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {bia.desc}
                        </span>
                      </div>
                      <Badge className="bg-red-500/10 text-red-600 border-red-200 font-bold text-xs px-2 py-0.5">
                        Level {bia.score} / 5
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 4: RECOVERY STRATEGY
            ========================================================================= */}
        {activeTab === "strategy" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Section 11 & 12: Recovery Strategy & DR Architecture Flow
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Active-Passive warm standby architecture with automated Route53 failover to Bangalore Cloud Region.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 rounded-lg border border-border/60 bg-blue-500/5">
                  <div className="text-xs font-bold text-blue-700 mb-1">
                    Primary Site (Active)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Chennai Data Center / AWS Mumbai. Serves 100% production traffic with multi-AZ read-write instances.
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-indigo-500/5">
                  <div className="text-xs font-bold text-indigo-700 mb-1">
                    Replication Layer
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Synchronous DB replication (lag &lt; 2 mins), S3 cross-region bucket mirror, and automated AMIs.
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/60 bg-emerald-500/5">
                  <div className="text-xs font-bold text-emerald-700 mb-1">
                    DR Site (Warm Standby)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Bangalore Cloud Region. Standby database replica auto-promotes in 25 mins upon disaster declaration.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/10 font-mono text-xs text-foreground">
                <div className="font-bold text-primary mb-2">
                  Standard Automated Failover Flow:
                </div>
                <div className="space-y-1 text-[11px] text-muted-foreground">
                  <div>[1] Primary Site Sever Detection (Synthetic probe failure x 3)</div>
                  <div>[2] Automated PagerDuty escalation to DR Manager & CIO</div>
                  <div>[3] Formal Disaster Declaration & Freeze Changes on primary</div>
                  <div>[4] Promote Bangalore Aurora DB replica to Read-Write Master</div>
                  <div>[5] Scale Kubernetes worker nodes from warm standby (2 → 16 nodes)</div>
                  <div>[6] Switch AWS Route53 weighted record to Bangalore VIP</div>
                  <div>[7] Healthcheck validation suite passes (100% smoke tests OK)</div>
                  <div>[8] Service released to users (Total RTO achieved: 3h 45m)</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 5: INFRASTRUCTURE
            ========================================================================= */}
        {activeTab === "infrastructure" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Section 13 & 14: Primary Site vs DR Site Infrastructure Comparison
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Controlled inventory of compute capacity, storage redundancy, and network peering links.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-foreground">
                      Primary Site: Chennai DC
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                      Active Production
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Compute Nodes:</span>
                      <span className="font-mono font-bold">32 vCPU / 256 GB RAM</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Storage Tier:</span>
                      <span className="font-mono font-bold">NVMe SAN 12 TB (RAID 10)</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Network Uplink:</span>
                      <span className="font-mono font-bold">10 Gbps Redundant Fiber</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Power & Cooling:</span>
                      <span className="font-mono font-bold">Tier III Dual UPS + DG</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-foreground">
                      DR Site: Bangalore Cloud Region
                    </span>
                    <Badge className="bg-blue-500/10 text-blue-600 font-bold text-xs">
                      Warm Standby
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Compute Standby:</span>
                      <span className="font-mono font-bold">8 vCPU (Auto-Scales to 32)</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Replica Storage:</span>
                      <span className="font-mono font-bold">Aurora Global DB 12 TB</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Network Gateway:</span>
                      <span className="font-mono font-bold">AWS Direct Connect 5 Gbps</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Activation SLA:</span>
                      <span className="font-mono font-bold">&lt; 30 mins to full scale</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            TAB 6: BACKUP & REPLICATION (SECTION 15, 16 & 17 POLICY & TELEMETRY)
            ========================================================================= */}
        {activeTab === "backup" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Section 15, 16 & 17: Backup Policy Governance & Replication Architecture
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Immutable air-gapped snapshots, WORM vault compliance, and real-time cross-region database replication.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                    WORM Vault Active
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs font-semibold"
                    onClick={() => {
                      toast({
                        title: "Replication Synchronized",
                        description: "Manual trigger completed. Replication lag confirmed under 2 minutes.",
                      });
                    }}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Verify Sync
                  </Button>
                </div>
              </div>

              {/* Top Policy KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">
                    RPO Compliance
                  </span>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">99.8%</div>
                  <span className="text-[10px] text-muted-foreground">Within 30m Target</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">
                    Air-Gapped Vault
                  </span>
                  <div className="text-lg font-black text-blue-600 mt-0.5">S3 Object Lock</div>
                  <span className="text-[10px] text-muted-foreground">365-day WORM retention</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">
                    Failed Backup Jobs
                  </span>
                  <div className="text-lg font-black text-foreground mt-0.5">0</div>
                  <span className="text-[10px] text-emerald-600 font-bold">100% Success (90 Days)</span>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">
                    Encryption Standard
                  </span>
                  <div className="text-lg font-black text-purple-600 mt-0.5">AES-256 (KMS)</div>
                  <span className="text-[10px] text-muted-foreground">FIPS 140-3 Compliant</span>
                </div>
              </div>

              {/* Detailed Backup Policy Schedule Table */}
              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/30">
                    <tr className="border-b border-border/60 text-muted-foreground text-[11px]">
                      <th className="py-2.5 px-3 font-bold">Data Tier</th>
                      <th className="py-2.5 px-3 font-bold">Backup Schedule</th>
                      <th className="py-2.5 px-3 font-bold">Target RPO</th>
                      <th className="py-2.5 px-3 font-bold">Retention Window</th>
                      <th className="py-2.5 px-3 font-bold">Integrity Hash Verification</th>
                      <th className="py-2.5 px-3 font-bold">Vault Destination</th>
                      <th className="py-2.5 px-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      {
                        tier: "Core ERP Transactions (PostgreSQL / Aurora)",
                        schedule: "Continuous WAL + Hourly Snapshot",
                        rpo: "15 mins",
                        retention: "7 Years Statutory",
                        hash: "SHA256: 8f4e2...a901",
                        vault: "AWS S3 Glacier Flexible Vault",
                      },
                      {
                        tier: "EV Station Telemetry & OCPP Logs",
                        schedule: "Hourly Micro-batch",
                        rpo: "30 mins",
                        retention: "3 Years Operational",
                        hash: "SHA256: 12ab9...c440",
                        vault: "Bangalore Cold Archive",
                      },
                      {
                        tier: "Document Attachments & Invoices",
                        schedule: "Daily Differential at 02:00",
                        rpo: "1 hour",
                        retention: "10 Years Tax Audit",
                        hash: "SHA256: 77dc3...ef88",
                        vault: "Multi-AZ Object Store",
                      },
                      {
                        tier: "Container Images & IaC Terraform State",
                        schedule: "Triggered on Git Tag Release",
                        rpo: "Zero Loss",
                        retention: "Perpetual Golden",
                        hash: "SHA256: 99ba4...ff12",
                        vault: "Encrypted ECR + Vault",
                      },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/10">
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {row.tier}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {row.schedule}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-foreground">
                          {row.rpo}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {row.retention}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-600">
                          {row.hash}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground text-[11px]">
                          {row.vault}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[11px] text-blue-600 hover:text-blue-700 px-2"
                            onClick={() => {
                              toast({
                                title: "Integrity Verified",
                                description: `Validated snapshot checksum for ${row.tier}.`,
                              });
                            }}
                          >
                            Verify Hash
                          </Button>
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
            TAB 7: TESTING & EXERCISES (SECTION 36 & 37 DRILL SUITE & VALIDATION)
            ========================================================================= */}
        {activeTab === "testing" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Section 36 & 37: Disaster Recovery Testing & 10-Area Validation Matrix
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official simulation test results across infrastructure, data integrity, security, and business validation.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs font-semibold"
                    onClick={() => {
                      toast({
                        title: "Dossier Exported",
                        description: "Annual DR Simulation Audit Dossier downloaded (PDF).",
                      });
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export Test Dossier
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                    onClick={() => setIsRunTestModalOpen(true)}
                  >
                    <Play className="h-3 w-3" />
                    Launch Simulation Drill
                  </Button>
                </div>
              </div>

              {/* 10-Area Test Results Matrix Table matching Section 37 */}
              <div className="overflow-x-auto rounded-lg border border-border/60 mb-4">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/30">
                    <tr className="border-b border-border/60 text-muted-foreground text-[11px]">
                      <th className="py-2.5 px-3 font-bold">Test Area</th>
                      <th className="py-2.5 px-3 font-bold">Expected Criteria</th>
                      <th className="py-2.5 px-3 font-bold">Actual Drill Result</th>
                      <th className="py-2.5 px-3 font-bold">Variance / SLA</th>
                      <th className="py-2.5 px-3 font-bold">Verification Outcome</th>
                      <th className="py-2.5 px-3 font-bold text-right">Auditor Sign-off</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      { area: "DR Activation", expected: "War room & PagerDuty quorum in < 15 mins", actual: "10 mins achieved", variance: "-5 mins", result: "Pass", signoff: "DR Manager" },
                      { area: "Infrastructure", expected: "Bangalore worker nodes scale to 32 nodes", actual: "32 nodes ready in 22 mins", variance: "Target Met", result: "Pass", signoff: "Infra Lead" },
                      { area: "Network Routing", expected: "AWS Route53 DNS weighted failover", actual: "TTL expired, traffic rerouted in 4 mins", variance: "Target Met", result: "Pass", signoff: "Network Lead" },
                      { area: "Database Recovery", expected: "Promote Aurora read replica to RW master", actual: "RW enabled in 24 mins (RPO < 15m)", variance: "-6 mins", result: "Pass", signoff: "DBA Lead" },
                      { area: "Application Services", expected: "Core ERP pods healthy & container live", actual: "100% microservice pods 1/1 Running", variance: "Target Met", result: "Pass", signoff: "App Lead" },
                      { area: "Security & Identity", expected: "Okta SSO / MFA authentication live", actual: "All user directory tokens validated", variance: "Target Met", result: "Pass", signoff: "CISO Desk" },
                      { area: "Data Integrity", expected: "Trial balance & invoice hash checksum 100%", actual: "Zero uncommitted transaction loss", variance: "Zero Loss", result: "Pass", signoff: "Finance Lead" },
                      { area: "Business Validation", expected: "OCPP station telemetry & payment API live", actual: "Station webhooks returned HTTP 200 OK", variance: "100% Online", result: "Pass", signoff: "Ops Head" },
                      { area: "Failback Verification", expected: "Bidirectional sync back to Chennai DC", actual: "Delta resynced with zero downtime", variance: "Validated", result: "Pass", signoff: "CIO Review" },
                    ].map((row) => (
                      <tr key={row.area} className="hover:bg-muted/10">
                        <td className="py-2.5 px-3 font-bold text-foreground">
                          {row.area}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {row.expected}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-foreground">
                          {row.actual}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-600 font-semibold">
                          {row.variance}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 font-bold text-[10px] px-2 py-0.5">
                            {row.result}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px] text-muted-foreground">
                          {row.signoff}
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
            TAB 8: ACTIONS
            ========================================================================= */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Section 35: Disaster Recovery Corrective Actions (CAPA)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Open engineering actions from DR tests, risk audits, and architecture reviews.
                  </p>
                </div>
                <Badge className="bg-purple-500/10 text-purple-600 font-bold text-xs">
                  5 Open Actions
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground text-[11px]">
                      <th className="pb-2 font-bold">Action Item</th>
                      <th className="pb-2 font-bold">Owner</th>
                      <th className="pb-2 font-bold">Priority</th>
                      <th className="pb-2 font-bold">Due Date</th>
                      <th className="pb-2 font-bold">Status</th>
                      <th className="pb-2 font-bold">Resolution Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {actionItems.map((act) => (
                      <tr key={act.id} className="hover:bg-muted/20">
                        <td className="py-2.5 font-semibold text-foreground max-w-sm">
                          {act.action}
                        </td>
                        <td className="py-2.5 text-muted-foreground">{act.owner}</td>
                        <td className="py-2.5">
                          <Badge
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0",
                              act.priority === "Critical"
                                ? "bg-red-500/10 text-red-600 border-red-200"
                                : "bg-orange-500/10 text-orange-600 border-orange-200",
                            )}
                          >
                            {act.priority}
                          </Badge>
                        </td>
                        <td className="py-2.5 font-mono text-[11px]">{act.dueDate}</td>
                        <td className="py-2.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-semibold",
                              act.status === "In Progress"
                                ? "border-blue-400 text-blue-600"
                                : "border-muted text-muted-foreground",
                            )}
                          >
                            {act.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-muted-foreground truncate max-w-xs text-[11px]">
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
            TAB 9: RELATED RECORDS (CROSS-MODULE TRACEABILITY LEDGER)
            ========================================================================= */}
        {activeTab === "related" && (
          <div className="space-y-4">
            <Card className="p-4 border-border/80 shadow-2xs bg-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Section 42 & 43: Cross-Module ERP Governance & Traceability Ledger
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Bidirectional linkages connecting DR Plan to Incidents, Business Continuity Plans, Enterprise Risks, and Vendor SLAs.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs font-semibold"
                    onClick={() => setIsLinkIncidentModalOpen(true)}
                  >
                    <Link2 className="h-3.5 w-3.5 text-purple-600" />
                    Link Incident
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                    onClick={() => {
                      toast({
                        title: "Link BCP Record",
                        description: "Linked active plan to BCP-2026-001 (EV Charging Continuity).",
                      });
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Link BCP Plan
                  </Button>
                </div>
              </div>

              {/* Comprehensive Cross-Module Traceability Table */}
              <div className="overflow-x-auto rounded-lg border border-border/60">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/30">
                    <tr className="border-b border-border/60 text-muted-foreground text-[11px]">
                      <th className="py-2.5 px-3 font-bold">Module Origin</th>
                      <th className="py-2.5 px-3 font-bold">Record ID</th>
                      <th className="py-2.5 px-3 font-bold">Linked Title / Context</th>
                      <th className="py-2.5 px-3 font-bold">Relationship Type</th>
                      <th className="py-2.5 px-3 font-bold">Severity / Status</th>
                      <th className="py-2.5 px-3 font-bold">Owner / Custodian</th>
                      <th className="py-2.5 px-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      {
                        module: "Incident Management",
                        icon: AlertOctagon,
                        color: "text-red-600",
                        id: "INC-2026-001",
                        title: "HT Substation Line 3 Failure & Power Drop",
                        relationship: "Disaster Trigger Event",
                        status: "P1 Critical",
                        statusBadge: "bg-red-500/10 text-red-600 border-red-200",
                        owner: "Ramesh S",
                      },
                      {
                        module: "Business Continuity",
                        icon: Shield,
                        color: "text-emerald-600",
                        id: "BCP-2026-001",
                        title: "EV Charging Infrastructure Continuity Plan",
                        relationship: "Parent Continuity Strategy",
                        status: "Active",
                        statusBadge: "bg-emerald-500/10 text-emerald-600 border-emerald-300",
                        owner: "Priya Kumar",
                      },
                      {
                        module: "Enterprise Risk",
                        icon: ShieldAlert,
                        color: "text-amber-600",
                        id: "ER-2026-002",
                        title: "Primary Cloud Region Multi-AZ Outage",
                        relationship: "Underlying Risk Vector",
                        status: "Controlled (Score: 16)",
                        statusBadge: "bg-amber-500/10 text-amber-600 border-amber-200",
                        owner: "Enterprise Risk Team",
                      },
                      {
                        module: "Vendor Management",
                        icon: Globe,
                        color: "text-blue-600",
                        id: "VND-AWS-01",
                        title: "AWS Enterprise Support & DirectConnect SLA",
                        relationship: "Infrastructure Provider SLA",
                        status: "15m SLA Active",
                        statusBadge: "bg-blue-500/10 text-blue-600 border-blue-200",
                        owner: "AWS Enterprise TAM",
                      },
                      {
                        module: "Change Management",
                        icon: RotateCcw,
                        color: "text-teal-600",
                        id: "CR-2026-088",
                        title: "Failback Bidirectional Route53 DNS TTL Reduction",
                        relationship: "Pre-Approved Change Request",
                        status: "Approved",
                        statusBadge: "bg-teal-500/10 text-teal-600 border-teal-200",
                        owner: "Network Lead",
                      },
                    ].map((row) => {
                      const IconComp = row.icon;
                      return (
                        <tr key={row.id} className="hover:bg-muted/10">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5 font-semibold text-foreground">
                              <IconComp className={cn("h-3.5 w-3.5", row.color)} />
                              <span>{row.module}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-primary">
                            {row.id}
                          </td>
                          <td className="py-2.5 px-3 text-foreground font-medium max-w-xs">
                            {row.title}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground text-[11px]">
                            {row.relationship}
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge className={cn("font-bold text-[10px] px-1.5 py-0", row.statusBadge)}>
                              {row.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {row.owner}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-[11px] text-blue-600 hover:text-blue-700 px-2"
                                onClick={() => {
                                  toast({
                                    title: "Record Drilldown",
                                    description: `Opening record ${row.id} from ${row.module}.`,
                                  });
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-[11px] text-red-500 hover:text-red-700 px-1"
                                onClick={() => {
                                  toast({
                                    title: "Link Removed",
                                    description: `Unlinked ${row.id} from this DR plan.`,
                                  });
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                  <h2 className="text-sm font-bold text-foreground">
                    Controlled DR Documentation & Architecture Artifacts
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official runbook dockets, ISO 27001 audit certificates, and network topology schematics.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => {
                    toast({
                      title: "Upload Artifact",
                      description: "File upload dialog opened for controlled DR repository.",
                    });
                  }}
                >
                  <Upload className="h-3 w-3" />
                  Upload Artifact
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: "ERP_Disaster_Recovery_Standard_Runbook_v1.0.pdf", size: "2.4 MB", date: "15-Jan-2026", type: "Runbook" },
                  { name: "Multi_Region_Cloud_Architecture_Topology.drawio", size: "1.1 MB", date: "10-Jan-2026", type: "Architecture" },
                  { name: "AWS_DirectConnect_Failover_Configuration_SOP.docx", size: "850 KB", date: "05-Jan-2026", type: "SOP" },
                  { name: "ISO_22301_Business_Continuity_Audit_Report.pdf", size: "3.8 MB", date: "15-Dec-2025", type: "Compliance" },
                ].map((att) => (
                  <div
                    key={att.name}
                    className="p-2.5 rounded border border-border/60 bg-muted/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <span className="font-semibold text-foreground block">
                          {att.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {att.type} • {att.size} • Uploaded {att.date}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-blue-600 hover:text-blue-700"
                      onClick={() => {
                        toast({
                          title: "Downloading File",
                          description: `Downloading ${att.name}`,
                        });
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
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
                  <h2 className="text-sm font-bold text-foreground">
                    Disaster Recovery Audit Trail & Lifecycle History
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Immutable log of version revisions, committee approvals, drill executions, and failover tests.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { date: "15-Mar-2025 14:30", user: "Ramesh S (Enterprise Ops)", act: "Full DR Simulation Drill Completed (3h 45m achieved)", ver: "v1.0" },
                  { date: "10-Jan-2026 11:00", user: "Priya Kumar (DR Owner)", act: "Annual Review completed; secondary region bandwidth upgraded", ver: "v1.0" },
                  { date: "01-Jan-2026 09:00", user: "Vikram K (Recovery Coord)", act: "Plan activated for 2026 operational year under policy DR-POL-01", ver: "v1.0" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded border border-border/60 bg-muted/10 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-foreground block">
                        {item.act}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        By {item.user} • {item.date}
                      </span>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">
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
          MODAL 1: EDIT DR PLAN MODAL
          ========================================================================= */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Pencil className="h-4 w-4 text-blue-600" />
              Edit Disaster Recovery Plan ({formData.id})
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold">DR Plan Name *</Label>
                <Input
                  value={formData.planName}
                  onChange={(e) =>
                    setFormData({ ...formData, planName: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-bold">DR Code *</Label>
                <Input
                  value={formData.drCode}
                  onChange={(e) =>
                    setFormData({ ...formData, drCode: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold">Primary Site *</Label>
                <Input
                  value={formData.primarySite}
                  onChange={(e) =>
                    setFormData({ ...formData, primarySite: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-bold">DR Site *</Label>
                <Input
                  value={formData.drSite}
                  onChange={(e) =>
                    setFormData({ ...formData, drSite: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-bold">Target RTO</Label>
                <Input
                  value={formData.rtoTarget}
                  onChange={(e) =>
                    setFormData({ ...formData, rtoTarget: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-bold">Target RPO</Label>
                <Input
                  value={formData.rpoTarget}
                  onChange={(e) =>
                    setFormData({ ...formData, rpoTarget: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-bold">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(val: any) =>
                    setFormData({ ...formData, priority: val })
                  }
                >
                  <SelectTrigger className="h-8 text-xs mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold">Recovery Objective</Label>
              <Textarea
                value={formData.recoveryObjective}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recoveryObjective: e.target.value,
                  })
                }
                className="text-xs h-16 mt-1"
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleSavePlan(formData)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 2: ADD CRITICAL IT SERVICE
          ========================================================================= */}
      <Dialog
        open={isNewServiceModalOpen}
        onOpenChange={setIsNewServiceModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              Add Critical IT Service
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-bold">IT Service Name *</Label>
              <Input
                placeholder="e.g., Fleet Telematics Service"
                value={newService.itService}
                onChange={(e) =>
                  setNewService({ ...newService, itService: e.target.value })
                }
                className="h-8 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-bold">Application Covered *</Label>
              <Input
                placeholder="e.g., IoT Telematics Engine v2"
                value={newService.application}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    application: e.target.value,
                  })
                }
                className="h-8 text-xs mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold">Target RTO</Label>
                <Input
                  value={newService.rto}
                  onChange={(e) =>
                    setNewService({ ...newService, rto: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-bold">Target RPO</Label>
                <Input
                  value={newService.rpo}
                  onChange={(e) =>
                    setNewService({ ...newService, rpo: e.target.value })
                  }
                  className="h-8 text-xs mt-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNewServiceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleAddService}
            >
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 3: RUN DR SIMULATION TEST
          ========================================================================= */}
      <Dialog open={isRunTestModalOpen} onOpenChange={setIsRunTestModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Play className="h-4 w-4 text-blue-600" />
              Launch Disaster Recovery Simulation Drill
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-2.5 rounded bg-muted/30 border border-border/60">
              <span className="font-bold text-foreground block">
                Scenario: Data Center Failure & DNS Switchover
              </span>
              <p className="text-muted-foreground mt-0.5">
                Simulate loss of primary Chennai link and automated Route53 failover to Bangalore Cloud Region.
              </p>
            </div>
            <div>
              <Label className="text-xs font-bold">Simulation Drill Scope</Label>
              <Select defaultValue="Full DR Simulation">
                <SelectTrigger className="h-8 text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full DR Simulation">Full DR Simulation</SelectItem>
                  <SelectItem value="Database Failover Test">Database Failover Test</SelectItem>
                  <SelectItem value="Route53 DNS Switch Drill">Route53 DNS Switch Drill</SelectItem>
                  <SelectItem value="Tabletop Exercise">Tabletop Exercise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRunTestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => {
                setIsRunTestModalOpen(false);
                toast({
                  title: "DR Simulation Started",
                  description: "Automated drill runner dispatched. Tracking 4-hour RTO metric.",
                });
              }}
            >
              Initiate Drill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 4: 18-STEP STANDARD RECOVERY RUNBOOK
          ========================================================================= */}
      <Dialog open={isRunbookModalOpen} onOpenChange={setIsRunbookModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Terminal className="h-4 w-4 text-blue-600" />
              Standard 18-Step Disaster Recovery Runbook
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2.5 py-2 text-xs">
            <p className="text-muted-foreground">
              Official controlled execution runbook following Section 27 specification for total datacenter failure.
            </p>

            <div className="space-y-2">
              {runbookSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-2.5 rounded-lg border border-border/60 bg-muted/10 flex items-start gap-3"
                >
                  <span className="h-6 w-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs">
                        {step.title}
                      </span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        ~{step.estimatedMinutes} mins
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-0.5">
                      <span>• Team: <strong className="text-foreground">{step.responsibleTeam}</strong></span>
                      {step.automatedTool && (
                        <span>• Tool: <strong className="text-foreground">{step.automatedTool}</strong></span>
                      )}
                      <span>• Check: <strong className="text-emerald-600">{step.validationCheck}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRunbookModalOpen(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => {
                setIsRunbookModalOpen(false);
                toast({
                  title: "Runbook Exported",
                  description: "Downloaded PDF copy of the 18-Step DR Runbook.",
                });
              }}
            >
              Export Runbook PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL 5: LINK TECHNICAL INCIDENT DIALOG
          ========================================================================= */}
      <Dialog
        open={isLinkIncidentModalOpen}
        onOpenChange={setIsLinkIncidentModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Link2 className="h-4 w-4 text-purple-600" />
              Link Technical Incident to Disaster Recovery Plan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-2.5 rounded bg-muted/20 border border-border/60">
              <span className="font-semibold text-foreground block">
                Active DR Plan: {activePlan.drCode} ({activePlan.planName})
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Establish real-time linkage between an active disruption incident and the warm standby disaster recovery plan.
              </p>
            </div>

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
                    INC-2026-001: HT Substation Line 3 Failure (P1 Critical)
                  </SelectItem>
                  <SelectItem value="INC-2026-002">
                    INC-2026-002: Core Switch Uplink Flapping (P2 Major)
                  </SelectItem>
                  <SelectItem value="INC-2026-003">
                    INC-2026-003: Cloud DB Replication Lag Spike (P2 Major)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-bold">Linkage Type *</Label>
              <Select defaultValue="Disaster Trigger Event">
                <SelectTrigger className="h-8 text-xs mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disaster Trigger Event">
                    Disaster Trigger Event (Outage Root)
                  </SelectItem>
                  <SelectItem value="Mitigating DR Run">
                    Mitigating DR Run (Active Failover)
                  </SelectItem>
                  <SelectItem value="Simulation / Drill Exercise">
                    Simulation / Drill Exercise
                  </SelectItem>
                  <SelectItem value="Post-Mortem Review">
                    Post-Mortem Review
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-bold">Traceability Notes</Label>
              <Textarea
                placeholder="Explain the correlation between this incident and the DR trigger criteria..."
                defaultValue="Incident caused partial DC loss; DR failover initiated under SOP-DR-04."
                className="text-xs h-16 mt-1 resize-none"
              />
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
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              onClick={() => {
                setActivePlan((prev) => ({
                  ...prev,
                  linkedIncidentsCount: prev.linkedIncidentsCount + 1,
                }));
                setIsLinkIncidentModalOpen(false);
                toast({
                  title: "Incident Linked Successfully",
                  description: `Linked ${selectedIncidentToLink} to ${activePlan.drCode}. Bidirectional audit trace established.`,
                });
              }}
            >
              <Link2 className="h-3.5 w-3.5 mr-1" />
              Establish Linkage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default DisasterRecoveryPage;

