import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { cn } from "@/lib/utils";
import {
  Star,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  Plus,
  ChevronDown,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon,
  Sparkles,
  Layers,
  ArrowUpDown,
  SlidersHorizontal,
  ClipboardList,
  AlertCircle,
  Hourglass,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  Share2,
  FileText,
  DollarSign,
  Edit2,
  Eye,
  MoreVertical,
  Minus,
  Maximize2,
  X,
  ShieldCheck,
  ShieldAlert,
  History,
  Check,
  HelpCircle,
  ArrowRight,
  Printer,
  Trash2,
  ExternalLink,
  BookOpen,
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

export interface IssueItem {
  id: string;
  title: string;
  category:
    | "Procurement"
    | "Technical"
    | "Quality"
    | "Resource"
    | "Customer"
    | "Logistics"
    | "IT / System"
    | "Schedule"
    | "Others";
  priority: "Critical" | "High" | "Medium" | "Low";
  severity: "Severe" | "Major" | "Moderate" | "Minor";
  owner: string;
  reportedBy: string;
  status: "Open" | "Investigating" | "Action" | "Resolved" | "Closed";
  dueDate: string;
  age: string;
  costImpact: string;
  scheduleImpact: string;
  qualityImpact: string;
  rootCause: string;
  correctiveAction: string;
  progress: number;
  relatedRisk: string;
}

export const INITIAL_ISSUES: IssueItem[] = [
  {
    id: "I-001",
    title: "Controller delivery delayed",
    category: "Procurement",
    priority: "Critical",
    severity: "Severe",
    owner: "Procurement Manager",
    reportedBy: "Project Manager",
    status: "Open",
    dueDate: "08 Sep 2026",
    age: "3 Days",
    costImpact: "₹ 4.50 L",
    scheduleImpact: "+12 Days",
    qualityImpact: "Medium",
    rootCause: "Supplier production capacity constraint and failure to meet committed delivery schedule.",
    correctiveAction: "Activate alternate supplier and place backup order to meet delivery.",
    progress: 60,
    relatedRisk: "R-001 Supplier Capacity Risk",
  },
  {
    id: "I-002",
    title: "Drawing revision required",
    category: "Technical",
    priority: "High",
    severity: "Major",
    owner: "Engineering Lead",
    reportedBy: "QA Lead",
    status: "Investigating",
    dueDate: "07 Sep 2026",
    age: "2 Days",
    costImpact: "₹ 1.20 L",
    scheduleImpact: "+3 Days",
    qualityImpact: "High",
    rootCause: "Enclosure mounting brackets conflict with cooling vent duct clearance.",
    correctiveAction: "Issue revision D to mechanical CAD model and recalculate static load.",
    progress: 45,
    relatedRisk: "R-002 Design Rework Risk",
  },
  {
    id: "I-003",
    title: "Material rejection in QC",
    category: "Quality",
    priority: "High",
    severity: "Major",
    owner: "QA Manager",
    reportedBy: "Incoming Inspector",
    status: "Open",
    dueDate: "09 Sep 2026",
    age: "3 Days",
    costImpact: "₹ 2.20 L",
    scheduleImpact: "+4 Days",
    qualityImpact: "Critical",
    rootCause: "Powder coating thickness in batch #488 below 60-micron specification threshold.",
    correctiveAction: "Quarantine defective lot and trigger vendor corrective action notice (VCAN).",
    progress: 25,
    relatedRisk: "R-005 Quality Rejection Risk",
  },
  {
    id: "I-004",
    title: "Skilled operator unavailable",
    category: "Resource",
    priority: "High",
    severity: "Major",
    owner: "Production Manager",
    reportedBy: "Shop Floor Lead",
    status: "Action",
    dueDate: "10 Sep 2026",
    age: "4 Days",
    costImpact: "₹ 0.40 L",
    scheduleImpact: "+2 Days",
    qualityImpact: "Medium",
    rootCause: "Certified SMT soldering technicians on medical leave during high-volume run.",
    correctiveAction: "Assign pre-qualified contract operators and initiate 4-hour safety retraining.",
    progress: 80,
    relatedRisk: "R-004 Resource Shortage Risk",
  },
  {
    id: "I-005",
    title: "Customer approval pending",
    category: "Customer",
    priority: "Medium",
    severity: "Moderate",
    owner: "Project Manager",
    reportedBy: "Project Coordinator",
    status: "Open",
    dueDate: "12 Sep 2026",
    age: "5 Days",
    costImpact: "₹ 0.00 L",
    scheduleImpact: "+3 Days",
    qualityImpact: "Low",
    rootCause: "Client technical stakeholder travelling; formal sign-off delayed.",
    correctiveAction: "Escalate via weekly project steering committee for provisional executive approval.",
    progress: 50,
    relatedRisk: "R-007 Customer Approval Risk",
  },
  {
    id: "I-006",
    title: "Transport vehicle breakdown",
    category: "Logistics",
    priority: "Medium",
    severity: "Moderate",
    owner: "Logistics Manager",
    reportedBy: "Fleet Coordinator",
    status: "Resolved",
    dueDate: "06 Sep 2026",
    age: "-",
    costImpact: "₹ 0.60 L",
    scheduleImpact: "0 Days",
    qualityImpact: "Low",
    rootCause: "Transmission failure on primary trailer carrying chassis sub-assemblies.",
    correctiveAction: "Dispatched standby container truck; goods safely transferred and delivered.",
    progress: 100,
    relatedRisk: "R-006 Logistics Delay Risk",
  },
  {
    id: "I-007",
    title: "Testing equipment failure",
    category: "Quality",
    priority: "Medium",
    severity: "Moderate",
    owner: "QA Manager",
    reportedBy: "FAT Engineer",
    status: "Investigating",
    dueDate: "08 Sep 2026",
    age: "1 Day",
    costImpact: "₹ 0.35 L",
    scheduleImpact: "+1 Day",
    qualityImpact: "Medium",
    rootCause: "Insulation resistance meter calibration expired and power supply fluctuating.",
    correctiveAction: "Requested express recalibration from NABL certified laboratory.",
    progress: 30,
    relatedRisk: "R-005 QA Testing Risk",
  },
  {
    id: "I-008",
    title: "Software configuration error",
    category: "IT / System",
    priority: "Low",
    severity: "Minor",
    owner: "IT Executive",
    reportedBy: "Site Supervisor",
    status: "Open",
    dueDate: "15 Sep 2026",
    age: "6 Days",
    costImpact: "₹ 0.85 L",
    scheduleImpact: "+1 Day",
    qualityImpact: "Low",
    rootCause: "Telemetry IP gateway firmware mismatch with cloud backend API.",
    correctiveAction: "Deploy hotfix firmware patch v2.4.1 over OTA server.",
    progress: 70,
    relatedRisk: "R-009 System Integration Risk",
  },
  {
    id: "I-009",
    title: "Cable harness insulation breakdown",
    category: "Quality",
    priority: "Critical",
    severity: "Severe",
    owner: "QA Manager",
    reportedBy: "High Voltage Test Engineer",
    status: "Action",
    dueDate: "09 Sep 2026",
    age: "2 Days",
    costImpact: "₹ 3.10 L",
    scheduleImpact: "+6 Days",
    qualityImpact: "Critical",
    rootCause: "Crimping tool overtightened and ruptured outer XLPE dielectric jacket.",
    correctiveAction: "Replace wire harnesses and recalibrate pneumatic crimping press stops.",
    progress: 35,
    relatedRisk: "R-005 Quality Rejection Risk",
  },
  {
    id: "I-010",
    title: "High voltage transformer earthing pit failure",
    category: "Technical",
    priority: "High",
    severity: "Major",
    owner: "Electrical Lead",
    reportedBy: "Safety Inspector",
    status: "Investigating",
    dueDate: "11 Sep 2026",
    age: "3 Days",
    costImpact: "₹ 1.80 L",
    scheduleImpact: "+5 Days",
    qualityImpact: "High",
    rootCause: "Soil resistivity exceeded 50 ohm-meters due to rocky subsoil composition.",
    correctiveAction: "Install chemical earth electrodes and backfill with bentonite compound.",
    progress: 50,
    relatedRisk: "R-010 Grid Interconnect Risk",
  },
  {
    id: "I-011",
    title: "Solder paste stencil misalignment in SMT line",
    category: "Quality",
    priority: "Medium",
    severity: "Moderate",
    owner: "SMT Line In-charge",
    reportedBy: "Visual QC Inspector",
    status: "Action",
    dueDate: "07 Sep 2026",
    age: "1 Day",
    costImpact: "₹ 0.45 L",
    scheduleImpact: "+1 Day",
    qualityImpact: "Medium",
    rootCause: "Fiducial camera lens contaminated with flux residue.",
    correctiveAction: "Cleaned optical sensor and initiated automated fiducial verify after 50 boards.",
    progress: 90,
    relatedRisk: "R-005 Quality Rejection Risk",
  },
  {
    id: "I-012",
    title: "Incomplete import customs paperwork at Nhava Sheva",
    category: "Logistics",
    priority: "High",
    severity: "Major",
    owner: "Supply Chain Manager",
    reportedBy: "Clearing Agent",
    status: "Open",
    dueDate: "13 Sep 2026",
    age: "4 Days",
    costImpact: "₹ 1.50 L",
    scheduleImpact: "+7 Days",
    qualityImpact: "Low",
    rootCause: "Certificate of origin missing COO seal from overseas manufacturing plant.",
    correctiveAction: "Obtained digital endorsed e-COO from consular trade authority.",
    progress: 40,
    relatedRisk: "R-006 Logistics Delay Risk",
  },
  {
    id: "I-013",
    title: "Substation power cutoff during testing",
    category: "Technical",
    priority: "Medium",
    severity: "Moderate",
    owner: "Commissioning Engineer",
    reportedBy: "Test Technologist",
    status: "Action",
    dueDate: "10 Sep 2026",
    age: "2 Days",
    costImpact: "₹ 0.55 L",
    scheduleImpact: "+2 Days",
    qualityImpact: "Medium",
    rootCause: "Upstream feeder circuit breaker tripped under 200kW reactive test pulse.",
    correctiveAction: "Rescheduled high-power test window with electricity distribution utility.",
    progress: 65,
    relatedRisk: "R-010 Grid Interconnect Risk",
  },
  {
    id: "I-014",
    title: "Liquid coolant pump cavitation noise",
    category: "Quality",
    priority: "Low",
    severity: "Minor",
    owner: "Mechanical QC",
    reportedBy: "Endurance Test Cell",
    status: "Resolved",
    dueDate: "05 Sep 2026",
    age: "-",
    costImpact: "₹ 0.25 L",
    scheduleImpact: "0 Days",
    qualityImpact: "Low",
    rootCause: "Air pockets trapped in suction inlet manifold during glycol filling.",
    correctiveAction: "Added automated vacuum bleed vacuum sequence during coolant priming.",
    progress: 100,
    relatedRisk: "R-014 Leakage Risk",
  },
  {
    id: "I-015",
    title: "Firmware OTA encryption key mismatch",
    category: "IT / System",
    priority: "High",
    severity: "Major",
    owner: "Security Architect",
    reportedBy: "DevOps Engineer",
    status: "Action",
    dueDate: "09 Sep 2026",
    age: "2 Days",
    costImpact: "₹ 0.90 L",
    scheduleImpact: "+3 Days",
    qualityImpact: "Critical",
    rootCause: "Staging server certificate rotated without updating cryptographic bootloader token.",
    correctiveAction: "Regenerated dual-signed certificate payload and pushed over staging subnet.",
    progress: 75,
    relatedRisk: "R-009 System Integration Risk",
  },
  {
    id: "I-016",
    title: "Site civil excavation hitting underground utility",
    category: "Resource",
    priority: "Critical",
    severity: "Severe",
    owner: "Civil Site Manager",
    reportedBy: "Safety Officer",
    status: "Open",
    dueDate: "12 Sep 2026",
    age: "3 Days",
    costImpact: "₹ 2.75 L",
    scheduleImpact: "+9 Days",
    qualityImpact: "High",
    rootCause: "As-built municipal water pipe laid 1.2m offset from official survey drawing.",
    correctiveAction: "Construct concrete protective diversion casing and obtain municipal EOD permit.",
    progress: 20,
    relatedRisk: "R-009 Safety Violation Risk",
  },
  {
    id: "I-017",
    title: "Discrepancy in bill of materials quantity for fasteners",
    category: "Procurement",
    priority: "Low",
    severity: "Minor",
    owner: "Stores In-charge",
    reportedBy: "Assembly Technician",
    status: "Closed",
    dueDate: "04 Sep 2026",
    age: "-",
    costImpact: "₹ 0.10 L",
    scheduleImpact: "0 Days",
    qualityImpact: "Low",
    rootCause: "BOM unit of measure listed in boxes instead of individual 100-pack bags.",
    correctiveAction: "Corrected ERP item master conversion factor and issued replacement stock.",
    progress: 100,
    relatedRisk: "R-001 Procurement Delay Risk",
  },
  {
    id: "I-018",
    title: "Customer requested modified charger wrap colorway",
    category: "Customer",
    priority: "Low",
    severity: "Minor",
    owner: "Client Servicing Lead",
    reportedBy: "Account Executive",
    status: "Resolved",
    dueDate: "06 Sep 2026",
    age: "-",
    costImpact: "₹ 0.15 L",
    scheduleImpact: "+1 Day",
    qualityImpact: "Low",
    rootCause: "Client brand team updated secondary corporate teal Pantone guidelines.",
    correctiveAction: "Approved digital proof and updated plotter cutting template with print vendor.",
    progress: 100,
    relatedRisk: "R-007 Customer Approval Risk",
  },
  {
    id: "I-019",
    title: "Missing environmental certificate for raw steel",
    category: "Quality",
    priority: "Medium",
    severity: "Moderate",
    owner: "Compliance Manager",
    reportedBy: "Audit Team",
    status: "Action",
    dueDate: "14 Sep 2026",
    age: "2 Days",
    costImpact: "₹ 0.30 L",
    scheduleImpact: "+2 Days",
    qualityImpact: "Medium",
    rootCause: "Mill test certificate #MT-901 did not include ISO 14001 compliance annexure.",
    correctiveAction: "Requested revised mill test certificate from steel manufacturer.",
    progress: 60,
    relatedRisk: "R-008 Regulatory Approval Risk",
  },
  {
    id: "I-020",
    title: "RFID card reader firmware timeout during badging",
    category: "IT / System",
    priority: "Low",
    severity: "Minor",
    owner: "Embedded Software Lead",
    reportedBy: "Lab Tester",
    status: "Closed",
    dueDate: "03 Sep 2026",
    age: "-",
    costImpact: "₹ 0.20 L",
    scheduleImpact: "0 Days",
    qualityImpact: "Low",
    rootCause: "SPI bus polling timeout set too conservatively at 50ms instead of 150ms.",
    correctiveAction: "Updated timeout parameter in reader config and verified with 500 test swipes.",
    progress: 100,
    relatedRisk: "R-009 System Integration Risk",
  },
];

export const Route = createFileRoute("/management/project-management/issue-management")({
  head: () => ({
    meta: [
      { title: "Issue Management Form · Project Management · Magnertia ERP" },
      {
        name: "description",
        content: "Manage and resolve project issues to ensure smooth execution and successful delivery.",
      },
    ],
  }),
  component: IssueManagementFormPage,
});

export function IssueManagementFormPage() {
  const [issues, setIssues] = useState<IssueItem[]>(INITIAL_ISSUES);
  const [selectedIssue, setSelectedIssue] = useState<IssueItem>(INITIAL_ISSUES[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Filters
  const [filterProject, setFilterProject] = useState("Smart EV Charging Infrastructure");
  const [filterWbs, setFilterWbs] = useState("All WBS");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterOwner, setFilterOwner] = useState("All");
  const [filterReportedBy, setFilterReportedBy] = useState("All");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditIssueOpen, setIsEditIssueOpen] = useState(false);
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [isFiveWhyOpen, setIsFiveWhyOpen] = useState(false);
  const [isAiIssueOpen, setIsAiIssueOpen] = useState(false);
  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
  const [isCostImpactModalOpen, setIsCostImpactModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isLessonsLearnedOpen, setIsLessonsLearnedOpen] = useState(false);

  // New Issue Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<IssueItem["category"]>("Procurement");
  const [newPriority, setNewPriority] = useState<IssueItem["priority"]>("Critical");
  const [newSeverity, setNewSeverity] = useState<IssueItem["severity"]>("Severe");
  const [newOwner, setNewOwner] = useState("Procurement Manager");
  const [newReportedBy, setNewReportedBy] = useState("Project Manager");
  const [newDueDate, setNewDueDate] = useState("08 Sep 2026");
  const [newDescription, setNewDescription] = useState("");
  const [newCostImpact, setNewCostImpact] = useState("₹ 4.50 L");
  const [newScheduleImpact, setNewScheduleImpact] = useState("+12 Days");

  const handleClearFilters = () => {
    setFilterWbs("All WBS");
    setFilterCategory("All Categories");
    setFilterStatus("All Status");
    setFilterPriority("All");
    setFilterSeverity("All");
    setFilterOwner("All");
    setFilterReportedBy("All");
    setSearchQuery("");
    setActiveKpiFilter(null);
    setCurrentPage(1);
    toast.info("Issue management filters reset to default.");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIssues(INITIAL_ISSUES);
      setSelectedIssue(INITIAL_ISSUES[0]);
      handleClearFilters();
      toast.success("Issues and corrective action status refreshed from ERP.");
    }, 450);
  };

  const handleCreateIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: IssueItem = {
      id: `I-0${issues.length + 1}`,
      title: newTitle || "New Project Problem",
      category: newCategory,
      priority: newPriority,
      severity: newSeverity,
      owner: newOwner,
      reportedBy: newReportedBy,
      status: "Open",
      dueDate: newDueDate,
      age: "0 Days",
      costImpact: newCostImpact || "₹ 1.00 L",
      scheduleImpact: newScheduleImpact || "+2 Days",
      qualityImpact: "Medium",
      rootCause: newDescription || "Under investigation by responsible department.",
      correctiveAction: "Drafting corrective action response.",
      progress: 0,
      relatedRisk: "R-001 Originating Risk",
    };

    setIssues((prev) => [newItem, ...prev]);
    setSelectedIssue(newItem);
    setIsCreateOpen(false);
    toast.success(`Issue ${newItem.id} logged (${newItem.priority} Priority)`);
  };

  const handleSaveEditIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setIssues((prev) =>
      prev.map((item) => (item.id === selectedIssue.id ? selectedIssue : item)),
    );
    setIsEditIssueOpen(false);
    toast.success(`Issue ${selectedIssue.id} updated successfully.`);
  };

  const handleDeleteIssue = (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
    if (selectedIssue.id === id) {
      setSelectedIssue(issues[1] || issues[0]);
    }
    toast.success(`Removed issue ${id} from register.`);
  };

  const handleExportCsv = () => {
    const header = "Issue ID,Title,Category,Priority,Severity,Owner,Reported By,Status,Due Date,Age,Cost Impact,Schedule Impact,Progress %\n";
    const rows = issues
      .map(
        (i) =>
          `"${i.id}","${i.title}","${i.category}","${i.priority}","${i.severity}","${i.owner}","${i.reportedBy}","${i.status}","${i.dueDate}","${i.age}","${i.costImpact}","${i.scheduleImpact}",${i.progress}`,
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Issue_Register.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Issue register exported to CSV.");
  };

  const handleExportDossier = () => {
    const text = `=====================================================
PROJECT ISSUE MANAGEMENT DOSSIER
Project: Smart EV Charging Infrastructure (PRJ-2026-0195)
Generated: ${new Date().toLocaleString()}
=====================================================

EXECUTIVE SUMMARY:
• Total Issues Logged:   ${issues.length}
• Critical Issues:       ${issues.filter((i) => i.priority === "Critical").length}
• High Issues:           ${issues.filter((i) => i.priority === "High").length}
• Medium Issues:         ${issues.filter((i) => i.priority === "Medium").length}
• Low Issues:            ${issues.filter((i) => i.priority === "Low").length}
• In-Flight / Open:      ${issues.filter((i) => i.status !== "Closed" && i.status !== "Resolved").length}

ACTIVE ISSUE REGISTER:
-----------------------------------------------------
${issues
  .map(
    (i) =>
      `[${i.id}] ${i.title}
  Category: ${i.category} | Priority: ${i.priority} | Severity: ${i.severity}
  Owner: ${i.owner} | Reported By: ${i.reportedBy} | Status: ${i.status}
  Cost Impact: ${i.costImpact} | Schedule Delay: ${i.scheduleImpact} | Due: ${i.dueDate} (Age: ${i.age})
  Root Cause: ${i.rootCause}
  Corrective Action: ${i.correctiveAction} (Progress: ${i.progress}%)
  Related Risk: ${i.relatedRisk}`,
  )
  .join("\n\n")}
=====================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRJ-2026-0195_Issue_Dossier.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Issue Dossier (.TXT) downloaded.");
  };

  // Filtered Issues
  const filteredIssues = useMemo(() => {
    return issues.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filterCategory === "All Categories" || item.category === filterCategory;
      const matchesStatus = filterStatus === "All Status" || item.status === filterStatus;
      const matchesPriority = filterPriority === "All" || item.priority === filterPriority;
      const matchesSeverity = filterSeverity === "All" || item.severity === filterSeverity;
      const matchesOwner = filterOwner === "All" || item.owner === filterOwner;
      const matchesReportedBy = filterReportedBy === "All" || item.reportedBy === filterReportedBy;

      const matchesKpi =
        !activeKpiFilter
          ? true
          : activeKpiFilter === "critical"
          ? item.priority === "Critical"
          : activeKpiFilter === "high"
          ? item.priority === "High"
          : activeKpiFilter === "medium"
          ? item.priority === "Medium"
          : activeKpiFilter === "low"
          ? item.priority === "Low"
          : activeKpiFilter === "overdue"
          ? item.age !== "-" && item.status !== "Closed" && item.status !== "Resolved"
          : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPriority &&
        matchesSeverity &&
        matchesOwner &&
        matchesReportedBy &&
        matchesKpi
      );
    });
  }, [
    issues,
    searchQuery,
    filterCategory,
    filterStatus,
    filterPriority,
    filterSeverity,
    filterOwner,
    filterReportedBy,
    activeKpiFilter,
  ]);

  // Paginated Issues
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage) || 1;
  const paginatedIssues = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredIssues.slice(start, start + itemsPerPage);
  }, [filteredIssues, currentPage, itemsPerPage]);

  return (
    <AppShell
      title="Issue Management Form"
      breadcrumb="Management > Project Management > Issue Management"
      description="Manage and resolve project issues to ensure smooth execution and successful delivery."
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
                  Issue Management Form
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
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B3B7B] hover:bg-[#082B5B] text-white transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Issue
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
                    toast.success("Issue register emailed to stakeholders.");
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
                  <DropdownMenuContent align="end" className="w-56 text-xs">
                    <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer">
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export CSV Register
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-blue-600" /> Export Issue Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsFiveWhyOpen(true)} className="cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4 text-amber-500" /> Root Cause 5-Why Analysis
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Issue register saved successfully!");
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
             2. CONTEXT FILTER BAR (2 Rows with Clear Filters)
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
            {/* Row 1: Project, Project Code, WBS, Issue Category, Status */}
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
                  <option>2.0 Engineering</option>
                  <option>3.0 Procurement</option>
                  <option>4.0 Production</option>
                  <option>5.0 Installation</option>
                  <option>6.0 Commissioning</option>
                  <option>7.0 Project Closure</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Issue Category
                </span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All Categories</option>
                  <option>Procurement</option>
                  <option>Technical</option>
                  <option>Quality</option>
                  <option>Resource</option>
                  <option>Customer</option>
                  <option>Logistics</option>
                  <option>IT / System</option>
                  <option>Schedule</option>
                  <option>Others</option>
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
                  <option>All Status</option>
                  <option>Open</option>
                  <option>Investigating</option>
                  <option>Action</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </div>
            </div>

            {/* Row 2: Priority, Severity, Issue Owner, Reported By, Date Range, Clear Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 text-xs pt-1">
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
                  Severity
                </span>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Severe</option>
                  <option>Major</option>
                  <option>Moderate</option>
                  <option>Minor</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Issue Owner
                </span>
                <select
                  value={filterOwner}
                  onChange={(e) => setFilterOwner(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Procurement Manager</option>
                  <option>Engineering Lead</option>
                  <option>QA Manager</option>
                  <option>Production Manager</option>
                  <option>Logistics Manager</option>
                  <option>Project Manager</option>
                  <option>IT Executive</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Reported By
                </span>
                <select
                  value={filterReportedBy}
                  onChange={(e) => setFilterReportedBy(e.target.value)}
                  className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2 mt-0.5"
                >
                  <option>All</option>
                  <option>Project Manager</option>
                  <option>QA Lead</option>
                  <option>Incoming Inspector</option>
                  <option>Shop Floor Lead</option>
                  <option>Site Supervisor</option>
                </select>
              </div>

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Date Range
                </span>
                <div className="h-8 px-2 flex items-center justify-between font-medium text-xs bg-slate-50 dark:bg-slate-800 rounded-md border border-input mt-0.5">
                  <span className="truncate">01 Aug 2026 - 30 Sep 2026</span>
                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                </div>
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
             3. SIX METRIC KPI STATUS CARDS (Interactive Click-to-Filter)
             ==================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Total Issues */}
            <div
              onClick={() => {
                setActiveKpiFilter(null);
                handleClearFilters();
                toast.info("Showing all project issues");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs",
                activeKpiFilter === null && "ring-2 ring-primary/60",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Total Issues
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  47
                </span>
                <span className="text-[10px] text-primary font-semibold block mt-1">
                  View All Issues →
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>

            {/* 2. Critical Issues */}
            <div
              onClick={() => {
                setActiveKpiFilter("critical");
                toast.info("Filtered for Critical priority issues");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-rose-500/60 hover:shadow-xs",
                activeKpiFilter === "critical" && "ring-2 ring-rose-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Critical Issues
                </span>
                <span className="text-xl font-bold font-mono text-rose-600 mt-0.5 block">
                  4
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold block mt-1">
                  8.5% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>

            {/* 3. High Issues */}
            <div
              onClick={() => {
                setActiveKpiFilter("high");
                toast.info("Filtered for High priority issues");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-amber-500/60 hover:shadow-xs",
                activeKpiFilter === "high" && "ring-2 ring-amber-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  High Issues
                </span>
                <span className="text-xl font-bold font-mono text-amber-600 mt-0.5 block">
                  11
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
                  23.4% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            {/* 4. Medium Issues */}
            <div
              onClick={() => {
                setActiveKpiFilter("medium");
                toast.info("Filtered for Medium priority issues");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-yellow-500/60 hover:shadow-xs",
                activeKpiFilter === "medium" && "ring-2 ring-yellow-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Medium Issues
                </span>
                <span className="text-xl font-bold font-mono text-yellow-600 mt-0.5 block">
                  18
                </span>
                <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-semibold block mt-1">
                  38.3% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>

            {/* 5. Low Issues */}
            <div
              onClick={() => {
                setActiveKpiFilter("low");
                toast.info("Filtered for Low priority issues");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-emerald-500/60 hover:shadow-xs",
                activeKpiFilter === "low" && "ring-2 ring-emerald-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Low Issues
                </span>
                <span className="text-xl font-bold font-mono text-emerald-600 mt-0.5 block">
                  14
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  29.8% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            {/* 6. Overdue Actions */}
            <div
              onClick={() => {
                setActiveKpiFilter("overdue");
                toast.info("Filtered for Overdue corrective actions");
              }}
              className={cn(
                "bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:border-purple-500/60 hover:shadow-xs",
                activeKpiFilter === "overdue" && "ring-2 ring-purple-500",
              )}
            >
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Overdue Actions
                </span>
                <span className="text-xl font-bold font-mono text-purple-600 mt-0.5 block">
                  6
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block mt-1">
                  12.8% of Total
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Hourglass className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. ISSUE ANALYTICS ROW (3 Balanced Cards: 4 cols + 4 cols + 4 cols)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Card 1 (4 cols): Issues by Status */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Issues by Status
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {issues.length} Total
                </Badge>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="117" />
                    <circle cx="50" cy="50" r="38" stroke="#14b8a6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="173" />
                    <circle cx="50" cy="50" r="38" stroke="#a855f7" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="213" />
                    <circle cx="50" cy="50" r="38" stroke="#64748b" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="238" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{issues.length}</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {[
                    { name: "Open", count: "23 (48.9%)", color: "bg-blue-500", status: "Open" },
                    { name: "Investigating", count: "11 (23.4%)", color: "bg-orange-500", status: "Investigating" },
                    { name: "Corrective Action", count: "8 (17.0%)", color: "bg-teal-500", status: "Action" },
                    { name: "Resolved", count: "5 (10.6%)", color: "bg-purple-500", status: "Resolved" },
                    { name: "Closed", count: "31 (56.0%)", color: "bg-slate-500", status: "Closed" },
                  ].map((s) => (
                    <div
                      key={s.name}
                      onClick={() => {
                        setFilterStatus(s.status);
                        toast.info(`Filtered table for ${s.name} status.`);
                      }}
                      className="flex justify-between items-center p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      title={`Filter by ${s.name}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <div className={cn("h-2 w-2 rounded-full", s.color)} /> {s.name}
                      </span>
                      <span className="font-mono text-muted-foreground font-semibold">{s.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 2 (4 cols): Issues by Priority */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Issues by Priority
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono text-rose-600 border-rose-200">
                  4 Critical
                </Badge>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                {[
                  { label: "Critical", count: "4 (8.5%)", pct: 15, barColor: "bg-rose-600", priority: "Critical" },
                  { label: "High", count: "11 (23.4%)", pct: 40, barColor: "bg-orange-500", priority: "High" },
                  { label: "Medium", count: "18 (38.3%)", pct: 75, barColor: "bg-amber-400", priority: "Medium" },
                  { label: "Low", count: "14 (29.8%)", pct: 55, barColor: "bg-emerald-500", priority: "Low" },
                ].map((p) => (
                  <div
                    key={p.label}
                    onClick={() => {
                      setFilterPriority(p.priority);
                      toast.info(`Filtered for ${p.label} priority issues.`);
                    }}
                    className="space-y-1 text-[11px] p-1 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                    title={`Filter by ${p.label}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{p.label}</span>
                      <span className="font-mono text-muted-foreground font-semibold text-[10px]">{p.count}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", p.barColor)} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Card 3 (4 cols): Top Issue Categories */}
            <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Top Issue Categories
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  6 Categories
                </Badge>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {[
                  { cat: "Procurement", val: "12 (25.5%)", pct: 85, color: "bg-blue-600" },
                  { cat: "Technical", val: "9 (19.1%)", pct: 65, color: "bg-orange-500" },
                  { cat: "Quality", val: "7 (14.9%)", pct: 50, color: "bg-teal-500" },
                  { cat: "Resource", val: "6 (12.8%)", pct: 42, color: "bg-purple-500" },
                  { cat: "Schedule", val: "5 (10.6%)", pct: 35, color: "bg-cyan-500" },
                  { cat: "Others", val: "8 (17.0%)", pct: 58, color: "bg-slate-500" },
                ].map((row) => (
                  <div
                    key={row.cat}
                    onClick={() => {
                      setFilterCategory(row.cat);
                      toast.info(`Filtered for ${row.cat} category.`);
                    }}
                    className="space-y-0.5 text-[10.5px] p-0.5 rounded hover:bg-muted/30 cursor-pointer transition-colors"
                    title={`Filter by ${row.cat}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{row.cat}</span>
                      <span className="font-mono text-muted-foreground text-[9.5px]">{row.val}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", row.color)} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             5. MASTER ISSUE REGISTER TABLE (12 Columns, Full Width)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Issue Register Table
                  <Badge variant="outline" className="text-[10px] font-mono font-bold ml-1">
                    {filteredIssues.length} Issues
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search issue by title, ID, owner..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-8 pl-8 text-xs w-56 sm:w-64 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-8 text-xs gap-1 cursor-pointer"
                    title="Clear filter criteria"
                  >
                    <Filter className="h-3.5 w-3.5 text-slate-500" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsCreateOpen(true)}
                    className="h-8 text-xs gap-1 cursor-pointer bg-[#0B3B7B] hover:bg-[#082B5B] text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Issue
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/40 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      <th className="p-2.5 pl-4 w-28">Issue ID</th>
                      <th className="p-2.5 w-64">Issue Title</th>
                      <th className="p-2.5 w-32">Category</th>
                      <th className="p-2.5 w-24">Priority</th>
                      <th className="p-2.5 w-24">Severity</th>
                      <th className="p-2.5 w-36">Issue Owner</th>
                      <th className="p-2.5 w-28">Status</th>
                      <th className="p-2.5 w-28 font-mono">Due Date</th>
                      <th className="p-2.5 w-20 font-mono">Age</th>
                      <th className="p-2.5 pr-4 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {paginatedIssues.map((item) => (
                      <tr
                        key={item.id}
                        className={cn(
                          "hover:bg-muted/20 transition-colors cursor-pointer",
                          selectedIssue.id === item.id ? "bg-primary/5 font-medium" : "",
                        )}
                        onClick={() => setSelectedIssue(item)}
                      >
                        <td className="p-2.5 pl-3 font-mono font-bold text-primary text-[11px] whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-900 dark:text-white max-w-[240px] truncate">
                          {item.title}
                        </td>
                        <td className="p-2.5">{item.category}</td>
                        <td className="p-2.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] px-1.5 py-0.2",
                              item.priority === "Critical"
                                ? "bg-rose-50 text-rose-700 border-rose-300"
                                : item.priority === "High"
                                ? "bg-orange-50 text-orange-700 border-orange-300"
                                : item.priority === "Medium"
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : "bg-emerald-50 text-emerald-700 border-emerald-300",
                            )}
                          >
                            {item.priority}
                          </Badge>
                        </td>
                        <td className="p-2.5">
                          <span
                            className={cn(
                              "font-medium text-[11px]",
                              item.severity === "Severe"
                                ? "text-rose-600 font-bold"
                                : item.severity === "Major"
                                ? "text-orange-600 font-semibold"
                                : "text-slate-600 dark:text-slate-400",
                            )}
                          >
                            {item.severity}
                          </span>
                        </td>
                        <td className="p-2.5">{item.owner}</td>
                        <td className="p-2.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] px-1.5 py-0.2",
                              item.status === "Open"
                                ? "bg-rose-50 text-rose-700 border-rose-300"
                                : item.status === "Investigating"
                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                : item.status === "Action"
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : item.status === "Resolved"
                                ? "bg-purple-50 text-purple-700 border-purple-300"
                                : "bg-emerald-50 text-emerald-700 border-emerald-300",
                            )}
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                          {item.dueDate}
                        </td>
                        <td className="p-2.5 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {item.age}
                        </td>
                        <td className="p-2.5 pr-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIssue(item);
                              }}
                              className="p-1 hover:text-primary cursor-pointer"
                              title="Inspect details"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIssue(item);
                                setIsEditIssueOpen(true);
                              }}
                              className="p-1 hover:text-primary cursor-pointer"
                              title="Edit issue"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteIssue(item.id);
                              }}
                              className="p-1 hover:text-rose-600 cursor-pointer"
                              title="Delete issue"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="p-3 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredIssues.length)} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredIssues.length)} of {filteredIssues.length} entries
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-1 rounded border hover:bg-muted disabled:opacity-40 cursor-pointer"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "px-2.5 py-1 rounded cursor-pointer",
                        currentPage === page
                          ? "bg-primary text-white font-bold"
                          : "border hover:bg-muted",
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2 py-1 rounded border hover:bg-muted disabled:opacity-40 cursor-pointer"
                  >
                    &gt;
                  </button>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-7 border rounded text-xs px-1 ml-2 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value={5}>5 / page</option>
                    <option value={8}>8 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                  </select>
                </div>
              </div>
            
            </CardContent>
          </Card>

          {/* ====================================================================
             5B. SELECTED ISSUE WORKSPACE & ROOT CAUSE (Full 12 Columns)
             ==================================================================== */}
          <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
            <CardHeader className="p-4 pb-2 border-b border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300 font-mono font-bold text-xs px-2 py-0.5">
                    {selectedIssue.id}
                  </Badge>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedIssue.title}
                  </h3>
                  <Badge
                    className={cn(
                      "text-[10px] font-bold text-white",
                      selectedIssue.priority === "Critical"
                        ? "bg-rose-600"
                        : selectedIssue.priority === "High"
                        ? "bg-orange-500"
                        : selectedIssue.priority === "Medium"
                        ? "bg-amber-500"
                        : "bg-emerald-600",
                    )}
                  >
                    {selectedIssue.priority} Priority
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold",
                      selectedIssue.status === "Open"
                        ? "bg-rose-50 text-rose-700 border-rose-300"
                        : selectedIssue.status === "Investigating"
                        ? "bg-amber-50 text-amber-700 border-amber-300"
                        : selectedIssue.status === "Action"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-emerald-50 text-emerald-700 border-emerald-300",
                    )}
                  >
                    {selectedIssue.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditIssueOpen(true)}
                    className="h-7 text-xs border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-primary/10"
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit Issue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFiveWhyOpen(true)}
                    className="h-7 text-xs border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-primary/10 text-primary font-semibold"
                  >
                    5-Why Analysis →
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsAddActionOpen(true)}
                    className="h-7 text-xs bg-primary text-white font-semibold cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Action
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Overview & Ownership */}
                <div className="p-3.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
                  <span className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground block">
                    Overview & Ownership
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Category</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedIssue.category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Reported By</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedIssue.reportedBy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Issue Owner</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedIssue.owner}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Due Date</span>
                      <span className="font-mono font-bold text-rose-600">{selectedIssue.dueDate}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Related Project Risk</span>
                      <span className="font-semibold text-primary">{selectedIssue.relatedRisk || "None Linked"}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Impact & Severity Analysis */}
                <div className="p-3.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
                  <span className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground block">
                    Impact & Severity Analysis
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                      <span className="text-[9px] text-muted-foreground block">Cost Impact</span>
                      <span className="font-mono font-bold text-rose-600 text-xs">{selectedIssue.costImpact}</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                      <span className="text-[9px] text-muted-foreground block">Schedule</span>
                      <span className="font-mono font-bold text-amber-600 text-xs">{selectedIssue.scheduleImpact}</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-slate-900 border">
                      <span className="text-[9px] text-muted-foreground block">Quality</span>
                      <span className="font-bold text-emerald-600 text-xs">{selectedIssue.qualityImpact}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Severity Level:</span>
                    <span className="font-bold text-rose-600">{selectedIssue.severity} Severity</span>
                  </div>
                </div>

                {/* Column 3: Root Cause & Corrective Action */}
                <div className="p-3.5 rounded-xl border bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[10px] tracking-wider text-muted-foreground block">
                      Corrective Action Plan
                    </span>
                    <span className="font-mono font-bold text-emerald-600 text-xs">{selectedIssue.progress}% Complete</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground block">Root Cause:</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                      {selectedIssue.rootCause}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-muted-foreground block">Corrective Action:</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                      {selectedIssue.correctiveAction}
                    </p>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedIssue.progress}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================================
             6. BOTTOM 4-CARD ANALYTICS ROW
             ==================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {/* Card 1: Issues Trend (Last 6 Weeks) */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Issues Trend (Last 6 Weeks)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-center gap-4 text-[10px] font-semibold">
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-blue-600" /> Opened</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Resolved</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-purple-600" /> Closed</span>
                </div>

                <div className="h-36 w-full">
                  <svg className="h-full w-full" viewBox="0 0 280 130">
                    <line x1="25" y1="20" x2="270" y2="20" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="50" x2="270" y2="50" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="80" x2="270" y2="80" stroke="#e2e8f0" strokeDasharray="2 2" />
                    <line x1="25" y1="110" x2="270" y2="110" stroke="#e2e8f0" strokeDasharray="2 2" />

                    <text x="5" y="24" fontSize="7" fill="#94a3b8">30</text>
                    <text x="5" y="54" fontSize="7" fill="#94a3b8">20</text>
                    <text x="5" y="84" fontSize="7" fill="#94a3b8">10</text>
                    <text x="10" y="114" fontSize="7" fill="#94a3b8">0</text>

                    {/* Opened Line (Blue) */}
                    <polyline fill="none" stroke="#2563eb" strokeWidth="1.5" points="35,65 75,58 115,48 155,62 195,68 245,55" />
                    {/* Resolved Line (Green) */}
                    <polyline fill="none" stroke="#10b981" strokeWidth="1.5" points="35,80 75,76 115,70 155,66 195,60 245,58" />
                    {/* Closed Line (Purple) */}
                    <polyline fill="none" stroke="#9333ea" strokeWidth="1.5" points="35,95 75,90 115,86 155,80 195,74 245,70" />

                    <circle cx="245" cy="55" r="2.5" fill="#2563eb" />
                    <circle cx="245" cy="58" r="2.5" fill="#10b981" />
                    <circle cx="245" cy="70" r="2.5" fill="#9333ea" />

                    <text x="28" y="125" fontSize="7.5" fill="#64748b">Wk 31</text>
                    <text x="68" y="125" fontSize="7.5" fill="#64748b">Wk 32</text>
                    <text x="108" y="125" fontSize="7.5" fill="#64748b">Wk 33</text>
                    <text x="148" y="125" fontSize="7.5" fill="#64748b">Wk 34</text>
                    <text x="188" y="125" fontSize="7.5" fill="#64748b">Wk 35</text>
                    <text x="238" y="125" fontSize="7.5" fill="#64748b">Wk 36</text>
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Issue Aging */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Issue Aging
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="91" />
                    <circle cx="50" cy="50" r="38" stroke="#eab308" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="152" />
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="188" />
                    <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="218" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{issues.length}</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {[
                    { range: "0 - 3 Days", count: "18 (38.3%)", color: "bg-rose-500" },
                    { range: "4 - 7 Days", count: "12 (25.5%)", color: "bg-orange-500" },
                    { range: "8 - 14 Days", count: "7 (14.9%)", color: "bg-yellow-500" },
                    { range: "15 - 30 Days", count: "6 (12.8%)", color: "bg-emerald-500" },
                    { range: "> 30 Days", count: "4 (8.5%)", color: "bg-purple-500" },
                  ].map((a) => (
                    <div
                      key={a.range}
                      onClick={() => toast.info(`Filtered for ${a.range} aging band.`)}
                      className="flex justify-between items-center p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      title={`Filter by ${a.range}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <div className={cn("h-2 w-2 rounded-full", a.color)} /> {a.range}
                      </span>
                      <span className="font-mono text-muted-foreground font-semibold">{a.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 3: SLA Compliance */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  SLA Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#f97316" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="163" />
                    <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="192" />
                    <circle cx="50" cy="50" r="38" stroke="#94a3b8" strokeWidth="12" fill="transparent" strokeDasharray="238.76" strokeDashoffset="227" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">41</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-semibold">Total Actions</span>
                  </div>
                </div>

                <div className="space-y-1 text-[10px]">
                  {[
                    { label: "On Time", count: "28 (68.3%)", color: "bg-emerald-500", filter: null },
                    { label: "Due Today", count: "5 (12.2%)", color: "bg-orange-500", filter: null },
                    { label: "Overdue", count: "6 (14.6%)", color: "bg-rose-500", filter: "overdue" },
                    { label: "No SLA", count: "2 (4.9%)", color: "bg-slate-400", filter: null },
                  ].map((sla) => (
                    <div
                      key={sla.label}
                      onClick={() => {
                        if (sla.filter) setActiveKpiFilter(sla.filter);
                        toast.info(`Filtered for SLA status: ${sla.label}`);
                      }}
                      className="flex justify-between items-center p-1 rounded hover:bg-muted/40 cursor-pointer transition-colors"
                      title={`Filter by ${sla.label}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <div className={cn("h-2 w-2 rounded-full", sla.color)} /> {sla.label}
                      </span>
                      <span className={cn("font-mono font-semibold", sla.label === "Overdue" ? "text-rose-600 font-bold" : "text-muted-foreground")}>
                        {sla.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Top Issues by Cost Impact */}
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col">
              <CardHeader className="p-3 pb-1 border-b border-border/40 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Top Issues by Cost Impact
                </CardTitle>
                <span className="text-[10px] text-muted-foreground font-semibold">Amount (₹)</span>
              </CardHeader>
              <CardContent className="p-3 text-xs space-y-2">
                {[
                  { id: "I-001", title: "Controller delivery delayed", amt: "4.50 L" },
                  { id: "I-009", title: "Cable harness breakdown", amt: "3.10 L" },
                  { id: "I-016", title: "Site civil excavation hit utility", amt: "2.75 L" },
                  { id: "I-003", title: "Material rejection in QC", amt: "2.20 L" },
                  { id: "I-010", title: "Transformer earthing failure", amt: "1.80 L" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      const found = issues.find((i) => i.id === item.id);
                      if (found) setSelectedIssue(found);
                      toast.info(`Selected issue ${item.id}: ${item.title}`);
                    }}
                    className="flex items-center justify-between py-1 text-[11px] hover:bg-muted/30 p-1 rounded cursor-pointer transition-colors"
                    title="Inspect issue"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                      {item.title}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0 ml-1">
                      {item.amt}
                    </span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCostImpactModalOpen(true)}
                  className="text-[11px] text-primary font-semibold hover:underline cursor-pointer block text-left pt-2 border-t border-border/40"
                >
                  View Full Report →
                </button>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             7. FOOTER STATUS & SHORTCUTS BAR
             ==================================================================== */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-muted-foreground border-t border-border/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Connection
              </span>
              <span>© 2026 Magnertia ERP. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span>Quick Views:</span>
              <button
                onClick={() => {
                  setActiveKpiFilter(null);
                  toast.info("Showing full register");
                }}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                R Register
              </button>
              <button
                onClick={() => setIsSlaModalOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                M Matrix
              </button>
              <button
                onClick={() => setIsFiveWhyOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                A Analysis
              </button>
              <button
                onClick={() => setIsCostImpactModalOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border hover:bg-muted cursor-pointer"
              >
                H Heatmap
              </button>
            </div>
          </div>

        {/* ====================================================================
           MODALS
           ==================================================================== */}

        {/* 1. Create Project Issue Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Create Project Issue (● OPEN)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Log a concrete problem that has occurred and assign it for corrective resolution.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateIssueSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Project:</label>
                  <Input value="PRJ-2026-0195" readOnly className="h-8 text-xs font-mono bg-muted" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Procurement">Procurement</option>
                    <option value="Technical">Technical</option>
                    <option value="Quality">Quality</option>
                    <option value="Resource">Resource</option>
                    <option value="Customer">Customer</option>
                    <option value="Logistics">Logistics</option>
                    <option value="IT / System">IT / System</option>
                    <option value="Schedule">Schedule</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Issue Title:</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Controller delivery delayed"
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Priority:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Critical">🔴 Critical (Immediate Action)</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Severity:</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Severe">Severe</option>
                    <option value="Major">Major</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Issue Owner:</label>
                  <Input value={newOwner} onChange={(e) => setNewOwner(e.target.value)} className="h-8 text-xs" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Resolution Due Date:</label>
                  <Input value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Estimated Cost Impact:</label>
                  <Input value={newCostImpact} onChange={(e) => setNewCostImpact(e.target.value)} className="h-8 text-xs font-mono" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Schedule Delay:</label>
                  <Input value={newScheduleImpact} onChange={(e) => setNewScheduleImpact(e.target.value)} className="h-8 text-xs font-mono" />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Detailed Problem Statement:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe problem, symptom, and immediate operational impact..."
                  className="w-full h-16 p-2 rounded-md border border-input text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Register Issue
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2. Edit Project Issue Modal */}
        <Dialog open={isEditIssueOpen} onOpenChange={setIsEditIssueOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                Edit Issue: {selectedIssue.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update status, assignment, root cause, and corrective action progress.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveEditIssue} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Issue Title:</label>
                <Input
                  value={selectedIssue.title}
                  onChange={(e) => setSelectedIssue({ ...selectedIssue, title: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Status:</label>
                  <select
                    value={selectedIssue.status}
                    onChange={(e) => setSelectedIssue({ ...selectedIssue, status: e.target.value as any })}
                    className="h-8 w-full text-xs font-medium rounded-md border border-input bg-slate-50 dark:bg-slate-800 px-2"
                  >
                    <option value="Open">Open</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Action">Action</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Owner:</label>
                  <Input
                    value={selectedIssue.owner}
                    onChange={(e) => setSelectedIssue({ ...selectedIssue, owner: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Progress (%):</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={selectedIssue.progress}
                    onChange={(e) => setSelectedIssue({ ...selectedIssue, progress: Number(e.target.value) })}
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Due Date:</label>
                  <Input
                    value={selectedIssue.dueDate}
                    onChange={(e) => setSelectedIssue({ ...selectedIssue, dueDate: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Corrective Action:</label>
                <textarea
                  value={selectedIssue.correctiveAction}
                  onChange={(e) => setSelectedIssue({ ...selectedIssue, correctiveAction: e.target.value })}
                  className="w-full h-16 p-2 rounded-md border border-input text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsEditIssueOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 3. Root Cause 5-Why Analysis Modal */}
        <Dialog open={isFiveWhyOpen} onOpenChange={setIsFiveWhyOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                <HelpCircle className="h-4 w-4" />
                Root Cause 5-Why Analysis — {selectedIssue.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Drill down from observed problem to foundational root cause.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white">
                Problem: {selectedIssue.title}
              </div>
              {[
                { why: "Why 1", answer: "Supplier could not complete production on time." },
                { why: "Why 2", answer: "Supplier factory production capacity was severely constrained." },
                { why: "Why 3", answer: "Multiple automotive customer orders were prioritized simultaneously." },
                { why: "Why 4", answer: "Dedicated production capacity reservation was not locked in advance." },
                { why: "Why 5", answer: "Procurement risk was not identified and contracted early enough." },
              ].map((item, idx) => (
                <div key={idx} className="p-2 rounded border space-y-0.5">
                  <span className="font-bold text-primary text-[10.5px]">{item.why}:</span>
                  <p className="text-slate-700 dark:text-slate-300">{item.answer}</p>
                </div>
              ))}
              <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 font-bold text-emerald-800 dark:text-emerald-300">
                Root Cause Conclusion: Insufficient supplier capacity reservation planning during procurement baseline.
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsFiveWhyOpen(false)}>Close Analysis</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Add Corrective Action Modal */}
        <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add Corrective Action — {selectedIssue.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Assign a concrete action to resolve the issue and protect project milestones.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Corrective Action:</label>
                <Input defaultValue="Activate Alternate Supplier & Place Backup Order" className="h-8 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Action Owner:</label>
                  <Input defaultValue={selectedIssue.owner} className="h-8 text-xs" />
                </div>
                <div>
                  <label className="font-bold block mb-1">Target Date:</label>
                  <Input defaultValue="08-Sep-2026" className="h-8 text-xs font-mono" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Expected Deliverable:</label>
                <Input defaultValue="Restore controller supply without delaying M-004" className="h-8 text-xs" />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsAddActionOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsAddActionOpen(false);
                  toast.success(`Corrective action logged for ${selectedIssue.id}`);
                }}
                className="bg-primary text-white font-semibold"
              >
                Save Action
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. AI Issue Intelligence Modal */}
        <Dialog open={isAiIssueOpen} onOpenChange={setIsAiIssueOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                AI Issue Intelligence & Correlation Engine
              </DialogTitle>
              <DialogDescription className="text-xs">
                Pattern recognition linking open issues with supplier performance, engineering hours, and budget.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200">
                <span className="font-bold text-rose-700 block mb-1">🔴 Critical Milestone Threat:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">
                  I-001 (Controller Delivery Delay) directly threatens M-004 Procurement Complete. If not resolved before Sep 08, production lines will halt for 12 working days.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200">
                <span className="font-bold text-amber-700 block mb-1">🟠 Systemic Issue Pattern:</span>
                <p className="text-[11px] text-slate-800 dark:text-slate-200">
                  Three procurement issues share supplier-capacity constraints. Recommendation: introduce mandatory pre-award capacity audits for all critical suppliers.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAiIssueOpen(false)}>Close Intelligence</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. SLA Compliance Modal */}
        <Dialog open={isSlaModalOpen} onOpenChange={setIsSlaModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                <Clock className="h-4 w-4" />
                SLA Compliance & Action Aging Audit
              </DialogTitle>
              <DialogDescription className="text-xs">
                Performance breakdown of corrective actions against formal project turnaround SLAs.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
                <div>
                  <span className="text-[10px] text-muted-foreground block">On-Time Turnaround</span>
                  <span className="font-mono font-bold text-emerald-600 text-base">68.3%</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Overdue Breaches</span>
                  <span className="font-mono font-bold text-rose-600 text-base">6 Actions</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsSlaModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 7. Cost Impact Summary Modal */}
        <Dialog open={isCostImpactModalOpen} onOpenChange={setIsCostImpactModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-blue-600">
                <DollarSign className="h-4 w-4" />
                Project Issues Cost Impact Register
              </DialogTitle>
              <DialogDescription className="text-xs">
                Incurred rework, scrap, and expediting costs attributed to project issues.
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y border rounded-lg p-2 text-xs">
              {issues.slice(0, 10).map((i) => (
                <div key={i.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-primary mr-2">{i.id}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{i.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold block">{i.costImpact}</span>
                    <span className="text-[10px] text-muted-foreground">{i.category} • {i.priority}</span>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsCostImpactModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 8. Issue History Modal */}
        <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Issue Audit Trail — {selectedIssue.id}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Chronological log of status transitions and corrective action updates.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs divide-y">
              <div className="pt-2">
                <span className="font-mono font-bold text-primary block">Status Changed to Action</span>
                <span className="text-muted-foreground text-[10px]">03 Sep 2026 14:10 by {selectedIssue.owner}</span>
              </div>
              <div className="pt-2">
                <span className="font-mono font-bold block">Root Cause 5-Why Completed</span>
                <span className="text-muted-foreground text-[10px]">02 Sep 2026 11:30 by QA Team</span>
              </div>
              <div className="pt-2">
                <span className="font-mono font-bold block">Issue Logged (Open)</span>
                <span className="text-muted-foreground text-[10px]">01 Sep 2026 09:15 by {selectedIssue.reportedBy}</span>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsHistoryModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 9. Lessons Learned Modal */}
        <Dialog open={isLessonsLearnedOpen} onOpenChange={setIsLessonsLearnedOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                <BookOpen className="h-4 w-4" />
                Capture Lessons Learned
              </DialogTitle>
              <DialogDescription className="text-xs">
                Archive institutional knowledge to prevent problem recurrence in future projects.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Issue Reference:</label>
                <Input value={`${selectedIssue.id}: ${selectedIssue.title}`} readOnly className="h-8 text-xs bg-muted" />
              </div>
              <div>
                <label className="font-bold block mb-1">Process Improvement / Standard Update:</label>
                <textarea
                  defaultValue="Mandate capacity reservation contracts with tier-1 component vendors during procurement kickoff."
                  className="w-full h-16 p-2 rounded-md border border-input text-xs bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsLessonsLearnedOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsLessonsLearnedOpen(false);
                  toast.success("Lesson learned published to PMO knowledge base.");
                }}
                className="bg-primary text-white font-semibold"
              >
                Publish Lesson
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default IssueManagementFormPage;
