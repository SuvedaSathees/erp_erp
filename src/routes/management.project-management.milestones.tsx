import { useState, useRef, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  RefreshCw,
  Download,
  Calendar as CalendarIcon,
  BarChart3,
  Plus,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Compass,
  Check,
  MoreHorizontal,
  User,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Share2,
  CalendarCheck,
  Printer,
  FileSpreadsheet,
  Copy,
  Trash2,
  Edit2,
  SlidersHorizontal,
  ArrowUpDown,
  ExternalLink,
  TrendingUp,
  Save,
  Send,
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

export interface ProjectMilestone {
  code: string;
  name: string;
  wbs: string;
  type: string;
  owner: string;
  department: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Completed" | "In Progress" | "Planned" | "At Risk" | "Upcoming";
  plannedDate: string;
  forecastDate: string;
  actualDate: string;
  critical: boolean;
  percent: number;
  notes?: string;
  variance?: string;
  acceptanceCriteria?: string[];
  dependencies?: {
    predecessor?: string;
    successor?: string;
  };
}

export const INITIAL_MILESTONES: ProjectMilestone[] = [
  {
    code: "M-001",
    name: "Project Kickoff",
    wbs: "1.0",
    type: "Phase Gate",
    owner: "Arun Kumar",
    department: "Project Management Office",
    priority: "High",
    status: "Completed",
    plannedDate: "01 Sep 2026",
    forecastDate: "01 Sep 2026",
    actualDate: "01 Sep 2026",
    critical: true,
    percent: 100,
    variance: "0 days",
    acceptanceCriteria: ["Project charter signed by sponsor", "Initial budget approved", "Team onboarded"],
    dependencies: { successor: "Requirements Freeze" },
  },
  {
    code: "M-002",
    name: "Requirements Freeze",
    wbs: "2.1",
    type: "Deliverable",
    owner: "Ananya Sen",
    department: "Engineering",
    priority: "High",
    status: "Completed",
    plannedDate: "07 Sep 2026",
    forecastDate: "07 Sep 2026",
    actualDate: "07 Sep 2026",
    critical: true,
    percent: 100,
    variance: "0 days",
    acceptanceCriteria: ["Customer requirements matrix signed", "Safety regulations IEC 61851 locked"],
    dependencies: { predecessor: "Project Kickoff", successor: "Design Freeze" },
  },
  {
    code: "M-003",
    name: "Design Freeze",
    wbs: "2.2",
    type: "Design Freeze",
    owner: "Suresh Kumar",
    department: "Engineering",
    priority: "Critical",
    status: "In Progress",
    plannedDate: "20 Sep 2026",
    forecastDate: "20 Sep 2026",
    actualDate: "—",
    critical: true,
    percent: 65,
    variance: "0 days",
    acceptanceCriteria: [
      "Electrical schematic design approved",
      "Mechanical sheetmetal enclosure validated",
      "Power electronics thermal simulation signed",
      "Software firmware architecture reviewed",
      "Engineering manufacturing drawings released",
    ],
    dependencies: { predecessor: "Requirements Freeze", successor: "Procurement Complete" },
  },
  {
    code: "M-004",
    name: "Procurement Complete",
    wbs: "3.0",
    type: "Procurement",
    owner: "Ravi Teja",
    department: "Supply Chain",
    priority: "Critical",
    status: "At Risk",
    plannedDate: "25 Sep 2026",
    forecastDate: "28 Sep 2026",
    actualDate: "—",
    critical: true,
    percent: 15,
    variance: "+3 days",
    acceptanceCriteria: ["Controller ICs received in warehouse", "Enclosure sheet metal passed QA"],
    dependencies: { predecessor: "Design Freeze", successor: "Production Complete" },
  },
  {
    code: "M-005",
    name: "Production Complete",
    wbs: "4.0",
    type: "Production",
    owner: "Devendra Sahu",
    department: "Manufacturing",
    priority: "Critical",
    status: "Planned",
    plannedDate: "15 Oct 2026",
    forecastDate: "17 Oct 2026",
    actualDate: "—",
    critical: true,
    percent: 0,
    variance: "+2 days",
    acceptanceCriteria: ["48 Smart Chargers manufactured", "In-line quality check 100% passed"],
    dependencies: { predecessor: "Procurement Complete", successor: "FAT Complete" },
  },
  {
    code: "M-006",
    name: "FAT Complete",
    wbs: "4.4",
    type: "FAT",
    owner: "Sunil Verma",
    department: "Quality",
    priority: "High",
    status: "Planned",
    plannedDate: "20 Oct 2026",
    forecastDate: "22 Oct 2026",
    actualDate: "—",
    critical: false,
    percent: 0,
    variance: "+2 days",
    acceptanceCriteria: ["Factory Acceptance Testing protocol signed by customer auditor"],
    dependencies: { predecessor: "Production Complete", successor: "Installation Complete" },
  },
  {
    code: "M-007",
    name: "Installation Complete",
    wbs: "5.0",
    type: "Installation",
    owner: "Karthik Subramanian",
    department: "Field Engineering",
    priority: "High",
    status: "Planned",
    plannedDate: "30 Oct 2026",
    forecastDate: "30 Oct 2026",
    actualDate: "—",
    critical: false,
    percent: 0,
    variance: "0 days",
    acceptanceCriteria: ["12 site foundations completed", "Power grid connections energised"],
    dependencies: { predecessor: "FAT Complete", successor: "Commissioning" },
  },
  {
    code: "M-008",
    name: "Commissioning",
    wbs: "6.0",
    type: "Commissioning",
    owner: "Sunil Verma",
    department: "Quality",
    priority: "Critical",
    status: "Planned",
    plannedDate: "05 Nov 2026",
    forecastDate: "07 Nov 2026",
    actualDate: "—",
    critical: true,
    percent: 0,
    variance: "+2 days",
    acceptanceCriteria: ["OCPP 2.0.1 live telemetry online", "Soak load test completed"],
    dependencies: { predecessor: "Installation Complete", successor: "Customer Acceptance" },
  },
  {
    code: "M-009",
    name: "Customer Acceptance",
    wbs: "6.0",
    type: "Customer Acceptance",
    owner: "Arun Kumar",
    department: "Project Management Office",
    priority: "Critical",
    status: "Planned",
    plannedDate: "10 Nov 2026",
    forecastDate: "12 Nov 2026",
    actualDate: "—",
    critical: true,
    percent: 0,
    variance: "+2 days",
    acceptanceCriteria: ["Final Customer Acceptance Certificate (FAC) signed by ABC Energy"],
    dependencies: { predecessor: "Commissioning" },
  },
  {
    code: "M-010",
    name: "Safety Standard Alignment",
    wbs: "1.2",
    type: "Phase Gate",
    owner: "Ananya Sen",
    department: "Engineering",
    priority: "High",
    status: "Completed",
    plannedDate: "03 Sep 2026",
    forecastDate: "03 Sep 2026",
    actualDate: "03 Sep 2026",
    critical: false,
    percent: 100,
    variance: "0 days",
    acceptanceCriteria: ["UL 2202 and CE regulatory conformity locked"],
  },
  {
    code: "M-011",
    name: "Architecture Baseline",
    wbs: "2.0",
    type: "Deliverable",
    owner: "Suresh Kumar",
    department: "Engineering",
    priority: "High",
    status: "Completed",
    plannedDate: "05 Sep 2026",
    forecastDate: "05 Sep 2026",
    actualDate: "05 Sep 2026",
    critical: true,
    percent: 100,
    variance: "0 days",
    acceptanceCriteria: ["System block diagram signed off by technical board"],
  },
  {
    code: "M-012",
    name: "Supplier Shortlist Approved",
    wbs: "3.1",
    type: "Procurement",
    owner: "Ravi Teja",
    department: "Supply Chain",
    priority: "Medium",
    status: "Completed",
    plannedDate: "06 Sep 2026",
    forecastDate: "06 Sep 2026",
    actualDate: "06 Sep 2026",
    critical: false,
    percent: 100,
    variance: "0 days",
    acceptanceCriteria: ["Tier-1 semiconductor and sheet metal vendors shortlisted"],
  },
  {
    code: "M-013",
    name: "Site Survey Complete",
    wbs: "5.1",
    type: "Installation",
    owner: "Karthik Subramanian",
    department: "Field Engineering",
    priority: "High",
    status: "Completed",
    plannedDate: "08 Sep 2026",
    forecastDate: "08 Sep 2026",
    actualDate: "08 Sep 2026",
    critical: false,
    percent: 100,
    variance: "0 days",
    acceptanceCriteria: ["Geotechnical and load bearing survey signed by civil engineer"],
  },
  {
    code: "M-014",
    name: "CAD Shell Approval",
    wbs: "2.2",
    type: "Design Freeze",
    owner: "Suresh Kumar",
    department: "Engineering",
    priority: "High",
    status: "Completed",
    plannedDate: "09 Sep 2026",
    forecastDate: "09 Sep 2026",
    actualDate: "09 Sep 2026",
    critical: false,
    percent: 100,
    variance: "0 days",
    acceptanceCriteria: ["3D solid model enclosure approved for tooling preview"],
  },
  {
    code: "M-015",
    name: "Firmware Spec Freeze",
    wbs: "2.4",
    type: "Deliverable",
    owner: "Devendra Sahu",
    department: "Engineering",
    priority: "High",
    status: "Completed",
    plannedDate: "10 Sep 2026",
    forecastDate: "10 Sep 2026",
    actualDate: "10 Sep 2026",
    critical: true,
    percent: 100,
    variance: "0 days",
    acceptanceCriteria: ["OCPP state machine and CAN bus telemetry specs locked"],
  },
  {
    code: "M-016",
    name: "Thermal Baseline Review",
    wbs: "2.2",
    type: "Deliverable",
    owner: "Rohan Patel",
    department: "Engineering",
    priority: "Medium",
    status: "Completed",
    plannedDate: "11 Sep 2026",
    forecastDate: "11 Sep 2026",
    actualDate: "11 Sep 2026",
    critical: false,
    percent: 100,
    variance: "0 days",
    acceptanceCriteria: ["CFD simulation shows peak internal temp < 48°C at full 120kW load"],
  },
  {
    code: "M-017",
    name: "DC Busbar Delivery",
    wbs: "3.2",
    type: "Procurement",
    owner: "Ravi Teja",
    department: "Supply Chain",
    priority: "Critical",
    status: "At Risk",
    plannedDate: "22 Sep 2026",
    forecastDate: "26 Sep 2026",
    actualDate: "—",
    critical: true,
    percent: 20,
    variance: "+4 days",
    acceptanceCriteria: ["High conductivity copper busbars delivered and spectrally analyzed"],
  },
  {
    code: "M-018",
    name: "Grid Interconnect Permit",
    wbs: "5.2",
    type: "Phase Gate",
    owner: "Karthik Subramanian",
    department: "Field Engineering",
    priority: "Critical",
    status: "At Risk",
    plannedDate: "28 Sep 2026",
    forecastDate: "02 Oct 2026",
    actualDate: "—",
    critical: true,
    percent: 30,
    variance: "+4 days",
    acceptanceCriteria: ["State electricity distribution utility permit sanction letter issued"],
  },
  {
    code: "M-019",
    name: "Enclosure Tooling Release",
    wbs: "4.1",
    type: "Production",
    owner: "Devendra Sahu",
    department: "Manufacturing",
    priority: "High",
    status: "At Risk",
    plannedDate: "02 Oct 2026",
    forecastDate: "05 Oct 2026",
    actualDate: "—",
    critical: false,
    percent: 10,
    variance: "+3 days",
    acceptanceCriteria: ["Hardened steel stamping dies approved for press line"],
  },
  {
    code: "M-020",
    name: "PCB Assembly Fabrication",
    wbs: "4.2",
    type: "Production",
    owner: "Suresh Kumar",
    department: "Manufacturing",
    priority: "High",
    status: "In Progress",
    plannedDate: "18 Sep 2026",
    forecastDate: "18 Sep 2026",
    actualDate: "—",
    critical: true,
    percent: 45,
    variance: "0 days",
    acceptanceCriteria: ["SMT pick-and-place run for 50 control boards"],
  },
  {
    code: "M-021",
    name: "BMS Integration Test",
    wbs: "2.3",
    type: "Deliverable",
    owner: "Ananya Sen",
    department: "Engineering",
    priority: "High",
    status: "In Progress",
    plannedDate: "19 Sep 2026",
    forecastDate: "19 Sep 2026",
    actualDate: "—",
    critical: false,
    percent: 50,
    variance: "0 days",
    acceptanceCriteria: ["Hardware-in-the-loop BMS handshake validated"],
  },
  {
    code: "M-022",
    name: "HMI Touchscreen Validation",
    wbs: "2.4",
    type: "Deliverable",
    owner: "Vikram Malhotra",
    department: "Engineering",
    priority: "Medium",
    status: "In Progress",
    plannedDate: "21 Sep 2026",
    forecastDate: "21 Sep 2026",
    actualDate: "—",
    critical: false,
    percent: 40,
    variance: "0 days",
    acceptanceCriteria: ["IP65 waterproof touch response and sunlight readability verified"],
  },
  {
    code: "M-023",
    name: "Transformer Pad Civil Works",
    wbs: "5.1",
    type: "Installation",
    owner: "Karthik Subramanian",
    department: "Field Engineering",
    priority: "High",
    status: "In Progress",
    plannedDate: "23 Sep 2026",
    forecastDate: "23 Sep 2026",
    actualDate: "—",
    critical: true,
    percent: 55,
    variance: "0 days",
    acceptanceCriteria: ["Reinforced concrete pad curing certified for 500kVA transformer"],
  },
  {
    code: "M-024",
    name: "Cable Trenching Sign-off",
    wbs: "5.2",
    type: "Installation",
    owner: "Karthik Subramanian",
    department: "Field Engineering",
    priority: "Medium",
    status: "In Progress",
    plannedDate: "24 Sep 2026",
    forecastDate: "24 Sep 2026",
    actualDate: "—",
    critical: false,
    percent: 60,
    variance: "0 days",
    acceptanceCriteria: ["Underground conduit layout inspected according to safety code"],
  },
];

export const Route = createFileRoute("/management/project-management/milestones")({
  head: () => ({
    meta: [
      { title: "Project Milestones Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Track and manage key zero-duration control points to ensure project progress and successful delivery.",
      },
    ],
  }),
  component: ProjectMilestonesFormPage,
});

export function ProjectMilestonesFormPage() {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(INITIAL_MILESTONES);
  const [selectedMilestoneCode, setSelectedMilestoneCode] = useState<string>("M-003");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modals
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isGanttOpen, setIsGanttOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [isImpactOpen, setIsImpactOpen] = useState(false);

  // New Milestone Form State
  const [newCode, setNewCode] = useState("M-025");
  const [newName, setNewName] = useState("");
  const [newWbs, setNewWbs] = useState("2.2");
  const [newType, setNewType] = useState("Deliverable");
  const [newOwner, setNewOwner] = useState("Suresh Kumar");
  const [newPriority, setNewPriority] = useState<ProjectMilestone["priority"]>("High");
  const [newDate, setNewDate] = useState("26 Sep 2026");
  const [newCritical, setNewCritical] = useState(true);

  const selectedMilestone = useMemo(() => {
    return milestones.find((m) => m.code === selectedMilestoneCode) || milestones[0];
  }, [milestones, selectedMilestoneCode]);

  // Filtered Milestones
  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "Critical"
          ? m.critical
          : statusFilter === "Upcoming"
          ? m.status === "Planned" || m.status === "In Progress" || m.status === "Upcoming"
          : m.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [milestones, searchQuery, statusFilter]);

  // Counts
  const completedCount = useMemo(() => milestones.filter((m) => m.status === "Completed").length, [milestones]);
  const upcomingCount = useMemo(() => milestones.filter((m) => m.status === "Planned" || m.status === "In Progress" || m.status === "Upcoming").length, [milestones]);
  const atRiskCount = useMemo(() => milestones.filter((m) => m.status === "At Risk").length, [milestones]);
  const inProgressCount = useMemo(() => milestones.filter((m) => m.status === "In Progress").length, [milestones]);

  const handleSelectMilestone = (code: string) => {
    setSelectedMilestoneCode(code);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setMilestones(INITIAL_MILESTONES);
      setSelectedMilestoneCode("M-003");
      setStatusFilter("All");
      setSearchQuery("");
      toast.success("Schedule engine re-synchronized: 24 contractual milestones up to date.");
    }, 450);
  };

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newM: ProjectMilestone = {
      code: newCode.trim() || `M-0${milestones.length + 1}`,
      name: newName.trim(),
      wbs: newWbs,
      type: newType,
      owner: newOwner,
      department: "Engineering",
      priority: newPriority,
      status: "Planned",
      plannedDate: newDate,
      forecastDate: newDate,
      actualDate: "—",
      critical: newCritical,
      percent: 0,
      variance: "0 days",
      acceptanceCriteria: ["Engineering and QA gate sign-off protocol"],
      dependencies: { predecessor: "Design Freeze" },
    };

    setMilestones((prev) => [newM, ...prev]);
    setSelectedMilestoneCode(newM.code);
    setIsAddMilestoneOpen(false);
    setNewName("");
    setNewCode(`M-0${milestones.length + 2}`);
    toast.success(`Milestone ${newM.code} (${newM.name}) created successfully!`);
  };

  const handleExportMilestones = () => {
    const csvContent =
      "Code,Milestone Name,WBS,Type,Owner,Department,Priority,Planned Date,Forecast Date,Actual Date,Status,Critical,Progress %,Variance\n" +
      milestones
        .map(
          (m) =>
            `"${m.code}","${m.name.replace(/"/g, '""')}","${m.wbs}","${m.type}","${m.owner}","${m.department}","${m.priority}","${m.plannedDate}","${m.forecastDate}","${m.actualDate}","${m.status}","${m.critical ? "YES" : "NO"}","${m.percent}%","${m.variance || "0 days"}"`,
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "PRJ-2026-0195_Milestones_Register.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Milestone register CSV downloaded.");
  };

  const handleExportDossier = () => {
    const dossier = `=====================================================
PROJECT MILESTONE CONTROL DOSSIER
Project: Smart EV Charging Infrastructure (PRJ-2026-0195)
Generated: ${new Date().toLocaleString()}
Active Milestone Count: ${milestones.length}
=====================================================

MILESTONES REGISTER:
-----------------------------------------------------
${milestones
  .map(
    (m) =>
      `[${m.code}] ${m.name}
  WBS: ${m.wbs} | Type: ${m.type} | Owner: ${m.owner} (${m.department})
  Schedule: Planned ${m.plannedDate} | Forecast ${m.forecastDate} | Actual ${m.actualDate}
  Status: ${m.status.toUpperCase()} | Critical Path: ${m.critical ? "YES (Zero Float)" : "NO"} | Variance: ${m.variance || "0 days"}
  Criteria: ${m.acceptanceCriteria?.join("; ") || "Standard gate approval"}
`,
  )
  .join("\n")}
=====================================================`;

    const blob = new Blob([dossier], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PRJ-2026-0195_Milestone_Dossier.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Milestone Dossier (.TXT) downloaded.");
  };

  const handleMarkCompleted = (code: string) => {
    const today = "12 Sep 2026";
    setMilestones((prev) =>
      prev.map((m) =>
        m.code === code
          ? { ...m, status: "Completed", percent: 100, actualDate: today, variance: "0 days" }
          : m,
      ),
    );
    toast.success(`Milestone ${code} marked as Completed.`);
  };

  const handleMarkAtRisk = (code: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.code === code
          ? { ...m, status: "At Risk", variance: "+3 days" }
          : m,
      ),
    );
    toast.warning(`Milestone ${code} marked as At Risk.`);
  };

  const handleDeleteMilestone = (code: string) => {
    if (milestones.length <= 1) {
      toast.error("Cannot delete all milestones.");
      return;
    }
    const remaining = milestones.filter((m) => m.code !== code);
    setMilestones(remaining);
    setSelectedMilestoneCode(remaining[0].code);
    toast.success(`Milestone ${code} deleted.`);
  };

  const handleToggleCriterion = (index: number) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.code !== selectedMilestone.code) return m;
        const crits = [...(m.acceptanceCriteria || [])];
        if (crits[index]) {
          crits[index] = crits[index].startsWith("✓ ")
            ? crits[index].replace("✓ ", "")
            : `✓ ${crits[index]}`;
        }
        return { ...m, acceptanceCriteria: crits };
      }),
    );
  };

  const handleRecalculateCriticalPath = () => {
    toast.success("Critical path recalculated: M-003, M-004, M-005, M-008, M-009 on zero float path.");
  };

  return (
    <AppShell
      title="Project Milestones Form"
      breadcrumb="Management > Project Management > Milestones"
      description="Track and manage key zero-duration control points to ensure project progress and successful delivery."
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
                  Project Milestones Form
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
                  onClick={() => setIsAddMilestoneOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Milestone
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
                    toast.success("Milestone schedule report emailed to stakeholders.");
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
                    <DropdownMenuItem onClick={handleExportMilestones} className="cursor-pointer">
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export CSV Register
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-primary" /> Export Milestone Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(milestones, null, 2));
                        toast.success("Milestones JSON copied to clipboard");
                      }}
                      className="cursor-pointer"
                    >
                      <Copy className="mr-2 h-4 w-4 text-primary" /> Copy JSON Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Milestones baseline saved successfully!");
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
             2. MILESTONE MASTER FORM CARD
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs">
              {/* Field 1: Milestone Code */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Milestone Code
                </span>
                <span className="font-bold font-mono text-sm text-primary">
                  {selectedMilestone.code}
                </span>
              </div>

              {/* Field 2: Milestone Name */}
              <div className="lg:col-span-2">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Milestone Name <span className="text-rose-500">*</span>
                </span>
                <Input
                  value={selectedMilestone.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMilestones((prev) =>
                      prev.map((m) =>
                        m.code === selectedMilestone.code ? { ...m, name: val } : m,
                      ),
                    );
                  }}
                  className="h-7 text-xs font-semibold px-2 py-0 mt-0.5 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              {/* Field 3: WBS */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  WBS Element
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                  {selectedMilestone.wbs} Design
                </span>
              </div>

              {/* Field 4: Milestone Type */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Milestone Type
                </span>
                <select
                  value={selectedMilestone.type}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMilestones((prev) =>
                      prev.map((m) =>
                        m.code === selectedMilestone.code ? { ...m, type: val } : m,
                      ),
                    );
                  }}
                  className="h-7 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option value="Design Freeze">Design Freeze</option>
                  <option value="Phase Gate">Phase Gate</option>
                  <option value="Deliverable">Deliverable</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Production">Production</option>
                  <option value="FAT">FAT</option>
                  <option value="Installation">Installation</option>
                  <option value="Commissioning">Commissioning</option>
                  <option value="Customer Acceptance">Customer Acceptance</option>
                  <option value="Payment">Payment</option>
                </select>
              </div>

              {/* Field 5: Status */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Status <span className="text-rose-500">*</span>
                </span>
                <select
                  value={selectedMilestone.status}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setMilestones((prev) =>
                      prev.map((m) =>
                        m.code === selectedMilestone.code ? { ...m, status: val } : m,
                      ),
                    );
                  }}
                  className="h-7 w-full text-xs font-bold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              {/* Field 6: Owner */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Owner <span className="text-rose-500">*</span>
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <select
                    value={selectedMilestone.owner}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMilestones((prev) =>
                        prev.map((m) =>
                          m.code === selectedMilestone.code ? { ...m, owner: val } : m,
                        ),
                      );
                    }}
                    className="h-7 w-full text-xs font-semibold rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Suresh Kumar">Suresh Kumar</option>
                    <option value="Arun Kumar">Arun Kumar</option>
                    <option value="Ananya Sen">Ananya Sen</option>
                    <option value="Vikram Malhotra">Vikram Malhotra</option>
                    <option value="Ravi Teja">Ravi Teja</option>
                    <option value="Devendra Sahu">Devendra Sahu</option>
                    <option value="Sunil Verma">Sunil Verma</option>
                    <option value="Karthik Subramanian">Karthik Subramanian</option>
                    <option value="Rohan Patel">Rohan Patel</option>
                  </select>
                </div>
              </div>

              {/* Field 7: Planned Date */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Planned Date <span className="text-rose-500">*</span>
                </span>
                <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white mt-0.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={selectedMilestone.plannedDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMilestones((prev) =>
                        prev.map((m) =>
                          m.code === selectedMilestone.code ? { ...m, plannedDate: val } : m,
                        ),
                      );
                    }}
                    className="h-7 text-xs font-mono px-2 py-0 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Field 8: Forecast Date */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Forecast Date
                </span>
                <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white mt-0.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={selectedMilestone.forecastDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMilestones((prev) =>
                        prev.map((m) =>
                          m.code === selectedMilestone.code ? { ...m, forecastDate: val } : m,
                        ),
                      );
                    }}
                    className="h-7 text-xs font-mono px-2 py-0 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Field 9: Critical Path */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Critical Path
                </span>
                <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMilestone.critical}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setMilestones((prev) =>
                        prev.map((m) =>
                          m.code === selectedMilestone.code ? { ...m, critical: checked } : m,
                        ),
                      );
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {selectedMilestone.critical ? "Zero Float (Critical)" : "Non-Critical"}
                  </span>
                </label>
              </div>

              {/* Field 10: % Complete */}
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                    % Complete
                  </span>
                  <span className="font-mono font-bold text-primary text-[11px]">{selectedMilestone.percent}%</span>
                </div>
                <div className="mt-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={selectedMilestone.percent}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMilestones((prev) =>
                        prev.map((m) =>
                          m.code === selectedMilestone.code ? { ...m, percent: val } : m,
                        ),
                      );
                    }}
                    className="w-full accent-primary h-1.5 cursor-pointer"
                  />
                </div>
              </div>

              {/* Field 11: Notes */}
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Notes
                </span>
                <Input
                  placeholder="Add notes..."
                  value={selectedMilestone.notes || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMilestones((prev) =>
                      prev.map((m) =>
                        m.code === selectedMilestone.code ? { ...m, notes: val } : m,
                      ),
                    );
                  }}
                  className="h-7 text-xs px-2 mt-0.5 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Quick Action Buttons Row */}
            <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkCompleted(selectedMilestone.code)}
                  className="h-7 text-xs font-semibold gap-1 text-emerald-700 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkAtRisk(selectedMilestone.code)}
                  className="h-7 text-xs font-semibold gap-1 text-amber-700 dark:text-amber-300 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  Flag At Risk
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsDetailViewOpen(true)}
                  className="h-7 text-xs font-medium gap-1 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  View Criteria ({selectedMilestone.acceptanceCriteria?.length || 0})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRecalculateCriticalPath}
                  className="h-7 text-xs font-medium gap-1 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                  Recalculate Critical Path
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground font-mono">
                  Baseline: V1.0 · Updated 01 Sep 2026
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteMilestone(selectedMilestone.code)}
                  className="h-7 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Milestone
                </Button>
              </div>
            </div>
          </div>

          {/* ====================================================================
             3. SIX METRIC KPI CARDS ROW (Clickable to Filter Table!)
             ==================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Total Milestones */}
            <div
              onClick={() => setStatusFilter("All")}
              className={cn(
                "border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                statusFilter === "All"
                  ? "bg-blue-50/70 dark:bg-blue-950/30 border-primary ring-1 ring-primary"
                  : "bg-white dark:bg-slate-900 border-border/80 hover:border-slate-400",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Total Milestones
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {milestones.length}
                </span>
                <span className="text-[10px] text-primary font-semibold block mt-1">
                  {statusFilter === "All" ? "✓ Active Filter" : "Click to View All"}
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            {/* 2. Completed */}
            <div
              onClick={() => setStatusFilter(statusFilter === "Completed" ? "All" : "Completed")}
              className={cn(
                "border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                statusFilter === "Completed"
                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500"
                  : "bg-white dark:bg-slate-900 border-border/80 hover:border-emerald-300",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Completed</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {completedCount}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  {((completedCount / milestones.length) * 100).toFixed(1)}% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            {/* 3. Upcoming */}
            <div
              onClick={() => setStatusFilter(statusFilter === "Upcoming" ? "All" : "Upcoming")}
              className={cn(
                "border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                statusFilter === "Upcoming"
                  ? "bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 ring-1 ring-blue-500"
                  : "bg-white dark:bg-slate-900 border-border/80 hover:border-blue-300",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Upcoming</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {upcomingCount}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block mt-1">
                  {((upcomingCount / milestones.length) * 100).toFixed(1)}% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* 4. At Risk */}
            <div
              onClick={() => setStatusFilter(statusFilter === "At Risk" ? "All" : "At Risk")}
              className={cn(
                "border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                statusFilter === "At Risk"
                  ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-500 ring-1 ring-rose-500"
                  : "bg-white dark:bg-slate-900 border-border/80 hover:border-rose-300",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">At Risk</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {atRiskCount}
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  {((atRiskCount / milestones.length) * 100).toFixed(1)}% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            {/* 5. Avg Delay */}
            <div
              onClick={() => setStatusFilter("At Risk")}
              className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer hover:border-slate-400 transition-colors"
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">Avg Delay</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  1.6 Days
                </span>
                <span className="text-[10px] text-muted-foreground font-medium block mt-1">
                  For delayed milestones
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {/* 6. On-Time Rate */}
            <div
              onClick={() => setStatusFilter("Critical")}
              className={cn(
                "border rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all",
                statusFilter === "Critical"
                  ? "bg-cyan-50/70 dark:bg-cyan-950/30 border-cyan-500 ring-1 ring-cyan-500"
                  : "bg-white dark:bg-slate-900 border-border/80 hover:border-cyan-300",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">On-Time Rate</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  88.9%
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold block mt-1">
                  8 of 9 completed on time
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Compass className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. MASTER MILESTONES REGISTER TABLE (Full Width, Zero Whitespace)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-3.5 pb-2.5 border-b border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Project Milestones Register
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                    {filteredMilestones.length} of {milestones.length}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status Filter Buttons */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                    {(["All", "Completed", "In Progress", "Planned", "At Risk", "Critical"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setStatusFilter(filter)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer",
                          statusFilter === filter
                            ? "bg-white dark:bg-slate-900 text-primary font-bold shadow-2xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2 text-muted-foreground" />
                    <Input
                      placeholder="Search code, name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-7 text-xs pl-8 pr-2 w-44 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setIsAddMilestoneOpen(true)}
                    className="h-7 text-xs gap-1 bg-[#0B3B7B] hover:bg-[#082B5B] text-white cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Milestone
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40 text-[11px] text-muted-foreground font-semibold">
                      <th className="p-2.5 pl-4 w-20">Code</th>
                      <th className="p-2.5">Milestone Name</th>
                      <th className="p-2.5 w-28">WBS</th>
                      <th className="p-2.5 w-32">Type</th>
                      <th className="p-2.5 w-32">Owner</th>
                      <th className="p-2.5 w-28">Planned</th>
                      <th className="p-2.5 w-28">Forecast</th>
                      <th className="p-2.5 w-24">Critical Path</th>
                      <th className="p-2.5 w-24">% Complete</th>
                      <th className="p-2.5 w-28">Status</th>
                      <th className="p-2.5 pr-4 text-right w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredMilestones.map((m) => {
                      const isSelected = selectedMilestoneCode === m.code;
                      return (
                        <tr
                          key={m.code}
                          onClick={() => handleSelectMilestone(m.code)}
                          className={cn(
                            "cursor-pointer transition-colors",
                            isSelected
                              ? "bg-primary/10 dark:bg-primary/20 font-medium"
                              : "hover:bg-muted/20",
                          )}
                        >
                          <td className="p-2.5 pl-4 font-mono font-bold text-primary">{m.code}</td>
                          <td className="p-2.5">
                            <span className="font-semibold text-foreground block truncate">{m.name}</span>
                            {m.notes && <span className="text-[10px] text-muted-foreground truncate block">{m.notes}</span>}
                          </td>
                          <td className="p-2.5 font-mono text-muted-foreground">{m.wbs}</td>
                          <td className="p-2.5 text-muted-foreground truncate">{m.type}</td>
                          <td className="p-2.5 text-muted-foreground truncate">{m.owner}</td>
                          <td className="p-2.5 font-mono text-muted-foreground">{m.plannedDate}</td>
                          <td className="p-2.5 font-mono text-muted-foreground">{m.forecastDate}</td>
                          <td className="p-2.5">
                            {m.critical ? (
                              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300 text-[10px] font-bold">
                                Zero Float
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-[11px]">—</span>
                            )}
                          </td>
                          <td className="p-2.5">
                            <div className="flex items-center gap-1.5 w-20">
                              <span className="font-mono text-[11px] font-bold">{m.percent}%</span>
                              <Progress value={m.percent} className="h-1.5 flex-1" />
                            </div>
                          </td>
                          <td className="p-2.5">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-semibold",
                                m.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                  : m.status === "At Risk"
                                  ? "bg-rose-50 text-rose-700 border-rose-300"
                                  : m.status === "In Progress"
                                  ? "bg-blue-50 text-blue-700 border-blue-300"
                                  : "bg-slate-100 text-slate-700 border-slate-300",
                              )}
                            >
                              {m.status}
                            </Badge>
                          </td>
                          <td className="p-2.5 pr-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectMilestone(m.code);
                                setIsDetailViewOpen(true);
                              }}
                              className="h-6 w-6 p-0 text-slate-500 hover:text-primary cursor-pointer"
                              title="View Criteria"
                            >
                              <Layers className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================================
             5. SCHEDULE MATRIX & CALENDAR / AI INSIGHTS (Balanced 6 cols + 6 cols)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left Card: 60-Day Milestone Timeline & Gate Governance (6 cols) */}
            <Card className="lg:col-span-6 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Milestone Timeline & Phase Gate Schedule (Next 60 Days)
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMilestoneCode("M-003");
                      toast.info("Selected active milestone: M-003 Design Freeze");
                    }}
                    className="h-6 text-[10px] px-2 cursor-pointer"
                  >
                    Today
                  </Button>
                </CardHeader>
                <CardContent className="p-3.5 space-y-2 text-xs">
                  {[
                    { code: "M-002", date: "07", month: "SEP", name: "Requirements Freeze", wbs: "WBS: 2.1 Requirements", status: "On Track", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-300" },
                    { code: "M-003", date: "20", month: "SEP", name: "Design Freeze", wbs: "WBS: 2.2 Design", status: "On Track", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-300" },
                    { code: "M-004", date: "25", month: "SEP", name: "Procurement Complete", wbs: "WBS: 3.0 Procurement", status: "At Risk", badgeColor: "bg-rose-50 text-rose-700 border-rose-300" },
                    { code: "M-005", date: "15", month: "OCT", name: "Production Complete", wbs: "WBS: 4.0 Production", status: "Planned", badgeColor: "bg-blue-50 text-blue-700 border-blue-300" },
                    { code: "M-006", date: "20", month: "OCT", name: "FAT Complete", wbs: "WBS: 4.4 Testing", status: "Planned", badgeColor: "bg-blue-50 text-blue-700 border-blue-300" },
                  ].map((item) => {
                    const isSelected = selectedMilestoneCode === item.code;
                    return (
                      <div
                        key={item.code}
                        onClick={() => handleSelectMilestone(item.code)}
                        className={cn(
                          "flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                          isSelected
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center w-8 shrink-0">
                            <span className="block font-bold text-sm leading-tight text-slate-900 dark:text-white">
                              {item.date}
                            </span>
                            <span className="block text-[9px] text-muted-foreground uppercase font-semibold">
                              {item.month}
                            </span>
                          </div>
                          <div className={cn("h-2 w-2 rounded-full shrink-0", item.status === "At Risk" ? "bg-rose-500" : item.status === "On Track" ? "bg-emerald-500" : "bg-blue-500")} />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{item.wbs}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] shrink-0 font-medium", item.badgeColor)}>
                          {item.status}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </div>

              {/* Critical Path Table preview */}
              <div className="p-3.5 pt-2 border-t border-border/40">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Critical Path Variance
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsGanttOpen(true)}
                    className="text-[11px] text-primary font-semibold hover:underline cursor-pointer"
                  >
                    View in Gantt →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                    <span className="text-[10px] text-muted-foreground block">Zero Float</span>
                    <span className="font-bold text-emerald-600 font-mono">100% Compliant</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                    <span className="text-[10px] text-muted-foreground block">Schedule Buffer</span>
                    <span className="font-bold text-blue-600 font-mono">4.2 Days</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                    <span className="text-[10px] text-muted-foreground block">Critical Gates</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">5 Gates</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border">
                    <span className="text-[10px] text-muted-foreground block">Max Variance</span>
                    <span className="font-bold text-rose-600 font-mono">+3 Days</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right Card: Calendar Matrix & AI Insights (6 cols) */}
            <Card className="lg:col-span-6 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                    Milestone Calendar Matrix (September 2026)
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportDossier}
                    className="h-6 text-[10px] px-2 text-primary hover:underline cursor-pointer"
                  >
                    Export Dossier
                  </Button>
                </CardHeader>
                <CardContent className="p-3.5 space-y-3">
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted-foreground pb-1 border-b border-border/40">
                    <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                    <button type="button" onClick={() => handleSelectMilestone("M-001")} className={cn("p-1 rounded-full bg-emerald-600 text-white font-bold h-6 w-6 mx-auto flex items-center justify-center cursor-pointer", selectedMilestoneCode === "M-001" && "ring-2 ring-emerald-400 ring-offset-2")}>1</button>
                    <div className="p-1">2</div><div className="p-1">3</div><div className="p-1">4</div><div className="p-1">5</div><div className="p-1">6</div>
                    <button type="button" onClick={() => handleSelectMilestone("M-002")} className={cn("p-1 rounded-full bg-emerald-600 text-white font-bold h-6 w-6 mx-auto flex items-center justify-center cursor-pointer", selectedMilestoneCode === "M-002" && "ring-2 ring-emerald-400 ring-offset-2")}>7</button>
                    <div className="p-1">8</div><div className="p-1">9</div><div className="p-1">10</div><div className="p-1">11</div><div className="p-1">12</div><div className="p-1">13</div><div className="p-1">14</div>
                    <div className="p-1">15</div><div className="p-1">16</div><div className="p-1">17</div><div className="p-1">18</div><div className="p-1">19</div>
                    <button type="button" onClick={() => handleSelectMilestone("M-003")} className={cn("p-1 rounded-full bg-blue-600 text-white font-bold h-6 w-6 mx-auto flex items-center justify-center cursor-pointer", selectedMilestoneCode === "M-003" && "ring-2 ring-blue-400 ring-offset-2")}>20</button>
                    <div className="p-1">21</div><div className="p-1">22</div><div className="p-1">23</div><div className="p-1">24</div>
                    <button type="button" onClick={() => handleSelectMilestone("M-004")} className={cn("p-1 rounded-full bg-amber-500 text-white font-bold h-6 w-6 mx-auto flex items-center justify-center cursor-pointer", selectedMilestoneCode === "M-004" && "ring-2 ring-amber-400 ring-offset-2")}>25</button>
                    <div className="p-1">26</div><div className="p-1">27</div><div className="p-1">28</div><div className="p-1">29</div><div className="p-1">30</div>
                  </div>
                </CardContent>
              </div>

              {/* AI Insights strip inside right card */}
              <div className="p-3.5 pt-2 border-t border-border/40 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" /> AI Schedule Insights
                </span>
                <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                    <span className="text-[11px] truncate">M-004 Procurement lead time at risk (+3d).</span>
                  </div>
                  <button type="button" onClick={() => setIsRecommendOpen(true)} className="text-[10px] text-rose-700 dark:text-rose-400 font-bold hover:underline shrink-0 cursor-pointer">
                    Recommendation →
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px] truncate">M-003 Design Freeze on track (82% complete).</span>
                  </div>
                  <button type="button" onClick={() => setIsDetailViewOpen(true)} className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline shrink-0 cursor-pointer">
                    Details →
                  </button>
                </div>
              </div>
            </Card>
          </div>

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Add Milestone Modal */}
        <Dialog open={isAddMilestoneOpen} onOpenChange={setIsAddMilestoneOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add Project Milestone
              </DialogTitle>
              <DialogDescription className="text-xs">
                Define a key zero-duration control point linked to WBS deliverables.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMilestoneSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Milestone Code:</label>
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Milestone Name *:</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Battery Ingress Test Sign-off"
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">WBS Element:</label>
                  <select
                    value={newWbs}
                    onChange={(e) => setNewWbs(e.target.value)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="1.0">1.0 Project Management</option>
                    <option value="2.1">2.1 Requirements</option>
                    <option value="2.2">2.2 Design</option>
                    <option value="3.0">3.0 Procurement</option>
                    <option value="4.0">4.0 Production</option>
                    <option value="5.0">5.0 Installation</option>
                    <option value="6.0">6.0 Commissioning</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Milestone Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Deliverable">Deliverable</option>
                    <option value="Design Freeze">Design Freeze</option>
                    <option value="Phase Gate">Phase Gate</option>
                    <option value="FAT">FAT</option>
                    <option value="Customer Acceptance">Customer Acceptance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Planned Date:</label>
                  <Input
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Priority:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="critCheck"
                  checked={newCritical}
                  onChange={(e) => setNewCritical(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
                <label htmlFor="critCheck" className="text-xs font-medium cursor-pointer">
                  Critical path milestone (zero float tolerance)
                </label>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAddMilestoneOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Save Milestone
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Milestone Detail View Modal */}
        <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center justify-between">
                <span>{selectedMilestone.code} — {selectedMilestone.name.toUpperCase()}</span>
                <Badge className="bg-blue-600 text-white text-xs">{selectedMilestone.status.toUpperCase()}</Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Zero-duration contractual gate parameters, acceptance checklist, and dependency links.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Project</span>
                  <span className="font-semibold">PRJ-2026-0195 (Smart EV Charging)</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">WBS Branch</span>
                  <span className="font-semibold">{selectedMilestone.wbs} Design</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Planned / Forecast Date</span>
                  <span className="font-mono font-medium">{selectedMilestone.plannedDate} / {selectedMilestone.forecastDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase">Critical Path / Variance</span>
                  <span className="font-bold text-rose-600">{selectedMilestone.critical ? "YES" : "NO"} ({selectedMilestone.variance || "0 days"})</span>
                </div>
              </div>

              {/* Acceptance Criteria with Interactive Checkboxes */}
              <div className="p-3 border rounded-lg space-y-2">
                <span className="font-bold uppercase text-[10px] tracking-wider text-foreground block">
                  Acceptance Criteria (Click to Toggle Sign-off)
                </span>
                <div className="space-y-1.5">
                  {(selectedMilestone.acceptanceCriteria || [
                    "Electrical schematic design approved",
                    "Mechanical sheetmetal enclosure validated",
                    "Power electronics thermal simulation signed",
                    "Software firmware architecture reviewed",
                    "Engineering manufacturing drawings released",
                  ]).map((crit, idx) => {
                    const isDone = crit.startsWith("✓ ") || selectedMilestone.status === "Completed";
                    return (
                      <div
                        key={crit}
                        onClick={() => handleToggleCriterion(idx)}
                        className="flex items-center gap-2 p-1 rounded hover:bg-muted/40 cursor-pointer"
                      >
                        <div className={cn("h-4 w-4 rounded flex items-center justify-center transition-colors", isDone ? "bg-emerald-600 text-white" : "border border-slate-300 text-transparent")}>
                          <Check className="h-3 w-3" />
                        </div>
                        <span className={isDone ? "text-slate-900 dark:text-white font-medium" : "text-muted-foreground"}>
                          {crit.replace("✓ ", "")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dependencies */}
              <div className="p-3 border rounded-lg space-y-2">
                <span className="font-bold uppercase text-[10px] tracking-wider text-foreground block">
                  Dependency Predecessors & Successors
                </span>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                  <span className="p-1.5 bg-muted rounded">
                    {selectedMilestone.dependencies?.predecessor || "Requirements Freeze"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  <span className="p-1.5 bg-blue-100 dark:bg-blue-950 text-primary rounded">{selectedMilestone.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  <span className="p-1.5 bg-muted rounded">
                    {selectedMilestone.dependencies?.successor || "Procurement Complete"}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsDetailViewOpen(false)}>
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleMarkCompleted(selectedMilestone.code);
                  setIsDetailViewOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
              >
                Complete Milestone
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3. Gantt Timeline View Modal */}
        <Dialog open={isGanttOpen} onOpenChange={setIsGanttOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Milestone Gantt Timeline (Sep → Nov 2026)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Zero-duration milestone checkpoints across the contractual project schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground pb-1 border-b pl-36">
                <span>Sep 01</span>
                <span>Sep 07</span>
                <span>Sep 20</span>
                <span>Sep 25</span>
                <span>Oct 15</span>
                <span>Oct 20</span>
                <span>Oct 30</span>
                <span>Nov 05</span>
                <span>Nov 10</span>
              </div>
              {milestones.map((m, idx) => {
                const offsets = ["5%", "15%", "30%", "40%", "58%", "68%", "80%", "88%", "97%"];
                const leftPos = offsets[idx % offsets.length];
                return (
                  <div
                    key={m.code}
                    onClick={() => {
                      handleSelectMilestone(m.code);
                      setIsGanttOpen(false);
                      toast.info(`Selected milestone ${m.code}`);
                    }}
                    className="flex items-center gap-2 h-7 hover:bg-muted/30 px-1 rounded cursor-pointer"
                  >
                    <div className="w-36 truncate font-medium text-[11px] shrink-0">
                      <span className="font-mono text-primary font-bold mr-1.5">{m.code}</span>
                      <span>{m.name}</span>
                    </div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded h-4 relative">
                      <div
                        style={{ left: leftPos }}
                        className={cn(
                          "absolute top-0.5 -ml-2 h-3 w-3 rotate-45 shadow-2xs border border-white dark:border-slate-900 transition-transform hover:scale-125",
                          m.status === "Completed"
                            ? "bg-emerald-600"
                            : m.status === "At Risk"
                            ? "bg-rose-500"
                            : "bg-blue-600",
                        )}
                        title={`${m.name} (${m.plannedDate})`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsGanttOpen(false)}>Close Gantt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. AI Recommendation Modal */}
        <Dialog open={isRecommendOpen} onOpenChange={setIsRecommendOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Supply Chain Recommendation
              </DialogTitle>
              <DialogDescription className="text-xs">
                Mitigation analysis for Procurement Complete (M-004) delay risk.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-lg text-amber-800 dark:text-amber-200">
                <p className="font-bold">Detected Constraint:</p>
                <p className="mt-1">
                  Supplier lead time for automotive-grade STM32 microcontrollers increased from 14 to 21 days due to customs clearance.
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="font-bold">Recommended Mitigation Options:</span>
                <div className="p-2 border rounded hover:bg-muted/40 cursor-pointer space-y-1">
                  <span className="font-semibold text-primary block">Option A: Expedited Air Freight</span>
                  <p className="text-muted-foreground text-[11px]">
                    Cost: ₹ 18,500. Saves 3 days, restoring planned date to 25 Sep 2026.
                  </p>
                </div>
                <div className="p-2 border rounded hover:bg-muted/40 cursor-pointer space-y-1">
                  <span className="font-semibold text-primary block">Option B: Secondary Qualified Vendor</span>
                  <p className="text-muted-foreground text-[11px]">
                    Cost: ₹ 0. Lead time 16 days, partial batch delivery of 24 units.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsRecommendOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setMilestones((prev) =>
                    prev.map((m) =>
                      m.code === "M-004"
                        ? { ...m, status: "In Progress", variance: "0 days", forecastDate: "25 Sep 2026" }
                        : m,
                    ),
                  );
                  setIsRecommendOpen(false);
                  toast.success("Option A applied: Expedited Air Freight booked, M-004 restored to schedule.");
                }}
                className="bg-primary text-white"
              >
                Apply Option A (Expedite)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. AI Impact Analysis Modal */}
        <Dialog open={isImpactOpen} onOpenChange={setIsImpactOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Schedule Impact Analysis
              </DialogTitle>
              <DialogDescription className="text-xs">
                Production Complete (M-005) downstream schedule dependencies.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Production Date:</span>
                  <span className="font-mono font-bold">15 Oct 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Forecast With +2 Day Shift:</span>
                  <span className="font-mono font-bold text-amber-600">17 Oct 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">FAT Testing (M-006) Float:</span>
                  <span className="font-mono font-bold text-emerald-600">3 Days Float (Absorbed)</span>
                </div>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Because FAT Complete (M-006) has a 3-day float window, this 2-day production shift will <strong>not</strong> breach the contractual customer handover date (10 Nov 2026).
              </p>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsImpactOpen(false)} className="bg-primary text-white">
                Acknowledge Impact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default ProjectMilestonesFormPage;

