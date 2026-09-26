import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { projectManagementService } from "@/services";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  RefreshCw,
  Download,
  Upload,
  Printer,
  ListTodo,
  Plus,
  ChevronDown,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
  Calendar as CalendarIcon,
  Sparkles,
  Layers,
  MoreVertical,
  Edit2,
  Copy,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  FileSpreadsheet,
  Share2,
  Send,
  Paperclip,
  CheckSquare,
  AlertCircle,
  Trash2,
  Check,
  FileText,
  FileCode,
  ExternalLink,
  Activity,
  ShieldCheck,
  TrendingUp,
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

export interface ProjectTaskItem {
  id: string;
  code: string;
  name: string;
  wbsActivity: string;
  assignedTo: string;
  assignedInitials: string;
  assignedAvatarColor: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  plannedFinish: string;
  plannedStart: string;
  progressPct: number;
  status: "In Progress" | "Not Started" | "Completed" | "Blocked" | "Overdue";
  type: "Task" | "Subtask" | "Review" | "Approval" | "Inspection";
  estimatedHours: number;
  actualHours: number;
  owner: string;
  milestone: string;
  description: string;
  acceptanceCriteria: { text: string; checked: boolean }[];
  deliverable: string;
}

export const INITIAL_TASKS: ProjectTaskItem[] = [
  {
    id: "task-1",
    code: "T-023",
    name: "Finalize Mechanical Drawing",
    wbsActivity: "2.2 / ACT-023",
    assignedTo: "ME-01",
    assignedInitials: "ME",
    assignedAvatarColor: "bg-teal-600",
    priority: "High",
    plannedStart: "10 Sep 2026",
    plannedFinish: "12 Sep 2026",
    progressPct: 80,
    status: "In Progress",
    type: "Task",
    estimatedHours: 24.0,
    actualHours: 18.0,
    owner: "Mechanical Lead (ME-01)",
    milestone: "M-003 Design Freeze",
    description: "Finalize manufacturing-ready mechanical drawing and submit for internal review and approval.",
    acceptanceCriteria: [
      { text: "Drawing conforms to approved design", checked: true },
      { text: "Dimensions verified", checked: true },
      { text: "Revision number updated", checked: true },
      { text: "Drawing submitted for approval", checked: false },
    ],
    deliverable: "Mechanical Drawing (Rev A)",
  },
  {
    id: "task-2",
    code: "T-024",
    name: "Verify Dimensions & Tolerances",
    wbsActivity: "2.2 / ACT-023",
    assignedTo: "ME-01",
    assignedInitials: "ME",
    assignedAvatarColor: "bg-teal-600",
    priority: "High",
    plannedStart: "09 Sep 2026",
    plannedFinish: "11 Sep 2026",
    progressPct: 50,
    status: "In Progress",
    type: "Task",
    estimatedHours: 16.0,
    actualHours: 8.0,
    owner: "Mechanical Lead (ME-01)",
    milestone: "M-003 Design Freeze",
    description: "Perform geometric dimensioning and tolerance (GD&T) stack-up calculation.",
    acceptanceCriteria: [
      { text: "Tolerance stack-up calculated", checked: true },
      { text: "Critical clearance verified", checked: false },
    ],
    deliverable: "Tolerance Stackup Report",
  },
  {
    id: "task-3",
    code: "T-025",
    name: "Internal Design Review",
    wbsActivity: "2.2 / ACT-023",
    assignedTo: "Suresh Kumar",
    assignedInitials: "SK",
    assignedAvatarColor: "bg-blue-600",
    priority: "Critical",
    plannedStart: "11 Sep 2026",
    plannedFinish: "13 Sep 2026",
    progressPct: 20,
    status: "In Progress",
    type: "Review",
    estimatedHours: 12.0,
    actualHours: 2.5,
    owner: "Suresh Kumar",
    milestone: "M-003 Design Freeze",
    description: "Cross-functional design review with electrical and thermal engineering teams.",
    acceptanceCriteria: [
      { text: "Review meeting conducted", checked: true },
      { text: "Review comments logged", checked: false },
    ],
    deliverable: "Design Review Minutes",
  },
  {
    id: "task-4",
    code: "T-026",
    name: "Engineering Approval",
    wbsActivity: "2.2 / ACT-023",
    assignedTo: "Arun Kumar",
    assignedInitials: "AK",
    assignedAvatarColor: "bg-primary",
    priority: "High",
    plannedStart: "13 Sep 2026",
    plannedFinish: "15 Sep 2026",
    progressPct: 0,
    status: "Not Started",
    type: "Approval",
    estimatedHours: 8.0,
    actualHours: 0.0,
    owner: "Arun Kumar",
    milestone: "M-003 Design Freeze",
    description: "Formal sign-off by Chief Engineering Officer prior to procurement release.",
    acceptanceCriteria: [
      { text: "Chief engineer sign-off", checked: false },
      { text: "ERP release flag set", checked: false },
    ],
    deliverable: "Engineering Sign-off Certificate",
  },
  {
    id: "task-5",
    code: "T-027",
    name: "Update BOM",
    wbsActivity: "2.2 / ACT-024",
    assignedTo: "EE-02",
    assignedInitials: "EE",
    assignedAvatarColor: "bg-amber-600",
    priority: "Medium",
    plannedStart: "12 Sep 2026",
    plannedFinish: "14 Sep 2026",
    progressPct: 0,
    status: "Not Started",
    type: "Task",
    estimatedHours: 16.0,
    actualHours: 0.0,
    owner: "Rohan Patel",
    milestone: "M-003 Design Freeze",
    description: "Populate updated part numbers and electrical component revisions in ERP BOM.",
    acceptanceCriteria: [
      { text: "Supplier part numbers verified", checked: false },
      { text: "Engineering BOM matched", checked: false },
    ],
    deliverable: "ERP Production BOM",
  },
  {
    id: "task-6",
    code: "T-028",
    name: "RFQ Preparation",
    wbsActivity: "3.0 / ACT-031",
    assignedTo: "PE-01",
    assignedInitials: "PE",
    assignedAvatarColor: "bg-emerald-600",
    priority: "High",
    plannedStart: "08 Sep 2026",
    plannedFinish: "10 Sep 2026",
    progressPct: 70,
    status: "In Progress",
    type: "Task",
    estimatedHours: 20.0,
    actualHours: 14.0,
    owner: "Ravi Teja",
    milestone: "M-004 Procurement Release",
    description: "Request for quotation package issued to shortlisted CNC fabrication vendors.",
    acceptanceCriteria: [
      { text: "Vendor package created", checked: true },
      { text: "NDA signed", checked: true },
    ],
    deliverable: "RFQ Dossier Package",
  },
  {
    id: "task-7",
    code: "T-029",
    name: "Vendor Evaluation",
    wbsActivity: "3.0 / ACT-032",
    assignedTo: "PE-01",
    assignedInitials: "PE",
    assignedAvatarColor: "bg-emerald-600",
    priority: "Medium",
    plannedStart: "10 Sep 2026",
    plannedFinish: "15 Sep 2026",
    progressPct: 30,
    status: "In Progress",
    type: "Task",
    estimatedHours: 18.0,
    actualHours: 5.5,
    owner: "Ravi Teja",
    milestone: "M-004 Procurement Release",
    description: "Commercial and technical matrix scoring for 3 quoted fabrication vendors.",
    acceptanceCriteria: [
      { text: "Comparative statement created", checked: true },
      { text: "Lead time evaluated", checked: false },
    ],
    deliverable: "Vendor Scorecard",
  },
  {
    id: "task-8",
    code: "T-030",
    name: "Purchase Order Release",
    wbsActivity: "3.0 / ACT-033",
    assignedTo: "PE-02",
    assignedInitials: "PE",
    assignedAvatarColor: "bg-teal-700",
    priority: "High",
    plannedStart: "16 Sep 2026",
    plannedFinish: "18 Sep 2026",
    progressPct: 0,
    status: "Not Started",
    type: "Approval",
    estimatedHours: 8.0,
    actualHours: 0.0,
    owner: "Ravi Teja",
    milestone: "M-004 Procurement Release",
    description: "Approval workflow and issuance of PO to chosen supplier.",
    acceptanceCriteria: [
      { text: "Finance budget approval", checked: false },
      { text: "PO dispatched", checked: false },
    ],
    deliverable: "Approved Purchase Order",
  },
  {
    id: "task-9",
    code: "T-031",
    name: "Material Receipt",
    wbsActivity: "3.0 / ACT-034",
    assignedTo: "WH-01",
    assignedInitials: "WH",
    assignedAvatarColor: "bg-cyan-700",
    priority: "Medium",
    plannedStart: "20 Sep 2026",
    plannedFinish: "22 Sep 2026",
    progressPct: 0,
    status: "Not Started",
    type: "Inspection",
    estimatedHours: 12.0,
    actualHours: 0.0,
    owner: "Warehouse Team",
    milestone: "M-005 Production Start",
    description: "Goods receipt and inward inspection of enclosures.",
    acceptanceCriteria: [
      { text: "Inward GRN generated", checked: false },
      { text: "Physical damage check", checked: false },
    ],
    deliverable: "Inward Goods Receipt Note",
  },
  {
    id: "task-10",
    code: "T-032",
    name: "Production Planning",
    wbsActivity: "4.0 / ACT-041",
    assignedTo: "PR-01",
    assignedInitials: "PR",
    assignedAvatarColor: "bg-primary",
    priority: "High",
    plannedStart: "22 Sep 2026",
    plannedFinish: "25 Sep 2026",
    progressPct: 10,
    status: "In Progress",
    type: "Task",
    estimatedHours: 24.0,
    actualHours: 2.5,
    owner: "Devendra Sahu",
    milestone: "M-005 Production Start",
    description: "Shop floor line balancing and assembly shift scheduling.",
    acceptanceCriteria: [
      { text: "Line stations assigned", checked: false },
      { text: "Assembly SOP ready", checked: true },
    ],
    deliverable: "Shopfloor Route Card",
  },
  {
    id: "task-11",
    code: "T-001",
    name: "Project Charter Sign-off",
    wbsActivity: "1.0 / ACT-011",
    assignedTo: "Arun Kumar",
    assignedInitials: "AK",
    assignedAvatarColor: "bg-blue-600",
    priority: "High",
    plannedStart: "01 Sep 2026",
    plannedFinish: "03 Sep 2026",
    progressPct: 100,
    status: "Completed",
    type: "Approval",
    estimatedHours: 10.0,
    actualHours: 9.5,
    owner: "Arun Kumar",
    milestone: "M-001 Project Kickoff",
    description: "Executive stakeholder charter ratification and scope baseline sign-off.",
    acceptanceCriteria: [
      { text: "Sponsor sign-off received", checked: true },
      { text: "Budget allocation verified", checked: true },
    ],
    deliverable: "Signed Project Charter",
  },
  {
    id: "task-12",
    code: "T-002",
    name: "Customer Requirements Freeze",
    wbsActivity: "2.1 / ACT-021",
    assignedTo: "Suresh Kumar",
    assignedInitials: "SK",
    assignedAvatarColor: "bg-blue-600",
    priority: "Critical",
    plannedStart: "03 Sep 2026",
    plannedFinish: "07 Sep 2026",
    progressPct: 100,
    status: "Completed",
    type: "Review",
    estimatedHours: 20.0,
    actualHours: 19.0,
    owner: "Suresh Kumar",
    milestone: "M-002 Requirements Freeze",
    description: "Compile and lock technical specifications for EV fast chargers with customer sign-off.",
    acceptanceCriteria: [
      { text: "Spec doc approved by client", checked: true },
      { text: "Grid compliance confirmed", checked: true },
    ],
    deliverable: "Approved Technical Spec",
  },
  {
    id: "task-13",
    code: "T-003",
    name: "Single Line Electrical Schematics",
    wbsActivity: "2.2 / ACT-022",
    assignedTo: "EE-02",
    assignedInitials: "EE",
    assignedAvatarColor: "bg-amber-600",
    priority: "High",
    plannedStart: "05 Sep 2026",
    plannedFinish: "09 Sep 2026",
    progressPct: 100,
    status: "Completed",
    type: "Task",
    estimatedHours: 18.0,
    actualHours: 17.5,
    owner: "Rohan Patel",
    milestone: "M-003 Design Freeze",
    description: "Complete single-line electrical diagrams for high-voltage DC circuitry and protections.",
    acceptanceCriteria: [
      { text: "Safety breakers sized", checked: true },
      { text: "Transformer rating validated", checked: true },
    ],
    deliverable: "Electrical SLD Diagram",
  },
  {
    id: "task-14",
    code: "T-005",
    name: "Structural Enclosure FEA Analysis",
    wbsActivity: "2.2 / ACT-022",
    assignedTo: "ME-01",
    assignedInitials: "ME",
    assignedAvatarColor: "bg-teal-600",
    priority: "Medium",
    plannedStart: "04 Sep 2026",
    plannedFinish: "08 Sep 2026",
    progressPct: 100,
    status: "Completed",
    type: "Task",
    estimatedHours: 22.0,
    actualHours: 21.0,
    owner: "Mechanical Lead (ME-01)",
    milestone: "M-003 Design Freeze",
    description: "Finite element analysis (FEA) for outdoor weather enclosure wind and seismic load tolerance.",
    acceptanceCriteria: [
      { text: "Wind load certified to 160 km/h", checked: true },
      { text: "IP65 thermal dissipation confirmed", checked: true },
    ],
    deliverable: "FEA Simulation Report",
  },
  {
    id: "task-15",
    code: "T-015",
    name: "High Voltage Inverter Sizing",
    wbsActivity: "2.2 / ACT-024",
    assignedTo: "EE-02",
    assignedInitials: "EE",
    assignedAvatarColor: "bg-amber-600",
    priority: "Critical",
    plannedStart: "08 Sep 2026",
    plannedFinish: "14 Sep 2026",
    progressPct: 35,
    status: "Blocked",
    type: "Task",
    estimatedHours: 24.0,
    actualHours: 8.5,
    owner: "Rohan Patel",
    milestone: "M-003 Design Freeze",
    description: "Select and validate 120kW DC fast inverter modules. Blocked by vendor chipset lead time confirmation.",
    acceptanceCriteria: [
      { text: "Supplier response received", checked: false },
      { text: "Efficiency test benchmarked", checked: true },
    ],
    deliverable: "Inverter Selection Report",
  },
  {
    id: "task-16",
    code: "T-016",
    name: "Thermal Sensor Calibration Matrix",
    wbsActivity: "2.2 / ACT-023",
    assignedTo: "ME-01",
    assignedInitials: "ME",
    assignedAvatarColor: "bg-teal-600",
    priority: "High",
    plannedStart: "07 Sep 2026",
    plannedFinish: "12 Sep 2026",
    progressPct: 20,
    status: "Blocked",
    type: "Task",
    estimatedHours: 14.0,
    actualHours: 3.0,
    owner: "Mechanical Lead",
    milestone: "M-003 Design Freeze",
    description: "Map sensor mounting points for busbar cooling. Blocked pending enclosure dimension update.",
    acceptanceCriteria: [
      { text: "Thermal zone layout ready", checked: false },
    ],
    deliverable: "Sensor Mapping Schematic",
  },
  {
    id: "task-17",
    code: "T-017",
    name: "Cable Routing Review",
    wbsActivity: "2.2 / ACT-023",
    assignedTo: "EE-02",
    assignedInitials: "EE",
    assignedAvatarColor: "bg-amber-600",
    priority: "Critical",
    plannedStart: "02 Sep 2026",
    plannedFinish: "06 Sep 2026",
    progressPct: 40,
    status: "Overdue",
    type: "Review",
    estimatedHours: 16.0,
    actualHours: 12.0,
    owner: "Rohan Patel",
    milestone: "M-003 Design Freeze",
    description: "Detailed bend-radius and thermal clearance check for heavy 400A DC charging cables.",
    acceptanceCriteria: [
      { text: "Bend radius verified", checked: true },
      { text: "Heat sink proximity checked", checked: false },
    ],
    deliverable: "Cable Routing Guideline",
  },
  {
    id: "task-18",
    code: "T-018",
    name: "Controller Firmware Testing",
    wbsActivity: "2.2 / ACT-024",
    assignedTo: "SK",
    assignedInitials: "SK",
    assignedAvatarColor: "bg-blue-600",
    priority: "High",
    plannedStart: "01 Sep 2026",
    plannedFinish: "05 Sep 2026",
    progressPct: 65,
    status: "Overdue",
    type: "Inspection",
    estimatedHours: 24.0,
    actualHours: 19.5,
    owner: "Suresh Kumar",
    milestone: "M-003 Design Freeze",
    description: "OCPP 2.0.1 protocol stack emulation and communication handshake tests.",
    acceptanceCriteria: [
      { text: "Handshake test passed", checked: true },
      { text: "Over-current cut-off verified", checked: false },
    ],
    deliverable: "Firmware Test Logs",
  },
  {
    id: "task-19",
    code: "T-019",
    name: "Site Geotechnical Survey",
    wbsActivity: "5.0 / ACT-051",
    assignedTo: "WH-01",
    assignedInitials: "WH",
    assignedAvatarColor: "bg-cyan-700",
    priority: "Medium",
    plannedStart: "28 Aug 2026",
    plannedFinish: "03 Sep 2026",
    progressPct: 85,
    status: "Overdue",
    type: "Inspection",
    estimatedHours: 16.0,
    actualHours: 15.0,
    owner: "Arun Kumar",
    milestone: "M-001 Project Kickoff",
    description: "Soil bearing capacity and underground conduit path scan for charger foundation.",
    acceptanceCriteria: [
      { text: "Soil core samples taken", checked: true },
      { text: "Bearing capacity certified", checked: false },
    ],
    deliverable: "Soil Test Report",
  },
  {
    id: "task-20",
    code: "T-020",
    name: "Vendor Drawing Approval",
    wbsActivity: "3.0 / ACT-032",
    assignedTo: "PE-01",
    assignedInitials: "PE",
    assignedAvatarColor: "bg-emerald-600",
    priority: "High",
    plannedStart: "04 Sep 2026",
    plannedFinish: "08 Sep 2026",
    progressPct: 50,
    status: "Overdue",
    type: "Approval",
    estimatedHours: 12.0,
    actualHours: 6.0,
    owner: "Ravi Teja",
    milestone: "M-004 Procurement Release",
    description: "Review fabrication drawings submitted by primary enclosure sheet-metal vendor.",
    acceptanceCriteria: [
      { text: "Punching tool path verified", checked: true },
      { text: "Powder coat spec approved", checked: false },
    ],
    deliverable: "Approved Vendor Fabrication Drawing",
  },
  {
    id: "task-21",
    code: "T-021",
    name: "Safety Protocol Certification",
    wbsActivity: "1.0 / ACT-012",
    assignedTo: "Arun Kumar",
    assignedInitials: "AK",
    assignedAvatarColor: "bg-blue-600",
    priority: "High",
    plannedStart: "03 Sep 2026",
    plannedFinish: "07 Sep 2026",
    progressPct: 30,
    status: "Overdue",
    type: "Review",
    estimatedHours: 10.0,
    actualHours: 3.5,
    owner: "Arun Kumar",
    milestone: "M-001 Project Kickoff",
    description: "Workplace high-voltage electrical safety protocols and lockout-tagout (LOTO) procedures.",
    acceptanceCriteria: [
      { text: "LOTO checklist prepared", checked: true },
      { text: "Safety officer sign-off", checked: false },
    ],
    deliverable: "Safety Compliance Dossier",
  },
];

export const Route = createFileRoute("/management/project-management/task-management")({
  head: () => ({
    meta: [
      { title: "Task Management Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content: "Create, assign, track and manage tasks across projects for successful execution.",
      },
    ],
  }),
  component: TaskManagementFormPage,
});

export function TaskManagementFormPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectManagementService.fetchProjects(),
  });

  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: (input: any) => projectManagementService.createProjectTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Task created successfully");
    },
    onError: () => toast.error("Failed to create task"),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (input: any) => projectManagementService.updateProjectTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast.success("Task updated successfully");
    },
    onError: () => toast.error("Failed to update task"),
  });

  const firstProjectId = (projectsQuery.data as any)?.[0]?.id;

  const tasksQuery = useQuery({
    queryKey: ["project-tasks", firstProjectId],
    queryFn: () => projectManagementService.fetchProjectTasks(firstProjectId!),
    enabled: !!firstProjectId,
  });

  const dbTasks: ProjectTaskItem[] = (tasksQuery.data ?? []).map((t: any) => ({
    ...INITIAL_TASKS[0],
    id: t.id,
    code: t.taskCode,
    name: t.title,
    wbsActivity: "-",
    assignedTo: t.assignee?.fullName ?? t.assigneeName ?? "-",
    assignedInitials: (t.assignee?.fullName ?? t.assigneeName ?? "?").split(" ").map((w: string) => w[0]).join(""),
    assignedAvatarColor: "bg-blue-600",
    priority: t.priority ?? "Medium",
    plannedStart: t.startDate ? new Date(t.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-",
    plannedFinish: t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-",
    progressPct: t.progressPct ?? 0,
    status: t.status ?? "Not Started",
    type: "Task",
    estimatedHours: t.estimatedHours ?? 0,
    actualHours: t.actualHours ?? 0,
    owner: t.assignee?.fullName ?? t.assigneeName ?? "-",
    milestone: t.milestone?.name ?? "-",
    description: t.description ?? "",
    acceptanceCriteria: [],
    deliverable: "-",
  }));

  const mergedTasks = dbTasks.length > 0 ? dbTasks : INITIAL_TASKS;

  const [tasks, setTasks] = useState<ProjectTaskItem[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<ProjectTaskItem>(INITIAL_TASKS[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Detail workspace tab
  const [activeDetailTab, setActiveDetailTab] = useState<
    "overview" | "details" | "subtasks" | "dependencies" | "resources" | "time-cost" | "documents" | "comments" | "history"
  >("overview");

  // Filter Bar State
  const [filterProject, setFilterProject] = useState("Smart EV Charging Infrastructure");
  const [filterWbs, setFilterWbs] = useState("All");
  const [filterActivity, setFilterActivity] = useState("All");
  const [filterMilestone, setFilterMilestone] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterAssigned, setFilterAssigned] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  // Selection for bulk operations
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("In Progress");
  const [bulkAssignee, setBulkAssignee] = useState("Keep Existing Assignee");

  // Sorting and Pagination
  const [sortField, setSortField] = useState<"finish" | "priority" | "progress" | "name">("finish");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isKanbanOpen, setIsKanbanOpen] = useState(false);
  const [isDependencyOpen, setIsDependencyOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTask, setEditTask] = useState<ProjectTaskItem | null>(null);

  // New task form state
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskType, setNewTaskType] = useState<ProjectTaskItem["type"]>("Task");
  const [newTaskPriority, setNewTaskPriority] = useState<ProjectTaskItem["priority"]>("High");
  const [newTaskOwner, setNewTaskOwner] = useState("Mechanical Lead");
  const [newTaskAssigned, setNewTaskAssigned] = useState("ME-01");
  const [newPlannedStart, setNewPlannedStart] = useState("10 Sep 2026");
  const [newPlannedFinish, setNewPlannedFinish] = useState("12 Sep 2026");
  const [newEstimatedHrs, setNewEstimatedHrs] = useState(24);
  const [newDescription, setNewDescription] = useState("Finalize manufacturing-ready mechanical drawing and submit for review.");

  // Comments inside task
  const [comments, setComments] = useState<{ author: string; time: string; text: string }[]>([
    { author: "Arun", time: "09:30 AM", text: "Drawing dimensions updated as per design review." },
    { author: "Meena", time: "10:15 AM", text: "Please verify mounting-hole tolerance before release." },
    { author: "Arun", time: "11:20 AM", text: "Verification completed. Report attached." },
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    return mergedTasks
      .filter((t) => {
        const matchesSearch =
          !searchQuery ||
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || t.status === filterStatus;
        const matchesPriority = filterPriority === "All" || t.priority === filterPriority;
        const matchesType = filterType === "All" || t.type === filterType;
        const matchesAssigned = filterAssigned === "All" || t.assignedTo === filterAssigned;
        const matchesWbs = filterWbs === "All" || t.wbsActivity.includes(filterWbs);
        return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesAssigned && matchesWbs;
      })
      .sort((a, b) => {
        if (sortField === "progress") {
          return sortAsc ? a.progressPct - b.progressPct : b.progressPct - a.progressPct;
        }
        if (sortField === "name") {
          return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        return sortAsc ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
      });
  }, [mergedTasks, searchQuery, filterStatus, filterPriority, filterType, filterAssigned, filterWbs, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage, pageSize]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setTasks(INITIAL_TASKS);
      setSelectedTask(INITIAL_TASKS[0]);
      setSelectedTaskIds(new Set());
      toast.success("Task list and dependencies reloaded from project server.");
    }, 450);
  };

  const handleClearFilters = () => {
    setFilterWbs("All");
    setFilterActivity("All");
    setFilterMilestone("All");
    setFilterType("All");
    setFilterAssigned("All");
    setFilterStatus("All");
    setFilterPriority("All");
    setSearchQuery("");
    setCurrentPage(1);
    toast.info("All task filters reset to default.");
  };

  const handleToggleSelectAll = () => {
    if (selectedTaskIds.size === paginatedTasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(paginatedTasks.map((t) => t.id)));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) {
      toast.error("Please enter a task name.");
      return;
    }

    const newTask: ProjectTaskItem = {
      id: `task-${Date.now()}`,
      code: `T-0${Math.floor(33 + Math.random() * 60)}`,
      name: newTaskName,
      wbsActivity: "2.2 / ACT-023",
      assignedTo: newTaskAssigned,
      assignedInitials: newTaskAssigned.slice(0, 2).toUpperCase(),
      assignedAvatarColor: "bg-blue-600",
      priority: newTaskPriority,
      plannedStart: newPlannedStart,
      plannedFinish: newPlannedFinish,
      progressPct: 0,
      status: "Not Started",
      type: newTaskType,
      estimatedHours: Number(newEstimatedHrs),
      actualHours: 0,
      owner: newTaskOwner,
      milestone: "M-003 Design Freeze",
      description: newDescription,
      acceptanceCriteria: [
        { text: "Drawing conforms to approved design", checked: false },
        { text: "Dimensions verified", checked: false },
      ],
      deliverable: "Project Task Deliverable",
    };

    setTasks((prev) => [newTask, ...prev]);
    setSelectedTask(newTask);
    setIsCreateOpen(false);
    setNewTaskName("");
    toast.success(`Task ${newTask.code} created and scheduled.`);
  };

  const handleApplyBulkUpdate = () => {
    const targetIds = selectedTaskIds.size > 0 ? selectedTaskIds : new Set(filteredTasks.map((t) => t.id));
    setTasks((prev) =>
      prev.map((t) => {
        if (targetIds.has(t.id)) {
          return {
            ...t,
            status: bulkStatus as any,
            assignedTo: bulkAssignee !== "Keep Existing Assignee" ? bulkAssignee : t.assignedTo,
            progressPct: bulkStatus === "Completed" ? 100 : bulkStatus === "Not Started" ? 0 : t.progressPct,
          };
        }
        return t;
      }),
    );
    if (targetIds.has(selectedTask.id)) {
      setSelectedTask((prev) => ({
        ...prev,
        status: bulkStatus as any,
        assignedTo: bulkAssignee !== "Keep Existing Assignee" ? bulkAssignee : prev.assignedTo,
        progressPct: bulkStatus === "Completed" ? 100 : bulkStatus === "Not Started" ? 0 : prev.progressPct,
      }));
    }
    setIsBulkOpen(false);
    setSelectedTaskIds(new Set());
    toast.success(`Bulk updated ${targetIds.size} tasks to "${bulkStatus}"!`);
  };

  const handleExportCsv = () => {
    const headers = [
      "Task Code",
      "Task Name",
      "WBS/Activity",
      "Assigned To",
      "Priority",
      "Status",
      "Planned Start",
      "Planned Finish",
      "Progress %",
      "Est Hours",
      "Act Hours",
      "Deliverable",
    ];
    const rows = tasks.map((t) => [
      `"${t.code}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.wbsActivity}"`,
      `"${t.assignedTo}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.plannedStart}"`,
      `"${t.plannedFinish}"`,
      t.progressPct,
      t.estimatedHours,
      t.actualHours,
      `"${t.deliverable.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PRJ-2026-0195_Task_Register.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Task register (.CSV) downloaded successfully!");
  };

  const handleExportDossier = () => {
    const text = `=====================================================
TASK MANAGEMENT EXECUTION DOSSIER & WORK PACKAGE REGISTER
Project: Smart EV Charging Infrastructure (PRJ-2026-0195)
Generated: ${new Date().toLocaleString()}
Total Tasks: ${tasks.length}
=====================================================

${tasks
  .map(
    (t, idx) =>
      `[${idx + 1}] ${t.code} - ${t.name}
  • WBS / Activity:  ${t.wbsActivity}
  • Assigned Owner:  ${t.assignedTo} (${t.owner})
  • Status / Priority: ${t.status} | Priority: ${t.priority}
  • Progress:        ${t.progressPct}% | Milestone: ${t.milestone}
  • Schedule:        ${t.plannedStart} -> ${t.plannedFinish}
  • Hours (Est/Act): ${t.estimatedHours}h / ${t.actualHours}h
  • Deliverable:     ${t.deliverable}`
  )
  .join("\n\n")}
=====================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PRJ-2026-0195_Task_Dossier.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Task Dossier (.TXT) downloaded successfully!");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setTasks(parsed);
            if (parsed.length > 0) setSelectedTask(parsed[0]);
            toast.success(`Imported ${parsed.length} tasks from ${file.name}`);
            return;
          }
        }
        toast.success(`File "${file.name}" processed into tasks register.`);
      } catch {
        toast.error("Failed to parse file. Please upload a valid JSON or CSV file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleCloneTask = () => {
    const clonedCode = `T-0${tasks.length + 10}`;
    const clonedTask: ProjectTaskItem = {
      ...selectedTask,
      id: `task-${Date.now()}`,
      code: clonedCode,
      name: `${selectedTask.name} (Copy)`,
      status: "Not Started",
      progressPct: 0,
    };
    setTasks((prev) => [clonedTask, ...prev]);
    setSelectedTask(clonedTask);
    toast.success(`Task duplicated as ${clonedCode}!`);
  };

  const handleMarkCompleted = () => {
    const updated: ProjectTaskItem = {
      ...selectedTask,
      status: "Completed",
      progressPct: 100,
    };
    setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? updated : t)));
    setSelectedTask(updated);
    toast.success(`Task ${selectedTask.code} marked as Completed.`);
  };

  const handleDeleteTask = () => {
    if (tasks.length <= 1) {
      toast.error("Cannot delete all tasks from the register.");
      return;
    }
    const remaining = tasks.filter((t) => t.id !== selectedTask.id);
    setTasks(remaining);
    setSelectedTask(remaining[0]);
    toast.success(`Task ${selectedTask.code} deleted successfully.`);
  };

  const handlePrevTask = () => {
    const currentIdx = tasks.findIndex((t) => t.id === selectedTask.id);
    if (currentIdx > 0) {
      setSelectedTask(tasks[currentIdx - 1]);
    } else {
      setSelectedTask(tasks[tasks.length - 1]);
    }
  };

  const handleNextTask = () => {
    const currentIdx = tasks.findIndex((t) => t.id === selectedTask.id);
    if (currentIdx < tasks.length - 1) {
      setSelectedTask(tasks[currentIdx + 1]);
    } else {
      setSelectedTask(tasks[0]);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setComments((prev) => [...prev, { author: "Current User", time: now, text: newCommentText.trim() }]);
    setNewCommentText("");
    toast.success("Comment added.");
  };

  const handleToggleCriterion = (idx: number) => {
    const updatedCriteria = selectedTask.acceptanceCriteria.map((c, i) =>
      i === idx ? { ...c, checked: !c.checked } : c
    );
    const updatedTask: ProjectTaskItem = {
      ...selectedTask,
      acceptanceCriteria: updatedCriteria,
    };
    setSelectedTask(updatedTask);
    setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? updatedTask : t)));
    toast.success("Acceptance criteria updated.");
  };

  return (
    <AppShell
      title="Task Management Form"
      breadcrumb="Management > Project Management > Task Management"
      description="Create, assign, track and manage tasks across projects for successful execution."
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
                  Task Management Form
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Approved
                </span>
                <span className="hidden md:inline-block font-mono text-xs text-muted-foreground">
                  PRJ-2026-0195
                </span>
              </div>

              {/* Hidden file input for Import */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileImport}
                accept=".csv,.json,.xlsx"
                className="hidden"
              />

              {/* Top Action Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Task
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
                    toast.success("Task execution report emailed to stakeholders.");
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
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export CSV Register
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-primary" /> Export Task Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4 text-slate-500" /> Import Tasks
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Tasks saved successfully!");
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
             2. TOP FILTER CONTEXT BAR (2 Rows from Screenshot 6)
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
            {/* Row 1: Project, Project Code, WBS, Activity, Milestone */}
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
                  <option>2.2 Design</option>
                  <option>2.1 Requirements</option>
                  <option>3.0 Procurement</option>
                  <option>4.0 Production</option>
                  <option>5.0 Installation</option>
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
                  <option>ACT-023 Drawing Preparation</option>
                  <option>ACT-022 Structural Analysis</option>
                  <option>ACT-024 Software Design</option>
                  <option>ACT-031 RFQ Preparation</option>
                  <option>ACT-041 Production Planning</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Milestone
                </span>
                <select
                  value={filterMilestone}
                  onChange={(e) => setFilterMilestone(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>M-003 Design Freeze</option>
                  <option>M-001 Project Charter</option>
                  <option>M-004 Procurement Release</option>
                  <option>M-005 Production Start</option>
                </select>
              </div>
            </div>

            {/* Row 2: Task Type, Assigned To, Status, Priority, Date Range, Clear Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-xs pt-1">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Task Type
                </span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Task</option>
                  <option>Subtask</option>
                  <option>Review</option>
                  <option>Approval</option>
                  <option>Inspection</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Assigned To
                </span>
                <select
                  value={filterAssigned}
                  onChange={(e) => setFilterAssigned(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>ME-01</option>
                  <option>Suresh Kumar</option>
                  <option>Arun Kumar</option>
                  <option>EE-02</option>
                  <option>PE-01</option>
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
                  <option>In Progress</option>
                  <option>Not Started</option>
                  <option>Completed</option>
                  <option>Blocked</option>
                  <option>Overdue</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Priority
                </span>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Date Range
                </span>
                <div className="h-8 px-2 flex items-center justify-between font-medium text-xs bg-slate-50 dark:bg-slate-800 rounded-md border border-input mt-0.5">
                  <span className="truncate">01 Sep 2026 - 30 Nov 2026</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="h-8 w-full text-xs font-medium gap-1.5 border-slate-300 dark:border-slate-700"
                >
                  <Filter className="h-3.5 w-3.5 text-slate-500" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>          {/* ====================================================================
             3. SIX METRIC KPI CARDS ROW (Interactive Filter Cards)
             ==================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Total Tasks */}
            <div
              onClick={() => {
                setFilterStatus("All");
                toast.info("Showing all tasks");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                filterStatus === "All"
                  ? "ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border/80 hover:border-primary/50 hover:shadow-xs",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Total Tasks
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {tasks.length}
                </span>
                <span className="text-[10px] text-primary font-semibold block mt-1">
                  Active Project Set
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ListTodo className="h-5 w-5" />
              </div>
            </div>

            {/* 2. Completed */}
            <div
              onClick={() => {
                setFilterStatus("Completed");
                toast.info("Filtered by Completed tasks");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                filterStatus === "Completed"
                  ? "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-border/80 hover:border-emerald-400 hover:shadow-xs",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Completed
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {tasks.filter((t) => t.status === "Completed").length}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  {tasks.length > 0
                    ? `${((tasks.filter((t) => t.status === "Completed").length / tasks.length) * 100).toFixed(1)}% of Total`
                    : "0%"}
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            {/* 3. In Progress */}
            <div
              onClick={() => {
                setFilterStatus("In Progress");
                toast.info("Filtered by In Progress tasks");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                filterStatus === "In Progress"
                  ? "ring-2 ring-amber-500 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                  : "border-border/80 hover:border-amber-400 hover:shadow-xs",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  In Progress
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {tasks.filter((t) => t.status === "In Progress").length}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
                  {tasks.length > 0
                    ? `${((tasks.filter((t) => t.status === "In Progress").length / tasks.length) * 100).toFixed(1)}% of Total`
                    : "0%"}
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* 4. Not Started */}
            <div
              onClick={() => {
                setFilterStatus("Not Started");
                toast.info("Filtered by Not Started tasks");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                filterStatus === "Not Started"
                  ? "ring-2 ring-primary border-primary bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-border/80 hover:border-blue-400 hover:shadow-xs",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Not Started
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {tasks.filter((t) => t.status === "Not Started").length}
                </span>
                <span className="text-[10px] text-primary dark:text-blue-400 font-semibold block mt-1">
                  {tasks.length > 0
                    ? `${((tasks.filter((t) => t.status === "Not Started").length / tasks.length) * 100).toFixed(1)}% of Total`
                    : "0%"}
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* 5. Overdue */}
            <div
              onClick={() => {
                setFilterStatus("Overdue");
                toast.info("Filtered by Overdue tasks");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                filterStatus === "Overdue"
                  ? "ring-2 ring-rose-500 border-rose-500 bg-rose-50/50 dark:bg-rose-950/20"
                  : "border-border/80 hover:border-rose-400 hover:shadow-xs",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Overdue
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block text-rose-600 dark:text-rose-400">
                  {tasks.filter((t) => t.status === "Overdue").length}
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  Action Required
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            {/* 6. Blocked */}
            <div
              onClick={() => {
                setFilterStatus("Blocked");
                toast.info("Filtered by Blocked tasks");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                filterStatus === "Blocked"
                  ? "ring-2 ring-cyan-500 border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20"
                  : "border-border/80 hover:border-cyan-400 hover:shadow-xs",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Blocked
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block text-cyan-700 dark:text-cyan-300">
                  {tasks.filter((t) => t.status === "Blocked").length}
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold block mt-1">
                  Vendor Dependency
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Ban className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. MASTER TASK REGISTER TABLE (12 Columns, Zero Truncation)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    Task List Register
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 pl-8 text-xs w-48 sm:w-60 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    title="Clear / Reset Filters"
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSortAsc((prev) => !prev);
                      toast.info(`Sort order: ${sortAsc ? "Descending" : "Ascending"}`);
                    }}
                    title="Toggle Sort Direction"
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSortField((prev) => (prev === "finish" ? "progress" : prev === "progress" ? "name" : "finish"));
                      toast.info(`Sorted by ${sortField === "finish" ? "progress" : sortField === "progress" ? "name" : "finish"}`);
                    }}
                    title="Cycle Sort Field (Finish / Progress / Name)"
                    className="h-8 text-xs gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                    Sort: {sortField}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsCreateOpen(true)}
                    className="h-8 text-xs gap-1 bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> New Task
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/40 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      <th className="p-2.5 pl-4 w-10">
                        <input
                          type="checkbox"
                          checked={paginatedTasks.length > 0 && paginatedTasks.every((t) => selectedTaskIds.has(t.id))}
                          onChange={handleToggleSelectAll}
                          className="rounded cursor-pointer"
                          title="Select all tasks on page"
                        />
                      </th>
                      <th className="p-2.5 w-24">Task Code</th>
                      <th className="p-2.5">Task Name</th>
                      <th className="p-2.5 w-32">WBS / Activity</th>
                      <th className="p-2.5 w-36">Assigned To</th>
                      <th className="p-2.5 w-28">Priority</th>
                      <th className="p-2.5 w-32">Planned Finish</th>
                      <th className="p-2.5 w-36">% Complete</th>
                      <th className="p-2.5 w-28">Status</th>
                      <th className="p-2.5 pr-4 text-right w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {paginatedTasks.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-muted-foreground">
                          No tasks matching the selected filters.
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
                      paginatedTasks.map((t) => {
                        const isSelected = selectedTask.id === t.id;
                        const isChecked = selectedTaskIds.has(t.id);
                        return (
                          <tr
                            key={t.id}
                            onClick={() => setSelectedTask(t)}
                            className={cn(
                              "cursor-pointer transition-colors",
                              isSelected
                                ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-l-primary font-medium"
                                : "hover:bg-muted/30",
                            )}
                          >
                            <td className="p-2.5 pl-4" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleSelectRow(t.id)}
                                className="rounded cursor-pointer"
                              />
                            </td>
                            <td className="p-2.5 font-mono font-bold text-primary text-[11px]">
                              {t.code}
                            </td>
                            <td className="p-2.5">
                              <span className="font-semibold text-slate-900 dark:text-white block truncate">
                                {t.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate block">
                                {t.description}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-muted-foreground">
                              {t.wbsActivity}
                            </td>
                            <td className="p-2.5">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={cn(
                                    "h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-2xs",
                                    t.assignedAvatarColor,
                                  )}
                                >
                                  {t.assignedInitials}
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {t.assignedTo}
                                </span>
                              </div>
                            </td>
                            <td className="p-2.5">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-bold border inline-block",
                                  t.priority === "Critical"
                                    ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                                    : t.priority === "High"
                                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                                    : t.priority === "Medium"
                                    ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800"
                                    : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
                                )}
                              >
                                {t.priority}
                              </span>
                            </td>
                            <td className="p-2.5 font-mono text-muted-foreground">
                              {t.plannedFinish}
                            </td>
                            <td className="p-2.5">
                              <div className="flex items-center gap-1.5 w-28">
                                <span className="font-mono text-[11px] font-bold w-9">{t.progressPct}%</span>
                                <Progress value={t.progressPct} className="h-1.5 flex-1" />
                              </div>
                            </td>
                            <td className="p-2.5">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] whitespace-nowrap",
                                  t.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300"
                                    : t.status === "In Progress"
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300"
                                    : t.status === "Blocked"
                                    ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300"
                                    : t.status === "Overdue"
                                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-300"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300",
                                )}
                              >
                                {t.status}
                              </Badge>
                            </td>
                            <td className="p-2.5 pr-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditTask(t);
                                  setIsEditOpen(true);
                                }}
                                className="h-6 w-6 p-0 text-slate-500 hover:text-primary cursor-pointer"
                                title="Edit Task"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="p-3 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  Showing {filteredTasks.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(currentPage * pageSize, filteredTasks.length)} of {filteredTasks.length} entries
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-1 rounded border hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCurrentPage(num)}
                      className={cn(
                        "px-2.5 py-1 rounded font-bold cursor-pointer transition-colors",
                        currentPage === num
                          ? "bg-primary text-white"
                          : "border hover:bg-muted",
                      )}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2 py-1 rounded border hover:bg-muted cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    &gt;
                  </button>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-7 border rounded text-xs px-1 ml-2 bg-slate-50 dark:bg-slate-800 cursor-pointer"
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
             5. SELECTED TASK INSPECTION & EXECUTION WORKSPACE (Full 12 Columns)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-bold text-primary text-base">{selectedTask.code}</span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedTask.name}
                  </h2>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold",
                      selectedTask.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : selectedTask.status === "In Progress"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : selectedTask.status === "Overdue"
                        ? "bg-rose-50 text-rose-700 border-rose-300"
                        : "bg-slate-100 text-slate-700 border-slate-300",
                    )}
                  >
                    {selectedTask.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold",
                      selectedTask.priority === "Critical"
                        ? "bg-rose-50 text-rose-700 border-rose-300"
                        : selectedTask.priority === "High"
                        ? "bg-amber-50 text-amber-700 border-amber-300"
                        : "bg-blue-50 text-blue-700 border-blue-300",
                    )}
                  >
                    {selectedTask.priority} Priority
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    WBS: {selectedTask.wbsActivity} · {selectedTask.milestone}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMarkCompleted}
                    className="h-7 text-xs font-semibold gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditTask(selectedTask);
                      setIsEditOpen(true);
                    }}
                    className="h-7 text-xs gap-1 cursor-pointer hover:bg-primary/10"
                    title="Edit Task"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCloneTask}
                    className="h-7 text-xs gap-1 cursor-pointer hover:bg-primary/10"
                    title="Duplicate Task"
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                    Clone
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 cursor-pointer hover:bg-primary/10"
                        title="More Task Actions"
                      >
                        <MoreVertical className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 text-xs">
                      <DropdownMenuItem onClick={handleMarkCompleted} className="cursor-pointer">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Mark Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const updated: ProjectTaskItem = { ...selectedTask, status: "Blocked" };
                          setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? updated : t)));
                          setSelectedTask(updated);
                          toast.info(`Task ${selectedTask.code} marked as Blocked.`);
                        }}
                        className="cursor-pointer"
                      >
                        <Ban className="mr-2 h-4 w-4 text-cyan-600" /> Mark as Blocked
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDeleteTask} className="cursor-pointer text-rose-600">
                        <Trash2 className="mr-2 h-4 w-4 text-rose-600" /> Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="h-3 w-px bg-border/60 mx-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevTask}
                    className="h-7 w-7 p-0 cursor-pointer"
                    title="Previous Task"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextTask}
                    className="h-7 w-7 p-0 cursor-pointer"
                    title="Next Task"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Workspace Navigation Tabs (Single clean line, zero wrapping!) */}
              <div className="flex items-center gap-1 pt-3 border-b border-border/40 text-xs font-medium overflow-x-auto no-scrollbar">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "details", label: "Details" },
                  { id: "subtasks", label: "Subtasks (4)" },
                  { id: "dependencies", label: "Dependencies (2)" },
                  { id: "resources", label: "Resources (1)" },
                  { id: "time-cost", label: "Time & Cost" },
                  { id: "documents", label: "Documents (3)" },
                  { id: "comments", label: `Comments (${comments.length})` },
                  { id: "history", label: "History" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDetailTab(tab.id as any)}
                    className={cn(
                      "pb-2.5 px-3.5 whitespace-nowrap cursor-pointer transition-colors border-b-2 font-semibold",
                      activeDetailTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              {/* 1. OVERVIEW TAB */}
              {activeDetailTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (6 cols): Task Information & Schedule */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="border rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Task Information & Schedule
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Task Owner</span>
                          <span className="font-semibold text-foreground truncate block">{selectedTask.owner}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Assigned To</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={cn("h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0", selectedTask.assignedAvatarColor)}>
                              {selectedTask.assignedInitials}
                            </span>
                            <span className="font-semibold text-foreground truncate">{selectedTask.assignedTo}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Task Type</span>
                          <span className="font-medium text-foreground">{selectedTask.type}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Planned Timeline</span>
                          <span className="font-mono text-foreground">{selectedTask.plannedStart} → {selectedTask.plannedFinish}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Estimated vs Actual</span>
                          <span className="font-mono font-bold text-foreground">{selectedTask.actualHours.toFixed(1)}h <span className="font-normal text-muted-foreground">/ {selectedTask.estimatedHours.toFixed(1)}h</span></span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">% Complete</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-primary">{selectedTask.progressPct}%</span>
                            <Progress value={selectedTask.progressPct} className="h-1.5 flex-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scope & Description */}
                    <div className="border rounded-xl p-4 bg-white dark:bg-slate-900 space-y-3">
                      <div>
                        <h4 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                          Scope Description
                        </h4>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border">
                          {selectedTask.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                          Linked Deliverable
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50">
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          <span className="font-semibold text-primary">{selectedTask.deliverable}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (6 cols): Acceptance Criteria & Dependencies */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Acceptance Criteria */}
                    <div className="border rounded-xl p-4 bg-white dark:bg-slate-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Acceptance Criteria (Click to Verify)
                        </h4>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {selectedTask.acceptanceCriteria.filter((c) => c.checked).length} of {selectedTask.acceptanceCriteria.length} Verified
                        </Badge>
                      </div>
                      <div className="space-y-2 text-xs">
                        {selectedTask.acceptanceCriteria.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleToggleCriterion(idx)}
                            className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors border border-border/40"
                          >
                            {item.checked ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <div className="h-4 w-4 rounded border border-muted-foreground shrink-0 mt-0.5" />
                            )}
                            <span
                              className={
                                item.checked
                                  ? "text-slate-800 dark:text-slate-200 line-through opacity-70"
                                  : "text-slate-900 dark:text-white font-medium"
                              }
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subtasks & Roll-up Preview */}
                    <div className="border rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Subtasks & Roll-up (4 Items)
                        </h4>
                        <button
                          type="button"
                          onClick={() => setActiveDetailTab("subtasks")}
                          className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                        >
                          View All Subtasks →
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border flex items-center justify-between">
                          <span className="truncate">{selectedTask.code}-01 Prepare Draft</span>
                          <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 shrink-0">100%</Badge>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border flex items-center justify-between">
                          <span className="truncate">{selectedTask.code}-02 Tech Verification</span>
                          <Badge variant="outline" className="text-[9px] bg-blue-50 text-blue-700 shrink-0">{selectedTask.progressPct}%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. DETAILS TAB */}
                {activeDetailTab === "details" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">WBS Hierarchy</span>
                        <p className="font-semibold text-slate-900 dark:text-white">{selectedTask.wbsActivity}</p>
                        <p className="text-[11px] text-muted-foreground">Milestone: {selectedTask.milestone}</p>
                      </div>
                      <div className="p-3 rounded-lg border bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Critical Path Link</span>
                        <p className="font-semibold text-emerald-600 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Zero Float Schedule Chain
                        </p>
                        <p className="text-[11px] text-muted-foreground">Baseline Tag: BSL-2026-01</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-[11px]">
                      <div className="p-2.5 rounded-lg border">
                        <span className="text-muted-foreground block text-[10px]">ERP Work Order:</span>
                        <span className="font-mono font-bold">WO-2026-089</span>
                      </div>
                      <div className="p-2.5 rounded-lg border">
                        <span className="text-muted-foreground block text-[10px]">Calendar:</span>
                        <span className="font-medium">Standard 5-Day (40h)</span>
                      </div>
                      <div className="p-2.5 rounded-lg border">
                        <span className="text-muted-foreground block text-[10px]">Approval Gate:</span>
                        <span className="font-medium">Gate 3 Sign-off</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SUBTASKS TAB */}
                {activeDetailTab === "subtasks" && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Child Subtasks (WBS Roll-up):</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info("Create subtask form opened")}
                        className="h-7 text-xs gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" /> Add Subtask
                      </Button>
                    </div>
                    {[
                      { code: `${selectedTask.code}-01`, name: "Prepare Initial Draft", pct: 100, status: "Complete" },
                      { code: `${selectedTask.code}-02`, name: "Technical Verification", pct: selectedTask.progressPct, status: selectedTask.status },
                      { code: `${selectedTask.code}-03`, name: "Peer Engineering Review", pct: 40, status: "In Progress" },
                      { code: `${selectedTask.code}-04`, name: "Formal QA Sign-off", pct: 0, status: "Not Started" },
                    ].map((s) => (
                      <div key={s.code} className="p-2.5 border rounded-lg flex items-center justify-between hover:bg-muted/20 transition-colors">
                        <div>
                          <span className="font-mono font-bold text-primary mr-2 text-[11px]">{s.code}</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-xs">{s.pct}%</span>
                          <Badge variant="outline" className="text-[9px]">{s.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. DEPENDENCIES TAB */}
                {activeDetailTab === "dependencies" && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border text-center font-mono text-xs">
                      T-022 (Design) ─── Finish-to-Start ───→ <strong className="text-primary">{selectedTask.code} ({selectedTask.name})</strong> ─── Finish-to-Start ───→ T-024 (Review)
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="p-2.5 rounded-lg border space-y-1">
                        <span className="font-bold text-muted-foreground uppercase text-[10px] block">Predecessor Task</span>
                        <p className="font-semibold text-slate-900 dark:text-white">T-022 Concept Design</p>
                        <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700">100% Completed</Badge>
                      </div>
                      <div className="p-2.5 rounded-lg border space-y-1">
                        <span className="font-bold text-muted-foreground uppercase text-[10px] block">Successor Task</span>
                        <p className="font-semibold text-slate-900 dark:text-white">T-024 Design Verification</p>
                        <Badge variant="outline" className="text-[9px] bg-blue-50 text-blue-700">Dependent on this task</Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      Blocking rule: Successor task cannot commence until {selectedTask.code} achieves 100% acceptance sign-off.
                    </p>
                  </div>
                )}

                {/* 5. RESOURCES TAB */}
                {activeDetailTab === "resources" && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-xs", selectedTask.assignedAvatarColor)}>
                          {selectedTask.assignedInitials}
                        </div>
                        <div>
                          <span className="font-bold text-sm block text-slate-900 dark:text-white">{selectedTask.assignedTo}</span>
                          <span className="text-[11px] text-muted-foreground">{selectedTask.owner}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-xs block text-primary">₹ 1,850 / hr</span>
                        <span className="text-[10px] text-muted-foreground">Standard Rate</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="p-2.5 rounded-lg border">
                        <span className="text-muted-foreground block text-[10px]">Allocated Effort:</span>
                        <span className="font-mono font-bold">{selectedTask.estimatedHours} Hours</span>
                      </div>
                      <div className="p-2.5 rounded-lg border">
                        <span className="text-muted-foreground block text-[10px]">Current Utilization:</span>
                        <span className="font-mono font-bold text-emerald-600">85% (Optimal)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. TIME & COST TAB */}
                {activeDetailTab === "time-cost" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Planned Hours</span>
                        <span className="text-lg font-bold font-mono">{selectedTask.estimatedHours} h</span>
                      </div>
                      <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Actual Hours</span>
                        <span className="text-lg font-bold font-mono text-primary">{selectedTask.actualHours} h</span>
                      </div>
                      <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Remaining</span>
                        <span className="text-lg font-bold font-mono text-emerald-600">
                          {Math.max(0, selectedTask.estimatedHours - selectedTask.actualHours)} h
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budgeted Cost:</span>
                        <span className="font-mono font-bold">₹ {(selectedTask.estimatedHours * 1850).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actual Cost Incurred:</span>
                        <span className="font-mono font-bold text-primary">₹ {(selectedTask.actualHours * 1850).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t">
                        <span className="text-muted-foreground font-semibold">Cost Variance:</span>
                        <span className="font-mono font-bold text-emerald-600">+₹ {((selectedTask.estimatedHours - selectedTask.actualHours) * 1850).toLocaleString()} (Favorable)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. DOCUMENTS TAB */}
                {activeDetailTab === "documents" && (
                  <div className="space-y-2">
                    {[
                      { name: "Mechanical_Drawing_Rev_A.dwg", size: "14.2 MB", date: "02 Sep 2026" },
                      { name: "GD&T_Tolerance_Stackup.pdf", size: "2.4 MB", date: "03 Sep 2026" },
                      { name: "Vendor_Specification_Sheet.xlsx", size: "850 KB", date: "01 Sep 2026" },
                    ].map((doc, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border flex items-center justify-between hover:bg-muted/20">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-primary" />
                          <div>
                            <span className="font-medium text-[11px] block">{doc.name}</span>
                            <span className="text-[10px] text-muted-foreground">{doc.size} • {doc.date}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast.success(`Downloading ${doc.name}`)}
                          className="h-7 text-xs text-primary cursor-pointer hover:underline"
                        >
                          <Download className="h-3 w-3 mr-1" /> Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 8. COMMENTS TAB */}
                {activeDetailTab === "comments" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {comments.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border space-y-0.5">
                          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{c.author}</span>
                            <span>{c.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300">{c.text}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <Input
                        placeholder="Write a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Button size="sm" type="submit" className="h-8 text-xs bg-primary text-white cursor-pointer">
                        <Send className="h-3 w-3" />
                      </Button>
                    </form>
                  </div>
                )}

                {/* 9. HISTORY TAB */}
                {activeDetailTab === "history" && (
                  <div className="space-y-2 text-[11px]">
                    {[
                      { action: "Task created by Arun Kumar", time: "01 Sep 2026 10:24 AM" },
                      { action: `Assigned to ${selectedTask.assignedTo}`, time: "01 Sep 2026 10:30 AM" },
                      { action: `Progress updated to ${selectedTask.progressPct}%`, time: "Today, 09:30 AM" },
                      { action: `Status set to ${selectedTask.status}`, time: "Today, 11:20 AM" },
                    ].map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{h.action}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{h.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              
            </CardContent>
          </Card>

          {/* ====================================================================
             5. BOTTOM 4-CARD SECTION: TASK HEALTH, PRIORITY, DEADLINES, OVERDUE
             ==================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Task Health & SLA Performance (Non-duplicate Metric) */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Task Health & Delivery SLA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5 text-xs">
                <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">On-Time Delivery Rate:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">94.2%</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule Index (SPI):</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">1.04 (On Track)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Critical Path Zero Float:</span>
                    <span className="font-mono font-bold text-primary">8 Tasks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Task Turnaround:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">3.4 Days</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/management/project-management/overview" })}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-1 border-t border-border/40"
                >
                  View Overall Project Health →
                </button>
              </CardContent>
            </Card>

            {/* Card 2: Tasks by Priority */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Tasks by Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5 text-xs">
                {[
                  { priority: "Critical", label: "Critical", count: tasks.filter((t) => t.priority === "Critical").length, color: "bg-rose-500" },
                  { priority: "High", label: "High", count: tasks.filter((t) => t.priority === "High").length, color: "bg-amber-500" },
                  { priority: "Medium", label: "Medium", count: tasks.filter((t) => t.priority === "Medium").length, color: "bg-yellow-500" },
                  { priority: "Low", label: "Low", count: tasks.filter((t) => t.priority === "Low").length, color: "bg-emerald-500" },
                ].map((p) => (
                  <div
                    key={p.label}
                    onClick={() => {
                      setFilterPriority(p.priority as any);
                      toast.info(`Filtered by priority: ${p.label}`);
                    }}
                    className="space-y-1 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="flex justify-between text-[11px] font-medium">
                      <span>{p.label}</span>
                      <span className="font-mono text-muted-foreground font-semibold">{p.count} tasks</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div
                        style={{ width: `${tasks.length > 0 ? (p.count / tasks.length) * 100 : 0}%` }}
                        className={cn("h-1.5 rounded-full", p.color)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Card 3: Upcoming Deadlines */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-2">
                {[
                  { due: "Today", taskCode: "T-028", task: "RFQ Preparation", pct: "70%", color: "bg-amber-100 text-amber-800" },
                  { due: "Tomorrow", taskCode: "T-024", task: "Verify Dimensions", pct: "50%", color: "bg-amber-100 text-amber-800" },
                  { due: "11 Sep", taskCode: "T-025", task: "Internal Design Review", pct: "20%", color: "bg-rose-100 text-rose-800" },
                  { due: "12 Sep", taskCode: "T-023", task: "Finalize Mechanical Drawing", pct: "80%", color: "bg-emerald-100 text-emerald-800" },
                  { due: "14 Sep", taskCode: "T-027", task: "Update BOM", pct: "0%", color: "bg-slate-100 text-slate-700" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const found = tasks.find((t) => t.code === item.taskCode);
                      if (found) {
                        setSelectedTask(found);
                        toast.info(`Selected task ${found.code}`);
                      }
                    }}
                    className="flex items-center justify-between py-1 px-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-bold text-muted-foreground w-14 shrink-0">{item.due}</span>
                      <span className="truncate text-[11px] font-medium text-slate-800 dark:text-slate-200">{item.task}</span>
                    </div>
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0", item.color)}>
                      {item.pct}
                    </span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => navigate({ to: "/management/project-management/milestones" })}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-1 border-t border-border/40"
                >
                  View Schedule Milestones →
                </button>
              </CardContent>
            </Card>

            {/* Card 4: Overdue Tasks */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Overdue Tasks
                </CardTitle>
                <button
                  type="button"
                  onClick={() => {
                    setFilterStatus("Overdue");
                    toast.info("Filtered table for overdue tasks");
                  }}
                  className="text-[10px] text-primary font-semibold hover:underline cursor-pointer"
                >
                  View All →
                </button>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-2">
                {tasks
                  .filter((t) => t.status === "Overdue")
                  .slice(0, 5)
                  .map((o) => (
                    <div
                      key={o.code}
                      onClick={() => {
                        setSelectedTask(o);
                        setFilterStatus("Overdue");
                        toast.info(`Selected overdue task ${o.code}`);
                      }}
                      className="flex items-center justify-between py-1 px-1 rounded hover:bg-rose-50/50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <AlertTriangle className="h-3 w-3 text-rose-500 shrink-0" />
                        <span className="font-mono font-bold text-rose-600 text-[10px]">{o.code}</span>
                        <span className="truncate text-[11px] text-slate-800 dark:text-slate-200">{o.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap ml-1">
                        Finish: {o.plannedFinish}
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

        {/* ====================================================================
           QUICK EDIT TASK MODAL
           ==================================================================== */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                Edit Task — {editTask?.code}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update work package properties, progress, and assignment.
              </DialogDescription>
            </DialogHeader>
            {editTask && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTasks((prev) => prev.map((t) => (t.id === editTask.id ? editTask : t)));
                  if (selectedTask.id === editTask.id) {
                    setSelectedTask(editTask);
                  }
                  setIsEditOpen(false);
                  toast.success(`Task ${editTask.code} updated successfully!`);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold block mb-1">Task Name:</label>
                  <Input
                    value={editTask.name}
                    onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
                    className="h-8 text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Status:</label>
                    <select
                      value={editTask.status}
                      onChange={(e) => setEditTask({ ...editTask, status: e.target.value as any })}
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Priority:</label>
                    <select
                      value={editTask.priority}
                      onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as any })}
                      className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold block mb-1">Progress (%):</label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={editTask.progressPct}
                      onChange={(e) => setEditTask({ ...editTask, progressPct: Number(e.target.value) })}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Actual Hours:</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={editTask.actualHours}
                      onChange={(e) => setEditTask({ ...editTask, actualHours: Number(e.target.value) })}
                      className="h-8 text-xs font-mono"
                    />
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

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Create Task Master Form Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create Task (DRAFT)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Create and schedule a new project work package item linked to WBS and milestones.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
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
                    <option>3.0 Procurement</option>
                    <option>4.0 Production</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Activity:</label>
                  <select className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2">
                    <option>ACT-023 Drawing Preparation</option>
                    <option>ACT-022 Structural Analysis</option>
                    <option>ACT-031 RFQ Preparation</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Milestone:</label>
                  <select className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2">
                    <option>M-003 Design Freeze</option>
                    <option>M-004 Procurement Release</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Task Name:</label>
                <Input
                  placeholder="e.g. Finalize Mechanical Drawing"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold block mb-1">Task Type:</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Task">Task</option>
                    <option value="Subtask">Subtask</option>
                    <option value="Review">Review</option>
                    <option value="Approval">Approval</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Priority:</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Assigned To:</label>
                  <select
                    value={newTaskAssigned}
                    onChange={(e) => setNewTaskAssigned(e.target.value)}
                    className="h-8 w-full text-xs font-semibold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="ME-01">ME-01 (Mechanical)</option>
                    <option value="EE-02">EE-02 (Electrical)</option>
                    <option value="Suresh Kumar">Suresh Kumar</option>
                    <option value="Arun Kumar">Arun Kumar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold block mb-1">Planned Start:</label>
                  <Input
                    value={newPlannedStart}
                    onChange={(e) => setNewPlannedStart(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Planned Finish:</label>
                  <Input
                    value={newPlannedFinish}
                    onChange={(e) => setNewPlannedFinish(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Estimated Hours:</label>
                  <Input
                    type="number"
                    value={newEstimatedHrs}
                    onChange={(e) => setNewEstimatedHrs(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full h-16 p-2 rounded-md border border-input text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Create Task
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Bulk Update Modal */}
        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-primary" />
                Bulk Task Update ({selectedTaskIds.size > 0 ? `${selectedTaskIds.size} Selected` : `All ${filteredTasks.length} Visible`})
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update status, assignee, or dates across selected project tasks simultaneously.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Target Status:</label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Started">Not Started</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Reassign To:</label>
                <select
                  value={bulkAssignee}
                  onChange={(e) => setBulkAssignee(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                >
                  <option value="Keep Existing Assignee">Keep Existing Assignee</option>
                  <option value="ME-01">ME-01 (Mechanical)</option>
                  <option value="EE-02">EE-02 (Electrical)</option>
                  <option value="Suresh Kumar">Suresh Kumar</option>
                  <option value="Arun Kumar">Arun Kumar</option>
                  <option value="PE-01">PE-01 (Procurement)</option>
                </select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsBulkOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApplyBulkUpdate}
                className="bg-primary text-white font-semibold"
              >
                Apply Bulk Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3. Kanban Task Board Modal */}
        <Dialog open={isKanbanOpen} onOpenChange={setIsKanbanOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Kanban Task Board — PRJ-2026-0195
              </DialogTitle>
              <DialogDescription className="text-xs">
                Visual workflow columns for rapid task status transitions. Click any card to view details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-5 gap-2 text-xs">
              {[
                { title: "NOT STARTED", status: "Not Started" },
                { title: "IN PROGRESS", status: "In Progress" },
                { title: "BLOCKED", status: "Blocked" },
                { title: "OVERDUE", status: "Overdue" },
                { title: "COMPLETED", status: "Completed" },
              ].map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.status);
                return (
                  <div key={col.title} className="p-2 border rounded-lg bg-slate-50 dark:bg-slate-900 space-y-2">
                    <span className="font-bold text-[10px] text-muted-foreground block border-b pb-1">
                      {col.title} ({colTasks.length})
                    </span>
                    <div className="space-y-1.5">
                      {colTasks.length === 0 ? (
                        <div className="text-[10px] text-muted-foreground italic text-center py-4">No tasks</div>
                      ) : (
                        colTasks.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedTask(item);
                              setIsKanbanOpen(false);
                              toast.info(`Selected task ${item.code}`);
                            }}
                            className="p-2 bg-white dark:bg-slate-800 rounded border shadow-2xs text-[11px] font-medium cursor-pointer hover:border-primary transition-colors"
                          >
                            <span className="font-mono font-bold text-primary block text-[10px]">{item.code}</span>
                            <span className="truncate block">{item.name}</span>
                            <div className="flex justify-between items-center mt-1 text-[9px] text-muted-foreground">
                              <span>{item.assignedTo}</span>
                              <span className="font-mono font-bold">{item.progressPct}%</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsKanbanOpen(false)}>Close Board</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Task Dependencies Modal */}
        <Dialog open={isDependencyOpen} onOpenChange={setIsDependencyOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                Task Dependencies & Critical Predecessors
              </DialogTitle>
              <DialogDescription className="text-xs">
                Sequential dependency chain ensuring zero float violation across design packages.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>T-001 Project Charter Sign-off</span>
                  <span className="text-emerald-600 font-mono">100% Done</span>
                </div>
                <div className="pl-4 text-muted-foreground text-[10px]">↓ Finish-to-Start</div>
                <div className="flex items-center justify-between font-bold">
                  <span>T-002 Requirements Freeze</span>
                  <span className="text-emerald-600 font-mono">100% Done</span>
                </div>
                <div className="pl-4 text-muted-foreground text-[10px]">↓ Finish-to-Start</div>
                <div className="flex items-center justify-between font-bold text-primary">
                  <span>T-023 Finalize Mechanical Drawing</span>
                  <span className="font-mono">80% In Progress</span>
                </div>
                <div className="pl-4 text-muted-foreground text-[10px]">↓ Finish-to-Start</div>
                <div className="flex items-center justify-between font-bold">
                  <span>T-024 Verify Dimensions & Tolerances</span>
                  <span className="font-mono">50% In Progress</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsDependencyOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default TaskManagementFormPage;

