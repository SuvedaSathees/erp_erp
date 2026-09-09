import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  RefreshCw,
  Download,
  Printer,
  Calculator,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  IndianRupee,
  Users,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  TrendingUp,
  FileText,
  Calendar,
  MoreHorizontal,
  Check,
  Building2,
  FolderKanban,
  Target,
  FileCode,
  Share2,
  Send,
  Save,
  FileSpreadsheet,
  ArrowRight,
  GitCommit,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  projectPlanningService,
  INITIAL_PLANNING_RECORD,
  type ProjectPlanningRecord,
  type WbsElement,
} from "@/services/projectPlanningService";

export const Route = createFileRoute("/management/project-management/project-planning")({
  head: () => ({
    meta: [
      { title: "Project Planning Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Define and plan your project execution from initiation to closure with complete visibility.",
      },
    ],
  }),
  component: ProjectPlanningPage,
});

export function ProjectPlanningPage() {
  const navigate = useNavigate();
  const [record, setRecord] = useState<ProjectPlanningRecord>(INITIAL_PLANNING_RECORD);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ganttView, setGanttView] = useState<"Day" | "Week" | "Month">("Week");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Modals
  const [isBaselineOpen, setIsBaselineOpen] = useState(false);
  const [baselineVersion, setBaselineVersion] = useState("V1.0");
  const [baselineNotes, setBaselineNotes] = useState("Baseline approved for EV charging deployment scope.");
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<"baseline" | "fastTrack" | "lowCost">("baseline");
  const [isAddWbsOpen, setIsAddWbsOpen] = useState(false);
  const [newWbsName, setNewWbsName] = useState("");
  const [newWbsCode, setNewWbsCode] = useState("");
  const [newWbsWeightage, setNewWbsWeightage] = useState("5");

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRecord({ ...INITIAL_PLANNING_RECORD });
      toast.success("Project plan synchronized with central server baseline.");
    }, 450);
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      const nowFormatted = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      setRecord((prev) => ({
        ...prev,
        lastUpdated: nowFormatted,
      }));
      toast.success("Critical path and schedule float recalculated!", {
        description: "Critical Path: 42 Days | Total Float: 6 Days | Variance: 0.0% (On Schedule)",
      });
    }, 500);
  };

  const handleDuplicatePlan = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newId = `PLN-2026-${randomSuffix}`;
    const newCode = `PRJ-2026-${randomSuffix}`;
    setRecord((prev) => ({
      ...prev,
      projectPlanId: newId,
      projectCode: newCode,
      projectName: `${prev.projectName} (Copy)`,
      planningStatus: "Draft",
      lastUpdated: "Just now",
    }));
    toast.success(`Project plan duplicated as ${newId} (${newCode})`);
  };

  const handleExportXml = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Project xmlns="http://schemas.microsoft.com/project">
  <Name>${record.projectName}</Name>
  <Title>${record.projectPlanId}</Title>
  <ProjectCode>${record.projectCode}</ProjectCode>
  <StartDate>${record.plannedStartDate}</StartDate>
  <FinishDate>${record.plannedEndDate}</FinishDate>
  <Duration>${record.projectDuration}</Duration>
  <Budget>${record.budgetPlanned}</Budget>
  <Tasks>
${record.wbsList.map((w, idx) => `    <Task>
      <UID>${idx + 1}</UID>
      <ID>${w.code}</ID>
      <Name>${w.name}</Name>
      <Duration>${w.duration || "10d"}</Duration>
      <Start>${w.plannedStart || "2026-09-01"}</Start>
      <Finish>${w.plannedFinish || "2026-11-10"}</Finish>
      <PercentComplete>${w.percent}</PercentComplete>
    </Task>`).join("\n")}
  </Tasks>
</Project>`;
    const blob = new Blob([xmlContent], { type: "application/xml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.projectCode}_MS_Project_Schedule.xml`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("MS Project XML schedule exported successfully!");
  };

  const handleCreateBaseline = (e: React.FormEvent) => {
    e.preventDefault();
    setRecord((prev) => ({
      ...prev,
      planningStatus: "Baseline Approved",
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }));
    setIsBaselineOpen(false);
    toast.success(`Baseline ${baselineVersion} Frozen Successfully!`, {
      description: "Scope, Schedule, Cost, and Resource baselines are locked for execution monitoring.",
    });
  };

  const handleAddWbs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWbsName.trim()) return;
    const newEl: WbsElement = {
      id: `wbs-${Date.now()}`,
      code: newWbsCode.trim() || `8.0`,
      name: newWbsName.trim(),
      type: "Phase",
      level: 1,
      parentCode: null,
      version: "V1.0",
      status: "Planned",
      percent: 0,
      owner: "Arun Kumar",
      department: "Project Management Office",
      businessUnit: "Renewable Energy Solutions",
      plannedStart: "01 Sep 2026",
      plannedFinish: "10 Nov 2026",
      duration: "71 Days",
      calendar: "Standard Calendar",
      priority: "Medium",
      critical: false,
      budget: "₹ 5.00 L",
      budgetValue: 5,
      committed: "₹ 0.00 L",
      actual: "₹ 0.00 L",
      remaining: "₹ 5.00 L",
      description: newWbsName,
      weightage: Number(newWbsWeightage) || 5,
      deliverables: [],
      activities: [],
    };
    projectPlanningService.addWbsElement(newEl);
    setRecord((prev) => ({
      ...prev,
      wbsList: [...prev.wbsList, newEl],
      wbsElementsCount: prev.wbsElementsCount + 1,
    }));
    setIsAddWbsOpen(false);
    setNewWbsName("");
    toast.success(`Added WBS element ${newEl.code} - ${newEl.name}`);
  };

  const handleExportDossier = () => {
    const text = `=====================================================
PROJECT PLANNING SPECIFICATION: ${record.projectName}
=====================================================
Project Plan ID: ${record.projectPlanId}
Project Code: ${record.projectCode}
Customer: ${record.customer}
Business Unit: ${record.businessUnit}
Project Sponsor: ${record.projectSponsor}
Project Manager: ${record.projectManager}
Planned Schedule: ${record.plannedStartDate} → ${record.plannedEndDate} (${record.projectDuration})
Contract Value: ${record.contractValue}
Budget: ${record.budgetPlanned}
Planning Status: ${record.planningStatus}

WBS STRUCTURE:
-----------------------------------------------------
${record.wbsList.map((w) => `${w.code} ${w.name} (${w.weightage}% weightage) - ${w.status} [${w.percent}% complete]`).join("\n")}
=====================================================`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record.projectCode}_Project_Plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Project planning dossier downloaded!");
  };

  return (
    <AppShell
      title="Project Planning Form"
      breadcrumb="Management > Project Management > Project Planning"
      description="Define and plan your project execution from initiation to closure with complete visibility."
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
                  Project Planning Form
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Approved
                </span>
                <span className="hidden md:inline-block font-mono text-xs text-muted-foreground">
                  {record.projectPlanId}
                </span>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsBaselineOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Plan
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
                    toast.success("Project plan emailed to stakeholders.");
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
                  <DropdownMenuContent align="end" className="w-52 text-xs">
                    <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-primary" /> Export Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(record, null, 2));
                        toast.success("Project plan JSON copied to clipboard");
                      }}
                      className="cursor-pointer"
                    >
                      <FileCode className="mr-2 h-4 w-4 text-purple-600" /> Copy Plan JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportXml} className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4 text-emerald-600" /> Export MS Project (.XML)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Project plan saved successfully!");
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
             2. PROJECT PLANNING HEADER METADATA CARD (Screenshot 1)
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
              {/* Left Form Fields (9 cols) */}
              <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* Row 1 */}
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Project Plan ID
                  </span>
                  <span className="font-bold font-mono text-sm text-foreground">
                    {record.projectPlanId}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Project Code
                  </span>
                  <span className="font-bold font-mono text-sm text-foreground">
                    {record.projectCode}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Project Sponsor
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {record.projectSponsor}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Planned End Date
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>10 Nov 2026</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Project Name
                  </span>
                  <Input
                    value={record.projectName}
                    onChange={(e) => setRecord({ ...record, projectName: e.target.value })}
                    className="h-7 text-xs font-semibold px-2 py-0 mt-0.5 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Project Type
                  </span>
                  <select
                    value={record.projectType}
                    onChange={(e) => setRecord({ ...record, projectType: e.target.value as any })}
                    className="h-7 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                  >
                    <option value="Customer Project">Customer Project</option>
                    <option value="Internal R&D">Internal R&D</option>
                    <option value="EPC Project">EPC Project</option>
                    <option value="Product Development">Product Development</option>
                  </select>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Project Priority
                  </span>
                  <div className="mt-0.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      {record.projectPriority}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Project Duration
                  </span>
                  <span className="font-bold text-sm text-foreground">
                    {record.projectDuration}
                  </span>
                </div>

                {/* Row 3 */}
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Customer
                  </span>
                  <select
                    value={record.customer}
                    onChange={(e) => setRecord({ ...record, customer: e.target.value })}
                    className="h-7 w-full text-xs font-semibold text-primary rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                  >
                    <option value="ABC Energy Pvt Ltd">ABC Energy Pvt Ltd</option>
                    <option value="VoltCharge Global">VoltCharge Global</option>
                    <option value="Tata Power Fleet">Tata Power Fleet</option>
                  </select>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Project Manager
                  </span>
                  <select
                    value={record.projectManager}
                    onChange={(e) => setRecord({ ...record, projectManager: e.target.value })}
                    className="h-7 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                  >
                    <option value="Arun Kumar">Arun Kumar</option>
                    <option value="Vikram Malhotra">Vikram Malhotra</option>
                    <option value="Devendra Sahu">Devendra Sahu</option>
                  </select>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Planned Start Date
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white mt-0.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>01 Sep 2026</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Planning Status
                  </span>
                  <div className="mt-0.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {record.planningStatus}
                    </span>
                  </div>
                </div>

                {/* Row 4 */}
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Business Unit
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {record.businessUnit}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Department
                  </span>
                  <select
                    value={record.department}
                    onChange={(e) => setRecord({ ...record, department: e.target.value })}
                    className="h-7 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                  >
                    <option value="Project Management Office">Project Management Office</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Project Phase
                  </span>
                  <select
                    value={record.projectPhase}
                    onChange={(e) => setRecord({ ...record, projectPhase: e.target.value as any })}
                    className="h-7 w-full text-xs font-semibold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Execution">Execution</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Closure">Closure</option>
                  </select>
                </div>
              </div>

              {/* Right Summary Card (3 cols) */}
              <div className="lg:col-span-3 bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-lg border border-border/70 text-xs space-y-3">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Contract Value
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {record.contractValue}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Budget (Planned)
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {record.budgetPlanned}
                  </span>
                </div>
                <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                  <span className="block text-[10px] uppercase font-semibold">Last Updated</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{record.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================
             3. SIX METRIC KPI CARDS ROW: PROJECT EXECUTION METRICS
             ==================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Planned Duration */}
            <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Planned Duration</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {record.projectDuration}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  01 Sep → 10 Nov 2026
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
            </div>

            {/* 2. Critical Path */}
            <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Critical Path</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  42 Days
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block mt-1">
                  Zero Float (0.0% Var)
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Target className="h-5 w-5" />
              </div>
            </div>

            {/* 3. WBS Breakdown */}
            <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">WBS Packages</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {record.wbsList.length} Phases
                </span>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/management/project-management/wbs" })}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer flex items-center gap-0.5 mt-1"
                >
                  Open WBS Structure →
                </button>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Layers className="h-5 w-5" />
              </div>
            </div>

            {/* 4. Milestone Gates */}
            <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Milestone Gates</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  9 Gates
                </span>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/management/project-management/milestones" })}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer flex items-center gap-0.5 mt-1"
                >
                  View Milestones →
                </button>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            {/* 5. Budget Utilization */}
            <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Budget Allocation</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {record.budgetUtilizationPct}%
                </span>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/management/project-management/budget-control" })}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer flex items-center gap-0.5 mt-1 truncate max-w-[120px]"
                >
                  View Budget Details →
                </button>
              </div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>

            {/* 6. Resources Allocated */}
            <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Team Allocated</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {record.resourcesAllocatedCount}
                </span>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/management/project-management/resource-allocation" })}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer flex items-center gap-0.5 mt-1"
                >
                  View Resource Load →
                </button>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. MIDDLE SECTION (3 CARDS): WBS STRUCTURE, GANTT CHART, MILESTONES
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Card: WBS Structure (4 cols) */}
            <Card className="lg:col-span-3 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  WBS Structure
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsAddWbsOpen(true)}
                  className="h-7 w-7 text-primary cursor-pointer hover:bg-primary/10"
                  title="Add WBS element"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-2 flex-1">
                <div className="flex justify-between text-[10px] font-semibold text-muted-foreground uppercase pb-1 border-b border-border/40">
                  <span>WBS Code & Name</span>
                  <span>% Weightage</span>
                </div>
                {[
                  { code: "1", name: "Project Management", weight: "8%" },
                  { code: "2", name: "Engineering", weight: "18%" },
                  { code: "3", name: "Procurement", weight: "20%" },
                  { code: "4", name: "Production", weight: "28%" },
                  { code: "5", name: "Installation", weight: "12%" },
                  { code: "6", name: "Testing & Commissioning", weight: "10%" },
                  { code: "7", name: "Project Closure", weight: "4%" },
                ].map((item) => (
                  <div
                    key={item.code}
                    onClick={() => navigate({ to: "/management/project-management/wbs" })}
                    className="p-2 rounded-lg bg-slate-50/60 dark:bg-slate-800/30 hover:bg-primary/10 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-transform" />
                      <span className="font-mono text-primary font-semibold">{item.code}</span>
                      <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                    </div>
                    <span className="font-bold font-mono text-slate-700 dark:text-slate-300 text-xs">
                      {item.weight}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-border font-bold text-xs">
                  <span>Total</span>
                  <span className="text-emerald-600 font-mono">100%</span>
                </div>
              </CardContent>
            </Card>

            {/* Center Card: Project Schedule (Gantt Chart) (6 cols) */}
            <Card className="lg:col-span-6 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Project Schedule (Gantt Chart)
                </CardTitle>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded text-[11px]">
                  {(["Day", "Week", "Month"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setGanttView(v)}
                      className={cn(
                        "px-2.5 py-0.5 rounded font-medium cursor-pointer transition-colors",
                        ganttView === v
                          ? "bg-white dark:bg-slate-700 shadow-2xs text-primary font-bold"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {v}
                    </button>
                  ))}
                  <span className="text-[10px] text-muted-foreground px-1 font-mono">Nov '26</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 text-xs space-y-3">
                {/* Dynamic Timeline Axis based on ganttView */}
                {ganttView === "Day" ? (
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground border-b border-border/60 pb-1.5 pl-32">
                    <span>01 Sep</span>
                    <span>02 Sep</span>
                    <span>03 Sep</span>
                    <span>04 Sep</span>
                    <span>05 Sep</span>
                    <span>06 Sep</span>
                    <span>07 Sep</span>
                    <span>08 Sep</span>
                    <span>09 Sep</span>
                    <span>10 Sep</span>
                  </div>
                ) : ganttView === "Week" ? (
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground border-b border-border/60 pb-1.5 pl-32">
                    <span>W1 Sep 01</span>
                    <span>W2 Sep 08</span>
                    <span>W3 Sep 15</span>
                    <span>W4 Sep 22</span>
                    <span>W5 Sep 29</span>
                    <span>W6 Oct 06</span>
                    <span>W7 Oct 20</span>
                    <span>W8 Nov 10</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground border-b border-border/60 pb-1.5 pl-32">
                    <span>Aug '26 Pre-Kickoff</span>
                    <span>Sep 2026 Phase 1-2</span>
                    <span>Oct 2026 Phase 3-4</span>
                    <span>Nov 2026 Phase 5-7</span>
                  </div>
                )}

                {/* Gantt Bars List */}
                <div className="space-y-2 font-sans">
                  {[
                    { code: "1", task: "Project Management", barColor: "bg-blue-500", left: "0%", width: "95%" },
                    { code: "2", task: "Requirements & Analysis", barColor: "bg-emerald-500", left: "2%", width: "18%" },
                    { code: "2.2", task: "Design & Engineering", barColor: "bg-teal-600", left: "15%", width: "25%" },
                    { code: "3", task: "Procurement", barColor: "bg-purple-600", left: "20%", width: "30%" },
                    { code: "4", task: "Manufacturing", barColor: "bg-rose-500", left: "45%", width: "35%" },
                    { code: "4.3", task: "Assembly & Testing", barColor: "bg-amber-500", left: "55%", width: "28%" },
                    { code: "5", task: "Installation", barColor: "bg-cyan-600", left: "70%", width: "20%" },
                    { code: "6", task: "Commissioning", barColor: "bg-indigo-600", left: "85%", width: "12%" },
                    { code: "7", task: "Project Closure", isMilestone: true, left: "97%" },
                  ].map((row) => (
                    <div key={row.task} className="flex items-center gap-2 h-6">
                      <div className="w-32 truncate shrink-0 text-[11px] font-medium flex items-center gap-1.5">
                        <span className="font-mono text-slate-400 text-[10px]">{row.code}</span>
                        <span className="truncate text-slate-800 dark:text-slate-200">{row.task}</span>
                      </div>
                      <div className="flex-1 bg-slate-100/60 dark:bg-slate-800/40 rounded h-4 relative">
                        {row.isMilestone ? (
                          <div
                            style={{ left: row.left }}
                            className="absolute top-0.5 -ml-2 h-3 w-3 rotate-45 bg-rose-600 border border-white shadow-xs cursor-pointer"
                            title="Milestone: Customer Acceptance (Click to view)"
                            onClick={() => navigate({ to: "/management/project-management/milestones" })}
                          />
                        ) : (
                          <div
                            style={{ left: row.left, width: row.width }}
                            className={cn(
                              "absolute top-0.5 h-3 rounded transition-all shadow-2xs cursor-pointer hover:opacity-80",
                              row.barColor,
                            )}
                            onClick={() => navigate({ to: "/management/project-management/wbs" })}
                            title={`${row.task} - Click to open WBS`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right Card: Milestones (3 cols) */}
            <Card className="lg:col-span-3 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Milestones
                </CardTitle>
                <span className="text-[10px] text-muted-foreground font-mono">9 Gates</span>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-2 flex-1">
                {[
                  { name: "Project Kickoff", date: "01 Sep 2026", status: "Completed" },
                  { name: "Requirements Freeze", date: "07 Sep 2026", status: "Completed" },
                  { name: "Design Freeze", date: "20 Sep 2026", status: "In Progress" },
                  { name: "Procurement Complete", date: "25 Sep 2026", status: "Planned" },
                  { name: "Production Complete", date: "15 Oct 2026", status: "Planned" },
                  { name: "FAT Complete", date: "20 Oct 2026", status: "Planned" },
                  { name: "Installation Complete", date: "30 Oct 2026", status: "Planned" },
                  { name: "Commissioning", date: "05 Nov 2026", status: "Planned" },
                  { name: "Customer Acceptance", date: "10 Nov 2026", status: "Planned" },
                ].map((m) => (
                  <div
                    key={m.name}
                    onClick={() => navigate({ to: "/management/project-management/milestones" })}
                    className="p-1.5 rounded-lg border border-border/40 flex items-center justify-between gap-1 text-[11px] hover:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {m.status === "Completed" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : m.status === "In Progress" ? (
                        <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0 animate-pulse" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-blue-400 shrink-0 ml-1 mr-0.5" />
                      )}
                      <span className="font-semibold text-slate-900 dark:text-white truncate">{m.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">{m.date}</span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/management/project-management/milestones" })}
                  className="w-full text-center text-[11px] font-semibold text-primary pt-2 hover:underline cursor-pointer block"
                >
                  View All Milestones →
                </button>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             5. CRITICAL PATH METHOD (CPM) & SCHEDULE COMPRESSION COCKPIT
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* CPM Float & Precedence Network (7 Cols) */}
            <Card className="lg:col-span-7 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <GitCommit className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      Critical Path Method (CPM) & Precedence Network
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] font-bold border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
                      Zero Float: 42 Days
                    </Badge>
                  </div>
                  <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
                    Critical driving path where any task slip directly delays final project delivery (10 Nov).
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900 shrink-0">
                  +29d Float Available
                </Badge>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {/* Critical Path Sequence Visualizer */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Driving Critical Sequence (Zero Total Float)
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { code: "ACT-023", name: "Detailed Circuit Drawing & Specification Freeze", dur: "10d", float: "0d", state: "In Progress" },
                      { code: "PRC-004", name: "DC Fast-Charge Busbars & High-Current Contactors", dur: "14d", float: "0d", state: "Critical Lead Time" },
                      { code: "ENG-012", name: "Heavy-Gauge Enclosure Stamping & Tooling Release", dur: "6d", float: "0d", state: "Predecessor Dependent" },
                      { code: "PRD-019", name: "Power Module Assembly & High-Voltage Harnessing", dur: "8d", float: "0d", state: "Scheduled" },
                      { code: "QA-008", name: "Factory Acceptance Test (FAT) & Isolation Check", dur: "4d", float: "0d", state: "Scheduled" },
                      { code: "OPS-003", name: "Grid Connection & Customer Acceptance Handover", dur: "Milestone", float: "0d", state: "Gate 4 Target" },
                    ].map((item, idx, arr) => (
                      <div
                        key={item.code}
                        className="flex items-center justify-between p-2 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0">
                            {item.code}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                          <span className="text-muted-foreground">{item.dur}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40">
                            Float: {item.float}
                          </span>
                          {idx < arr.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-muted-foreground/60 hidden sm:inline" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Non-Critical Activities Buffer Pool */}
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between pb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Non-Critical Tasks with Available Float (Buffer Slack)
                    </span>
                    <span className="text-[10px] text-muted-foreground">Protected against slippage</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded border border-border/40 bg-slate-50/50 dark:bg-slate-800/30">
                      <span className="truncate">Firmware Baseline v2.1 Verification</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">+14d Slack</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border border-border/40 bg-slate-50/50 dark:bg-slate-800/30">
                      <span className="truncate">Thermal Runaway CFD Simulation</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">+8d Slack</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border border-border/40 bg-slate-50/50 dark:bg-slate-800/30">
                      <span className="truncate">Cable Harness 3D Routing Mockup</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">+7d Slack</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border border-border/40 bg-slate-50/50 dark:bg-slate-800/30">
                      <span className="truncate">Site Foundation Leveling Audit</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">+5d Slack</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Compression & What-If Fast-Track Simulator (5 Cols) */}
            <Card className="lg:col-span-5 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Schedule Compression & Fast-Tracking
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsScenariosOpen(true)}
                    className="h-7 text-[11px] gap-1 px-2 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Model Scenarios
                  </Button>
                </div>
                <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
                  Evaluate schedule crashing (overtime/air freight) and fast-tracking (parallel execution) trade-offs.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {/* Scenario Option Tiles */}
                <div className="space-y-2">
                  {[
                    {
                      id: "baseline",
                      title: "V1.0 Approved Baseline",
                      duration: "71 Days",
                      deltaDur: "0d",
                      cost: "₹1.67 Cr",
                      deltaCost: "Baseline",
                      technique: "Sequential Finish-to-Start logic",
                    },
                    {
                      id: "fastTrack",
                      title: "Fast-Track & Crashing (+Overtime)",
                      duration: "58 Days",
                      deltaDur: "-13 Days",
                      cost: "₹1.82 Cr",
                      deltaCost: "+₹15 Lakhs",
                      technique: "Air-freight busbars + dual-shift PCB assembly",
                    },
                    {
                      id: "lowCost",
                      title: "Economic Low-Cost Buffer",
                      duration: "79 Days",
                      deltaDur: "+8 Days",
                      cost: "₹1.54 Cr",
                      deltaCost: "-₹13 Lakhs",
                      technique: "Consolidated freight + single-threaded testing",
                    },
                  ].map((sc) => (
                    <div
                      key={sc.id}
                      onClick={() => setSelectedScenario(sc.id as any)}
                      className={cn(
                        "p-3 rounded-xl border transition-all cursor-pointer",
                        selectedScenario === sc.id
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                          : "border-border/60 hover:bg-muted/30 bg-card",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {sc.title}
                          {selectedScenario === sc.id && (
                            <Badge className="text-[9px] h-4 px-1.5 bg-primary text-white">Active Simulation</Badge>
                          )}
                        </span>
                        <span className="font-mono font-bold text-xs text-primary">{sc.duration}</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{sc.technique}</span>
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{sc.deltaCost}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compression Parameters Summary */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-border/50 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Crashing Potential:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">13 Working Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Crashing Cost per Day Saved:</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">₹1.15 Lakhs / Day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Governing Constraint:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">PCB Tooling Precedence Gate</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsScenariosOpen(true)}
                    className="text-[11px] text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    Open AI What-If Scenario Matrix →
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.success("CPM schedule floats successfully validated against baseline V1.0")}
                    className="h-7 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Validate Float Integrity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick-Launch Execution Hub (Deep-Links to all specialized PM sub-modules) */}
          <div className="rounded-xl border border-border/70 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900 p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FolderKanban className="h-4 w-4 text-primary" />
                  Project Execution Modules Navigation Hub
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Access dedicated operational modules for WBS breakdowns, live task execution, time logging, cost EVM, and risk controls.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] w-fit font-semibold text-primary border-primary/30">
                Integrated PM Suite
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-3">
              {[
                { title: "WBS Tree", path: "/management/project-management/wbs", desc: "Hierarchy & Dictionary" },
                { title: "Milestones", path: "/management/project-management/milestones", desc: "Gates & Sign-Offs" },
                { title: "Task Kanban", path: "/management/project-management/task-management", desc: "Live Sprint Boards" },
                { title: "Time Tracking", path: "/management/project-management/time-tracking", desc: "Billable Timesheets" },
                { title: "Resource Load", path: "/management/project-management/resource-allocation", desc: "Capacity & Staffing" },
                { title: "Budget & EVM", path: "/management/project-management/budget-control", desc: "Cost & Variance" },
                { title: "Risk Register", path: "/management/project-management/risk-management", desc: "5x5 Matrix & Mitigations" },
              ].map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate({ to: item.path })}
                  className="p-2.5 rounded-lg border border-border/60 bg-white dark:bg-slate-800/80 hover:border-primary/60 hover:shadow-xs transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

        {/* ====================================================================
           MODALS & DIALOGS
           ==================================================================== */}

        {/* 1. Create Baseline Modal */}
        <Dialog open={isBaselineOpen} onOpenChange={setIsBaselineOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                Freeze Project Execution Baseline
              </DialogTitle>
              <DialogDescription className="text-xs">
                Lock Scope, Schedule, Cost, and Resource baselines for {record.projectName} ({record.projectCode}).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBaseline} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Baseline Version Tag:</label>
                <Input
                  value={baselineVersion}
                  onChange={(e) => setBaselineVersion(e.target.value)}
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Baseline Scope Description & Notes:</label>
                <textarea
                  value={baselineNotes}
                  onChange={(e) => setBaselineNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-white dark:bg-slate-900"
                  required
                />
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-1">
                <span className="font-bold text-primary block">Locking Baselines:</span>
                <p className="text-[11px] text-muted-foreground">
                  ✓ Schedule: 71 Days (01 Sep → 10 Nov) • Budget: ₹ 1.67 Cr • 42 WBS Elements • 24 Resources
                </p>
              </div>
              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsBaselineOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Freeze Baseline
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Project Scope & Objectives Modal */}
        <Dialog open={isScopeOpen} onOpenChange={setIsScopeOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Project Scope & Deliverable Boundaries
              </DialogTitle>
              <DialogDescription className="text-xs">
                Contractual scope definition, acceptance criteria, and project boundaries.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-1">
                <span className="font-bold text-primary uppercase text-[10px] tracking-wider block">Objective</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{record.scope.objective}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 space-y-1.5">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 uppercase text-[10px] tracking-wider block">
                    In-Scope Items
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                    {record.scope.inScope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg border bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/60 space-y-1.5">
                  <span className="font-bold text-rose-700 dark:text-rose-300 uppercase text-[10px] tracking-wider block">
                    Out-of-Scope Items
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                    {record.scope.outOfScope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-card space-y-1.5">
                <span className="font-bold text-foreground uppercase text-[10px] tracking-wider block">
                  Key Deliverables
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {record.scope.deliverables.map((del) => (
                    <div key={del} className="p-2 rounded bg-muted/40 border border-border/50 font-medium text-[11px]">
                      ✓ {del}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsScopeOpen(false)}>Close Scope</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3. AI Scenario Planning Modal */}
        <Dialog open={isScenariosOpen} onOpenChange={setIsScenariosOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Project Scenario Planning
              </DialogTitle>
              <DialogDescription className="text-xs">
                Simulate duration, budget, and risk trade-offs across execution paths.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                {
                  id: "baseline",
                  name: "Baseline Plan",
                  duration: "71 Days",
                  cost: "₹ 1.67 Cr",
                  risk: "Balanced",
                  desc: "Standard procurement lead times and single-shift manufacturing.",
                },
                {
                  id: "fastTrack",
                  name: "Fast Track",
                  duration: "58 Days",
                  cost: "₹ 1.82 Cr",
                  risk: "Medium",
                  desc: "Air freight on controller chipsets + dual shift assembly.",
                },
                {
                  id: "lowCost",
                  name: "Low Cost",
                  duration: "79 Days",
                  cost: "₹ 1.54 Cr",
                  risk: "Low",
                  desc: "Bulk sea procurement and staggered installation deployment.",
                },
              ].map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id as any)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all space-y-2 flex flex-col justify-between",
                    selectedScenario === sc.id
                      ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                      : "border-border hover:bg-muted/40",
                  )}
                >
                  <div>
                    <span className="font-bold text-sm block text-foreground">{sc.name}</span>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-mono font-bold text-primary">{sc.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-mono font-bold">{sc.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk:</span>
                        <Badge variant="outline" className="text-[10px]">{sc.risk}</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">{sc.desc}</p>
                </div>
              ))}
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsScenariosOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsScenariosOpen(false);
                  toast.success(`Selected execution scenario: ${selectedScenario.toUpperCase()}`);
                }}
                className="bg-primary text-white font-semibold"
              >
                Apply Scenario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Add WBS Item Modal */}
        <Dialog open={isAddWbsOpen} onOpenChange={setIsAddWbsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add WBS Element
              </DialogTitle>
              <DialogDescription className="text-xs">
                Add a new work package or phase to the project breakdown structure.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddWbs} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">WBS Code:</label>
                <Input
                  value={newWbsCode}
                  onChange={(e) => setNewWbsCode(e.target.value)}
                  placeholder="e.g. 8.0 or 2.5"
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-bold block mb-1">WBS Element Name:</label>
                <Input
                  value={newWbsName}
                  onChange={(e) => setNewWbsName(e.target.value)}
                  placeholder="e.g. Regulatory Certification / Site Prep"
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div>
                <label className="font-bold block mb-1">% Weightage:</label>
                <Input
                  type="number"
                  value={newWbsWeightage}
                  onChange={(e) => setNewWbsWeightage(e.target.value)}
                  className="h-8 text-xs font-mono"
                  min="1"
                  max="100"
                />
              </div>
              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAddWbsOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Add to WBS
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default ProjectPlanningPage;
