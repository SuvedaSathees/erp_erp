import { useState, useRef, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  RefreshCw,
  Download,
  Upload,
  BarChart2,
  Plus,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar as CalendarIcon,
  Sparkles,
  Layers,
  MoreVertical,
  Edit2,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Building2,
  SlidersHorizontal,
  X,
  Share2,
  FileSpreadsheet,
  Trash2,
  Printer,
  FileText,
  DollarSign,
  ChevronLeft,
  Check,
  Send,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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

export interface ResourceAllocationItem {
  id: string;
  code: string;
  project: string;
  wbs: string;
  activity: string;
  resource: string;
  type: "Human" | "Equipment" | "Team" | "Facility" | "Contractor";
  dept: string;
  startDate: string;
  endDate: string;
  allocPct: number;
  plannedHours: number;
  status: "Planned" | "In Progress" | "Completed" | "Conflict";
  utilization: number;
  priority: "Critical" | "High" | "Medium" | "Low";
}

export const INITIAL_ALLOCATIONS: ResourceAllocationItem[] = [
  {
    id: "alloc-1",
    code: "AL-2026-0215",
    project: "PRJ-2026-0195",
    wbs: "2.2",
    activity: "ACT-023 Drawing Preparation",
    resource: "Electrical Engineer - EE01",
    type: "Human",
    dept: "Engineering",
    startDate: "08 Sep 2026",
    endDate: "15 Sep 2026",
    allocPct: 80,
    plannedHours: 51.2,
    status: "Planned",
    utilization: 80,
    priority: "Critical",
  },
  {
    id: "alloc-2",
    code: "AL-2026-0216",
    project: "PRJ-2026-0195",
    wbs: "2.2",
    activity: "ACT-022 Structural Analysis",
    resource: "Mechanical Engineer - ME01",
    type: "Human",
    dept: "Engineering",
    startDate: "08 Sep 2026",
    endDate: "15 Sep 2026",
    allocPct: 80,
    plannedHours: 51.2,
    status: "Planned",
    utilization: 80,
    priority: "High",
  },
  {
    id: "alloc-3",
    code: "AL-2026-0217",
    project: "PRJ-2026-0195",
    wbs: "2.2.4",
    activity: "ACT-025 Software Design",
    resource: "Software Engineer - SE01",
    type: "Human",
    dept: "Engineering",
    startDate: "12 Sep 2026",
    endDate: "22 Sep 2026",
    allocPct: 60,
    plannedHours: 48.0,
    status: "Planned",
    utilization: 60,
    priority: "High",
  },
  {
    id: "alloc-4",
    code: "AL-2026-0218",
    project: "PRJ-2026-0195",
    wbs: "3.0",
    activity: "ACT-031 RFQ Preparation",
    resource: "Procurement Executive - PE01",
    type: "Human",
    dept: "Procurement",
    startDate: "10 Sep 2026",
    endDate: "15 Sep 2026",
    allocPct: 70,
    plannedHours: 33.6,
    status: "In Progress",
    utilization: 70,
    priority: "Medium",
  },
  {
    id: "alloc-5",
    code: "AL-2026-0219",
    project: "PRJ-2026-0195",
    wbs: "4.2",
    activity: "ACT-045 Manufacturing",
    resource: "Production Engineer - PE01",
    type: "Human",
    dept: "Production",
    startDate: "26 Sep 2026",
    endDate: "15 Oct 2026",
    allocPct: 90,
    plannedHours: 144.0,
    status: "Planned",
    utilization: 90,
    priority: "High",
  },
  {
    id: "alloc-6",
    code: "AL-2026-0220",
    project: "PRJ-2026-0195",
    wbs: "2.2",
    activity: "ACT-018 Architecture Review",
    resource: "Electrical Engineer - EE02",
    type: "Human",
    dept: "Engineering",
    startDate: "10 Sep 2026",
    endDate: "18 Sep 2026",
    allocPct: 125,
    plannedHours: 80.0,
    status: "Conflict",
    utilization: 125,
    priority: "Critical",
  },
  {
    id: "alloc-7",
    code: "AL-2026-0221",
    project: "PRJ-2026-0195",
    wbs: "5.0",
    activity: "ACT-051 Transformer Rigging",
    resource: "Installation Team - IT01",
    type: "Team",
    dept: "Installation",
    startDate: "25 Oct 2026",
    endDate: "30 Oct 2026",
    allocPct: 118,
    plannedHours: 188.8,
    status: "Conflict",
    utilization: 118,
    priority: "Critical",
  },
  {
    id: "alloc-8",
    code: "AL-2026-0222",
    project: "PRJ-2026-0195",
    wbs: "4.2",
    activity: "ACT-042 Enclosure Milling",
    resource: "CNC Machine - CNC01",
    type: "Equipment",
    dept: "Production",
    startDate: "18 Sep 2026",
    endDate: "24 Sep 2026",
    allocPct: 105,
    plannedHours: 84.0,
    status: "Conflict",
    utilization: 105,
    priority: "High",
  },
  {
    id: "alloc-9",
    code: "AL-2026-0223",
    project: "PRJ-2026-0195",
    wbs: "6.0",
    activity: "ACT-061 Dielectric Safety Check",
    resource: "QA Engineer - QA01",
    type: "Human",
    dept: "Quality",
    startDate: "12 Sep 2026",
    endDate: "20 Sep 2026",
    allocPct: 105,
    plannedHours: 67.2,
    status: "Conflict",
    utilization: 105,
    priority: "Medium",
  },
  {
    id: "alloc-10",
    code: "AL-2026-0224",
    project: "PRJ-2026-0195",
    wbs: "2.2",
    activity: "ACT-024 Chassis Design",
    resource: "Mechanical Engineer Team",
    type: "Team",
    dept: "Engineering",
    startDate: "14 Sep 2026",
    endDate: "28 Sep 2026",
    allocPct: 82,
    plannedHours: 131.2,
    status: "In Progress",
    utilization: 82,
    priority: "Medium",
  },
  {
    id: "alloc-11",
    code: "AL-2026-0225",
    project: "PRJ-2026-0195",
    wbs: "6.0",
    activity: "ACT-062 High Voltage Testing",
    resource: "High-Voltage Test Bay",
    type: "Facility",
    dept: "Quality",
    startDate: "16 Sep 2026",
    endDate: "25 Sep 2026",
    allocPct: 75,
    plannedHours: 60.0,
    status: "In Progress",
    utilization: 75,
    priority: "High",
  },
  {
    id: "alloc-12",
    code: "AL-2026-0226",
    project: "PRJ-2026-0195",
    wbs: "5.0",
    activity: "ACT-052 High-Tension Cabling",
    resource: "Electrical Wiring Subcontractor",
    type: "Contractor",
    dept: "Installation",
    startDate: "01 Oct 2026",
    endDate: "12 Oct 2026",
    allocPct: 85,
    plannedHours: 68.0,
    status: "Planned",
    utilization: 85,
    priority: "Medium",
  },
  {
    id: "alloc-13",
    code: "AL-2026-0227",
    project: "PRJ-2026-0195",
    wbs: "4.2",
    activity: "ACT-043 Surface Mount Placement",
    resource: "Surface Mount Assembly Line",
    type: "Equipment",
    dept: "Production",
    startDate: "28 Sep 2026",
    endDate: "15 Oct 2026",
    allocPct: 80,
    plannedHours: 128.0,
    status: "In Progress",
    utilization: 80,
    priority: "High",
  },
  {
    id: "alloc-14",
    code: "AL-2026-0228",
    project: "PRJ-2026-0195",
    wbs: "2.2",
    activity: "ACT-021 CFD Fluid Dynamics",
    resource: "Thermal Simulation Server",
    type: "Facility",
    dept: "Engineering",
    startDate: "08 Sep 2026",
    endDate: "14 Sep 2026",
    allocPct: 50,
    plannedHours: 40.0,
    status: "Planned",
    utilization: 50,
    priority: "Low",
  },
  {
    id: "alloc-15",
    code: "AL-2026-0229",
    project: "PRJ-2026-0195",
    wbs: "5.0",
    activity: "ACT-053 Site Commissioning",
    resource: "Field Commissioning Van",
    type: "Equipment",
    dept: "Installation",
    startDate: "20 Oct 2026",
    endDate: "05 Nov 2026",
    allocPct: 95,
    plannedHours: 76.0,
    status: "Planned",
    utilization: 95,
    priority: "High",
  },
  {
    id: "alloc-16",
    code: "AL-2026-0230",
    project: "PRJ-2026-0195",
    wbs: "1.0",
    activity: "ACT-001 Project Governance",
    resource: "Project Manager - PM01",
    type: "Human",
    dept: "Project Mgmt",
    startDate: "01 Sep 2026",
    endDate: "30 Nov 2026",
    allocPct: 65,
    plannedHours: 52.0,
    status: "In Progress",
    utilization: 65,
    priority: "Medium",
  },
  {
    id: "alloc-17",
    code: "AL-2026-0231",
    project: "PRJ-2026-0195",
    wbs: "4.2",
    activity: "ACT-044 Structural MIG Welding",
    resource: "Structural Welder - Contractor",
    type: "Contractor",
    dept: "Production",
    startDate: "22 Sep 2026",
    endDate: "05 Oct 2026",
    allocPct: 90,
    plannedHours: 72.0,
    status: "Planned",
    utilization: 90,
    priority: "High",
  },
  {
    id: "alloc-18",
    code: "AL-2026-0232",
    project: "PRJ-2026-0195",
    wbs: "6.0",
    activity: "ACT-063 RF Shielding Verification",
    resource: "EMC Compliance Chamber",
    type: "Facility",
    dept: "Quality",
    startDate: "24 Sep 2026",
    endDate: "30 Sep 2026",
    allocPct: 70,
    plannedHours: 56.0,
    status: "Planned",
    utilization: 70,
    priority: "High",
  },
  {
    id: "alloc-19",
    code: "AL-2026-0233",
    project: "PRJ-2026-0195",
    wbs: "2.3",
    activity: "ACT-026 Hardware-in-Loop Test",
    resource: "Firmware Validation Rig",
    type: "Equipment",
    dept: "Engineering",
    startDate: "18 Sep 2026",
    endDate: "28 Sep 2026",
    allocPct: 60,
    plannedHours: 48.0,
    status: "In Progress",
    utilization: 60,
    priority: "Medium",
  },
  {
    id: "alloc-20",
    code: "AL-2026-0234",
    project: "PRJ-2026-0195",
    wbs: "5.0",
    activity: "ACT-050 Foundation Piling",
    resource: "Civil Foundation Subcontractor",
    type: "Contractor",
    dept: "Installation",
    startDate: "05 Sep 2026",
    endDate: "18 Sep 2026",
    allocPct: 100,
    plannedHours: 80.0,
    status: "Planned",
    utilization: 100,
    priority: "Critical",
  },
];

export const Route = createFileRoute("/management/project-management/resource-allocation")({
  head: () => ({
    meta: [
      { title: "Resource Allocation Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content: "Allocate and manage project resources efficiently to ensure optimum utilization.",
      },
    ],
  }),
  component: ResourceAllocationFormPage,
});

export function ResourceAllocationFormPage() {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState<ResourceAllocationItem[]>(INITIAL_ALLOCATIONS);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Bar State
  const [filterProject, setFilterProject] = useState("Smart EV Charging Infrastructure");
  const [filterWbs, setFilterWbs] = useState("All WBS");
  const [filterActivity, setFilterActivity] = useState("All Activities");
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterResource, setFilterResource] = useState("All Resources");
  const [filterAllocStatus, setFilterAllocStatus] = useState("All");

  // Pagination & Display
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);

  // Modals
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<ResourceAllocationItem | null>(null);
  const [isCapacityOpen, setIsCapacityOpen] = useState(false);
  const [isReallocateOpen, setIsReallocateOpen] = useState(false);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);

  // New Allocation Modal Form State
  const [newActivity, setNewActivity] = useState("ACT-023 Drawing Preparation");
  const [newResource, setNewResource] = useState("Electrical Engineer - EE01");
  const [newDept, setNewDept] = useState("Engineering");
  const [newStart, setNewStart] = useState("08 Sep 2026");
  const [newEnd, setNewEnd] = useState("15 Sep 2026");
  const [newPct, setNewPct] = useState(80);
  const [newHours, setNewHours] = useState(51.2);
  const [newPriority, setNewPriority] = useState<ResourceAllocationItem["priority"]>("Critical");

  const handleClearFilters = () => {
    setFilterWbs("All WBS");
    setFilterActivity("All Activities");
    setFilterType("All Types");
    setFilterStatus("All");
    setFilterDept("All Departments");
    setFilterResource("All Resources");
    setFilterAllocStatus("All");
    setSearchQuery("");
    setActiveKpiFilter(null);
    setCurrentPage(1);
    toast.info("Resource allocation filters reset to default.");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setAllocations(INITIAL_ALLOCATIONS);
      handleClearFilters();
      toast.success("Resource capacity, conflict checks, and allocations refreshed from ERP core.");
    }, 450);
  };

  const handleCreateAllocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ResourceAllocationItem = {
      id: `alloc-${Date.now()}`,
      code: `AL-2026-02${Math.floor(35 + Math.random() * 65)}`,
      project: "PRJ-2026-0195",
      wbs: "2.2",
      activity: newActivity,
      resource: newResource,
      type: "Human",
      dept: newDept,
      startDate: newStart,
      endDate: newEnd,
      allocPct: Number(newPct),
      plannedHours: Number(newHours),
      status: "Planned",
      utilization: Number(newPct),
      priority: newPriority,
    };

    setAllocations((prev) => [newRecord, ...prev]);
    setIsAllocateOpen(false);
    toast.success(`Allocated ${newResource} (${newPct}%) to ${newActivity}`);
  };

  const handleSaveEditAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAllocation) return;
    setAllocations((prev) =>
      prev.map((item) => (item.id === editingAllocation.id ? editingAllocation : item)),
    );
    setIsEditOpen(false);
    toast.success(`Updated allocation for ${editingAllocation.resource}`);
  };

  const handleDeleteAllocation = (id: string) => {
    setAllocations((prev) => prev.filter((a) => a.id !== id));
    toast.success("Allocation removed successfully.");
  };

  const handleApplyReallocation = () => {
    setAllocations((prev) =>
      prev.map((item) => {
        if (item.code === "AL-2026-0220") {
          return {
            ...item,
            allocPct: 100,
            utilization: 100,
            status: "Planned",
            plannedHours: 64.0,
          };
        }
        return item;
      }),
    );
    setIsReallocateOpen(false);
    toast.success("Conflict Resolved! Reallocated 45% of ACT-023 from EE02 to EE03.", {
      description: "Schedule impact: 0 days | Cost impact: +₹12,000 | EE02 load normalized to 100%.",
    });
  };

  const handleExportCsv = () => {
    const csvContent =
      "Allocation Code,Project,WBS,Activity,Resource,Type,Department,Start Date,End Date,Alloc %,Planned Hours,Status,Utilization,Priority\n" +
      allocations
        .map(
          (a) =>
            `"${a.code}","${a.project}","${a.wbs}","${a.activity}","${a.resource}","${a.type}","${a.dept}","${a.startDate}","${a.endDate}",${a.allocPct},${a.plannedHours},"${a.status}",${a.utilization},"${a.priority}"`,
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "PRJ-2026-0195_Resource_Allocations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Resource allocations exported to CSV.");
  };

  const handleExportDossier = () => {
    const dossier = `=====================================================
RESOURCE ALLOCATION & CAPACITY DOSSIER
Project: Smart EV Charging Infrastructure (PRJ-2026-0195)
Generated: ${new Date().toLocaleString()}
Active Allocations: ${allocations.length} | Avg Utilization: 78.6%
=====================================================

RESOURCE ROSTER:
-----------------------------------------------------
${allocations
  .map(
    (a) =>
      `[${a.code}] ${a.resource} (${a.type} - ${a.dept})
  Activity: ${a.wbs} / ${a.activity}
  Window: ${a.startDate} to ${a.endDate}
  Alloc: ${a.allocPct}% | Planned Hours: ${a.plannedHours.toFixed(1)}h | Status: ${a.status} [Priority: ${a.priority}]
`,
  )
  .join("\n")}
=====================================================`;

    const blob = new Blob([dossier], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PRJ-2026-0195_Resource_Dossier.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Resource Allocation Dossier (.TXT) downloaded.");
  };

  // Filtered allocations
  const filteredAllocations = useMemo(() => {
    return allocations.filter((a) => {
      const matchesSearch =
        !searchQuery ||
        a.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.dept.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesWbs = filterWbs === "All WBS" || a.wbs.startsWith(filterWbs.split(" ")[0]);
      const matchesActivity = filterActivity === "All Activities" || a.activity === filterActivity;
      const matchesType = filterType === "All Types" || a.type === filterType;
      const matchesStatus = filterStatus === "All" || a.status === filterStatus;
      const matchesDept = filterDept === "All Departments" || a.dept === filterDept;
      const matchesResource = filterResource === "All Resources" || a.resource === filterResource;

      const matchesAllocStatus =
        filterAllocStatus === "All"
          ? true
          : filterAllocStatus === "Overallocated"
          ? a.utilization > 100
          : filterAllocStatus === "Underallocated"
          ? a.utilization < 75
          : filterAllocStatus === "Allocated"
          ? a.utilization >= 75 && a.utilization <= 100
          : true;

      // Active KPI card quick filters
      const matchesKpi =
        !activeKpiFilter
          ? true
          : activeKpiFilter === "allocated"
          ? a.status !== "Conflict"
          : activeKpiFilter === "overloaded"
          ? a.utilization > 100
          : activeKpiFilter === "conflicts"
          ? a.status === "Conflict"
          : activeKpiFilter === "available"
          ? a.utilization < 80
          : true;

      return (
        matchesSearch &&
        matchesWbs &&
        matchesActivity &&
        matchesType &&
        matchesStatus &&
        matchesDept &&
        matchesResource &&
        matchesAllocStatus &&
        matchesKpi
      );
    });
  }, [
    allocations,
    searchQuery,
    filterWbs,
    filterActivity,
    filterType,
    filterStatus,
    filterDept,
    filterResource,
    filterAllocStatus,
    activeKpiFilter,
  ]);

  // Paginated allocations
  const paginatedAllocations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAllocations.slice(start, start + pageSize);
  }, [filteredAllocations, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredAllocations.length / pageSize));

  return (
    <AppShell
      title="Resource Allocation Form"
      breadcrumb="Management > Project Management > Resource Allocation"
      description="Allocate and manage project resources efficiently to ensure optimum utilization."
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
                  Resource Allocation Form
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
                  onClick={() => setIsAllocateOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Allocate Resource
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
                    toast.success("Resource plan emailed to project leads.");
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
                    <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer">
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export CSV Roster
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-primary" /> Export Allocation Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsHeatmapOpen(true)} className="cursor-pointer">
                      <Layers className="mr-2 h-4 w-4 text-purple-600" /> Resource Heatmap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Resource allocations saved successfully!");
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
             2. TOP FILTER / SELECTION CONTEXT BAR
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
            {/* Row 1: Project, Project Code, WBS, Activity, Resource Type, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-xs">
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
                  <option>2.1 Requirements</option>
                  <option>2.2 Design</option>
                  <option>2.2.4 Software Design</option>
                  <option>2.3 Engineering Validation</option>
                  <option>3.0 Procurement</option>
                  <option>4.2 Manufacturing</option>
                  <option>5.0 Installation</option>
                  <option>6.0 Testing</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Activity
                </span>
                <select
                  value={filterActivity}
                  onChange={(e) => setFilterActivity(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All Activities</option>
                  <option>ACT-001 Project Governance</option>
                  <option>ACT-018 Architecture Review</option>
                  <option>ACT-021 CFD Fluid Dynamics</option>
                  <option>ACT-022 Structural Analysis</option>
                  <option>ACT-023 Drawing Preparation</option>
                  <option>ACT-024 Chassis Design</option>
                  <option>ACT-025 Software Design</option>
                  <option>ACT-026 Hardware-in-Loop Test</option>
                  <option>ACT-031 RFQ Preparation</option>
                  <option>ACT-042 Enclosure Milling</option>
                  <option>ACT-043 Surface Mount Placement</option>
                  <option>ACT-044 Structural MIG Welding</option>
                  <option>ACT-045 Manufacturing</option>
                  <option>ACT-050 Foundation Piling</option>
                  <option>ACT-051 Transformer Rigging</option>
                  <option>ACT-052 High-Tension Cabling</option>
                  <option>ACT-053 Site Commissioning</option>
                  <option>ACT-061 Dielectric Safety Check</option>
                  <option>ACT-062 High Voltage Testing</option>
                  <option>ACT-063 RF Shielding Verification</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Resource Type
                </span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All Types</option>
                  <option>Human</option>
                  <option>Equipment</option>
                  <option>Team</option>
                  <option>Facility</option>
                  <option>Contractor</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Status
                </span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Conflict</option>
                </select>
              </div>
            </div>

            {/* Row 2: Department, Resource, From Date, To Date, Allocation Status, Clear Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-xs pt-1">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Department
                </span>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Production</option>
                  <option>Procurement</option>
                  <option>Quality</option>
                  <option>Installation</option>
                  <option>Project Mgmt</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Resource
                </span>
                <select
                  value={filterResource}
                  onChange={(e) => setFilterResource(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All Resources</option>
                  <option>Electrical Engineer - EE01</option>
                  <option>Electrical Engineer - EE02</option>
                  <option>Mechanical Engineer - ME01</option>
                  <option>Software Engineer - SE01</option>
                  <option>Production Engineer - PE01</option>
                  <option>QA Engineer - QA01</option>
                  <option>Installation Team - IT01</option>
                  <option>CNC Machine - CNC01</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  From Date
                </span>
                <div className="h-8 px-2 flex items-center justify-between font-medium text-xs bg-slate-50 dark:bg-slate-800 rounded-md border border-input mt-0.5">
                  <span>01 Sep 2026</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  To Date
                </span>
                <div className="h-8 px-2 flex items-center justify-between font-medium text-xs bg-slate-50 dark:bg-slate-800 rounded-md border border-input mt-0.5">
                  <span>30 Nov 2026</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Allocation Status
                </span>
                <select
                  value={filterAllocStatus}
                  onChange={(e) => setFilterAllocStatus(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option value="All">All</option>
                  <option value="Allocated">Allocated (75-100%)</option>
                  <option value="Overallocated">Overallocated (&gt;100%)</option>
                  <option value="Underallocated">Underallocated (&lt;75%)</option>
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

          {/* ====================================================================
             3. SIX METRIC KPI CARDS ROW (Interactive Click-to-Filter)
             ==================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Total Resources */}
            <div
              onClick={() => {
                setActiveKpiFilter(null);
                handleClearFilters();
                toast.info("Showing all 126 project resources.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs",
                activeKpiFilter === null && "ring-2 ring-primary/60",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Total Resources
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  126
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDetailsOpen(true);
                  }}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer block mt-1"
                >
                  View All Resources →
                </button>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
            </div>

            {/* 2. Allocated Resources */}
            <div
              onClick={() => {
                setActiveKpiFilter("allocated");
                toast.info("Filtered for currently allocated resources (98 items).");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-xs",
                activeKpiFilter === "allocated" && "ring-2 ring-emerald-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Allocated Resources
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  98
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  77.8% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>

            {/* 3. Overloaded */}
            <div
              onClick={() => {
                setActiveKpiFilter("overloaded");
                toast.info("Filtered for overloaded resources (>100% capacity).");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-amber-500/60 hover:shadow-xs",
                activeKpiFilter === "overloaded" && "ring-2 ring-amber-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Overloaded</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  11
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
                  8.7% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            {/* 4. Conflicts */}
            <div
              onClick={() => {
                setActiveKpiFilter("conflicts");
                toast.info("Filtered for active resource schedule conflicts.");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-rose-500/60 hover:shadow-xs",
                activeKpiFilter === "conflicts" && "ring-2 ring-rose-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Conflicts</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  7
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  Active Conflicts
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* 5. Avg Utilization */}
            <div
              onClick={() => toast.info("Resource pool utilization: 78.6% (Target: 85%). Health: In Normal Buffer.")}
              className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-purple-500/60 hover:shadow-xs"
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Avg Utilization
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  78.6%
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block mt-1">
                  Target: 85%
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center shrink-0">
                <BarChart2 className="h-5 w-5" />
              </div>
            </div>

            {/* 6. Available Capacity */}
            <div
              onClick={() => {
                setActiveKpiFilter("available");
                toast.info("Filtered for resources with available capacity (<80% allocated).");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-cyan-500/60 hover:shadow-xs",
                activeKpiFilter === "available" && "ring-2 ring-cyan-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Available Capacity
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  28
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold block mt-1">
                  22.2% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. MIDDLE SECTION (3 CARDS): DEPT UTILIZATION, ALERTS, SUMMARY
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Card 1: Resource Utilization by Department (4 cols) */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Resource Utilization by Department
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5 text-xs">
                {[
                  { dept: "Engineering", pct: 85, color: "bg-teal-500" },
                  { dept: "Production", pct: 82, color: "bg-emerald-500" },
                  { dept: "Procurement", pct: 61, color: "bg-amber-500" },
                  { dept: "Quality", pct: 72, color: "bg-purple-500" },
                  { dept: "Installation", pct: 94, color: "bg-rose-500" },
                  { dept: "Project Mgmt", pct: 65, color: "bg-blue-500" },
                ].map((item) => (
                  <div
                    key={item.dept}
                    onClick={() => {
                      setFilterDept(item.dept);
                      toast.info(`Filtered allocation table for ${item.dept} department`);
                    }}
                    className="space-y-1 p-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                    title={`Click to filter by ${item.dept}`}
                  >
                    <div className="flex justify-between items-center text-[11px] font-medium">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.dept}</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div
                        style={{ width: `${item.pct}%` }}
                        className={cn("h-2 rounded-full transition-all", item.color)}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Resource Alerts (4 cols) */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Resource Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5 text-xs">
                <div
                  onClick={() => setIsReallocateOpen(true)}
                  className="p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 flex items-start justify-between gap-2 cursor-pointer hover:border-rose-400 transition-colors"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block leading-tight truncate">
                        Electrical Engineer (EE-02) is overallocated at 125%
                      </span>
                      <span className="text-[10px] text-muted-foreground">Period: 10 Sep 2026 - 18 Sep 2026</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-rose-100 text-rose-700 border-rose-300 shrink-0">
                    Critical
                  </Badge>
                </div>

                <div
                  onClick={() => {
                    setSearchQuery("Installation Team");
                    toast.info("Filtered table for Installation Team");
                  }}
                  className="p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 flex items-start justify-between gap-2 cursor-pointer hover:border-rose-400 transition-colors"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block leading-snug">
                        Installation Team (IT-01) is overallocated at 118%
                      </span>
                      <span className="text-[10px] text-muted-foreground">Period: 25 Oct 2026 - 30 Oct 2026</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-rose-100 text-rose-700 border-rose-300 shrink-0">
                    Critical
                  </Badge>
                </div>

                <div
                  onClick={() => {
                    setSearchQuery("CNC Machine");
                    toast.info("Filtered table for CNC Machine-01");
                  }}
                  className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 flex items-start justify-between gap-2 cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block leading-snug">
                        CNC Machine-01 has a conflict on 18 Sep 2026
                      </span>
                      <span className="text-[10px] text-muted-foreground">Activity overlap detected</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-amber-100 text-amber-700 border-amber-300 shrink-0">
                    High
                  </Badge>
                </div>

                <div
                  onClick={() => {
                    setSearchQuery("QA Engineer");
                    toast.info("Filtered table for QA Engineer - QA01");
                  }}
                  className="p-2 rounded-lg bg-yellow-50/60 dark:bg-yellow-950/20 border border-yellow-200/60 flex items-start justify-between gap-2 cursor-pointer hover:border-yellow-400 transition-colors"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <Clock className="h-3.5 w-3.5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block leading-snug">
                        QA Engineer (QA-01) allocation is 105%
                      </span>
                      <span className="text-[10px] text-muted-foreground">Period: 12 Sep 2026 - 20 Sep 2026</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-yellow-100 text-yellow-800 border-yellow-300 shrink-0">
                    Medium
                  </Badge>
                </div>

                <div
                  onClick={() => {
                    setSearchQuery("Mechanical Engineer");
                    toast.info("Filtered table for Mechanical Engineer Team");
                  }}
                  className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 flex items-start justify-between gap-2 cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block leading-snug">
                        Mechanical Engineer team has 18% available capacity
                      </span>
                      <span className="text-[10px] text-muted-foreground">Capacity available for additional tasks</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-emerald-100 text-emerald-700 border-emerald-300 shrink-0">
                    Low
                  </Badge>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAlertsOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block pt-1"
                >
                  View All Alerts →
                </button>
              </CardContent>
            </Card>

            {/* Card 3: Resource Allocation Summary Donut (4 cols) */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Resource Allocation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="91" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="125" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="148" />
                    <circle cx="50" cy="50" r="38" stroke="#1e3a8a" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="163" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">126</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  {[
                    { type: "Human", count: "78 (61.9%)", color: "bg-blue-500" },
                    { type: "Equipment", count: "18 (14.3%)", color: "bg-emerald-500" },
                    { type: "Team", count: "12 (9.5%)", color: "bg-amber-500" },
                    { type: "Facility", count: "8 (6.3%)", color: "bg-purple-500" },
                    { type: "Contractor", count: "10 (7.9%)", color: "bg-blue-900" },
                  ].map((row) => (
                    <div
                      key={row.type}
                      onClick={() => {
                        setFilterType(row.type);
                        toast.info(`Filtered allocation table for ${row.type} resources`);
                      }}
                      className="flex justify-between items-center p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      title={`Filter by ${row.type}`}
                    >
                      <span className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", row.color)} /> {row.type}
                      </span>
                      <span className="font-mono text-muted-foreground font-semibold">{row.count}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left"
                >
                  View Details →
                </button>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             5. LARGE TABLE SECTION: RESOURCE ALLOCATION LIST
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Resource Allocation List
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredAllocations.length} items
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search allocations..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-8 pl-8 text-xs w-48 sm:w-60 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-8 text-xs gap-1 cursor-pointer"
                    title="Reset all filters"
                  >
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Columns visible: All 14 standard allocation attributes.")}
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                    Columns
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-xs text-left border-collapse min-w-[1250px]">
                  <thead>
                    <tr className="border-b bg-muted/40 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      <th className="p-3 pl-4 w-32">Allocation Code</th>
                      <th className="p-3 w-28">Project</th>
                      <th className="p-3 w-20">WBS</th>
                      <th className="p-3 w-56">Activity / Milestone</th>
                      <th className="p-3 w-48">Resource</th>
                      <th className="p-3 w-24">Type</th>
                      <th className="p-3 w-28">Dept.</th>
                      <th className="p-3 w-28 font-mono">Start Date</th>
                      <th className="p-3 w-28 font-mono">End Date</th>
                      <th className="p-3 w-20 font-mono text-center">Alloc. %</th>
                      <th className="p-3 w-24 font-mono text-right">Planned Hours</th>
                      <th className="p-3 w-28">Status</th>
                      <th className="p-3 w-24 font-mono text-center">Utilization</th>
                      <th className="p-3 w-24 text-center">Priority</th>
                      <th className="p-3 pr-4 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {paginatedAllocations.length === 0 ? (
                      <tr>
                        <td colSpan={15} className="p-8 text-center text-muted-foreground">
                          No resource allocations match the selected criteria.
                          <button
                            onClick={handleClearFilters}
                            className="block mx-auto mt-2 text-primary font-bold hover:underline cursor-pointer"
                          >
                            Clear filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      paginatedAllocations.map((a) => (
                        <tr
                          key={a.id}
                          className={cn(
                            "hover:bg-muted/20 transition-colors",
                            a.status === "Conflict" && "bg-rose-50/20 dark:bg-rose-950/10",
                          )}
                        >
                          <td className="p-3 pl-4 font-mono font-bold text-primary text-[11px] whitespace-nowrap">
                            {a.code}
                          </td>
                          <td className="p-3 font-mono text-muted-foreground">{a.project}</td>
                          <td className="p-3 font-mono font-semibold">{a.wbs}</td>
                          <td className="p-3 font-medium text-slate-900 dark:text-white truncate max-w-[220px]">
                            {a.activity}
                          </td>
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {a.resource}
                          </td>
                          <td className="p-3">{a.type}</td>
                          <td className="p-3">{a.dept}</td>
                          <td className="p-3 font-mono text-muted-foreground whitespace-nowrap">{a.startDate}</td>
                          <td className="p-3 font-mono text-muted-foreground whitespace-nowrap">{a.endDate}</td>
                          <td className="p-3 font-mono font-bold">{a.allocPct}%</td>
                          <td className="p-3 font-mono">{a.plannedHours.toFixed(1)}</td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                a.status === "Conflict"
                                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300"
                                  : a.status === "In Progress"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300",
                              )}
                            >
                              {a.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <span
                              className={cn(
                                "font-mono font-bold text-[11px]",
                                a.utilization > 100
                                  ? "text-rose-600"
                                  : a.utilization >= 80
                                  ? "text-emerald-600"
                                  : "text-slate-700 dark:text-slate-300",
                              )}
                            >
                              {a.utilization}%
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold border inline-block",
                                a.priority === "Critical"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : a.priority === "High"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200",
                              )}
                            >
                              {a.priority}
                            </span>
                          </td>
                          <td className="p-3 pr-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAllocation(a);
                                  setIsEditOpen(true);
                                }}
                                className="p-1 rounded text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                                title="Edit Allocation"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              {a.status === "Conflict" ? (
                                <button
                                  type="button"
                                  onClick={() => setIsReallocateOpen(true)}
                                  className="p-1 rounded text-rose-600 hover:text-rose-700 cursor-pointer transition-colors"
                                  title="Resolve Conflict"
                                >
                                  <ShieldAlert className="h-3.5 w-3.5" />
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => handleDeleteAllocation(a.id)}
                                className="p-1 rounded text-muted-foreground hover:text-rose-600 cursor-pointer transition-colors"
                                title="Delete Allocation"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="p-3 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  Showing {filteredAllocations.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredAllocations.length)} of {filteredAllocations.length} entries
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded border hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={cn(
                        "px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors",
                        currentPage === p
                          ? "bg-primary text-white font-bold"
                          : "border hover:bg-muted text-foreground",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded border hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-7 border rounded text-xs px-1 ml-2 bg-slate-50 dark:bg-slate-800 font-medium"
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================================
             6. BOTTOM SECTION (4 CARDS): OVERALLOCATED, HEATMAP, RATE MATRIX, AI RECOMMENDATIONS
             ==================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {/* Card 1: Top Overallocated Resources */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                  Top Overallocated Resources
                </CardTitle>
                <Badge variant="outline" className="text-[9px] bg-rose-50 text-rose-700 border-rose-200 font-mono">
                  5 Bottlenecks
                </Badge>
              </CardHeader>
              <CardContent className="p-3 text-xs flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 text-[11px]">
                    <span className="font-semibold text-rose-800 dark:text-rose-300">Critical Peak Allocation</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Wk 36–38</span>
                  </div>

                  <div className="flex justify-between text-[10px] font-semibold text-muted-foreground px-1 pb-0.5 border-b border-border/40">
                    <span>Resource</span>
                    <span>Department</span>
                    <span>Overalloc.</span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { name: "Electrical Engineer - EE02", dept: "Engineering", over: "+25%", pct: 125, color: "text-rose-600 font-bold", bar: "bg-rose-500" },
                      { name: "Installation Team - IT01", dept: "Installation", over: "+18%", pct: 118, color: "text-rose-600 font-bold", bar: "bg-rose-500" },
                      { name: "QA Engineer - QA01", dept: "Quality", over: "+16%", pct: 116, color: "text-amber-600 font-bold", bar: "bg-amber-500" },
                      { name: "Embedded SW - ES01", dept: "R&D", over: "+12%", pct: 112, color: "text-amber-600 font-bold", bar: "bg-amber-500" },
                      { name: "CNC Machine - CNC01", dept: "Manufacturing", over: "+5%", pct: 105, color: "text-amber-600 font-bold", bar: "bg-amber-500" },
                    ].map((row) => (
                      <div
                        key={row.name}
                        onClick={() => {
                          setSearchQuery(row.name.split(" - ")[0]);
                          toast.info(`Filtered table for ${row.name}`);
                        }}
                        className="p-1.5 rounded hover:bg-muted/40 cursor-pointer transition-colors space-y-1"
                        title={`Filter by ${row.name}`}
                      >
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[130px]">
                            {row.name}
                          </span>
                          <span className="text-muted-foreground text-[10px]">{row.dept}</span>
                          <span className={row.color}>{row.over}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, (row.pct / 130) * 100)}%` }}
                            className={cn("h-full rounded-full", row.bar)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReallocateOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-2 border-t border-border/40"
                >
                  View All Overallocated →
                </button>
              </CardContent>
            </Card>

            {/* Card 2: Resource Capacity Heatmap */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-blue-600" />
                  Resource Capacity Heatmap
                </CardTitle>
                <Badge variant="outline" className="text-[9px] bg-blue-50 text-blue-700 border-blue-200 font-mono">
                  4-Wk Horizon
                </Badge>
              </CardHeader>
              <CardContent className="p-3 text-xs flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 text-[11px]">
                    <span className="font-semibold text-blue-800 dark:text-blue-300">Department Capacity Matrix</span>
                    <span className="text-[10px] text-muted-foreground font-mono">Target: &le;100%</span>
                  </div>

                  <div className="grid grid-cols-5 text-[10px] font-semibold text-muted-foreground text-center px-1 pb-0.5 border-b border-border/40">
                    <span className="text-left">Resource</span>
                    <span>Wk 36</span>
                    <span>Wk 37</span>
                    <span>Wk 38</span>
                    <span>Wk 39</span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { name: "EE Team", w1: "95%", w2: "112%", w3: "125%", w4: "108%", c1: "bg-emerald-100 text-emerald-800", c2: "bg-amber-100 text-amber-800", c3: "bg-rose-100 text-rose-800", c4: "bg-amber-100 text-amber-800" },
                      { name: "ME Team", w1: "78%", w2: "82%", w3: "85%", w4: "86%", c1: "bg-emerald-100 text-emerald-800", c2: "bg-emerald-100 text-emerald-800", c3: "bg-emerald-100 text-emerald-800", c4: "bg-emerald-100 text-emerald-800" },
                      { name: "Embedded SW", w1: "84%", w2: "102%", w3: "115%", w4: "98%", c1: "bg-emerald-100 text-emerald-800", c2: "bg-amber-100 text-amber-800", c3: "bg-rose-100 text-rose-800", c4: "bg-emerald-100 text-emerald-800" },
                      { name: "Production", w1: "76%", w2: "81%", w3: "92%", w4: "86%", c1: "bg-emerald-100 text-emerald-800", c2: "bg-emerald-100 text-emerald-800", c3: "bg-amber-100 text-amber-800", c4: "bg-emerald-100 text-emerald-800" },
                      { name: "Installation", w1: "93%", w2: "98%", w3: "116%", w4: "110%", c1: "bg-emerald-100 text-emerald-800", c2: "bg-emerald-100 text-emerald-800", c3: "bg-rose-100 text-rose-800", c4: "bg-rose-100 text-rose-800" },
                    ].map((row) => (
                      <div
                        key={row.name}
                        onClick={() => {
                          setSearchQuery(row.name.replace(" Team", ""));
                          toast.info(`Filtered for ${row.name}`);
                        }}
                        className="grid grid-cols-5 text-center text-[10px] items-center py-1 px-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      >
                        <span className="font-semibold text-left text-slate-800 dark:text-slate-200 truncate">{row.name}</span>
                        <span className={cn("rounded px-1 py-0.5 font-bold mx-0.5", row.c1)}>{row.w1}</span>
                        <span className={cn("rounded px-1 py-0.5 font-bold mx-0.5", row.c2)}>{row.w2}</span>
                        <span className={cn("rounded px-1 py-0.5 font-bold mx-0.5", row.c3)}>{row.w3}</span>
                        <span className={cn("rounded px-1 py-0.5 font-bold mx-0.5", row.c4)}>{row.w4}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-muted-foreground px-1 pt-1.5 border-t border-border/40">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> &lt;90% Safe</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> 90-100% High</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> &gt;100% Over</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHeatmapOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-2 border-t border-border/40"
                >
                  View Full Calendar →
                </button>
              </CardContent>
            </Card>

            {/* Card 3: Resource Levelling & Billing Rate Matrix */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                  Resource Rate & Budget Matrix
                </CardTitle>
                <Badge variant="outline" className="text-[9px] bg-slate-50 text-slate-700 border-slate-200 font-mono">
                  Standard
                </Badge>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                <div className="divide-y border rounded-lg p-2 space-y-1">
                  {[
                    { type: "Human (Core Engineering)", rate: "₹ 1,450 / hr", util: "85% Optimal" },
                    { type: "Equipment & Line Tooling", rate: "₹ 2,800 / hr", util: "80% Active" },
                    { type: "Installation Gang / Riggers", rate: "₹ 4,200 / shift", util: "94% Peak" },
                    { type: "Testing Chamber Facilities", rate: "₹ 3,500 / slot", util: "72% Normal" },
                    { type: "Contractor Workforce", rate: "₹ 950 / hr", util: "90% Buffer" },
                  ].map((r) => (
                    <div key={r.type} className="flex items-center justify-between py-1 text-[11px]">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[150px]">
                          {r.type}
                        </span>
                        <span className="text-[10px] text-emerald-600">{r.util}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                        {r.rate}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("Rate card dossier exported to procurement register.")}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-2 border-t border-border/40"
                >
                  Download Rate Card Matrix →
                </button>
              </CardContent>
            </Card>

            {/* Card 4: AI Recommendations */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  AI Recommendations
                </CardTitle>
                <Badge variant="outline" className="text-[9px] bg-purple-50 text-purple-700 border-purple-200 font-mono">
                  3 Actions
                </Badge>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 space-y-1">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug">
                        EE02 is overallocated. Recommend reallocating 45% of ACT-023 to EE03.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReallocateOpen(true)}
                      className="text-[10px] text-rose-700 dark:text-rose-400 font-bold hover:underline pl-6 block cursor-pointer"
                    >
                      Apply Recommendation →
                    </button>
                  </div>

                  <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 space-y-1">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug">
                        Consider adding 1 contractor for Installation Team during Week 39.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Contractor request drafted: 1 field electrical technician.")}
                      className="text-[10px] text-amber-700 dark:text-amber-400 font-bold hover:underline pl-6 block cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 space-y-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug">
                        Mechanical team has capacity. Advance ACT-024 to reduce project risk.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("Schedule updated: ACT-024 moved forward 2 days.")}
                      className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline pl-6 block cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAIInsightsOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-2 border-t border-border/40"
                >
                  View All Insights →
                </button>
              </CardContent>
            </Card>
          </div>

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Allocate Resource Master Form Modal */}
        <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create Resource Allocation (DRAFT)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Assign human or equipment resources to WBS activities with automatic capacity checking.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAllocationSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Project:</label>
                  <Input value="PRJ-2026-0195" readOnly className="h-8 text-xs font-mono bg-muted" />
                </div>
                <div>
                  <label className="font-bold block mb-1">WBS Element:</label>
                  <select className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2">
                    <option>2.2 Design</option>
                    <option>2.1 Requirements</option>
                    <option>2.3 Engineering Validation</option>
                    <option>3.0 Procurement</option>
                    <option>4.2 Manufacturing</option>
                    <option>5.0 Installation</option>
                    <option>6.0 Testing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Activity:</label>
                <select
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                >
                  <option value="ACT-023 Drawing Preparation">ACT-023 Drawing Preparation</option>
                  <option value="ACT-022 Structural Analysis">ACT-022 Structural Analysis</option>
                  <option value="ACT-025 Software Design">ACT-025 Software Design</option>
                  <option value="ACT-045 Manufacturing">ACT-045 Manufacturing</option>
                  <option value="ACT-051 Transformer Rigging">ACT-051 Transformer Rigging</option>
                  <option value="ACT-061 Dielectric Safety Check">ACT-061 Dielectric Safety Check</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Resource Type:</label>
                  <select className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2">
                    <option>Human</option>
                    <option>Equipment</option>
                    <option>Team</option>
                    <option>Facility</option>
                    <option>Contractor</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Resource Name:</label>
                  <select
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    className="h-8 w-full text-xs font-semibold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Electrical Engineer - EE01">Electrical Engineer - EE01</option>
                    <option value="Electrical Engineer - EE03">Electrical Engineer - EE03</option>
                    <option value="Mechanical Engineer - ME01">Mechanical Engineer - ME01</option>
                    <option value="Software Engineer - SE01">Software Engineer - SE01</option>
                    <option value="Production Engineer - PE01">Production Engineer - PE01</option>
                    <option value="QA Engineer - QA01">QA Engineer - QA01</option>
                    <option value="Installation Team - IT01">Installation Team - IT01</option>
                    <option value="CNC Machine - CNC01">CNC Machine - CNC01</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Allocation Start:</label>
                  <Input
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Allocation End:</label>
                  <Input
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Allocation %:</label>
                  <Input
                    type="number"
                    value={newPct}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      setNewPct(p);
                      setNewHours(parseFloat(((p / 100) * 64).toFixed(1)));
                    }}
                    className="h-8 text-xs font-mono"
                    min="1"
                    max="150"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Planned Hours:</label>
                  <Input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Automatic Capacity Check Box */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-1.5 text-xs">
                <span className="font-bold uppercase text-[10px] text-muted-foreground block">
                  Real-Time Capacity Check
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Standard Cap</span>
                    <span className="font-mono font-bold">64.0 h</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Requested</span>
                    <span className="font-mono font-bold text-primary">{newHours} h</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Remaining</span>
                    <span
                      className={cn(
                        "font-mono font-bold",
                        64.0 - newHours < 0 ? "text-rose-600" : "text-emerald-600",
                      )}
                    >
                      {(64.0 - newHours).toFixed(1)} h
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-border/40">
                  <span className="text-muted-foreground text-[11px]">Utilization After: {newPct}%</span>
                  {newPct > 100 ? (
                    <Badge className="bg-rose-600 text-white text-[10px]">🔴 OVERLOAD</Badge>
                  ) : (
                    <Badge className="bg-emerald-600 text-white text-[10px]">🟢 AVAILABLE</Badge>
                  )}
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAllocateOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Save & Allocate
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Quick Edit Allocation Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                Edit Resource Allocation
              </DialogTitle>
              <DialogDescription className="text-xs">
                Modify allocation percentage, hours, or status for this assignment.
              </DialogDescription>
            </DialogHeader>
            {editingAllocation && (
              <form onSubmit={handleSaveEditAllocation} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Resource:</label>
                  <Input value={editingAllocation.resource} readOnly className="h-8 text-xs bg-muted" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Activity:</label>
                  <Input value={editingAllocation.activity} readOnly className="h-8 text-xs bg-muted" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Alloc %:</label>
                    <Input
                      type="number"
                      value={editingAllocation.allocPct}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEditingAllocation({
                          ...editingAllocation,
                          allocPct: val,
                          utilization: val,
                          plannedHours: parseFloat(((val / 100) * 64).toFixed(1)),
                          status: val > 100 ? "Conflict" : "Planned",
                        });
                      }}
                      className="h-8 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Planned Hours:</label>
                    <Input
                      type="number"
                      value={editingAllocation.plannedHours}
                      onChange={(e) =>
                        setEditingAllocation({
                          ...editingAllocation,
                          plannedHours: Number(e.target.value),
                        })
                      }
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Status:</label>
                    <select
                      value={editingAllocation.status}
                      onChange={(e) =>
                        setEditingAllocation({ ...editingAllocation, status: e.target.value as any })
                      }
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Conflict">Conflict</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Priority:</label>
                    <select
                      value={editingAllocation.priority}
                      onChange={(e) =>
                        setEditingAllocation({ ...editingAllocation, priority: e.target.value as any })
                      }
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button size="sm" variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
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

        {/* 3. Resolve Conflict / Reallocation Modal */}
        <Dialog open={isReallocateOpen} onOpenChange={setIsReallocateOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                Resolve Resource Conflict: EE02
              </DialogTitle>
              <DialogDescription className="text-xs">
                Electrical Engineer EE02 is overallocated at 125% during 10 Sep - 18 Sep 2026.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-300 block">Conflict Overlap:</span>
                <p className="text-[11px] text-muted-foreground">
                  • ACT-018 Electrical Architecture (100%) + ACT-023 Drawing Preparation (45%) = 145% Total Requested
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Proposed AI Reallocation:
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reallocate To:</span>
                    <span className="font-bold text-primary">Electrical Engineer - EE03</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Allocation Volume:</span>
                    <span className="font-mono font-bold">45% (28.8 hours)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule Impact:</span>
                    <span className="font-bold text-emerald-600">0 Days (No delay)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost Impact:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">+₹ 12,000 (standard rate)</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsReallocateOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApplyReallocation} className="bg-primary text-white font-semibold">
                Apply Reallocation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Capacity Check Dialog */}
        <Dialog open={isCapacityOpen} onOpenChange={setIsCapacityOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                Department Capacity vs Demand Check
              </DialogTitle>
              <DialogDescription className="text-xs">
                Comparison of total available working hours versus planned activity demand.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              {[
                { role: "Electrical Engineering", cap: "320h", dem: "360h", gap: "+40h GAP", isOver: true },
                { role: "Mechanical Engineering", cap: "320h", dem: "268h", gap: "52h AVAILABLE", isOver: false },
                { role: "Software Engineering", cap: "320h", dem: "256h", gap: "64h AVAILABLE", isOver: false },
                { role: "Installation Team", cap: "320h", dem: "378h", gap: "+58h GAP", isOver: true },
              ].map((c) => (
                <div key={c.role} className="p-3 border rounded-lg space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span>{c.role}</span>
                    <span className={c.isOver ? "text-rose-600 font-mono" : "text-emerald-600 font-mono"}>
                      {c.gap}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-[11px]">
                    <span>Capacity: {c.cap}</span>
                    <span>Demand: {c.dem}</span>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsCapacityOpen(false)}>Close</Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsCapacityOpen(false);
                  toast.success("Rebalance recommendations generated and queued for review.");
                }}
                className="bg-primary text-white font-semibold"
              >
                Auto-Rebalance Demand
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. Full Heatmap Dialog */}
        <Dialog open={isHeatmapOpen} onOpenChange={setIsHeatmapOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Resource Workload Heatmap (Sep → Oct 2026)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Weekly loading percentage per team discipline.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="p-2 border rounded bg-slate-50 dark:bg-slate-900 font-medium">
                Legend: 🟢 &lt;90% Optimal • 🟠 90-110% High • 🔴 &gt;110% Overload
              </div>
              <div className="grid grid-cols-5 text-center text-xs font-semibold p-2 border-b">
                <span className="text-left">Team</span>
                <span>Week 36</span>
                <span>Week 37</span>
                <span>Week 38</span>
                <span>Week 39</span>
              </div>
              <div className="space-y-1 text-center text-xs">
                <div className="grid grid-cols-5 items-center p-1.5">
                  <span className="text-left font-bold">EE Team</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">95%</span>
                  <span className="bg-amber-100 text-amber-800 rounded py-0.5">112%</span>
                  <span className="bg-rose-100 text-rose-800 rounded py-0.5">125%</span>
                  <span className="bg-amber-100 text-amber-800 rounded py-0.5">108%</span>
                </div>
                <div className="grid grid-cols-5 items-center p-1.5">
                  <span className="text-left font-bold">ME Team</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">78%</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">82%</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">85%</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">86%</span>
                </div>
                <div className="grid grid-cols-5 items-center p-1.5">
                  <span className="text-left font-bold">Production</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">76%</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">81%</span>
                  <span className="bg-amber-100 text-amber-800 rounded py-0.5">92%</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">86%</span>
                </div>
                <div className="grid grid-cols-5 items-center p-1.5">
                  <span className="text-left font-bold">Installation</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">93%</span>
                  <span className="bg-emerald-100 text-emerald-800 rounded py-0.5">98%</span>
                  <span className="bg-rose-100 text-rose-800 rounded py-0.5">116%</span>
                  <span className="bg-rose-100 text-rose-800 rounded py-0.5">110%</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsHeatmapOpen(false)}>Close Heatmap</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. Import Resource Roster Modal */}
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                Import Resource Roster
              </DialogTitle>
              <DialogDescription className="text-xs">
                Upload CSV or Excel file containing resource allocations and skill mapping.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-2 hover:bg-muted/20 cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <span className="block font-bold text-slate-800 dark:text-slate-200">
                  Drag & Drop CSV / Excel File
                </span>
                <span className="text-[11px] text-muted-foreground block">or click to browse your files</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border rounded text-[11px] text-muted-foreground">
                Supported columns: <code>Resource, Department, Type, Allocation %, Activity</code>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsImportOpen(false);
                  toast.success("Loaded 12 new allocations from resource_roster.csv");
                }}
                className="bg-primary text-white font-semibold"
              >
                Import Sample Roster
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 7. View All Alerts Modal */}
        <Dialog open={isAlertsOpen} onOpenChange={setIsAlertsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                <AlertTriangle className="h-4 w-4" />
                Project Resource Alert Register (5 Active)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Real-time monitor of schedule overloads and equipment contention.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              {[
                { title: "Electrical Engineer (EE-02) overallocated at 125%", period: "10 Sep - 18 Sep 2026", sev: "Critical", color: "text-rose-600" },
                { title: "Installation Team (IT-01) overallocated at 118%", period: "25 Oct - 30 Oct 2026", sev: "Critical", color: "text-rose-600" },
                { title: "CNC Machine-01 conflict overlap detected", period: "18 Sep 2026", sev: "High", color: "text-amber-600" },
                { title: "QA Engineer (QA-01) allocation at 105%", period: "12 Sep - 20 Sep 2026", sev: "Medium", color: "text-yellow-600" },
                { title: "Mechanical Engineer Team available capacity", period: "18% Buffer Remaining", sev: "Low", color: "text-emerald-600" },
              ].map((a, i) => (
                <div key={i} className="p-2.5 border rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold block text-slate-800 dark:text-slate-200">{a.title}</span>
                    <span className="text-[10px] text-muted-foreground">{a.period}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] font-bold", a.color)}>
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

        {/* 8. Resource Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Resource Pool Distribution (126 Total)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Comprehensive inventory of human and mechanical assets deployed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span>Human Resources (Engineers, PMs, Staff):</span>
                  <span className="font-bold font-mono">78</span>
                </div>
                <div className="flex justify-between">
                  <span>Equipment & Production Machines:</span>
                  <span className="font-bold font-mono">18</span>
                </div>
                <div className="flex justify-between">
                  <span>Multi-disciplinary Gangs & Teams:</span>
                  <span className="font-bold font-mono">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Specialized Testing Facilities:</span>
                  <span className="font-bold font-mono">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Specialized On-Site Contractors:</span>
                  <span className="font-bold font-mono">10</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 9. AI Insights Modal */}
        <Dialog open={isAIInsightsOpen} onOpenChange={setIsAIInsightsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                <Sparkles className="h-4 w-4" />
                AI Resource Optimization Summary
              </DialogTitle>
              <DialogDescription className="text-xs">
                Automated workload leveling and critical path risk suppression.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 rounded-lg space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  Overall Health: 94.6% Optimal
                </span>
                <p className="text-[11px] text-muted-foreground">
                  By reallocating EE02's peak 45% load to EE03, overall engineering project delay risk drops by 87%.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAIInsightsOpen(false)}>Acknowledge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default ResourceAllocationFormPage;
