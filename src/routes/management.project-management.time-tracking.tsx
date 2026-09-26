import { useState, useRef, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectManagementService } from "@/services";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  RefreshCw,
  Download,
  Upload,
  Printer,
  Plus,
  ChevronDown,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar as CalendarIcon,
  Sparkles,
  Layers,
  Edit2,
  Copy,
  Trash2,
  CheckCheck,
  ShieldCheck,
  Users,
  SlidersHorizontal,
  FileSpreadsheet,
  Share2,
  Check,
  X,
  FileText,
  DollarSign,
  TrendingUp,
  CheckSquare,
  Square,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Send,
  Save,
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

export interface TimeEntryItem {
  id: string;
  date: string;
  resource: string;
  initials: string;
  avatarColor: string;
  wbsActivityTask: string;
  workType: "Design" | "Development" | "Review" | "Procurement" | "Production" | "Installation" | "Testing" | "Documentation" | "Other";
  hours: number;
  billable: boolean;
  status: "Approved" | "Submitted" | "Draft" | "Rejected";
  notes?: string;
}

export const INITIAL_TIME_ENTRIES: TimeEntryItem[] = [
  {
    id: "te-1",
    date: "01 Sep 2026",
    resource: "Arun Kumar",
    initials: "AK",
    avatarColor: "bg-teal-600",
    wbsActivityTask: "2.2 / ACT-023 / T-023",
    workType: "Design",
    hours: 8.0,
    billable: true,
    status: "Approved",
    notes: "Finalized mechanical drawing package",
  },
  {
    id: "te-2",
    date: "01 Sep 2026",
    resource: "Suresh Kumar",
    initials: "SK",
    avatarColor: "bg-blue-600",
    wbsActivityTask: "2.2 / ACT-023 / T-021",
    workType: "Design",
    hours: 7.5,
    billable: true,
    status: "Approved",
    notes: "Prepared sheetmetal CAD drawings",
  },
  {
    id: "te-3",
    date: "01 Sep 2026",
    resource: "Meena Elango",
    initials: "ME",
    avatarColor: "bg-primary",
    wbsActivityTask: "2.1 / ACT-015 / T-012",
    workType: "Review",
    hours: 6.0,
    billable: true,
    status: "Approved",
    notes: "Customer safety requirement analysis",
  },
  {
    id: "te-4",
    date: "02 Sep 2026",
    resource: "Praveen Raj",
    initials: "PR",
    avatarColor: "bg-primary",
    wbsActivityTask: "3.0 / ACT-031 / T-025",
    workType: "Procurement",
    hours: 7.0,
    billable: true,
    status: "Approved",
    notes: "Supplier RFQ preparation for STM32 chips",
  },
  {
    id: "te-5",
    date: "02 Sep 2026",
    resource: "Vikram Varma",
    initials: "VV",
    avatarColor: "bg-rose-600",
    wbsActivityTask: "4.0 / ACT-041 / T-033",
    workType: "Production",
    hours: 8.5,
    billable: true,
    status: "Approved",
    notes: "Manufacturing press tool line calibration",
  },
  {
    id: "te-6",
    date: "02 Sep 2026",
    resource: "Elamathi E",
    initials: "EE",
    avatarColor: "bg-teal-700",
    wbsActivityTask: "5.0 / ACT-051 / T-038",
    workType: "Installation",
    hours: 8.0,
    billable: true,
    status: "Approved",
    notes: "Civil foundation layout survey",
  },
  {
    id: "te-7",
    date: "03 Sep 2026",
    resource: "Arun Kumar",
    initials: "AK",
    avatarColor: "bg-teal-600",
    wbsActivityTask: "2.2 / ACT-023 / T-023",
    workType: "Design",
    hours: 8.0,
    billable: true,
    status: "Submitted",
    notes: "3D model interference checking",
  },
  {
    id: "te-8",
    date: "03 Sep 2026",
    resource: "Suresh Kumar",
    initials: "SK",
    avatarColor: "bg-blue-600",
    wbsActivityTask: "2.2 / ACT-023 / T-022",
    workType: "Design",
    hours: 8.0,
    billable: true,
    status: "Submitted",
    notes: "Thermal dissipation CFD simulation",
  },
  {
    id: "te-9",
    date: "03 Sep 2026",
    resource: "Karthik Vel",
    initials: "KV",
    avatarColor: "bg-emerald-600",
    wbsActivityTask: "6.0 / ACT-061 / T-044",
    workType: "Testing",
    hours: 7.0,
    billable: true,
    status: "Submitted",
    notes: "CAN bus telemetry handshake validation",
  },
  {
    id: "te-10",
    date: "03 Sep 2026",
    resource: "Meena Elango",
    initials: "ME",
    avatarColor: "bg-primary",
    wbsActivityTask: "2.4 / ACT-018 / T-014",
    workType: "Documentation",
    hours: 4.5,
    billable: true,
    status: "Submitted",
    notes: "Release note manual version 1.2",
  },
  {
    id: "te-11",
    date: "04 Sep 2026",
    resource: "Praveen Raj",
    initials: "PR",
    avatarColor: "bg-primary",
    wbsActivityTask: "3.0 / ACT-032 / T-026",
    workType: "Procurement",
    hours: 8.0,
    billable: true,
    status: "Approved",
    notes: "DC busbar supplier purchase order",
  },
  {
    id: "te-12",
    date: "04 Sep 2026",
    resource: "Vikram Varma",
    initials: "VV",
    avatarColor: "bg-rose-600",
    wbsActivityTask: "4.0 / ACT-042 / T-034",
    workType: "Production",
    hours: 9.0,
    billable: true,
    status: "Approved",
    notes: "PCB assembly surface mount test run",
  },
  {
    id: "te-13",
    date: "04 Sep 2026",
    resource: "Devendra Sahu",
    initials: "DS",
    avatarColor: "bg-amber-600",
    wbsActivityTask: "2.3 / ACT-024 / T-028",
    workType: "Development",
    hours: 8.5,
    billable: true,
    status: "Approved",
    notes: "Firmware bootloader security patch",
  },
  {
    id: "te-14",
    date: "05 Sep 2026",
    resource: "Arun Kumar",
    initials: "AK",
    avatarColor: "bg-teal-600",
    wbsActivityTask: "1.0 / ACT-001 / T-002",
    workType: "Other",
    hours: 4.0,
    billable: false,
    status: "Approved",
    notes: "Steering committee milestone sync",
  },
  {
    id: "te-15",
    date: "05 Sep 2026",
    resource: "Suresh Kumar",
    initials: "SK",
    avatarColor: "bg-blue-600",
    wbsActivityTask: "2.2 / ACT-023 / T-021",
    workType: "Design",
    hours: 8.0,
    billable: true,
    status: "Approved",
    notes: "Internal cable routing design",
  },
  {
    id: "te-16",
    date: "05 Sep 2026",
    resource: "Karthik Vel",
    initials: "KV",
    avatarColor: "bg-emerald-600",
    wbsActivityTask: "6.0 / ACT-062 / T-045",
    workType: "Testing",
    hours: 8.0,
    billable: true,
    status: "Submitted",
    notes: "High voltage insulation dielectric breakdown test",
  },
  {
    id: "te-17",
    date: "06 Sep 2026",
    resource: "Elamathi E",
    initials: "EE",
    avatarColor: "bg-teal-700",
    wbsActivityTask: "5.0 / ACT-052 / T-039",
    workType: "Installation",
    hours: 8.0,
    billable: true,
    status: "Approved",
    notes: "Transformer pad curing inspection",
  },
  {
    id: "te-18",
    date: "06 Sep 2026",
    resource: "Devendra Sahu",
    initials: "DS",
    avatarColor: "bg-amber-600",
    wbsActivityTask: "2.3 / ACT-024 / T-029",
    workType: "Development",
    hours: 7.5,
    billable: true,
    status: "Approved",
    notes: "OCPP 2.0.1 smart charging protocol stack",
  },
  {
    id: "te-19",
    date: "07 Sep 2026",
    resource: "Meena Elango",
    initials: "ME",
    avatarColor: "bg-primary",
    wbsActivityTask: "2.4 / ACT-019 / T-016",
    workType: "Documentation",
    hours: 6.5,
    billable: true,
    status: "Submitted",
    notes: "CE certificate declaration of conformity",
  },
  {
    id: "te-20",
    date: "07 Sep 2026",
    resource: "Praveen Raj",
    initials: "PR",
    avatarColor: "bg-primary",
    wbsActivityTask: "3.0 / ACT-033 / T-027",
    workType: "Procurement",
    hours: 6.0,
    billable: false,
    status: "Approved",
    notes: "Logistics customs clearance follow-up",
  },
  {
    id: "te-21",
    date: "08 Sep 2026",
    resource: "Arun Kumar",
    initials: "AK",
    avatarColor: "bg-teal-600",
    wbsActivityTask: "2.2 / ACT-023 / T-023",
    workType: "Design",
    hours: 8.5,
    billable: true,
    status: "Draft",
    notes: "Design freeze gate submission checklist",
  },
  {
    id: "te-22",
    date: "08 Sep 2026",
    resource: "Suresh Kumar",
    initials: "SK",
    avatarColor: "bg-blue-600",
    wbsActivityTask: "2.2 / ACT-023 / T-021",
    workType: "Design",
    hours: 9.5,
    billable: true,
    status: "Draft",
    notes: "Overtime: Tooling mold flow review with manufacturer",
  },
  {
    id: "te-23",
    date: "08 Sep 2026",
    resource: "Vikram Varma",
    initials: "VV",
    avatarColor: "bg-rose-600",
    wbsActivityTask: "4.0 / ACT-043 / T-035",
    workType: "Production",
    hours: 8.0,
    billable: true,
    status: "Draft",
    notes: "Chassis welding fixture alignment",
  },
  {
    id: "te-24",
    date: "09 Sep 2026",
    resource: "Devendra Sahu",
    initials: "DS",
    avatarColor: "bg-amber-600",
    wbsActivityTask: "2.3 / ACT-024 / T-030",
    workType: "Development",
    hours: 8.0,
    billable: true,
    status: "Draft",
    notes: "Over-the-air (OTA) firmware upgrade module",
  },
  {
    id: "te-25",
    date: "09 Sep 2026",
    resource: "Karthik Vel",
    initials: "KV",
    avatarColor: "bg-emerald-600",
    wbsActivityTask: "6.0 / ACT-063 / T-046",
    workType: "Testing",
    hours: 6.5,
    billable: true,
    status: "Submitted",
    notes: "Customer witness testing plan prep",
  },
];

export const Route = createFileRoute("/management/project-management/time-tracking")({
  head: () => ({
    meta: [
      { title: "Time Tracking Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content: "Track time spent on tasks and activities, compare with planned effort, and manage timesheets for accurate project performance.",
      },
    ],
  }),
  component: TimeTrackingFormPage,
});

export function TimeTrackingFormPage() {
  const queryClient = useQueryClient();
  const { data: _dbData, isLoading: _dbLoading } = useQuery({
    queryKey: [["projects", "timeEntries"]],
    queryFn: () => projectManagementService.fetchTimeEntries(),
  });

  const navigate = useNavigate();
  const [entries, setEntries] = useState<TimeEntryItem[]>(INITIAL_TIME_ENTRIES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"entries" | "my-timesheet" | "team-timesheet">("entries");
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [filterProject, setFilterProject] = useState("Smart EV Charging Infrastructure");
  const [filterWbs, setFilterWbs] = useState("All WBS");
  const [filterActivity, setFilterActivity] = useState("All Activities");
  const [filterTask, setFilterTask] = useState("All Tasks");
  const [filterResource, setFilterResource] = useState("All Resources");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterShow, setFilterShow] = useState("All Entries");
  const [filterStatus, setFilterStatus] = useState("All");

  // Chart and display modes
  const [trendMode, setTrendMode] = useState<"hours" | "cost">("hours");
  const [weeklyMode, setWeeklyMode] = useState<"this-week" | "last-week">("this-week");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isMyTimesheetOpen, setIsMyTimesheetOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntryItem | null>(null);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isAnomalyOpen, setIsAnomalyOpen] = useState(false);
  const [isOvertimeReportOpen, setIsOvertimeReportOpen] = useState(false);
  const [isAllTasksOpen, setIsAllTasksOpen] = useState(false);

  // New Log Time Form State
  const [newResource, setNewResource] = useState("Arun Kumar");
  const [newDate, setNewDate] = useState("09-Sep-2026");
  const [newWbs, setNewWbs] = useState("2.2 Design");
  const [newActivity, setNewActivity] = useState("ACT-023 Drawing Preparation");
  const [newTask, setNewTask] = useState("T-023 Finalize Mechanical Drawing");
  const [newWorkType, setNewWorkType] = useState<TimeEntryItem["workType"]>("Design");
  const [newBillable, setNewBillable] = useState(true);
  const [newStartTime, setNewStartTime] = useState("09:00 AM");
  const [newEndTime, setNewEndTime] = useState("06:00 PM");
  const [newBreakHours, setNewBreakHours] = useState(1.0);
  const [newTotalHours, setNewTotalHours] = useState(8.0);
  const [newDescription, setNewDescription] = useState(
    "Finalized mechanical drawing, verified dimensions and prepared drawing package for engineering review.",
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire shortcuts if typing in input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setIsMyTimesheetOpen(true);
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        document.getElementById("weekly-time-summary-card")?.scrollIntoView({ behavior: "smooth" });
        toast.info("Navigated to Weekly Time Summary");
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleExportDossier();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClearFilters = () => {
    setFilterWbs("All WBS");
    setFilterActivity("All Activities");
    setFilterTask("All Tasks");
    setFilterResource("All Resources");
    setFilterDept("All Departments");
    setFilterShow("All Entries");
    setFilterStatus("All");
    setSearchQuery("");
    setCurrentPage(1);
    toast.info("Time tracking filters reset to default.");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setEntries(INITIAL_TIME_ENTRIES);
      handleClearFilters();
      setSelectedIds([]);
      toast.success("Timesheets, approvals, and actual hours refreshed from ERP core.");
    }, 450);
  };

  const handleCreateTimeEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = newResource
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newEntry: TimeEntryItem = {
      id: `te-${Date.now()}`,
      date: newDate,
      resource: newResource,
      initials: initials || "EM",
      avatarColor: "bg-blue-600",
      wbsActivityTask: "2.2 / ACT-023 / T-023",
      workType: newWorkType,
      hours: Number(newTotalHours) || 8.0,
      billable: newBillable,
      status: "Submitted",
      notes: newDescription,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setIsLogOpen(false);
    toast.success(`Logged ${newTotalHours}h for ${newResource} on ${newTask}`);
  };

  const handleSaveEditEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    setEntries((prev) => prev.map((item) => (item.id === editingEntry.id ? editingEntry : item)));
    setIsEditOpen(false);
    toast.success(`Updated time entry for ${editingEntry.resource}`);
  };

  const handleApproveEntry = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Approved" } : e)),
    );
    toast.success("Time entry approved.");
  };

  const handleRejectEntry = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Rejected" } : e)),
    );
    toast.warning("Time entry rejected and returned for revision.");
  };

  const handleApproveAllPending = () => {
    setEntries((prev) =>
      prev.map((e) => (e.status === "Submitted" ? { ...e, status: "Approved" } : e)),
    );
    setIsApprovalOpen(false);
    toast.success("All pending timesheet entries have been approved.");
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAllOnPage = (pageItems: TimeEntryItem[]) => {
    const pageIds = pageItems.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleBulkSetStatus = (status: TimeEntryItem["status"]) => {
    if (selectedIds.length === 0) {
      toast.error("Please select entries to update.");
      return;
    }
    setEntries((prev) =>
      prev.map((e) => (selectedIds.includes(e.id) ? { ...e, status } : e)),
    );
    setSelectedIds([]);
    setIsBulkOpen(false);
    toast.success(`Updated ${selectedIds.length} entries to ${status}.`);
  };

  const handleBulkSetBillable = (billable: boolean) => {
    if (selectedIds.length === 0) {
      toast.error("Please select entries to update.");
      return;
    }
    setEntries((prev) =>
      prev.map((e) => (selectedIds.includes(e.id) ? { ...e, billable } : e)),
    );
    setSelectedIds([]);
    setIsBulkOpen(false);
    toast.success(`Marked ${selectedIds.length} entries as ${billable ? "Billable" : "Non-Billable"}.`);
  };

  const handleDuplicateEntry = (item: TimeEntryItem) => {
    const dup: TimeEntryItem = {
      ...item,
      id: `te-${Date.now()}`,
      status: "Draft",
    };
    setEntries((prev) => [dup, ...prev]);
    toast.success(`Duplicated entry for ${item.resource} as Draft`);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    toast.success("Time entry deleted");
  };

  const handleExportCsv = () => {
    const csvContent =
      "Entry ID,Date,Resource,WBS Activity Task,Work Type,Hours,Billable,Status,Notes\n" +
      entries
        .map(
          (e) =>
            `"${e.id}","${e.date}","${e.resource}","${e.wbsActivityTask}","${e.workType}","${e.hours}","${e.billable ? "YES" : "NO"}","${e.status}","${(e.notes || "").replace(/"/g, '""')}"`,
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "PRJ-2026-0195_Time_Entries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Time entries exported to CSV.");
  };

  const handleExportDossier = () => {
    const dossier = `=====================================================
PROJECT TIMESHEET & LABOUR AUDIT DOSSIER
Project: Smart EV Charging Infrastructure (PRJ-2026-0195)
Generated: ${new Date().toLocaleString()}
Active Entries Logged: ${entries.length}
Total Hours Recorded: 1,248.5 h | Billable: 1,032.0 h (82.7%)
=====================================================

TIME ENTRIES REGISTER:
-----------------------------------------------------
${entries
  .map(
    (e) =>
      `[${e.id}] ${e.date} | ${e.resource} (${e.workType})
  Task: ${e.wbsActivityTask}
  Hours: ${e.hours.toFixed(1)}h | Billable: ${e.billable ? "YES" : "NO"} | Status: ${e.status.toUpperCase()}
  Description: ${e.notes || "Standard engineering time log"}
`,
  )
  .join("\n")}
=====================================================`;

    const blob = new Blob([dossier], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PRJ-2026-0195_Timesheet_Dossier.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Timesheet Dossier (.TXT) downloaded.");
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.wbsActivityTask.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.workType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesResource = filterResource === "All Resources" || item.resource === filterResource;
      const matchesWbs = filterWbs === "All WBS" || item.wbsActivityTask.startsWith(filterWbs.split(" ")[0]);
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;

      const matchesShow =
        filterShow === "All Entries"
          ? true
          : filterShow === "Billable Only"
          ? item.billable
          : filterShow === "Non-Billable Only"
          ? !item.billable
          : filterShow === "Overtime Only"
          ? item.hours > 8.0
          : true;

      return matchesSearch && matchesResource && matchesWbs && matchesStatus && matchesShow;
    });
  }, [entries, searchQuery, filterResource, filterWbs, filterStatus, filterShow]);

  // Paginated entries
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEntries.slice(start, start + pageSize);
  }, [filteredEntries, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / pageSize));

  // Pending approval items
  const pendingEntries = useMemo(() => {
    return entries.filter((e) => e.status === "Submitted");
  }, [entries]);
  return (
    <AppShell
      title="Time Tracking Form"
      breadcrumb="Management > Project Management > Time Tracking"
      description="Track time spent on tasks and activities, compare with planned effort, and manage timesheets for accurate project performance."
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
                  Time Tracking Form
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
                  onClick={() => setIsLogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Log Time
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
                    toast.success("Timesheet report emailed to stakeholders.");
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
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export CSV Timesheet
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-primary" /> Export Timesheet Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsApprovalOpen(true)} className="cursor-pointer">
                      <ShieldCheck className="mr-2 h-4 w-4 text-emerald-600" /> Timesheet Approval Queue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Time tracking entries saved successfully!");
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
             2. TOP FILTER CONTEXT BAR
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
            {/* Row 1: Project, Project Code, WBS, Activity, Task */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
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
                  <option>2.3 Engineering Validation</option>
                  <option>2.4 Documentation</option>
                  <option>3.0 Procurement</option>
                  <option>4.0 Production</option>
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
                  <option>ACT-001 Project Kickoff</option>
                  <option>ACT-015 Safety Specs</option>
                  <option>ACT-018 Manual Prep</option>
                  <option>ACT-023 Drawing Preparation</option>
                  <option>ACT-024 Firmware Development</option>
                  <option>ACT-031 RFQ Preparation</option>
                  <option>ACT-041 Manufacturing Setup</option>
                  <option>ACT-051 Foundation Layout</option>
                  <option>ACT-061 Telemetry Validation</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Task
                </span>
                <select
                  value={filterTask}
                  onChange={(e) => setFilterTask(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All Tasks</option>
                  <option>T-023 Finalize Mechanical Drawing</option>
                  <option>T-021 Prepare CAD Drawing</option>
                  <option>T-022 Analysis & CFD</option>
                  <option>T-012 Requirement Review</option>
                  <option>T-025 Review Design</option>
                  <option>T-028 Bootloader Patch</option>
                  <option>T-033 Tooling Calibration</option>
                  <option>T-038 Site Survey</option>
                  <option>T-044 Protocol Testing</option>
                </select>
              </div>
            </div>

            {/* Row 2: Resource, Department, Date Range, Show, Status, Clear Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-xs pt-1">
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
                  <option>Arun Kumar</option>
                  <option>Suresh Kumar</option>
                  <option>Meena Elango</option>
                  <option>Praveen Raj</option>
                  <option>Vikram Varma</option>
                  <option>Elamathi E</option>
                  <option>Karthik Vel</option>
                  <option>Devendra Sahu</option>
                </select>
              </div>

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
                  <option>Procurement</option>
                  <option>Production</option>
                  <option>Installation</option>
                  <option>Quality Assurance</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Date Range
                </span>
                <div className="h-8 px-2 flex items-center justify-between font-medium text-xs bg-slate-50 dark:bg-slate-800 rounded-md border border-input mt-0.5">
                  <span className="truncate">01 Sep 2026 - 30 Sep 2026</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Show
                </span>
                <select
                  value={filterShow}
                  onChange={(e) => setFilterShow(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All Entries</option>
                  <option>Billable Only</option>
                  <option>Non-Billable Only</option>
                  <option>Overtime Only</option>
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
                  <option>Approved</option>
                  <option>Submitted</option>
                  <option>Draft</option>
                  <option>Rejected</option>
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
            {/* 1. Total Logged Hours */}
            <div
              onClick={() => {
                setFilterShow("All Entries");
                setFilterStatus("All");
                toast.info("Showing all logged hours");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs",
                filterShow === "All Entries" && filterStatus === "All" && "ring-2 ring-primary/60",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Total Logged Hours
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  1,248.5 h
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMyTimesheetOpen(true);
                  }}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer block mt-1"
                >
                  View Timesheet Summary →
                </button>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* 2. Billable Hours */}
            <div
              onClick={() => {
                setFilterShow("Billable Only");
                toast.info("Filtered table by Billable entries only");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-xs",
                filterShow === "Billable Only" && "ring-2 ring-emerald-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Billable Hours
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  1,032.0 h
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  82.7% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            {/* 3. Planned Hours */}
            <div
              onClick={() => toast.info("Project baseline planned effort: 1,360.0h across 24 WBS deliverables.")}
              className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-amber-500/60 hover:shadow-xs"
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Planned Hours
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  1,360.0 h
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
                  Baseline Effort
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* 4. Utilization */}
            <div
              onClick={() => {
                document.getElementById("weekly-time-summary-card")?.scrollIntoView({ behavior: "smooth" });
                toast.info("Jumped to Weekly Utilization Summary");
              }}
              className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs"
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Utilization
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  91.8%
                </span>
                <span className="text-[10px] text-primary dark:text-blue-400 font-semibold block mt-1">
                  Target: 85%
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            {/* 5. Overtime Hours */}
            <div
              onClick={() => {
                setFilterShow("Overtime Only");
                toast.info("Filtered table by Overtime entries (>8.0h)");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-rose-500/60 hover:shadow-xs",
                filterShow === "Overtime Only" && "ring-2 ring-rose-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Overtime Hours
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  128.5 h
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  10.3% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* 6. Pending Approval */}
            <div
              onClick={() => setIsApprovalOpen(true)}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-cyan-500/60 hover:shadow-xs",
                pendingEntries.length > 0 && "border-cyan-400/60",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Pending Approval
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  56.0 h
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold block mt-1">
                  {pendingEntries.length} Submitted Entries
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. MASTER TIMESHEET REGISTER TABLE (12 Columns, Full Width)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-4 pb-2.5 border-b border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Tabs: Time Entries, My Timesheet, Team Timesheet */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("entries");
                      setFilterResource("All Resources");
                    }}
                    className={cn(
                      "pb-1 border-b-2 cursor-pointer transition-colors",
                      activeTab === "entries"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Time Entries ({entries.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("my-timesheet");
                      setFilterResource("Arun Kumar");
                    }}
                    className={cn(
                      "pb-1 border-b-2 cursor-pointer transition-colors",
                      activeTab === "my-timesheet"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    My Timesheet
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("team-timesheet")}
                    className={cn(
                      "pb-1 border-b-2 cursor-pointer transition-colors",
                      activeTab === "team-timesheet"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Team Timesheet
                  </button>
                </div>

                {/* Search & Actions Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search resource, task, notes..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  {selectedIds.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleBulkSetStatus("Approved")}
                      className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                    >
                      <CheckCheck className="h-3.5 w-3.5" /> Approve ({selectedIds.length})
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => setIsLogOpen(true)}
                    className="h-8 text-xs gap-1 bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Log Time
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {activeTab === "team-timesheet" ? (
                /* Team Summary View */
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b font-semibold">
                    <span>Team Member</span>
                    <span>Total Logged</span>
                    <span>Billable %</span>
                    <span>Action</span>
                  </div>
                  {[
                    { name: "Arun Kumar", role: "Lead Engineer", total: "148.0 h", billable: "92.5%", status: "Approved" },
                    { name: "Suresh Kumar", role: "Mechanical Engineer", total: "152.0 h", billable: "88.2%", status: "Approved" },
                    { name: "Meena Elango", role: "Quality Engineer", total: "134.5 h", billable: "85.0%", status: "Approved" },
                    { name: "Praveen Raj", role: "Procurement Lead", total: "142.0 h", billable: "78.4%", status: "Pending" },
                    { name: "Vikram Varma", role: "Production Supervisor", total: "160.5 h", billable: "94.0%", status: "Approved" },
                    { name: "Devendra Sahu", role: "Embedded Lead", total: "140.0 h", billable: "96.2%", status: "Pending" },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 text-xs border border-border/40">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">{member.name}</span>
                        <span className="text-[11px] text-muted-foreground">{member.role}</span>
                      </div>
                      <div className="font-mono font-bold text-sm">{member.total}</div>
                      <div className="font-mono text-emerald-600 font-bold">{member.billable}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setFilterResource(member.name);
                          setActiveTab("entries");
                          toast.info(`Filtered time entries for ${member.name}`);
                        }}
                        className="h-7 text-xs px-3 cursor-pointer hover:bg-primary/10"
                      >
                        View Logs
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Normal / My Timesheet Table View */
                <div className="w-full overflow-x-auto">
                  <table className="w-full table-fixed text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/40 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        <th className="p-2.5 pl-4 w-10">
                          <input
                            type="checkbox"
                            checked={
                              paginatedEntries.length > 0 &&
                              paginatedEntries.every((item) => selectedIds.includes(item.id))
                            }
                            onChange={() => handleSelectAllOnPage(paginatedEntries)}
                            className="rounded cursor-pointer"
                          />
                        </th>
                        <th className="p-2.5 w-28">Date</th>
                        <th className="p-2.5 w-44">Resource</th>
                        <th className="p-2.5">WBS / Activity / Task</th>
                        <th className="p-2.5 w-32">Work Type</th>
                        <th className="p-2.5 w-24">Hours</th>
                        <th className="p-2.5 w-20 text-center">Billable</th>
                        <th className="p-2.5 w-28">Status</th>
                        <th className="p-2.5 pr-4 text-center w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {paginatedEntries.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-muted-foreground text-xs">
                            No time entries found matching the filter criteria.
                            <button
                              type="button"
                              onClick={handleClearFilters}
                              className="block mx-auto mt-2 text-xs text-primary font-semibold hover:underline cursor-pointer"
                            >
                              Reset All Filters
                            </button>
                          </td>
                        </tr>
                      ) : (
                        paginatedEntries.map((item) => (
                          <tr
                            key={item.id}
                            className={cn(
                              "hover:bg-muted/30 transition-colors",
                              selectedIds.includes(item.id) && "bg-primary/5 dark:bg-primary/10",
                            )}
                          >
                            <td className="p-2.5 pl-4">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => handleToggleSelect(item.id)}
                                className="rounded cursor-pointer"
                              />
                            </td>
                            <td className="p-2.5 font-mono text-muted-foreground">{item.date}</td>
                            <td className="p-2.5">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={cn(
                                    "h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-2xs",
                                    item.avatarColor,
                                  )}
                                >
                                  {item.initials}
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {item.resource}
                                </span>
                              </div>
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
                              <span className="block font-medium">{item.wbsActivityTask}</span>
                              {item.notes && <span className="text-[10px] text-muted-foreground truncate block">{item.notes}</span>}
                            </td>
                            <td className="p-2.5 text-muted-foreground">{item.workType}</td>
                            <td className="p-2.5 font-mono font-bold text-foreground">{item.hours.toFixed(1)} h</td>
                            <td className="p-2.5 text-center">
                              {item.billable ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 inline-block" />
                              ) : (
                                <X className="h-3.5 w-3.5 text-slate-400 inline-block" />
                              )}
                            </td>
                            <td className="p-2.5">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px]",
                                  item.status === "Approved"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                    : item.status === "Submitted"
                                    ? "bg-blue-50 text-blue-700 border-blue-300"
                                    : item.status === "Draft"
                                    ? "bg-amber-50 text-amber-700 border-amber-300"
                                    : "bg-rose-50 text-rose-700 border-rose-300",
                                )}
                              >
                                {item.status}
                              </Badge>
                            </td>
                            <td className="p-2.5 pr-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingEntry(item);
                                    setIsEditOpen(true);
                                  }}
                                  className="p-1 hover:text-primary cursor-pointer transition-colors"
                                  title="Edit Entry"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateEntry(item)}
                                  className="p-1 hover:text-primary cursor-pointer transition-colors"
                                  title="Duplicate Entry"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEntry(item.id)}
                                  className="p-1 hover:text-rose-500 cursor-pointer transition-colors"
                                  title="Delete Entry"
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
              )}

              {/* Pagination Footer */}
              <div className="p-3 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  Showing {filteredEntries.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredEntries.length)} of {filteredEntries.length} entries
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
                    className="h-7 border rounded text-xs px-1 ml-2 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================================
             4B. WEEKLY SUMMARY & TIME TREND (Balanced 6 cols + 6 cols = 12 Columns)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left: Weekly Resource Time Summary (6 cols) */}
            <Card
              id="weekly-time-summary-card"
              className="lg:col-span-6 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between"
            >
              <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Weekly Resource Time Summary & Utilization
                </CardTitle>
                <select
                  value={weeklyMode}
                  onChange={(e) => setWeeklyMode(e.target.value as any)}
                  className="h-7 text-xs border rounded px-2 bg-slate-50 dark:bg-slate-800 font-medium cursor-pointer"
                >
                  <option value="this-week">This Week (Wk 36)</option>
                  <option value="last-week">Last Week (Wk 35)</option>
                </select>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b bg-muted/20 text-[10px] text-muted-foreground font-semibold">
                      <th className="p-2.5 pl-4">Resource</th>
                      <th className="p-2.5">Planned</th>
                      <th className="p-2.5">Logged</th>
                      <th className="p-2.5">Var</th>
                      <th className="p-2.5 pr-4 text-right">Utilization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {(weeklyMode === "this-week"
                      ? [
                          { name: "Arun Kumar", planned: 40.0, logged: 38.5, variance: "-1.5", util: "96.3%", isOver: false },
                          { name: "Suresh Kumar", planned: 40.0, logged: 41.0, variance: "+1.0", util: "102.5%", isOver: true },
                          { name: "Meena Elango", planned: 40.0, logged: 36.0, variance: "-4.0", util: "90.0%", isOver: false },
                          { name: "Praveen Raj", planned: 40.0, logged: 42.5, variance: "+2.5", util: "106.3%", isOver: true },
                          { name: "Vikram Varma", planned: 40.0, logged: 39.0, variance: "-1.0", util: "97.5%", isOver: false },
                        ]
                      : [
                          { name: "Arun Kumar", planned: 40.0, logged: 40.0, variance: "0.0", util: "100.0%", isOver: false },
                          { name: "Suresh Kumar", planned: 40.0, logged: 43.5, variance: "+3.5", util: "108.8%", isOver: true },
                          { name: "Meena Elango", planned: 40.0, logged: 38.0, variance: "-2.0", util: "95.0%", isOver: false },
                          { name: "Praveen Raj", planned: 40.0, logged: 41.0, variance: "+1.0", util: "102.5%", isOver: true },
                          { name: "Vikram Varma", planned: 40.0, logged: 40.5, variance: "+0.5", util: "101.3%", isOver: true },
                        ]
                    ).map((row) => (
                      <tr
                        key={row.name}
                        onClick={() => {
                          setFilterResource(row.name);
                          toast.info(`Filtered time entries for ${row.name}`);
                        }}
                        className="hover:bg-muted/20 cursor-pointer transition-colors"
                        title={`Click to filter entries for ${row.name}`}
                      >
                        <td className="p-2.5 pl-4 font-semibold text-slate-800 dark:text-slate-200">
                          {row.name}
                        </td>
                        <td className="p-2.5 font-mono text-muted-foreground">{row.planned.toFixed(1)}</td>
                        <td className="p-2.5 font-mono font-bold">{row.logged.toFixed(1)}</td>
                        <td
                          className={cn(
                            "p-2.5 font-mono font-bold",
                            row.isOver ? "text-amber-600" : "text-slate-600 dark:text-slate-400",
                          )}
                        >
                          {row.variance}
                        </td>
                        <td
                          className={cn(
                            "p-2.5 pr-4 font-mono font-bold text-right",
                            row.isOver ? "text-amber-600" : "text-emerald-600",
                          )}
                        >
                          {row.util}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-bold border-t-2">
                      <td className="p-2.5 pl-4">Total</td>
                      <td className="p-2.5 font-mono">200.0</td>
                      <td className="p-2.5 font-mono">197.0</td>
                      <td className="p-2.5 font-mono">-3.0</td>
                      <td className="p-2.5 pr-4 font-mono text-emerald-600 text-right">98.5%</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Right: Time Trend (Last 6 Weeks) (6 cols) */}
            <Card className="lg:col-span-6 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Time Trend & Variance Analysis (Last 6 Weeks)
                </CardTitle>
                <select
                  value={trendMode}
                  onChange={(e) => setTrendMode(e.target.value as any)}
                  className="h-7 text-xs border rounded px-2 bg-slate-50 dark:bg-slate-800 font-medium cursor-pointer"
                >
                  <option value="hours">Hours View</option>
                  <option value="cost">Cost View (₹)</option>
                </select>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-center gap-6 text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    {trendMode === "hours" ? "Logged Hours" : "Actual Cost (₹)"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    {trendMode === "hours" ? "Planned Hours" : "Planned Budget (₹)"}
                  </span>
                </div>

                {/* SVG Trend Graph */}
                <div className="h-44 w-full">
                  <svg className="h-full w-full" viewBox="0 0 320 160">
                    {/* Grid lines */}
                    <line x1="30" y1="20" x2="310" y2="20" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="30" y1="55" x2="310" y2="55" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="30" y1="90" x2="310" y2="90" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="30" y1="125" x2="310" y2="125" stroke="#e2e8f0" strokeDasharray="2 2" />

                    {/* Y-axis labels */}
                    {trendMode === "hours" ? (
                      <>
                        <text x="5" y="24" fontSize="8" fill="#94a3b8">1,600</text>
                        <text x="5" y="59" fontSize="8" fill="#94a3b8">1,200</text>
                        <text x="5" y="94" fontSize="8" fill="#94a3b8">800</text>
                        <text x="5" y="129" fontSize="8" fill="#94a3b8">400</text>
                        <text x="15" y="152" fontSize="8" fill="#94a3b8">0</text>
                      </>
                    ) : (
                      <>
                        <text x="2" y="24" fontSize="8" fill="#94a3b8">₹ 8.0 L</text>
                        <text x="2" y="59" fontSize="8" fill="#94a3b8">₹ 6.0 L</text>
                        <text x="2" y="94" fontSize="8" fill="#94a3b8">₹ 4.0 L</text>
                        <text x="2" y="129" fontSize="8" fill="#94a3b8">₹ 2.0 L</text>
                        <text x="12" y="152" fontSize="8" fill="#94a3b8">₹ 0</text>
                      </>
                    )}

                    {/* Planned Trend Line (Green) */}
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      points="50,90 95,84 140,78 185,68 230,60 280,45"
                    />
                    {/* Logged / Actual Trend Line (Blue) */}
                    <polyline
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                      points="50,88 95,82 140,76 185,64 230,52 280,51"
                    />

                    {/* Data Points */}
                    <circle cx="50" cy="88" r="3" fill="#2563eb" />
                    <circle cx="95" cy="82" r="3" fill="#2563eb" />
                    <circle cx="140" cy="76" r="3" fill="#2563eb" />
                    <circle cx="185" cy="64" r="3" fill="#2563eb" />
                    <circle cx="230" cy="52" r="3" fill="#2563eb" />
                    <circle cx="280" cy="51" r="3.5" fill="#2563eb" />

                    <circle cx="50" cy="90" r="2.5" fill="#10b981" />
                    <circle cx="95" cy="84" r="2.5" fill="#10b981" />
                    <circle cx="140" cy="78" r="2.5" fill="#10b981" />
                    <circle cx="185" cy="68" r="2.5" fill="#10b981" />
                    <circle cx="230" cy="60" r="2.5" fill="#10b981" />
                    <circle cx="280" cy="45" r="3" fill="#10b981" />

                    {/* Point Value Labels */}
                    <text x="40" y="80" fontSize="7.5" fill="#2563eb" fontWeight="bold">
                      {trendMode === "hours" ? "820" : "₹4.1L"}
                    </text>
                    <text x="85" y="74" fontSize="7.5" fill="#2563eb" fontWeight="bold">
                      {trendMode === "hours" ? "900" : "₹4.5L"}
                    </text>
                    <text x="130" y="68" fontSize="7.5" fill="#2563eb" fontWeight="bold">
                      {trendMode === "hours" ? "980" : "₹4.9L"}
                    </text>
                    <text x="175" y="56" fontSize="7.5" fill="#2563eb" fontWeight="bold">
                      {trendMode === "hours" ? "1,120" : "₹5.6L"}
                    </text>
                    <text x="220" y="44" fontSize="7.5" fill="#2563eb" fontWeight="bold">
                      {trendMode === "hours" ? "1,240" : "₹6.2L"}
                    </text>
                    <text x="260" y="40" fontSize="8" fill="#10b981" fontWeight="bold">
                      {trendMode === "hours" ? "1,360" : "₹6.8L"}
                    </text>
                    <text x="270" y="62" fontSize="7.5" fill="#2563eb" fontWeight="bold">
                      {trendMode === "hours" ? "1,248.5" : "₹6.24L"}
                    </text>

                    {/* X-axis week labels */}
                    <text x="42" y="152" fontSize="8" fill="#64748b">Wk 31</text>
                    <text x="87" y="152" fontSize="8" fill="#64748b">Wk 32</text>
                    <text x="132" y="152" fontSize="8" fill="#64748b">Wk 33</text>
                    <text x="177" y="152" fontSize="8" fill="#64748b">Wk 34</text>
                    <text x="222" y="152" fontSize="8" fill="#64748b">Wk 35</text>
                    <text x="267" y="152" fontSize="8" fill="#64748b">Wk 36</text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             5. BOTTOM 4-CARD SECTION: WORK TYPE, BILLABLE, TOP TASKS, OVERTIME
             ==================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Time by Work Type Donut */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Time by Work Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="98" />
                    <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="144" />
                    <circle cx="50" cy="50" r="38" stroke="#0A3C75" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="174" />
                    <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="200" />
                    <circle cx="50" cy="50" r="38" stroke="#64748b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="218" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-bold font-mono text-slate-900 dark:text-white">1,248.5 h</span>
                    <span className="text-[7.5px] text-muted-foreground uppercase font-semibold">Total Logged</span>
                  </div>
                </div>
                <div className="space-y-1 text-[10.5px]">
                  {[
                    { type: "Design", color: "bg-blue-500", hours: "512.5 h (41.1%)" },
                    { type: "Development", color: "bg-emerald-500", hours: "238.0 h (19.1%)" },
                    { type: "Review", color: "bg-amber-500", hours: "156.0 h (12.5%)" },
                    { type: "Testing", color: "bg-blue-500", hours: "134.0 h (10.7%)" },
                    { type: "Documentation", color: "bg-cyan-500", hours: "98.0 h (7.8%)" },
                    { type: "Other", color: "bg-slate-500", hours: "110.0 h (8.8%)" },
                  ].map((row) => (
                    <div
                      key={row.type}
                      onClick={() => {
                        setSearchQuery(row.type);
                        toast.info(`Filtered table by ${row.type} work type`);
                      }}
                      className="flex justify-between items-center p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      title={`Filter by ${row.type}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <div className={cn("h-2 w-2 rounded-full", row.color)} /> {row.type}
                      </span>
                      <span className="font-mono text-muted-foreground">{row.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Billable vs Non-Billable Donut */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Billable vs Non-Billable
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#94a3b8" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="197" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">82.7%</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Billable</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div
                    onClick={() => {
                      setFilterShow("Billable Only");
                      toast.info("Filtered by Billable hours");
                    }}
                    className="flex justify-between items-center p-1.5 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500" /> Billable
                    </span>
                    <span className="font-mono text-muted-foreground font-semibold">1,032.0 h (82.7%)</span>
                  </div>
                  <div
                    onClick={() => {
                      setFilterShow("Non-Billable Only");
                      toast.info("Filtered by Non-Billable hours");
                    }}
                    className="flex justify-between items-center p-1.5 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-slate-400" /> Non-Billable
                    </span>
                    <span className="font-mono text-muted-foreground font-semibold">216.5 h (17.3%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Top Tasks by Logged Hours */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Top Tasks by Logged Hours
                </CardTitle>
                <button
                  type="button"
                  onClick={() => setIsAllTasksOpen(true)}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
                >
                  View All →
                </button>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-2">
                {[
                  { task: "T-023 Finalize Mechanical Drawing", hrs: "128.0 h", filter: "T-023" },
                  { task: "T-021 Prepare CAD Drawing", hrs: "112.5 h", filter: "T-021" },
                  { task: "T-015 Requirement Analysis", hrs: "96.0 h", filter: "T-015" },
                  { task: "T-031 RFQ Preparation", hrs: "84.0 h", filter: "T-031" },
                  { task: "T-041 Manufacturing Setup", hrs: "72.5 h", filter: "T-041" },
                ].map((item) => (
                  <div
                    key={item.task}
                    onClick={() => {
                      setSearchQuery(item.filter);
                      toast.info(`Filtered table for ${item.task}`);
                    }}
                    className="flex items-center justify-between py-1 px-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                    title="Click to filter table for this task"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                      {item.task}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0 ml-1">
                      {item.hrs}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Card 4: Overtime Analysis */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Overtime Analysis
                </CardTitle>
                <select className="h-6 text-[10px] border rounded px-1 bg-slate-50 dark:bg-slate-800 font-medium">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Overtime Hours</span>
                    <span className="font-mono font-bold text-rose-600 text-sm">128.5 h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Overtime Cost</span>
                    <span className="font-mono font-bold text-rose-600 text-sm">₹ 64,250</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">% of Total Hours</span>
                    <span className="font-mono font-semibold">10.3%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Average Overtime / Day</span>
                    <span className="font-mono font-semibold">4.3 h</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOvertimeReportOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-1 border-t border-border/40"
                >
                  View Overtime Report →
                </button>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             6. BOTTOM STATUS & SHORTCUTS BAR (Interactive Shortcut Badges)
             ==================================================================== */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-muted-foreground border-t border-border/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live ERP Sync Active
              </span>
              <span>Last Data Refresh: 01 Sep 2026 10:24 AM</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span className="font-sans">Shortcuts:</span>
              <button
                type="button"
                onClick={() => setIsMyTimesheetOpen(true)}
                className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                title="Press T"
              >
                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border text-[10px] font-bold">T</span>
                My Timesheet
              </button>
              <button
                type="button"
                onClick={() => {
                  document.getElementById("weekly-time-summary-card")?.scrollIntoView({ behavior: "smooth" });
                  toast.info("Navigated to Weekly Summary");
                }}
                className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                title="Press C"
              >
                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border text-[10px] font-bold">C</span>
                Weekly Summary
              </button>
              <button
                type="button"
                onClick={handleExportDossier}
                className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                title="Press R"
              >
                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border text-[10px] font-bold">R</span>
                Reports
              </button>
            </div>
          </div>

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Log Time Master Modal */}
        <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create Time Entry (DRAFT)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Record actual resource time spent against project WBS, activity, and task.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTimeEntry} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Resource:</label>
                  <select
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    className="h-8 w-full text-xs font-semibold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Arun Kumar">Arun Kumar</option>
                    <option value="Suresh Kumar">Suresh Kumar</option>
                    <option value="Meena Elango">Meena Elango</option>
                    <option value="Praveen Raj">Praveen Raj</option>
                    <option value="Vikram Varma">Vikram Varma</option>
                    <option value="Devendra Sahu">Devendra Sahu</option>
                    <option value="Karthik Vel">Karthik Vel</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Work Date:</label>
                  <Input
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Project:</label>
                  <Input value="PRJ-2026-0195" readOnly className="h-8 text-xs font-mono bg-muted" />
                </div>
                <div>
                  <label className="font-bold block mb-1">WBS Element:</label>
                  <select
                    value={newWbs}
                    onChange={(e) => setNewWbs(e.target.value)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option>2.2 Design</option>
                    <option>2.1 Requirements</option>
                    <option>2.3 Engineering Validation</option>
                    <option>2.4 Documentation</option>
                    <option>3.0 Procurement</option>
                    <option>4.0 Production</option>
                    <option>5.0 Installation</option>
                    <option>6.0 Testing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Activity:</label>
                  <select
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option>ACT-023 Drawing Preparation</option>
                    <option>ACT-022 Structural Analysis</option>
                    <option>ACT-024 Firmware Development</option>
                    <option>ACT-031 RFQ Preparation</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Task:</label>
                  <select
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option>T-023 Finalize Mechanical Drawing</option>
                    <option>T-021 Prepare CAD Drawing</option>
                    <option>T-022 Analysis & CFD</option>
                    <option>T-028 Bootloader Patch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Work Type:</label>
                  <select
                    value={newWorkType}
                    onChange={(e) => setNewWorkType(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="Review">Review</option>
                    <option value="Testing">Testing</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Production">Production</option>
                    <option value="Installation">Installation</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="billableCheck"
                    checked={newBillable}
                    onChange={(e) => setNewBillable(e.target.checked)}
                    className="rounded cursor-pointer"
                  />
                  <label htmlFor="billableCheck" className="font-bold cursor-pointer">
                    Billable to Client
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="font-bold block mb-1">Start Time:</label>
                  <Input
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">End Time:</label>
                  <Input
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Break (h):</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={newBreakHours}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setNewBreakHours(val);
                      setNewTotalHours(Math.max(0, 9.0 - val));
                    }}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Total Hours:</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={newTotalHours}
                    onChange={(e) => setNewTotalHours(Number(e.target.value))}
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Work Description:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full h-16 p-2 rounded-md border border-input text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsLogOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Submit Entry
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Quick Edit Entry Modal */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                Edit Time Entry
              </DialogTitle>
              <DialogDescription className="text-xs">
                Modify logged hours, task allocation, or billable status.
              </DialogDescription>
            </DialogHeader>
            {editingEntry && (
              <form onSubmit={handleSaveEditEntry} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Resource:</label>
                  <Input value={editingEntry.resource} readOnly className="h-8 text-xs bg-muted" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Hours Logged:</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={editingEntry.hours}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, hours: Number(e.target.value) })
                      }
                      className="h-8 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Work Type:</label>
                    <select
                      value={editingEntry.workType}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, workType: e.target.value as any })
                      }
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                    >
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Review">Review</option>
                      <option value="Testing">Testing</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Procurement">Procurement</option>
                      <option value="Production">Production</option>
                      <option value="Installation">Installation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Workflow Status:</label>
                    <select
                      value={editingEntry.status}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, status: e.target.value as any })
                      }
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Draft">Draft</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="editBillable"
                      checked={editingEntry.billable}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, billable: e.target.checked })
                      }
                      className="rounded cursor-pointer"
                    />
                    <label htmlFor="editBillable" className="font-bold cursor-pointer">
                      Billable to Client
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">Work Notes:</label>
                  <Input
                    value={editingEntry.notes || ""}
                    onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                    className="h-8 text-xs"
                  />
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

        {/* 3. Timesheet Approval Queue Modal */}
        <Dialog open={isApprovalOpen} onOpenChange={setIsApprovalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                Timesheet Approval Queue ({pendingEntries.length} Items Pending)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Review and approve logged hours submitted by project team members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              {pendingEntries.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-1" />
                  All timesheet entries are approved! Zero items pending.
                </div>
              ) : (
                pendingEntries.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 border rounded-lg flex items-center justify-between hover:bg-muted/20"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">{item.resource}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">({item.date})</span>
                      </div>
                      <span className="text-muted-foreground text-[11px] block">
                        {item.wbsActivityTask} • {item.workType}
                      </span>
                      {item.notes && <span className="text-[10px] text-slate-500 italic">"{item.notes}"</span>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-primary">{item.hours.toFixed(1)}h</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveEntry(item.id)}
                        className="h-7 text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectEntry(item.id)}
                        className="h-7 text-xs text-rose-600 border-rose-300 hover:bg-rose-50"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsApprovalOpen(false)}>
                Close
              </Button>
              {pendingEntries.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleApproveAllPending}
                  className="bg-emerald-600 text-white font-semibold"
                >
                  Approve All Pending ({pendingEntries.length})
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Bulk Update Modal */}
        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Bulk Time Entry Update
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update status or billable categorization across {selectedIds.length > 0 ? `${selectedIds.length} selected` : "all filtered"} time entries.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-muted/30 border text-[11px] text-muted-foreground">
                Currently selected: <strong>{selectedIds.length} entries</strong>. You can choose entries directly using the checkboxes in the table.
              </div>
              <div className="space-y-2">
                <span className="font-bold block">Set Workflow Status:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkSetStatus("Approved")}
                    className="text-xs text-emerald-600 border-emerald-300"
                  >
                    Set to Approved
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkSetStatus("Submitted")}
                    className="text-xs text-blue-600 border-blue-300"
                  >
                    Set to Submitted
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkSetStatus("Draft")}
                    className="text-xs text-amber-600 border-amber-300"
                  >
                    Set to Draft
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <span className="font-bold block">Set Billable Status:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkSetBillable(true)}
                    className="text-xs text-emerald-600"
                  >
                    Mark as Billable (Yes)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkSetBillable(false)}
                    className="text-xs text-slate-600"
                  >
                    Mark as Non-Billable (No)
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsBulkOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. My Timesheet View Modal */}
        <Dialog open={isMyTimesheetOpen} onOpenChange={setIsMyTimesheetOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                My Weekly Timesheet — Arun Kumar (Week 36)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Review weekly logged hours, daily totals, and timesheet submission status.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <table className="w-full text-xs border rounded-lg">
                <thead>
                  <tr className="border-b bg-muted/30 text-[10px] font-semibold text-muted-foreground">
                    <th className="p-2">Date</th>
                    <th className="p-2">Task</th>
                    <th className="p-2">Planned</th>
                    <th className="p-2">Logged</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { date: "01-Sep", task: "Design / T-023", planned: "8.0h", logged: "8.0h", status: "✓ Approved" },
                    { date: "03-Sep", task: "Design / T-023", planned: "8.0h", logged: "8.0h", status: "● Submitted" },
                    { date: "05-Sep", task: "Milestone Sync / T-002", planned: "4.0h", logged: "4.0h", status: "✓ Approved" },
                    { date: "08-Sep", task: "Gate Submission / T-023", planned: "8.0h", logged: "8.5h", status: "● Draft" },
                  ].map((r, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-mono">{r.date}</td>
                      <td className="p-2 font-medium">{r.task}</td>
                      <td className="p-2 font-mono">{r.planned}</td>
                      <td className="p-2 font-mono font-bold text-primary">{r.logged}</td>
                      <td className="p-2">
                        <span className={r.status.includes("Approved") ? "text-emerald-600 font-bold" : "text-slate-600"}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-muted/30 font-bold border-t-2">
                    <td className="p-2" colSpan={2}>TOTAL WEEK 36</td>
                    <td className="p-2 font-mono">28.0h</td>
                    <td className="p-2 font-mono text-primary">28.5h</td>
                    <td className="p-2 text-emerald-600">101.8% Target Met</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsMyTimesheetOpen(false)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsMyTimesheetOpen(false);
                  toast.success("Week 36 Timesheet submitted for manager approval.");
                }}
                className="bg-primary text-white font-semibold"
              >
                Submit Timesheet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. Audit Log Modal */}
        <Dialog open={isAuditLogOpen} onOpenChange={setIsAuditLogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                Time Tracking Audit & Verification Log
              </DialogTitle>
              <DialogDescription className="text-xs">
                ERP System cross-check against biometric attendance and git commit activity.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" /> 100% Timesheet Compliance Verified
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  All 352 entries cross-referenced with smart card badge-ins at R&D Facility Block A.
                </p>
              </div>
              <div className="divide-y text-[11px]">
                <div className="py-2 flex justify-between">
                  <span>01-Sep 18:04: Biometric punch validated for Arun Kumar</span>
                  <span className="text-emerald-600 font-bold">MATCH (8.0h)</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>02-Sep 18:32: Manufacturing press system login for Vikram Varma</span>
                  <span className="text-emerald-600 font-bold">MATCH (8.5h)</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>03-Sep 17:58: Lab telemetry bench session for Karthik Vel</span>
                  <span className="text-emerald-600 font-bold">MATCH (7.0h)</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span>04-Sep 18:15: Surface mount cleanroom access for Vikram Varma</span>
                  <span className="text-emerald-600 font-bold">MATCH (9.0h)</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAuditLogOpen(false)}>
                Close Audit Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 7. AI Anomaly Detector Modal */}
        <Dialog open={isAnomalyOpen} onOpenChange={setIsAnomalyOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                <Sparkles className="h-4 w-4" />
                AI Timesheet Anomaly Detector
              </DialogTitle>
              <DialogDescription className="text-xs">
                Real-time machine learning audit of time logs, overtime spikes, and float.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Ghost Hours Risk:</span>
                  <span className="text-emerald-600 font-bold font-mono">0.0% (Zero Risk)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Overlapping Bookings:</span>
                  <span className="text-emerald-600 font-bold font-mono">None Detected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Weekend Leakage:</span>
                  <span className="text-emerald-600 font-bold font-mono">0.0h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Overtime Health Index:</span>
                  <span className="text-amber-600 font-bold font-mono">10.3% (Normal Buffer)</span>
                </div>
              </div>
              <p className="text-muted-foreground text-[11px]">
                AI Recommendation: Suresh Kumar (CAD Design) has logged +1.0h overtime. Effort is justified by the upcoming 20 Sep 2026 Design Freeze gate.
              </p>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAnomalyOpen(false)}>
                Acknowledge Insights
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 8. Overtime Analysis Report Modal */}
        <Dialog open={isOvertimeReportOpen} onOpenChange={setIsOvertimeReportOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                <Clock className="h-4 w-4" />
                Monthly Overtime Analysis Report (128.5 h)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Detailed overtime distribution and compensation expenditure breakdown.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 border rounded bg-rose-50/50 dark:bg-rose-950/10">
                  <span className="text-[10px] text-muted-foreground block">Total OT Hours</span>
                  <span className="font-mono font-bold text-rose-600 text-sm">128.5 h</span>
                </div>
                <div className="p-2 border rounded bg-rose-50/50 dark:bg-rose-950/10">
                  <span className="text-[10px] text-muted-foreground block">Total OT Expense</span>
                  <span className="font-mono font-bold text-rose-600 text-sm">₹ 64,250</span>
                </div>
                <div className="p-2 border rounded bg-rose-50/50 dark:bg-rose-950/10">
                  <span className="text-[10px] text-muted-foreground block">Avg Rate / Hr</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">₹ 500</span>
                </div>
              </div>
              <div className="divide-y border rounded-lg p-2">
                {[
                  { name: "Suresh Kumar", dept: "Engineering", ot: "34.5 h", cost: "₹ 17,250" },
                  { name: "Vikram Varma", dept: "Production", ot: "42.0 h", cost: "₹ 21,000" },
                  { name: "Praveen Raj", dept: "Procurement", ot: "24.0 h", cost: "₹ 12,000" },
                  { name: "Karthik Vel", dept: "Testing", ot: "18.0 h", cost: "₹ 9,000" },
                  { name: "Devendra Sahu", dept: "Firmware", ot: "10.0 h", cost: "₹ 5,000" },
                ].map((row) => (
                  <div key={row.name} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold block">{row.name}</span>
                      <span className="text-[10px] text-muted-foreground">{row.dept}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-600 block">{row.ot}</span>
                      <span className="font-mono text-muted-foreground text-[10px]">{row.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsOvertimeReportOpen(false)}>
                Close Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 9. All Tasks Register Modal */}
        <Dialog open={isAllTasksOpen} onOpenChange={setIsAllTasksOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Project Tasks Logged Hours Register
              </DialogTitle>
              <DialogDescription className="text-xs">
                Actual time consumed vs allocated budget across all tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y text-xs">
              {[
                { code: "T-023", name: "Finalize Mechanical Drawing", logged: "128.0 h", budget: "140.0 h", pct: "91.4%" },
                { code: "T-021", name: "Prepare CAD Drawing", logged: "112.5 h", budget: "120.0 h", pct: "93.8%" },
                { code: "T-015", name: "Requirement Analysis", logged: "96.0 h", budget: "100.0 h", pct: "96.0%" },
                { code: "T-031", name: "RFQ Preparation", logged: "84.0 h", budget: "80.0 h", pct: "105.0%" },
                { code: "T-041", name: "Manufacturing Setup", logged: "72.5 h", budget: "80.0 h", pct: "90.6%" },
                { code: "T-028", name: "Bootloader Firmware Patch", logged: "64.0 h", budget: "60.0 h", pct: "106.7%" },
                { code: "T-038", name: "Civil Foundation Layout", logged: "56.0 h", budget: "60.0 h", pct: "93.3%" },
                { code: "T-044", name: "CAN Bus Telemetry Testing", logged: "48.0 h", budget: "50.0 h", pct: "96.0%" },
              ].map((t) => (
                <div key={t.code} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary mr-1.5">{t.code}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{t.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold">{t.logged}</span>
                    <span className="text-[10px] text-muted-foreground block">of {t.budget} ({t.pct})</span>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAllTasksOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default TimeTrackingFormPage;

